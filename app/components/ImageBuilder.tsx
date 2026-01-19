'use client';

import { useState } from 'react';
import { Button } from './catalyst/button';
import { Input } from './catalyst/input';
import { Textarea } from './catalyst/textarea';
import { Field, Label, Description, Fieldset, FieldGroup } from './catalyst/fieldset';
import { Select } from './catalyst/select';
import { Switch, SwitchField } from './catalyst/switch';
import { Heading } from './catalyst/heading';
import { Text } from './catalyst/text';
import { Badge } from './catalyst/badge';
import { ArrowDownTrayIcon, LinkIcon, SparklesIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid';

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
  shadow: number;
  shadowColor: string;
  noise: number;
  pattern: '' | 'dots' | 'stripes' | 'checkerboard' | 'grid';
  patternColor: string;
  quality: number;
  gradientEnabled: boolean;
}

const SIZE_PRESETS = [
  { name: 'Open Graph', width: 1200, height: 630 },
  { name: 'Full HD', width: 1920, height: 1080 },
  { name: '16:9 Small', width: 640, height: 360 },
  { name: '4:3', width: 800, height: 600 },
  { name: 'Square', width: 1080, height: 1080 },
  { name: 'Twitter', width: 1200, height: 675 },
];

const COLOR_PRESETS = [
  { name: 'Vibrant', bg: '3b82f6', fg: 'ffffff' },
  { name: 'Sunset', bg: 'ff6b6b', bg2: 'ffa500', fg: 'ffffff' },
  { name: 'Ocean', bg: '0ea5e9', bg2: '06b6d4', fg: 'ffffff' },
  { name: 'Purple', bg: '8b5cf6', bg2: 'ec4899', fg: 'ffffff' },
  { name: 'Dark', bg: '1e293b', fg: 'f1f5f9' },
  { name: 'Light', bg: 'f8fafc', fg: '1e293b' },
  { name: 'Mint', bg: '10b981', fg: 'ffffff' },
  { name: 'Warm', bg: 'f97316', bg2: 'dc2626', fg: 'ffffff' },
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
    shadow: 0,
    shadowColor: '000000',
    noise: 0,
    pattern: '',
    patternColor: '',
    quality: 90,
    gradientEnabled: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isGeneratingShortUrl, setIsGeneratingShortUrl] = useState(false);
  const [shortUrlError, setShortUrlError] = useState<string | null>(null);

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
    if (cfg.shadow > 0) {
      params.set('shadow', cfg.shadow.toString());
      if (cfg.shadowColor !== '000000') params.set('shadowColor', cfg.shadowColor);
    }
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

  // Generate initial URL
  const imageUrl = generateUrl(config);

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

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `image-${config.width}x${config.height}.${config.format}`;
    link.click();
  };

  const generateShortUrl = async () => {
    setIsGeneratingShortUrl(true);
    setShortUrlError(null);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create short URL');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (error) {
      console.error('Error generating short URL:', error);
      setShortUrlError(error instanceof Error ? error.message : 'Failed to generate short URL');
    } finally {
      setIsGeneratingShortUrl(false);
    }
  };

  const copyShortUrl = () => {
    if (shortUrl) {
      const fullShortUrl = `${window.location.origin}${shortUrl}`;
      navigator.clipboard.writeText(fullShortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 mb-12 border border-zinc-200 dark:border-zinc-800">
      <div className="text-center mb-8">
        <Heading level={2}>Image Builder</Heading>
        <Text className="mt-2">Create custom placeholder images with extensive customization options</Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column - Controls */}
        <div className="lg:col-span-2">
          <Fieldset>
            <FieldGroup>
              {/* Size Presets */}
              <Field>
                <Label>Quick Presets</Label>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {SIZE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-sm transition-colors border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 cursor-pointer"
                    >
                      {preset.name}
                      <span className="block text-xs text-zinc-500 dark:text-zinc-400">{preset.width}×{preset.height}</span>
                    </button>
                  ))}
                </div>
              </Field>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
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

              {/* Scale & Format */}
              <div className="grid grid-cols-2 gap-4">
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
                    onChange={(e) => updateConfig({ format: e.target.value as any })}
                  >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="webp">WebP</option>
                  </Select>
                </Field>
              </div>

              {/* Color Presets */}
              <Field>
                <Label>Color Presets</Label>
                <div className="grid grid-cols-4 gap-2 mt-3">
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

              {/* Background Color */}
              <Field>
                <Label>Background Color</Label>
                <div className="flex gap-2 mt-3">
                  <input
                    type="color"
                    value={`#${config.bgColor}`}
                    onChange={(e) => updateConfig({ bgColor: e.target.value.slice(1) })}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-zinc-300 dark:border-zinc-600"
                  />
                  <Input
                    type="text"
                    value={config.bgColor}
                    onChange={(e) => updateConfig({ bgColor: e.target.value.replace('#', '') })}
                    className="flex-1 font-mono text-sm"
                    placeholder="cccccc"
                  />
                  <Button
                    color="indigo"
                    onClick={() => updateConfig({ bgColor: generateRandomColor() })}
                  >
                    <SparklesIcon />
                    Random
                  </Button>
                </div>
              </Field>

              {/* Gradient Toggle */}
              <SwitchField>
                <Label>Enable Gradient</Label>
                <Switch
                  color="blue"
                  checked={config.gradientEnabled}
                  onChange={(checked) => updateConfig({ gradientEnabled: checked })}
                />
              </SwitchField>

              {/* Secondary Background Color */}
              {config.gradientEnabled && (
                <Field>
                  <Label>Gradient Color 2</Label>
                  <div className="flex gap-2 mt-3">
                    <input
                      type="color"
                      value={`#${config.bgColor2 || 'ffffff'}`}
                      onChange={(e) => updateConfig({ bgColor2: e.target.value.slice(1) })}
                      className="w-12 h-10 rounded-lg cursor-pointer border border-zinc-300 dark:border-zinc-600"
                    />
                    <Input
                      type="text"
                      value={config.bgColor2}
                      onChange={(e) => updateConfig({ bgColor2: e.target.value.replace('#', '') })}
                      className="flex-1 font-mono text-sm"
                      placeholder="ffffff"
                    />
                    <Button
                      color="indigo"
                      onClick={() => updateConfig({ bgColor2: generateRandomColor() })}
                    >
                      <SparklesIcon />
                      Random
                    </Button>
                  </div>
                </Field>
              )}

              {/* Foreground Color */}
              <Field>
                <Label>Text Color</Label>
                <div className="flex gap-2 mt-3">
                  <input
                    type="color"
                    value={`#${config.fgColor}`}
                    onChange={(e) => updateConfig({ fgColor: e.target.value.slice(1) })}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-zinc-300 dark:border-zinc-600"
                  />
                  <Input
                    type="text"
                    value={config.fgColor}
                    onChange={(e) => updateConfig({ fgColor: e.target.value.replace('#', '') })}
                    className="flex-1 font-mono text-sm"
                    placeholder="333333"
                  />
                  <Button
                    color="indigo"
                    onClick={() => updateConfig({ fgColor: generateRandomColor() })}
                  >
                    <SparklesIcon />
                    Random
                  </Button>
                </div>
              </Field>

              {/* Text */}
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

              {/* Font Family */}
              <Field>
                <Label>Font</Label>
                <Select
                  value={config.font}
                  onChange={(e) => updateConfig({ font: e.target.value })}
                >
                  <option value="">Default (Sans-Serif)</option>
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

              {/* Font Settings */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label>Font Size</Label>
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

              <div className="grid grid-cols-2 gap-4">
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
                  <Label>Alignment</Label>
                  <Select
                    value={config.align}
                    onChange={(e) => updateConfig({ align: e.target.value as any })}
                  >
                    <option value="top">Top</option>
                    <option value="center">Center</option>
                    <option value="bottom">Bottom</option>
                    <option value="custom">Custom</option>
                  </Select>
                </Field>
              </div>

              {config.align === 'custom' && (
                <Field>
                  <Label>Custom Y Position</Label>
                  <Input
                    type="number"
                    value={config.customY}
                    onChange={(e) => updateConfig({ customY: e.target.value })}
                    placeholder="Y coordinate"
                  />
                </Field>
              )}

              {/* Advanced Options */}
              <div>
                <Button
                  outline
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full justify-between"
                >
                  <span>Advanced Options</span>
                  {showAdvanced ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </Button>
              </div>

              {showAdvanced && (
                <>
                  <Field>
                    <Label>Border Radius: {config.radius}px</Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.radius}
                      onChange={(e) => updateConfig({ radius: parseInt(e.target.value) })}
                      className="w-full mt-3 cursor-pointer"
                    />
                  </Field>

                  <Field>
                    <Label>Shadow Size: {config.shadow}px</Label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={config.shadow}
                      onChange={(e) => updateConfig({ shadow: parseInt(e.target.value) })}
                      className="w-full mt-3 cursor-pointer"
                    />
                  </Field>

                  {config.shadow > 0 && (
                    <Field>
                      <Label>Shadow Color</Label>
                      <div className="flex gap-2 mt-3">
                        <input
                          type="color"
                          value={`#${config.shadowColor}`}
                          onChange={(e) => updateConfig({ shadowColor: e.target.value.slice(1) })}
                          className="w-12 h-10 rounded-lg cursor-pointer border border-zinc-300 dark:border-zinc-600"
                        />
                        <Input
                          type="text"
                          value={config.shadowColor}
                          onChange={(e) => updateConfig({ shadowColor: e.target.value.replace('#', '') })}
                          className="flex-1 font-mono text-sm"
                          placeholder="000000"
                        />
                      </div>
                    </Field>
                  )}

                  <Field>
                    <Label>Border Width: {config.border}px</Label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={config.border}
                      onChange={(e) => updateConfig({ border: parseInt(e.target.value) })}
                      className="w-full mt-3 cursor-pointer"
                    />
                  </Field>

                  {config.border > 0 && (
                    <Field>
                      <Label>Border Color</Label>
                      <div className="flex gap-2 mt-3">
                        <input
                          type="color"
                          value={`#${config.borderColor || config.fgColor}`}
                          onChange={(e) => updateConfig({ borderColor: e.target.value.slice(1) })}
                          className="w-12 h-10 rounded-lg cursor-pointer border border-zinc-300 dark:border-zinc-600"
                        />
                        <Input
                          type="text"
                          value={config.borderColor}
                          onChange={(e) => updateConfig({ borderColor: e.target.value.replace('#', '') })}
                          className="flex-1 font-mono text-sm"
                          placeholder={config.fgColor}
                        />
                      </div>
                    </Field>
                  )}

                  <Field>
                    <Label>Noise/Grain: {config.noise}</Label>
                    <Description>Add vintage texture effect</Description>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.noise}
                      onChange={(e) => updateConfig({ noise: parseInt(e.target.value) })}
                      className="w-full mt-3 cursor-pointer"
                    />
                  </Field>

                  <Field>
                    <Label>Pattern Overlay</Label>
                    <Select
                      value={config.pattern}
                      onChange={(e) => updateConfig({ pattern: e.target.value as any })}
                    >
                      <option value="">None</option>
                      <option value="dots">Dots</option>
                      <option value="stripes">Stripes</option>
                      <option value="checkerboard">Checkerboard</option>
                      <option value="grid">Grid</option>
                    </Select>
                  </Field>

                  {config.pattern && (
                    <Field>
                      <Label>Pattern Color</Label>
                      <div className="flex gap-2 mt-3">
                        <input
                          type="color"
                          value={`#${config.patternColor || config.fgColor}`}
                          onChange={(e) => updateConfig({ patternColor: e.target.value.slice(1) })}
                          className="w-12 h-10 rounded-lg cursor-pointer border border-zinc-300 dark:border-zinc-600"
                        />
                        <Input
                          type="text"
                          value={config.patternColor}
                          onChange={(e) => updateConfig({ patternColor: e.target.value.replace('#', '') })}
                          className="flex-1 font-mono text-sm"
                          placeholder={config.fgColor}
                        />
                      </div>
                    </Field>
                  )}

                  {config.format === 'jpeg' && (
                    <Field>
                      <Label>Quality: {config.quality}%</Label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={config.quality}
                        onChange={(e) => updateConfig({ quality: parseInt(e.target.value) })}
                        className="w-full mt-3 cursor-pointer"
                      />
                    </Field>
                  )}
                </>
              )}
            </FieldGroup>
          </Fieldset>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-8 space-y-4">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
              <Heading level={3}>Preview</Heading>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 mt-4 mb-4 flex items-center justify-center min-h-[300px] max-h-[500px]">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-w-full max-h-full rounded shadow-lg"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>

              <Field>
                <Label>Generated URL</Label>
                <code className="block bg-zinc-900 dark:bg-zinc-950 text-green-400 p-3 rounded-lg text-xs overflow-x-auto font-mono mt-3">
                  https://imges.dev{imageUrl}
                </code>
              </Field>

              {shortUrl && (
                <Field>
                  <Label>Short URL</Label>
                  <div className="flex items-center gap-2 mt-3">
                    <code className="flex-1 bg-zinc-900 dark:bg-zinc-950 text-cyan-400 p-3 rounded-lg text-sm font-mono">
                      https://imges.dev{shortUrl}
                    </code>
                    <Button
                      color="cyan"
                      onClick={copyShortUrl}
                    >
                      {copied ? '✓ Copied' : 'Copy'}
                    </Button>
                  </div>
                </Field>
              )}

              {shortUrlError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm mt-3">
                  {shortUrlError}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mt-4">
                <Button
                  color="cyan"
                  onClick={downloadImage}
                >
                  <ArrowDownTrayIcon />
                  Download
                </Button>
                <Button
                  color="indigo"
                  onClick={() => {
                    const fullUrl = `${window.location.origin}${imageUrl}`;
                    navigator.clipboard.writeText(fullUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  <LinkIcon />
                  Copy URL
                </Button>
                <Button
                  color="emerald"
                  onClick={generateShortUrl}
                  disabled={isGeneratingShortUrl}
                >
                  <LinkIcon />
                  {isGeneratingShortUrl ? 'Creating...' : 'Shorten'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
