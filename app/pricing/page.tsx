"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, X } from "lucide-react";
import { useToast } from "@/components/ToastContext";

const PLANS = [
  {
    id: "free", name: "Free", nameRu: "Бесплатно",
    monthly: 0, yearly: 0,
    desc: "Начните бесплатно. Без карты.",
    color: "var(--text-primary)",
    features: [
      "3 подключённых аккаунта", "50 AI-запросов в месяц", "История 7 дней",
      "Базовая аналитика", "5 идей в банке", "Контент-календарь",
    ],
    missing: ["Полная аналитика", "Безлимитный AI", "Тренд-вотчинг", "Notion-редактор", "Поддержка 24/7"],
  },
  {
    id: "pro", name: "Pro", nameRu: "Pro",
    monthly: 1490, yearly: 1192,
    desc: "Для серьёзных создателей контента.",
    color: "#6366f1",
    popular: true,
    features: [
      "Все платформы (без лимита)", "Безлимитный AI стратег", "Полная аналитика и история",
      "Тренд-вотчинг 24/7", "Notion-редактор + граф", "AI контент-план",
      "Экспорт отчётов PDF", "Приоритетная поддержка",
    ],
    missing: ["Командный доступ", "White-label отчёты", "API доступ"],
  },
  {
    id: "business", name: "Business", nameRu: "Бизнес",
    monthly: 4990, yearly: 3992,
    desc: "Для агентств и команд.",
    color: "#8b5cf6",
    features: [
      "Всё из Pro", "До 10 пользователей", "White-label отчёты",
      "API доступ", "Персональный менеджер", "Кастомные интеграции",
      "SLA 99.9%", "Обучение команды",
    ],
    missing: [],
  },
];

interface PaymentModal { plan: typeof PLANS[0]; yearly: boolean; }

export default function PricingPage() {
  const { success } = useToast();
  const [yearly, setYearly] = useState(false);
  const [payModal, setPayModal] = useState<PaymentModal | null>(null);
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paying, setPaying] = useState(false);

  const pay = async () => {
    if (!cardNum || !cardExp || !cardCvv) return;
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPaying(false);
    setPayModal(null);
    success(`🎉 Оплата прошла успешно! Добро пожаловать в ${payModal?.plan.name}!`);
    setCardNum(""); setCardExp(""); setCardCvv("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Header */}
      <nav style={{ padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: "linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={17} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>ContentOS</span>
        </Link>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500, padding: "8px 16px" }}>Войти</Link>
          <Link href="/register" className="btn-primary" style={{ fontSize: 13, textDecoration: "none" }}>Начать бесплатно</Link>
        </div>
      </nav>

      <div style={{ padding: "60px 32px", maxWidth: 1000, margin: "0 auto" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: 12 }}>Прозрачные тарифы</div>
          <div style={{ fontSize: 17, color: "var(--text-secondary)", marginBottom: 28 }}>Начните бесплатно. Масштабируйтесь по мере роста.</div>
          {/* Toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "var(--bg-secondary)", borderRadius: 12, padding: "4px 6px" }}>
            <button onClick={() => setYearly(false)} style={{ padding: "7px 20px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: !yearly ? "var(--bg-card)" : "transparent", color: !yearly ? "var(--text-primary)" : "var(--text-tertiary)", boxShadow: !yearly ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}>
              В месяц
            </button>
            <button onClick={() => setYearly(true)} style={{ padding: "7px 20px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: yearly ? "var(--bg-card)" : "transparent", color: yearly ? "var(--text-primary)" : "var(--text-tertiary)", boxShadow: yearly ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
              В год <span style={{ fontSize: 10, background: "#dcfce7", color: "#16a34a", padding: "2px 6px", borderRadius: 6, fontWeight: 700 }}>−20%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {PLANS.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly;
            return (
              <div key={plan.id} style={{ background: "var(--bg-card)", border: plan.popular ? `2px solid ${plan.color}` : "1px solid var(--border)", borderRadius: 20, padding: 28, position: "relative", display: "flex", flexDirection: "column" }}>
                {plan.popular && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: plan.color, color: "white", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20 }}>
                    ПОПУЛЯРНЫЙ ВЫБОР
                  </div>
                )}
                <div style={{ fontSize: 16, fontWeight: 700, color: plan.color, marginBottom: 4 }}>{plan.nameRu}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>{plan.desc}</div>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-1px" }}>
                    {price === 0 ? "0₽" : `${price.toLocaleString("ru")}₽`}
                  </span>
                  {price > 0 && <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{yearly ? "/год" : "/мес"}</span>}
                </div>

                <button
                  onClick={() => plan.id !== "free" && setPayModal({ plan, yearly })}
                  style={{
                    width: "100%", padding: "12px 0", borderRadius: 12, border: "none", fontSize: 14, fontWeight: 700,
                    background: plan.popular ? plan.color : "var(--bg-secondary)",
                    color: plan.popular ? "white" : "var(--text-primary)",
                    cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  {plan.id === "free" ? <Link href="/register" style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>Начать бесплатно <ArrowRight size={14} /></Link> : plan.id === "business" ? "Связаться" : <>Перейти на {plan.nameRu} <ArrowRight size={14} /></>}
                </button>

                <div style={{ flex: 1 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "var(--text-secondary)", marginBottom: 9 }}>
                      <Check size={14} color="var(--success)" style={{ flexShrink: 0 }} /> {f}
                    </div>
                  ))}
                  {plan.missing?.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "var(--text-tertiary)", marginBottom: 9, opacity: 0.5 }}>
                      <X size={14} style={{ flexShrink: 0 }} /> {f}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 60, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Вопросы? <a href="mailto:support@contentos.ai" style={{ color: "var(--accent)" }}>support@contentos.ai</a> · Отмена в любой момент · Возврат в течение 14 дней
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {payModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setPayModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg-card)", borderRadius: 20, padding: 32, width: 420, boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>Оплата</div>
              <button onClick={() => setPayModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)" }}><X size={18} /></button>
            </div>

            <div style={{ background: "var(--bg-secondary)", borderRadius: 12, padding: 14, marginBottom: 22, display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{payModal.plan.nameRu} {payModal.yearly ? "(год)" : "(месяц)"}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--accent)" }}>
                {(payModal.yearly ? payModal.plan.yearly : payModal.plan.monthly).toLocaleString("ru")}₽
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Номер карты</label>
              <input className="input" value={cardNum} onChange={(e) => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())} placeholder="1234 5678 9012 3456" style={{ width: "100%" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Срок</label>
                <input className="input" value={cardExp} onChange={(e) => setCardExp(e.target.value)} placeholder="MM/YY" style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>CVV</label>
                <input className="input" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="•••" style={{ width: "100%" }} />
              </div>
            </div>
            <button onClick={pay} disabled={paying || !cardNum || !cardExp || !cardCvv} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "13px 0", fontSize: 14 }}>
              {paying ? "Обрабатываем..." : `Оплатить ${(payModal.yearly ? payModal.plan.yearly : payModal.plan.monthly).toLocaleString("ru")}₽`}
            </button>
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "var(--text-tertiary)" }}>
              🔒 Безопасная оплата · SSL шифрование · Возврат 14 дней
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
