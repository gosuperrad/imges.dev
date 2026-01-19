import { NextRequest, NextResponse } from "next/server";
import { createShortUrl } from "@/lib/shortener";

/**
 * POST /api/shorten
 * Create a short URL for an image configuration
 * 
 * Request body:
 * {
 *   url: string;          // The full image URL path (e.g., "/800x600/3b82f6/ffffff?text=Hello")
 *   customCode?: string;  // Optional custom short code
 * }
 * 
 * Response:
 * {
 *   code: string;      // The short code (e.g., "blue-cat")
 *   shortUrl: string;  // The short URL path (e.g., "/s/blue-cat")
 *   fullUrl: string;   // The original full URL
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, customCode } = body;

    // Validate required fields
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'url' field" },
        { status: 400 }
      );
    }

    // Validate URL format (must be a valid imges.dev path)
    if (!url.startsWith("/")) {
      return NextResponse.json(
        { error: "URL must be a valid path starting with '/'" },
        { status: 400 }
      );
    }

    // Basic validation: URL should match image generation pattern
    // Pattern: /WIDTHxHEIGHT or /WIDTHxHEIGHT@SCALE or /WIDTHxHEIGHT.FORMAT etc.
    const pathPattern = /^\/\d+x\d+/;
    if (!pathPattern.test(url)) {
      return NextResponse.json(
        { error: "URL must be a valid image generation path (e.g., /800x600/...)" },
        { status: 400 }
      );
    }

    // Validate custom code if provided
    if (customCode !== undefined) {
      if (typeof customCode !== "string") {
        return NextResponse.json(
          { error: "Custom code must be a string" },
          { status: 400 }
        );
      }

      // Custom code validation: lowercase alphanumeric and hyphens only
      const codePattern = /^[a-z0-9-]+$/;
      if (!codePattern.test(customCode)) {
        return NextResponse.json(
          { error: "Custom code must contain only lowercase letters, numbers, and hyphens" },
          { status: 400 }
        );
      }

      // Length validation
      if (customCode.length < 3 || customCode.length > 50) {
        return NextResponse.json(
          { error: "Custom code must be between 3 and 50 characters" },
          { status: 400 }
        );
      }
    }

    // Create the short URL
    const result = await createShortUrl(url, customCode);
    const { code } = result;

    // Build response
    const shortUrl = `/s/${code}`;
    const host = request.headers.get("host") || "imges.dev";
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const fullShortUrl = `${protocol}://${host}${shortUrl}`;

    return NextResponse.json(
      {
        code,
        shortUrl,
        fullUrl: url,
        absoluteUrl: fullShortUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating short URL:", error);

    // Handle specific errors from shortener
    if (error instanceof Error) {
      if (error.message.includes("already taken") || error.message.includes("Custom code")) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 } // Conflict
        );
      }

      if (error.message.includes("No available")) {
        return NextResponse.json(
          { error: "Unable to generate unique short code. Please try a custom code." },
          { status: 503 } // Service Unavailable
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create short URL" },
      { status: 500 }
    );
  }
}
