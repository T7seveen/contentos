"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e?: React.FormEvent, demoMode = false) => {
    e?.preventDefault();
    setLoading(true); setError("");
    const body = demoMode ? { email: "demo@contentos.ai", password: "demo1234" } : { email, password };
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Ошибка входа"); setLoading(false); return; }
      router.push("/dashboard");
    } catch { setError("Ошибка сети"); setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={20} color="white" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>ContentOS</span>
          </Link>
          <div style={{ marginTop: 24, fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>Добро пожаловать</div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>Войдите в свой аккаунт</div>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Пароль</label>
              <div style={{ position: "relative" }}>
                <input className="input" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: "100%", paddingRight: 42 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div style={{ textAlign: "right", marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: "var(--accent)", cursor: "pointer" }}>Забыли пароль?</span>
            </div>
            {error && <div style={{ background: "var(--danger-light, #fef2f2)", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14 }}>
              {loading ? "Входим..." : "Войти"} {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>или</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <button onClick={() => submit(undefined, true)} disabled={loading} style={{ width: "100%", padding: "11px 0", border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Sparkles size={14} color="var(--accent)" /> Войти как демо-пользователь
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          Нет аккаунта?{" "}
          <Link href="/register" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}
