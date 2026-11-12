import { getAllPosts, getPostBySlug, formatPostDate } from "@/lib/blog";
import { SiteHeader } from "@/components/site/header";
import { Prose } from "@/components/blog/prose";
import { MarginNotes } from "@/components/blog/margin-notes";
import { NotesNav, NotesList } from "@/components/notes/notes-nav";

// The hidden notes section: one note at a time, laid out like a blog post,
// with every note listed in a contents sidebar. /notes/ shows the newest.
export function NotesView({ slug }: { slug?: string }) {
  const notes = getAllPosts("notes");
  const current = slug ?? notes[0]?.slug;
  const note = current ? getPostBySlug(current, "notes") : null;
  const list = notes.map(({ slug, title }) => ({ slug, title }));

  return (
    <div className="page page--notes">
      <SiteHeader
        crumb="notes"
        back="/"
        lead={
          <NotesNav notes={list} current={current} />
        }
      />

      {note ? (
        <main className="d-post">
          <header className="d-title shell">
            <h1>{note.title}</h1>
            {note.summary && <p>{note.summary}</p>}
          </header>

          <div className="d-byline">
            <dl className="d-byline__grid shell">
              <div>
                <dt className="label">Published</dt>
                <dd>
                  <time dateTime={note.date}>{formatPostDate(note.date)}</time>
                </dd>
              </div>
              <div>
                <dt className="label">Reading time</dt>
                <dd>{note.minutes} min</dd>
              </div>
            </dl>
          </div>

          <div className="d-article">
            <nav className="notes-panel" aria-label="Notes">
              <NotesList notes={list} current={current} />
            </nav>
            <div className="shell">
              <Prose content={note.content} />
            </div>
          </div>
        </main>
      ) : (
        <main className="d-post shell">
          <p className="d-index__empty">Nothing here yet.</p>
        </main>
      )}

      <MarginNotes />
    </div>
  );
}
