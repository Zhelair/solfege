import { guideMessages, guideNotes, guideThreads, guideTopics } from "../../lib/guide-data";
import { GuideChatPanel } from "./GuideChatPanel";
import { GuideHistoryList } from "./GuideHistoryList";
import { GuideTopicGrid } from "./GuideTopicGrid";
import { NotesList } from "../notes/NotesList";

export function GuideSpace() {
  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <GuideChatPanel messages={guideMessages} />
        <GuideHistoryList threads={guideThreads} />
      </div>

      <GuideTopicGrid topics={guideTopics} />
      <NotesList notes={guideNotes} />
    </section>
  );
}
