import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { BlogHeader } from "@/components/blog/blog-header";

export const metadata = {
  title: "Blog — Rohan Kathuria",
  description: "Blog posts by Rohan Kathuria",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-dvh selection:bg-blue-600 selection:text-white dark:bg-[#222129] dark:text-white dark:selection:bg-[#85BAA1] dark:selection:text-white bg-white text-black">
      <BlogHeader />

      <main className="max-w-[52rem] mx-auto pl-6 sm:pl-[calc(2.5rem+2.5rem+1.25rem)] lg:pl-[calc(5rem+2.5rem+1.25rem)] pr-6 sm:pr-10 lg:pr-20 pb-12 sm:pb-16 lg:pb-20">
        <h1
          className="text-[32px] font-normal mb-10"
          style={{ fontFamily: "var(--font-crimson-pro)" }}
        >
          Blog
        </h1>

        {posts.length === 0 && (
          <p className="text-base opacity-60 italic">No posts yet.</p>
        )}

        <div className="flex flex-col gap-9">
          {posts.map((post) => (
            <article key={post.slug} className="flex flex-col gap-1">
              <Link
                href={`/blog/${post.slug}/`}
                className="blog-index-entry-title"
              >
                {post.title}
              </Link>
              <time className="blog-index-entry-date">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.summary && (
                <p className="blog-index-entry-summary">{post.summary}</p>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
