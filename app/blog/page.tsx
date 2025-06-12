import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import BlogClientWrapper from "./blog-client-wrapper";

function formatDate(dateString: string) {
  // Parse as local date to avoid timezone issues
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndex() {
  const posts = getBlogPosts();

  return (
    <BlogClientWrapper>
      <div className="w-full max-w-2xl px-2 sm:px-0">
        <section className="mb-8 pt-2 lg:mb-16 lg:pt-6">
          <h1 className="text-lg sm:text-3xl font-bold mb-8 text-left">Blog Posts</h1>
          {posts.length === 0 ? (
            <p className="text-base sm:text-2xl leading-relaxed">...</p>
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <article key={post.slug} className="border-b border-gray-300 dark:border-gray-600 pb-2">
                  <Link href={`/blog/${post.slug}`} className="block group no-underline">
                    <h2 className="text-base sm:text-xl font-semibold mb-1 group-hover:underline">{post.title}</h2>
                    {post.date && (
                      <p className="text-gray-600 dark:text-gray-400 mb-1 text-sm sm:text-base">
                        {formatDate(post.date)}
                      </p>
                    )}
                    {post.excerpt && (
                      <p className="text-sm sm:text-lg leading-tight text-gray-700 dark:text-gray-300">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </BlogClientWrapper>
  );
}
