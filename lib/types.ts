export type Platform = "TikTok" | "Instagram" | "YouTube" | "Telegram";
export type Priority = "high" | "medium" | "low";
export type IdeaStatus = "idea" | "in-progress" | "posted" | "scheduled";
export type NoteStatus = "active" | "archived";
export type NotifType = "success" | "warning" | "info" | "error" | "ai";

export interface Block {
  id: string;
  type: "paragraph" | "h1" | "h2" | "h3" | "bullet" | "numbered" | "todo" | "code" | "divider" | "callout" | "quote";
  content: string;
  checked?: boolean;
  language?: string;
}

export interface Note {
  id: string;
  title: string;
  blocks: Block[];
  tags: string[];
  links: string[]; // linked note ids
  backlinks: string[];
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  icon?: string;
  color?: string;
}

export interface Idea {
  id: string;
  title: string;
  category: string;
  tags: string[];
  priority: Priority;
  status: IdeaStatus;
  platform: Platform[];
  aiScore: number;
  createdAt: string;
  notes: string;
  noteId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  status: IdeaStatus;
  platform: Platform;
  priority: Priority;
  ideaId?: string;
  notes?: string;
  scheduledTime?: string;
}

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  action?: string;
}

export interface TrendItem {
  id: string;
  hashtag: string;
  platform: Platform;
  growth: number;
  volume: number;
  relevance: number;
  category: string;
  firstSeen: string;
  peakDate?: string;
  status: "rising" | "peak" | "falling" | "stable";
}

export interface UserProfile {
  name: string;
  email: string;
  plan: string;
  avatar?: string;
  niche: string;
  goals: string[];
  connectedPlatforms: Platform[];
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  plan: "free" | "pro" | "business";
  createdAt: string;
  avatar?: string;
}

export interface DB {
  user: UserProfile;
  users?: AuthUser[];
  ideas: Idea[];
  notes: Note[];
  events: CalendarEvent[];
  notifications: Notification[];
  trends: TrendItem[];
}
