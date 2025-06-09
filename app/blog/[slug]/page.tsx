import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import BlogClientWrapper from "../blog-client-wrapper";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

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

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogClientWrapper>
      <div className="w-full max-w-2xl px-8 lg:px-12">
        <article className="mb-8 pt-4 lg:mb-16 lg:pt-6">
          <header className="mb-2">
            <Link
              href="/blog"
              className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 hover:underline mb-4 inline-block"
            >
              ← Back to Blog
            </Link>
            <h1 className="text-lg sm:text-3xl font-bold mb-1 text-left">{post.title}</h1>
            {post.date && (
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{formatDate(post.date)}</p>
            )}
          </header>

          <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none prose-headings:text-black dark:prose-headings:text-white prose-p:text-black dark:prose-p:text-white prose-li:text-black dark:prose-li:text-white prose-strong:text-black dark:prose-strong:text-white prose-code:text-black dark:prose-code:text-white prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-blockquote:text-black dark:prose-blockquote:text-white prose-a:text-black dark:prose-a:text-white prose-a:hover:underline prose-h1:text-base sm:prose-h1:text-xl">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
              components={{
                img: ({ src, alt, ...props }) => (
                  <img src={src} alt={alt} className="rounded-lg shadow-lg max-w-full h-auto" {...props} />
                ),
                figure: ({ children, ...props }) => (
                  <figure className="my-8 text-center" {...props}>
                    {children}
                  </figure>
                ),
                figcaption: ({ children, ...props }) => (
                  <figcaption className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 italic" {...props}>
                    {children}
                  </figcaption>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </BlogClientWrapper>
  );
}
