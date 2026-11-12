"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NotesListProps = { notes: { slug: string; title: string }[]; current?: string };

// The notes contents, shown two ways: from 1024px up as a panel beside the
// article (NotesList, placed by notes-view.tsx); below that as this drawer,
// opened by the icon at the top left, which stays above the drawer so the
// same icon closes it.
export function NotesNav({ notes, current }: NotesListProps) {
  const [open, setOpen] = useState(false);

  // Picking a note navigates without a reload, so close the drawer then too.
  useEffect(() => setOpen(false), [current]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="notes-nav__toggle"
        aria-label={open ? "Hide other posts" : "Show other posts"}
        aria-expanded={open}
        aria-controls="notes-nav"
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          {open ? (
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" />
          ) : (
            <path d="M2 4.5h14M2 9h14M2 13.5h9" stroke="currentColor" strokeWidth="1.5" />
          )}
        </svg>
      </button>

      {open && <div className="notes-nav__backdrop" onClick={() => setOpen(false)} />}

      <nav id="notes-nav" className={`notes-nav${open ? " notes-nav--open" : ""}`} aria-label="Notes">
        <NotesList notes={notes} current={current} />
      </nav>
    </>
  );
}

export function NotesList({ notes, current }: NotesListProps) {
  return (
    <>
      <p className="label">Other posts</p>
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.slug}>
            <Link
              href={`/notes/${note.slug}/`}
              aria-current={note.slug === current ? "page" : undefined}
            >
              {note.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
