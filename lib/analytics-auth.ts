/**
 * Analytics Dashboard Authentication
 * 
 * Simple token-based authentication for protecting the analytics dashboard.
 * Set ANALYTICS_TOKEN in Railway environment variables.
 */

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ANALYTICS_COOKIE_NAME = "analytics_auth";
const ANALYTICS_TOKEN_ENV = "ANALYTICS_TOKEN";

/**
 * Check if analytics access is authenticated
 * Returns true if authenticated, false otherwise
 */
export async function isAnalyticsAuthenticated(): Promise<boolean> {
  const token = process.env[ANALYTICS_TOKEN_ENV];
  
  // If no token is set in environment, analytics is public (backward compatible)
  if (!token) {
    return true;
  }

  const cookieStore = await cookies();
  const userToken = cookieStore.get(ANALYTICS_COOKIE_NAME)?.value;

  return userToken === token;
}

/**
 * Verify analytics authentication in API route or server component
 * Throws an error or returns a redirect response if not authenticated
 */
export async function requireAnalyticsAuth(): Promise<{ authenticated: true } | NextResponse> {
  const isAuth = await isAnalyticsAuthenticated();
  
  if (!isAuth) {
    // Return redirect response
    return NextResponse.redirect(new URL("/analytics/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
  }

  return { authenticated: true };
}

/**
 * Handle analytics login
 * Validates token and sets cookie
 */
export async function handleAnalyticsLogin(token: string): Promise<{ success: boolean; error?: string }> {
  const correctToken = process.env[ANALYTICS_TOKEN_ENV];

  if (!correctToken) {
    return { success: false, error: "Analytics authentication not configured" };
  }

  if (token !== correctToken) {
    return { success: false, error: "Invalid access token" };
  }

  // Set cookie (expires in 30 days)
  const cookieStore = await cookies();
  cookieStore.set(ANALYTICS_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return { success: true };
}

/**
 * Handle analytics logout
 */
export async function handleAnalyticsLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ANALYTICS_COOKIE_NAME);
}
