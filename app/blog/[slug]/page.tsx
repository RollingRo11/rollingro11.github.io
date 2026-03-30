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

      <main className="max-w-[52rem] mx-auto pl-6 sm:pl-[calc(2.5rem+2.5rem+1.25rem)] lg:pl-[calc(5rem+2.5rem+1.25rem)] pr-6 sm:pr-10 lg:pr-20 pb-12 sm:pb-16 lg:pb-20">
        <header className="mb-10">
          <h1
            className="text-[34px] font-normal leading-[1.25] mb-2"
            style={{ fontFamily: "var(--font-crimson-pro)" }}
          >
            {post.title}
          </h1>
          <time className="text-[13px] opacity-55 italic" style={{ fontFamily: "var(--font-paper-mono), monospace" }}>
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
