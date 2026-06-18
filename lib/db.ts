import fs from "fs";
import path from "path";
import { DB, Idea, Note, CalendarEvent, Notification, TrendItem } from "./types";

// On Vercel, process.cwd() is read-only — use /tmp for ephemeral writable storage
const DB_FILE = process.env.VERCEL
  ? "/tmp/db.json"
  : path.join(process.cwd(), "data", "db.json");

function ensureDir() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function readDB(): DB {
  ensureDir();
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) as DB;
  } catch {
    const initial = getInitialDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
}

export function writeDB(db: DB) {
  ensureDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function getIdeas(): Idea[] { return readDB().ideas; }
export function getNotes(): Note[] { return readDB().notes; }
export function getEvents(): CalendarEvent[] { return readDB().events; }
export function getNotifications(): Notification[] { return readDB().notifications; }
export function getTrends(): TrendItem[] { return readDB().trends; }
export function getUser() { return readDB().user; }

export function saveIdea(idea: Idea) {
  const db = readDB();
  const idx = db.ideas.findIndex((i) => i.id === idea.id);
  if (idx >= 0) db.ideas[idx] = idea; else db.ideas.unshift(idea);
  writeDB(db);
}

export function deleteIdea(id: string) {
  const db = readDB();
  db.ideas = db.ideas.filter((i) => i.id !== id);
  writeDB(db);
}

export function saveNote(note: Note) {
  const db = readDB();
  const idx = db.notes.findIndex((n) => n.id === note.id);
  if (idx >= 0) db.notes[idx] = note; else db.notes.unshift(note);
  writeDB(db);
}

export function deleteNote(id: string) {
  const db = readDB();
  db.notes = db.notes.filter((n) => n.id !== id);
  writeDB(db);
}

export function saveEvent(ev: CalendarEvent) {
  const db = readDB();
  const idx = db.events.findIndex((e) => e.id === ev.id);
  if (idx >= 0) db.events[idx] = ev; else db.events.unshift(ev);
  writeDB(db);
}

export function deleteEvent(id: string) {
  const db = readDB();
  db.events = db.events.filter((e) => e.id !== id);
  writeDB(db);
}

export function addNotification(notif: Notification) {
  const db = readDB();
  db.notifications.unshift(notif);
  if (db.notifications.length > 50) db.notifications = db.notifications.slice(0, 50);
  writeDB(db);
}

export function markNotificationsRead(ids?: string[]) {
  const db = readDB();
  db.notifications = db.notifications.map((n) =>
    !ids || ids.includes(n.id) ? { ...n, read: true } : n
  );
  writeDB(db);
}

export function saveUser(user: Partial<DB["user"]>) {
  const db = readDB();
  db.user = { ...db.user, ...user };
  writeDB(db);
}

function getInitialDB(): DB {
  return {
    user: {
      name: "Alex Kim",
      email: "alex@contentos.ai",
      plan: "Pro",
      niche: "Productivity & Tech",
      goals: ["Grow TikTok to 500K", "Launch YouTube channel", "Monetize content"],
      connectedPlatforms: ["TikTok", "Instagram", "YouTube", "Telegram"],
      createdAt: "2024-01-01",
    },
    ideas: [
      { id: "i1", title: "Why 99% of people fail at building habits", category: "Educational", tags: ["viral","psychology","self-help"], priority: "high", status: "idea", platform: ["TikTok","YouTube"], aiScore: 92, createdAt: "2024-03-18", notes: "Hook: shocking statistic. Show the 3 hidden reasons backed by neuroscience." },
      { id: "i2", title: "Day in my life as a content creator making $10k/month", category: "Entertaining", tags: ["viral","behind-scenes","income"], priority: "high", status: "in-progress", platform: ["TikTok","Instagram"], aiScore: 88, createdAt: "2024-03-17", notes: "Film authentic morning routine. Include real numbers and tools." },
      { id: "i3", title: "10 AI tools that replace $5000/month in software", category: "Educational", tags: ["ai","tools","productivity"], priority: "high", status: "idea", platform: ["YouTube","Telegram"], aiScore: 96, createdAt: "2024-03-16", notes: "Compare free AI vs paid tools. Show workflow automation." },
      { id: "i4", title: "I tested every viral hook formula for 30 days", category: "Educational", tags: ["copywriting","hooks","experiment"], priority: "medium", status: "idea", platform: ["TikTok"], aiScore: 84, createdAt: "2024-03-15", notes: "Track metrics for each hook type. Show results with data." },
      { id: "i5", title: "The brutal truth about social media growth in 2024", category: "Viral", tags: ["controversial","growth","insights"], priority: "high", status: "posted", platform: ["TikTok","YouTube"], aiScore: 91, createdAt: "2024-03-14", notes: "Controversial take: engagement > followers. Back with data." },
      { id: "i6", title: "ChatGPT prompt that writes better than most humans", category: "Educational", tags: ["ai","chatgpt","writing"], priority: "high", status: "idea", platform: ["TikTok","Telegram"], aiScore: 94, createdAt: "2024-03-11", notes: "Chain-of-thought prompt engineering. Show before/after." },
    ],
    notes: [
      {
        id: "n1",
        title: "Content Strategy Q2 2024",
        icon: "📋",
        color: "#6366f1",
        blocks: [
          { id: "b1", type: "h1", content: "Content Strategy Q2 2024" },
          { id: "b2", type: "callout", content: "🎯 Goal: Reach 500K followers on TikTok by June 30" },
          { id: "b3", type: "h2", content: "Focus Platforms" },
          { id: "b4", type: "bullet", content: "TikTok — primary growth engine" },
          { id: "b5", type: "bullet", content: "YouTube — long-form authority content" },
          { id: "b6", type: "bullet", content: "Telegram — community & monetization" },
          { id: "b7", type: "h2", content: "Content Mix (weekly)" },
          { id: "b8", type: "numbered", content: "3x Educational tutorials" },
          { id: "b9", type: "numbered", content: "2x Entertaining / behind the scenes" },
          { id: "b10", type: "numbered", content: "1x Viral / controversial take" },
          { id: "b11", type: "numbered", content: "1x Collaboration" },
          { id: "b12", type: "h2", content: "Key Insights" },
          { id: "b13", type: "quote", content: "Tutorials perform 3.4× better than vlogs for my audience. Prioritize educational content above all." },
          { id: "b14", type: "todo", content: "Batch record 7 videos this week", checked: false },
          { id: "b15", type: "todo", content: "A/B test 2 hook styles", checked: true },
          { id: "b16", type: "todo", content: "Set up content calendar for April", checked: false },
        ],
        tags: ["strategy", "planning", "q2"],
        links: ["n2"],
        backlinks: [],
        pinned: true,
        createdAt: "2024-03-01",
        updatedAt: "2024-03-18",
      },
      {
        id: "n2",
        title: "Viral Hook Formulas",
        icon: "🎣",
        color: "#ec4899",
        blocks: [
          { id: "b1", type: "h1", content: "Viral Hook Formulas" },
          { id: "b2", type: "paragraph", content: "Collection of the highest-performing hook structures based on 30 days of A/B testing across 500+ posts." },
          { id: "b3", type: "h2", content: "Top Performing Hooks" },
          { id: "b4", type: "numbered", content: "\"Why 99% of people fail at [X]\" — avg ER 11.2%" },
          { id: "b5", type: "numbered", content: "\"I tested [X] for 30 days — here's what happened\" — avg ER 9.8%" },
          { id: "b6", type: "numbered", content: "\"Nobody talks about this [niche] mistake\" — avg ER 12.4%" },
          { id: "b7", type: "numbered", content: "\"The [X] that changed my [outcome]\" — avg ER 8.6%" },
          { id: "b8", type: "h2", content: "Hook Components" },
          { id: "b9", type: "bullet", content: "Pattern interrupt (first 1 second)" },
          { id: "b10", type: "bullet", content: "Curiosity gap (what will they learn?)" },
          { id: "b11", type: "bullet", content: "Specificity (numbers, timeframes)" },
          { id: "b12", type: "bullet", content: "Identity anchor (who is this for?)" },
          { id: "b13", type: "code", content: "FORMULA:\n[Pattern Interrupt] + [Specificity] + [Curiosity Gap]\nExample: \"STOP scrolling. This $0 strategy got me 2M views in 14 days.\"", language: "text" },
        ],
        tags: ["hooks", "copywriting", "viral"],
        links: ["n1", "n3"],
        backlinks: ["n1"],
        pinned: false,
        createdAt: "2024-03-05",
        updatedAt: "2024-03-15",
      },
      {
        id: "n3",
        title: "AI Tools Research",
        icon: "🤖",
        color: "#10b981",
        blocks: [
          { id: "b1", type: "h1", content: "AI Tools Research" },
          { id: "b2", type: "paragraph", content: "Comprehensive research for the \"10 AI tools\" video. Testing each tool for content creation workflows." },
          { id: "b3", type: "h2", content: "Script Writing" },
          { id: "b4", type: "bullet", content: "Claude — best for long-form, nuanced content" },
          { id: "b5", type: "bullet", content: "ChatGPT — fastest iteration, good hooks" },
          { id: "b6", type: "bullet", content: "Gemini — research synthesis" },
          { id: "b7", type: "h2", content: "Video Production" },
          { id: "b8", type: "bullet", content: "Runway ML — B-roll generation" },
          { id: "b9", type: "bullet", content: "ElevenLabs — voiceover" },
          { id: "b10", type: "bullet", content: "Descript — editing" },
          { id: "b11", type: "todo", content: "Record demo of each tool", checked: false },
          { id: "b12", type: "todo", content: "Calculate time saved per week", checked: false },
          { id: "b13", type: "todo", content: "Price comparison table", checked: true },
        ],
        tags: ["ai", "tools", "research"],
        links: ["n1"],
        backlinks: ["n2"],
        pinned: false,
        createdAt: "2024-03-10",
        updatedAt: "2024-03-17",
      },
    ],
    events: [
      { id: "e1", title: "5 Morning Habits (TikTok)", date: "2024-03-20", status: "posted", platform: "TikTok", priority: "high", scheduledTime: "19:00" },
      { id: "e2", title: "AI Tools Digest #48", date: "2024-03-21", status: "scheduled", platform: "Telegram", priority: "medium", scheduledTime: "18:00" },
      { id: "e3", title: "Minimal Setup Tour", date: "2024-03-22", status: "in-progress", platform: "Instagram", priority: "medium", scheduledTime: "20:30" },
      { id: "e4", title: "ChatGPT Prompt Video", date: "2024-03-25", status: "idea", platform: "TikTok", priority: "high", scheduledTime: "19:00" },
      { id: "e5", title: "10 AI Tools YouTube", date: "2024-03-27", status: "idea", platform: "YouTube", priority: "high", scheduledTime: "12:00" },
      { id: "e6", title: "Day in my life Reel", date: "2024-03-28", status: "in-progress", platform: "Instagram", priority: "high", scheduledTime: "20:00" },
      { id: "e7", title: "Weekly Growth Update", date: "2024-04-01", status: "idea", platform: "Telegram", priority: "low", scheduledTime: "17:00" },
      { id: "e8", title: "Hook Formula Test Results", date: "2024-04-03", status: "idea", platform: "TikTok", priority: "medium", scheduledTime: "19:30" },
      { id: "e9", title: "Notion Template Tour", date: "2024-04-05", status: "idea", platform: "YouTube", priority: "low", scheduledTime: "12:00" },
      { id: "e10", title: "Creator Income Breakdown", date: "2024-04-08", status: "idea", platform: "YouTube", priority: "high", scheduledTime: "15:00" },
    ],
    notifications: [
      { id: "notif1", type: "ai", title: "AI Insight Ready", body: "Your tutorial content is outperforming vlogs by 3.4×. Time to double down.", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), action: "/analytics" },
      { id: "notif2", type: "warning", title: "Missed Posting Window", body: "You missed the 7–9 PM TikTok window yesterday. Schedule a post for tonight.", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), action: "/calendar" },
      { id: "notif3", type: "success", title: "Viral Post Detected!", body: "\"5 Morning Habits\" reached 2.8M views — your best performance this month.", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), action: "/analytics" },
      { id: "notif4", type: "info", title: "Trend Alert: #AItools", body: "#AItools is trending +340% this week. You have 3 ideas ready for this niche.", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), action: "/trends" },
      { id: "notif5", type: "info", title: "Weekly Report Ready", body: "Your content health improved 8 points this week. View the full breakdown.", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), action: "/" },
    ],
    trends: [
      { id: "t1", hashtag: "#AItools", platform: "TikTok", growth: 340, volume: 2840000, relevance: 96, category: "Technology", firstSeen: "2024-03-10", status: "rising" },
      { id: "t2", hashtag: "#ProductivityHacks", platform: "Instagram", growth: 124, volume: 1240000, relevance: 89, category: "Productivity", firstSeen: "2024-03-05", status: "peak" },
      { id: "t3", hashtag: "#CreatorEconomy", platform: "YouTube", growth: 87, volume: 890000, relevance: 92, category: "Business", firstSeen: "2024-03-12", status: "rising" },
      { id: "t4", hashtag: "#ChatGPT", platform: "TikTok", growth: 215, volume: 4200000, relevance: 94, category: "Technology", firstSeen: "2024-02-20", status: "stable" },
      { id: "t5", hashtag: "#NoCode", platform: "Instagram", growth: 68, volume: 540000, relevance: 74, category: "Technology", firstSeen: "2024-03-08", status: "rising" },
      { id: "t6", hashtag: "#MorningRoutine", platform: "TikTok", growth: 45, volume: 3100000, relevance: 71, category: "Lifestyle", firstSeen: "2024-01-01", status: "stable" },
      { id: "t7", hashtag: "#PersonalFinance", platform: "YouTube", growth: 132, volume: 1870000, relevance: 68, category: "Finance", firstSeen: "2024-03-01", status: "rising" },
      { id: "t8", hashtag: "#ContentCreator", platform: "Instagram", growth: 28, volume: 5600000, relevance: 87, category: "Business", firstSeen: "2023-01-01", status: "stable" },
      { id: "t9", hashtag: "#Automation", platform: "Telegram", growth: 178, volume: 320000, relevance: 91, category: "Technology", firstSeen: "2024-03-14", status: "rising" },
      { id: "t10", hashtag: "#SideHustle", platform: "TikTok", growth: 95, volume: 2100000, relevance: 79, category: "Business", firstSeen: "2024-02-01", status: "falling" },
    ],
  };
}
