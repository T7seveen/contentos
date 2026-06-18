"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { ChevronLeft, ChevronRight, Plus, Sparkles, Clock, Flame, LayoutGrid, List, X, Zap } from "lucide-react";
import { CalendarEvent, Platform, Priority } from "@/lib/types";
import { statusConfig, priorityConfig, platformColors } from "@/lib/utils";
import { useToast } from "@/components/ToastContext";

const DAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const PLATFORMS: Platform[] = ["TikTok", "Instagram", "YouTube", "Telegram"];
const PRIORITIES: Priority[] = ["high", "medium", "low"];
const STATUSES = ["idea", "in-progress", "scheduled", "posted"] as const;

const POST_SUGGESTIONS = [
  { time: "19:00", label: "Пиковое окно", note: "TikTok +3.2× охват", platform: "TikTok" },
  { time: "20:30", label: "Высокий ER", note: "Instagram: пик для вашей аудитории", platform: "Instagram" },
  { time: "12:00", label: "Обеденный трафик", note: "YouTube watch-time +40%", platform: "YouTube" },
];

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year: number, month: number) { return new Date(year, month, 1).getDay(); }

interface AddEventModal { date?: string; }

export default function CalendarPage() {
  const { success, error: toastError, ai } = useToast();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [view, setView] = useState<"month" | "list">("month");
  const [selected, setSelected] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<AddEventModal | null>(null);
  const [autoPlanning, setAutoPlanning] = useState(false);

  // Form state
  const [form, setForm] = useState({ title: "", date: "", platform: "TikTok" as Platform, priority: "medium" as Priority, status: "idea" as typeof STATUSES[number], scheduledTime: "19:00", notes: "" });

  useEffect(() => {
    fetch("/api/events").then(r => r.json()).then((data) => { setEvents(data.events ?? []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const getEventsForDay = (day: number) => {
    const d = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.date === d);
  };

  const openModal = (date?: string) => {
    const d = date ?? `${year}-${String(month + 1).padStart(2, "0")}-01`;
    setForm(f => ({ ...f, date: d }));
    setModal({ date: d });
  };

  const saveEvent = async () => {
    if (!form.title.trim() || !form.date) { toastError("Заполните заголовок и дату"); return; }
    const ev: CalendarEvent = { id: `ev_${Date.now()}`, title: form.title, date: form.date, platform: form.platform, priority: form.priority, status: form.status, scheduledTime: form.scheduledTime, notes: form.notes };
    const res = await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ev) });
    if (res.ok) {
      setEvents(prev => [...prev, ev]);
      setModal(null);
      setForm({ title: "", date: "", platform: "TikTok", priority: "medium", status: "idea", scheduledTime: "19:00", notes: "" });
      success("Пост добавлен в календарь");
    } else { toastError("Ошибка сохранения"); }
  };

  const autoPlan = async () => {
    setAutoPlanning(true);
    await new Promise(r => setTimeout(r, 1800));
    const suggestions = [
      { title: "AI инструменты: топ-5 этой недели", platform: "TikTok" as Platform, priority: "high" as Priority },
      { title: "Реакция на вирусный тренд #AItools", platform: "TikTok" as Platform, priority: "high" as Priority },
      { title: "Обзор продуктивности: мой стек", platform: "YouTube" as Platform, priority: "medium" as Priority },
      { title: "Дайджест недели", platform: "Telegram" as Platform, priority: "low" as Priority },
      { title: "Behind the scenes: создаю контент", platform: "Instagram" as Platform, priority: "medium" as Priority },
    ];
    const newEvents: CalendarEvent[] = suggestions.map((s, i) => {
      const d = new Date(year, month, 3 + i * 2);
      return { id: `ai_${Date.now()}_${i}`, title: s.title, date: d.toISOString().split("T")[0], platform: s.platform, priority: s.priority, status: "idea", scheduledTime: "19:00" };
    });
    await Promise.all(newEvents.map(ev => fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ev) })));
    setEvents(prev => [...prev, ...newEvents]);
    setAutoPlanning(false);
    ai(`AI добавил ${newEvents.length} постов в контент-план на ${MONTHS[month]}. Приоритет расставлен по трендам и вашей нише.`);
  };

  const selectedDateEvents = selected ? events.filter(e => e.date === selected) : [];

  return (
    <AppShell>
      <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>Контент-календарь</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>
              {events.length} постов запланировано · AI-план активен
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              {(["month", "list"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} style={{ padding: "7px 12px", background: view === v ? "var(--accent)" : "transparent", color: view === v ? "white" : "var(--text-secondary)", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                  {v === "month" ? <><LayoutGrid size={13} /> Месяц</> : <><List size={13} /> Список</>}
                </button>
              ))}
            </div>
            <button className="btn-ghost" onClick={autoPlan} disabled={autoPlanning}>
              <Sparkles size={14} /> {autoPlanning ? "Генерирую..." : "AI Автоплан"}
            </button>
            <button className="btn-primary" onClick={() => openModal()}>
              <Plus size={14} /> Добавить пост
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
          {/* Calendar */}
          <div>
            {view === "month" ? (
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <button className="btn-icon" onClick={prevMonth}><ChevronLeft size={15} /></button>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{MONTHS[month]} {year}</h2>
                  <button className="btn-icon" onClick={nextMonth}><ChevronRight size={15} /></button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
                  {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", padding: "4px 0" }}>{d}</div>)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} style={{ minHeight: 80 }} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const dayEvs = getEventsForDay(day);
                    const isSelected = selected === dateStr;
                    const today = new Date(); const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                    return (
                      <div key={day} onClick={() => { setSelected(isSelected ? null : dateStr); }} style={{ minHeight: 80, padding: "6px 5px", borderRadius: 10, border: isSelected ? "2px solid var(--accent)" : "1px solid var(--border-subtle)", background: isSelected ? "var(--accent-light)" : "transparent", cursor: "pointer", transition: "all 0.15s", position: "relative" }}>
                        <div style={{ fontSize: 12, fontWeight: isToday ? 800 : 500, color: isToday ? "white" : "var(--text-primary)", background: isToday ? "var(--accent)" : "transparent", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 3 }}>{day}</div>
                        {dayEvs.slice(0, 2).map(ev => (
                          <div key={ev.id} style={{ fontSize: 9, fontWeight: 600, background: platformColors[ev.platform] + "22", color: platformColors[ev.platform], padding: "1px 4px", borderRadius: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", border: `1px solid ${platformColors[ev.platform]}44`, marginBottom: 1 }}>
                            {ev.platform.slice(0,2)} · {ev.title.slice(0, 11)}
                          </div>
                        ))}
                        {dayEvs.length > 2 && <div style={{ fontSize: 9, color: "var(--text-tertiary)", paddingLeft: 2 }}>+{dayEvs.length - 2}</div>}
                        <button onClick={(e) => { e.stopPropagation(); openModal(dateStr); }} style={{ position: "absolute", bottom: 3, right: 3, width: 16, height: 16, borderRadius: 5, background: "var(--accent)", border: "none", color: "white", display: "none", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, fontWeight: 800 }} className="day-add-btn">+</button>
                      </div>
                    );
                  })}
                </div>
                {selected && selectedDateEvents.length > 0 && (
                  <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 12, background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>Посты на {selected}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {selectedDateEvents.map(ev => (
                        <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, background: "var(--bg-card)" }}>
                          <div style={{ width: 28, height: 28, borderRadius: 7, background: platformColors[ev.platform], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "white" }}>{ev.platform.slice(0,2).toUpperCase()}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{ev.title}</div>
                            {ev.scheduledTime && <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{ev.scheduledTime}</div>}
                          </div>
                          <span className={`badge ${statusConfig[ev.status]?.badge ?? "badge-accent"}`} style={{ fontSize: 9 }}>{statusConfig[ev.status]?.label}</span>
                          <span className={`badge ${priorityConfig[ev.priority]?.badge ?? "badge-accent"}`} style={{ fontSize: 9 }}>{priorityConfig[ev.priority]?.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selected && selectedDateEvents.length === 0 && (
                  <div style={{ marginTop: 16, padding: 16, borderRadius: 12, border: "1px dashed var(--border)", textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 10 }}>Нет постов на {selected}</div>
                    <button className="btn-primary" style={{ fontSize: 12 }} onClick={() => openModal(selected)}><Plus size={12} /> Добавить пост</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>Все посты</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {events.sort((a, b) => a.date.localeCompare(b.date)).map(ev => (
                    <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: platformColors[ev.platform], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "white" }}>{ev.platform.slice(0,2).toUpperCase()}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{ev.title}</div>
                        <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{ev.date} · {ev.scheduledTime}</div>
                      </div>
                      <span className={`badge ${statusConfig[ev.status]?.badge ?? "badge-accent"}`}>{statusConfig[ev.status]?.label}</span>
                      <span className={`badge ${priorityConfig[ev.priority]?.badge ?? "badge-accent"}`}>{priorityConfig[ev.priority]?.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                <Clock size={14} color="var(--accent)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Лучшее время</span>
              </div>
              {POST_SUGGESTIONS.map((s, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>{s.time}</span>
                    <span className="badge badge-success" style={{ fontSize: 9 }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{s.note}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                <Flame size={14} color="var(--warning)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Цель на неделю</span>
              </div>
              {[
                { platform: "TikTok", target: 7, color: platformColors["TikTok"] },
                { platform: "Instagram", target: 5, color: platformColors["Instagram"] },
                { platform: "YouTube", target: 2, color: platformColors["YouTube"] },
                { platform: "Telegram", target: 5, color: platformColors["Telegram"] },
              ].map(p => {
                const current = events.filter(e => e.platform === p.platform).length;
                return (
                  <div key={p.platform} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{p.platform}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: current >= p.target ? "var(--success)" : "var(--warning)" }}>{current}/{p.target}</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(100, (current / p.target) * 100)}%`, background: current >= p.target ? "var(--success)" : p.color }} /></div>
                  </div>
                );
              })}
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Сводка {MONTHS[month]}</div>
              {(["scheduled","in-progress","posted","idea"] as const).map(status => (
                <div key={status} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{statusConfig[status]?.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "var(--accent)" }}>{events.filter(e => e.status === status).length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Post Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setModal(null)}>
          <div onClick={e => e.stopPropagation()} className="animate-fade-up" style={{ background: "var(--bg-card)", borderRadius: 20, padding: 28, width: 460, boxShadow: "0 24px 80px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>Новый пост</div>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)" }}><X size={18} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Заголовок поста *</label>
                <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Например: 5 AI-инструментов, которые заменят дизайнера" style={{ width: "100%" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Дата *</label>
                  <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ width: "100%" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Время</label>
                  <input className="input" type="time" value={form.scheduledTime} onChange={e => setForm(f => ({ ...f, scheduledTime: e.target.value }))} style={{ width: "100%" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Платформа</label>
                  <select className="input" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as Platform }))} style={{ width: "100%" }}>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Приоритет</label>
                  <select className="input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))} style={{ width: "100%" }}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{priorityConfig[p]?.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Статус</label>
                  <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as typeof STATUSES[number] }))} style={{ width: "100%" }}>
                    {STATUSES.map(s => <option key={s} value={s}>{statusConfig[s]?.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Заметки (опционально)</label>
                <textarea className="input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Идеи, хуки, ключевые моменты..." style={{ width: "100%", minHeight: 72, resize: "vertical" }} />
              </div>

              <div style={{ display: "flex", gap: 10, paddingTop: 6 }}>
                <button onClick={() => setModal(null)} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>Отмена</button>
                <button onClick={saveEvent} className="btn-primary" style={{ flex: 2, justifyContent: "center" }}>
                  <Plus size={14} /> Добавить в календарь
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
