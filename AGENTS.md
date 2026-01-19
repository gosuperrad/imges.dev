# AGENTS.md - Developer Guide for imges.dev

This guide is for AI coding agents and developers working on imges.dev, a Next.js 16 placeholder image generator deployed on Railway.

## 🚨 Important Reminders

**Before completing any task:**
1. ✅ **Update CHANGELOG.md** - Add your changes under `[Unreleased]` with the appropriate category and PR number
2. ✅ **Use merge commits** - When merging develop → main, use `--merge` (NOT `--squash`)
3. ✅ **Test locally** - Run `npm run build` and `npx tsc --noEmit` before creating PR
4. ✅ **Check Railway logs** - Verify deployments succeed and migrations run

## Project Overview

**Stack**: Next.js 16 (App Router), TypeScript, React 19, TailwindCSS 4, node-canvas, Sharp
**Purpose**: Generate custom placeholder images on-the-fly with extensive customization options
**Deployment**: Railway (Docker)
**Repository**: Public (unlimited GitHub Actions minutes)

## Build, Lint, Test Commands

### Development
```bash
npm install --legacy-peer-deps    # Install dependencies (required for picomatch peer dep)
npm run dev                        # Start dev server at http://localhost:3000
```

### Build & Production
```bash
npm run build                      # Build Next.js for production
npm start                          # Start production server (port: $PORT or 3000)
```

### Code Quality
```bash
npm run lint                       # Run ESLint
npx tsc --noEmit                  # TypeScript type checking (no test framework currently)
npm audit --audit-level=high      # Security audit
```

### System Dependencies (for canvas/sharp)
```bash
# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman

# Ubuntu/Debian (CI uses this)
sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev \
  libjpeg-dev libgif-dev librsvg2-dev
```

**Note**: Currently no test framework (Jest/Vitest). Tests are manual and via CI smoke tests.

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode**: Enabled (`strict: true`)
- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **Path alias**: `@/*` maps to project root

### Import Style
```typescript
// External packages first (React, Next.js, third-party)
import { NextRequest, NextResponse } from "next/server";
import { createCanvas } from "canvas";
import sharp from "sharp";

// Internal imports with @ alias
import { validateFont, loadGoogleFont } from "@/lib/fonts";

// Types
interface ImageParams {
  width: number;
  height: number;
}
```

**Order**: Next.js → React → Third-party → Internal (`@/`) → Types/Interfaces

### Formatting
- **Quotes**: Double quotes for strings (`"hello"`)
- **Semicolons**: Required (Next.js ESLint enforces this)
- **Indentation**: 2 spaces
- **Line length**: No strict limit, but keep readable (~100 chars preferred)
- **Trailing commas**: Use in arrays/objects for cleaner diffs

### Naming Conventions
- **Files**: kebab-case for components (`image-builder.tsx`), PascalCase for React components is acceptable
- **Components**: PascalCase (`ImageBuilder`, `ExampleCard`)
- **Functions**: camelCase (`parseParams`, `generateRandomColor`)
- **Constants**: UPPER_SNAKE_CASE (`SUPPORTED_FONTS`, `CACHE_DIR`)
- **Types/Interfaces**: PascalCase (`ImageParams`, `RenderOptions`)
- **Routes**: Next.js App Router conventions (`[...params]/route.ts`)

### Type Annotations
```typescript
// Always type function parameters and return types
function parseParams(params: string[]): ImageParams | null {
  // ...
}

// Use const assertions for readonly objects
export const SUPPORTED_FONTS = {
  "inter": "Inter",
  "roboto": "Roboto",
} as const;

// Extract types from constants
export type SupportedFontKey = keyof typeof SUPPORTED_FONTS;

// Prefer interfaces for object shapes
interface RenderOptions {
  text: string;
  fontSize?: number;  // Use optional (?) for optional fields
}
```

### Component Patterns
```typescript
// Client components - explicit directive at top
'use client';

import { useState } from 'react';

export function ImageBuilder() {
  const [config, setConfig] = useState<ImageConfig>({ /* ... */ });
  // ...
}

// Server components - no 'use client', can be async
export default async function DocsPage() {
  return <div>...</div>;
}
```

### Error Handling
```typescript
// Return error responses with proper status codes
if (!params) {
  return NextResponse.json(
    { error: "Invalid parameters" },
    { status: 400 }
  );
}

// Use try-catch for async operations
try {
  const fontPath = await loadGoogleFont(fontKey);
  registerFont(fontPath, { family: fontName });
} catch (error) {
  console.error(`Failed to load font ${fontKey}:`, error);
  // Fallback to default
}

// Validate inputs early
if (width < 1 || width > 4000 || height < 1 || height > 4000) {
  return null;
}
```

### Async/Await
- Always use `async/await` over promises (`.then()`)
- Use `try/catch` for error handling
- Prefer `Promise.all()` for parallel operations

### Comments
```typescript
// Use JSDoc for public functions
/**
 * Download a font file from Google Fonts CSS API and extract TTF URL
 */
async function downloadFont(fontKey: SupportedFontKey): Promise<string> {
  // Implementation comments in plain //
}

// Inline comments for complex logic
const a = (s * Math.min(l, 1 - l)) / 100;  // HSL to RGB conversion
```

## Architecture Patterns

### Route Handlers
- Image generation: `app/[...params]/route.ts` - Catch-all dynamic route
- OG images: `app/og-image/route.ts` - Dedicated OG image endpoint
- Use `NextRequest` and `NextResponse` for type safety

### Utility Libraries
- Font management: `lib/fonts.ts` - Downloads, caches, and registers Google Fonts
- Keep utilities pure and testable

### State Management
- Client components: React `useState` for local state
- No global state management (Redux/Zustand) - keep it simple

### Caching
- Google Fonts cached in `.next/cache/fonts/`
- In-memory Set to track registered fonts (prevents re-registration)

## Common Patterns

### Canvas Drawing
```typescript
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Always set properties before drawing
ctx.fillStyle = bgColor;
ctx.fillRect(0, 0, width, height);
```

### Image Format Conversion
```typescript
// Use Sharp for format conversion (Canvas → Sharp → Output)
const buffer = canvas.toBuffer('image/png');
const converted = await sharp(buffer)
  .webp({ quality: 90 })
  .toBuffer();
```

## Important Notes

- **Legacy peer deps**: Always use `npm install --legacy-peer-deps` (picomatch issue)
- **Node version**: Use Node.js 20 (matches `@types/node` version)
- **No major @types/node updates**: Dependabot configured to ignore (stay on v20)
- **Public repo**: No sensitive data in commits (already public)
- **Git Flow**: Use feature branches (`feature/*`, `fix/*`, `chore/*`), PR to `develop`, then `main`

## CI/CD

- **Workflows**: Build, TypeScript check, ESLint, security audit
- **PR checks**: Auto-label size (xs, s, m, l, xl)
- **Dependabot**: Weekly updates (Mondays 9 AM), grouped by type
- All workflows in `.github/workflows/`

## Resources

- Documentation: `/docs` route
- Examples: `/examples` route  
- CHANGELOG: Track all changes
- README: User-facing documentation
