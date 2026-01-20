'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Button } from './catalyst/button';
import { Input } from './catalyst/input';
import { Textarea } from './catalyst/textarea';
import { Field, Label, Description, Fieldset, FieldGroup } from './catalyst/fieldset';
import { Select } from './catalyst/select';
import { Switch, SwitchField } from './catalyst/switch';
import { Heading, Subheading } from './catalyst/heading';
import { Text } from './catalyst/text';
import { Divider } from './catalyst/divider';
import { Accordion, AccordionItem } from './catalyst/accordion';
import { ColorInput } from './catalyst/color-input';
import { ArrowDownTrayIcon, LinkIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/16/solid';

interface ImageConfig {
  width: number;
  height: number;
  scale: number;
  format: 'png' | 'jpeg' | 'webp';
  bgColor: string;
  bgColor2: string;
  fgColor: string;
  text: string;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  align: 'top' | 'center' | 'bottom' | 'custom';
  customY: string;
  border: number;
  borderColor: string;
  radius: number;
  noise: number;
  pattern: '' | 'dots' | 'stripes' | 'checkerboard' | 'grid';
  patternColor: string;
  quality: number;
  gradientEnabled: boolean;
}

const SIZE_PRESETS = [
  // Social Media
  { name: 'Open Graph', width: 1200, height: 630 },
  { name: 'Twitter Card', width: 1200, height: 675 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'LinkedIn Post', width: 1200, height: 627 },
  { name: 'Pinterest Pin', width: 1000, height: 1500 },
  
  // Video & Screens
  { name: 'Full HD (1080p)', width: 1920, height: 1080 },
  { name: 'HD (720p)', width: 1280, height: 720 },
  { name: 'SD (480p)', width: 854, height: 480 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  
  // Common Ratios
  { name: '16:9 Large', width: 1920, height: 1080 },
  { name: '16:9 Medium', width: 1280, height: 720 },
  { name: '16:9 Small', width: 640, height: 360 },
  { name: '4:3 Classic', width: 800, height: 600 },
  { name: '1:1 Square', width: 1080, height: 1080 },
  { name: '2:3 Portrait', width: 1000, height: 1500 },
  { name: '3:2 Landscape', width: 1500, height: 1000 },
  
  // Web & UI
  { name: 'Blog Hero', width: 1200, height: 630 },
  { name: 'Email Header', width: 600, height: 200 },
  { name: 'Avatar Large', width: 400, height: 400 },
  { name: 'Avatar Medium', width: 200, height: 200 },
  { name: 'Card Thumbnail', width: 600, height: 400 },
  
  // Mobile
  { name: 'iPhone 14/15', width: 1179, height: 2556 },
];

const COLOR_PRESETS = [
  // Vibrant & Bold
  { name: 'Blue Vibrant', bg: '3b82f6', fg: 'ffffff' },
  { name: 'Purple Dream', bg: '8b5cf6', bg2: 'ec4899', fg: 'ffffff' },
  { name: 'Ocean Wave', bg: '0ea5e9', bg2: '06b6d4', fg: 'ffffff' },
  { name: 'Sunset Glow', bg: 'ff6b6b', bg2: 'ffa500', fg: 'ffffff' },
  { name: 'Warm Fire', bg: 'f97316', bg2: 'dc2626', fg: 'ffffff' },
  { name: 'Forest Green', bg: '10b981', fg: 'ffffff' },
  { name: 'Royal Purple', bg: '7c3aed', fg: 'ffffff' },
  { name: 'Crimson Red', bg: 'dc2626', fg: 'ffffff' },
  
  // Soft & Pastel
  { name: 'Soft Pink', bg: 'fecaca', bg2: 'fed7aa', fg: '78350f' },
  { name: 'Mint Fresh', bg: 'd1fae5', bg2: 'a7f3d0', fg: '065f46' },
  { name: 'Lavender Sky', bg: 'e9d5ff', bg2: 'ddd6fe', fg: '5b21b6' },
  { name: 'Peach Cream', bg: 'fed7aa', bg2: 'fef3c7', fg: '92400e' },
  { name: 'Baby Blue', bg: 'dbeafe', bg2: 'bfdbfe', fg: '1e3a8a' },
  
  // Dark Themes
  { name: 'Dark Slate', bg: '1e293b', fg: 'f1f5f9' },
  { name: 'Midnight', bg: '0f172a', fg: 'e2e8f0' },
  { name: 'Dark Purple', bg: '581c87', bg2: '3b0764', fg: 'faf5ff' },
  { name: 'Deep Ocean', bg: '164e63', bg2: '083344', fg: 'ecfeff' },
  { name: 'Charcoal', bg: '27272a', fg: 'fafafa' },
  
  // Light & Minimal
  { name: 'Pure White', bg: 'ffffff', fg: '000000' },
  { name: 'Light Gray', bg: 'f8fafc', fg: '1e293b' },
  { name: 'Cream', bg: 'fef3c7', fg: '78350f' },
  { name: 'Ice Blue', bg: 'f0f9ff', fg: '0c4a6e' },
  
  // Nature & Earth
  { name: 'Earth Tones', bg: 'a16207', bg2: '78350f', fg: 'fef3c7' },
  { name: 'Sage Green', bg: '84cc16', bg2: '65a30d', fg: 'ffffff' },
  { name: 'Desert Sand', bg: 'f59e0b', bg2: 'd97706', fg: '451a03' },
  
  // Neon & Bright
  { name: 'Neon Pink', bg: 'f0abfc', bg2: 'e879f9', fg: '3b0764' },
  { name: 'Electric Blue', bg: '22d3ee', bg2: '06b6d4', fg: '083344' },
  { name: 'Lime Pop', bg: 'a3e635', bg2: '84cc16', fg: '1a2e05' },
  
  // Professional
  { name: 'Corporate Blue', bg: '1e40af', fg: 'ffffff' },
  { name: 'Business Gray', bg: '475569', fg: 'f8fafc' },
  { name: 'Trust Teal', bg: '0d9488', fg: 'ffffff' },
  { name: 'Professional Navy', bg: '1e3a8a', fg: 'ffffff' },
];

export default function ImageBuilder() {
  const [config, setConfig] = useState<ImageConfig>({
    width: 640,
    height: 360,
    scale: 1,
    format: 'webp',
    bgColor: 'cccccc',
    bgColor2: '',
    fgColor: '333333',
    text: '',
    font: '',
    fontSize: '',
    fontWeight: 'normal',
    fontStyle: 'normal',
    align: 'center',
    customY: '',
    border: 0,
    borderColor: '',
    radius: 0,
    noise: 0,
    pattern: '',
    patternColor: '',
    quality: 90,
    gradientEnabled: false,
  });

  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  const generateUrl = (cfg: ImageConfig): string => {
    let path = `/${cfg.width}x${cfg.height}`;

    if (cfg.scale > 1) path += `@${cfg.scale}x`;
    if (cfg.format !== 'webp') path += `.${cfg.format}`;

    const bgColor = cfg.gradientEnabled && cfg.bgColor2
      ? `${cfg.bgColor}-${cfg.bgColor2}`
      : cfg.bgColor;
    path += `/${bgColor}`;

    if (cfg.fgColor && cfg.fgColor !== '333333') {
      path += `/${cfg.fgColor}`;
    }

    const params = new URLSearchParams();
    if (cfg.text) params.set('text', cfg.text);
    if (cfg.font) params.set('font', cfg.font);
    if (cfg.fontSize) params.set('size', cfg.fontSize);
    if (cfg.fontWeight !== 'normal') params.set('weight', cfg.fontWeight);
    if (cfg.fontStyle !== 'normal') params.set('style', cfg.fontStyle);
    if (cfg.align !== 'center') params.set('align', cfg.align);
    if (cfg.align === 'custom' && cfg.customY) params.set('y', cfg.customY);
    if (cfg.border > 0) params.set('border', cfg.border.toString());
    if (cfg.borderColor) params.set('borderColor', cfg.borderColor);
    if (cfg.radius > 0) params.set('radius', cfg.radius.toString());
    if (cfg.noise > 0) params.set('noise', cfg.noise.toString());
    if (cfg.pattern) {
      params.set('pattern', cfg.pattern);
      if (cfg.patternColor) params.set('patternColor', cfg.patternColor);
    }
    if (cfg.format === 'jpeg' && cfg.quality !== 90) {
      params.set('quality', cfg.quality.toString());
    }

    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  // Generate URL (memoized to prevent unnecessary re-renders)
  const imageUrl = useMemo(() => generateUrl(config), [config]);

  const updateConfig = (updates: Partial<ImageConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const applyPreset = (preset: typeof SIZE_PRESETS[0]) => {
    updateConfig({ width: preset.width, height: preset.height });
  };

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    updateConfig({
      bgColor: preset.bg,
      bgColor2: preset.bg2 || '',
      fgColor: preset.fg,
      gradientEnabled: !!preset.bg2,
    });
  };

  const generateRandomColor = (): string => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 20);
    const lightness = 50 + Math.floor(Math.random() * 20);
    
    const hslToHex = (h: number, s: number, l: number): string => {
      l /= 100;
      const a = (s * Math.min(l, 1 - l)) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
          .toString(16)
          .padStart(2, '0');
      };
      return `${f(0)}${f(8)}${f(4)}`;
    };

    return hslToHex(hue, saturation, lightness);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `image-${config.width}x${config.height}.${config.format}`;
    link.click();
  };

  const copyUrlToClipboard = () => {
    const fullUrl = `${window.location.origin}${imageUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: Copy URL
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        copyUrlToClipboard();
      }
      // Cmd/Ctrl + D: Download image
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        downloadImage();
      }
      // Cmd/Ctrl + R: Randomize background color
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        updateConfig({ bgColor: generateRandomColor() });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageUrl, config]);

  // Reset loading state when URL changes (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setImageLoading(true);
    setImageError(false);
  }, [imageUrl]);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 rounded-lg shadow-lg border border-zinc-800"
      >
        {sidebarOpen ? <XMarkIcon className="w-6 h-6 text-white" /> : <Bars3Icon className="w-6 h-6 text-white" />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <aside className={`scrollbar-hide fixed left-0 top-0 h-screen w-80 overflow-y-auto bg-zinc-950 z-40 transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 pt-16 lg:pt-6">
          {/* Branding */}
          <div className="mb-8">
            <Link href="/" className="block group">
              <Heading level={1} className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                imges.dev
              </Heading>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50"></div>
              </div>
            </Link>
            <Text className="mt-3 text-sm text-zinc-400 font-medium">
              Image Builder
            </Text>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-2 mb-6">
            <Link
              href="/docs"
              className="flex-1 text-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-950 text-blue-300 hover:bg-blue-900 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              API Docs
            </Link>
            <Link
              href="/examples"
              className="flex-1 text-center px-3 py-2 text-sm font-medium rounded-lg bg-purple-950 text-purple-300 hover:bg-purple-900 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              Examples
            </Link>
          </div>

          {/* GitHub Link */}
          <div className="mb-6">
            <a
              href="https://github.com/gosuperrad/imges.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-zinc-300 hover:bg-zinc-800 transition-colors border border-zinc-800"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 fill-current"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
                />
              </svg>
              View on GitHub
            </a>
          </div>

          <Divider className="mb-6" />

          <Accordion>
            {/* Dimensions Section */}
            <AccordionItem title="Dimensions" defaultOpen={false}>
              <FieldGroup>
                <Field>
                  <Label>Presets</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {SIZE_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className="px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-xs transition-colors border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 cursor-pointer"
                      >
                        {preset.name}
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400">{preset.width}×{preset.height}</span>
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Field>
                    <Label>Width</Label>
                    <Input
                      type="number"
                      value={config.width.toString()}
                      onChange={(e) => updateConfig({ width: parseInt(e.target.value) || 0 })}
                      min={1}
                      max={4000}
                    />
                  </Field>
                  <Field>
                    <Label>Height</Label>
                    <Input
                      type="number"
                      value={config.height.toString()}
                      onChange={(e) => updateConfig({ height: parseInt(e.target.value) || 0 })}
                      min={1}
                      max={4000}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Field>
                    <Label>Scale</Label>
                    <Select
                      value={config.scale.toString()}
                      onChange={(e) => updateConfig({ scale: parseInt(e.target.value) })}
                    >
                      <option value="1">@1x</option>
                      <option value="2">@2x</option>
                      <option value="3">@3x</option>
                    </Select>
                  </Field>
                  <Field>
                    <Label>Format</Label>
                    <Select
                      value={config.format}
                      onChange={(e) => updateConfig({ format: e.target.value as 'png' | 'jpeg' | 'webp' })}
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPEG</option>
                      <option value="webp">WebP</option>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </AccordionItem>

            {/* Colors Section */}
            <AccordionItem title="Colors" defaultOpen={false}>
              <FieldGroup>
                <Field>
                  <Label>Presets</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyColorPreset(preset)}
                        className="group relative aspect-square rounded-lg overflow-hidden border-2 border-zinc-300 dark:border-zinc-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                        style={{
                          background: preset.bg2
                            ? `linear-gradient(135deg, #${preset.bg} 0%, #${preset.bg2} 100%)`
                            : `#${preset.bg}`,
                        }}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>

                <ColorInput
                  label="Background"
                  value={config.bgColor}
                  onChange={(value) => updateConfig({ bgColor: value })}
                  onRandomize={() => updateConfig({ bgColor: generateRandomColor() })}
                  className="mt-3"
                />

                <SwitchField className="mt-3">
                  <Label>Gradient</Label>
                  <Switch
                    color="blue"
                    checked={config.gradientEnabled}
                    onChange={(checked) => updateConfig({ gradientEnabled: checked })}
                  />
                </SwitchField>

                {config.gradientEnabled && (
                  <ColorInput
                    label="Gradient Color 2"
                    value={config.bgColor2}
                    onChange={(value) => updateConfig({ bgColor2: value })}
                    onRandomize={() => updateConfig({ bgColor2: generateRandomColor() })}
                    placeholder="ffffff"
                    className="mt-3"
                  />
                )}

                <ColorInput
                  label="Text Color"
                  value={config.fgColor}
                  onChange={(value) => updateConfig({ fgColor: value })}
                  onRandomize={() => updateConfig({ fgColor: generateRandomColor() })}
                  placeholder="333333"
                  className="mt-3"
                />
              </FieldGroup>
            </AccordionItem>

            {/* Text & Font Section */}
            <AccordionItem title="Text & Font" defaultOpen={false}>
              <FieldGroup>
                <Field>
                  <Label>Text</Label>
                  <Description>Use \n for line breaks</Description>
                  <Textarea
                    value={config.text}
                    onChange={(e) => updateConfig({ text: e.target.value })}
                    rows={3}
                    placeholder="Leave empty for dimensions"
                  />
                </Field>

                <Field className="mt-3">
                  <Label>Font Family</Label>
                  <Select
                    value={config.font}
                    onChange={(e) => updateConfig({ font: e.target.value })}
                  >
                    <option value="">Default</option>
                    <optgroup label="Sans-Serif">
                      <option value="inter">Inter</option>
                      <option value="roboto">Roboto</option>
                      <option value="open-sans">Open Sans</option>
                      <option value="lato">Lato</option>
                      <option value="montserrat">Montserrat</option>
                      <option value="poppins">Poppins</option>
                      <option value="raleway">Raleway</option>
                      <option value="nunito">Nunito</option>
                    </optgroup>
                    <optgroup label="Serif">
                      <option value="playfair-display">Playfair Display</option>
                      <option value="merriweather">Merriweather</option>
                      <option value="lora">Lora</option>
                      <option value="roboto-slab">Roboto Slab</option>
                    </optgroup>
                    <optgroup label="Monospace">
                      <option value="roboto-mono">Roboto Mono</option>
                      <option value="source-code-pro">Source Code Pro</option>
                      <option value="fira-code">Fira Code</option>
                      <option value="jetbrains-mono">JetBrains Mono</option>
                    </optgroup>
                    <optgroup label="Display">
                      <option value="bebas-neue">Bebas Neue</option>
                      <option value="lobster">Lobster</option>
                      <option value="pacifico">Pacifico</option>
                      <option value="dancing-script">Dancing Script</option>
                    </optgroup>
                  </Select>
                </Field>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Field>
                    <Label>Size</Label>
                    <Input
                      type="number"
                      value={config.fontSize}
                      onChange={(e) => updateConfig({ fontSize: e.target.value })}
                      placeholder="Auto"
                    />
                  </Field>
                  <Field>
                    <Label>Weight</Label>
                    <Select
                      value={config.fontWeight}
                      onChange={(e) => updateConfig({ fontWeight: e.target.value })}
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </Select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Field>
                    <Label>Style</Label>
                    <Select
                      value={config.fontStyle}
                      onChange={(e) => updateConfig({ fontStyle: e.target.value })}
                    >
                      <option value="normal">Normal</option>
                      <option value="italic">Italic</option>
                    </Select>
                  </Field>
                  <Field>
                    <Label>Align</Label>
                    <Select
                      value={config.align}
                      onChange={(e) => updateConfig({ align: e.target.value as 'top' | 'center' | 'bottom' | 'custom' })}
                    >
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                      <option value="custom">Custom</option>
                    </Select>
                  </Field>
                </div>

                {config.align === 'custom' && (
                  <Field className="mt-3">
                    <Label>Y Position</Label>
                    <Input
                      type="number"
                      value={config.customY}
                      onChange={(e) => updateConfig({ customY: e.target.value })}
                      placeholder="Y coordinate"
                    />
                  </Field>
                )}
              </FieldGroup>
            </AccordionItem>

            {/* Effects Section */}
            <AccordionItem title="Effects" defaultOpen={false}>
              <FieldGroup>
                <Field>
                  <Label>Border Radius: {config.radius}px</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.radius}
                    onChange={(e) => updateConfig({ radius: parseInt(e.target.value) })}
                    className="w-full mt-2 cursor-pointer"
                  />
                </Field>

                <Field className="mt-3">
                  <Label>Border: {config.border}px</Label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={config.border}
                    onChange={(e) => updateConfig({ border: parseInt(e.target.value) })}
                    className="w-full mt-2 cursor-pointer"
                  />
                </Field>

                {config.border > 0 && (
                  <ColorInput
                    label="Border Color"
                    value={config.borderColor}
                    onChange={(value) => updateConfig({ borderColor: value })}
                    placeholder={config.fgColor}
                    className="mt-3"
                  />
                )}

                <Field className="mt-3">
                  <Label>Noise: {config.noise}</Label>
                  <Description>Vintage texture</Description>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.noise}
                    onChange={(e) => updateConfig({ noise: parseInt(e.target.value) })}
                    className="w-full mt-2 cursor-pointer"
                  />
                </Field>

                <Field className="mt-3">
                  <Label>Pattern</Label>
                  <Select
                    value={config.pattern}
                    onChange={(e) => updateConfig({ pattern: e.target.value as '' | 'dots' | 'stripes' | 'checkerboard' | 'grid' })}
                  >
                    <option value="">None</option>
                    <option value="dots">Dots</option>
                    <option value="stripes">Stripes</option>
                    <option value="checkerboard">Checkerboard</option>
                    <option value="grid">Grid</option>
                  </Select>
                </Field>

                {config.pattern && (
                  <ColorInput
                    label="Pattern Color"
                    value={config.patternColor}
                    onChange={(value) => updateConfig({ patternColor: value })}
                    placeholder={config.fgColor}
                    className="mt-3"
                  />
                )}

                {config.format === 'jpeg' && (
                  <Field className="mt-3">
                    <Label>Quality: {config.quality}%</Label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={config.quality}
                      onChange={(e) => updateConfig({ quality: parseInt(e.target.value) })}
                      className="w-full mt-2 cursor-pointer"
                    />
                  </Field>
                )}
              </FieldGroup>
            </AccordionItem>
          </Accordion>
        </div>
      </aside>

      {/* Main Content Area - Playground */}
      <main className="flex flex-1 flex-col pb-2 pt-20 lg:pt-2 lg:min-w-0 lg:pr-2 lg:pl-80">
        <div className="grow p-4 lg:p-10 lg:rounded-lg lg:bg-zinc-900 lg:shadow-xs lg:ring-1 lg:ring-white/10">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-6">
              {/* Preview */}
              <div className="bg-black rounded-xl p-4 sm:p-8 flex items-center justify-center min-h-[300px] sm:min-h-[500px] border border-zinc-800 relative">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <Text className="text-zinc-400 text-sm">Loading image...</Text>
                    </div>
                  </div>
                )}
                {imageError && !imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-center p-6">
                      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <Text className="text-red-400 font-medium">Failed to load image</Text>
                      <Text className="text-zinc-500 text-sm">Check your settings and try again</Text>
                    </div>
                  </div>
                )}
                <img
                  src={imageUrl}
                  alt="Preview"
                  className={`max-w-full max-h-[700px] rounded shadow-2xl transition-opacity duration-200 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  style={{ imageRendering: 'crisp-edges' }}
                  onLoad={() => {
                    setImageLoading(false);
                    setImageError(false);
                  }}
                  onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                  }}
                />
              </div>

              {/* Generated URL */}
              <div>
                <code className="block bg-zinc-950 text-green-400 p-3 sm:p-4 rounded-lg text-xs sm:text-sm overflow-x-auto font-mono border border-zinc-800 break-all sm:break-normal">
                  https://imges.dev{imageUrl}
                </code>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  color="cyan"
                  onClick={downloadImage}
                  className="w-full sm:w-auto"
                >
                  <ArrowDownTrayIcon />
                  Download
                </Button>
                <Button
                  color="indigo"
                  onClick={copyUrlToClipboard}
                  className="w-full sm:w-auto"
                >
                  <LinkIcon />
                  {copied ? '✓ Copied' : 'Copy URL'}
                </Button>
                <Text className="text-xs text-zinc-500 text-center sm:text-left mt-2 sm:mt-0 hidden sm:block">
                  Shortcuts: <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300 font-mono">⌘K</kbd> Copy • <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300 font-mono">⌘D</kbd> Download • <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300 font-mono">⌘R</kbd> Randomize
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500">
            <a href="/docs" className="hover:text-zinc-300 transition-colors">
              Documentation
            </a>
            <span className="text-zinc-700">•</span>
            <a href="/examples" className="hover:text-zinc-300 transition-colors">
              Examples
            </a>
            <span className="text-zinc-700">•</span>
            <a href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </a>
            <span className="text-zinc-700">•</span>
            <a 
              href="https://github.com/gosuperrad/imges.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              GitHub
            </a>
          </div>
          <p className="mt-4 text-xs text-zinc-600">
            © 2026 imges.dev. Free placeholder image generator.
          </p>
        </footer>
      </main>
    </div>
  );
}
