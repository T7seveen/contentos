"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { useToast } from "@/components/ToastContext";
import { User, CreditCard, Bell, Shield, Link2, Check, Plus, Trash2, Save } from "lucide-react";

const PLATFORMS = [
  { name: "TikTok", color: "#000", bg: "#f0f0f0", emoji: "🎵" },
  { name: "Instagram", color: "#e1306c", bg: "#fce4ec", emoji: "📸" },
  { name: "YouTube", color: "#ff0000", bg: "#ffebee", emoji: "▶️" },
  { name: "Telegram", color: "#0088cc", bg: "#e3f2fd", emoji: "✈️" },
];

const PLANS = [
  { id: "free", name: "Free", price: "0₽", features: ["3 connected accounts", "50 AI requests/month", "7-day history"] },
  { id: "pro", name: "Pro", price: "1 490₽", features: ["All platforms", "Unlimited AI", "Full analytics", "Priority support"], highlight: true },
  { id: "business", name: "Business", price: "4 990₽", features: ["Everything in Pro", "Team access", "White-label reports", "API access", "Dedicated manager"] },
];

type Tab = "profile" | "billing" | "accounts" | "notifications" | "security";

export default function SettingsPage() {
  const { success, error: toastError } = useToast();
  const [tab, setTab] = useState<Tab>("profile");
  const [name, setName] = useState("Alex Kim");
  const [email, setEmail] = useState("alex@contentos.ai");
  const [niche, setNiche] = useState("Productivity & Tech");
  const [bio, setBio] = useState("Content creator focused on productivity and AI tools.");
  const [saving, setSaving] = useState(false);
  const [connected, setConnected] = useState<string[]>(["TikTok", "Instagram"]);
  const [handle, setHandle] = useState("");
  const [addingPlatform, setAddingPlatform] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState("pro");
  const [notifs, setNotifs] = useState({ viral: true, trends: true, weekly: true, calendar: true, ai: true });
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  const saveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    success("Профиль сохранён");
  };

  const connectPlatform = (platform: string) => {
    if (!handle.trim()) { toastError("Введите @username"); return; }
    setConnected((prev) => [...prev, platform]);
    setAddingPlatform(null);
    setHandle("");
    success(`${platform} подключён — @${handle}`);
  };

  const disconnect = (platform: string) => {
    setConnected((prev) => prev.filter((p) => p !== platform));
    success(`${platform} отключён`);
  };

  const upgradeToProMock = () => {
    success("Оплата через Stripe (демо) — план обновлён до Pro!");
    setCurrentPlan("pro");
  };

  const tabs: { id: Tab; icon: typeof User; label: string }[] = [
    { id: "profile", icon: User, label: "Профиль" },
    { id: "billing", icon: CreditCard, label: "Тарифы" },
    { id: "accounts", icon: Link2, label: "Аккаунты" },
    { id: "notifications", icon: Bell, label: "Уведомления" },
    { id: "security", icon: Shield, label: "Безопасность" },
  ];

  return (
    <AppShell>
      <div style={{ padding: "28px 32px", maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6, letterSpacing: "-0.5px" }}>Настройки</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>Управляйте аккаунтом, тарифом и интеграциями</p>

        <div style={{ display: "flex", gap: 24 }}>
          {/* Sidebar */}
          <div style={{ width: 200, flexShrink: 0 }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {tabs.map(({ id, icon: Icon, label }) => (
                <button key={id} onClick={() => setTab(id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9,
                  background: tab === id ? "var(--accent-light)" : "transparent",
                  color: tab === id ? "var(--accent)" : "var(--text-secondary)",
                  border: "none", cursor: "pointer", fontSize: 13, fontWeight: tab === id ? 600 : 500,
                  textAlign: "left", transition: "all 0.15s",
                }}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            {tab === "profile" && (
              <div className="card" style={{ padding: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 22, color: "var(--text-primary)" }}>Профиль</h2>
                {/* Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "white", fontWeight: 700 }}>
                    {name[0]}
                  </div>
                  <div>
                    <button style={{ fontSize: 13, color: "var(--accent)", background: "none", border: "1px solid var(--accent)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontWeight: 600 }}>Изменить фото</button>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>JPG, PNG до 5MB</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Имя</label>
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Email</label>
                    <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Ниша / Тематика</label>
                  <input className="input" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Например: Путешествия, Фитнес, Технологии..." style={{ width: "100%" }} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Bio</label>
                  <textarea className="input" value={bio} onChange={(e) => setBio(e.target.value)} style={{ width: "100%", minHeight: 80, resize: "vertical" }} />
                </div>
                <button onClick={saveProfile} disabled={saving} className="btn-primary" style={{ fontSize: 13 }}>
                  <Save size={13} /> {saving ? "Сохраняем..." : "Сохранить изменения"}
                </button>
              </div>
            )}

            {tab === "billing" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {PLANS.map((plan) => (
                    <div key={plan.id} className="card" style={{ padding: 22, border: plan.highlight ? "2px solid var(--accent)" : "1px solid var(--border)", position: "relative" }}>
                      {plan.highlight && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>ПОПУЛЯРНЫЙ</div>}
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "var(--text-primary)" }}>{plan.name}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: plan.highlight ? "var(--accent)" : "var(--text-primary)", marginBottom: 16 }}>
                        {plan.price}<span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-tertiary)" }}>/мес</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                        {plan.features.map((f) => (
                          <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--text-secondary)" }}>
                            <Check size={12} color="var(--success)" /> {f}
                          </div>
                        ))}
                      </div>
                      {currentPlan === plan.id ? (
                        <div style={{ padding: "8px 0", textAlign: "center", fontSize: 12, color: "var(--success)", fontWeight: 700 }}>✓ Текущий план</div>
                      ) : (
                        <button onClick={upgradeToProMock} className={plan.highlight ? "btn-primary" : "btn-ghost"} style={{ width: "100%", justifyContent: "center", fontSize: 12 }}>
                          {plan.id === "free" ? "Понизить" : "Перейти"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="card" style={{ padding: 20, marginTop: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>Способ оплаты</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 24, background: "linear-gradient(135deg,#1a1f71,#00aeef)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", fontWeight: 700 }}>VISA</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>•••• •••• •••• 4242</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Истекает 12/26</div>
                    </div>
                  </div>
                  <button style={{ fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}><Plus size={12} /> Добавить карту</button>
                </div>
              </div>
            )}

            {tab === "accounts" && (
              <div className="card" style={{ padding: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "var(--text-primary)" }}>Подключённые аккаунты</h2>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 22 }}>Подключите соцсети для получения реальной аналитики</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {PLATFORMS.map((p) => {
                    const isConnected = connected.includes(p.name);
                    const isAdding = addingPlatform === p.name;
                    return (
                      <div key={p.name} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{p.emoji}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{p.name}</div>
                            {isConnected && <div style={{ fontSize: 12, color: "var(--success)" }}>✓ Подключён</div>}
                          </div>
                          {isConnected ? (
                            <button onClick={() => disconnect(p.name)} style={{ fontSize: 12, color: "var(--danger)", background: "none", border: "1px solid var(--danger)", borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>
                              <Trash2 size={11} /> Отключить
                            </button>
                          ) : (
                            <button onClick={() => setAddingPlatform(isAdding ? null : p.name)} style={{ fontSize: 12, color: "var(--accent)", background: "var(--accent-light)", border: "none", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontWeight: 600 }}>
                              <Plus size={11} /> Подключить
                            </button>
                          )}
                        </div>
                        {isAdding && (
                          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                            <input className="input" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder={`@username на ${p.name}`} style={{ flex: 1 }} />
                            <button onClick={() => connectPlatform(p.name)} className="btn-primary" style={{ fontSize: 12 }}>Подключить</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === "notifications" && (
              <div className="card" style={{ padding: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 22, color: "var(--text-primary)" }}>Уведомления</h2>
                {[
                  { key: "viral" as const, label: "Вирусные посты", desc: "Когда ваш пост набирает 2× от среднего" },
                  { key: "trends" as const, label: "Тренды", desc: "Новые тренды в вашей нише" },
                  { key: "weekly" as const, label: "Еженедельный отчёт", desc: "Сводка за неделю каждый понедельник" },
                  { key: "calendar" as const, label: "Напоминания календаря", desc: "За 1 час до запланированного поста" },
                  { key: "ai" as const, label: "AI Инсайты", desc: "Новые рекомендации от AI стратега" },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid var(--border-subtle)" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifs((prev) => ({ ...prev, [key]: !prev[key] }))}
                      style={{
                        width: 42, height: 24, borderRadius: 12, border: "none", cursor: "pointer", transition: "background 0.2s",
                        background: notifs[key] ? "var(--accent)" : "var(--bg-tertiary)",
                        position: "relative",
                      }}
                    >
                      <div style={{
                        position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%", background: "white",
                        transition: "left 0.2s", left: notifs[key] ? 21 : 3,
                      }} />
                    </button>
                  </div>
                ))}
                <button onClick={() => success("Настройки уведомлений сохранены")} className="btn-primary" style={{ fontSize: 13 }}>
                  <Save size={13} /> Сохранить
                </button>
              </div>
            )}

            {tab === "security" && (
              <div className="card" style={{ padding: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 22, color: "var(--text-primary)" }}>Безопасность</h2>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Текущий пароль</label>
                  <input className="input" type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" style={{ width: "100%" }} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Новый пароль</label>
                  <input className="input" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Минимум 6 символов" style={{ width: "100%" }} />
                </div>
                <button onClick={() => { if (!currentPw || !newPw) { toastError("Заполните оба поля"); return; } success("Пароль обновлён"); setCurrentPw(""); setNewPw(""); }} className="btn-primary" style={{ fontSize: 13 }}>
                  <Shield size={13} /> Обновить пароль
                </button>
                <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--danger)", marginBottom: 8 }}>Опасная зона</div>
                  <button onClick={() => toastError("Удаление аккаунта — обратитесь в поддержку")} style={{ fontSize: 12, color: "var(--danger)", background: "none", border: "1px solid var(--danger)", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>
                    Удалить аккаунт
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
