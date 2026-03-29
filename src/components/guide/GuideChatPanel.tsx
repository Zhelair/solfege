"use client";

import type { GuideChatMessage } from "../../lib/guide-data";

type GuideChatPanelProps = {
  messages: GuideChatMessage[];
  composerValue?: string;
  onComposerChange?: (value: string) => void;
  onSend?: () => void;
  onCreateNote?: (message: GuideChatMessage) => void;
};

export function GuideChatPanel({
  messages,
  composerValue = "",
  onComposerChange,
  onSend,
  onCreateNote
}: GuideChatPanelProps) {
  return (
    <section className="space-y-4 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,28,0.92),rgba(8,12,22,0.76))] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/65">Guide chat</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Ask for mixing, theory, or project help</h2>
        </div>
        <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
          Project-aware
        </span>
      </div>

      <div className="space-y-3">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`rounded-3xl border px-4 py-4 ${
              message.role === "assistant"
                ? "border-cyan-300/20 bg-cyan-300/8"
                : "border-white/10 bg-white/5"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">{message.role}</p>
                <h3 className="mt-1 text-base font-semibold text-white">{message.title}</h3>
              </div>
              <span className="text-[11px] text-white/42">{message.timestamp}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/74">{message.body}</p>

            {message.role === "assistant" ? (
              <button
                type="button"
                onClick={() => onCreateNote?.(message)}
                className="mt-4 inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-medium text-white transition hover:border-cyan-300/35 hover:bg-cyan-300/10"
              >
                Create note
              </button>
            ) : null}
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/18 p-3">
        <textarea
          value={composerValue}
          onChange={(event) => onComposerChange?.(event.target.value)}
          placeholder="Ask about transitions, sound engineering, arrangement, or what the intro should do..."
          className="min-h-28 w-full resize-none bg-transparent px-2 py-2 text-sm leading-6 text-white outline-none placeholder:text-white/32"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {["Harder", "Cleaner", "More chaotic", "Better intro"].map((chip) => (
              <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                {chip}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onSend}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(34,211,238,0.25)] transition hover:brightness-110"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
