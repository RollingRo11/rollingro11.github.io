import Link from "next/link";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import { SiteHeader } from "@/components/site/header";

export const metadata = {
  title: "Writing — Rohan Kathuria",
  description: "Notes on mechanistic interpretability by Rohan Kathuria.",
};

// Listed the way distill.pub lists its articles: the date in a narrow left
// column, then the title and description, one hairline row per post.
export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="page">
      <SiteHeader crumb="Writing" back="/" />

      <main className="d-post">
        <header className="d-title shell">
          <h1>Writing</h1>
        </header>

        <div className="d-article">
          <div className="shell">
            {posts.length === 0 ? (
              <p className="d-index__empty">Nothing published yet.</p>
            ) : (
              <ul className="d-index">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}/`} className="d-index__entry">
                      <time className="d-index__date" dateTime={post.date}>
                        {formatPostDate(post.date)}
                      </time>
                      <span className="d-index__text">
                        <span className="d-index__title">{post.title}</span>
                        {post.summary && <span className="d-index__summary">{post.summary}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
