import fs from 'fs';
import path from 'path';

// Word lists for memorable short codes
const ADJECTIVES = [
  'blue', 'red', 'green', 'pink', 'purple', 'orange', 'yellow', 'cyan',
  'bright', 'dark', 'light', 'soft', 'bold', 'vivid', 'pale', 'neon',
  'warm', 'cool', 'fresh', 'clean', 'sharp', 'smooth', 'rough', 'sleek',
  'modern', 'classic', 'vintage', 'retro', 'minimal', 'simple', 'fancy', 'elegant',
  'quick', 'fast', 'slow', 'calm', 'wild', 'quiet', 'loud', 'subtle',
  'happy', 'sunny', 'cloudy', 'misty', 'clear', 'hazy', 'crisp', 'fuzzy',
];

const NOUNS = [
  'cat', 'dog', 'fox', 'bear', 'wolf', 'lion', 'tiger', 'panda',
  'star', 'moon', 'sun', 'cloud', 'wave', 'ocean', 'river', 'lake',
  'mountain', 'valley', 'forest', 'desert', 'island', 'garden', 'meadow', 'field',
  'fire', 'water', 'earth', 'wind', 'thunder', 'storm', 'rain', 'snow',
  'hero', 'card', 'badge', 'banner', 'button', 'icon', 'logo', 'mark',
  'grid', 'dots', 'lines', 'waves', 'circles', 'squares', 'stripes', 'pattern',
  'photo', 'image', 'picture', 'canvas', 'frame', 'poster', 'print', 'sketch',
];

interface ShortUrl {
  code: string;
  url: string;
  createdAt: string;
  hits?: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SHORT_URLS_FILE = path.join(DATA_DIR, 'short-urls.json');

// Ensure data directory exists
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load all short URLs
function loadShortUrls(): Record<string, ShortUrl> {
  ensureDataDir();
  
  if (!fs.existsSync(SHORT_URLS_FILE)) {
    return {};
  }
  
  try {
    const data = fs.readFileSync(SHORT_URLS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading short URLs:', error);
    return {};
  }
}

// Save short URLs
function saveShortUrls(urls: Record<string, ShortUrl>): void {
  ensureDataDir();
  
  try {
    fs.writeFileSync(SHORT_URLS_FILE, JSON.stringify(urls, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving short URLs:', error);
    throw new Error('Failed to save short URL');
  }
}

// Generate a memorable short code
function generateMemorableCode(existingCodes: Set<string>): string {
  const maxAttempts = 100;
  
  for (let i = 0; i < maxAttempts; i++) {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const code = `${adjective}-${noun}`;
    
    if (!existingCodes.has(code)) {
      return code;
    }
  }
  
  // Fallback: add number if all combinations tried
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const random = Math.floor(Math.random() * 100);
  return `${adjective}-${noun}-${random}`;
}

// Create a short URL
export function createShortUrl(url: string, customCode?: string): { code: string; shortUrl: string } {
  const urls = loadShortUrls();
  const existingCodes = new Set(Object.keys(urls));
  
  // Check if URL already has a short code
  for (const [code, data] of Object.entries(urls)) {
    if (data.url === url) {
      return {
        code,
        shortUrl: `/s/${code}`,
      };
    }
  }
  
  // Generate or use custom code
  let code: string;
  
  if (customCode) {
    // Validate custom code format (lowercase letters and hyphens only)
    if (!/^[a-z0-9-]+$/.test(customCode)) {
      throw new Error('Custom code must contain only lowercase letters, numbers, and hyphens');
    }
    
    if (existingCodes.has(customCode)) {
      throw new Error('This custom code is already taken');
    }
    
    code = customCode;
  } else {
    code = generateMemorableCode(existingCodes);
  }
  
  // Save the mapping
  urls[code] = {
    code,
    url,
    createdAt: new Date().toISOString(),
    hits: 0,
  };
  
  saveShortUrls(urls);
  
  return {
    code,
    shortUrl: `/s/${code}`,
  };
}

// Get URL from short code
export function getShortUrl(code: string): string | null {
  const urls = loadShortUrls();
  const data = urls[code];
  
  if (!data) {
    return null;
  }
  
  // Increment hit counter
  data.hits = (data.hits || 0) + 1;
  saveShortUrls(urls);
  
  return data.url;
}

// Get all short URLs (for admin/stats)
export function getAllShortUrls(): ShortUrl[] {
  const urls = loadShortUrls();
  return Object.values(urls).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

// Delete a short URL
export function deleteShortUrl(code: string): boolean {
  const urls = loadShortUrls();
  
  if (!urls[code]) {
    return false;
  }
  
  delete urls[code];
  saveShortUrls(urls);
  
  return true;
}
