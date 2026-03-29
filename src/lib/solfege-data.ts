export type LocaleCode = "en" | "ru" | "bg";

export type ThemeId = "daylight" | "dark" | "neon";

export type StudioMode = "generate" | "remix" | "spice-it";

export type ReferenceKind = "link" | "audio" | "text";

export type ReferenceRole = "main" | "mood" | "style" | "lyrics" | "arrangement" | "mix";

export type PlanTier = "guest" | "free" | "pro" | "max" | "admin";

export type GenerationStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled";

export interface LanguageOption {
  code: LocaleCode;
  label: string;
  nativeLabel: string;
}

export interface ThemeOption {
  id: ThemeId;
  label: string;
  description: string;
  accent: string;
}

export interface PreviewPreset {
  id: string;
  label: string;
  durationSeconds: number;
  description: string;
}

export interface StudioSettings {
  language: LocaleCode;
  theme: ThemeId;
  defaultMode: StudioMode;
  defaultPreviewPresetId: string;
  defaultBpm: number;
  defaultDurationSeconds: number;
  defaultMood: string;
  defaultRoughness: number;
  outputQuality: 128 | 192 | 256 | 320;
  preferredExportFormat: "mp3" | "wav";
}

export interface StudioSession {
  id: string;
  startedAt: string;
  updatedAt: string;
  plan: PlanTier;
  language: LocaleCode;
  theme: ThemeId;
  activeProjectId: string | null;
  guestMode: boolean;
  userEmail: string | null;
  lastOpenTab: "studio" | "results" | "guide" | "notes" | "history";
}

export interface ProjectReference {
  id: string;
  kind: ReferenceKind;
  role: ReferenceRole;
  title: string;
  url: string | null;
  note: string;
  createdAt: string;
  sourceLabel: string | null;
}

export interface GenerationHistoryEntry {
  id: string;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
  mode: StudioMode;
  status: GenerationStatus;
  title: string;
  prompt: string;
  previewPresetId: string;
  durationSeconds: number;
  outputFormat: "mp3" | "wav";
  quality: 128 | 192 | 256 | 320;
  provider: string | null;
  spiceApplied: boolean;
  resultSummary: string;
  errorMessage: string | null;
}

export interface StudioProject {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  mode: StudioMode;
  language: LocaleCode;
  theme: ThemeId;
  bpm: number;
  durationSeconds: number;
  mood: string;
  roughness: number;
  lyrics: string;
  hookIdea: string;
  mainLink: string;
  spiceSeed: string;
  notes: string[];
  tags: string[];
  references: ProjectReference[];
  archived: boolean;
}

export interface WorkspaceSnapshot {
  version: 1;
  savedAt: string;
  settings: StudioSettings;
  session: StudioSession | null;
  projects: StudioProject[];
  generationHistory: GenerationHistoryEntry[];
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
  },
  {
    code: "ru",
    label: "Russian",
    nativeLabel: "Русский",
  },
  {
    code: "bg",
    label: "Bulgarian",
    nativeLabel: "Български",
  },
];

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "daylight",
    label: "Daylight",
    description: "Bright, crisp, and readable for long creative sessions.",
    accent: "#ff7a18",
  },
  {
    id: "dark",
    label: "Dark",
    description: "Low-light studio mode with high contrast and focus.",
    accent: "#7c3aed",
  },
  {
    id: "neon",
    label: "Neon",
    description: "Loud underground energy with vivid color accents.",
    accent: "#18f5d6",
  },
];

export const PREVIEW_PRESETS: PreviewPreset[] = [
  {
    id: "preview-5s",
    label: "5 seconds",
    durationSeconds: 5,
    description: "Fast sketch or hook test.",
  },
  {
    id: "preview-10s",
    label: "10 seconds",
    durationSeconds: 10,
    description: "Tiny direction check.",
  },
  {
    id: "preview-30s",
    label: "30 seconds",
    durationSeconds: 30,
    description: "Short creative preview.",
  },
  {
    id: "preview-1m",
    label: "1 minute",
    durationSeconds: 60,
    description: "Compact arrangement sketch.",
  },
  {
    id: "preview-3m",
    label: "3 minutes",
    durationSeconds: 180,
    description: "Longer remix-ready sketch.",
  },
];

export const DEFAULT_STUDIO_SETTINGS: StudioSettings = {
  language: "en",
  theme: "dark",
  defaultMode: "generate",
  defaultPreviewPresetId: "preview-30s",
  defaultBpm: 140,
  defaultDurationSeconds: 30,
  defaultMood: "hard, rough, underground",
  defaultRoughness: 72,
  outputQuality: 320,
  preferredExportFormat: "mp3",
};

export const DEFAULT_SESSION: StudioSession = {
  id: "session-default",
  startedAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
  plan: "guest",
  language: "en",
  theme: "dark",
  activeProjectId: null,
  guestMode: true,
  userEmail: null,
  lastOpenTab: "studio",
};

export const DEFAULT_PROJECT: StudioProject = {
  id: "project-default",
  title: "New Solfege Project",
  description: "Start from references, shape a track, and generate a direction.",
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
  mode: "generate",
  language: "en",
  theme: "dark",
  bpm: 140,
  durationSeconds: 30,
  mood: "hard, rough, underground",
  roughness: 72,
  lyrics: "",
  hookIdea: "",
  mainLink: "",
  spiceSeed: "",
  notes: [],
  tags: ["starter"],
  references: [],
  archived: false,
};

export const DEFAULT_WORKSPACE_SNAPSHOT: WorkspaceSnapshot = {
  version: 1,
  savedAt: new Date(0).toISOString(),
  settings: DEFAULT_STUDIO_SETTINGS,
  session: null,
  projects: [],
  generationHistory: [],
};

export function createId(prefix = "sol"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeText(value: unknown, fallback = ""): string {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim();
}

export function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = typeof value === "number" && Number.isFinite(value) ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

export function isLocaleCode(value: unknown): value is LocaleCode {
  return value === "en" || value === "ru" || value === "bg";
}

export function isThemeId(value: unknown): value is ThemeId {
  return value === "daylight" || value === "dark" || value === "neon";
}

export function isStudioMode(value: unknown): value is StudioMode {
  return value === "generate" || value === "remix" || value === "spice-it";
}

export function isPlanTier(value: unknown): value is PlanTier {
  return value === "guest" || value === "free" || value === "pro" || value === "max" || value === "admin";
}

export function isGenerationStatus(value: unknown): value is GenerationStatus {
  return value === "queued" || value === "running" || value === "succeeded" || value === "failed" || value === "cancelled";
}

export function isPreviewPresetId(value: unknown): value is string {
  return typeof value === "string" && PREVIEW_PRESETS.some((preset) => preset.id === value);
}

export function getPreviewPresetDuration(presetId: string): number {
  return PREVIEW_PRESETS.find((preset) => preset.id === presetId)?.durationSeconds ?? DEFAULT_STUDIO_SETTINGS.defaultDurationSeconds;
}

export function getThemeOption(themeId: ThemeId): ThemeOption {
  return THEME_OPTIONS.find((theme) => theme.id === themeId) ?? THEME_OPTIONS[1];
}

export function getLanguageOption(code: LocaleCode): LanguageOption {
  return LANGUAGE_OPTIONS.find((language) => language.code === code) ?? LANGUAGE_OPTIONS[0];
}

export function createDefaultProject(overrides: Partial<StudioProject> = {}): StudioProject {
  const now = new Date().toISOString();

  return {
    ...DEFAULT_PROJECT,
    ...overrides,
    id: overrides.id ?? createId("project"),
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    notes: Array.isArray(overrides.notes) ? overrides.notes : [],
    tags: Array.isArray(overrides.tags) ? overrides.tags : [...DEFAULT_PROJECT.tags],
    references: Array.isArray(overrides.references) ? overrides.references : [],
    archived: Boolean(overrides.archived),
  };
}

export function createDefaultSession(overrides: Partial<StudioSession> = {}): StudioSession {
  const now = new Date().toISOString();

  return {
    ...DEFAULT_SESSION,
    ...overrides,
    id: overrides.id ?? createId("session"),
    startedAt: overrides.startedAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
  };
}

export function createDefaultGenerationEntry(overrides: Partial<GenerationHistoryEntry> = {}): GenerationHistoryEntry {
  const now = new Date().toISOString();
  const presetId = overrides.previewPresetId && isPreviewPresetId(overrides.previewPresetId)
    ? overrides.previewPresetId
    : DEFAULT_STUDIO_SETTINGS.defaultPreviewPresetId;

  return {
    id: overrides.id ?? createId("generation"),
    projectId: overrides.projectId ?? null,
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    mode: overrides.mode && isStudioMode(overrides.mode) ? overrides.mode : DEFAULT_STUDIO_SETTINGS.defaultMode,
    status: overrides.status && isGenerationStatus(overrides.status) ? overrides.status : "queued",
    title: normalizeText(overrides.title, "Untitled generation") || "Untitled generation",
    prompt: normalizeText(overrides.prompt),
    previewPresetId: presetId,
    durationSeconds: clampNumber(
      overrides.durationSeconds ?? getPreviewPresetDuration(presetId),
      1,
      600,
      getPreviewPresetDuration(presetId)
    ),
    outputFormat: overrides.outputFormat === "wav" ? "wav" : "mp3",
    quality: overrides.quality === 128 || overrides.quality === 192 || overrides.quality === 256 ? overrides.quality : 320,
    provider: normalizeText(overrides.provider) || null,
    spiceApplied: Boolean(overrides.spiceApplied),
    resultSummary: normalizeText(overrides.resultSummary),
    errorMessage: normalizeText(overrides.errorMessage) || null,
  };
}

export function normalizeWorkspaceSnapshot(snapshot: Partial<WorkspaceSnapshot> | null | undefined): WorkspaceSnapshot {
  if (!snapshot || snapshot.version !== 1) {
    return structuredWorkspaceSnapshotFallback();
  }

  return {
    version: 1,
    savedAt: typeof snapshot.savedAt === "string" ? snapshot.savedAt : new Date().toISOString(),
    settings: normalizeStudioSettings(snapshot.settings),
    session: snapshot.session ? normalizeSession(snapshot.session) : null,
    projects: Array.isArray(snapshot.projects) ? snapshot.projects.map((project) => normalizeProject(project)) : [],
    generationHistory: Array.isArray(snapshot.generationHistory)
      ? snapshot.generationHistory.map((entry) => normalizeGenerationEntry(entry))
      : [],
  };
}

export function structuredWorkspaceSnapshotFallback(): WorkspaceSnapshot {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    settings: { ...DEFAULT_STUDIO_SETTINGS },
    session: null,
    projects: [],
    generationHistory: [],
  };
}

export function normalizeStudioSettings(settings: Partial<StudioSettings> | null | undefined): StudioSettings {
  if (!settings) {
    return { ...DEFAULT_STUDIO_SETTINGS };
  }

  const language = isLocaleCode(settings.language) ? settings.language : DEFAULT_STUDIO_SETTINGS.language;
  const theme = isThemeId(settings.theme) ? settings.theme : DEFAULT_STUDIO_SETTINGS.theme;
  const defaultMode = isStudioMode(settings.defaultMode) ? settings.defaultMode : DEFAULT_STUDIO_SETTINGS.defaultMode;
  const defaultPreviewPresetId = isPreviewPresetId(settings.defaultPreviewPresetId)
    ? settings.defaultPreviewPresetId
    : DEFAULT_STUDIO_SETTINGS.defaultPreviewPresetId;

  return {
    language,
    theme,
    defaultMode,
    defaultPreviewPresetId,
    defaultBpm: clampNumber(settings.defaultBpm, 40, 260, DEFAULT_STUDIO_SETTINGS.defaultBpm),
    defaultDurationSeconds: clampNumber(settings.defaultDurationSeconds, 5, 600, DEFAULT_STUDIO_SETTINGS.defaultDurationSeconds),
    defaultMood: normalizeText(settings.defaultMood, DEFAULT_STUDIO_SETTINGS.defaultMood) || DEFAULT_STUDIO_SETTINGS.defaultMood,
    defaultRoughness: clampNumber(settings.defaultRoughness, 0, 100, DEFAULT_STUDIO_SETTINGS.defaultRoughness),
    outputQuality: settings.outputQuality === 128 || settings.outputQuality === 192 || settings.outputQuality === 256 ? settings.outputQuality : 320,
    preferredExportFormat: settings.preferredExportFormat === "wav" ? "wav" : "mp3",
  };
}

export function normalizeSession(session: Partial<StudioSession> | null | undefined): StudioSession {
  if (!session) {
    return createDefaultSession();
  }

  const now = new Date().toISOString();

  return {
    ...DEFAULT_SESSION,
    ...session,
    id: normalizeText(session.id, createId("session")) || createId("session"),
    startedAt: typeof session.startedAt === "string" ? session.startedAt : now,
    updatedAt: typeof session.updatedAt === "string" ? session.updatedAt : now,
    plan: isPlanTier(session.plan) ? session.plan : DEFAULT_SESSION.plan,
    language: isLocaleCode(session.language) ? session.language : DEFAULT_SESSION.language,
    theme: isThemeId(session.theme) ? session.theme : DEFAULT_SESSION.theme,
    activeProjectId: typeof session.activeProjectId === "string" ? session.activeProjectId : null,
    guestMode: Boolean(session.guestMode),
    userEmail: normalizeText(session.userEmail, "") || null,
    lastOpenTab:
      session.lastOpenTab === "studio" ||
      session.lastOpenTab === "results" ||
      session.lastOpenTab === "guide" ||
      session.lastOpenTab === "notes" ||
      session.lastOpenTab === "history"
        ? session.lastOpenTab
        : DEFAULT_SESSION.lastOpenTab,
  };
}

export function normalizeReference(reference: Partial<ProjectReference>): ProjectReference {
  return {
    id: normalizeText(reference.id, createId("ref")) || createId("ref"),
    kind: reference.kind === "audio" || reference.kind === "text" ? reference.kind : "link",
    role:
      reference.role === "mood" ||
      reference.role === "style" ||
      reference.role === "lyrics" ||
      reference.role === "arrangement" ||
      reference.role === "mix" ||
      reference.role === "main"
        ? reference.role
        : "main",
    title: normalizeText(reference.title, "Untitled reference") || "Untitled reference",
    url: normalizeText(reference.url, "") || null,
    note: normalizeText(reference.note, ""),
    createdAt: typeof reference.createdAt === "string" ? reference.createdAt : new Date().toISOString(),
    sourceLabel: normalizeText(reference.sourceLabel, "") || null,
  };
}

export function normalizeProject(project: Partial<StudioProject> | null | undefined): StudioProject {
  if (!project) {
    return createDefaultProject();
  }

  return {
    ...DEFAULT_PROJECT,
    ...project,
    id: normalizeText(project.id, createId("project")) || createId("project"),
    title: normalizeText(project.title, DEFAULT_PROJECT.title) || DEFAULT_PROJECT.title,
    description: normalizeText(project.description, DEFAULT_PROJECT.description) || DEFAULT_PROJECT.description,
    createdAt: typeof project.createdAt === "string" ? project.createdAt : new Date().toISOString(),
    updatedAt: typeof project.updatedAt === "string" ? project.updatedAt : new Date().toISOString(),
    mode: isStudioMode(project.mode) ? project.mode : DEFAULT_PROJECT.mode,
    language: isLocaleCode(project.language) ? project.language : DEFAULT_PROJECT.language,
    theme: isThemeId(project.theme) ? project.theme : DEFAULT_PROJECT.theme,
    bpm: clampNumber(project.bpm, 40, 260, DEFAULT_PROJECT.bpm),
    durationSeconds: clampNumber(project.durationSeconds, 5, 600, DEFAULT_PROJECT.durationSeconds),
    mood: normalizeText(project.mood, DEFAULT_PROJECT.mood) || DEFAULT_PROJECT.mood,
    roughness: clampNumber(project.roughness, 0, 100, DEFAULT_PROJECT.roughness),
    lyrics: normalizeText(project.lyrics, ""),
    hookIdea: normalizeText(project.hookIdea, ""),
    mainLink: normalizeText(project.mainLink, ""),
    spiceSeed: normalizeText(project.spiceSeed, ""),
    notes: Array.isArray(project.notes) ? project.notes.map((note) => normalizeText(note)).filter(Boolean) : [],
    tags: Array.isArray(project.tags) ? project.tags.map((tag) => normalizeText(tag)).filter(Boolean) : [],
    references: Array.isArray(project.references) ? project.references.map((reference) => normalizeReference(reference)) : [],
    archived: Boolean(project.archived),
  };
}

export function normalizeGenerationEntry(entry: Partial<GenerationHistoryEntry> | null | undefined): GenerationHistoryEntry {
  if (!entry) {
    return createDefaultGenerationEntry();
  }

  return createDefaultGenerationEntry({
    ...entry,
    id: normalizeText(entry.id, createId("generation")) || createId("generation"),
    projectId: normalizeText(entry.projectId, "") || null,
    title: normalizeText(entry.title, "Untitled generation"),
    prompt: normalizeText(entry.prompt, ""),
    provider: normalizeText(entry.provider, "") || null,
    resultSummary: normalizeText(entry.resultSummary, ""),
    errorMessage: normalizeText(entry.errorMessage, "") || null,
  });
}

