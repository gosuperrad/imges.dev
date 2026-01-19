'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/16/solid';

interface StackedLayoutProps {
  children: ReactNode;
}

export function StackedLayout({ children }: StackedLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Builder' },
    { href: '/docs', label: 'Docs' },
    { href: '/examples', label: 'Examples' },
  ];

  return (
    <div className="relative isolate flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 lg:px-4 border-b border-zinc-950/10 dark:border-white/10 lg:border-0">
        {/* Logo/Brand */}
        <Link 
          href="/"
          className="flex items-center gap-2 rounded-lg p-2 text-lg font-semibold sm:text-base"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            imges.dev
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <span key={item.href} className="relative">
                  {isActive && (
                    <span 
                      className="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-zinc-950 dark:bg-white"
                    />
                  )}
                  <Link
                    href={item.href}
                    className="relative flex min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-950 hover:bg-zinc-950/5 dark:text-white dark:hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                </span>
              );
            })}
          </div>

          <div aria-hidden="true" className="h-6 w-px bg-zinc-950/10 dark:bg-white/10"></div>

          {/* GitHub Link */}
          <a
            href="https://github.com/gosuperrad/imges.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-950/5 dark:text-white dark:hover:bg-white/5"
            aria-label="View on GitHub"
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
            <span>GitHub</span>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-zinc-950/5 dark:hover:bg-white/5"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6 text-zinc-950 dark:text-white" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-zinc-950 dark:text-white" />
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-950/10 dark:border-white/10 bg-white dark:bg-zinc-900">
          <nav className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isActive
                      ? 'bg-zinc-950/10 text-zinc-950 dark:bg-white/10 dark:text-white'
                      : 'text-zinc-600 hover:bg-zinc-950/5 dark:text-zinc-400 dark:hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href="https://github.com/gosuperrad/imges.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-zinc-600 hover:bg-zinc-950/5 dark:text-zinc-400 dark:hover:bg-white/5"
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
              GitHub
            </a>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex flex-1 flex-col pb-2 lg:px-2">
        <div className="grow p-4 sm:p-6 lg:p-10 lg:rounded-lg lg:bg-white lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
