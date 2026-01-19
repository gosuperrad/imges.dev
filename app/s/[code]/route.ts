import { NextRequest, NextResponse } from "next/server";
import { getShortUrl } from "@/lib/shortener";

/**
 * GET /s/[code]
 * Redirect to the full image URL for a short code
 * 
 * Example: /s/blue-cat → /800x600/3b82f6/ffffff?text=Hello
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Validate code format
    if (!code || typeof code !== "string") {
      return new NextResponse("Invalid short code", { status: 400 });
    }

    // Get the original URL
    const url = await getShortUrl(code);

    if (!url) {
      return new NextResponse("Short URL not found", { status: 404 });
    }

    // Redirect to the full image URL
    // Use 302 (temporary redirect) to ensure analytics tracking on each hit
    return NextResponse.redirect(new URL(url, request.url), 302);
  } catch (error) {
    const { code } = await params;
    console.error(`Error redirecting short URL ${code}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
