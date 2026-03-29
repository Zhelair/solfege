"use client";

import { useEffect, useMemo, useState } from "react";

import { useAppSettings } from "@/components/providers/app-providers";
import { createProject, loadProjects, saveProjects } from "@/lib/project-storage";
import { createDefaultProject, type StudioProject } from "@/lib/solfege-data";

type GuideMessage = {
  id: string;
  role: "user" | "assistant";
  body: string;
};

const guideTopics = [
  "Beatmatching and sync",
  "Camelot and harmonic mixing",
  "EQ for rough club mixes",
  "Compression for punch and control",
  "How to build a better drop",
  "How to choose references intelligently",
];

const starterMessages: GuideMessage[] = [
  {
    id: "g-1",
    role: "user",
    body: "How do I make the intro feel tense without overcrowding it?",
  },
  {
    id: "g-2",
    role: "assistant",
    body:
      "Start with less melodic information. Let the rhythm and texture set the pressure first, then bring the vocal or hook closer to the transition.",
  },
];

function ensureGuideProject(): StudioProject {
  const projects = loadProjects();
  if (projects.length > 0) {
    return projects[0];
  }

  return createProject(
    createDefaultProject({
      title: "Guide notes starter",
      mood: "focused, learning, structured",
    }),
  );
}

function buildAssistantReply(question: string): string {
  if (!question.trim()) {
    return "Ask about transitions, harmonic mixing, EQ, compression, arrangement, or project direction.";
  }

  return `For this idea, start practical: ${question.trim()} Break the problem into timing, energy, and clarity. Make one change at a time and listen for what becomes stronger.`;
}

export function GuideScreen() {
  const { t } = useAppSettings();
  const [project, setProject] = useState<StudioProject | null>(null);
  const [messages, setMessages] = useState<GuideMessage[]>(starterMessages);
  const [draft, setDraft] = useState("How should I transition into a harder drop?");
  const [status, setStatus] = useState("Guide notes will be saved into your active local project.");

  useEffect(() => {
    queueMicrotask(() => {
      setProject(ensureGuideProject());
    });
  }, []);

  const notes = useMemo(() => project?.notes ?? [], [project]);
  const latestAssistantMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "assistant") ?? null,
    [messages],
  );

  function updateProjectNotes(nextNotes: string[]) {
    if (!project) {
      return;
    }

    const nextProject: StudioProject = {
      ...project,
      notes: nextNotes,
      updatedAt: new Date().toISOString(),
    };

    setProject(nextProject);
    saveProjects([nextProject, ...loadProjects().filter((item) => item.id !== nextProject.id)]);
  }

  function sendQuestion() {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    const reply = buildAssistantReply(trimmed);
    setMessages((current) => [
      ...current,
      { id: `g-user-${Date.now()}`, role: "user", body: trimmed },
      { id: `g-assistant-${Date.now() + 1}`, role: "assistant", body: reply },
    ]);
    setDraft("");
    setStatus("Added a new guide answer. Save it as a note if it is useful.");
  }

  function saveLatestNote() {
    if (!latestAssistantMessage) {
      return;
    }

    const nextNotes = [latestAssistantMessage.body, ...notes].slice(0, 12);
    updateProjectNotes(nextNotes);
    setStatus("Saved the latest guide answer into local project notes.");
  }

  return (
    <section className="stack-gap">
      <div className="section-heading">
        <span className="eyebrow">{t.guide.title}</span>
        <h1>{t.guide.subtitle}</h1>
        <p>{status}</p>
      </div>

      <div className="guide-grid">
        <section className="panel">
          <div className="panel-head">
            <p className="panel-title">Guide chat</p>
            <span className="panel-badge">Separate space</span>
          </div>

          <div className="chat-stack">
            {messages.map((message) => (
              <div className={`chat-bubble${message.role === "assistant" ? " assistant" : ""}`} key={message.id}>
                {message.body}
              </div>
            ))}
          </div>

          <label className="field-stack field-wide">
            <span>Ask the guide</span>
            <textarea className="text-area" onChange={(event) => setDraft(event.target.value)} rows={5} value={draft} />
          </label>

          <div className="action-row">
            <button className="primary-action" onClick={sendQuestion} type="button">
              Ask
            </button>
            <button className="secondary-action" onClick={saveLatestNote} type="button">
              Create note
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <p className="panel-title">Topics</p>
            <span className="panel-badge">Built-in</span>
          </div>

          <div className="topic-grid">
            {guideTopics.map((topic) => (
              <article className="topic-card" key={topic}>
                <p>{topic}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-head">
          <p className="panel-title">Saved notes</p>
          <span className="panel-badge">{notes.length}</span>
        </div>

        <div className="topic-grid">
          {notes.length === 0 ? (
            <article className="topic-card">
              <p>No guide notes yet. Save a strong answer and it will live here.</p>
            </article>
          ) : (
            notes.map((note) => (
              <article className="topic-card" key={note}>
                <p>{note}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </section>
  );
}