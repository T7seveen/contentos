"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { useToast } from "@/components/ToastContext";
import {
  Plus, Sparkles, Search, Filter, ArrowRight, Flame,
  BookOpen, Smile, Zap, Check, ChevronDown, Trash2, Brain,
} from "lucide-react";
import { Idea, Platform } from "@/lib/types";
import { priorityConfig, statusConfig, platformColors } from "@/lib/utils";

const categoryIcons: Record<string, React.ReactNode> = {
  Educational: <BookOpen size={11} />,
  Entertaining: <Smile size={11} />,
  Viral: <Flame size={11} />,
  Tutorial: <Zap size={11} />,
};
const categoryColors: Record<string, string> = {
  Educational: "badge-accent",
  Entertaining: "badge-purple",
  Viral: "badge-danger",
  Tutorial: "badge-warning",
};

const AI_SUGGESTIONS = [
  { title: "Тёмная сторона вирального контента, о которой никто не говорит", score: 97, category: "Viral" },
  { title: "Я автоматизировал весь свой контент-пайплайн с AI", score: 94, category: "Educational" },
  { title: "Почему лучшие идеи всегда приходят в душе", score: 88, category: "Entertaining" },
  { title: "Формула $0 маркетинга которая принесла мне 2M просмотров", score: 95, category: "Viral" },
];

function IdeaCard({ idea, onUpdate, onDelete }: {
  idea: Idea;
  onUpdate: (updated: Idea) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const pc = priorityConfig[idea.priority];
  const sc = statusConfig[idea.status];

  const cycleStatus = () => {
    const order: Idea["status"][] = ["idea", "in-progress", "posted"];
    const next = order[(order.indexOf(idea.status) + 1) % order.length];
    onUpdate({ ...idea, status: next });
  };

  return (
    <div className="card animate-fade-up" style={{ padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: 6 }}>
            {idea.title}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <span className={`badge ${categoryColors[idea.category] ?? "badge-accent"}`}>
              {categoryIcons[idea.category]}
              {idea.category}
            </span>
            <span className={`badge ${sc.badge}`} style={{ cursor: "pointer" }} onClick={cycleStatus}>
              {sc.label}
            </span>
            <span className={`badge ${pc.badge}`}>{pc.label}</span>
          </div>
        </div>
        {/* AI Score ring */}
        <div style={{
          flexShrink: 0,
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: `conic-gradient(var(--accent) ${idea.aiScore * 3.6}deg, var(--bg-tertiary) 0deg)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: "var(--bg-card)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 900, color: "var(--accent)",
          }}>
            {idea.aiScore}
          </div>
        </div>
      </div>

      {/* Platforms */}
      <div style={{ display: "flex", gap: 4, marginBottom: 7 }}>
        {idea.platform.map((p) => (
          <span key={p} style={{
            background: platformColors[p] + "22", color: platformColors[p],
            fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 5,
            border: `1px solid ${platformColors[p]}44`,
          }}>{p}</span>
        ))}
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
        {idea.tags.map((t) => <span key={t} className="tag">#{t}</span>)}
      </div>

      {expanded && (
        <div style={{
          marginBottom: 10, padding: "10px 12px",
          background: "var(--bg-secondary)", borderRadius: 8,
          fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6,
          borderLeft: "3px solid var(--accent)",
        }}>
          {idea.notes}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setExpanded(!expanded)} style={{
          background: "none", border: "none", fontSize: 11, color: "var(--text-tertiary)",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 3, padding: 0,
        }}>
          <ChevronDown size={12} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          {expanded ? "Скрыть" : "Заметки"}
        </button>
        <div style={{ display: "flex", gap: 5 }}>
          <button onClick={() => onDelete(idea.id)} className="btn-icon" style={{ padding: 5 }}>
            <Trash2 size={11} />
          </button>
          <button className="btn-ghost" style={{ padding: "5px 9px", fontSize: 11 }}>
            <Sparkles size={11} /> Генерация
          </button>
          <button onClick={cycleStatus} className="btn-primary" style={{ padding: "5px 9px", fontSize: 11 }}>
            {idea.status === "posted" ? <Check size={11} /> : <ArrowRight size={11} />}
            {idea.status === "posted" ? "Готово" : "Далее"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Ideas() {
  const { success, error: errToast, ai } = useToast();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newIdea, setNewIdea] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetch("/api/ideas").then((r) => r.json()).then(setIdeas);
  }, []);

  const saveIdea = async (idea: Idea) => {
    await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idea),
    });
  };

  const handleUpdate = async (updated: Idea) => {
    setIdeas((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    await saveIdea(updated);
    success("Статус обновлён");
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/ideas", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setIdeas((prev) => prev.filter((i) => i.id !== id));
    success("Идея удалена");
  };

  const handleAddIdea = async () => {
    if (!newIdea.trim()) return;
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1200));
    const idea: Idea = {
      id: Math.random().toString(36).slice(2),
      title: newIdea,
      category: "Educational",
      tags: ["новая"],
      priority: "medium",
      status: "idea",
      platform: ["TikTok"],
      aiScore: Math.floor(72 + Math.random() * 24),
      createdAt: new Date().toISOString().slice(0, 10),
      notes: "AI анализирует эту идею...",
    };
    await saveIdea(idea);
    setIdeas((prev) => [idea, ...prev]);
    setNewIdea("");
    setShowForm(false);
    setAnalyzing(false);
    ai("Идея проанализирована", `AI Score: ${idea.aiScore} — ${idea.aiScore >= 85 ? "высокий потенциал!" : "средний потенциал"}`);
  };

  const addSuggested = async (s: typeof AI_SUGGESTIONS[0]) => {
    const idea: Idea = {
      id: Math.random().toString(36).slice(2),
      title: s.title,
      category: s.category,
      tags: ["ai-suggested"],
      priority: "high",
      status: "idea",
      platform: ["TikTok", "Instagram"],
      aiScore: s.score,
      createdAt: new Date().toISOString().slice(0, 10),
      notes: "Идея сгенерирована AI на основе анализа трендов.",
    };
    await saveIdea(idea);
    setIdeas((prev) => [idea, ...prev]);
    success("Идея добавлена в банк!");
  };

  const filtered = ideas.filter((i) => {
    const ms = i.title.toLowerCase().includes(search.toLowerCase());
    const mf = filterStatus === "all" || i.status === filterStatus;
    return ms && mf;
  });

  const counts = {
    all: ideas.length,
    idea: ideas.filter((i) => i.status === "idea").length,
    "in-progress": ideas.filter((i) => i.status === "in-progress").length,
    posted: ideas.filter((i) => i.status === "posted").length,
  };

  return (
    <AppShell>
      <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
        {/* Header */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>Банк идей</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>
              {ideas.length} идей · Организовано и оценено AI · Сохраняется автоматически
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={14} /> Добавить идею
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="card animate-fade-up" style={{ padding: 20, marginBottom: 20, border: "2px solid var(--accent)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
              <Brain size={14} color="var(--accent)" /> Новая идея — AI анализирует автоматически
            </div>
            <textarea
              className="input"
              style={{ minHeight: 80, resize: "vertical", marginBottom: 10, fontFamily: "inherit" }}
              placeholder="Опишите идею... AI автоматически определит категорию, теги и AI Score."
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-primary" onClick={handleAddIdea} disabled={analyzing}>
                {analyzing ? (
                  <><span className="animate-spin" style={{ display: "inline-block" }}>⟳</span> Анализ...</>
                ) : (
                  <><Sparkles size={13} /> Добавить и проанализировать</>
                )}
              </button>
              <button className="btn-ghost" onClick={() => setShowForm(false)}>Отмена</button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
          <div>
            {/* Filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={12} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input className="input" style={{ paddingLeft: 32 }} placeholder="Поиск идей..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="btn-ghost"><Filter size={13} /></button>
            </div>

            {/* Status tabs */}
            <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
              {(["all", "idea", "in-progress", "posted"] as const).map((s) => (
                <button
                  key={s}
                  style={{
                    padding: "6px 12px", borderRadius: 9, border: "1px solid var(--border)",
                    background: filterStatus === s ? "var(--accent)" : "transparent",
                    color: filterStatus === s ? "white" : "var(--text-secondary)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  }}
                  onClick={() => setFilterStatus(s)}
                >
                  {s === "all" ? "Все" : statusConfig[s]?.label ?? s}
                  <span style={{
                    marginLeft: 5,
                    background: filterStatus === s ? "rgba(255,255,255,0.2)" : "var(--bg-tertiary)",
                    borderRadius: 99, padding: "1px 6px", fontSize: 10,
                  }}>
                    {counts[s as keyof typeof counts] ?? 0}
                  </span>
                </button>
              ))}
            </div>

            {/* Ideas grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {filtered.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} onUpdate={handleUpdate} onDelete={handleDelete} />
              ))}
              {filtered.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: "var(--text-tertiary)" }}>
                  Идей не найдено. Попробуйте другой фильтр.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* AI suggestions */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                <Sparkles size={13} color="var(--accent)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>AI Рекомендации</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {AI_SUGGESTIONS.map((s, i) => (
                  <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: "var(--bg-secondary)", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", flex: 1, lineHeight: 1.4 }}>{s.title}</div>
                      <span style={{ fontSize: 12, fontWeight: 900, color: "var(--accent)", flexShrink: 0 }}>{s.score}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                      <span className={`badge ${categoryColors[s.category] ?? "badge-accent"}`} style={{ fontSize: 9 }}>{s.category}</span>
                      <button onClick={() => addSuggested(s)} style={{
                        background: "none", border: "none", fontSize: 11, color: "var(--accent)",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontWeight: 600, padding: 0,
                      }}>
                        Добавить <Plus size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Статистика идей</div>
              {[
                { label: "Всего идей", value: ideas.length, color: "var(--accent)" },
                { label: "Высокий приоритет", value: ideas.filter((i) => i.priority === "high").length, color: "var(--danger)" },
                { label: "В работе", value: ideas.filter((i) => i.status === "in-progress").length, color: "var(--warning)" },
                { label: "Опубликовано", value: ideas.filter((i) => i.status === "posted").length, color: "var(--success)" },
                { label: "Средний AI Score", value: ideas.length ? Math.round(ideas.reduce((a, i) => a + i.aiScore, 0) / ideas.length) : 0, color: "var(--purple)" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Trending tags */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>🔥 Трендовые теги</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {["#viral","#ai","#productivity","#tutorial","#psychology","#hooks","#chatgpt","#growth","#automation","#tools"].map((t) => (
                  <span key={t} className="tag" style={{ cursor: "pointer" }} onClick={() => setSearch(t.slice(1))}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
