import type { MDXComponents } from "mdx/types";

/**
 * This file allows you to provide custom React components
 * to be used in MDX files. You can import and use any
 * React component you want, including inline styles,
 * components from other libraries, and more.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Customize built-in components with Tailwind styling
    h1: ({ children }) => (
      <h1 className="mt-2 text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 text-xl font-display font-semibold text-zinc-900 dark:text-zinc-50">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400 list-disc list-inside">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400 list-decimal list-inside">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="ml-4">{children}</li>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-zinc-900 dark:text-zinc-50 underline hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono text-zinc-900 dark:text-zinc-50">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="mt-4 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 overflow-x-auto">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-4 pl-4 border-l-4 border-zinc-300 dark:border-zinc-700 italic text-zinc-600 dark:text-zinc-400">
        {children}
      </blockquote>
    ),
    ...components,
  };
}
