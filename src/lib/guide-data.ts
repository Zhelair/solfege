export type GuideLanguage = "en" | "ru" | "bg";

export type GuideDifficulty = "starter" | "intermediate" | "advanced";

export type GuideTopic = {
  id: string;
  title: string;
  category: string;
  difficulty: GuideDifficulty;
  summary: string;
  keyPoints: string[];
  accent: string;
  relatedTopicIds: string[];
};

export type GuideChatMessage = {
  id: string;
  role: "user" | "assistant";
  title: string;
  body: string;
  timestamp: string;
  language: GuideLanguage;
};

export type GuideThread = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  topicIds: string[];
};

export type GuideNote = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  language: GuideLanguage;
  linkedTopicId?: string;
};

export const guideTopics: GuideTopic[] = [
  {
    id: "beatmatching-sync",
    title: "Beatmatching and Sync",
    category: "DJ Basics",
    difficulty: "starter",
    summary: "Understand timing, grid alignment, and when sync helps or gets in the way.",
    keyPoints: [
      "Learn how beatgrids affect timing.",
      "Use sync as a tool, not a crutch.",
      "Practice nudging and phrasing together."
    ],
    accent: "from-cyan-400 via-sky-500 to-indigo-500",
    relatedTopicIds: ["phrasing", "camelot-basics", "energy-flow"]
  },
  {
    id: "camelot-basics",
    title: "Harmonic Mixing",
    category: "Music Theory",
    difficulty: "starter",
    summary: "Mix in compatible keys so transitions feel musical instead of random.",
    keyPoints: [
      "Match adjacent Camelot numbers for safe blends.",
      "Use relative major/minor moves for smoother changes.",
      "Treat key as a guide, not a prison."
    ],
    accent: "from-fuchsia-500 via-violet-500 to-pink-500",
    relatedTopicIds: ["beatmatching-sync", "phrasing", "hook-writing"]
  },
  {
    id: "eq-basics",
    title: "EQ for Cleaner Mixes",
    category: "Sound Engineering",
    difficulty: "starter",
    summary: "Use EQ to carve space, reduce mud, and keep kicks, bass, and vocals readable.",
    keyPoints: [
      "Cut before you boost.",
      "Remove mud before chasing brightness.",
      "Let the kick and bass share the low end carefully."
    ],
    accent: "from-amber-400 via-orange-500 to-rose-500",
    relatedTopicIds: ["compression-basics", "loudness-basics", "arrangement-flow"]
  },
  {
    id: "compression-basics",
    title: "Compression Basics",
    category: "Sound Engineering",
    difficulty: "intermediate",
    summary: "Control dynamics so percussion, vocals, and bass stay powerful without losing movement.",
    keyPoints: [
      "Attack changes punch.",
      "Release changes groove and breathing.",
      "Use compression for control, not just loudness."
    ],
    accent: "from-emerald-400 via-teal-500 to-cyan-600",
    relatedTopicIds: ["eq-basics", "loudness-basics", "sound-design"]
  },
  {
    id: "arrangement-flow",
    title: "Arrangement and Energy Flow",
    category: "Production",
    difficulty: "intermediate",
    summary: "Plan how the intro, build, drop, and breakdown move energy across the track.",
    keyPoints: [
      "Think in sections, not just loops.",
      "Add and remove elements to control tension.",
      "Use contrast to make drops hit harder."
    ],
    accent: "from-lime-400 via-green-500 to-emerald-600",
    relatedTopicIds: ["energy-flow", "hook-writing", "project-refinement"]
  }
];

export const guideThreads: GuideThread[] = [
  {
    id: "thread-rough-club",
    title: "Harder club intro idea",
    preview: "How should the intro build before the drop?",
    updatedAt: "2h ago",
    topicIds: ["arrangement-flow", "eq-basics"]
  },
  {
    id: "thread-meme-vocal",
    title: "Meme vocal blending",
    preview: "Need a cleaner way to fit a spoken clip into the groove.",
    updatedAt: "Yesterday",
    topicIds: ["beatmatching-sync", "camelot-basics"]
  },
  {
    id: "thread-spice-it",
    title: "Spice It randomness",
    preview: "How far can the app push a reference without losing the vibe?",
    updatedAt: "3d ago",
    topicIds: ["project-refinement", "arrangement-flow"]
  }
];

export const guideMessages: GuideChatMessage[] = [
  {
    id: "msg-user-1",
    role: "user",
    title: "Build tension at 145 BPM",
    body: "What should I do if I want the track to feel harder without becoming messy?",
    timestamp: "Now",
    language: "en"
  },
  {
    id: "msg-assistant-1",
    role: "assistant",
    title: "Tension plan",
    body: "Start by removing low-end clutter, then add a repeating hook with small rhythmic variation. Let the intro breathe, and make the drop feel earned instead of crowded.",
    timestamp: "Now",
    language: "en"
  }
];

export const guideNotes: GuideNote[] = [
  {
    id: "note-1",
    title: "Use less low-end in the intro",
    body: "Keep the intro lean. Leave room for the kick and bass to feel bigger when the drop lands.",
    tags: ["arrangement", "low-end", "club"],
    createdAt: "Today",
    language: "en",
    linkedTopicId: "arrangement-flow"
  },
  {
    id: "note-2",
    title: "Sync is not the whole mix",
    body: "Beatmatching matters, but phrasing and musical compatibility still decide whether a transition feels alive.",
    tags: ["dj", "sync", "phrasing"],
    createdAt: "Yesterday",
    language: "en",
    linkedTopicId: "beatmatching-sync"
  }
];

export const guideLanguages: Array<{ id: GuideLanguage; label: string }> = [
  { id: "en", label: "English" },
  { id: "ru", label: "Russian" },
  { id: "bg", label: "Bulgarian" }
];
