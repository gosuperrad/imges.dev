'use client';

import { useState, useEffect } from 'react';
import { Subheading } from './catalyst/heading';
import { Code } from './catalyst/text';

export function ExampleCard({ 
  title, 
  code, 
  color 
}: { 
  title: string; 
  code: string; 
  color: 'blue' | 'purple';
}) {
  const [copied, setCopied] = useState(false);
  const [displayUrl, setDisplayUrl] = useState(code);
  
  useEffect(() => {
    // Only run on client side after mount
    setDisplayUrl(`${window.location.origin}${code}`);
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="p-4">
        <div className="mb-2">
          <Subheading>{title}</Subheading>
        </div>
        <div 
          onClick={handleCopy}
          className="relative group cursor-pointer mb-3"
        >
          <Code className="block px-3 py-2 text-xs break-all hover:bg-zinc-800 dark:hover:bg-zinc-900 transition-colors">
            {displayUrl}
          </Code>
          {copied && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Copied!
            </div>
          )}
        </div>
        <img 
          src={code} 
          alt={title} 
          className="rounded-lg border border-zinc-200 dark:border-zinc-700 w-full" 
        />
      </div>
    </div>
  );
}
