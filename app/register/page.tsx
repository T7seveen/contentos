"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Sparkles, ArrowRight, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Пароль должен содержать минимум 6 символов"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Ошибка регистрации"); setLoading(false); return; }
      router.push("/dashboard");
    } catch { setError("Ошибка сети"); setLoading(false); }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["transparent", "#ef4444", "#f59e0b", "#10b981"];
  const strengthLabels = ["", "Слабый", "Средний", "Сильный"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={20} color="white" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>ContentOS</span>
          </Link>
          <div style={{ marginTop: 24, fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>Создать аккаунт</div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>Бесплатно · Без карты</div>
        </div>

        {/* Benefits */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
          {["AI анализ контента и идей", "Контент-календарь с автоплануалем", "Тренд-вотчинг по всем платформам"].map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--success-light, #dcfce7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check size={10} color="var(--success)" />
              </div>
              {b}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={submit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Имя</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" required style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Пароль</label>
              <div style={{ position: "relative" }}>
                <input className="input" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Минимум 6 символов" required style={{ width: "100%", paddingRight: 42 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColors[strength] : "var(--border)", transition: "background 0.3s" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: strengthColors[strength] }}>{strengthLabels[strength]}</div>
                </div>
              )}
            </div>
            {error && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14 }}>
              {loading ? "Создаём аккаунт..." : "Создать аккаунт"} {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          Уже есть аккаунт?{" "}
          <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Войти</Link>
        </div>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "var(--text-tertiary)" }}>
          Регистрируясь, вы принимаете <span style={{ color: "var(--accent)" }}>условия использования</span> и <span style={{ color: "var(--accent)" }}>политику конфиденциальности</span>
        </div>
      </div>
    </div>
  );
}
