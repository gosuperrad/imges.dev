import ImageBuilder from './components/ImageBuilder';
import { Heading, Subheading } from './components/catalyst/heading';
import { Text, Code } from './components/catalyst/text';
import { Divider } from './components/catalyst/divider';
import { Badge } from './components/catalyst/badge';
import { ExampleCard } from './components/ExampleCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="container mx-auto px-6 py-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge color="blue">Beta</Badge>
          </div>
          <Heading className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            imges.dev
          </Heading>
          <Text className="text-xl max-w-2xl mx-auto">
            Simple, powerful placeholder images for your projects. Generate custom images on-the-fly with extensive customization options.
          </Text>
        </div>

        {/* Interactive Builder */}
        <ImageBuilder />

        {/* Basic Examples Section */}
        <div className="mt-16">
          <div className="mb-8">
            <Heading level={2}>Basic Examples</Heading>
            <Text className="mt-2">Get started with these simple examples</Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExampleCard
              title="Basic dimensions"
              code="/640x360"
              color="blue"
            />

            <ExampleCard
              title="Custom colors"
              code="/640x360/3b82f6/ffffff"
              color="blue"
            />

            <ExampleCard
              title="Gradient background"
              code="/640x360/8b5cf6-ec4899/ffffff"
              color="blue"
            />

            <ExampleCard
              title="Custom text"
              code="/640x360?text=Hello+World"
              color="blue"
            />
          </div>
        </div>

        <Divider className="my-16" />

        {/* Advanced Features Section */}
        <div>
          <div className="mb-8">
            <Heading level={2}>Advanced Features</Heading>
            <Text className="mt-2">Explore powerful customization options</Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ExampleCard
              title="Retina @2x support"
              code="/320x180@2x"
              color="purple"
            />

            <ExampleCard
              title="Multiple text lines"
              code="/640x360?text=Line+1\nLine+2"
              color="purple"
            />

            <ExampleCard
              title="Border"
              code="/640x360?border=10&borderColor=3b82f6"
              color="purple"
            />

            <ExampleCard
              title="Random colors"
              code="/640x360/random/random"
              color="purple"
            />

            <ExampleCard
              title="Custom font styling"
              code="/640x360?weight=bold&size=60"
              color="purple"
            />

            <ExampleCard
              title="Text alignment"
              code="/640x360?text=Top+Aligned&align=top"
              color="purple"
            />
          </div>
        </div>

        <Divider className="my-16" />

        {/* URL Format Documentation */}
        <div>
          <div className="mb-8">
            <Heading level={2}>URL Format</Heading>
            <Text className="mt-2">Understanding the URL structure</Text>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 mb-8">
            <Code className="block text-sm sm:text-base">
              /[width]x[height][@scale][.format]/[bg-color]/[fg-color]?[options]
            </Code>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 border border-zinc-200 dark:border-zinc-800">
              <Subheading className="mb-4">Path Parameters</Subheading>
              <div className="space-y-3">
                <ParamItem
                  name="width x height"
                  description="Image dimensions (required)"
                />
                <ParamItem
                  name="@2x, @3x"
                  description="Retina scale multiplier (optional)"
                />
                <ParamItem
                  name=".png, .jpg, .webp"
                  description="Output format (optional, default: webp)"
                />
                <ParamItem
                  name="bg-color"
                  description="Background color or gradient (color1-color2)"
                />
                <ParamItem
                  name="fg-color"
                  description="Text color (hex or 'random')"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 border border-zinc-200 dark:border-zinc-800">
              <Subheading className="mb-4">Query Parameters</Subheading>
              <div className="space-y-3">
                <ParamItem
                  name="text"
                  description="Custom text (use \n for line breaks)"
                />
                <ParamItem
                  name="size"
                  description="Font size in pixels"
                />
                <ParamItem
                  name="weight"
                  description="Font weight (normal, bold)"
                />
                <ParamItem
                  name="style"
                  description="Font style (normal, italic)"
                />
                <ParamItem
                  name="align"
                  description="Text position (top, center, bottom, custom)"
                />
                <ParamItem
                  name="y"
                  description="Custom Y position (with align=custom)"
                />
                <ParamItem
                  name="border"
                  description="Border width in pixels"
                />
                <ParamItem
                  name="borderColor"
                  description="Border color (hex)"
                />
                <ParamItem
                  name="quality"
                  description="JPEG/WebP quality 1-100 (default: 90)"
                />
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-16" />

        {/* More Examples */}
        <div>
          <div className="mb-8">
            <Heading level={2}>More Examples</Heading>
            <Text className="mt-2">Advanced use cases and combinations</Text>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 border border-zinc-200 dark:border-zinc-800">
            <div className="space-y-6">
              <ExampleDescription
                code="/800x600@2x.jpg?quality=95"
                description="1600x1200 JPEG at 95% quality"
              />
              
              <ExampleDescription
                code="/640x360/ff6b6b-4ecdc4/ffffff?text=Summer\nSale&weight=bold&size=80"
                description="Gradient background with bold, large text on multiple lines"
              />
              
              <ExampleDescription
                code="/800x400/random-random/ffffff?border=5"
                description="Random gradient with white text and border"
              />
              
              <ExampleDescription
                code="/1200x630?text=Open+Graph+Image&align=bottom&size=70"
                description="Perfect for social media preview images"
              />
              
              <ExampleDescription
                code="/640x360/1e293b/f1f5f9?text=🎉+Color+Emoji+Support+🚀&size=50"
                description="Full color emoji support via Twemoji"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function ParamItem({ name, description }: { name: string; description: string }) {
  return (
    <div>
      <Code className="text-xs">{name}</Code>
      <Text className="text-sm mt-1">{description}</Text>
    </div>
  );
}

function ExampleDescription({ code, description }: { code: string; description: string }) {
  return (
    <div className="border-l-2 border-blue-500 dark:border-blue-400 pl-4">
      <Code className="block mb-2 text-xs break-all">
        {code}
      </Code>
      <Text className="text-sm">{description}</Text>
    </div>
  );
}
