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

  const dateLabel = new Date(post.date)
    .toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
    .toUpperCase();

  return (
    <div className="page">
      <TableOfContents />
      <SiteHeader crumb={post.crumb} />

      <main className="site-main shell">
        <header className="post-head" data-rise style={{ "--rise-i": 1 } as React.CSSProperties}>
          <p className="post-head__meta">
            <time dateTime={post.date}>{dateLabel}</time>
            {post.crumb && (
              <>
                <span className="post-head__sep" aria-hidden="true">
                  ·
                </span>
                <span>{post.crumb.toUpperCase()}</span>
              </>
            )}
          </p>
          <h1 className="page-title page-title--post">{post.title}</h1>
          {post.summary && <p className="post-head__summary">{post.summary}</p>}
        </header>

        <div className="post__body" data-rise style={{ "--rise-i": 2 } as React.CSSProperties}>
          <Prose content={post.content} />
        </div>
      </main>

      <MarginNotes />
    </div>
  );
}
