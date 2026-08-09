// Server component — the post markdown is rendered to static HTML at build
// time. No "use client": remark / rehype / KaTeX run during prerender and are
// never shipped to the browser, so opening a post stays instant.

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import "katex/dist/katex.min.css";
import { Equation } from "@/components/blog/equation";

// Flatten a react-markdown code node's children back into its source string.
function nodeText(node: React.ReactNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (React.isValidElement(node)) return nodeText((node.props as { children?: React.ReactNode }).children);
  return "";
}

export function Prose({ content }: { content: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeSlug]}
        components={{
          table: ({ children }) => (
            <div className="table-wrap">
              <table className="table">{children}</table>
            </div>
          ),
          // ```equation blocks become interactive annotated equations;
          // everything else falls through to a plain code block.
          pre: ({ children }) => {
            const child = Array.isArray(children) ? children[0] : children;
            const className = React.isValidElement(child)
              ? String((child.props as { className?: string }).className ?? "")
              : "";
            if (className.includes("language-equation")) {
              return <Equation source={nodeText(children)} />;
            }
            return (
              <pre className="code-block">
                <code>{nodeText(children)}</code>
              </pre>
            );
          },
          // Figures have transparent backgrounds, so in dark mode their ink is
          // flipped to read against the dark ground. Full-colour artwork opts
          // out with the markdown title slot: ![alt](/art.webp "keep-colors").
          // The title is consumed as a directive, never forwarded to the DOM,
          // so it can't surface as a tooltip.
          img: ({ src, alt, title }) => {
            if (!src) return null;
            const keepColors = title === "keep-colors";
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={typeof src === "string" ? src : undefined}
                alt={alt ?? ""}
                loading="lazy"
                decoding="async"
                data-invert={keepColors ? undefined : ""}
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
