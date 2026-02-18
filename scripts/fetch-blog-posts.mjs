import { writeFileSync, readdirSync, readFileSync, existsSync } from "fs";
import matter from "gray-matter";

const BLOG_DIR = "./content/blog";

function readLocalPosts() {
  if (!existsSync(BLOG_DIR)) {
    console.log("No content/blog directory found, writing empty array");
    writeFileSync("./data/blog-posts.json", "[]");
    return;
  }

  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = readFileSync(`${BLOG_DIR}/${file}`, "utf8");
      const { data } = matter(raw);
      return {
        title: data.title || slug,
        link: `/blog/${slug}/`,
        summary: data.summary || "",
        published: data.date || "",
      };
    })
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

  writeFileSync("./data/blog-posts.json", JSON.stringify(posts, null, 2));
  console.log(`Found ${posts.length} local blog post(s)`);
}

readLocalPosts();
