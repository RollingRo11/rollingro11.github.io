import { writeFileSync } from "fs";

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function fetchBlogPosts() {
  try {
    const response = await fetch("https://rkathuria.bearblog.dev/feed/");
    const text = await response.text();

    // Parse XML manually (simple approach for Atom feed)
    const entries = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(text)) !== null) {
      const entryXml = match[1];
      const title = decodeHtmlEntities(entryXml.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] || "");
      const link = entryXml.match(/<link[^>]*href="([^"]*)"[^>]*\/>/)?.[1] || "";
      const summary = decodeHtmlEntities(entryXml.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)?.[1] || "");
      const published = entryXml.match(/<published>([\s\S]*?)<\/published>/)?.[1] || "";

      entries.push({ title, link, summary, published });
    }

    writeFileSync(
      "./data/blog-posts.json",
      JSON.stringify(entries.slice(0, 5), null, 2)
    );

    console.log(`Fetched ${entries.length} blog posts`);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    // Write empty array so build doesn't fail
    writeFileSync("./data/blog-posts.json", "[]");
  }
}

fetchBlogPosts();
