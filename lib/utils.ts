export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(decimals)}%`;
}

export const platformColors: Record<string, string> = {
  TikTok: "#69C9D0",
  Instagram: "#E1306C",
  YouTube: "#FF0000",
  Telegram: "#229ED9",
};

export const platformBg: Record<string, string> = {
  TikTok: "#010101",
  Instagram: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
  YouTube: "#FF0000",
  Telegram: "#229ED9",
};

export const priorityConfig: Record<string, { label: string; color: string; badge: string }> = {
  high: { label: "High", color: "#ef4444", badge: "badge-danger" },
  medium: { label: "Medium", color: "#f59e0b", badge: "badge-warning" },
  low: { label: "Low", color: "#10b981", badge: "badge-success" },
};

export const statusConfig: Record<string, { label: string; badge: string }> = {
  idea: { label: "Idea", badge: "badge-accent" },
  "in-progress": { label: "In Progress", badge: "badge-warning" },
  posted: { label: "Posted", badge: "badge-success" },
  scheduled: { label: "Scheduled", badge: "badge-purple" },
};
