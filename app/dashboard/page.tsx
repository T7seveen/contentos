"use client";

import AppShell from "@/components/AppShell";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Users,
  Zap,
  ArrowRight,
  Activity,
  Star,
} from "lucide-react";
import { formatNumber, platformColors } from "@/lib/utils";
import {
  engagementData,
  platformData,
  topPosts,
  aiInsights,
  contentHealthScore,
} from "@/lib/mockData";
import Link from "next/link";

const statCards = [
  {
    label: "Total Reach",
    value: "4.2M",
    change: "+18.4%",
    up: true,
    icon: Eye,
    color: "#6366f1",
    bg: "var(--accent-light)",
  },
  {
    label: "Followers",
    value: "297K",
    change: "+12.1%",
    up: true,
    icon: Users,
    color: "#8b5cf6",
    bg: "var(--purple-light)",
  },
  {
    label: "Avg. Engagement",
    value: "7.8%",
    change: "+2.3%",
    up: true,
    icon: Heart,
    color: "#ec4899",
    bg: "var(--pink-light)",
  },
  {
    label: "Replies & DMs",
    value: "1,842",
    change: "-4.2%",
    up: false,
    icon: MessageCircle,
    color: "#14b8a6",
    bg: "var(--teal-light)",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
            {formatNumber(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const health = contentHealthScore;

  return (
    <AppShell>
      <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
        {/* Header */}
        <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                marginBottom: 4,
              }}
            >
              Good morning, Alex 👋
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Here&apos;s what&apos;s happening with your content today
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/ideas">
              <button className="btn-ghost">
                <Zap size={14} />
                New Idea
              </button>
            </Link>
            <Link href="/assistant">
              <button className="btn-primary">
                <Activity size={14} />
                AI Insights
              </button>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 24,
          }}
        >
          {statCards.map((s) => (
            <div key={s.label} className="stat-card animate-fade-up">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: s.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <s.icon size={16} color={s.color} />
                </div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: 11,
                    fontWeight: 600,
                    color: s.up ? "var(--success)" : "var(--danger)",
                    background: s.up ? "var(--success-light)" : "var(--danger-light)",
                    padding: "2px 7px",
                    borderRadius: 99,
                  }}
                >
                  {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {s.change}
                </span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 24 }}>
          {/* Engagement Chart */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Engagement Over Time</h2>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 1 }}>Views & likes across all platforms</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {["7d", "30d", "90d"].map((t, i) => (
                  <button
                    key={t}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 7,
                      border: "1px solid var(--border)",
                      background: i === 1 ? "var(--accent)" : "transparent",
                      color: i === 1 ? "white" : "var(--text-secondary)",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={engagementData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="likesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.14} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" name="Views" stroke="#6366f1" strokeWidth={2} fill="url(#viewsGrad)" />
                <Area type="monotone" dataKey="likes" name="Likes" stroke="#8b5cf6" strokeWidth={2} fill="url(#likesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Content Health */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Content Health</h2>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 20 }}>Overall performance score</p>

            {/* Big Score */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: `conic-gradient(#6366f1 ${health.overall * 3.6}deg, var(--bg-tertiary) 0deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "50%",
                    background: "var(--bg-card)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                    {health.overall}
                  </span>
                  <span style={{ fontSize: 9, color: "var(--text-tertiary)", fontWeight: 600 }}>/ 100</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--success)", fontWeight: 600, marginTop: 8 }}>Good Performance</div>
            </div>

            {/* Sub-scores */}
            {[
              { label: "Consistency", value: health.consistency, color: "#f59e0b" },
              { label: "Engagement", value: health.engagement, color: "#10b981" },
              { label: "Growth", value: health.growth, color: "#6366f1" },
              { label: "Trending", value: health.trending, color: "#8b5cf6" },
            ].map((m) => (
              <div key={m.label} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{m.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>{m.value}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${m.value}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Top Posts */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Top Performing Posts</h2>
              <Link href="/analytics" style={{ fontSize: 12, color: "var(--accent)", display: "flex", alignItems: "center", gap: 3, textDecoration: "none", fontWeight: 600 }}>
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {topPosts.slice(0, 4).map((post) => (
                <div
                  key={post.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "var(--bg-secondary)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: platformColors[post.platform],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 10,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {post.platform.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {post.title}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>
                      {formatNumber(post.views)} views · {post.er}% ER
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--success)",
                    }}
                  >
                    <Star size={11} fill="var(--success)" />
                    {post.er}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                <span className="gradient-text">AI Insights</span>
              </h2>
              <Link href="/assistant" style={{ fontSize: 12, color: "var(--accent)", display: "flex", alignItems: "center", gap: 3, textDecoration: "none", fontWeight: 600 }}>
                Ask AI <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {aiInsights.slice(0, 3).map((ins, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1, marginTop: 1 }}>{ins.icon}</span>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          marginBottom: 3,
                        }}
                      >
                        {ins.title}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 6 }}>
                        {ins.body.slice(0, 90)}...
                      </div>
                      <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>→ {ins.action}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="card" style={{ padding: 24, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Platform Overview</h2>
            <Link href="/analytics" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
              Full analytics <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {platformData.map((p) => (
              <div
                key={p.platform}
                style={{
                  padding: "16px",
                  borderRadius: 12,
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: platformColors[p.platform],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {p.platform.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{p.platform}</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, marginBottom: 4 }}>
                  {formatNumber(p.followers)}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 8 }}>followers</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--success)" }}>+{p.growth}%</div>
                    <div style={{ fontSize: 9, color: "var(--text-tertiary)" }}>growth</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)" }}>{p.er}%</div>
                    <div style={{ fontSize: 9, color: "var(--text-tertiary)" }}>eng. rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
