"use client";

import type { GuideNote } from "../../lib/guide-data";
import { NoteCard } from "./NoteCard";

type NotesListProps = {
  notes: GuideNote[];
  onOpenNote?: (note: GuideNote) => void;
};

export function NotesList({ notes, onOpenNote }: NotesListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Notes</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Saved takeaways</h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
          {notes.length} saved
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onOpen={onOpenNote} />
        ))}
      </div>
    </section>
  );
}
