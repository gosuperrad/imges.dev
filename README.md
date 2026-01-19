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
- **Analytics tracking** - Track popular sizes, colors, and features used

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

## Analytics

imges.dev tracks anonymous usage analytics in production to understand popular sizes, colors, and features.

**Tracked data:**
- Image dimensions
- Background and foreground colors
- Image formats (PNG, JPEG, WebP)
- Features used (text, borders, blur, patterns, gradients, custom fonts)

Analytics are powered by Prisma + PostgreSQL running on Railway. No personally identifiable information is collected. The analytics dashboard is password-protected for internal use only.

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to see the landing page with examples.

## Deployment

This project is deployed on Railway with automatic deployments from the `main` branch.

### Railway Setup

1. **PostgreSQL Database**: Add the PostgreSQL plugin to your Railway project
2. **Environment Variables**: Configure in your main service:
   - `DATABASE_URL=${{Postgres.DATABASE_URL}}` (links to internal database URL - avoids egress fees)

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
- Prisma ORM + PostgreSQL for analytics
- Deployed on Railway

## Security

### Rate Limiting
- **100 requests per minute** per IP address
- Applies to image generation endpoints only (`/[...params]`)
- Returns `429 Too Many Requests` with `Retry-After` header when exceeded
- Automatic cleanup of expired rate limit records

### Resource Limits
- **Maximum 4 megapixels** per image (including scale multiplier)
  - Example: 2000×2000 = 4M pixels ✓
  - Example: 2000×2000@2x = 16M pixels ✗ (exceeds limit)
- **Complexity scoring** prevents resource exhaustion from combining expensive effects
  - Factors: pixel count, blur amount, noise, shadows, patterns, gradients
  - Maximum complexity score: 15
- **Text validation**: Limited to 1000 characters with control character sanitization

### Analytics Access Control
Set `ANALYTICS_TOKEN` environment variable in Railway to protect the `/analytics` dashboard:

```bash
# In Railway environment variables
ANALYTICS_TOKEN=your-secure-token-here
```

Login at `/analytics/login` with your token to access analytics. If no token is set, analytics remain publicly accessible (not recommended for production).

### Security Headers
Configured via `next.config.ts`:
- **Content Security Policy (CSP)**: Restricts resource loading to trusted sources
- **X-Frame-Options**: `SAMEORIGIN` (prevents clickjacking)
- **X-Content-Type-Options**: `nosniff` (prevents MIME sniffing)
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: Disables camera, microphone, geolocation
- **X-Robots-Tag**: `noindex` for `/analytics`, index for public pages

### Privacy
- No personally identifiable information (PII) collected
- No cookies for end users (analytics auth uses httpOnly cookies)
- No IP address logging in analytics
- See [Privacy Policy](https://imges.dev/privacy) for full details

### Best Practices
- All dependencies regularly updated via Dependabot
- TypeScript strict mode enabled
- Security audits via `npm audit` in CI/CD pipeline
- Public repository (no sensitive data in commits)

## Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up database (optional - analytics won't work locally without this)
# 1. Add PostgreSQL connection string to .env:
#    DATABASE_URL="postgresql://user:password@host:port/database"
# 2. Run Prisma migrations:
npx prisma migrate dev

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit http://localhost:3000 to use the interactive image builder.

**Note:** Analytics tracking is disabled in development mode to avoid polluting production data. To test analytics locally, temporarily change the environment check in `lib/analytics.ts`.

## Contributing

This project follows [Git Flow](./GIT_FLOW.md) branching model:

- `main` - Production branch
- `develop` - Integration branch
- `feature/*` - Feature branches
- `ci/*` - CI/CD related branches

See [CHANGELOG.md](./CHANGELOG.md) for project history.
