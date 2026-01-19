import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Rate Limiter
 * 
 * Simple in-memory rate limiter for image generation and login endpoints.
 * 
 * IMPORTANT LIMITATION: This implementation uses in-memory storage (Map),
 * which means each server instance maintains its own separate rate limit counters.
 * In serverless or multi-instance deployments, users could bypass limits by hitting
 * different instances. For production with multiple instances, migrate to a distributed
 * solution like Redis, Upstash, or Vercel KV.
 * 
 * Current deployment: Railway (single instance) - this implementation is sufficient.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimiter = new Map<string, RateLimitRecord>();

// Configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // requests per window for images
const LOGIN_RATE_LIMIT_MAX_REQUESTS = 5; // requests per window for login (stricter)
const CLEANUP_PROBABILITY = 0.01; // 1% chance to cleanup on each request

/**
 * Get client identifier from request
 * Uses multiple headers with fallback for better reliability and to prevent spoofing
 */
function getClientId(request: NextRequest): string {
  // Try multiple headers in order of trustworthiness
  const realIp = request.headers.get("x-real-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");
  
  // Use X-Real-IP if available (more trustworthy), otherwise first IP in X-Forwarded-For
  const ip = realIp?.trim() || forwardedFor?.split(",")[0]?.trim() || "unknown";
  
  return ip;
}

/**
 * Check if request should be rate limited
 */
function checkRateLimit(clientId: string, maxRequests: number = RATE_LIMIT_MAX_REQUESTS): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimiter.get(clientId);

  if (record && now < record.resetTime) {
    if (record.count >= maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return { allowed: false, retryAfter };
    }
    record.count++;
    return { allowed: true };
  } else {
    // Create new record or reset expired one
    rateLimiter.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }
}

/**
 * Cleanup expired rate limit records
 * Called probabilistically to avoid performance impact
 */
function cleanupExpiredRecords(): void {
  const now = Date.now();
  for (const [clientId, record] of rateLimiter.entries()) {
    if (now >= record.resetTime) {
      rateLimiter.delete(clientId);
    }
  }
}

/**
 * Check if path is an image generation request
 */
function isImageRequest(pathname: string): boolean {
  // Match: /123x456, /800x600, /300, etc.
  // But exclude: /docs, /examples, /analytics, /api, /_next, etc.
  const staticPaths = ["/docs", "/examples", "/analytics", "/api", "/_next", "/privacy"];
  
  if (staticPaths.some(path => pathname.startsWith(path))) {
    return false;
  }

  // Match dimension patterns: /800x600 or /300 or with extensions
  return /^\/\d+/.test(pathname);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const clientId = getClientId(request);

  // Rate limit login endpoint more strictly (prevent brute force)
  if (pathname === "/analytics/login/api") {
    const { allowed, retryAfter } = checkRateLimit(`login:${clientId}`, LOGIN_RATE_LIMIT_MAX_REQUESTS);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Too Many Login Attempts",
          message: "Please wait before trying again.",
          retryAfter: retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
          },
        }
      );
    }
  }

  // Rate limit image generation requests
  if (isImageRequest(pathname)) {
    const { allowed, retryAfter } = checkRateLimit(clientId);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Rate Limit Exceeded",
          message: "Too many requests. Please slow down.",
          retryAfter: retryAfter,
          limit: RATE_LIMIT_MAX_REQUESTS,
          window: `${RATE_LIMIT_WINDOW_MS / 1000} seconds`,
          docs: "https://imges.dev/docs",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.floor((Date.now() + (retryAfter || 0) * 1000) / 1000)),
          },
        }
      );
    }

    // Probabilistically cleanup expired records
    if (Math.random() < CLEANUP_PROBABILITY) {
      cleanupExpiredRecords();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
