"use client";

import type { GuideTopic } from "../../lib/guide-data";
import { GuideTopicCard } from "./GuideTopicCard";

type GuideTopicGridProps = {
  topics: GuideTopic[];
  onOpenTopic?: (topic: GuideTopic) => void;
};

export function GuideTopicGrid({ topics, onOpenTopic }: GuideTopicGridProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Topics</p>
        <h2 className="mt-2 text-lg font-semibold text-white">Built-in guide topics</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {topics.map((topic) => (
          <GuideTopicCard key={topic.id} topic={topic} onOpen={onOpenTopic} />
        ))}
      </div>
    </section>
  );
}
