import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { NotesView } from "@/components/notes/notes-view";

export function generateStaticParams() {
  return getAllSlugs("notes").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getPostBySlug(slug, "notes");
  if (!note) return { title: "Not Found" };
  return {
    title: `${note.title} — Rohan Kathuria`,
    description: note.summary,
    robots: { index: false, follow: false },
  };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getPostBySlug(slug, "notes")) notFound();
  return <NotesView slug={slug} />;
}
