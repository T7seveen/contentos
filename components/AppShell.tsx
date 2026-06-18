"use client";

import Sidebar from "./Sidebar";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastContext";
import { I18nProvider } from "@/lib/i18n";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
    <ThemeProvider>
      <ToastProvider>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0, background: "var(--bg-primary)", overflowX: "hidden" }}>
            {children}
          </main>
        </div>
      </ToastProvider>
    </ThemeProvider>
    </I18nProvider>
  );
}
