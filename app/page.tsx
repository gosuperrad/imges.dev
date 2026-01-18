import ImageBuilder from './components/ImageBuilder';
import { Heading, Subheading } from './components/catalyst/heading';
import { Text } from './components/catalyst/text';
import { Badge } from './components/catalyst/badge';

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
          <Text className="text-xl max-w-2xl mx-auto mb-8">
            Simple, powerful placeholder images for your projects. Generate custom images on-the-fly with extensive customization options.
          </Text>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              API Documentation
            </a>
            <a
              href="/examples"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-600 bg-white px-6 py-3 font-semibold text-blue-600 transition-all hover:bg-blue-50 hover:shadow-lg dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Examples
            </a>
          </div>
        </div>

        {/* Interactive Builder */}
        <ImageBuilder />

        {/* Feature Highlights */}
        <div className="mt-24">
          <div className="mb-12 text-center">
            <Heading level={2} className="mb-4">
              Powerful Features
            </Heading>
            <Text className="text-lg max-w-2xl mx-auto">
              Everything you need to create perfect placeholder images
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
              title="Gradients"
              description="Beautiful linear gradients with any two colors"
              example="/400x200/3b82f6-8b5cf6/ffffff?text=Gradient"
            />

            <FeatureCard
              icon={
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Emoji Support"
              description="Full color emojis using Twemoji"
              example="/400x200?text=👋%20Hello%20🌍"
            />

            <FeatureCard
              icon={
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              }
              title="Retina Ready"
              description="High-DPI support with @2x and @3x scaling"
              example="/200x100@2x?text=@2x"
            />

            <FeatureCard
              icon={
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
              title="Multiple Formats"
              description="Output as PNG, JPEG, or WebP"
              example="/400x200.webp?text=WebP"
            />

            <FeatureCard
              icon={
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              }
              title="Custom Text"
              description="Add custom text with full typography control"
              example="/400x200?text=Custom%20Text&weight=bold&size=40"
            />

            <FeatureCard
              icon={
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Lightning Fast"
              description="Cached responses with immutable headers"
              example="/400x200?text=⚡%20Fast"
            />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white dark:from-blue-500 dark:to-purple-500">
            <Heading level={2} className="mb-4 text-white">
              Ready to get started?
            </Heading>
            <Text className="text-lg mb-8 text-white opacity-90">
              Check out the full documentation or browse the examples gallery
            </Text>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/docs"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-all hover:bg-blue-50 hover:shadow-lg"
              >
                Read the Docs
              </a>
              <a
                href="/examples"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-transparent px-8 py-3 font-semibold text-white transition-all hover:bg-white/10 hover:shadow-lg"
              >
                View Examples
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  example: string;
}

function FeatureCard({ icon, title, description, example }: FeatureCardProps) {
  return (
    <div className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        {icon}
      </div>
      <Subheading level={3} className="mb-2">
        {title}
      </Subheading>
      <Text className="mb-4 text-sm">
        {description}
      </Text>
      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <img
          src={example}
          alt={title}
          className="w-full"
          loading="lazy"
        />
      </div>
    </div>
  );
}
