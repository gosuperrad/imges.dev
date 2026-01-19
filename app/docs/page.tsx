import { Metadata } from "next";
import { Heading, Subheading } from '../components/catalyst/heading';
import { Text, Code } from '../components/catalyst/text';
import { Badge } from '../components/catalyst/badge';
import { StackedLayout } from '../components/catalyst/stacked-layout';

export const metadata: Metadata = {
  title: "API Documentation",
  description: "Complete API reference for imges.dev placeholder image generator. Learn how to generate custom images with gradients, text, emojis, and more.",
};

interface ParamCardProps {
  name: string;
  description: string;
  example: string;
  imageUrl: string;
}

function ParamCard({ name, description, example, imageUrl }: ParamCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <Subheading level={3} className="mb-2">
        {name}
      </Subheading>
      <Text className="mb-3">
        {description}
      </Text>
      <div className="mb-3 rounded bg-zinc-50 p-3 dark:bg-zinc-900">
        <Code className="text-sm">{example}</Code>
      </div>
      <img
        src={imageUrl}
        alt={`Example: ${name}`}
        className="w-full rounded border border-zinc-200 dark:border-zinc-800"
        loading="lazy"
      />
    </div>
  );
}

export default function DocsPage() {
  return (
    <StackedLayout>
      <Heading className="text-2xl/8 font-semibold sm:text-xl/8 mb-2">
        API Documentation
      </Heading>
      <Text className="text-zinc-600 dark:text-zinc-400 mb-8">
        Generate custom placeholder images with a simple URL-based API
      </Text>

      <hr className="mb-12 w-full border-t border-zinc-950/10 dark:border-white/10" />

        {/* Quick Start */}
        <section className="mb-16">
          <Subheading className="mb-4">
            Quick Start
          </Subheading>
          <Text className="mb-4">
            The simplest way to generate an image:
          </Text>
          <div className="overflow-hidden rounded-lg bg-zinc-900 p-4 dark:bg-zinc-800 mb-2">
            <Code>https://imges.dev/800x600</Code>
          </div>
          <Text className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            Or use shorthand for square images:
          </Text>
          <div className="overflow-hidden rounded-lg bg-zinc-900 p-4 dark:bg-zinc-800">
            <Code>https://imges.dev/300</Code>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <div className="text-center">
              <img
                src="/800x600"
                alt="800x600 placeholder"
                className="rounded-lg border-2 border-zinc-200 shadow-lg dark:border-zinc-800 mb-2"
              />
              <Code className="text-xs">800x600</Code>
            </div>
            <div className="text-center">
              <img
                src="/300"
                alt="300x300 square placeholder"
                className="rounded-lg border-2 border-zinc-200 shadow-lg dark:border-zinc-800 mb-2"
              />
              <Code className="text-xs">300</Code>
            </div>
          </div>
        </section>

        {/* URL Structure */}
        <section className="mb-16">
          <Subheading className="mb-4">
            URL Structure
          </Subheading>
          <div className="overflow-hidden rounded-lg bg-zinc-900 p-4 dark:bg-zinc-800 mb-2">
            <Code>https://imges.dev/[dimensions]/[bg-color]/[fg-color]?[params]</Code>
          </div>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            For square images, use shorthand: <Code>[size]</Code> instead of <Code>[dimensions]</Code>
          </Text>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-2 flex items-center gap-2">
                <Subheading level={3}>[dimensions]</Subheading>
                <Badge color="red">required</Badge>
              </div>
              <Text>
                Format: <Code>WIDTHxHEIGHT</Code> or <Code>SIZE</Code> (for square)
              </Text>
              <Text className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Examples: <Code>800x600</Code>, <Code>1920x1080</Code>, <Code>300</Code> (creates 300x300)
              </Text>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-2 flex items-center gap-2">
                <Subheading level={3}>[bg-color]</Subheading>
                <Badge color="zinc">optional</Badge>
              </div>
              <Text>
                Hex color code without # (default: cccccc)
              </Text>
              <Text className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Examples: 3b82f6, ff0000, random
              </Text>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-2 flex items-center gap-2">
                <Subheading level={3}>[fg-color]</Subheading>
                <Badge color="zinc">optional</Badge>
              </div>
              <Text>
                Text color hex code without # (default: 333333)
              </Text>
              <Text className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Examples: ffffff, 000000, random
              </Text>
            </div>
          </div>
        </section>

        {/* Parameters */}
        <section className="mb-16">
          <Subheading className="mb-6">
            Query Parameters
          </Subheading>
          
          <div className="space-y-8">
            <ParamCard
              name="text"
              description="Custom text to display on the image. Supports emojis!"
              example="/800x600?text=Hello%20World"
              imageUrl="/800x600?text=Hello%20World"
            />

            <ParamCard
              name="size"
              description="Font size in pixels (default: auto-calculated)"
              example="/800x600?text=Big%20Text&size=80"
              imageUrl="/800x600?text=Big%20Text&size=80"
            />

            <ParamCard
              name="weight"
              description="Font weight: normal, bold, or 100-900"
              example="/800x600?text=Bold&weight=bold"
              imageUrl="/800x600?text=Bold&weight=bold"
            />

            <ParamCard
              name="style"
              description="Font style: normal or italic"
              example="/800x600?text=Italic&style=italic"
              imageUrl="/800x600?text=Italic&style=italic"
            />

            <ParamCard
              name="align"
              description="Vertical alignment: top, center, bottom, or custom"
              example="/800x600?text=Top&align=top"
              imageUrl="/800x600?text=Top&align=top"
            />

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <Subheading level={3} className="mb-2">
                font
              </Subheading>
              <Text className="mb-3">
                Custom font from Google Fonts library. Choose from 20+ popular fonts including Inter, Roboto, Playfair Display, and more.
              </Text>
              <div className="mb-3 rounded bg-zinc-50 p-3 dark:bg-zinc-800">
                <Code className="text-sm">/800x600?text=Fancy%20Font&font=playfair-display</Code>
              </div>
              <img
                src="/800x600?text=Fancy%20Font&font=playfair-display&size=60"
                alt="Font example"
                className="w-full rounded border border-zinc-200 dark:border-zinc-800"
                loading="lazy"
              />
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-400">
                  View all supported fonts
                </summary>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <div><strong>Sans-Serif:</strong> inter, roboto, open-sans, lato, montserrat, poppins, raleway, nunito</div>
                  <div><strong>Serif:</strong> playfair-display, merriweather, lora, roboto-slab</div>
                  <div><strong>Monospace:</strong> roboto-mono, source-code-pro, fira-code, jetbrains-mono</div>
                  <div><strong>Display:</strong> bebas-neue, lobster, pacifico, dancing-script</div>
                </div>
              </details>
            </div>

            <ParamCard
              name="border"
              description="Border width in pixels"
              example="/800x600?border=10&borderColor=ff0000"
              imageUrl="/800x600?border=10&borderColor=ff0000"
            />

            <ParamCard
              name="radius"
              description="Border radius in pixels for rounded corners"
              example="/800x600?text=Rounded&radius=30"
              imageUrl="/800x600/3b82f6/ffffff?text=Rounded&radius=30&size=60"
            />

            <ParamCard
              name="shadow"
              description="Shadow size in pixels (with optional shadowColor parameter)"
              example="/800x600?text=Shadow&shadow=20&shadowColor=000000"
              imageUrl="/800x600/ffffff/333333?text=Shadow&shadow=20&shadowColor=000000&size=60"
            />

            <ParamCard
              name="noise"
              description="Add noise/grain texture effect (0-100). Great for vintage or textured looks."
              example="/800x600?text=Noisy&noise=50"
              imageUrl="/800x600/3b82f6/ffffff?text=Noisy&noise=50&size=60"
            />

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <Subheading level={3} className="mb-2">
                pattern
              </Subheading>
              <Text className="mb-3">
                Add pattern overlay: dots, stripes, checkerboard, or grid (use with patternColor for custom colors)
              </Text>
              <div className="mb-3 rounded bg-zinc-50 p-3 dark:bg-zinc-800">
                <Code className="text-sm">/800x600?pattern=dots&patternColor=3b82f6</Code>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <img
                  src="/300x200/f8fafc/000000?pattern=dots&patternColor=3b82f6&text="
                  alt="Dots pattern"
                  className="w-full rounded border border-zinc-200 dark:border-zinc-800"
                  loading="lazy"
                />
                <img
                  src="/300x200/f8fafc/000000?pattern=stripes&patternColor=8b5cf6&text="
                  alt="Stripes pattern"
                  className="w-full rounded border border-zinc-200 dark:border-zinc-800"
                  loading="lazy"
                />
                <img
                  src="/300x200/f8fafc/000000?pattern=checkerboard&patternColor=10b981&text="
                  alt="Checkerboard pattern"
                  className="w-full rounded border border-zinc-200 dark:border-zinc-800"
                  loading="lazy"
                />
                <img
                  src="/300x200/f8fafc/000000?pattern=grid&patternColor=f59e0b&text="
                  alt="Grid pattern"
                  className="w-full rounded border border-zinc-200 dark:border-zinc-800"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <Subheading level={3} className="mb-2">
                format
              </Subheading>
              <Text className="mb-3">
                Image format: png, jpeg, or webp (default: webp)
              </Text>
              <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-800">
                <Code className="text-sm">/800x600.png or /800x600?format=png</Code>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="mb-16">
          <Subheading className="mb-6">
            Advanced Features
          </Subheading>

          <div className="space-y-8">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <Subheading level={3} className="mb-2">
                Gradients
              </Subheading>
              <Text className="mb-3">
                Use two colors separated by a dash for linear gradients
              </Text>
              <div className="mb-3 rounded bg-zinc-50 p-3 dark:bg-zinc-800">
                <Code className="text-sm">/800x600/3b82f6-8b5cf6/ffffff?text=Gradient</Code>
              </div>
              <img
                src="/800x600/3b82f6-8b5cf6/ffffff?text=Gradient"
                alt="Gradient example"
                className="w-full rounded border border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <Subheading level={3} className="mb-2">
                Retina (@2x, @3x)
              </Subheading>
              <Text className="mb-3">
                High-resolution images for retina displays
              </Text>
              <div className="mb-3 rounded bg-zinc-50 p-3 dark:bg-zinc-800">
                <Code className="text-sm">/800x600@2x or /800x600@3x</Code>
              </div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                Generates an image at 2x or 3x the specified dimensions
              </Text>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <Subheading level={3} className="mb-2">
                Random Colors
              </Subheading>
              <Text className="mb-3">
                Use "random" for background or foreground colors
              </Text>
              <div className="mb-3 rounded bg-zinc-50 p-3 dark:bg-zinc-800">
                <Code className="text-sm">/800x600/random/ffffff</Code>
              </div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                Each request generates a different random color
              </Text>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <Subheading level={3} className="mb-2">
                Emoji Support
              </Subheading>
              <Text className="mb-3">
                Full color emoji support using Twemoji
              </Text>
              <div className="mb-3 rounded bg-zinc-50 p-3 dark:bg-zinc-800">
                <Code className="text-sm">/800x600?text=Hello%20👋%20World%20🌍</Code>
              </div>
              <img
                src="/800x600?text=Hello%20👋%20World%20🌍"
                alt="Emoji example"
                className="w-full rounded border border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <Subheading level={3} className="mb-2">
                Font Showcase
              </Subheading>
              <Text className="mb-4">
                Preview of available custom fonts from Google Fonts
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Text className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Sans-Serif</Text>
                  <div className="space-y-2">
                    <img src="/500x80/f8fafc/1e293b?text=Inter&font=inter&size=32" alt="Inter" className="w-full rounded border border-zinc-200 dark:border-zinc-800" loading="lazy" />
                    <img src="/500x80/f8fafc/1e293b?text=Poppins&font=poppins&size=32" alt="Poppins" className="w-full rounded border border-zinc-200 dark:border-zinc-800" loading="lazy" />
                    <img src="/500x80/f8fafc/1e293b?text=Montserrat&font=montserrat&size=32" alt="Montserrat" className="w-full rounded border border-zinc-200 dark:border-zinc-800" loading="lazy" />
                  </div>
                </div>
                <div>
                  <Text className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Serif</Text>
                  <div className="space-y-2">
                    <img src="/500x80/f8fafc/1e293b?text=Playfair%20Display&font=playfair-display&size=32" alt="Playfair Display" className="w-full rounded border border-zinc-200 dark:border-zinc-800" loading="lazy" />
                    <img src="/500x80/f8fafc/1e293b?text=Merriweather&font=merriweather&size=32" alt="Merriweather" className="w-full rounded border border-zinc-200 dark:border-zinc-800" loading="lazy" />
                    <img src="/500x80/f8fafc/1e293b?text=Lora&font=lora&size=32" alt="Lora" className="w-full rounded border border-zinc-200 dark:border-zinc-800" loading="lazy" />
                  </div>
                </div>
                <div>
                  <Text className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Monospace</Text>
                  <div className="space-y-2">
                    <img src="/500x80/282a36/50fa7b?text=Fira%20Code&font=fira-code&size=28" alt="Fira Code" className="w-full rounded border border-zinc-200 dark:border-zinc-800" loading="lazy" />
                    <img src="/500x80/282a36/50fa7b?text=JetBrains%20Mono&font=jetbrains-mono&size=28" alt="JetBrains Mono" className="w-full rounded border border-zinc-200 dark:border-zinc-800" loading="lazy" />
                  </div>
                </div>
                <div>
                  <Text className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Display</Text>
                  <div className="space-y-2">
                    <img src="/500x80/f8fafc/1e293b?text=BEBAS%20NEUE&font=bebas-neue&size=36" alt="Bebas Neue" className="w-full rounded border border-zinc-200 dark:border-zinc-800" loading="lazy" />
                    <img src="/500x80/fff5f5/d63031?text=Dancing%20Script&font=dancing-script&size=36" alt="Dancing Script" className="w-full rounded border border-zinc-200 dark:border-zinc-800" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-16">
          <Subheading className="mb-6">
            Example URLs
          </Subheading>
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <Code className="mb-3 block text-sm">
                /1920x1080/3b82f6-8b5cf6/ffffff?text=Hero%20Image&size=100&weight=bold
              </Code>
              <img
                src="/1920x1080/3b82f6-8b5cf6/ffffff?text=Hero%20Image&size=100&weight=bold"
                alt="Hero image example"
                className="w-full rounded border border-zinc-200 dark:border-zinc-800"
              />
            </div>
            
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <Code className="mb-3 block text-sm">
                /400x300/random/ffffff?text=Card&border=5&borderColor=000000
              </Code>
              <img
                src="/400x300/random/ffffff?text=Card&border=5&borderColor=000000"
                alt="Card example"
                className="w-full rounded border border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-16">
          <Subheading className="mb-6">
            Error Handling
          </Subheading>
          <Text className="mb-6">
            The API returns detailed JSON error responses when requests are invalid, helping you quickly identify and fix issues.
          </Text>
          
          <div className="space-y-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <Subheading level={3} className="mb-3">
                Error Response Format
              </Subheading>
              <Text className="mb-3">
                All error responses include these fields:
              </Text>
              <div className="rounded bg-zinc-50 p-4 dark:bg-zinc-900">
                <pre className="overflow-x-auto text-sm">
{`{
  "error": "Error title",
  "message": "Detailed error message",
  "received": "The value you provided",
  "expected": "What we expected",
  "suggestion": "How to fix it",
  "docs": "https://imges.dev/docs",
  "examples": [
    "https://imges.dev/800x600",
    "https://imges.dev/300"
  ]
}`}
                </pre>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <Subheading level={3} className="mb-3">
                Common Error Examples
              </Subheading>
              
              <div className="space-y-4">
                <div>
                  <Text className="mb-2 font-semibold">Invalid Dimension Format</Text>
                  <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                    <Code className="text-sm text-red-600 dark:text-red-400">GET /invalid</Code>
                  </div>
                  <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Returns: "Invalid dimension format. Expected: WIDTHxHEIGHT or SIZE (e.g., 800x600 or 300)"
                  </Text>
                </div>

                <div>
                  <Text className="mb-2 font-semibold">Dimensions Out of Range</Text>
                  <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                    <Code className="text-sm text-red-600 dark:text-red-400">GET /5000x5000</Code>
                  </div>
                  <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Returns: "Dimensions exceed maximum allowed size. Max: 4000x4000"
                  </Text>
                </div>

                <div>
                  <Text className="mb-2 font-semibold">Invalid Color Format</Text>
                  <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                    <Code className="text-sm text-red-600 dark:text-red-400">GET /800x600/invalidcolor</Code>
                  </div>
                  <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Returns: "Invalid hex color format. Expected: 3 or 6 hexadecimal digits (e.g., 'fff' or '3b82f6')"
                  </Text>
                </div>

                <div>
                  <Text className="mb-2 font-semibold">Unsupported Format</Text>
                  <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                    <Code className="text-sm text-red-600 dark:text-red-400">GET /800x600.gif</Code>
                  </div>
                  <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Returns: "Unsupported image format. Supported: png, jpeg, webp"
                </Text>
                <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                  <Code className="text-sm text-red-600 dark:text-red-400">GET /invalid</Code>
                </div>
                <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Returns: &quot;Invalid dimension format. Expected: WIDTHxHEIGHT or SIZE (e.g., 800x600 or 300)&quot;
                </Text>
              </div>

              <div>
                <Text className="mb-2 font-semibold">Dimensions Out of Range</Text>
                <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                  <Code className="text-sm text-red-600 dark:text-red-400">GET /5000x5000</Code>
                </div>
                <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Returns: &quot;Dimensions exceed maximum allowed size. Max: 4000x4000&quot;
                </Text>
              </div>

              <div>
                <Text className="mb-2 font-semibold">Invalid Color Format</Text>
                <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                  <Code className="text-sm text-red-600 dark:text-red-400">GET /800x600/invalidcolor</Code>
                </div>
                <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Returns: &quot;Invalid hex color format. Expected: 3 or 6 hexadecimal digits (e.g., &apos;fff&apos; or &apos;3b82f6&apos;)&quot;
                </Text>
              </div>

              <div>
                <Text className="mb-2 font-semibold">Unsupported Format</Text>
                <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                  <Code className="text-sm text-red-600 dark:text-red-400">GET /800x600.gif</Code>
                </div>
                <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Returns: &quot;Unsupported image format. Supported: png, jpeg, webp&quot;
                </Text>
              </div>

              <div>
                <Text className="mb-2 font-semibold">Invalid Query Parameter</Text>
                <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                  <Code className="text-sm text-red-600 dark:text-red-400">GET /800x600?border=abc</Code>
                </div>
                <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Returns: &quot;Invalid border value. Expected: Number between 0 and 100&quot;
                  </Text>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
              <Text className="text-blue-900 dark:text-blue-100">
                <strong>Tip:</strong> When integrating the API, check the HTTP status code. 
                <Code className="mx-1">200</Code> indicates success and returns an image. 
                <Code className="mx-1">400</Code> indicates a client error with a JSON error response.
                <Code className="mx-1">500</Code> indicates a server error.
              </Text>
            </div>
          </div>
        </section>

        {/* Limits */}
        <section className="mb-16">
          <Subheading className="mb-6">
            Limits & Best Practices
          </Subheading>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>• Maximum dimensions: 4000x4000 pixels</li>
              <li>• Minimum dimensions: 1x1 pixels</li>
              <li>• Images are cached for optimal performance</li>
              <li>• WebP format recommended for best compression</li>
              <li>• URL-encode special characters in text</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <div className="flex justify-center gap-8 border-t border-zinc-200 pt-8 text-center dark:border-zinc-800">
          <a
            href="/examples"
            className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            View Examples
          </a>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            Back to Home
          </a>
        </div>
    </StackedLayout>
  );
}
