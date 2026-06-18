"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BarChart3, Lightbulb, CalendarDays,
  MessageSquare, Settings, Zap, Moon, Sun, TrendingUp,
  FileText, Flame, ChevronRight,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import NotificationsPanel from "./NotificationsPanel";
import { useI18n } from "@/lib/i18n";
import { X } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/ideas", label: "Идеи", icon: Lightbulb },
  { href: "/calendar", label: "Календарь", icon: CalendarDays },
  { href: "/notes", label: "Заметки", icon: FileText },
  { href: "/trends", label: "Тренды", icon: Flame, badge: "NEW" },
  { href: "/assistant", label: "AI Ассистент", icon: MessageSquare, dot: true },
];

interface SidebarProps { open?: boolean; onClose?: () => void; }

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { lang, setLang } = useI18n();

  return (
    <aside
      className={`app-sidebar${open ? " open" : ""}`}
      style={{
        width: 224,
        minWidth: 224,
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        padding: "14px 10px",
        zIndex: 50,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "6px 6px 16px", borderBottom: "1px solid var(--border-subtle)", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
            }}
          >
            <Zap size={15} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              ContentOS
            </div>
            <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontWeight: 500, letterSpacing: "0.02em" }}>AI Platform v2.0</div>
          </div>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", padding: 4, display: "flex", alignItems: "center" }}>
            <X size={18} />
          </button>
        )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.08em", padding: "2px 10px 6px", textTransform: "uppercase" }}>
          Навигация
        </div>
        {nav.map(({ href, label, icon: Icon, badge, dot }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`sidebar-link${active ? " active" : ""}`} onClick={onClose}>
              <Icon size={15} strokeWidth={active ? 2.5 : 2} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge && (
                <span style={{
                  background: "var(--danger)",
                  color: "white",
                  fontSize: 8,
                  fontWeight: 800,
                  padding: "1px 5px",
                  borderRadius: 99,
                  letterSpacing: "0.04em",
                }}>
                  {badge}
                </span>
              )}
              {dot && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", flexShrink: 0 }} />
              )}
              {active && <ChevronRight size={11} style={{ opacity: 0.5, flexShrink: 0 }} />}
            </Link>
          );
        })}

        {/* Content Health Card */}
        <div style={{ margin: "12px 4px 0" }}>
          <div
            style={{
              background: "linear-gradient(135deg, var(--accent-light), var(--purple-light))",
              border: "1px solid var(--accent)",
              borderRadius: 12,
              padding: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <TrendingUp size={12} color="var(--accent)" />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Здоровье контента
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.04em", lineHeight: 1 }}>74</span>
              <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>/100</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--text-secondary)", marginBottom: 8 }}>Хорошо · 3 зоны улучшений</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "74%", background: "linear-gradient(90deg, var(--accent), var(--purple))" }} />
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom section */}
      <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 10px",
          }}
        >
          <div
            onClick={toggle}
            className="sidebar-link"
            style={{ flex: 1, padding: "6px 4px" }}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </div>
          <NotificationsPanel />
        </div>

        <Link href="/settings" className="sidebar-link" style={{ padding: "7px 10px", fontSize: 12 }}>
          <Settings size={14} />
          Настройки
        </Link>
        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === "ru" ? "en" : "ru")}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 10px", background: "none", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, width: "100%", textAlign: "left" }}
        >
          <span style={{ fontSize: 14 }}>{lang === "ru" ? "🇷🇺" : "🇬🇧"}</span>
          {lang === "ru" ? "Русский" : "English"}
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-tertiary)" }}>→ {lang === "ru" ? "EN" : "RU"}</span>
        </button>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 10px 2px" }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 11,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            AK
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Alex Kim
            </div>
            <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600 }}>Pro Plan ✦</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
