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
  title: "imges.dev - Simple, Powerful Placeholder Images",
  description: "Generate custom placeholder images on-the-fly with extensive customization options. Free, fast, and easy to use.",
  keywords: ["placeholder images", "image generator", "mockup images", "development tools"],
  authors: [{ name: "imges.dev" }],
  openGraph: {
    title: "imges.dev - Simple, Powerful Placeholder Images",
    description: "Generate custom placeholder images on-the-fly with extensive customization options",
    type: "website",
    images: [
      {
        url: "/1200x630/3b82f6-8b5cf6/ffffff?text=imges.dev&size=80&weight=bold",
        width: 1200,
        height: 630,
        alt: "imges.dev - Placeholder Image Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "imges.dev - Simple, Powerful Placeholder Images",
    description: "Generate custom placeholder images on-the-fly",
    images: ["/1200x630/3b82f6-8b5cf6/ffffff?text=imges.dev&size=80&weight=bold"],
  },
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
