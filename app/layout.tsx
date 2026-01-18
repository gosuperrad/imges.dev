import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://imges.dev'),
  title: {
    default: "imges.dev - Custom Placeholder Image Generator",
    template: "%s | imges.dev"
  },
  description: "Generate custom placeholder images on-the-fly with extensive customization options. Support for gradients, custom text, emojis, retina displays, and more. Free, fast, and easy to use.",
  keywords: [
    "placeholder images",
    "image generator", 
    "mockup images",
    "development tools",
    "placeholder API",
    "dynamic images",
    "gradient images",
    "custom placeholders",
    "retina images",
    "webp images",
    "design tools"
  ],
  authors: [{ name: "imges.dev" }],
  creator: "imges.dev",
  publisher: "imges.dev",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imges.dev",
    siteName: "imges.dev",
    title: "imges.dev - Custom Placeholder Image Generator",
    description: "Generate custom placeholder images on-the-fly. Support for gradients, custom text, emojis, retina displays, and more. Simple URL-based API.",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "imges.dev - Custom Placeholder Image Generator",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "imges.dev - Custom Placeholder Image Generator",
    description: "Generate custom placeholder images on-the-fly. Gradients, custom text, emojis, retina displays, and more.",
    images: ["/og-image"],
    creator: "@imgesdev",
    site: "@imgesdev",
  },
  alternates: {
    canonical: "https://imges.dev",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
