"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastContext";
import { I18nProvider } from "@/lib/i18n";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <I18nProvider>
      <ThemeProvider>
        <ToastProvider>
          <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Mobile hamburger */}
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            {/* Overlay for mobile */}
            <div
              className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
              onClick={() => setSidebarOpen(false)}
            />

            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main
              className="app-main"
              style={{ flex: 1, minWidth: 0, background: "var(--bg-primary)", overflowX: "hidden" }}
            >
              {children}
            </main>
          </div>
        </ToastProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
