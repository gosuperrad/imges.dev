import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation",
  description: "Complete API reference for imges.dev placeholder image generator. Learn how to generate custom images with gradients, text, emojis, and more.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-5xl font-bold text-slate-900">
            API Documentation
          </h1>
          <p className="text-xl text-slate-600">
            Generate custom placeholder images with a simple URL-based API
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">
            Quick Start
          </h2>
          <p className="mb-4 text-slate-600">
            The simplest way to generate an image:
          </p>
          <div className="overflow-hidden rounded-lg bg-slate-900 p-4">
            <code className="text-sm text-green-400">
              https://imges.dev/800x600
            </code>
          </div>
          <div className="mt-4 flex justify-center">
            <img
              src="/800x600"
              alt="800x600 placeholder"
              className="rounded-lg border-2 border-slate-300 shadow-lg"
            />
          </div>
        </section>

        {/* URL Structure */}
        <section className="mb-16">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">
            URL Structure
          </h2>
          <div className="overflow-hidden rounded-lg bg-slate-900 p-4">
            <code className="text-sm text-green-400">
              https://imges.dev/[dimensions]/[bg-color]/[fg-color]?[params]
            </code>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-slate-900">
                [dimensions] <span className="text-red-500">*required</span>
              </h3>
              <p className="text-slate-600">
                Format: <code className="rounded bg-slate-200 px-2 py-1">WIDTHxHEIGHT</code>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Examples: 800x600, 1920x1080, 300x200
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-slate-900">
                [bg-color] <span className="text-slate-400">optional</span>
              </h3>
              <p className="text-slate-600">
                Hex color code without # (default: cccccc)
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Examples: 3b82f6, ff0000, random
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-slate-900">
                [fg-color] <span className="text-slate-400">optional</span>
              </h3>
              <p className="text-slate-600">
                Text color hex code without # (default: 333333)
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Examples: ffffff, 000000, random
              </p>
            </div>
          </div>
        </section>

        {/* Parameters */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">
            Query Parameters
          </h2>
          
          <div className="space-y-8">
            {/* Text */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                text
              </h3>
              <p className="mb-3 text-slate-600">
                Custom text to display on the image. Supports emojis!
              </p>
              <div className="mb-3 rounded bg-slate-50 p-3">
                <code className="text-sm text-slate-700">
                  /800x600?text=Hello%20World
                </code>
              </div>
              <img
                src="/800x600?text=Hello%20World"
                alt="Example with text"
                className="rounded border border-slate-200"
              />
            </div>

            {/* Size */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                size
              </h3>
              <p className="mb-3 text-slate-600">
                Font size in pixels (default: auto-calculated)
              </p>
              <div className="mb-3 rounded bg-slate-50 p-3">
                <code className="text-sm text-slate-700">
                  /800x600?text=Big%20Text&size=80
                </code>
              </div>
              <img
                src="/800x600?text=Big%20Text&size=80"
                alt="Example with custom size"
                className="rounded border border-slate-200"
              />
            </div>

            {/* Weight */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                weight
              </h3>
              <p className="mb-3 text-slate-600">
                Font weight: normal, bold, or 100-900
              </p>
              <div className="mb-3 rounded bg-slate-50 p-3">
                <code className="text-sm text-slate-700">
                  /800x600?text=Bold&weight=bold
                </code>
              </div>
              <img
                src="/800x600?text=Bold&weight=bold"
                alt="Example with bold text"
                className="rounded border border-slate-200"
              />
            </div>

            {/* Style */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                style
              </h3>
              <p className="mb-3 text-slate-600">
                Font style: normal or italic
              </p>
              <div className="mb-3 rounded bg-slate-50 p-3">
                <code className="text-sm text-slate-700">
                  /800x600?text=Italic&style=italic
                </code>
              </div>
              <img
                src="/800x600?text=Italic&style=italic"
                alt="Example with italic text"
                className="rounded border border-slate-200"
              />
            </div>

            {/* Align */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                align
              </h3>
              <p className="mb-3 text-slate-600">
                Vertical alignment: top, center, bottom, or custom
              </p>
              <div className="mb-3 rounded bg-slate-50 p-3">
                <code className="text-sm text-slate-700">
                  /800x600?text=Top&align=top
                </code>
              </div>
              <img
                src="/800x600?text=Top&align=top"
                alt="Example with top alignment"
                className="rounded border border-slate-200"
              />
            </div>

            {/* Border */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                border
              </h3>
              <p className="mb-3 text-slate-600">
                Border width in pixels
              </p>
              <div className="mb-3 rounded bg-slate-50 p-3">
                <code className="text-sm text-slate-700">
                  /800x600?border=10&borderColor=ff0000
                </code>
              </div>
              <img
                src="/800x600?border=10&borderColor=ff0000"
                alt="Example with border"
                className="rounded border border-slate-200"
              />
            </div>

            {/* Format */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                format
              </h3>
              <p className="mb-3 text-slate-600">
                Image format: png, jpeg, or webp (default: webp)
              </p>
              <div className="mb-3 rounded bg-slate-50 p-3">
                <code className="text-sm text-slate-700">
                  /800x600.png or /800x600?format=png
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">
            Advanced Features
          </h2>

          <div className="space-y-8">
            {/* Gradients */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Gradients
              </h3>
              <p className="mb-3 text-slate-600">
                Use two colors separated by a dash for linear gradients
              </p>
              <div className="mb-3 rounded bg-slate-50 p-3">
                <code className="text-sm text-slate-700">
                  /800x600/3b82f6-8b5cf6/ffffff?text=Gradient
                </code>
              </div>
              <img
                src="/800x600/3b82f6-8b5cf6/ffffff?text=Gradient"
                alt="Gradient example"
                className="rounded border border-slate-200"
              />
            </div>

            {/* Retina */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Retina (@2x, @3x)
              </h3>
              <p className="mb-3 text-slate-600">
                High-resolution images for retina displays
              </p>
              <div className="mb-3 rounded bg-slate-50 p-3">
                <code className="text-sm text-slate-700">
                  /800x600@2x or /800x600@3x
                </code>
              </div>
              <p className="text-sm text-slate-500">
                Generates an image at 2x or 3x the specified dimensions
              </p>
            </div>

            {/* Random Colors */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Random Colors
              </h3>
              <p className="mb-3 text-slate-600">
                Use "random" for background or foreground colors
              </p>
              <div className="mb-3 rounded bg-slate-50 p-3">
                <code className="text-sm text-slate-700">
                  /800x600/random/ffffff
                </code>
              </div>
              <p className="text-sm text-slate-500">
                Each request generates a different random color
              </p>
            </div>

            {/* Emojis */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Emoji Support
              </h3>
              <p className="mb-3 text-slate-600">
                Full color emoji support using Twemoji
              </p>
              <div className="mb-3 rounded bg-slate-50 p-3">
                <code className="text-sm text-slate-700">
                  /800x600?text=Hello%20👋%20World%20🌍
                </code>
              </div>
              <img
                src="/800x600?text=Hello%20👋%20World%20🌍"
                alt="Emoji example"
                className="rounded border border-slate-200"
              />
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">
            Example URLs
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <code className="mb-3 block text-sm text-slate-700">
                /1920x1080/3b82f6-8b5cf6/ffffff?text=Hero%20Image&size=100&weight=bold
              </code>
              <img
                src="/1920x1080/3b82f6-8b5cf6/ffffff?text=Hero%20Image&size=100&weight=bold"
                alt="Hero image example"
                className="w-full rounded border border-slate-200"
              />
            </div>
            
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <code className="mb-3 block text-sm text-slate-700">
                /400x300/random/ffffff?text=Card&border=5&borderColor=000000
              </code>
              <img
                src="/400x300/random/ffffff?text=Card&border=5&borderColor=000000"
                alt="Card example"
                className="w-full rounded border border-slate-200"
              />
            </div>
          </div>
        </section>

        {/* Limits */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">
            Limits & Best Practices
          </h2>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <ul className="space-y-2 text-slate-600">
              <li>• Maximum dimensions: 4000x4000 pixels</li>
              <li>• Minimum dimensions: 1x1 pixels</li>
              <li>• Images are cached for optimal performance</li>
              <li>• WebP format recommended for best compression</li>
              <li>• URL-encode special characters in text</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-8 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
