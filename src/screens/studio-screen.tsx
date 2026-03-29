"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAppSettings } from "@/components/providers/app-providers";
import {
  appendGenerationHistory,
  createProject,
  exportWorkspaceSnapshot,
  importWorkspaceSnapshot,
  loadGenerationHistory,
  loadProjects,
  loadStudioSettings,
  patchStudioSettings,
  saveProjects,
} from "@/lib/project-storage";
import {
  PREVIEW_PRESETS,
  createDefaultProject,
  createDefaultGenerationEntry,
  type GenerationHistoryEntry,
  type PreviewPreset,
  type StudioMode,
  type StudioProject,
} from "@/lib/solfege-data";

const referenceSlots = [
  { role: "main", title: "Reference 1", subtitle: "Mood / atmosphere / identity" },
  { role: "style", title: "Reference 2", subtitle: "Style / groove / structure" },
  { role: "lyrics", title: "Reference 3", subtitle: "Lyrics / vocal / message" },
] as const;

const modeCards: Array<{ id: StudioMode; label: string; description: string }> = [
  {
    id: "generate",
    label: "Generate",
    description: "Blend references into a fresh direction with structured controls and chat.",
  },
  {
    id: "remix",
    label: "Remix",
    description: "Reshape a main track idea while keeping the groove, message, or energy.",
  },
  {
    id: "spice-it",
    label: "Spice It",
    description: "Introduce controlled randomness, bolder turns, and surprising arrangement moves.",
  },
];

const initialChatPrompt = "Turn this into a rough punk-electro remix with meme energy, a sharp hook, and a dirtier drop.";

function getPresetForDuration(durationSeconds: number): PreviewPreset {
  return PREVIEW_PRESETS.reduce((closest, preset) => {
    const currentDistance = Math.abs(durationSeconds - closest.durationSeconds);
    const nextDistance = Math.abs(durationSeconds - preset.durationSeconds);
    return nextDistance < currentDistance ? preset : closest;
  }, PREVIEW_PRESETS[0]);
}

function ensureSeedProject(): StudioProject {
  const existing = loadProjects();
  if (existing.length > 0) {
    return existing[0];
  }

  const seeded = createProject(
    createDefaultProject({
      title: "Underground remix starter",
      mood: "hard, rough, club-ready",
      tags: ["starter", "remix", "night"],
    }),
  );

  return seeded;
}

export function StudioScreen() {
  const { t, locale, hydrated } = useAppSettings();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [mode, setMode] = useState<StudioMode>("generate");
  const [project, setProject] = useState<StudioProject | null>(null);
  const [history, setHistory] = useState<GenerationHistoryEntry[]>([]);
  const [chatPrompt, setChatPrompt] = useState(initialChatPrompt);
  const [quality, setQuality] = useState<128 | 192 | 256 | 320>(320);
  const [format, setFormat] = useState<"mp3" | "wav">("mp3");
  const [statusMessage, setStatusMessage] = useState("Load a project, tune the controls, and generate a direction.");

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    queueMicrotask(() => {
      const seededProject = ensureSeedProject();
      const settings = loadStudioSettings();
      setProject(seededProject);
      setHistory(loadGenerationHistory());
      setMode(seededProject.mode);
      setQuality(settings.outputQuality);
      setFormat(settings.preferredExportFormat);
    });
  }, [hydrated]);

  const selectedPreset = useMemo(() => {
    if (!project) {
      return PREVIEW_PRESETS[2];
    }

    return getPresetForDuration(project.durationSeconds);
  }, [project]);

  const resultSummary = useMemo(() => {
    if (!project) {
      return "No project loaded yet.";
    }

    const modeLabel = mode === "spice-it" ? "spiced" : mode;
    return `${project.title} is set for a ${selectedPreset.label.toLowerCase()} ${modeLabel} output at ${project.bpm} BPM with ${project.mood} energy.`;
  }, [mode, project, selectedPreset.label]);

  function persistProject(nextProject: StudioProject) {
    setProject(nextProject);
    saveProjects([nextProject, ...loadProjects().filter((item) => item.id !== nextProject.id)]);
  }

  function updateProject<K extends keyof StudioProject>(key: K, value: StudioProject[K]) {
    if (!project) {
      return;
    }

    const nextProject: StudioProject = {
      ...project,
      [key]: value,
      updatedAt: new Date().toISOString(),
    };

    persistProject(nextProject);
  }

  function updateReference(index: number, value: string) {
    if (!project) {
      return;
    }

    const slot = referenceSlots[index];
    const references = [...project.references];
    const current = references[index] ?? {
      id: `${slot.role}-${index}`,
      kind: "link" as const,
      role: slot.role,
      title: slot.title,
      url: "",
      note: "",
      createdAt: new Date().toISOString(),
      sourceLabel: null,
    };

    references[index] = {
      ...current,
      url: value,
      sourceLabel: value ? "URL" : null,
    };

    updateProject("references", references);
    if (slot.role === "main") {
      updateProject("mainLink", value);
    }
  }

  function updateDuration(durationSeconds: number) {
    if (!project) {
      return;
    }

    updateProject("durationSeconds", durationSeconds);
    patchStudioSettings({
      defaultDurationSeconds: durationSeconds,
      defaultPreviewPresetId: getPresetForDuration(durationSeconds).id,
      outputQuality: quality,
      preferredExportFormat: format,
    });
  }

  function applyPreset(preset: PreviewPreset) {
    updateDuration(preset.durationSeconds);
  }

  function handleGenerate(nextMode: StudioMode) {
    if (!project) {
      return;
    }

    setMode(nextMode);
    const entry = createDefaultGenerationEntry({
      projectId: project.id,
      mode: nextMode,
      title: `${project.title} ${nextMode === "spice-it" ? "Spice It" : nextMode}`,
      prompt: chatPrompt,
      previewPresetId: selectedPreset.id,
      durationSeconds: project.durationSeconds,
      outputFormat: format,
      quality,
      provider: nextMode === "remix" ? "adapter: remix" : "adapter: preview",
      spiceApplied: nextMode === "spice-it",
      status: "queued",
      resultSummary,
    });

    const nextHistory = appendGenerationHistory(entry);
    setHistory(nextHistory);
    patchStudioSettings({
      defaultMode: nextMode,
      outputQuality: quality,
      preferredExportFormat: format,
      language: locale,
    });
    setStatusMessage(`Queued a ${selectedPreset.label.toLowerCase()} ${nextMode === "spice-it" ? "spice-it pass" : nextMode} request.`);
  }

  function downloadSnapshot() {
    const snapshot = exportWorkspaceSnapshot();
    const blob = new Blob([snapshot], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `solfege-workspace-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    window.URL.revokeObjectURL(url);
    setStatusMessage("Exported your local Solfege workspace as JSON.");
  }

  async function importSnapshot(file: File | null) {
    if (!file) {
      return;
    }

    const text = await file.text();
    const snapshot = importWorkspaceSnapshot(text);
    setProject(snapshot.projects[0] ?? ensureSeedProject());
    setHistory(snapshot.generationHistory);
    setStatusMessage(`Imported ${snapshot.projects.length} project(s) from JSON.`);
  }

  if (!project) {
    return (
      <section className="stack-gap">
        <div className="section-heading">
          <span className="eyebrow">{t.studio.title}</span>
          <h1>{t.studio.subtitle}</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="stack-gap">
      <div className="section-heading">
        <span className="eyebrow">{t.studio.title}</span>
        <h1>{t.studio.subtitle}</h1>
        <p>{statusMessage}</p>
      </div>

      <div className="mode-grid">
        {modeCards.map((card) => (
          <article className={`hero-card${mode === card.id ? " accent-card" : ""}`} key={card.id}>
            <p className="card-label">{card.label}</p>
            <h2>{card.id === "generate" ? "Reference blend" : card.id === "remix" ? "Controlled remix" : "Creative chaos"}</h2>
            <p>{card.description}</p>
            <button className="secondary-action subtle-action" onClick={() => handleGenerate(card.id)} type="button">
              {card.label}
            </button>
          </article>
        ))}
      </div>

      <div className="studio-grid">
        <section className="panel">
          <div className="panel-head">
            <p className="panel-title">{t.studio.panels.references}</p>
            <span className="panel-badge">3 inputs</span>
          </div>

          <div className="reference-list">
            {referenceSlots.map((slot, index) => (
              <article className="reference-card" key={slot.title}>
                <p className="reference-title">{slot.title}</p>
                <p className="reference-subtitle">{slot.subtitle}</p>
                <input
                  className="text-field"
                  onChange={(event) => updateReference(index, event.target.value)}
                  placeholder="Paste a YouTube link or describe the reference"
                  type="text"
                  value={project.references[index]?.url ?? ""}
                />
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <p className="panel-title">{t.studio.panels.controls}</p>
            <span className="panel-badge">Hybrid UI</span>
          </div>

          <div className="form-grid">
            <label className="field-stack">
              <span>Project title</span>
              <input className="text-field" onChange={(event) => updateProject("title", event.target.value)} type="text" value={project.title} />
            </label>
            <label className="field-stack">
              <span>BPM</span>
              <input className="text-field" max={220} min={50} onChange={(event) => updateProject("bpm", Number(event.target.value))} type="number" value={project.bpm} />
            </label>
            <label className="field-stack field-wide">
              <span>Mood</span>
              <input className="text-field" onChange={(event) => updateProject("mood", event.target.value)} type="text" value={project.mood} />
            </label>
            <label className="field-stack field-wide">
              <span>Hook idea</span>
              <input className="text-field" onChange={(event) => updateProject("hookIdea", event.target.value)} type="text" value={project.hookIdea} />
            </label>
            <label className="field-stack field-wide">
              <span>Lyrics</span>
              <textarea className="text-area" onChange={(event) => updateProject("lyrics", event.target.value)} rows={4} value={project.lyrics} />
            </label>
            <label className="field-stack field-wide">
              <span>Duration slider</span>
              <input max={180} min={5} onChange={(event) => updateDuration(Number(event.target.value))} type="range" value={project.durationSeconds} />
              <span className="helper-text">{project.durationSeconds}s selected</span>
            </label>
          </div>

          <div className="selector-cluster wrap-gap">
            {PREVIEW_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`selector-pill${selectedPreset.id === preset.id ? " active" : ""}`}
                onClick={() => applyPreset(preset)}
                type="button"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="form-grid compact-grid">
            <label className="field-stack">
              <span>Export format</span>
              <select className="text-field" onChange={(event) => setFormat(event.target.value === "wav" ? "wav" : "mp3")} value={format}>
                <option value="mp3">MP3</option>
                <option value="wav">WAV</option>
              </select>
            </label>
            <label className="field-stack">
              <span>MP3 quality</span>
              <select className="text-field" onChange={(event) => setQuality(Number(event.target.value) as 128 | 192 | 256 | 320)} value={quality}>
                <option value={128}>128 kbps</option>
                <option value={192}>192 kbps</option>
                <option value={256}>256 kbps</option>
                <option value={320}>320 kbps</option>
              </select>
            </label>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <p className="panel-title">{t.studio.panels.chat}</p>
            <span className="panel-badge">Assistant-first</span>
          </div>

          <label className="field-stack field-wide">
            <span>Creative direction</span>
            <textarea className="text-area" onChange={(event) => setChatPrompt(event.target.value)} rows={8} value={chatPrompt} />
          </label>

          <div className="action-row">
            <button className="primary-action" onClick={() => handleGenerate("generate")} type="button">
              Generate
            </button>
            <button className="secondary-action" onClick={() => handleGenerate("remix")} type="button">
              Remix
            </button>
            <button className="secondary-action" onClick={() => handleGenerate("spice-it")} type="button">
              Spice It
            </button>
          </div>
        </section>

        <section className="panel result-panel">
          <div className="panel-head">
            <p className="panel-title">{t.studio.panels.result}</p>
            <span className="panel-badge">Local-first</span>
          </div>

          <div className="result-card-grid">
            <article className="result-card">
              <p className="result-label">Concept</p>
              <h3>{resultSummary}</h3>
            </article>
            <article className="result-card">
              <p className="result-label">Prompt</p>
              <h3>{chatPrompt}</h3>
            </article>
            <article className="result-card">
              <p className="result-label">Recent queue</p>
              <h3>{history[0]?.title ?? "No generations queued yet."}</h3>
            </article>
          </div>

          <div className="action-row">
            <button className="secondary-action" onClick={downloadSnapshot} type="button">
              Export JSON
            </button>
            <button className="secondary-action" onClick={() => fileInputRef.current?.click()} type="button">
              Import JSON
            </button>
            <input
              accept="application/json"
              className="hidden-input"
              onChange={async (event) => importSnapshot(event.target.files?.[0] ?? null)}
              ref={fileInputRef}
              type="file"
            />
          </div>
        </section>
      </div>
    </section>
  );
}