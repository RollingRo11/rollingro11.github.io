import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogProse } from "@/components/blog/blog-prose";
import { BlogMarginNotes } from "@/components/blog/blog-margin-notes";
import { BlogSidebar } from "@/components/blog/blog-sidebar";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — Rohan Kathuria`,
    description: post.summary,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const dateLabel = new Date(post.date)
    .toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
    .toUpperCase();

  return (
    <div className="srcl-page srcl-page--blog">
      <BlogSidebar />
      <BlogHeader wide crumb={post.crumb} />

      <main className="srcl-main srcl-main--wide srcl-blogpost">
        <p className="srcl-post-date">{dateLabel}</p>
        <h1 className="srcl-post-h1">{post.title}</h1>
        <BlogProse content={post.content} />
      </main>

      <BlogMarginNotes />
    </div>
  );
}
