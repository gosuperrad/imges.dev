import { NextRequest, NextResponse } from "next/server";
import { createCanvas } from "canvas";
import sharp from "sharp";

export async function GET(request: NextRequest) {
  try {
    const width = 1200;
    const height = 630;

    // Create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Create gradient background (blue to purple)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#3b82f6"); // blue-500
    gradient.addColorStop(1, "#8b5cf6"); // violet-500
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle pattern overlay
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < width; i += 40) {
      for (let j = 0; j < height; j += 40) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(i, j, 20, 20);
      }
    }
    ctx.globalAlpha = 1;

    // Add main title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 120px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    const title = "imges.dev";
    ctx.fillText(title, width / 2, height / 2 - 60);

    // Add subtitle
    ctx.font = "48px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText("Custom Placeholder Images", width / 2, height / 2 + 50);

    // Add tagline
    ctx.font = "32px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText("Fast • Simple • Powerful", width / 2, height / 2 + 120);

    // Add example usage at bottom
    ctx.font = "24px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.textAlign = "left";
    ctx.fillText("imges.dev/800x600/3b82f6/ffffff?text=Hello", 60, height - 60);

    // Convert to buffer
    const buffer = canvas.toBuffer("image/png");

    // Optimize with sharp
    const optimizedBuffer = await sharp(buffer)
      .png({ quality: 90, compressionLevel: 9 })
      .toBuffer();

    return new NextResponse(optimizedBuffer as any, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new NextResponse("Error generating image", { status: 500 });
  }
}
