import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { BlogHeader } from "@/components/blog/blog-header";
import { Card } from "@/components/srcl";

export const metadata = {
  title: "Blog — Rohan Kathuria",
  description: "Blog posts by Rohan Kathuria",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="srcl-page">
      <BlogHeader crumb="Blog" />

      <main className="srcl-main">
        <Card title="Posts">
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            <ul className="srcl-post-list">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}/`} className="srcl-post-row">
                    <time>
                      {new Date(post.date)
                        .toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
                        .toUpperCase()}
                    </time>
                    <span className="srcl-post-title">
                      <span className="srcl-post-title-ink">{post.title}</span>
                    </span>
                  </Link>
                  {post.summary && <p className="srcl-post-summary">{post.summary}</p>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
    </div>
  );
}
