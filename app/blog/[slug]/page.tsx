import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogPostRenderer } from "@/components/blog/blog-post-renderer";
import { BlogScrollbar } from "@/components/blog/blog-scrollbar";

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

  return (
    <div className="min-h-dvh selection:bg-blue-600 selection:text-white dark:bg-[#222129] dark:text-white dark:selection:bg-[#85BAA1] dark:selection:text-white bg-white text-black">
      <BlogScrollbar title={post.title} />
      <BlogHeader />

      <main className="blog-post-container">
        <header className="blog-post-header">
          <h1
            className="blog-post-title"
            style={{ fontFamily: "var(--font-crimson-pro)" }}
          >
            {post.title}
          </h1>
          <time className="blog-post-date">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </header>

        <BlogPostRenderer content={post.content} />
      </main>
    </div>
  );
}
