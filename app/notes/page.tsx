"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AppShell from "@/components/AppShell";
import BlockEditor from "@/components/BlockEditor";
import { useToast } from "@/components/ToastContext";
import { Note, Block } from "@/lib/types";
import {
  Plus, Search, Pin, Tag, Link2, Trash2, Hash,
  FileText, Share2, Star, MoreHorizontal, ChevronLeft,
} from "lucide-react";

const NOTE_COLORS = ["#6366f1","#8b5cf6","#ec4899","#10b981","#f59e0b","#ef4444","#14b8a6","#3b82f6"];
const NOTE_ICONS = ["📋","📝","🎯","🚀","💡","🤖","📊","🎬","✍️","🔑","⚡","🌟","🎣","📚","💎"];

function noteExcerpt(note: Note) {
  const para = note.blocks.find((b) => b.type === "paragraph" && b.content.trim());
  return para?.content.slice(0, 100) ?? "";
}

function timeAgo(str: string) {
  const diff = Date.now() - new Date(str).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин. назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч. назад`;
  return `${Math.floor(h / 24)} дн. назад`;
}

function GraphView({ notes }: { notes: Note[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const positions: Record<string, { x: number; y: number }> = {};
    const cx = W / 2, cy = H / 2;

    notes.forEach((n, i) => {
      const angle = (i / notes.length) * Math.PI * 2;
      const r = Math.min(W, H) * 0.35;
      positions[n.id] = {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      };
    });

    // Draw edges
    notes.forEach((n) => {
      n.links.forEach((linkId) => {
        const from = positions[n.id];
        const to = positions[linkId];
        if (!from || !to) return;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = "rgba(99,102,241,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });

    // Draw nodes
    notes.forEach((n) => {
      const pos = positions[n.id];
      if (!pos) return;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = n.color ?? "#6366f1";
      ctx.globalAlpha = 0.2;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = n.color ?? "#6366f1";
      ctx.fill();
      ctx.font = "10px -apple-system, sans-serif";
      ctx.fillStyle = "var(--text-secondary)";
      ctx.textAlign = "center";
      ctx.fillText(n.title.slice(0, 12), pos.x, pos.y + 26);
    });
  }, [notes]);

  return (
    <div style={{ background: "var(--bg-secondary)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", borderBottom: "1px solid var(--border)" }}>
        ГРАФ СВЯЗЕЙ
      </div>
      <canvas ref={canvasRef} width={260} height={220} style={{ display: "block" }} />
    </div>
  );
}

export default function Notes() {
  const { success, error: errToast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [mobileList, setMobileList] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/notes").then((r) => r.json()).then((data: Note[]) => {
      setNotes(data);
      if (data.length > 0) setSelected(data[0]);
    });
  }, []);

  const autoSave = useCallback((note: Note) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(note),
        });
        setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
      } catch {
        errToast("Ошибка сохранения");
      } finally {
        setSaving(false);
      }
    }, 800);
  }, [errToast]);

  const updateSelected = useCallback((patch: Partial<Note>) => {
    if (!selected) return;
    const updated = { ...selected, ...patch, updatedAt: new Date().toISOString() };
    setSelected(updated);
    autoSave(updated);
  }, [selected, autoSave]);

  const createNote = async () => {
    const note: Note = {
      id: Math.random().toString(36).slice(2),
      title: "Новая заметка",
      icon: "📝",
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      blocks: [
        { id: Math.random().toString(36).slice(2), type: "paragraph", content: "" },
      ],
      tags: [],
      links: [],
      backlinks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    setNotes((prev) => [note, ...prev]);
    setSelected(note);
    setMobileList(false);
    success("Заметка создана");
  };

  const deleteNote = async (id: string) => {
    await fetch("/api/notes", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    if (selected?.id === id) setSelected(next[0] ?? null);
    success("Заметка удалена");
  };

  const filtered = notes.filter(
    (n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.tags.some((t) => t.includes(search.toLowerCase()))
  );

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  return (
    <AppShell>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar list */}
        <div
          style={{
            width: 260,
            minWidth: 260,
            background: "var(--bg-card)",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <div style={{ padding: "16px 14px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={12} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
              <input
                className="input"
                style={{ paddingLeft: 28, fontSize: 12, padding: "7px 10px 7px 28px" }}
                placeholder="Поиск..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button onClick={createNote} className="btn-primary" style={{ padding: "7px 10px", flexShrink: 0 }}>
              <Plus size={14} />
            </button>
          </div>

          {/* Pinned */}
          {filtered.some((n) => n.pinned) && (
            <div style={{ padding: "10px 14px 0" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.07em", marginBottom: 6 }}>ЗАКРЕПЛЁННЫЕ</div>
              {filtered.filter((n) => n.pinned).map((n) => (
                <NoteItem key={n.id} note={n} active={selected?.id === n.id} onSelect={() => { setSelected(n); setMobileList(false); }} onDelete={() => deleteNote(n.id)} />
              ))}
            </div>
          )}

          <div style={{ padding: "10px 14px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.07em", marginBottom: 6 }}>ВСЕ ЗАМЕТКИ</div>
            {filtered.filter((n) => !n.pinned).map((n) => (
              <NoteItem key={n.id} note={n} active={selected?.id === n.id} onSelect={() => { setSelected(n); setMobileList(false); }} onDelete={() => deleteNote(n.id)} />
            ))}
          </div>

          {/* Graph button */}
          <div style={{ marginTop: "auto", padding: "14px" }}>
            <button
              onClick={() => setShowGraph(!showGraph)}
              className="btn-ghost"
              style={{ width: "100%", justifyContent: "center", fontSize: 11 }}
            >
              <Share2 size={12} /> {showGraph ? "Скрыть граф" : "Граф связей"}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {selected ? (
            <>
              {/* Toolbar */}
              <div style={{ padding: "12px 32px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, background: "var(--bg-card)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                  {/* Icon picker */}
                  <div style={{ position: "relative" }}>
                    <button
                      style={{ fontSize: 22, background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
                      title="Сменить иконку"
                    >
                      {selected.icon ?? "📝"}
                    </button>
                  </div>
                  <input
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      background: "none",
                      border: "none",
                      outline: "none",
                      flex: 1,
                      fontFamily: "inherit",
                    }}
                    value={selected.title}
                    onChange={(e) => updateSelected({ title: e.target.value })}
                    placeholder="Название заметки..."
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {saving && <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Сохранение...</span>}
                  {!saving && <span style={{ fontSize: 11, color: "var(--success)" }}>✓ Сохранено</span>}
                  <button
                    onClick={() => updateSelected({ pinned: !selected.pinned })}
                    className="btn-icon"
                    style={{ color: selected.pinned ? "var(--warning)" : "var(--text-tertiary)" }}
                  >
                    <Pin size={13} />
                  </button>
                  <button onClick={() => deleteNote(selected.id)} className="btn-icon">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Tags bar */}
              <div style={{ padding: "8px 32px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <Hash size={11} color="var(--text-tertiary)" />
                {selected.tags.map((t) => (
                  <span
                    key={t}
                    className="tag"
                    style={{ cursor: "pointer" }}
                    onClick={() => updateSelected({ tags: selected.tags.filter((x) => x !== t) })}
                  >
                    {t} ×
                  </span>
                ))}
                <input
                  style={{ fontSize: 11, background: "none", border: "none", outline: "none", color: "var(--text-tertiary)", minWidth: 80 }}
                  placeholder="+ тег..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      updateSelected({ tags: [...selected.tags, e.currentTarget.value.trim()] });
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Изменено {timeAgo(selected.updatedAt)}</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, overflowY: "auto", padding: "24px 64px 80px" }}>
                <BlockEditor
                  blocks={selected.blocks}
                  onChange={(blocks) => updateSelected({ blocks })}
                />

                {/* Backlinks */}
                {selected.backlinks?.length > 0 && (
                  <div style={{ marginTop: 48, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                      <Link2 size={12} /> ССЫЛКИ НА ЭТУ ЗАМЕТКУ ({selected.backlinks.length})
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {selected.backlinks.map((id) => {
                        const linked = notes.find((n) => n.id === id);
                        if (!linked) return null;
                        return (
                          <button
                            key={id}
                            onClick={() => setSelected(linked)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "8px 12px",
                              borderRadius: 8,
                              border: "1px solid var(--border)",
                              background: "var(--bg-secondary)",
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "background 0.15s",
                            }}
                          >
                            <span style={{ fontSize: 14 }}>{linked.icon}</span>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{linked.title}</div>
                              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{noteExcerpt(linked).slice(0, 60)}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "var(--text-tertiary)" }}>
              <FileText size={48} strokeWidth={1} />
              <div style={{ fontSize: 16, fontWeight: 600 }}>Выберите заметку</div>
              <div style={{ fontSize: 13 }}>или создайте новую</div>
              <button onClick={createNote} className="btn-primary">
                <Plus size={14} /> Новая заметка
              </button>
            </div>
          )}
        </div>

        {/* Graph panel */}
        {showGraph && (
          <div
            style={{
              width: 280,
              borderLeft: "1px solid var(--border)",
              background: "var(--bg-card)",
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <GraphView notes={notes} />

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", marginBottom: 10, letterSpacing: "0.06em" }}>ВСЕ ТЕГИ</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {allTags.map((t) => (
                  <span key={t} className="tag" style={{ cursor: "pointer" }} onClick={() => setSearch(t)}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", marginBottom: 10, letterSpacing: "0.06em" }}>СТАТИСТИКА</div>
              {[
                { label: "Всего заметок", value: notes.length },
                { label: "Блоков текста", value: notes.reduce((a, n) => a + n.blocks.length, 0) },
                { label: "Тегов", value: allTags.length },
                { label: "Связей", value: notes.reduce((a, n) => a + n.links.length, 0) },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function NoteItem({ note, active, onSelect, onDelete }: { note: Note; active: boolean; onSelect: () => void; onDelete: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 9,
        background: active ? "var(--accent-light)" : hovered ? "var(--bg-secondary)" : "transparent",
        cursor: "pointer",
        marginBottom: 2,
        transition: "background 0.1s",
        position: "relative",
      }}
    >
      <span style={{ fontSize: 16, flexShrink: 0 }}>{note.icon ?? "📝"}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12,
          fontWeight: active ? 700 : 600,
          color: active ? "var(--accent)" : "var(--text-primary)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {note.title}
        </div>
        <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {noteExcerpt(note) || note.tags.map((t) => `#${t}`).join(" ")}
        </div>
      </div>
      {note.pinned && <Pin size={10} color="var(--warning)" style={{ flexShrink: 0, marginTop: 2 }} />}
      {hovered && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{ position: "absolute", right: 6, top: 6, background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", padding: 2 }}
        >
          <Trash2 size={11} />
        </button>
      )}
    </div>
  );
}
