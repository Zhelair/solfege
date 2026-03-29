export const locales = ["en", "ru", "bg"] as const;
export type Locale = (typeof locales)[number];

export const themes = ["daylight", "dark", "neon"] as const;
export type ThemeName = (typeof themes)[number];

type TranslationTree = {
  appName: string;
  nav: {
    studio: string;
    guide: string;
    history: string;
  };
  landing: {
    eyebrow: string;
    title: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    bullets: string[];
  };
  studio: {
    title: string;
    subtitle: string;
    tabs: {
      generate: string;
      remix: string;
      spice: string;
    };
    panels: {
      references: string;
      controls: string;
      chat: string;
      result: string;
    };
  };
  guide: {
    title: string;
    subtitle: string;
  };
};

export const translations: Record<Locale, TranslationTree> = {
  en: {
    appName: "solfege",
    nav: {
      studio: "Studio",
      guide: "Guide",
      history: "History",
    },
    landing: {
      eyebrow: "Reference-driven AI music studio",
      title: "Build remixes, sketches, and strange new ideas from the tracks you love.",
      body:
        "Solfege blends references, chat direction, DJ knowledge, and future generation tools into one sharp workspace for producers.",
      ctaPrimary: "Open Studio",
      ctaSecondary: "Open Guide",
      bullets: [
        "Three references for mood, style, and vocal/message direction.",
        "English, Russian, and Bulgarian from day one.",
        "Daylight, Dark, and Neon themes for every device.",
      ],
    },
    studio: {
      title: "Studio",
      subtitle: "Shape a track with references, controls, chat, and fast preview thinking.",
      tabs: {
        generate: "Generate",
        remix: "Remix",
        spice: "Spice It",
      },
      panels: {
        references: "References",
        controls: "Controls",
        chat: "Creative Chat",
        result: "Result",
      },
    },
    guide: {
      title: "Guide",
      subtitle: "A separate learning and assistant space for DJing, sound engineering, and project advice.",
    },
  },
  ru: {
    appName: "solfege",
    nav: {
      studio: "Студия",
      guide: "Гайд",
      history: "История",
    },
    landing: {
      eyebrow: "AI-студия музыки на основе референсов",
      title: "Создавай ремиксы, скетчи и странные новые идеи из любимых треков.",
      body:
        "Solfege объединяет референсы, чат, DJ-знания и будущую генерацию в одном выразительном рабочем пространстве для продюсеров.",
      ctaPrimary: "Открыть студию",
      ctaSecondary: "Открыть гайд",
      bullets: [
        "Три референса для настроения, стиля и вокальной/смысловой идеи.",
        "Английский, русский и болгарский с первого дня.",
        "Темы Daylight, Dark и Neon для всех устройств.",
      ],
    },
    studio: {
      title: "Студия",
      subtitle: "Собирай трек через референсы, настройки, чат и быстрые превью-идеи.",
      tabs: {
        generate: "Генерация",
        remix: "Ремикс",
        spice: "Spice It",
      },
      panels: {
        references: "Референсы",
        controls: "Параметры",
        chat: "Творческий чат",
        result: "Результат",
      },
    },
    guide: {
      title: "Гайд",
      subtitle: "Отдельное пространство для обучения DJ, саунд-инженерии и проектных советов.",
    },
  },
  bg: {
    appName: "solfege",
    nav: {
      studio: "Студио",
      guide: "Наръчник",
      history: "История",
    },
    landing: {
      eyebrow: "AI музикално студио с референции",
      title: "Създавай ремикси, скици и странни нови идеи от любимите си тракове.",
      body:
        "Solfege събира референции, чат насоки, DJ знания и бъдещи генеративни инструменти в едно смело работно пространство за продуценти.",
      ctaPrimary: "Към студиото",
      ctaSecondary: "Към наръчника",
      bullets: [
        "Три референции за настроение, стил и вокална/лирическа посока.",
        "Английски, руски и български още от първия ден.",
        "Daylight, Dark и Neon теми за всички устройства.",
      ],
    },
    studio: {
      title: "Студио",
      subtitle: "Оформи трак чрез референции, настройки, чат и бързи preview идеи.",
      tabs: {
        generate: "Generate",
        remix: "Remix",
        spice: "Spice It",
      },
      panels: {
        references: "Референции",
        controls: "Контроли",
        chat: "Креативен чат",
        result: "Резултат",
      },
    },
    guide: {
      title: "Наръчник",
      subtitle: "Отделно пространство за DJ знания, sound engineering и съвети по проекта.",
    },
  },
};
