"use client";

import type { GuideThread } from "../../lib/guide-data";

type GuideHistoryListProps = {
  threads: GuideThread[];
  onOpenThread?: (thread: GuideThread) => void;
};

export function GuideHistoryList({ threads, onOpenThread }: GuideHistoryListProps) {
  return (
    <aside className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.22)] backdrop-blur-sm">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">History</p>
        <h2 className="mt-2 text-lg font-semibold text-white">Recent guide threads</h2>
      </div>

      <div className="space-y-3">
        {threads.map((thread) => (
          <button
            key={thread.id}
            type="button"
            onClick={() => onOpenThread?.(thread)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-cyan-300/40 hover:bg-white/7"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium text-white">{thread.title}</h3>
                <p className="mt-1 text-sm leading-6 text-white/62">{thread.preview}</p>
              </div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-white/38">{thread.updatedAt}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {thread.topicIds.map((topicId) => (
                <span key={topicId} className="rounded-full bg-white/6 px-2.5 py-1 text-[10px] text-white/55">
                  {topicId}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
