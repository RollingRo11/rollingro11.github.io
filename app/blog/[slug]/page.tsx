import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { SiteHeader } from "@/components/site/header";
import { Prose } from "@/components/blog/prose";
import { MarginNotes } from "@/components/blog/margin-notes";
import { TableOfContents } from "@/components/blog/table-of-contents";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — Rohan Kathuria`,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const dateLabel = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="page">
      <TableOfContents />
      <SiteHeader wide crumb={post.crumb} />

      <main className="site-main shell shell--wide">
        <header className="post-header" data-rise style={{ "--rise-i": 1 } as React.CSSProperties}>
          <time className="meta" dateTime={post.date}>
            {dateLabel}
          </time>
          <h1 className="page-title">{post.title}</h1>
          {post.summary && <p className="page-subtitle">{post.summary}</p>}
        </header>

        <div data-rise style={{ "--rise-i": 2 } as React.CSSProperties}>
          <Prose content={post.content} />
        </div>
      </main>

      <MarginNotes />
    </div>
  );
}
