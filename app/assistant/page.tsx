"use client";

import { useState, useRef, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Send, Sparkles, BarChart3, Lightbulb, TrendingUp, RefreshCw, Copy, ThumbsUp, Bot, Zap, Brain } from "lucide-react";
import { useToast } from "@/components/ToastContext";

type Role = "user" | "assistant";
type Message = { role: Role; content: string; timestamp: Date };

const QUICK_PROMPTS = [
  { icon: "📉", label: "Почему падают просмотры?" },
  { icon: "💡", label: "Дай 10 вирусных идей в моей нише" },
  { icon: "📅", label: "Составь план контента на неделю" },
  { icon: "🔍", label: "Проанализируй главного конкурента" },
  { icon: "✍️", label: "Напиши TikTok-хук для следующего видео" },
  { icon: "📈", label: "На каком формате контента сосредоточиться?" },
];

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content: `Привет! Я ваш AI-стратег по контенту. У меня есть полный доступ к вашей аналитике, топовым постам, конкурентам и контент-календарю.

**Что я умею:**
- Анализировать причины падения просмотров
- Генерировать вирусные идеи под вашу нишу
- Строить контент-план на неделю/месяц
- Выявлять тренды и паттерны в ваших данных

Задайте любой вопрос о вашем контенте! 🚀`,
    timestamp: new Date(Date.now() - 60000),
  },
];

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <div style={{ fontSize: 14, lineHeight: 1.75 }}>
      {content.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 6 }} />;
        const rendered = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        return <div key={i}>{rendered}</div>;
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 14px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "16px 16px 16px 4px", width: "fit-content" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 6, height: 6, borderRadius: "50%", background: "var(--accent)",
            animation: `pulse 1.4s ease-in-out ${i * 0.22}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function Assistant() {
  const { success } = useToast();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", content: data.response, timestamp: new Date() }]);
    } catch {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "Произошла ошибка. Попробуйте ещё раз.", timestamp: new Date() }]);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    success("Скопировано в буфер");
  };

  return (
    <AppShell>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-card)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brain size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>ContentOS AI</div>
              <div style={{ fontSize: 11, color: "var(--success)", display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
                Онлайн · Доступ к вашим данным
              </div>
            </div>
          </div>
          <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setMessages(INITIAL_MESSAGES)}>
            <RefreshCw size={12} /> Новый чат
          </button>
        </div>

        {/* Context chips */}
        <div style={{ padding: "8px 24px", background: "var(--accent-light)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
          <Sparkles size={12} color="var(--accent)" />
          <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>AI имеет доступ к:</span>
          {[
            { icon: BarChart3, label: "Аналитика" },
            { icon: Lightbulb, label: "Идеи" },
            { icon: TrendingUp, label: "Тренды" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="badge badge-accent" style={{ fontSize: 10 }}>
              <Icon size={9} /> {label}
            </span>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          {/* Chat */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.map((msg, i) => (
                <div key={i} className="animate-fade-up" style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 4 }}>
                  {msg.role === "assistant" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 7, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Zap size={11} color="white" />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)" }}>ContentOS AI</span>
                    </div>
                  )}
                  <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                    {msg.role === "assistant" ? <MessageContent content={msg.content} /> : <span>{msg.content}</span>}
                  </div>
                  {msg.role === "assistant" && (
                    <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
                      <button className="btn-icon" style={{ padding: 4 }} onClick={() => copyMessage(msg.content)}>
                        <Copy size={11} />
                      </button>
                      <button className="btn-icon" style={{ padding: 4 }}>
                        <ThumbsUp size={11} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 7, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Zap size={11} color="white" />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Анализирую ваши данные...</span>
                  </div>
                  <TypingIndicator />
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "12px 24px 18px", borderTop: "1px solid var(--border)", background: "var(--bg-card)", flexShrink: 0 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                {QUICK_PROMPTS.slice(0, 4).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q.label)}
                    style={{
                      padding: "5px 10px", borderRadius: 8, border: "1px solid var(--border)",
                      background: "var(--bg-secondary)", color: "var(--text-secondary)",
                      fontSize: 11, fontWeight: 500, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-secondary)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    <span>{q.icon}</span> {q.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 14, padding: "10px 14px" }}>
                <textarea
                  style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 14, lineHeight: 1.5, resize: "none", minHeight: 22, maxHeight: 120, fontFamily: "inherit" }}
                  placeholder="Задайте вопрос о вашем контенте, аналитике или стратегии..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  rows={1}
                  onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || typing}
                  style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: input.trim() && !typing ? "var(--accent)" : "var(--bg-tertiary)",
                    border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: input.trim() && !typing ? "pointer" : "not-allowed", transition: "all 0.2s", flexShrink: 0,
                  }}
                >
                  <Send size={14} color={input.trim() && !typing ? "white" : "var(--text-tertiary)"} />
                </button>
              </div>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 5, textAlign: "center" }}>
                Enter — отправить · Shift+Enter — новая строка
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ width: 240, borderLeft: "1px solid var(--border)", overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14, background: "var(--bg-card)" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Быстрые действия</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {QUICK_PROMPTS.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q.label)} style={{
                    padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)",
                    background: "var(--bg-secondary)", color: "var(--text-secondary)",
                    fontSize: 11, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 6, fontWeight: 500, transition: "all 0.15s", width: "100%",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-secondary)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    <span>{q.icon}</span> {q.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Контекст данных</div>
              {[
                { label: "Постов проанализировано", value: "1,204" },
                { label: "Конкурентов отслеживается", value: "3" },
                { label: "Трендов мониторится", value: "47" },
                { label: "Обновлено", value: "2 мин. назад" },
              ].map((d) => (
                <div key={d.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                  <span style={{ color: "var(--text-tertiary)" }}>{d.label}</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
