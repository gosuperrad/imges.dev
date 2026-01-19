# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- URL shortener with memorable word-based codes (e.g., `/s/neon-grid`, `/s/blue-cat`)
- POST `/api/shorten` endpoint to create short URLs
- Custom short code support (3-50 characters, lowercase, hyphens, numbers)
- Short URL redirect handler at `/s/[code]`
- "Shorten" button in Image Builder UI
- Hit counter for short URLs
- URL shortener documentation section
- File-based JSON storage for short URLs (`data/short-urls.json`)
- GitHub Actions CI/CD workflows
- Dependabot configuration for automated dependency updates
- CodeQL security scanning
- Custom fonts support with 20+ Google Fonts
- Rounded corners parameter (radius)
- Shadow effects parameter (shadow, shadowColor)
- Noise/grain texture effect (noise)
- Pattern overlays: dots, stripes, checkerboard, grid (pattern, patternColor)
- Font showcase section in documentation
- Full URL display in image builder
- Comprehensive font examples
- New pattern examples in examples gallery
- Caching headers for optimal performance (Cache-Control: public, max-age=31536000, immutable)

### Changed
- Improved contrast in footer CTA section
- Streamlined homepage layout
- Enhanced documentation with visual font previews
- Updated API documentation with noise and pattern parameters
- Added 8 new examples showcasing noise and pattern effects

### Fixed
- Font loading to use TTF format compatible with node-canvas
- Contrast issues in various UI components

## [1.0.0] - Initial Release

### Added
- Dynamic placeholder image generation
- Custom dimensions support (up to 4000x4000)
- Custom text with emoji support via Twemoji
- Gradient backgrounds
- Multiple image formats (PNG, JPEG, WebP)
- Retina display support (@2x, @3x)
- Interactive image builder
- API documentation
- Examples gallery
- Border customization
- Text alignment options
- Custom font sizing and styling
