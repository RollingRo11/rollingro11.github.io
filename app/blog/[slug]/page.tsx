import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs, formatPostDate } from "@/lib/blog";
import { SiteHeader } from "@/components/site/header";
import { Prose } from "@/components/blog/prose";
import { MarginNotes } from "@/components/blog/margin-notes";

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

// Laid out like a Distill article: title and dek, a byline between two
// full-width hairlines, then the article column.
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="page">
      <SiteHeader crumb={post.crumb} back="/blog/" />

      <main className="d-post">
        <header className="d-title shell">
          <h1>{post.title}</h1>
          {post.summary && <p>{post.summary}</p>}
        </header>

        <div className="d-byline">
          <dl className="d-byline__grid shell">
            <div>
              <dt className="label">Published</dt>
              <dd>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              </dd>
            </div>
            <div>
              <dt className="label">Reading time</dt>
              <dd>{post.minutes} min</dd>
            </div>
          </dl>
        </div>

        <div className="d-article">
          <div className="shell">
            <Prose content={post.content} />
          </div>
        </div>
      </main>

      <MarginNotes />
    </div>
  );
}
