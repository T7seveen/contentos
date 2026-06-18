"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle, AlertCircle, Info, XCircle, X, Sparkles } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info" | "ai";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  body?: string;
  duration?: number;
}

interface ToastCtxType {
  toast: (t: Omit<Toast, "id">) => void;
  success: (title: string, body?: string) => void;
  error: (title: string, body?: string) => void;
  warning: (title: string, body?: string) => void;
  info: (title: string, body?: string) => void;
  ai: (title: string, body?: string) => void;
}

const ToastCtx = createContext<ToastCtxType>({
  toast: () => {}, success: () => {}, error: () => {},
  warning: () => {}, info: () => {}, ai: () => {},
});

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertCircle size={16} />,
  info: <Info size={16} />,
  ai: <Sparkles size={16} />,
};

const COLORS: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: { bg: "var(--success-light)", border: "var(--success)", icon: "var(--success)", text: "var(--success)" },
  error: { bg: "var(--danger-light)", border: "var(--danger)", icon: "var(--danger)", text: "var(--danger)" },
  warning: { bg: "var(--warning-light)", border: "var(--warning)", icon: "var(--warning)", text: "var(--warning)" },
  info: { bg: "var(--accent-light)", border: "var(--accent)", icon: "var(--accent)", text: "var(--accent)" },
  ai: { bg: "var(--purple-light)", border: "var(--purple)", icon: "var(--purple)", text: "var(--purple)" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { ...t, id }]);
    timers.current[id] = setTimeout(() => dismiss(id), t.duration ?? 4500);
  }, [dismiss]);

  const success = useCallback((title: string, body?: string) => toast({ type: "success", title, body }), [toast]);
  const error   = useCallback((title: string, body?: string) => toast({ type: "error",   title, body }), [toast]);
  const warning = useCallback((title: string, body?: string) => toast({ type: "warning", title, body }), [toast]);
  const info    = useCallback((title: string, body?: string) => toast({ type: "info",    title, body }), [toast]);
  const ai      = useCallback((title: string, body?: string) => toast({ type: "ai",      title, body }), [toast]);

  return (
    <ToastCtx.Provider value={{ toast, success, error, warning, info, ai }}>
      {children}
      {/* Toast container */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => {
          const c = COLORS[t.type];
          return (
            <div
              key={t.id}
              className="animate-fade-up"
              style={{
                background: "var(--bg-card)",
                border: `1px solid ${c.border}`,
                borderLeft: `3px solid ${c.border}`,
                borderRadius: 12,
                padding: "12px 14px",
                minWidth: 280,
                maxWidth: 360,
                boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                pointerEvents: "all",
              }}
            >
              <span style={{ color: c.icon, flexShrink: 0, marginTop: 1 }}>{ICONS[t.type]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{t.title}</div>
                {t.body && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2, lineHeight: 1.5 }}>{t.body}</div>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", padding: 2, flexShrink: 0 }}
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
