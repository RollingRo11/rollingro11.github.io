import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  /* Optional short label shown after "Rohan Kathuria /" in the nav for this
     post. Set via the `crumb` frontmatter field; falls back to nothing. */
  crumb?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
  minutes: number;
}

/* Minutes to read the whole post: every word of text, code, math and
   footnotes at 200 words a minute (it's technical reading), plus 12 seconds
   a figure. Only link and image URLs are left out of the count. */
function readingMinutes(markdown: string): number {
  const text = markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\]\([^)]*\)/g, "]");
  const words = text.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
  const figures = markdown.match(/!\[/g)?.length ?? 0;
  return Math.max(1, Math.round(words / 200 + (figures * 12) / 60));
}

/* Frontmatter dates are bare days ("2026-01-18"), which parse as UTC
   midnight; formatting in UTC keeps the build machine's zone from shifting
   them a day. */
export function formatPostDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        summary: data.summary ?? "",
        crumb: data.crumb ?? undefined,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    summary: data.summary ?? "",
    crumb: data.crumb ?? undefined,
    content,
    minutes: readingMinutes(content),
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}
