# GitHub Copilot Instructions for imges.dev

This file provides instructions to GitHub Copilot for generating code that follows imges.dev project standards.

## Project Context

imges.dev is a Next.js 16 placeholder image generator with extensive customization options. The project uses:
- **Stack**: Next.js 16 (App Router), TypeScript, React 19, TailwindCSS 4, node-canvas, Sharp
- **Deployment**: Railway (Docker)
- **Git Flow**: Feature branches → `develop` → `main`

## Code Style

### TypeScript
- Use strict TypeScript with explicit types for all function parameters and return values
- Prefer interfaces over types for object shapes
- Use `as const` for readonly constants
- Extract types from constants: `type FontKey = keyof typeof SUPPORTED_FONTS;`
- Enable strict mode is enabled - no implicit any

### Formatting
- Use **double quotes** for strings: `"hello"` not `'hello'`
- **Always use semicolons** (enforced by ESLint)
- Indentation: **2 spaces** (no tabs)
- Line length: ~100 characters preferred
- Use trailing commas in arrays/objects for cleaner diffs

### Naming Conventions
- **Files**: kebab-case (`image-builder.tsx`)
- **Components**: PascalCase (`ImageBuilder`, `ExampleCard`)
- **Functions**: camelCase (`parseParams`, `generateRandomColor`)
- **Constants**: UPPER_SNAKE_CASE (`SUPPORTED_FONTS`, `MAX_WIDTH`)
- **Types/Interfaces**: PascalCase (`ImageParams`, `RenderOptions`)

### Import Order
```typescript
// 1. Next.js and React
import { NextRequest, NextResponse } from "next/server";
import { useState } from "react";

// 2. Third-party libraries
import { createCanvas } from "canvas";
import sharp from "sharp";

// 3. Internal imports with @ alias
import { validateFont } from "@/lib/fonts";

// 4. Types and interfaces
interface ImageParams {
  width: number;
  height: number;
}
```

## Component Patterns

### Client Components
```typescript
'use client';  // Must be at the very top

import { useState } from 'react';

export function ImageBuilder() {
  const [config, setConfig] = useState<ImageConfig>({ /* ... */ });
  return <div>...</div>;
}
```

### Server Components
```typescript
// No 'use client' directive - server component by default
// Can be async
export default async function DocsPage() {
  return <div>...</div>;
}
```

## Error Handling

### API Route Errors
Return detailed, structured error responses with helpful messages:
```typescript
if (!imageParams) {
  return NextResponse.json(
    {
      error: "Invalid dimensions",
      message: "Dimensions must be in format WIDTHxHEIGHT",
      received: params[0],
      expected: "800x600 or 300",
      suggestion: "Try: /800x600 or /300 for a square",
      docs: "https://imges.dev/docs",
      examples: ["https://imges.dev/800x600"]
    },
    { status: 400 }
  );
}
```

### Async Error Handling
```typescript
// Always use try-catch for async operations
try {
  const result = await someAsyncFunction();
} catch (error) {
  console.error("Descriptive error message:", error);
  // Handle error or fallback
}
```

### Validation
- Validate inputs early in functions
- Return early on invalid input
- Provide specific error messages with received vs expected values

## Best Practices

### Functions
- Always type parameters and return values explicitly
- Use JSDoc comments for public functions
- Keep functions focused and single-purpose
- Prefer pure functions when possible

### Async/Await
- **Always** use `async/await`, never `.then()` chains
- Use `Promise.all()` for parallel operations
- Handle errors with try-catch blocks

### React Hooks
- Follow React hooks rules (only call at top level)
- Use `useMemo` for expensive calculations
- Use `useCallback` for function references passed as props
- Don't call setState synchronously within useEffect (anti-pattern)

### Comments
```typescript
/**
 * JSDoc for public functions - describe what it does, params, and returns
 */
function parseParams(params: string[]): ImageParams | null {
  // Inline comments for complex logic
  const width = parseInt(params[0]);  // Extract width from first param
}
```

## Common Patterns

### Route Handlers
```typescript
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ params: string[] }> }
) {
  const { params } = await context.params;
  
  // Validate params
  if (!params || params.length === 0) {
    return NextResponse.json({ error: "..." }, { status: 400 });
  }
  
  // Process and return
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
```

### Canvas Drawing
```typescript
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Always set properties BEFORE drawing
ctx.fillStyle = bgColor;
ctx.fillRect(0, 0, width, height);
```

### Image Conversion
```typescript
// Use Sharp for format conversion
const buffer = canvas.toBuffer('image/png');
const converted = await sharp(buffer)
  .webp({ quality: 90 })
  .toBuffer();
```

## What NOT to Do

- ❌ Don't use single quotes for strings
- ❌ Don't omit semicolons
- ❌ Don't use `.then()` chains (use async/await)
- ❌ Don't use implicit `any` types
- ❌ Don't create new files when editing existing ones will work
- ❌ Don't use `var` (use `const` or `let`)
- ❌ Don't mutate props or state directly
- ❌ Don't call setState synchronously in useEffect
- ❌ Don't use `<img>` tags (use Next.js `<Image>` component when appropriate)
- ❌ Don't use `<a>` for internal navigation (use Next.js `<Link>`)

## Git & Development

### Branch Naming
- Features: `feature/description`
- Fixes: `fix/description`
- Chores: `chore/description`

### Commit Messages
Follow conventional commits:
```
feat: add support for gradient backgrounds
fix: resolve color parsing issue
docs: update API documentation
chore: update dependencies
```

### Development Commands
```bash
npm install --legacy-peer-deps  # Required (picomatch peer dep issue)
npm run dev                     # Start dev server
npm run build                   # Production build
npm run lint                    # ESLint
npx tsc --noEmit               # TypeScript check
```

## Dependencies

- **Node.js**: 20 (don't update @types/node beyond v20)
- **Install**: Always use `npm install --legacy-peer-deps`
- **Canvas/Sharp**: Require system libraries (see AGENTS.md)

## Project-Specific Notes

- This is a **public repository** - never commit sensitive data
- No test framework currently - tests are manual
- Images are cached with immutable headers
- WebP is the default/recommended format
- Max dimensions: 4000x4000 pixels
- URL encode special characters in text parameter
- Follow Git Flow: feature → develop → main

## Error Response Standards

All error responses should include:
- `error`: Short error title
- `message`: Detailed explanation
- `received`: What the user provided (when applicable)
- `expected`: What format/value is expected
- `suggestion`: Actionable fix suggestion
- `docs`: Link to documentation
- `examples`: Array of working example URLs

## Documentation

When adding new features:
1. Update `/docs` page with examples
2. Update `README.md` if it's a major feature
3. Add to `CHANGELOG.md`
4. Include examples in the `/examples` page if applicable

## For Code Reviews

When reviewing code, check for:
- TypeScript strict mode compliance
- Proper error handling with detailed messages
- Correct import order
- Double quotes and semicolons
- Appropriate use of async/await
- JSDoc comments on public functions
- No security vulnerabilities
- Follows naming conventions
