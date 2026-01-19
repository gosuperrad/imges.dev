import { NextRequest, NextResponse } from "next/server";
import { createCanvas, CanvasRenderingContext2D, loadImage } from "canvas";
import sharp from "sharp";
import { parse as parseEmoji } from "twemoji-parser";
import { validateFont, loadGoogleFont } from "@/lib/fonts";
import { trackImageEvent } from "@/lib/analytics";

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
  radius?: number;
  shadow?: number;
  shadowColor?: string;
  noise?: number;
  pattern?: "dots" | "stripes" | "checkerboard" | "grid";
  patternColor?: string;
}

interface ValidationError {
  field: string;
  message: string;
  received: string;
  expected: string;
  suggestion?: string;
}

interface ErrorResponse {
  error: string;
  message: string;
  received?: string;
  expected?: string;
  suggestion?: string;
  docs: string;
  examples: string[];
}

type ParseResult = 
  | { success: true; data: ImageParams }
  | { success: false; error: ValidationError };

/**
 * Validation helper functions
 */

function validateDimensions(width: number, height: number): ValidationError | null {
  if (width < 1 || height < 1) {
    return {
      field: "dimensions",
      message: "Dimensions must be at least 1 pixel",
      received: `${width}x${height}`,
      expected: "Width and height >= 1",
      suggestion: "Minimum dimension is 1x1"
    };
  }

  if (width > 4000 || height > 4000) {
    return {
      field: "dimensions",
      message: "Dimensions exceed maximum allowed size",
      received: `${width}x${height}`,
      expected: "Width and height <= 4000",
      suggestion: `Try: /${Math.min(width, 4000)}x${Math.min(height, 4000)}`
    };
  }

  return null;
}

function validateHexColor(color: string, fieldName: string): ValidationError | null {
  // Remove # if present
  const cleanColor = color.replace(/^#/, "");
  
  // Valid hex color should be 3 or 6 characters and only contain hex digits
  const validLength = cleanColor.length === 3 || cleanColor.length === 6;
  const validChars = /^[0-9a-fA-F]+$/.test(cleanColor);
  
  if (!validLength || !validChars) {
    return {
      field: fieldName,
      message: `Invalid hex color format`,
      received: color,
      expected: "3 or 6 hexadecimal digits (e.g., 'fff' or '3b82f6')",
      suggestion: validChars && !validLength 
        ? `Color should be 3 or 6 digits, received ${cleanColor.length}`
        : "Use format: /800x600/3b82f6 or /800x600/fff"
    };
  }
  
  return null;
}

function validateFormat(format: string): ValidationError | null {
  const validFormats = ["png", "jpeg", "jpg", "webp"];
  
  if (!validFormats.includes(format.toLowerCase())) {
    return {
      field: "format",
      message: "Unsupported image format",
      received: format,
      expected: "png, jpeg, jpg, or webp",
      suggestion: "Try: /800x600.png or /800x600.webp"
    };
  }
  
  return null;
}

function validateNumberParam(
  value: string | null,
  fieldName: string,
  min: number,
  max: number
): ValidationError | null {
  if (value === null) return null;
  
  const num = parseInt(value);
  
  if (isNaN(num)) {
    return {
      field: fieldName,
      message: `Invalid ${fieldName} value`,
      received: value,
      expected: `Number between ${min} and ${max}`,
      suggestion: `Use a numeric value, e.g., ?${fieldName}=${Math.floor((min + max) / 2)}`
    };
  }
  
  if (num < min || num > max) {
    return {
      field: fieldName,
      message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} out of range`,
      received: value,
      expected: `Number between ${min} and ${max}`,
      suggestion: `Try a value between ${min} and ${max}`
    };
  }
  
  return null;
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

function parseParams(params: string[]): ParseResult {
  const defaults = {
    bgColor: "cccccc",
    fgColor: "333333",
    format: "webp" as const,
    scale: 1,
  };

  // Validate that params exist
  if (params.length === 0) {
    return {
      success: false,
      error: {
        field: "dimensions",
        message: "No dimensions provided",
        received: "(empty)",
        expected: "WIDTHxHEIGHT or SIZE (e.g., 800x600 or 300)",
        suggestion: "Try: /800x600 or /300 for a 300x300 square image"
      }
    };
  }

  let dimensionStr = params[0];
  let scale = 1;
  let format: "png" | "jpeg" | "webp" = defaults.format;

  // Check for @2x, @3x suffix (supports both "640x360@2x" and "300@2x")
  const retinaMatch = dimensionStr.match(/^(\d+(?:x\d+)?)@(\d)x$/);
  if (retinaMatch) {
    dimensionStr = retinaMatch[1];
    scale = parseInt(retinaMatch[2]);
    if (scale < 1 || scale > 3) scale = 1;
  }

  // Check for format extension (supports both "640x360.png" and "300.png")
  const formatMatch = dimensionStr.match(/^(\d+(?:x\d+)?)\.(png|jpe?g|webp)$/i);
  const unsupportedFormatMatch = dimensionStr.match(/^(\d+(?:x\d+)?)\.(\w+)$/i);
  
  if (unsupportedFormatMatch && !formatMatch) {
    // Found a format extension, but it's not supported
    // First validate that the dimension part is valid before suggesting a fix
    const dimPart = unsupportedFormatMatch[1];
    const dimCheck = dimPart.match(/^(\d+)(?:x(\d+))?$/);
    if (!dimCheck) {
      // Invalid dimension format - let it fall through to dimension validation
      dimensionStr = dimPart;
    } else {
      // Valid dimensions but unsupported format
      const ext = unsupportedFormatMatch[2];
      return {
        success: false,
        error: {
          field: "format",
          message: "Unsupported image format",
          received: ext,
          expected: "png, jpeg, jpg, or webp",
          suggestion: `Try: /${dimPart}.png or /${dimPart}.webp`
        }
      };
    }
  }
  
  if (formatMatch) {
    dimensionStr = formatMatch[1];
    const ext = formatMatch[2].toLowerCase();
    format = ext === "jpg" ? "jpeg" : (ext as "png" | "jpeg" | "webp");
  }

  // Parse dimensions (e.g., "640x360" or "300" for square)
  let width: number;
  let height: number;
  
  const dimensionMatch = dimensionStr.match(/^(\d+)(?:x(\d+))?$/);
  if (!dimensionMatch) {
    return {
      success: false,
      error: {
        field: "dimensions",
        message: "Invalid dimension format",
        received: dimensionStr,
        expected: "WIDTHxHEIGHT or SIZE (e.g., 800x600 or 300)",
        suggestion: "Use format like /800x600 for rectangle or /300 for 300x300 square"
      }
    };
  }

  width = parseInt(dimensionMatch[1]);
  height = dimensionMatch[2] ? parseInt(dimensionMatch[2]) : width; // If no height, use width (square)

  // Validate dimensions
  const dimensionError = validateDimensions(width, height);
  if (dimensionError) {
    return { success: false, error: dimensionError };
  }

  // Parse background color (optional, supports "random")
  let bgColor = params[1] || defaults.bgColor;
  let bgColor2: string | undefined;

  if (bgColor === "random") {
    bgColor = generateRandomColor();
  } else {
    // Check for gradient (color1-color2)
    const gradientMatch = bgColor.match(/^([^-]+)-(.+)$/);
    if (gradientMatch) {
      bgColor = gradientMatch[1];
      bgColor2 = gradientMatch[2];
      
      if (bgColor2 === "random") {
        bgColor2 = generateRandomColor();
      } else {
        // Validate gradient color 2
        const bgColor2Error = validateHexColor(bgColor2, "gradient-color-2");
        if (bgColor2Error) {
          return { success: false, error: bgColor2Error };
        }
      }
    }
    
    // Validate background color (if not "random")
    const bgColorError = validateHexColor(bgColor, "background-color");
    if (bgColorError) {
      return { success: false, error: bgColorError };
    }
  }

  // Parse foreground color (optional, supports "random")
  let fgColor = params[2] || defaults.fgColor;
  if (fgColor === "random") {
    fgColor = generateRandomColor();
  } else {
    // Validate foreground color
    const fgColorError = validateHexColor(fgColor, "foreground-color");
    if (fgColorError) {
      return { success: false, error: fgColorError };
    }
  }

  return {
    success: true,
    data: {
      width,
      height,
      scale,
      bgColor: bgColor.replace(/^#/, ""),
      bgColor2: bgColor2?.replace(/^#/, ""),
      fgColor: fgColor.replace(/^#/, ""),
      format,
    }
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

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawGradientRounded(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color1: string,
  color2: string,
  radius: number
) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, normalizeColor(color1));
  gradient.addColorStop(1, normalizeColor(color2));
  ctx.fillStyle = gradient;
  
  drawRoundedRect(ctx, 0, 0, width, height, radius);
  ctx.fill();
}

function applyNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Apply noise to each pixel
  for (let i = 0; i < data.length; i += 4) {
    // Random noise value between -amount and +amount
    const noise = (Math.random() - 0.5) * amount * 2;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
    // Alpha channel (i + 3) remains unchanged
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function drawPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pattern: "dots" | "stripes" | "checkerboard" | "grid",
  color: string
) {
  ctx.fillStyle = normalizeColor(color);
  ctx.strokeStyle = normalizeColor(color);
  
  const spacing = Math.min(width, height) / 20; // Adaptive spacing
  
  switch (pattern) {
    case "dots":
      // Draw dot pattern
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, spacing / 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
      
    case "stripes":
      // Draw diagonal stripes
      ctx.lineWidth = spacing / 4;
      for (let i = -height; i < width + height; i += spacing) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height, height);
        ctx.stroke();
      }
      break;
      
    case "checkerboard":
      // Draw checkerboard pattern
      const squareSize = spacing;
      for (let x = 0; x < width; x += squareSize) {
        for (let y = 0; y < height; y += squareSize) {
          // Alternate squares
          if ((Math.floor(x / squareSize) + Math.floor(y / squareSize)) % 2 === 0) {
            ctx.fillRect(x, y, squareSize, squareSize);
          }
        }
      }
      break;
      
    case "grid":
      // Draw grid pattern
      ctx.lineWidth = spacing / 20;
      // Vertical lines
      for (let x = 0; x <= width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      // Horizontal lines
      for (let y = 0; y <= height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      break;
  }
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
  const segments: Array<{ type: 'text' | 'emoji', content: string, url?: string }> = [];
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
    if (segment.type === "text") {
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

/**
 * Convert a validation field name to a user-friendly error title
 */
function formatErrorTitle(field: string): string {
  const titles: Record<string, string> = {
    "dimensions": "Invalid Dimensions",
    "background-color": "Invalid Background Color",
    "foreground-color": "Invalid Foreground Color",
    "gradient-color-2": "Invalid Gradient Color",
    "format": "Unsupported Format",
    "border": "Invalid Border Width",
    "blur": "Invalid Blur Amount",
    "pattern": "Invalid Pattern",
    "quality": "Invalid Quality",
    "text": "Invalid Text",
    "font": "Invalid Font",
    "font-size": "Invalid Font Size",
    "font-weight": "Invalid Font Weight",
    "font-style": "Invalid Font Style"
  };
  
  return titles[field] || "Invalid Request";
}

function createErrorResponse(error: ValidationError, status?: number): NextResponse;
function createErrorResponse(message: string, status?: number): NextResponse;
function createErrorResponse(
  errorOrMessage: ValidationError | string,
  status: number = 400
): NextResponse {
  let responseBody: ErrorResponse;
  
  if (typeof errorOrMessage === "string") {
    // Legacy string error message
    responseBody = {
      error: "Invalid Request",
      message: errorOrMessage,
      docs: "https://imges.dev/docs",
      examples: [
        "https://imges.dev/800x600",
        "https://imges.dev/300",
        "https://imges.dev/800x600/3b82f6/ffffff?text=Hello"
      ]
    };
  } else {
    // Detailed ValidationError object
    const error = errorOrMessage;
    responseBody = {
      error: formatErrorTitle(error.field),
      message: error.message,
      received: error.received,
      expected: error.expected,
      suggestion: error.suggestion,
      docs: "https://imges.dev/docs",
      examples: getExamplesForError(error.field)
    };
  }
  
  return new NextResponse(
    JSON.stringify(responseBody, null, 2),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    }
  );
}

function getExamplesForError(field: string): string[] {
  switch (field) {
    case "dimensions":
      return [
        "https://imges.dev/800x600",
        "https://imges.dev/300",
        "https://imges.dev/1920x1080"
      ];
    case "background-color":
    case "foreground-color":
    case "gradient-color-2":
      return [
        "https://imges.dev/800x600/3b82f6",
        "https://imges.dev/800x600/3b82f6/ffffff",
        "https://imges.dev/800x600/3b82f6-8b5cf6"
      ];
    case "format":
      return [
        "https://imges.dev/800x600.png",
        "https://imges.dev/800x600.webp",
        "https://imges.dev/800x600.jpeg"
      ];
    default:
      return [
        "https://imges.dev/800x600",
        "https://imges.dev/300",
        "https://imges.dev/800x600/3b82f6/ffffff?text=Hello"
      ];
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ params: string[] }> }
) {
  const { params: urlParams } = await context.params;

  const parseResult = parseParams(urlParams);

  if (!parseResult.success) {
    return createErrorResponse(parseResult.error);
  }

  const imageParams = parseResult.data;
  const searchParams = request.nextUrl.searchParams;

  // Parse and validate query parameters
  const text = searchParams.get("text") || `${imageParams.width} × ${imageParams.height}`;
  
  // Validate and load custom font
  const fontParam = searchParams.get("font");
  const { fontKey, fontFamily } = validateFont(fontParam);
  let font = fontFamily;
  
  // Load Google Font if requested
  if (fontKey) {
    try {
      font = await loadGoogleFont(fontKey);
    } catch (error) {
      console.error("Failed to load Google Font:", error);
      // font will already be set to the family name or fallback
    }
  }
  
  const fontWeight = searchParams.get("weight") || "normal";
  const fontStyle = searchParams.get("style") || "normal";
  const align = (searchParams.get("align") as "top" | "center" | "bottom" | "custom") || "center";
  
  // Validate align parameter
  if (align && !["top", "center", "bottom", "custom"].includes(align)) {
    return createErrorResponse({
      field: "align",
      message: "Invalid text alignment",
      received: align,
      expected: "top, center, bottom, or custom",
      suggestion: "Try: ?align=center or ?align=top"
    });
  }
  
  const customY = searchParams.get("y") ? parseInt(searchParams.get("y")!) : undefined;
  const border = searchParams.get("border") ? parseInt(searchParams.get("border")!) : undefined;
  
  // Validate border
  const borderError = validateNumberParam(searchParams.get("border"), "border", 0, 100);
  if (borderError) {
    return createErrorResponse(borderError);
  }
  
  const borderColor = searchParams.get("borderColor") || imageParams.fgColor;
  const blur = searchParams.get("blur") ? parseInt(searchParams.get("blur")!) : undefined;
  
  // Validate blur
  const blurError = validateNumberParam(searchParams.get("blur"), "blur", 0, 50);
  if (blurError) {
    return createErrorResponse(blurError);
  }
  
  const radius = searchParams.get("radius") ? parseInt(searchParams.get("radius")!) : undefined;
  
  // Validate radius
  const radiusError = validateNumberParam(searchParams.get("radius"), "radius", 0, 500);
  if (radiusError) {
    return createErrorResponse(radiusError);
  }
  
  const shadow = searchParams.get("shadow") ? parseInt(searchParams.get("shadow")!) : undefined;
  
  // Validate shadow
  const shadowError = validateNumberParam(searchParams.get("shadow"), "shadow", 0, 100);
  if (shadowError) {
    return createErrorResponse(shadowError);
  }
  
  const shadowColor = searchParams.get("shadowColor") || "000000";
  
  const noise = searchParams.get("noise") ? parseInt(searchParams.get("noise")!) : undefined;
  
  // Validate noise
  const noiseError = validateNumberParam(searchParams.get("noise"), "noise", 0, 100);
  if (noiseError) {
    return createErrorResponse(noiseError);
  }
  
  const pattern = searchParams.get("pattern") as "dots" | "stripes" | "checkerboard" | "grid" | null;
  
  // Validate pattern
  if (pattern && !["dots", "stripes", "checkerboard", "grid"].includes(pattern)) {
    return createErrorResponse({
      field: "pattern",
      message: "Invalid pattern type",
      received: pattern,
      expected: "dots, stripes, checkerboard, or grid",
      suggestion: "Try: ?pattern=dots or ?pattern=stripes"
    });
  }
  
  const patternColor = searchParams.get("patternColor") || imageParams.fgColor;
  
  const quality = searchParams.get("quality") ? parseInt(searchParams.get("quality")!) : 90;
  
  // Validate quality (only if provided by user)
  const qualityError = validateNumberParam(searchParams.get("quality"), "quality", 1, 100);
  if (qualityError) {
    return createErrorResponse(qualityError);
  }
  
  const format = (searchParams.get("format") as "png" | "jpeg" | "webp") || imageParams.format;
  
  // Validate format (if provided via query param)
  if (searchParams.get("format")) {
    const formatValidation = validateFormat(format);
    if (formatValidation) {
      return createErrorResponse(formatValidation);
    }
  }
  
  // Font size - can be specified or auto-calculated
  let fontSize: number | undefined;
  const fontSizeParam = searchParams.get("size");
  if (fontSizeParam) {
    const fontSizeError = validateNumberParam(fontSizeParam, "size", 1, 500);
    if (fontSizeError) {
      return createErrorResponse(fontSizeError);
    }
    fontSize = parseInt(fontSizeParam);
  }

  try {
    // Calculate actual dimensions with scale
    const actualWidth = imageParams.width * imageParams.scale;
    const actualHeight = imageParams.height * imageParams.scale;

    // Create canvas
    const canvas = createCanvas(actualWidth, actualHeight);
    const ctx = canvas.getContext("2d");

    // Apply shadow if specified
    if (shadow && shadow > 0) {
      ctx.shadowColor = normalizeColor(shadowColor);
      ctx.shadowBlur = shadow * imageParams.scale;
      ctx.shadowOffsetX = (shadow / 2) * imageParams.scale;
      ctx.shadowOffsetY = (shadow / 2) * imageParams.scale;
    }

    // Fill background (gradient or solid) with optional rounded corners
    if (radius && radius > 0) {
      const scaledRadius = radius * imageParams.scale;
      if (imageParams.bgColor2) {
        drawGradientRounded(ctx, actualWidth, actualHeight, imageParams.bgColor, imageParams.bgColor2, scaledRadius);
      } else {
        ctx.fillStyle = normalizeColor(imageParams.bgColor);
        drawRoundedRect(ctx, 0, 0, actualWidth, actualHeight, scaledRadius);
        ctx.fill();
      }
    } else {
      if (imageParams.bgColor2) {
        drawGradient(ctx, actualWidth, actualHeight, imageParams.bgColor, imageParams.bgColor2);
      } else {
        ctx.fillStyle = normalizeColor(imageParams.bgColor);
        ctx.fillRect(0, 0, actualWidth, actualHeight);
      }
    }

    // Reset shadow for other elements
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Apply blur effect to background if specified
    if (blur && blur > 0) {
      applyBlur(ctx, actualWidth, actualHeight, blur * imageParams.scale);
    }

    // Apply pattern if specified
    if (pattern) {
      drawPattern(ctx, actualWidth, actualHeight, pattern, patternColor);
    }

    // Apply noise/grain effect if specified
    if (noise && noise > 0) {
      applyNoise(ctx, actualWidth, actualHeight, noise);
    }

    // Draw border if specified
    if (border && border > 0) {
      const scaledBorder = border * imageParams.scale;
      ctx.strokeStyle = normalizeColor(borderColor);
      ctx.lineWidth = scaledBorder;
      
      if (radius && radius > 0) {
        const scaledRadius = radius * imageParams.scale;
        drawRoundedRect(
          ctx,
          scaledBorder / 2,
          scaledBorder / 2,
          actualWidth - scaledBorder,
          actualHeight - scaledBorder,
          scaledRadius
        );
        ctx.stroke();
      } else {
        ctx.strokeRect(
          scaledBorder / 2,
          scaledBorder / 2,
          actualWidth - scaledBorder,
          actualHeight - scaledBorder
        );
      }
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

    // Track analytics (non-blocking)
    trackImageEvent({
      width: imageParams.width,
      height: imageParams.height,
      bgColor: imageParams.bgColor,
      fgColor: imageParams.fgColor,
      format: format,
      hasText: text !== `${imageParams.width} × ${imageParams.height}`, // Has custom text
      hasBorder: !!border && border > 0,
      hasBlur: !!blur && blur > 0,
      hasPattern: !!pattern,
      hasGradient: !!imageParams.bgColor2,
      hasCustomFont: !!fontKey,
      queryParams: Object.fromEntries(searchParams.entries()),
      userAgent: request.headers.get("user-agent") || undefined,
      referrer: request.headers.get("referer") || undefined,
    }).catch(err => {
      // Silently fail - don't block response
      console.error("Analytics tracking failed:", err);
    });

    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Image-Width": actualWidth.toString(),
        "X-Image-Height": actualHeight.toString(),
        "X-Image-Format": format,
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse({
      field: "internal",
      message: "Failed to generate image",
      received: errorMessage,
      expected: "Successful image generation",
      suggestion: "This is an internal server error. Please try again or contact support if the issue persists."
    }, 500);
  }
}
