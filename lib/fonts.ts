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

// Cache directory for downloaded fonts
const CACHE_DIR = path.join(process.cwd(), ".next", "cache", "fonts");

// In-memory cache to track registered fonts
const registeredFonts = new Set<string>();

/**
 * Download a font file - fetch from Google Fonts CSS API and extract TTF URL
 */
async function downloadFont(fontKey: SupportedFontKey): Promise<string> {
  const fontName = SUPPORTED_FONTS[fontKey];
  const filename = `${fontKey}.ttf`;
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

  try {
    // Get CSS from Google Fonts with a User-Agent that triggers TrueType format
    // Android 4.4 and older browsers get TTF instead of WOFF2
    const googleFontName = fontName.replace(/ /g, '+');
    const cssUrl = `https://fonts.googleapis.com/css?family=${googleFontName}:400`;
    
    const cssResponse = await fetch(cssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36'
      }
    });

    if (!cssResponse.ok) {
      throw new Error(`Failed to fetch Google Fonts CSS: ${cssResponse.statusText}`);
    }

    const cssText = await cssResponse.text();
    
    // Extract the font URL - look for url() in the CSS
    const urlMatch = cssText.match(/url\(([^)]+)\)/);
    if (!urlMatch || !urlMatch[1]) {
      throw new Error(`Could not find font URL in CSS for ${fontName}`);
    }

    const fontUrl = urlMatch[1].replace(/['"]/g, ''); // Remove quotes if any

    // Download the actual font file
    const fontResponse = await fetch(fontUrl);
    if (!fontResponse.ok) {
      throw new Error(`Failed to download font file: ${fontResponse.statusText}`);
    }

    const buffer = await fontResponse.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(buffer));

    return filepath;
  } catch (error) {
    console.error(`Error downloading font ${fontName}:`, error);
    throw error;
  }
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
