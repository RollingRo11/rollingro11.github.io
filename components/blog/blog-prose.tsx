// Server component — renders the post markdown to static HTML at build time.
// No "use client": react-markdown / remark / rehype / KaTeX run during
// prerender and are NOT shipped to or re-run in the browser, which is what
// removes the on-open hydration lag.

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import "katex/dist/katex.min.css";
import CodeBlock from "@/components/srcl/CodeBlock";
import Divider from "@/components/srcl/Divider";
import { simpleTableClasses } from "@/components/srcl/SimpleTable";

// Flatten a react-markdown code node's children into the raw source string.
function nodeText(node: React.ReactNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (React.isValidElement(node)) return nodeText((node.props as { children?: React.ReactNode }).children);
  return "";
}

export function BlogProse({ content }: { content: string }) {
  return (
    <div className="blog-prose">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeSlug]}
        components={{
          // Tables use the SRCL SimpleTable styling.
          table: ({ children }) => (
            <div className={simpleTableClasses.scrollWrapper}>
              <table className={simpleTableClasses.root}>{children}</table>
            </div>
          ),
          // Fenced code blocks render through the SRCL CodeBlock.
          pre: ({ children }) => <CodeBlock>{nodeText(children)}</CodeBlock>,
          // Horizontal rules use the SRCL Divider.
          hr: () => <Divider style={{ margin: "1.5rem 0" }} />,
          img: ({ src, alt }) => {
            if (!src) return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={typeof src === "string" ? src : undefined}
                alt={alt ?? ""}
                loading="lazy"
                decoding="async"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
