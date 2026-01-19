import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["canvas"],
  
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // Prevent clickjacking - only allow same origin
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Prevent MIME type sniffing
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin", // Control referrer information
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()", // Disable unnecessary browser features
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Note: 'unsafe-inline' and 'unsafe-eval' weaken CSP protection but are required
              // for Next.js to function (dev mode & production hydration). For stronger security,
              // consider implementing nonce-based CSP in the future.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob:", // Allow images from any HTTPS source (for Twemoji CDN)
              "connect-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // Hide analytics from search engines
        source: "/analytics/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        // SEO-friendly headers for public pages
        source: "/((?!analytics|api).*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

