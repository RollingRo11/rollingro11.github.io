import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { SiteHeader } from "@/components/site/header";

export const metadata = {
  title: "Writing — Rohan Kathuria",
  description: "Notes on mechanistic interpretability by Rohan Kathuria.",
};

function formatDate(date: string) {
  return new Date(date)
    .toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
    .toUpperCase();
}

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="page">
      <SiteHeader crumb="Writing" />

      <main className="site-main shell">
        <div className="stack" data-rise style={{ "--rise-i": 1 } as React.CSSProperties}>
          <h1 className="page-title">Writing</h1>
        </div>

        <section data-rise style={{ "--rise-i": 2 } as React.CSSProperties}>
          {posts.length === 0 ? (
            <p className="muted">Nothing published yet.</p>
          ) : (
            <ul className="spec-list spec-list--entries">
              {posts.map((post) => (
                <li key={post.slug} className="spec-row">
                  <Link href={`/blog/${post.slug}/`} className="entry">
                    <time className="entry__date" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <span className="entry__title">{post.title}</span>
                    {post.summary && <span className="entry__summary">{post.summary}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
