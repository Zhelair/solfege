import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import "@/app/globals.css";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "solfege",
  description: "Reference-driven AI music studio for generating, remixing, and learning.",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
