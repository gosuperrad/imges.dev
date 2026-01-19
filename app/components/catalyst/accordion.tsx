'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="border-b border-zinc-800">
          <DisclosureButton className="flex w-full items-center justify-between py-4 text-left cursor-pointer">
            <span className="text-sm font-semibold text-white">{title}</span>
            <ChevronDownIcon
              className={clsx(
                'h-5 w-5 text-zinc-400 transition-transform duration-200',
                open ? 'rotate-180' : ''
              )}
            />
          </DisclosureButton>
          <DisclosurePanel className="pb-4">
            {children}
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-zinc-800">{children}</div>;
}
