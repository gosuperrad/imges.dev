# imges.dev

A lightweight, fast placeholder image service built with Next.js and deployable to Cloudflare Pages.

## Features

- Dynamic image generation with custom dimensions
- Custom background and foreground colors
- Custom text overlays
- Edge caching for lightning-fast delivery
- Zero-config deployment to Cloudflare Pages

## URL Format

```
imges.dev/[width]x[height]/[bg-color]/[fg-color]?text=[custom-text]
```

### Parameters

- `width x height` - Image dimensions (required)
- `bg-color` - Background color in hex without # (optional, default: cccccc)
- `fg-color` - Text color in hex without # (optional, default: 333333)
- `text` - Custom text to display (optional, default: dimensions)

## Examples

```
/640x360
/640x360/3b82f6
/640x360/1e293b/f97316
/640x360/8b5cf6/ffffff?text=Hello+World
```

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to see the landing page with examples.

## Deployment to Cloudflare Pages

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy:
```bash
npm run deploy
```

Or connect your repository to Cloudflare Pages for automatic deployments.

## Tech Stack

- Next.js 14+ (App Router)
- Canvas API for image generation
- OpenNext Cloudflare adapter
- TailwindCSS for landing page
- TypeScript

## License

MIT
