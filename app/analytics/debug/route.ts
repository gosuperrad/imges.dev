import { NextResponse } from "next/server";

export async function GET() {
  const hasToken = !!process.env.ANALYTICS_TOKEN;
  const tokenLength = process.env.ANALYTICS_TOKEN?.length || 0;
  
  return NextResponse.json({
    hasToken,
    tokenLength,
    // Don't show the actual token for security
    hint: hasToken ? `Set (${tokenLength} chars)` : "Not set",
  });
}
