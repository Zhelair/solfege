"use client";

import type { GuideTopic } from "../../lib/guide-data";

type GuideTopicCardProps = {
  topic: GuideTopic;
  onOpen?: (topic: GuideTopic) => void;
};

const difficultyLabels: Record<GuideTopic["difficulty"], string> = {
  starter: "Starter",
  intermediate: "Intermediate",
  advanced: "Advanced"
};

export function GuideTopicCard({ topic, onOpen }: GuideTopicCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_rgba(255,255,255,0.03)_34%,_rgba(255,255,255,0.04))] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/18">
      <div className={`h-1.5 rounded-full bg-gradient-to-r ${topic.accent}`} />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/44">{topic.category}</p>
          <h3 className="mt-2 text-base font-semibold text-white">{topic.title}</h3>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
          {difficultyLabels[topic.difficulty]}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-white/72">{topic.summary}</p>

      <ul className="mt-4 space-y-2 text-sm text-white/66">
        {topic.keyPoints.slice(0, 3).map((point) => (
          <li key={point} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onOpen?.(topic)}
        className="mt-5 inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
      >
        Open topic
      </button>
    </article>
  );
}
