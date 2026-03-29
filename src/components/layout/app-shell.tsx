"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

import { AppProviders, useAppSettings } from "@/components/providers/app-providers";
import { LanguageSwitcher, ThemeSwitcher } from "@/components/ui/settings-switchers";

function InnerShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { t } = useAppSettings();

  return (
    <div className="app-frame">
      <header className="topbar">
        <div>
          <p className="brand-kicker">AI music studio</p>
          <Link className="brand-mark" href="/">
            {t.appName}
          </Link>
        </div>

        <nav className="main-nav" aria-label="Primary">
          <Link className={pathname === "/studio" ? "active" : ""} href="/studio">
            {t.nav.studio}
          </Link>
          <Link className={pathname === "/guide" ? "active" : ""} href="/guide">
            {t.nav.guide}
          </Link>
          <Link className={pathname === "/history" ? "active" : ""} href="/history">
            {t.nav.history}
          </Link>
        </nav>

        <div className="topbar-controls">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>

      <main className="page-shell">{children}</main>
    </div>
  );
}

export function AppShell({ children }: PropsWithChildren) {
  return (
    <AppProviders>
      <InnerShell>{children}</InnerShell>
    </AppProviders>
  );
}
