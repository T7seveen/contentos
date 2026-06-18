"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Zap, Search, Filter, ExternalLink, Flame, ArrowRight } from "lucide-react";
import { TrendItem, Platform } from "@/lib/types";
import { formatNumber, platformColors } from "@/lib/utils";
import { useToast } from "@/components/ToastContext";

const statusConfig = {
  rising: { label: "Растёт", color: "var(--success)", icon: TrendingUp, badge: "badge-success" },
  peak: { label: "Пик", color: "var(--warning)", icon: Flame, badge: "badge-warning" },
  falling: { label: "Падает", color: "var(--danger)", icon: TrendingDown, badge: "badge-danger" },
  stable: { label: "Стабильный", color: "var(--text-secondary)", icon: Minus, badge: "badge-accent" },
} as const;

const trendHistory: Record<string, { week: string; volume: number }[]> = {
  t1: [
    { week: "Нд-1", volume: 640000 }, { week: "Нд-2", volume: 890000 }, { week: "Нд-3", volume: 1200000 },
    { week: "Нд-4", volume: 1800000 }, { week: "Сейчас", volume: 2840000 },
  ],
  t2: [
    { week: "Нд-1", volume: 780000 }, { week: "Нд-2", volume: 920000 }, { week: "Нд-3", volume: 1100000 },
    { week: "Нд-4", volume: 1200000 }, { week: "Сейчас", volume: 1240000 },
  ],
  t4: [
    { week: "Нд-1", volume: 1800000 }, { week: "Нд-2", volume: 2800000 }, { week: "Нд-3", volume: 3800000 },
    { week: "Нд-4", volume: 4000000 }, { week: "Сейчас", volume: 4200000 },
  ],
};

const trendInsights: Record<string, string> = {
  t1: "🔥 #AItools набирает 340% в неделю. Ваша аудитория пересекается с этой темой на 96%. Рекомендуется создать 2–3 видео до пика тренда.",
  t2: "📈 #ProductivityHacks находится на пике. Сейчас идеальное время публиковать контент — охват максимален. После этой недели ожидается спад.",
  t3: "🚀 #CreatorEconomy активно растёт. Ваш нише соответствует на 92%. Конкуренция ещё невысокая — хороший момент для входа.",
  t4: "⚡ #ChatGPT стабилен с огромным объёмом. Высокая конкуренция, но и высокий охват. Фокусируйтесь на уникальном угле.",
  t9: "💎 #Automation trending в Telegram. Сравнительно низкая конкуренция при высокой релевантности. Первый туда — выиграет алгоритм.",
};

const categoryData = [
  { name: "Technology", value: 42 },
  { name: "Productivity", value: 28 },
  { name: "Business", value: 18 },
  { name: "Lifestyle", value: 8 },
  { name: "Finance", value: 4 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ fontSize: 12, fontWeight: 700, color: p.color ?? "var(--text-primary)" }}>
          {formatNumber(p.value)}
        </div>
      ))}
    </div>
  );
};

function TrendCard({ trend, onAnalyze }: { trend: TrendItem; onAnalyze: (t: TrendItem) => void }) {
  const s = statusConfig[trend.status];
  const history = trendHistory[trend.id];

  return (
    <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>{trend.hashtag}</span>
            <span className={`badge ${s.badge}`} style={{ fontSize: 9 }}>
              <s.icon size={9} /> {s.label}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
            <span
              style={{
                background: platformColors[trend.platform] + "22",
                color: platformColors[trend.platform],
                fontSize: 10,
                fontWeight: 700,
                padding: "1px 7px",
                borderRadius: 5,
                border: `1px solid ${platformColors[trend.platform]}44`,
              }}
            >
              {trend.platform}
            </span>
            <span className="tag">{trend.category}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: trend.status === "falling" ? "var(--danger)" : "var(--success)", lineHeight: 1 }}>
            {trend.status === "falling" ? "" : "+"}{trend.growth}%
          </div>
          <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>рост за неделю</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <div style={{ padding: "8px", background: "var(--bg-secondary)", borderRadius: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{formatNumber(trend.volume)}</div>
          <div style={{ fontSize: 9, color: "var(--text-tertiary)" }}>Объём</div>
        </div>
        <div style={{ padding: "8px", background: "var(--bg-secondary)", borderRadius: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>{trend.relevance}%</div>
          <div style={{ fontSize: 9, color: "var(--text-tertiary)" }}>Релевантность</div>
        </div>
        <div style={{ padding: "8px", background: "var(--bg-secondary)", borderRadius: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.label}</div>
          <div style={{ fontSize: 9, color: "var(--text-tertiary)" }}>Статус</div>
        </div>
      </div>

      {history && (
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id={`grad-${trend.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="volume" stroke={s.color} strokeWidth={2} fill={`url(#grad-${trend.id})`} dot={false} />
            <Tooltip content={<CustomTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {trendInsights[trend.id] && (
        <div style={{ padding: "8px 10px", background: "var(--accent-light)", borderRadius: 8, fontSize: 11, color: "var(--accent)", lineHeight: 1.5, borderLeft: "2px solid var(--accent)" }}>
          {trendInsights[trend.id]}
        </div>
      )}

      <button
        onClick={() => onAnalyze(trend)}
        className="btn-ghost"
        style={{ width: "100%", justifyContent: "center", fontSize: 12 }}
      >
        <Zap size={12} /> Создать контент под тренд
      </button>
    </div>
  );
}

export default function Trends() {
  const { ai } = useToast();
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [filter, setFilter] = useState<"all" | Platform>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"growth" | "volume" | "relevance">("growth");
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/trends").then((r) => r.json()).then(setTrends);
  }, []);

  const handleAnalyze = async (trend: TrendItem) => {
    setAnalyzing(trend.id);
    await new Promise((r) => setTimeout(r, 1000));
    setAnalyzing(null);
    ai(`${trend.hashtag} проанализирован`, `Релевантность: ${trend.relevance}%. Рекомендую создать 2 видео в этой нише до пика.`);
  };

  const filtered = trends
    .filter((t) => {
      const matchPlatform = filter === "all" || t.platform === filter;
      const matchSearch = t.hashtag.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
      return matchPlatform && matchSearch;
    })
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const topTrend = trends.sort((a, b) => b.growth - a.growth)[0];

  return (
    <AppShell>
      <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
        {/* Header */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>Тренд-вотчинг</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>
              Мониторинг {trends.length} трендов в реальном времени · Обновлено 2 мин. назад
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost">
              <Filter size={13} /> Настроить
            </button>
          </div>
        </div>

        {/* Alert banner */}
        {topTrend && (
          <div
            style={{
              padding: "14px 20px",
              borderRadius: 14,
              background: "linear-gradient(135deg, var(--accent-light), var(--purple-light))",
              border: "1px solid var(--accent)",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <Flame size={20} color="var(--accent)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                🔥 Горячий тренд: <span style={{ color: "var(--accent)" }}>{topTrend.hashtag}</span> растёт на {topTrend.growth}% за неделю
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                Релевантность для вашей ниши: {topTrend.relevance}%. Рекомендуется публиковать в течение 48 часов.
              </div>
            </div>
            <button className="btn-primary" onClick={() => handleAnalyze(topTrend)}>
              <Zap size={13} /> Использовать тренд
            </button>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search size={12} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
            <input
              className="input"
              style={{ paddingLeft: 30, width: 200 }}
              placeholder="Поиск трендов..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            {(["all", "TikTok", "Instagram", "YouTube", "Telegram"] as const).map((p) => (
              <button
                key={p}
                style={{
                  padding: "7px 12px",
                  background: filter === p ? "var(--accent)" : "transparent",
                  color: filter === p ? "white" : "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  transition: "all 0.15s",
                }}
                onClick={() => setFilter(p)}
              >
                {p === "all" ? "Все" : p}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)", alignSelf: "center" }}>Сортировка:</span>
            {(["growth", "volume", "relevance"] as const).map((s) => (
              <button
                key={s}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: sortBy === s ? "var(--accent-light)" : "transparent",
                  color: sortBy === s ? "var(--accent)" : "var(--text-secondary)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => setSortBy(s)}
              >
                {s === "growth" ? "Рост" : s === "volume" ? "Объём" : "Релевантность"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 320px", gap: 16 }}>
          {/* Trend cards */}
          <div style={{ gridColumn: "1 / 3", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {filtered.map((t) => (
              <TrendCard key={t.id} trend={t} onAnalyze={handleAnalyze} />
            ))}
          </div>

          {/* Right panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Category breakdown */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>Тренды по нишам</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={categoryData} layout="vertical" margin={{ left: -10, right: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="var(--accent)" radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Rising fastest */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={14} color="var(--success)" /> Растут быстрее всего
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {trends
                  .filter((t) => t.status === "rising")
                  .sort((a, b) => b.growth - a.growth)
                  .slice(0, 5)
                  .map((t) => (
                    <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          background: platformColors[t.platform] + "22",
                          color: platformColors[t.platform],
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "1px 5px",
                          borderRadius: 4,
                          flexShrink: 0,
                        }}
                      >
                        {t.platform.slice(0, 2)}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", flex: 1 }}>{t.hashtag}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "var(--success)" }}>+{t.growth}%</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* AI recommended */}
            <div
              style={{
                padding: 16,
                borderRadius: 14,
                background: "linear-gradient(135deg, var(--accent-light), var(--purple-light))",
                border: "1px solid var(--accent)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={12} /> AI-РЕКОМЕНДАЦИЯ
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 10 }}>
                Сейчас наиболее выгодная комбинация: <strong>#AItools</strong> + <strong>#Automation</strong> на TikTok. Оба тренда растут, низкая конкуренция.
              </div>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 12 }}>
                Создать идею под эту комбинацию <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
