"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle, AlertCircle, Info, XCircle, Sparkles, Check, ExternalLink } from "lucide-react";
import { Notification } from "@/lib/types";
import Link from "next/link";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  success: <CheckCircle size={14} />,
  error: <XCircle size={14} />,
  warning: <AlertCircle size={14} />,
  info: <Info size={14} />,
  ai: <Sparkles size={14} />,
};

const TYPE_COLORS: Record<string, string> = {
  success: "var(--success)",
  error: "var(--danger)",
  warning: "var(--warning)",
  info: "var(--accent)",
  ai: "var(--purple)",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [btnRect, setBtnRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    fetch("/api/notifications").then((r) => r.json()).then(setNotifs).catch(() => {});
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAll = async () => {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: undefined }) });
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        ref={btnRef}
        onClick={() => {
          if (btnRef.current) setBtnRect(btnRef.current.getBoundingClientRect());
          setOpen(!open);
        }}
        style={{
          position: "relative",
          background: "none",
          border: "1px solid var(--border)",
          borderRadius: 9,
          padding: "6px 8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          color: "var(--text-secondary)",
          transition: "all 0.2s",
        }}
      >
        <Bell size={15} />
        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "var(--danger)",
              color: "white",
              fontSize: 9,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--bg-primary)",
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {open && btnRect && (
        <div
          className="animate-fade-up"
          style={{
            position: "fixed",
            ...(btnRect.bottom + 440 > window.innerHeight
              ? { bottom: window.innerHeight - btnRect.top + 8 }
              : { top: btnRect.bottom + 8 }),
            left: Math.max(8, btnRect.right - 360),
            width: 360,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Уведомления</div>
              {unread > 0 && <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{unread} непрочитанных</div>}
            </div>
            {unread > 0 && (
              <button
                onClick={markAll}
                style={{ background: "none", border: "none", fontSize: 11, color: "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}
              >
                <Check size={11} /> Прочитать все
              </button>
            )}
          </div>
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            {notifs.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "var(--text-tertiary)", fontSize: 13 }}>Нет уведомлений</div>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border-subtle)",
                    background: n.read ? "transparent" : "var(--accent-light)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    transition: "background 0.15s",
                  }}
                >
                  <span style={{ color: TYPE_COLORS[n.type] ?? "var(--accent)", flexShrink: 0, marginTop: 1 }}>
                    {TYPE_ICONS[n.type]}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: "var(--text-primary)", marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 3 }}>{n.body}</div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{timeAgo(n.createdAt)}</div>
                  </div>
                  {n.action && (
                    <Link href={n.action} onClick={() => setOpen(false)}>
                      <ExternalLink size={12} color="var(--text-tertiary)" />
                    </Link>
                  )}
                  {!n.read && (
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
