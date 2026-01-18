import { NextRequest, NextResponse } from "next/server";
import { createCanvas, CanvasRenderingContext2D, loadImage } from "canvas";
import sharp from "sharp";
import { parse as parseEmoji } from "twemoji-parser";

interface ImageParams {
  width: number;
  height: number;
  scale: number; // For @2x, @3x support
  bgColor: string;
  bgColor2?: string; // For gradients
  fgColor: string;
  format: "png" | "jpeg" | "webp";
}

interface RenderOptions {
  text: string;
  fontSize?: number;
  fontWeight: string;
  fontStyle: string;
  align: "top" | "center" | "bottom" | "custom";
  customY?: number;
  border?: number;
  borderColor?: string;
  blur?: number;
}

function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 20); // 60-80%
  const lightness = 50 + Math.floor(Math.random() * 20); // 50-70%
  return hslToHex(hue, saturation, lightness);
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `${f(0)}${f(8)}${f(4)}`;
}

function parseParams(params: string[]): ImageParams | null {
  const defaults = {
    bgColor: "cccccc",
    fgColor: "333333",
    format: "webp" as const,
    scale: 1,
  };

  if (params.length === 0) {
    return null;
  }

  let dimensionStr = params[0];
  let scale = 1;
  let format: "png" | "jpeg" | "webp" = defaults.format;

  // Check for @2x, @3x suffix
  const retinaMatch = dimensionStr.match(/^(\d+x\d+)@(\d)x$/);
  if (retinaMatch) {
    dimensionStr = retinaMatch[1];
    scale = parseInt(retinaMatch[2]);
    if (scale < 1 || scale > 3) scale = 1;
  }

  // Check for format extension
  const formatMatch = dimensionStr.match(/^(\d+x\d+)\.(png|jpe?g|webp)$/i);
  if (formatMatch) {
    dimensionStr = formatMatch[1];
    const ext = formatMatch[2].toLowerCase();
    format = ext === "jpg" ? "jpeg" : (ext as "png" | "jpeg" | "webp");
  }

  // Parse dimensions (e.g., "640x360")
  const dimensionMatch = dimensionStr.match(/^(\d+)x(\d+)$/);
  if (!dimensionMatch) {
    return null;
  }

  const width = parseInt(dimensionMatch[1]);
  const height = parseInt(dimensionMatch[2]);

  // Validate dimensions
  if (width < 1 || width > 4000 || height < 1 || height > 4000) {
    return null;
  }

  // Parse background color (optional, supports "random")
  let bgColor = params[1] || defaults.bgColor;
  let bgColor2: string | undefined;

  if (bgColor === "random") {
    bgColor = generateRandomColor();
  }

  // Check for gradient (color1-color2)
  const gradientMatch = bgColor.match(/^([^-]+)-(.+)$/);
  if (gradientMatch) {
    bgColor = gradientMatch[1];
    bgColor2 = gradientMatch[2];
    if (bgColor2 === "random") {
      bgColor2 = generateRandomColor();
    }
  }

  // Parse foreground color (optional, supports "random")
  let fgColor = params[2] || defaults.fgColor;
  if (fgColor === "random") {
    fgColor = generateRandomColor();
  }

  return {
    width,
    height,
    scale,
    bgColor: bgColor.replace(/^#/, ""),
    bgColor2: bgColor2?.replace(/^#/, ""),
    fgColor: fgColor.replace(/^#/, ""),
    format,
  };
}

function normalizeColor(color: string): string {
  // Remove # if present
  color = color.replace(/^#/, "");

  // Handle 3-digit hex
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }

  return `#${color}`;
}

function drawGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color1: string,
  color2: string
) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, normalizeColor(color1));
  gradient.addColorStop(1, normalizeColor(color2));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function applyBlur(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number
) {
  // Simple box blur implementation
  (ctx as any).filter = `blur(${amount}px)`;
  const imageData = ctx.getImageData(0, 0, width, height);
  ctx.putImageData(imageData, 0, 0);
  (ctx as any).filter = "none";
}

async function drawTextWithEmojis(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number
) {
  // Parse emojis in the text
  const emojis = parseEmoji(text);
  
  if (emojis.length === 0) {
    // No emojis, draw text normally
    ctx.fillText(text, x, y);
    return;
  }

  // Build segments of text and emoji positions
  let segments: Array<{ type: 'text' | 'emoji', content: string, url?: string }> = [];
  let lastIndex = 0;

  emojis.forEach((emoji) => {
    // Add text before emoji
    if (emoji.indices[0] > lastIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, emoji.indices[0])
      });
    }
    
    // Add emoji - convert SVG URL to PNG URL (72x72 size for better quality)
    // Twemoji CDN format: https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/{codepoint}.png
    const codepoint = emoji.url.split('/').pop()?.replace('.svg', '');
    const pngUrl = `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/${codepoint}.png`;
    
    segments.push({
      type: 'emoji',
      content: emoji.text,
      url: pngUrl
    });
    
    lastIndex = emoji.indices[1];
  });

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }

  // Measure and draw segments
  let currentX = x;
  const emojiSize = fontSize * 1.1; // Slightly larger than text
  
  // Calculate total width for centering
  let totalWidth = 0;
  for (const segment of segments) {
    if (segment.type === 'text') {
      totalWidth += ctx.measureText(segment.content).width;
    } else {
      totalWidth += emojiSize;
    }
  }

  // Adjust starting X for center alignment
  if (ctx.textAlign === 'center') {
    currentX = x - totalWidth / 2;
  }

  // Draw each segment
  for (const segment of segments) {
    if (segment.type === 'text') {
      const originalAlign = ctx.textAlign;
      ctx.textAlign = 'left';
      ctx.fillText(segment.content, currentX, y);
      ctx.textAlign = originalAlign;
      currentX += ctx.measureText(segment.content).width;
    } else if (segment.url) {
      try {
        // Load and draw emoji image
        const emojiImage = await loadImage(segment.url);
        const emojiY = y - emojiSize / 2;
        ctx.drawImage(emojiImage, currentX, emojiY, emojiSize, emojiSize);
        currentX += emojiSize;
      } catch (error) {
        console.error('Failed to load emoji:', segment.url, error);
        // Fallback to text if image fails to load
        const originalAlign = ctx.textAlign;
        ctx.textAlign = 'left';
        ctx.fillText(segment.content, currentX, y);
        ctx.textAlign = originalAlign;
        currentX += ctx.measureText(segment.content).width;
      }
    }
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ params: string[] }> }
) {
  const { params: urlParams } = await context.params;

  const imageParams = parseParams(urlParams);

  if (!imageParams) {
    return new NextResponse(
      "Invalid image parameters. Format: /[width]x[height]/[bg-color]/[fg-color]",
      {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      }
    );
  }

  const searchParams = request.nextUrl.searchParams;

  // Parse query parameters
  const text = searchParams.get("text") || `${imageParams.width} × ${imageParams.height}`;
  const font = searchParams.get("font") || "sans-serif";
  const fontWeight = searchParams.get("weight") || "normal";
  const fontStyle = searchParams.get("style") || "normal";
  const align = (searchParams.get("align") as "top" | "center" | "bottom" | "custom") || "center";
  const customY = searchParams.get("y") ? parseInt(searchParams.get("y")!) : undefined;
  const border = searchParams.get("border") ? parseInt(searchParams.get("border")!) : undefined;
  const borderColor = searchParams.get("borderColor") || imageParams.fgColor;
  const blur = searchParams.get("blur") ? parseInt(searchParams.get("blur")!) : undefined;
  const quality = searchParams.get("quality") ? parseInt(searchParams.get("quality")!) : 90;
  const format = (searchParams.get("format") as "png" | "jpeg" | "webp") || imageParams.format;
  
  // Font size - can be specified or auto-calculated
  let fontSize: number | undefined;
  const fontSizeParam = searchParams.get("size");
  if (fontSizeParam) {
    fontSize = parseInt(fontSizeParam);
  }

  try {
    // Calculate actual dimensions with scale
    const actualWidth = imageParams.width * imageParams.scale;
    const actualHeight = imageParams.height * imageParams.scale;

    // Create canvas
    const canvas = createCanvas(actualWidth, actualHeight);
    const ctx = canvas.getContext("2d");

    // Fill background (gradient or solid)
    if (imageParams.bgColor2) {
      drawGradient(ctx, actualWidth, actualHeight, imageParams.bgColor, imageParams.bgColor2);
    } else {
      ctx.fillStyle = normalizeColor(imageParams.bgColor);
      ctx.fillRect(0, 0, actualWidth, actualHeight);
    }

    // Apply blur effect to background if specified
    if (blur && blur > 0) {
      applyBlur(ctx, actualWidth, actualHeight, blur * imageParams.scale);
    }

    // Draw border if specified
    if (border && border > 0) {
      const scaledBorder = border * imageParams.scale;
      ctx.strokeStyle = normalizeColor(borderColor);
      ctx.lineWidth = scaledBorder;
      ctx.strokeRect(
        scaledBorder / 2,
        scaledBorder / 2,
        actualWidth - scaledBorder,
        actualHeight - scaledBorder
      );
    }

    // Calculate font size if not specified
    if (!fontSize) {
      fontSize = Math.min(actualWidth, actualHeight) / 10;
    } else {
      fontSize = fontSize * imageParams.scale;
    }

    // Draw text (supports multiple lines with \n)
    const lines = text.split("\\n");
    ctx.fillStyle = normalizeColor(imageParams.fgColor);
    ctx.textAlign = "center";
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${font}`;

    // Calculate Y position based on alignment
    let baseY: number;
    if (align === "custom" && customY !== undefined) {
      baseY = customY * imageParams.scale;
    } else if (align === "top") {
      baseY = fontSize * 1.5;
    } else if (align === "bottom") {
      baseY = actualHeight - fontSize * (lines.length + 0.5);
    } else {
      // center
      baseY = actualHeight / 2 - ((lines.length - 1) * fontSize * 1.2) / 2;
    }

    ctx.textBaseline = "middle";

    // Draw each line with emoji support
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      const y = baseY + index * fontSize * 1.2;
      await drawTextWithEmojis(ctx, line, actualWidth / 2, y, fontSize);
    }

    // Convert to buffer with appropriate format
    let buffer: Buffer;
    let contentType: string;

    // First get PNG buffer from canvas
    const pngBuffer = canvas.toBuffer("image/png");

    if (format === "jpeg") {
      // Convert PNG to JPEG using sharp
      buffer = await sharp(pngBuffer)
        .jpeg({ quality })
        .toBuffer();
      contentType = "image/jpeg";
    } else if (format === "webp") {
      // Convert PNG to WebP using sharp
      buffer = await sharp(pngBuffer)
        .webp({ quality })
        .toBuffer();
      contentType = "image/webp";
    } else {
      // Use PNG directly
      buffer = pngBuffer;
      contentType = "image/png";
    }

    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return new NextResponse("Error generating image", { status: 500 });
  }
}
