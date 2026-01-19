import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface AnalyticsEventData {
  width: number;
  height: number;
  bgColor?: string;
  fgColor?: string;
  format: string;
  hasText?: boolean;
  hasBorder?: boolean;
  hasBlur?: boolean;
  hasPattern?: boolean;
  hasGradient?: boolean;
  hasCustomFont?: boolean;
  queryParams?: Record<string, unknown>;
  userAgent?: string;
  referrer?: string;
}

/**
 * Track an image generation event in analytics
 * 
 * This function tracks analytics asynchronously without blocking the response.
 * If tracking fails, it logs the error but doesn't affect the user experience.
 */
export async function trackImageEvent(data: AnalyticsEventData): Promise<void> {
  // Don't track in development to avoid polluting analytics
  if (process.env.NODE_ENV === "development") {
    return;
  }

  // Don't track requests from our own site (examples page, image builder, etc.)
  // This prevents example images from polluting the analytics
  if (data.referrer) {
    try {
      const referrerUrl = new URL(data.referrer);
      const isOwnSite = referrerUrl.hostname === "imges.dev" || 
                        referrerUrl.hostname === "www.imges.dev" ||
                        referrerUrl.hostname.endsWith(".railway.app"); // Staging environment
      
      if (isOwnSite) {
        return; // Skip tracking for our own site
      }
    } catch {
      // Invalid referrer URL, continue with tracking
    }
  }

  try {
    // Create the event in the database
    await prisma.imageEvent.create({
      data: {
        width: data.width,
        height: data.height,
        bgColor: data.bgColor?.replace(/^#/, ""), // Remove # prefix if present
        fgColor: data.fgColor?.replace(/^#/, ""),
        format: data.format,
        hasText: data.hasText ?? false,
        hasBorder: data.hasBorder ?? false,
        hasBlur: data.hasBlur ?? false,
        hasPattern: data.hasPattern ?? false,
        hasGradient: data.hasGradient ?? false,
        hasCustomFont: data.hasCustomFont ?? false,
        queryParams: data.queryParams ? (data.queryParams as Prisma.InputJsonValue) : undefined,
        userAgent: data.userAgent?.substring(0, 500), // Truncate to 500 chars
        referrer: data.referrer?.substring(0, 500), // Truncate to 500 chars
      },
    });
  } catch (error) {
    // Log error but don't throw - analytics shouldn't break image generation
    console.error("Failed to track analytics event:", error);
  }
}

/**
 * Get popular dimensions from analytics
 */
export async function getPopularDimensions(limit: number = 10) {
  try {
    const results = await prisma.imageEvent.groupBy({
      by: ["width", "height"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: limit,
    });

    return results.map(r => ({
      dimension: `${r.width}x${r.height}`,
      count: r._count.id,
    }));
  } catch (error) {
    console.error("Failed to get popular dimensions:", error);
    return [];
  }
}

/**
 * Get popular colors from analytics
 */
export async function getPopularColors(type: "bg" | "fg", limit: number = 10) {
  try {
    const field = type === "bg" ? "bgColor" : "fgColor";
    
    const results = await prisma.imageEvent.groupBy({
      by: [field as "bgColor" | "fgColor"],
      _count: {
        id: true,
      },
      where: {
        [field]: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: limit,
    });

    return results.map(r => ({
      color: type === "bg" ? r.bgColor : r.fgColor,
      count: r._count.id,
    })).filter(r => r.color !== null);
  } catch (error) {
    console.error(`Failed to get popular ${type} colors:`, error);
    return [];
  }
}

/**
 * Get popular formats from analytics
 */
export async function getPopularFormats() {
  try {
    const results = await prisma.imageEvent.groupBy({
      by: ["format"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    return results.map(r => ({
      format: r.format,
      count: r._count.id,
    }));
  } catch (error) {
    console.error("Failed to get popular formats:", error);
    return [];
  }
}

/**
 * Get popular features from analytics
 */
export async function getPopularFeatures() {
  try {
    const [
      textCount,
      borderCount,
      blurCount,
      patternCount,
      gradientCount,
      customFontCount,
    ] = await Promise.all([
      prisma.imageEvent.count({ where: { hasText: true } }),
      prisma.imageEvent.count({ where: { hasBorder: true } }),
      prisma.imageEvent.count({ where: { hasBlur: true } }),
      prisma.imageEvent.count({ where: { hasPattern: true } }),
      prisma.imageEvent.count({ where: { hasGradient: true } }),
      prisma.imageEvent.count({ where: { hasCustomFont: true } }),
    ]);

    return [
      { feature: "text", count: textCount },
      { feature: "border", count: borderCount },
      { feature: "blur", count: blurCount },
      { feature: "pattern", count: patternCount },
      { feature: "gradient", count: gradientCount },
      { feature: "customFont", count: customFontCount },
    ].sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Failed to get popular features:", error);
    return [];
  }
}

/**
 * Get total event count
 */
export async function getTotalEvents() {
  try {
    return await prisma.imageEvent.count();
  } catch (error) {
    console.error("Failed to get total events:", error);
    return 0;
  }
}
