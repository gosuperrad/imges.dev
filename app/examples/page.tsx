"use client";

import { useState } from "react";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";

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
];

const categories = ["All", ...Array.from(new Set(examples.map(e => e.category)))];

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-slate-900">
            Example Gallery
          </h1>
          <p className="text-xl text-slate-600">
            Get inspired with these creative placeholder examples
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-2 font-medium transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Examples Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredExamples.map((example, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg transition-all hover:shadow-xl"
            >
              {/* Image Preview */}
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={example.url}
                  alt={example.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute right-2 top-2">
                  <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
                    {example.category}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold text-slate-900">
                  {example.title}
                </h3>
                <p className="mb-4 text-sm text-slate-600">
                  {example.description}
                </p>

                {/* URL Display */}
                <div className="mb-3 overflow-hidden rounded-lg bg-slate-50 p-3">
                  <code className="block overflow-x-auto text-xs text-slate-700">
                    imges.dev{example.url}
                  </code>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => copyToClipboard(example.url)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700"
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
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="mt-16 flex justify-center gap-8 border-t border-slate-200 pt-8 text-center">
          <a
            href="/docs"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            View API Documentation
          </a>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
