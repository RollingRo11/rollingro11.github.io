import { NotesView } from "@/components/notes/notes-view";

// Hidden: not linked from the site and kept out of search engines.
export const metadata = {
  title: "Notes — Rohan Kathuria",
  robots: { index: false, follow: false },
};

export default function NotesIndex() {
  return <NotesView />;
}
