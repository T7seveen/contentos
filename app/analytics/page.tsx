"use client";

import AppShell from "@/components/AppShell";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { TrendingUp, Plus, Eye, Heart, Share2, Users, AlertCircle } from "lucide-react";
import { formatNumber, platformColors } from "@/lib/utils";
import { topPosts, competitors, engagementData, platformData } from "@/lib/mockData";

const postTypeData = [
  { type: "Tutorial", views: 284000, er: 8.4 },
  { type: "Vlog", views: 124000, er: 3.1 },
  { type: "Review", views: 98000, er: 2.4 },
  { type: "Reaction", views: 167000, er: 5.7 },
  { type: "Story", views: 204000, er: 6.8 },
  { type: "Collab", views: 312000, er: 9.2 },
];

const radarData = [
  { metric: "Views", you: 78, comp1: 92, comp2: 65 },
  { metric: "ER", you: 85, comp1: 72, comp2: 68 },
  { metric: "Growth", you: 71, comp1: 94, comp2: 58 },
  { metric: "Freq.", you: 62, comp1: 88, comp2: 74 },
  { metric: "Comments", you: 90, comp1: 78, comp2: 82 },
  { metric: "Shares", you: 74, comp1: 85, comp2: 61 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: "flex", gap: 8, fontSize: 12, marginBottom: 2 }}>
          <span style={{ color: p.color, fontWeight: 700 }}>{p.name}:</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{typeof p.value === "number" && p.value > 100 ? formatNumber(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  return (
    <AppShell>
      <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
        {/* Header */}
        <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>Analytics</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>Deep dive into your content performance</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost">
              <span style={{ fontSize: 12 }}>Mar 1 – Mar 31</span>
            </button>
            <button className="btn-primary">
              <Plus size={14} />
              Add Account
            </button>
          </div>
        </div>

        {/* Platform Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {platformData.map((p) => (
            <div key={p.platform} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: platformColors[p.platform],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 800,
                      color: "white",
                    }}
                  >
                    {p.platform.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{p.platform}</span>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1 }}>
                {formatNumber(p.followers)}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 12 }}>followers</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Growth", value: `+${p.growth}%`, icon: TrendingUp, color: "var(--success)" },
                  { label: "Eng. Rate", value: `${p.er}%`, icon: Heart, color: "var(--pink)" },
                  { label: "Posts", value: p.posts.toString(), icon: Eye, color: "var(--accent)" },
                  { label: "Freq/wk", value: "~" + Math.round(p.posts / 13), icon: Share2, color: "var(--purple)" },
                ].map((m) => (
                  <div key={m.label} style={{ padding: "8px", background: "var(--bg-secondary)", borderRadius: 8 }}>
                    <m.icon size={11} color={m.color} style={{ marginBottom: 2 }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: "var(--text-tertiary)" }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {/* Views over time */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Views Over Time</h3>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 16 }}>Total reach across platforms</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={engagementData} margin={{ left: -20, right: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="views" name="Views" stroke="#6366f1" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Content type performance */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Content Format Performance</h3>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 16 }}>Avg. views by content type</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={postTypeData} margin={{ left: -20, right: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="type" tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" name="Views" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Posts */}
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>Top Performing Posts</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Post", "Platform", "Views", "Likes", "Comments", "Shares", "ER", "Date"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 12px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-tertiary)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topPosts.map((post) => (
                  <tr
                    key={post.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      transition: "background 0.1s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-secondary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 12px" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", maxWidth: 240, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {post.title}
                      </div>
                      <span className={`badge badge-${post.type === "viral" ? "danger" : post.type === "educational" ? "accent" : "purple"}`} style={{ marginTop: 3, fontSize: 9 }}>
                        {post.type}
                      </span>
                    </td>
                    <td style={{ padding: "12px 12px" }}>
                      <span
                        style={{
                          background: platformColors[post.platform],
                          color: "white",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: 5,
                        }}
                      >
                        {post.platform}
                      </span>
                    </td>
                    {[post.views, post.likes, post.comments, post.shares].map((v, i) => (
                      <td key={i} style={{ padding: "12px 12px", fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                        {formatNumber(v)}
                      </td>
                    ))}
                    <td style={{ padding: "12px 12px" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--success)" }}>{post.er}%</span>
                    </td>
                    <td style={{ padding: "12px 12px", fontSize: 12, color: "var(--text-tertiary)" }}>{post.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Competitor Analysis */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Competitor Analysis</h3>
                <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>Tracked accounts vs your metrics</p>
              </div>
              <button className="btn-ghost" style={{ fontSize: 12 }}>
                <Plus size={13} /> Add Competitor
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {competitors.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: "16px",
                    borderRadius: 12,
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-subtle)",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: platformColors[c.platform],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 800,
                        color: "white",
                      }}
                    >
                      {c.handle.slice(1, 3).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{c.handle}</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{c.platform} · {c.postsPerWeek}×/week</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {[
                      { l: "Followers", v: formatNumber(c.followers) },
                      { l: "Growth", v: `+${c.growth}%` },
                      { l: "Avg Views", v: formatNumber(c.avgViews) },
                    ].map((m) => (
                      <div key={m.l}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{m.v}</div>
                        <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <span className="badge badge-purple" style={{ fontSize: 10 }}>Top: {c.topFormat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Radar */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>You vs Competitors</h3>
            <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 4 }}>Multi-metric comparison</p>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              {[
                { color: "#6366f1", label: "You" },
                { color: "#10b981", label: "@techcreator_pro" },
                { color: "#f59e0b", label: "@digitalminds" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                  <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{l.label}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} />
                <Radar name="You" dataKey="you" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="comp1" dataKey="comp1" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={1.5} />
                <Radar name="comp2" dataKey="comp2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={1.5} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Warning Banner */}
        <div
          style={{
            marginTop: 16,
            padding: "14px 20px",
            borderRadius: 12,
            background: "var(--warning-light)",
            border: "1px solid var(--warning)",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <AlertCircle size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--warning)" }}>AI Insight: </span>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              @techcreator_pro is outgrowing you by 2× on TikTok. They post 12×/week with contrarian takes that get 40% higher CTR. Consider testing 3–5 contrarian-angle videos this month.
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
