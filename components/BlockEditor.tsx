"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Block } from "@/lib/types";
import {
  Type, Hash, List, ListOrdered, CheckSquare, Code2, Minus,
  AlertCircle, Quote, GripVertical, Plus, ChevronDown,
} from "lucide-react";

const BLOCK_TYPES = [
  { type: "paragraph", label: "Текст", icon: Type, desc: "Обычный абзац" },
  { type: "h1", label: "Заголовок 1", icon: Hash, desc: "Большой заголовок" },
  { type: "h2", label: "Заголовок 2", icon: Hash, desc: "Средний заголовок" },
  { type: "h3", label: "Заголовок 3", icon: Hash, desc: "Малый заголовок" },
  { type: "bullet", label: "Маркированный список", icon: List, desc: "Пункты" },
  { type: "numbered", label: "Нумерованный список", icon: ListOrdered, desc: "Нумерованные пункты" },
  { type: "todo", label: "Задача", icon: CheckSquare, desc: "Чекбокс" },
  { type: "quote", label: "Цитата", icon: Quote, desc: "Выделенная цитата" },
  { type: "code", label: "Код", icon: Code2, desc: "Блок кода" },
  { type: "callout", label: "Каллаут", icon: AlertCircle, desc: "Выделенный блок" },
  { type: "divider", label: "Разделитель", icon: Minus, desc: "Горизонтальная линия" },
] as const;

function renderBlockContent(block: Block): React.CSSProperties {
  switch (block.type) {
    case "h1": return { fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1.2 };
    case "h2": return { fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)", lineHeight: 1.3 };
    case "h3": return { fontSize: 16, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.4 };
    case "code": return { fontFamily: "monospace", fontSize: 13, background: "var(--bg-tertiary)", color: "var(--accent)", padding: "2px 6px", borderRadius: 4 };
    default: return { fontSize: 14, color: "var(--text-primary)", lineHeight: 1.8 };
  }
}

interface SlashMenuProps {
  onSelect: (type: Block["type"]) => void;
  onClose: () => void;
  pos: { top: number; left: number };
  query: string;
}

function SlashMenu({ onSelect, onClose, pos, query }: SlashMenuProps) {
  const filtered = BLOCK_TYPES.filter(
    (t) =>
      t.label.toLowerCase().includes(query.toLowerCase()) ||
      t.type.includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (filtered.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: pos.top + 24,
        left: pos.left,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        zIndex: 9999,
        minWidth: 220,
        overflow: "hidden",
        padding: 4,
      }}
    >
      {filtered.map((t) => (
        <button
          key={t.type}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(t.type as Block["type"]);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "8px 10px",
            background: "none",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            textAlign: "left",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <t.icon size={13} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{t.label}</div>
            <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{t.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

interface BlockRowProps {
  block: Block;
  index: number;
  onChange: (id: string, field: Partial<Block>) => void;
  onEnter: (id: string) => void;
  onBackspace: (id: string) => void;
  onFocus: (id: string) => void;
  focused: boolean;
  showSlash: boolean;
  slashQuery: string;
  onSlashSelect: (id: string, type: Block["type"]) => void;
  onSlashClose: () => void;
}

function BlockRow({ block, index, onChange, onEnter, onBackspace, onFocus, focused, showSlash, slashQuery, onSlashSelect, onSlashClose }: BlockRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (focused && inputRef.current) {
      const el = inputRef.current;
      el.focus();
      if ("setSelectionRange" in el) {
        const len = el.value?.length ?? 0;
        el.setSelectionRange(len, len);
      }
    }
  }, [focused]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && block.type !== "code") {
      e.preventDefault();
      onEnter(block.id);
    }
    if (e.key === "Backspace" && (e.currentTarget.value === "" || e.currentTarget.value === "/")) {
      onBackspace(block.id);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const val = e.target.value;
    onChange(block.id, { content: val });

    if (val.startsWith("/") && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setSlashPos({ top: rect.top, left: rect.left });
    }
  };

  const prefix = () => {
    switch (block.type) {
      case "bullet": return <span style={{ color: "var(--accent)", marginRight: 8, fontSize: 18, lineHeight: 1, flexShrink: 0 }}>•</span>;
      case "numbered": return <span style={{ color: "var(--accent)", marginRight: 8, fontWeight: 700, flexShrink: 0 }}>{index + 1}.</span>;
      case "todo":
        return (
          <input
            type="checkbox"
            checked={!!block.checked}
            onChange={(e) => onChange(block.id, { checked: e.target.checked })}
            style={{ marginRight: 8, accentColor: "var(--accent)", width: 14, height: 14, flexShrink: 0, cursor: "pointer" }}
          />
        );
      case "quote": return <div style={{ width: 3, background: "var(--accent)", borderRadius: 2, marginRight: 12, alignSelf: "stretch", flexShrink: 0 }} />;
      case "callout": return <span style={{ fontSize: 18, marginRight: 10, flexShrink: 0 }}>💡</span>;
      default: return null;
    }
  };

  if (block.type === "divider") {
    return (
      <div
        style={{ padding: "8px 0", position: "relative" }}
        onMouseEnter={() => onFocus(block.id)}
        ref={ref}
      >
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />
      </div>
    );
  }

  if (block.type === "code") {
    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "6px 12px", background: "var(--bg-tertiary)", fontSize: 10, color: "var(--text-tertiary)", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>
          {block.language ?? "text"}
        </div>
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={block.content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => onFocus(block.id)}
          placeholder="// Write code..."
          rows={Math.max(3, block.content.split("\n").length)}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            background: "none",
            border: "none",
            outline: "none",
            fontFamily: "monospace",
            fontSize: 13,
            color: "var(--accent)",
            lineHeight: 1.6,
            resize: "none",
          }}
        />
      </div>
    );
  }

  const wrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: block.type === "quote" ? "stretch" : "flex-start",
    padding: block.type === "callout" ? "10px 14px" : "2px 0",
    background: block.type === "callout" ? "var(--accent-light)" : "transparent",
    borderRadius: block.type === "callout" ? 10 : 0,
    border: block.type === "callout" ? "1px solid var(--accent)" : "none",
    marginTop: ["h1","h2","h3"].includes(block.type) ? 8 : 0,
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={wrapStyle}>
        {prefix()}
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={block.content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => onFocus(block.id)}
          placeholder={focused ? (block.content === "/" ? "" : block.type === "paragraph" ? "Напишите что-нибудь или нажмите '/' для команд..." : "...") : ""}
          rows={1}
          style={{
            ...renderBlockContent(block),
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            resize: "none",
            width: "100%",
            fontFamily: "inherit",
            overflow: "hidden",
            lineHeight: renderBlockContent(block).lineHeight as string,
          }}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = "auto";
            t.style.height = t.scrollHeight + "px";
          }}
        />
      </div>
      {showSlash && focused && (
        <SlashMenu
          query={slashQuery}
          pos={slashPos}
          onSelect={(type) => onSlashSelect(block.id, type)}
          onClose={onSlashClose}
        />
      )}
    </div>
  );
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [focusedId, setFocusedId] = useState<string | null>(blocks[0]?.id ?? null);
  const [slashBlockId, setSlashBlockId] = useState<string | null>(null);
  const [slashQuery, setSlashQuery] = useState("");

  const newBlock = (afterId?: string, type: Block["type"] = "paragraph"): Block => ({
    id: Math.random().toString(36).slice(2),
    type,
    content: "",
  });

  const handleChange = useCallback((id: string, field: Partial<Block>) => {
    const next = blocks.map((b) => (b.id === id ? { ...b, ...field } : b));
    onChange(next);

    // Slash menu logic
    const content = field.content ?? "";
    if (typeof content === "string" && content.startsWith("/")) {
      setSlashBlockId(id);
      setSlashQuery(content.slice(1));
    } else {
      setSlashBlockId(null);
    }
  }, [blocks, onChange]);

  const handleEnter = useCallback((id: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    const cur = blocks[idx];
    // Inherit list types
    let newType: Block["type"] = "paragraph";
    if (["bullet", "numbered", "todo"].includes(cur.type)) newType = cur.type as Block["type"];

    const nb = newBlock(id, newType);
    const next = [...blocks];
    next.splice(idx + 1, 0, nb);
    onChange(next);
    setFocusedId(nb.id);
  }, [blocks, onChange]);

  const handleBackspace = useCallback((id: string) => {
    if (blocks.length <= 1) return;
    const idx = blocks.findIndex((b) => b.id === id);
    const prev = blocks[idx - 1];
    const next = blocks.filter((b) => b.id !== id);
    onChange(next);
    if (prev) setFocusedId(prev.id);
  }, [blocks, onChange]);

  const handleSlashSelect = useCallback((id: string, type: Block["type"]) => {
    const next = blocks.map((b) => (b.id === id ? { ...b, type, content: "" } : b));
    onChange(next);
    setSlashBlockId(null);
    setFocusedId(id);
  }, [blocks, onChange]);

  const addBlock = () => {
    const nb = newBlock();
    onChange([...blocks, nb]);
    setFocusedId(nb.id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {blocks.map((block, i) => (
        <div key={block.id} style={{ display: "flex", alignItems: "flex-start", gap: 4, group: "true" } as React.CSSProperties}>
          <div
            style={{
              width: 18,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: focusedId === block.id ? 0.4 : 0,
              transition: "opacity 0.15s",
              cursor: "grab",
              flexShrink: 0,
              marginTop: 2,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.5")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = focusedId === block.id ? "0.4" : "0")}
          >
            <GripVertical size={12} color="var(--text-tertiary)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <BlockRow
              block={block}
              index={i}
              onChange={handleChange}
              onEnter={handleEnter}
              onBackspace={handleBackspace}
              onFocus={setFocusedId}
              focused={focusedId === block.id}
              showSlash={slashBlockId === block.id}
              slashQuery={slashQuery}
              onSlashSelect={handleSlashSelect}
              onSlashClose={() => setSlashBlockId(null)}
            />
          </div>
        </div>
      ))}
      <button
        onClick={addBlock}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 22px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-tertiary)",
          fontSize: 12,
          marginTop: 4,
          borderRadius: 8,
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-secondary)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
      >
        <Plus size={13} /> Добавить блок
      </button>
    </div>
  );
}
