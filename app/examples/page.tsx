"use client";

import { useState } from "react";
import { CheckIcon, ClipboardIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react';
import { Heading, Subheading } from '../components/catalyst/heading';
import { Text } from '../components/catalyst/text';
import { Badge } from '../components/catalyst/badge';
import { Button } from '../components/catalyst/button';
import { StackedLayout } from '../components/catalyst/stacked-layout';

interface Example {
  title: string;
  description: string;
  url: string;
  category: string;
}

const examples: Example[] = [
  {
    title: "Hero Image",
    description: "Large gradient hero with bold text",
    url: "/1920x1080/3b82f6-8b5cf6/ffffff?text=Hero%20Section&size=120&weight=bold",
    category: "Headers"
  },
  {
    title: "Product Card",
    description: "Square placeholder with border",
    url: "/600x600/f3f4f6/1f2937?text=Product&border=10&borderColor=3b82f6",
    category: "E-commerce"
  },
  {
    title: "Avatar Placeholder",
    description: "Small circular-style placeholder",
    url: "/200x200/random/ffffff?text=👤",
    category: "User Interface"
  },
  {
    title: "Blog Post Thumbnail",
    description: "16:9 ratio with custom styling",
    url: "/1280x720/10b981/ffffff?text=Blog%20Post&size=80&style=italic",
    category: "Blog"
  },
  {
    title: "Email Banner",
    description: "Wide banner with gradient",
    url: "/800x200/f59e0b-ef4444/ffffff?text=Special%20Offer!&weight=bold&size=60",
    category: "Marketing"
  },
  {
    title: "Social Media Post",
    description: "Square format for Instagram/Facebook",
    url: "/1080x1080/8b5cf6-ec4899/ffffff?text=📱%20Social%20Post&size=70",
    category: "Social Media"
  },
  {
    title: "Video Thumbnail",
    description: "YouTube-style 16:9 thumbnail",
    url: "/1280x720/000000-ff0000/ffffff?text=▶️%20Watch%20Now&size=90&weight=bold",
    category: "Video"
  },
  {
    title: "Mobile App Screen",
    description: "Mobile screen ratio placeholder",
    url: "/375x812/0ea5e9/ffffff?text=📱%20Mobile%20App&size=50",
    category: "Mobile"
  },
  {
    title: "Desktop Wallpaper",
    description: "High-res gradient wallpaper",
    url: "/2560x1440/6366f1-a855f7/ffffff?text=4K%20Wallpaper&size=150&weight=bold&align=bottom",
    category: "Wallpapers"
  },
  {
    title: "Error Page",
    description: "Centered error message",
    url: "/800x600/ef4444/ffffff?text=404%20Error&size=100&weight=bold",
    category: "Error Pages"
  },
  {
    title: "Retina Display",
    description: "2x resolution for sharp displays",
    url: "/400x300@2x/06b6d4/ffffff?text=Retina%20@2x&weight=bold",
    category: "Retina"
  },
  {
    title: "Emoji Showcase",
    description: "Full emoji support",
    url: "/800x600/fef3c7/92400e?text=🎉%20Celebration%20🎊&size=80",
    category: "Fun"
  },
  {
    title: "Minimal Design",
    description: "Clean minimal aesthetic",
    url: "/800x600/ffffff/000000?text=Minimal&size=90&weight=100",
    category: "Design"
  },
  {
    title: "Dark Mode",
    description: "Dark background placeholder",
    url: "/800x600/1f2937/f9fafb?text=Dark%20Mode&size=80&weight=bold",
    category: "Design"
  },
  {
    title: "Pastel Colors",
    description: "Soft pastel gradient",
    url: "/800x600/fecaca-fed7aa/78350f?text=Pastel&size=70",
    category: "Design"
  },
  {
    title: "Neon Style",
    description: "Vibrant neon colors",
    url: "/800x600/000000/22d3ee?text=⚡%20NEON%20⚡&size=100&weight=bold",
    category: "Fun"
  },
  {
    title: "Rounded Card",
    description: "Modern card with rounded corners",
    url: "/600x400/3b82f6/ffffff?text=Rounded%20Card&radius=40&size=50&weight=bold",
    category: "Design"
  },
  {
    title: "Elegant Serif",
    description: "Playfair Display font for elegance",
    url: "/800x600/f8fafc/1e293b?text=Elegant%20Design&font=playfair-display&size=70",
    category: "Typography"
  },
  {
    title: "Code Block",
    description: "Monospace font for technical content",
    url: "/800x400/282a36/50fa7b?text=console.log('Hello')&font=fira-code&size=40",
    category: "Typography"
  },
  {
    title: "Shadow Effect",
    description: "Drop shadow for depth",
    url: "/600x400/ffffff/333333?text=Shadow%20Card&shadow=25&shadowColor=000000&radius=20&size=50",
    category: "Effects"
  },
  {
    title: "Display Font",
    description: "Bold display font for impact",
    url: "/800x600/ff6b6b/ffffff?text=BIG%20IMPACT&font=bebas-neue&size=100&weight=bold",
    category: "Typography"
  },
  {
    title: "Handwritten Style",
    description: "Dancing Script for a personal touch",
    url: "/800x600/fff5f5/d63031?text=Hand%20Written&font=dancing-script&size=80",
    category: "Typography"
  },
  {
    title: "Modern Sans-Serif",
    description: "Clean Poppins font for modern design",
    url: "/800x600/0f172a/f8fafc?text=Modern%20Typography&font=poppins&size=60&weight=bold",
    category: "Typography"
  },
  {
    title: "Vintage Serif",
    description: "Lora font with warm vintage feel",
    url: "/800x600/fef3c7/92400e?text=Vintage%20Style&font=lora&size=65&style=italic",
    category: "Typography"
  },
  {
    title: "Rounded Shadow Combo",
    description: "Combined radius and shadow effects",
    url: "/700x500/6366f1/ffffff?text=Premium%20Card&radius=30&shadow=20&shadowColor=4338ca&size=60&weight=bold",
    category: "Effects"
  },
  {
    title: "Vintage Noise",
    description: "Grain texture for vintage aesthetics",
    url: "/800x600/f4e4c1/5d4e37?text=Vintage%20Photo&noise=60&size=60&font=lora",
    category: "Effects"
  },
  {
    title: "Dots Pattern",
    description: "Polka dot pattern overlay",
    url: "/800x600/fef3c7/92400e?pattern=dots&patternColor=f59e0b&text=Dots",
    category: "Patterns"
  },
  {
    title: "Stripes Pattern",
    description: "Diagonal stripes for dynamic look",
    url: "/800x600/dbeafe/1e40af?pattern=stripes&patternColor=3b82f6&text=Stripes&size=70&weight=bold",
    category: "Patterns"
  },
  {
    title: "Checkerboard",
    description: "Classic checkerboard pattern",
    url: "/800x600/f8fafc/1e293b?pattern=checkerboard&patternColor=94a3b8&text=Checkerboard",
    category: "Patterns"
  },
  {
    title: "Grid Pattern",
    description: "Clean grid overlay",
    url: "/800x600/ecfdf5/065f46?pattern=grid&patternColor=10b981&text=Grid&size=70",
    category: "Patterns"
  },
  {
    title: "Noisy Gradient",
    description: "Gradient with grain texture",
    url: "/800x600/8b5cf6-ec4899/ffffff?text=Textured%20Gradient&noise=40&size=65&weight=bold",
    category: "Effects"
  },
  {
    title: "Pattern + Text",
    description: "Dots pattern with custom text",
    url: "/800x600/fff1f2/9f1239?pattern=dots&patternColor=fda4af&text=Sale%20🏷️&size=80&weight=bold",
    category: "Patterns"
  },
];

const categories = ["All", ...Array.from(new Set(examples.map(e => e.category)))];

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<Example | null>(null);

  const filteredExamples = selectedCategory === "All" 
    ? examples 
    : examples.filter(e => e.category === selectedCategory);

  const copyToClipboard = async (url: string) => {
    const fullUrl = `https://imges.dev${url}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <StackedLayout>
      <Heading className="text-2xl/8 font-semibold sm:text-xl/8 mb-2">
        Example Gallery
      </Heading>
      <Text className="text-zinc-600 dark:text-zinc-400 mb-8">
        Get inspired with these creative placeholder examples
      </Text>

      <hr className="mb-8 w-full border-t border-zinc-950/10 dark:border-white/10" />

        {/* Category Filter */}
        <div className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:gap-3 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all sm:px-6 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg dark:bg-blue-500"
                    : "bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Examples Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredExamples.map((example, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg transition-all hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
            >
              {/* Image Preview */}
              <div 
                className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer group"
                onClick={() => setLightboxImage(example)}
              >
                <img
                  src={example.url}
                  alt={example.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-zinc-900/90 rounded-full p-3">
                    <svg className="w-6 h-6 text-zinc-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                <div className="absolute right-2 top-2">
                  <Badge color="zinc" className="bg-black/50 text-white">
                    {example.category}
                  </Badge>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <Subheading level={3} className="mb-2">
                  {example.title}
                </Subheading>
                <Text className="mb-4 text-sm">
                  {example.description}
                </Text>

                {/* URL Display */}
                <div className="mb-3 overflow-hidden rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                  <code className="block overflow-x-auto text-xs text-zinc-700 dark:text-zinc-300">
                    imges.dev{example.url}
                  </code>
                </div>

                {/* Copy Button */}
                <Button
                  onClick={() => copyToClipboard(example.url)}
                  color="blue"
                  className="w-full"
                >
                  {copiedUrl === example.url ? (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <ClipboardIcon className="h-5 w-5" />
                      Copy URL
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="mt-16 flex justify-center gap-8 border-t border-zinc-200 pt-8 text-center dark:border-zinc-800">
          <a
            href="/docs"
            className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            View API Documentation
          </a>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            Back to Home
          </a>
        </div>

      {/* Lightbox Modal */}
      <Dialog open={lightboxImage !== null} onClose={() => setLightboxImage(null)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="relative max-w-5xl w-full">
            {/* Close Button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {lightboxImage && (
              <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-2xl">
                {/* Image */}
                <div className="relative bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-4 max-h-[70vh]">
                  <img
                    src={lightboxImage.url}
                    alt={lightboxImage.title}
                    className="max-w-full max-h-[70vh] object-contain rounded"
                  />
                </div>

                {/* Info */}
                <div className="p-6 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Subheading level={3} className="mb-1">
                        {lightboxImage.title}
                      </Subheading>
                      <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                        {lightboxImage.description}
                      </Text>
                    </div>
                    <Badge color="blue">{lightboxImage.category}</Badge>
                  </div>

                  {/* URL Display */}
                  <div className="mb-3 overflow-hidden rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                    <code className="block overflow-x-auto text-xs text-zinc-700 dark:text-zinc-300">
                      https://imges.dev{lightboxImage.url}
                    </code>
                  </div>

                  {/* Copy Button */}
                  <Button
                    onClick={() => copyToClipboard(lightboxImage.url)}
                    color="blue"
                    className="w-full"
                  >
                    {copiedUrl === lightboxImage.url ? (
                      <>
                        <CheckIcon className="h-5 w-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className="h-5 w-5" />
                        Copy URL
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </StackedLayout>
  );
}
