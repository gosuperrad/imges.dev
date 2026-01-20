# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## 📝 Maintenance Instructions

**For Contributors & AI Agents:**

When making changes to this project, please update this CHANGELOG:

1. **Add entries under `[Unreleased]`** for any changes you make
2. **Categorize changes** using these sections:
   - `### Added` - New features
   - `### Changed` - Changes to existing functionality
   - `### Deprecated` - Soon-to-be removed features
   - `### Removed` - Removed features
   - `### Fixed` - Bug fixes
   - `### Security` - Security improvements
3. **Use clear, concise descriptions** (see existing entries for examples)
4. **Include PR numbers** in format: `(#123)`
5. **Update before merging** to develop or main

**When releasing a version:**
1. Move all `[Unreleased]` entries to a new version section (e.g., `## [1.2.0] - 2026-01-19`)
2. Clear out the `[Unreleased]` section
3. Update version numbers in `package.json`

---

## [Unreleased]

### Added
- Analytics tracking system with PostgreSQL database (#19)
  - Analytics dashboard at `/analytics` showing usage statistics
  - Track popular dimensions, colors, formats, and features
  - Optional authentication via `ANALYTICS_TOKEN` environment variable
  - Privacy-focused: no PII collected
- Debug endpoint at `/analytics/debug` for verifying token configuration (#25)
- Privacy policy page at `/privacy` (#20)
- Rate limiting: 100 requests/minute for images, 5/minute for login (#20)
- Security headers: CSP, X-Frame-Options, X-Content-Type-Options, etc. (#20)
- Resource complexity limits to prevent abuse (#20)
- Square image shorthand: `/300` generates 300×300 (#17)
- Prisma migrations run automatically on container startup (#26)
- LICENSE file with CC BY-NC 4.0 (non-commercial license)
- Expanded ImageBuilder presets:
  - 24 size presets (social media, video, mobile, web/UI)
  - 32 color presets (vibrant, pastel, dark, light, nature, neon, professional)

### Changed
- Analytics page now uses dynamic rendering to enforce authentication (#27)
- Analytics dashboard is password-protected (not publicly advertised)
- Improved error messages with field-specific validation and suggestions (#18)
- Error responses now include `docs` URL for reference (#18)

### Fixed
- TypeScript type errors in analytics page map callbacks (#22)
- Prisma client generation in Docker build process (#23)
- Analytics authentication now properly enforced (#24, #27)
- Same-site referrers excluded from analytics to prevent data pollution (#29)
- Git Flow: Use merge commits instead of squash for develop → main
- Bold font weight now works correctly with Google Fonts (downloads specific weight variants)
- Fixed duplicate "Noise" slider in ImageBuilder - first slider now correctly labeled as "Border"

### Removed
- @3x retina support (most sizes exceed 4000px limit when tripled)
- Shadow parameter (canvas shadows extend outside image bounds - not fixable)
- 4K preset from ImageBuilder (exceeds 4000px dimension limit)

---

## [1.0.0] - 2024-01-XX - Initial Release

### Added
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
