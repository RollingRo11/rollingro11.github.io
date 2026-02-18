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

      <main className="blog-index-container">
        <h1
          className="blog-index-title"
          style={{ fontFamily: "var(--font-crimson-pro)" }}
        >
          Blog
        </h1>

        {posts.length === 0 && (
          <p className="blog-index-empty">No posts yet.</p>
        )}

        <div className="blog-index-list">
          {posts.map((post) => (
            <article key={post.slug} className="blog-index-entry">
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
