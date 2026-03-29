"use client";

import { useEffect, useState } from "react";

import { loadGenerationHistory, loadProjects } from "@/lib/project-storage";
import type { GenerationHistoryEntry, StudioProject } from "@/lib/solfege-data";

export default function HistoryPage() {
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [history, setHistory] = useState<GenerationHistoryEntry[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setProjects(loadProjects());
      setHistory(loadGenerationHistory());
    });
  }, []);

  return (
    <section className="stack-gap">
      <div className="section-heading">
        <span className="eyebrow">History</span>
        <h1>Saved generations, remixes, and project versions.</h1>
      </div>

      <div className="guide-grid">
        <section className="panel">
          <div className="panel-head">
            <p className="panel-title">Projects</p>
            <span className="panel-badge">{projects.length}</span>
          </div>

          <div className="topic-grid">
            {projects.length === 0 ? (
              <article className="topic-card"><p>No saved projects yet.</p></article>
            ) : (
              projects.map((project) => (
                <article className="topic-card" key={project.id}>
                  <p className="reference-title">{project.title}</p>
                  <p>{project.mood}</p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <p className="panel-title">Generation history</p>
            <span className="panel-badge">{history.length}</span>
          </div>

          <div className="topic-grid">
            {history.length === 0 ? (
              <article className="topic-card"><p>No generation history yet.</p></article>
            ) : (
              history.slice(0, 8).map((entry) => (
                <article className="topic-card" key={entry.id}>
                  <p className="reference-title">{entry.title}</p>
                  <p>{entry.resultSummary || `${entry.durationSeconds}s ${entry.mode}`}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
}