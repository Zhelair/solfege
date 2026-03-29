"use client";

import Link from "next/link";

import { useAppSettings } from "@/components/providers/app-providers";

export function LandingScreen() {
  const { t } = useAppSettings();

  return (
    <section className="hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">{t.landing.eyebrow}</span>
        <h1>{t.landing.title}</h1>
        <p>{t.landing.body}</p>

        <div className="hero-actions">
          <Link className="primary-action" href="/studio">
            {t.landing.ctaPrimary}
          </Link>
          <Link className="secondary-action" href="/guide">
            {t.landing.ctaSecondary}
          </Link>
        </div>

        <ul className="hero-bullets">
          {t.landing.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>

      <div className="hero-cards">
        <article className="hero-card feature-card">
          <p className="card-label">Studio</p>
          <h2>Generate, remix, and spice up ideas from references, chat, and sharp controls.</h2>
          <p>
            Build a short sketch, push toward a 1 minute concept, and keep the interface fast on every device.
          </p>
        </article>

        <article className="hero-card accent-card">
          <p className="card-label">Guide</p>
          <h2>Separate learning space for DJing, sound engineering, and project-aware help.</h2>
          <p>Keep notes, ask follow-ups, and turn useful answers into a reusable playbook.</p>
        </article>
      </div>
    </section>
  );
}
