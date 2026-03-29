"use client";

import type { GuideNote } from "../../lib/guide-data";

type NoteCardProps = {
  note: GuideNote;
  onOpen?: (note: GuideNote) => void;
};

export function NoteCard({ note, onOpen }: NoteCardProps) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm transition hover:border-cyan-300/40 hover:bg-white/7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/70">{note.createdAt}</p>
          <h3 className="mt-2 text-base font-semibold text-white">{note.title}</h3>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-white/60">
          {note.language.toUpperCase()}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-white/72">{note.body}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {note.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] text-white/66"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onOpen?.(note)}
        className="mt-4 inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/18"
      >
        Open note
      </button>
    </article>
  );
}
