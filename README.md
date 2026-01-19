# imges.dev

[![CI](https://github.com/gosuperrad/imges.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/gosuperrad/imges.dev/actions/workflows/ci.yml)

A lightweight, fast placeholder image service built with Next.js and deployed on Railway.

## Features

- Dynamic image generation with custom dimensions
- Custom background and foreground colors (solid or gradients)
- Custom text overlays with emoji support (Twemoji)
- 20+ Google Fonts across 4 categories (Sans-Serif, Serif, Monospace, Display)
- Visual effects: rounded corners, drop shadows
- Multiple formats: PNG, JPEG, WebP
- Retina support (@2x, @3x)
- Interactive image builder on homepage

## URL Format

```
imges.dev/[width]x[height]/[bg-color]/[fg-color].[format]?text=[custom-text]&font=[font-name]&radius=[px]&shadow=[px]
```

**Square images shorthand:**
```
imges.dev/[size]/[bg-color]/[fg-color].[format]?text=[custom-text]
```

### Parameters

- `width x height` - Image dimensions (required), or just `size` for square images
  - Examples: `640x360`, `300` (creates 300x300)
- `bg-color` - Background color in hex without # (optional, default: cccccc)
  - Supports gradients: use `-` separator (e.g., `3b82f6-8b5cf6`)
- `fg-color` - Text color in hex without # (optional, default: 333333)
- `format` - Output format: png, jpg, webp (optional, default: webp)
- `text` - Custom text to display with emoji support (optional, default: dimensions)
- `font` - Font name from 20+ Google Fonts (optional, default: inter)
- `radius` - Rounded corners in pixels, 0-500 (optional, default: 0)
- `shadow` - Drop shadow size in pixels, 0-100 (optional, default: 0)
- `shadowColor` - Shadow color in hex without # (optional, default: 000000)
- `retina` - Retina multiplier: 2 or 3 for @2x/@3x (optional)

## Examples

```
# Standard dimensions
/640x360
/640x360/3b82f6
/640x360/1e293b/f97316

# Square images (shorthand)
/300
/300/3b82f6
/300.png
/300@2x

# With customization
/640x360/8b5cf6/ffffff?text=Hello+World
/800x600/3b82f6-8b5cf6.webp?text=Gradient&font=playfair-display&radius=20
/1200x630.jpg?text=🚀+Launch+Day&font=inter&shadow=30&shadowColor=000000
```

Visit [imges.dev/examples](https://imges.dev/examples) for a full gallery of examples.

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to see the landing page with examples.

## Deployment

This project is deployed on Railway with automatic deployments from the `main` branch.

### System Dependencies

The following system libraries are required for canvas/sharp:

- libcairo2-dev
- libpango1.0-dev
- libjpeg-dev
- libgif-dev
- librsvg2-dev
- libpixman-1-dev

These are included in the Dockerfile for Railway deployment.

## Tech Stack

- Next.js 16 (App Router)
- node-canvas for image generation
- Sharp for image format conversion
- Google Fonts API for custom fonts
- Twemoji for emoji support
- TailwindCSS 4 for styling
- TypeScript
- Deployed on Railway

## Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit http://localhost:3000 to use the interactive image builder.

## Contributing

This project follows [Git Flow](./GIT_FLOW.md) branching model:

- `main` - Production branch
- `develop` - Integration branch
- `feature/*` - Feature branches
- `ci/*` - CI/CD related branches

See [CHANGELOG.md](./CHANGELOG.md) for project history.
