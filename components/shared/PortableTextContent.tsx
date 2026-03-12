"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";

type Props = {
  value: unknown[];
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-text-secondary leading-relaxed">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="font-display text-2xl font-bold text-text-primary mt-8 mb-2">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-xl font-bold text-text-primary mt-6 mb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-lg font-bold text-text-primary mt-4 mb-2">
        {children}
      </h3>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-green underline"
      >
        {children}
      </a>
    ),
  },
};

export default function PortableTextContent({ value }: Props) {
  if (!value || !Array.isArray(value) || value.length === 0) return null;
  return (
    <PortableText
      value={value as import("@portabletext/types").PortableTextBlock[]}
      components={components}
    />
  );
}
