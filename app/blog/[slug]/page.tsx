import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogPostRenderer } from "@/components/blog/blog-post-renderer";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { Card } from "@/components/srcl";

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
    <div className="srcl-page">
      <BlogSidebar />
      <BlogHeader wide crumb={post.crumb} />

      <main className="srcl-main srcl-main--wide srcl-blogpost">
        <Card title={dateLabel}>
          <h1 className="srcl-post-h1">{post.title}</h1>
          <BlogPostRenderer content={post.content} />
        </Card>
      </main>
    </div>
  );
}
