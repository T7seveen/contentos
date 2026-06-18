"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Sparkles, BarChart3, Lightbulb, Calendar, FileText, TrendingUp, Bot, ArrowRight, Check, Star, ChevronRight, Zap, Shield, Globe } from "lucide-react";

const FEATURES = [
  { icon: BarChart3, title: "Аналитика в реальном времени", desc: "Подключите TikTok, Instagram, YouTube и Telegram. Получайте детальную аналитику и инсайты в одном месте.", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
  { icon: Bot, title: "AI Стратег", desc: "Ваш персональный AI анализирует данные и говорит точно, что публиковать, когда и в каком формате.", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  { icon: Lightbulb, title: "Банк идей", desc: "Сохраняйте идеи, AI оценивает их по трендам, конкурентам и болям аудитории. Только высококонверсионный контент.", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  { icon: Calendar, title: "Контент-календарь", desc: "Автоматический контент-план с AI приоритизацией. Видите что, когда и куда публиковать.", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  { icon: FileText, title: "Notion-редактор", desc: "Блочный редактор для стратегий, сценариев и заметок. Граф связей в стиле Obsidian.", color: "#ec4899", bg: "rgba(236,72,153,0.1)" },
  { icon: TrendingUp, title: "Тренд-вотчинг", desc: "Мониторинг трендов по всем платформам. Узнавайте о вирусных форматах первыми.", color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
];

const STATS = [
  { value: "12K+", label: "Создателей контента" },
  { value: "4.2M", label: "Постов проанализировано" },
  { value: "340%", label: "Средний рост охвата" },
  { value: "2.8×", label: "Экономия времени" },
];

const TESTIMONIALS = [
  { name: "Анна Коваль", role: "TikTok creator, 1.2M подписчиков", avatar: "А", text: "ContentOS буквально изменил мой подход к контенту. AI говорит что снимать, когда выкладывать — я просто делаю. Охваты выросли в 3 раза за 2 месяца.", rating: 5, color: "#ec4899" },
  { name: "Дмитрий Лобачёв", role: "YouTube, 890K подписчиков", avatar: "Д", text: "Notion-редактор + AI план = золото. Раньше тратил 5 часов в неделю на планирование. Теперь 20 минут. Инструмент must-have для любого крупного канала.", rating: 5, color: "#6366f1" },
  { name: "Marta K.", role: "Instagram, 340K followers", avatar: "M", text: "The trend watching feature alone is worth the subscription. I caught 3 viral trends before my competitors and each video hit 500K+ views.", rating: 5, color: "#10b981" },
];

const PLANS = [
  { name: "Free", price: "0", desc: "Старт без карты", features: ["3 аккаунта", "50 AI запросов/мес", "История 7 дней"], cta: "Начать" },
  { name: "Pro", price: "1 490", desc: "Для серьёзных авторов", features: ["Все платформы", "Безлимитный AI", "Полная аналитика", "Тренд-вотчинг 24/7", "Notion редактор"], cta: "Попробовать Pro", popular: true },
  { name: "Бизнес", price: "4 990", desc: "Для агентств и команд", features: ["Всё из Pro", "Команда до 10 чел.", "White-label", "API доступ", "Персональный менеджер"], cta: "Связаться" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(var(--bg-card-rgb, 255,255,255), 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        transition: "all 0.3s",
        padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: "linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={17} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>ContentOS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["Возможности", "Тарифы", "О нас"].map((item, i) => (
            <a key={item} href={i === 1 ? "/pricing" : "#"} style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500, transition: "color 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
              {item}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/login" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", fontWeight: 600, padding: "8px 18px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--bg-card)", transition: "all 0.15s" }}>Войти</Link>
          <Link href="/register" style={{ fontSize: 13, color: "white", textDecoration: "none", fontWeight: 700, padding: "8px 18px", borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", gap: 6 }}>
            Начать бесплатно <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 130, paddingBottom: 80, textAlign: "center", padding: "140px 40px 80px", position: "relative", overflow: "hidden" }}>
        {/* BG gradient */}
        <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--accent-light)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 30, padding: "6px 14px", fontSize: 12, color: "var(--accent)", fontWeight: 700, marginBottom: 24 }}>
          <Zap size={11} /> Новинка: AI контент-план в один клик
        </div>

        <h1 style={{ fontSize: "clamp(38px, 6vw, 64px)", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-2px", lineHeight: 1.1, marginBottom: 20, maxWidth: 800, margin: "0 auto 20px" }}>
          Ваш AI-стратег<br />
          <span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>по контенту</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 36px" }}>
          Аналитика соцсетей, AI генерация идей и умное планирование — всё в одной платформе. Рост ×10 с помощью искусственного интеллекта.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 50 }}>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 30px rgba(99,102,241,0.35)" }}>
            Начать бесплатно <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12, border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: 15, fontWeight: 600, textDecoration: "none", background: "var(--bg-card)" }}>
            Смотреть демо <ChevronRight size={16} />
          </Link>
        </div>

        <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 60 }}>
          ✓ Без кредитной карты &nbsp;·&nbsp; ✓ Бесплатный план навсегда &nbsp;·&nbsp; ✓ Отмена в любой момент
        </div>

        {/* Dashboard preview mockup */}
        <div style={{ maxWidth: 900, margin: "0 auto", borderRadius: 20, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 40px 100px rgba(0,0,0,0.15)", background: "var(--bg-card)" }}>
          <div style={{ background: "var(--bg-secondary)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border)" }}>
            {["#ef4444","#f59e0b","#10b981"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
            <div style={{ flex: 1, height: 20, background: "var(--bg-tertiary)", borderRadius: 6, maxWidth: 300, margin: "0 auto" }} />
          </div>
          <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[{ label: "Охват", value: "4.2M", delta: "+23%", color: "#6366f1" }, { label: "Подписчики", value: "297K", delta: "+8%", color: "#10b981" }, { label: "Engagement", value: "7.8%", delta: "+1.2%", color: "#f59e0b" }, { label: "AI Score", value: "92/100", delta: "↑ Отлично", color: "#8b5cf6" }].map((s) => (
              <div key={s.label} style={{ background: "var(--bg-secondary)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.delta}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "0 24px 24px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <div style={{ background: "var(--bg-secondary)", borderRadius: 12, padding: 16, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>📊 Engagement Chart</div>
            </div>
            <div style={{ background: "var(--bg-secondary)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 8 }}>AI Insights</div>
              {["Tutorials +3.4×", "Post at 19:00", "#AItools trending"].map((t) => (
                <div key={t} style={{ fontSize: 11, color: "var(--accent)", marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}>
                  <Sparkles size={9} /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "60px 40px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, textAlign: "center" }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-1px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700, marginBottom: 10 }}>ВОЗМОЖНОСТИ</div>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: 14 }}>Всё для роста вашего контента</h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>От аналитики до публикации — полный цикл работы с контентом в одном инструменте.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, padding: 26, transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={20} color={color} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 40px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: 10 }}>Что говорят авторы</h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>Более 12 000 создателей контента уже используют ContentOS</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, padding: 24 }}>
                <div style={{ display: "flex", marginBottom: 12 }}>
                  {[1,2,3,4,5].map((i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 18 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${t.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: t.color }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: 10 }}>Прозрачные тарифы</h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>Начните бесплатно. Масштабируйтесь по мере роста.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PLANS.map((plan) => (
              <div key={plan.name} style={{ background: "var(--bg-card)", border: plan.popular ? "2px solid var(--accent)" : "1px solid var(--border)", borderRadius: 18, padding: 26, position: "relative" }}>
                {plan.popular && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "white", fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 20 }}>ПОПУЛЯРНЫЙ</div>}
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{plan.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>{plan.desc}</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: "var(--text-primary)", marginBottom: 18 }}>{plan.price}₽<span style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 500 }}>/мес</span></div>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>
                    <Check size={12} color="var(--success)" /> {f}
                  </div>
                ))}
                <Link href={plan.popular ? "/register" : "/pricing"} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20,
                  padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none",
                  background: plan.popular ? "var(--accent)" : "var(--bg-secondary)",
                  color: plan.popular ? "white" : "var(--text-primary)",
                }}>
                  {plan.cta} <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12),rgba(236,72,153,0.08))", borderRadius: 28, padding: "56px 40px", border: "1px solid rgba(99,102,241,0.15)" }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: 14 }}>Готовы расти быстрее?</h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 32 }}>Присоединяйтесь к 12 000+ создателям контента, которые уже используют AI для роста.</p>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 32px", borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 30px rgba(99,102,241,0.4)" }}>
            Начать бесплатно <ArrowRight size={16} />
          </Link>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 16 }}>✓ Без карты · ✓ Настройка за 2 минуты · ✓ Отмена в любой момент</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "32px 40px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={13} color="white" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>ContentOS</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>© 2024 ContentOS · AI Social Media Platform</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Политика", "Условия", "Поддержка"].map((l) => (
            <a key={l} href="#" style={{ fontSize: 12, color: "var(--text-tertiary)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
