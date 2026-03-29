import {
  type GenerationHistoryEntry,
  type LocaleCode,
  type StudioProject,
  type StudioSession,
  type StudioSettings,
  type ThemeId,
  type WorkspaceSnapshot,
  DEFAULT_STUDIO_SETTINGS,
  DEFAULT_WORKSPACE_SNAPSHOT,
  normalizeGenerationEntry,
  normalizeProject,
  normalizeSession,
  normalizeStudioSettings,
  normalizeWorkspaceSnapshot,
  structuredWorkspaceSnapshotFallback,
  createDefaultProject,
  createDefaultSession,
  createId,
} from "./solfege-data";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const STORAGE_PREFIX = "solfege";

export const STORAGE_KEYS = {
  settings: `${STORAGE_PREFIX}.settings.v1`,
  session: `${STORAGE_PREFIX}.session.v1`,
  projects: `${STORAGE_PREFIX}.projects.v1`,
  generationHistory: `${STORAGE_PREFIX}.generationHistory.v1`,
  workspaceSnapshot: `${STORAGE_PREFIX}.workspaceSnapshot.v1`,
} as const;

const memoryStorage = new Map<string, string>();

const memoryAdapter: StorageLike = {
  getItem(key) {
    return memoryStorage.get(key) ?? null;
  },
  setItem(key, value) {
    memoryStorage.set(key, value);
  },
  removeItem(key) {
    memoryStorage.delete(key);
  },
};

export function resolveStorage(): StorageLike {
  if (typeof window !== "undefined") {
    try {
      const storage = window.localStorage;
      const probeKey = `${STORAGE_PREFIX}.probe`;
      storage.setItem(probeKey, "1");
      storage.removeItem(probeKey);
      return storage;
    } catch {
      return memoryAdapter;
    }
  }

  return memoryAdapter;
}

export function safeJsonParse<T>(input: string | null, fallback: T): T {
  if (!input) {
    return fallback;
  }

  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}

export function readJson<T>(key: string, fallback: T, storage: StorageLike = resolveStorage()): T {
  return safeJsonParse<T>(storage.getItem(key), fallback);
}

export function writeJson(key: string, value: unknown, storage: StorageLike = resolveStorage()): void {
  storage.setItem(key, JSON.stringify(value));
}

export function removeValue(key: string, storage: StorageLike = resolveStorage()): void {
  storage.removeItem(key);
}

export function loadStudioSettings(storage: StorageLike = resolveStorage()): StudioSettings {
  return normalizeStudioSettings(readJson<Partial<StudioSettings>>(STORAGE_KEYS.settings, DEFAULT_STUDIO_SETTINGS, storage));
}

export function saveStudioSettings(settings: Partial<StudioSettings>, storage: StorageLike = resolveStorage()): StudioSettings {
  const normalized = normalizeStudioSettings(settings);
  writeJson(STORAGE_KEYS.settings, normalized, storage);
  return normalized;
}

export function patchStudioSettings(
  patch: Partial<StudioSettings> | ((current: StudioSettings) => Partial<StudioSettings>),
  storage: StorageLike = resolveStorage()
): StudioSettings {
  const current = loadStudioSettings(storage);
  const nextPatch = typeof patch === "function" ? patch(current) : patch;
  return saveStudioSettings({ ...current, ...nextPatch }, storage);
}

export function resetStudioSettings(storage: StorageLike = resolveStorage()): StudioSettings {
  return saveStudioSettings({ ...DEFAULT_STUDIO_SETTINGS }, storage);
}

export function loadSession(storage: StorageLike = resolveStorage()): StudioSession {
  return normalizeSession(readJson<Partial<StudioSession>>(STORAGE_KEYS.session, createDefaultSession(), storage));
}

export function saveSession(session: Partial<StudioSession>, storage: StorageLike = resolveStorage()): StudioSession {
  const normalized = normalizeSession(session);
  writeJson(STORAGE_KEYS.session, normalized, storage);
  return normalized;
}

export function patchSession(
  patch: Partial<StudioSession> | ((current: StudioSession) => Partial<StudioSession>),
  storage: StorageLike = resolveStorage()
): StudioSession {
  const current = loadSession(storage);
  const nextPatch = typeof patch === "function" ? patch(current) : patch;
  return saveSession({ ...current, ...nextPatch }, storage);
}

export function resetSession(storage: StorageLike = resolveStorage()): StudioSession {
  const session = createDefaultSession();
  writeJson(STORAGE_KEYS.session, session, storage);
  return session;
}

export function loadProjects(storage: StorageLike = resolveStorage()): StudioProject[] {
  const projects = readJson<Array<Partial<StudioProject>>>(STORAGE_KEYS.projects, [], storage);
  return projects.map((project) => normalizeProject(project));
}

export function saveProjects(projects: Array<Partial<StudioProject>>, storage: StorageLike = resolveStorage()): StudioProject[] {
  const normalized = projects.map((project) => normalizeProject(project));
  writeJson(STORAGE_KEYS.projects, normalized, storage);
  return normalized;
}

export function getProjectById(projectId: string, storage: StorageLike = resolveStorage()): StudioProject | null {
  const project = loadProjects(storage).find((item) => item.id === projectId);
  return project ?? null;
}

export function upsertProject(project: Partial<StudioProject>, storage: StorageLike = resolveStorage()): StudioProject[] {
  const normalized = normalizeProject(project);
  const current = loadProjects(storage);
  const existingIndex = current.findIndex((item) => item.id === normalized.id);

  const nextProjects =
    existingIndex === -1
      ? [normalized, ...current]
      : current.map((item, index) => (index === existingIndex ? normalized : item));

  writeJson(STORAGE_KEYS.projects, nextProjects, storage);
  return nextProjects;
}

export function deleteProject(projectId: string, storage: StorageLike = resolveStorage()): StudioProject[] {
  const nextProjects = loadProjects(storage).filter((project) => project.id !== projectId);
  writeJson(STORAGE_KEYS.projects, nextProjects, storage);
  return nextProjects;
}

export function createProject(project: Partial<StudioProject> = {}, storage: StorageLike = resolveStorage()): StudioProject {
  const nextProject = normalizeProject({
    ...createDefaultProject(),
    ...project,
    id: project.id ?? createId("project"),
  });
  upsertProject(nextProject, storage);
  return nextProject;
}

export function touchProject(projectId: string, storage: StorageLike = resolveStorage()): StudioProject | null {
  const project = getProjectById(projectId, storage);
  if (!project) {
    return null;
  }

  const touched = normalizeProject({
    ...project,
    updatedAt: new Date().toISOString(),
  });

  upsertProject(touched, storage);
  return touched;
}

export function loadGenerationHistory(storage: StorageLike = resolveStorage()): GenerationHistoryEntry[] {
  const history = readJson<Array<Partial<GenerationHistoryEntry>>>(STORAGE_KEYS.generationHistory, [], storage);
  return history.map((entry) => normalizeGenerationEntry(entry));
}

export function saveGenerationHistory(
  history: Array<Partial<GenerationHistoryEntry>>,
  storage: StorageLike = resolveStorage()
): GenerationHistoryEntry[] {
  const normalized = history.map((entry) => normalizeGenerationEntry(entry));
  writeJson(STORAGE_KEYS.generationHistory, normalized, storage);
  return normalized;
}

export function appendGenerationHistory(
  entry: Partial<GenerationHistoryEntry>,
  storage: StorageLike = resolveStorage()
): GenerationHistoryEntry[] {
  const current = loadGenerationHistory(storage);
  const normalized = normalizeGenerationEntry(entry);
  const nextHistory = [normalized, ...current].slice(0, 200);
  writeJson(STORAGE_KEYS.generationHistory, nextHistory, storage);
  return nextHistory;
}

export function clearGenerationHistory(storage: StorageLike = resolveStorage()): GenerationHistoryEntry[] {
  writeJson(STORAGE_KEYS.generationHistory, [], storage);
  return [];
}

export function exportWorkspaceSnapshot(storage: StorageLike = resolveStorage()): string {
  const snapshot: WorkspaceSnapshot = {
    version: 1,
    savedAt: new Date().toISOString(),
    settings: loadStudioSettings(storage),
    session: loadSession(storage),
    projects: loadProjects(storage),
    generationHistory: loadGenerationHistory(storage),
  };

  return JSON.stringify(snapshot, null, 2);
}

export function importWorkspaceSnapshot(
  input: string,
  storage: StorageLike = resolveStorage()
): WorkspaceSnapshot {
  const parsed = safeJsonParse<Partial<WorkspaceSnapshot>>(input, DEFAULT_WORKSPACE_SNAPSHOT);
  const normalized = normalizeWorkspaceSnapshot(parsed);

  saveStudioSettings(normalized.settings, storage);
  saveSession(normalized.session ?? createDefaultSession(), storage);
  saveProjects(normalized.projects, storage);
  saveGenerationHistory(normalized.generationHistory, storage);
  writeJson(STORAGE_KEYS.workspaceSnapshot, normalized, storage);

  return normalized;
}

export function resetWorkspace(storage: StorageLike = resolveStorage()): WorkspaceSnapshot {
  const snapshot = structuredWorkspaceSnapshotFallback();
  resetStudioSettings(storage);
  resetSession(storage);
  saveProjects([], storage);
  clearGenerationHistory(storage);
  writeJson(STORAGE_KEYS.workspaceSnapshot, snapshot, storage);
  return snapshot;
}

export function seedWorkspace(storage: StorageLike = resolveStorage()): WorkspaceSnapshot {
  const currentProjects = loadProjects(storage);
  const currentHistory = loadGenerationHistory(storage);
  const snapshot = {
    version: 1 as const,
    savedAt: new Date().toISOString(),
    settings: loadStudioSettings(storage),
    session: loadSession(storage),
    projects: currentProjects,
    generationHistory: currentHistory,
  };

  writeJson(STORAGE_KEYS.workspaceSnapshot, snapshot, storage);
  return snapshot;
}

export function setPreferredTheme(theme: ThemeId, storage: StorageLike = resolveStorage()): StudioSettings {
  return patchStudioSettings({ theme }, storage);
}

export function setPreferredLanguage(language: LocaleCode, storage: StorageLike = resolveStorage()): StudioSettings {
  return patchStudioSettings({ language }, storage);
}

