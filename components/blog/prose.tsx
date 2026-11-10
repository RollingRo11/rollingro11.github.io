// Server component — the post markdown is rendered to static HTML at build
// time. No "use client": remark / rehype / KaTeX run during prerender and are
// never shipped to the browser, so opening a post stays instant.

import path from "node:path";
import sharp from "sharp";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import "katex/dist/katex.min.css";

// Figures load lazily as you scroll. Without a size in the HTML each one
// arrives zero-height and shoves everything below it down, and the margin
// notes re-measure; reading each file's dimensions at build lets the browser
// reserve the space up front.
async function imageSizes(markdown: string) {
  const srcs = new Set(Array.from(markdown.matchAll(/!\[[^\]]*\]\(\s*(\/[^)\s]+)/g), (m) => m[1]));
  const sizes = new Map<string, { width?: number; height?: number }>();
  await Promise.all(
    Array.from(srcs, async (src) => {
      const { width, height } = await sharp(path.join(process.cwd(), "public", src)).metadata();
      sizes.set(src, { width, height });
    }),
  );
  return sizes;
}

export async function Prose({ content }: { content: string }) {
  const sizes = await imageSizes(content);

  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeSlug]}
        components={{
          // Figures have transparent backgrounds, so in dark mode their ink is
          // flipped to read against the dark ground. Full-colour artwork opts
          // out with the markdown title slot: ![alt](/art.webp "keep-colors").
          // The title is consumed as a directive, never forwarded to the DOM,
          // so it can't surface as a tooltip.
          img: ({ src, alt, title }) => {
            if (typeof src !== "string") return null;
            return (
              <img
                src={src}
                alt={alt ?? ""}
                {...sizes.get(src)}
                loading="lazy"
                decoding="async"
                data-invert={title === "keep-colors" ? undefined : ""}
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
