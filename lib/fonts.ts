import { registerFont } from "canvas";
import { promises as fs } from "fs";
import path from "path";

// Popular Google Fonts that we'll support
export const SUPPORTED_FONTS = {
  // Sans-Serif
  "inter": "Inter",
  "roboto": "Roboto",
  "open-sans": "Open Sans",
  "lato": "Lato",
  "montserrat": "Montserrat",
  "poppins": "Poppins",
  "raleway": "Raleway",
  "nunito": "Nunito",
  
  // Serif
  "playfair-display": "Playfair Display",
  "merriweather": "Merriweather",
  "lora": "Lora",
  "roboto-slab": "Roboto Slab",
  
  // Monospace
  "roboto-mono": "Roboto Mono",
  "source-code-pro": "Source Code Pro",
  "fira-code": "Fira Code",
  "jetbrains-mono": "JetBrains Mono",
  
  // Display/Decorative
  "bebas-neue": "Bebas Neue",
  "lobster": "Lobster",
  "pacifico": "Pacifico",
  "dancing-script": "Dancing Script",
} as const;

export type SupportedFontKey = keyof typeof SUPPORTED_FONTS;

// Google Fonts API URLs for each font (Regular weight)
const FONT_URLS: Record<SupportedFontKey, string> = {
  "inter": "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
  "roboto": "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2",
  "open-sans": "https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2",
  "lato": "https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXiWtFCc.woff2",
  "montserrat": "https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2",
  "poppins": "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2",
  "raleway": "https://fonts.gstatic.com/s/raleway/v28/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCIPrE.woff2",
  "nunito": "https://fonts.gstatic.com/s/nunito/v25/XRXI3I6Li01BKofiOc5wtlZ2di8HDLshdTQ3j77e.woff2",
  "playfair-display": "https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQZNLo_U2r.woff2",
  "merriweather": "https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-fCZMdeX3rsHo.woff2",
  "lora": "https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkq0.woff2",
  "roboto-slab": "https://fonts.gstatic.com/s/robotoslab/v24/BngbUXZYTXPIvIBgJJSb6s3BzlRRfKOFbvjojIWWaG5iddG-1A.woff2",
  "roboto-mono": "https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vuPQ--5Ip2sSQ.woff2",
  "source-code-pro": "https://fonts.gstatic.com/s/sourcecodepro/v22/HI_diYsKILxRpg3hIP6sJ7fM7PqPMcMnZFqUwX28DMyQhM5hTXUcdJg.woff2",
  "fira-code": "https://fonts.gstatic.com/s/firacode/v21/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVD7MOzlojwUKaJO.woff2",
  "jetbrains-mono": "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOVkXg.woff2",
  "bebas-neue": "https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW5rygbi49c.woff2",
  "lobster": "https://fonts.gstatic.com/s/lobster/v30/neILzCirqoswsqX9_oWsMqEzSJQ.woff2",
  "pacifico": "https://fonts.gstatic.com/s/pacifico/v22/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2",
  "dancing-script": "https://fonts.gstatic.com/s/dancingscript/v24/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup5.woff2",
};

// Cache directory for downloaded fonts
const CACHE_DIR = path.join(process.cwd(), ".next", "cache", "fonts");

// In-memory cache to track registered fonts
const registeredFonts = new Set<string>();

/**
 * Download a font file from Google Fonts
 */
async function downloadFont(fontKey: SupportedFontKey): Promise<string> {
  const url = FONT_URLS[fontKey];
  const fontName = SUPPORTED_FONTS[fontKey];
  const filename = `${fontKey}.woff2`;
  const filepath = path.join(CACHE_DIR, filename);

  // Check if already cached
  try {
    await fs.access(filepath);
    return filepath;
  } catch {
    // File doesn't exist, download it
  }

  // Ensure cache directory exists
  await fs.mkdir(CACHE_DIR, { recursive: true });

  // Download the font
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download font ${fontName}: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  await fs.writeFile(filepath, Buffer.from(buffer));

  return filepath;
}

/**
 * Load and register a Google Font for use with canvas
 */
export async function loadGoogleFont(fontKey: SupportedFontKey): Promise<string> {
  const fontName = SUPPORTED_FONTS[fontKey];

  // Check if already registered
  if (registeredFonts.has(fontKey)) {
    return fontName;
  }

  try {
    // Download and cache the font
    const fontPath = await downloadFont(fontKey);

    // Register with canvas
    registerFont(fontPath, { family: fontName });
    registeredFonts.add(fontKey);

    return fontName;
  } catch (error) {
    console.error(`Failed to load font ${fontName}:`, error);
    // Fallback to sans-serif
    return "sans-serif";
  }
}

/**
 * Validate and normalize font parameter
 */
export function validateFont(font: string | null): { fontKey: SupportedFontKey | null; fontFamily: string } {
  if (!font) {
    return { fontKey: null, fontFamily: "sans-serif" };
  }

  // Normalize the input
  const normalized = font.toLowerCase().trim();

  // Check if it's a supported font
  if (normalized in SUPPORTED_FONTS) {
    return { 
      fontKey: normalized as SupportedFontKey, 
      fontFamily: SUPPORTED_FONTS[normalized as SupportedFontKey] 
    };
  }

  // Default system fonts
  const systemFonts = ["sans-serif", "serif", "monospace"];
  if (systemFonts.includes(normalized)) {
    return { fontKey: null, fontFamily: normalized };
  }

  // Invalid font, use default
  return { fontKey: null, fontFamily: "sans-serif" };
}

/**
 * Get a list of all supported fonts for documentation
 */
export function getSupportedFontList(): Array<{ key: SupportedFontKey; name: string; category: string }> {
  return [
    // Sans-Serif
    { key: "inter", name: "Inter", category: "Sans-Serif" },
    { key: "roboto", name: "Roboto", category: "Sans-Serif" },
    { key: "open-sans", name: "Open Sans", category: "Sans-Serif" },
    { key: "lato", name: "Lato", category: "Sans-Serif" },
    { key: "montserrat", name: "Montserrat", category: "Sans-Serif" },
    { key: "poppins", name: "Poppins", category: "Sans-Serif" },
    { key: "raleway", name: "Raleway", category: "Sans-Serif" },
    { key: "nunito", name: "Nunito", category: "Sans-Serif" },
    
    // Serif
    { key: "playfair-display", name: "Playfair Display", category: "Serif" },
    { key: "merriweather", name: "Merriweather", category: "Serif" },
    { key: "lora", name: "Lora", category: "Serif" },
    { key: "roboto-slab", name: "Roboto Slab", category: "Serif" },
    
    // Monospace
    { key: "roboto-mono", name: "Roboto Mono", category: "Monospace" },
    { key: "source-code-pro", name: "Source Code Pro", category: "Monospace" },
    { key: "fira-code", name: "Fira Code", category: "Monospace" },
    { key: "jetbrains-mono", name: "JetBrains Mono", category: "Monospace" },
    
    // Display
    { key: "bebas-neue", name: "Bebas Neue", category: "Display" },
    { key: "lobster", name: "Lobster", category: "Display" },
    { key: "pacifico", name: "Pacifico", category: "Display" },
    { key: "dancing-script", name: "Dancing Script", category: "Display" },
  ];
}
