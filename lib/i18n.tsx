"use client";
import { createContext, useContext, useState, useEffect } from "react";

export type Lang = "ru" | "en";

const T = {
  ru: {
    // Nav
    "nav.dashboard": "Дашборд", "nav.analytics": "Аналитика", "nav.ideas": "Идеи",
    "nav.calendar": "Календарь", "nav.notes": "Заметки", "nav.trends": "Тренды",
    "nav.assistant": "AI Ассистент", "nav.settings": "Настройки",
    "nav.content_health": "Здоровье контента", "nav.good": "Хорошо",
    "nav.improvements": "зон улучшений",
    // Auth
    "auth.login": "Войти", "auth.register": "Зарегистрироваться", "auth.logout": "Выйти",
    "auth.email": "Email", "auth.password": "Пароль", "auth.name": "Имя",
    "auth.confirm_password": "Подтвердите пароль", "auth.forgot": "Забыли пароль?",
    "auth.no_account": "Нет аккаунта?", "auth.has_account": "Уже есть аккаунт?",
    "auth.sign_up": "Создать аккаунт", "auth.sign_in": "Войти в аккаунт",
    "auth.demo": "Войти как демо-пользователь",
    // Landing
    "land.hero_title": "Ваш AI-стратег по контенту", "land.hero_sub": "Аналитика соцсетей, генерация идей и контент-планирование в одной платформе. Рост × 10 с помощью искусственного интеллекта.",
    "land.start_free": "Начать бесплатно", "land.see_demo": "Смотреть демо",
    "land.trusted": "Доверяют более 12 000 создателей контента",
    "land.feat1_title": "Аналитика в реальном времени", "land.feat1_desc": "Подключите TikTok, Instagram, YouTube и Telegram. Получайте детальную аналитику и инсайты в одном месте.",
    "land.feat2_title": "AI Стратег", "land.feat2_desc": "Ваш персональный AI анализирует данные и говорит точно, что публиковать, когда и в каком формате.",
    "land.feat3_title": "Банк идей", "land.feat3_desc": "Сохраняйте идеи, AI оценивает их по трендам, конкурентам и болям аудитории. Только высококонверсионный контент.",
    "land.feat4_title": "Контент-календарь", "land.feat4_desc": "Автоматический контент-план с AI приоритизацией. Drag & drop планирование.",
    "land.feat5_title": "Notion-редактор", "land.feat5_desc": "Блочный редактор для стратегий, сценариев и заметок. Граф связей в стиле Obsidian.",
    "land.feat6_title": "Тренд-вотчинг", "land.feat6_desc": "Мониторинг трендов по всем платформам. Узнавайте о вирусных форматах первыми.",
    // Pricing
    "price.title": "Прозрачные тарифы", "price.sub": "Начните бесплатно, масштабируйтесь по мере роста",
    "price.monthly": "В месяц", "price.yearly": "В год (−20%)",
    "price.free": "Бесплатно", "price.pro": "Pro", "price.business": "Бизнес",
    "price.current": "Текущий план", "price.start": "Начать", "price.upgrade": "Перейти",
    "price.contact": "Связаться",
    // Settings
    "set.title": "Настройки", "set.profile": "Профиль", "set.billing": "Billing",
    "set.accounts": "Аккаунты", "set.notifications": "Уведомления", "set.security": "Безопасность",
    "set.save": "Сохранить", "set.saved": "Сохранено ✓",
    // Calendar
    "cal.add": "Добавить пост", "cal.auto_plan": "AI Auto-план",
    "cal.best_times": "Лучшее время постинга", "cal.weekly_target": "Цель на неделю",
    // Common
    "common.save": "Сохранить", "common.cancel": "Отмена", "common.delete": "Удалить",
    "common.search": "Поиск", "common.add": "Добавить", "common.close": "Закрыть",
    "common.loading": "Загрузка...", "common.success": "Успешно!", "common.error": "Ошибка",
    "common.demo_mode": "Демо-режим", "common.light": "Светлая", "common.dark": "Тёмная",
  },
  en: {
    // Nav
    "nav.dashboard": "Dashboard", "nav.analytics": "Analytics", "nav.ideas": "Ideas",
    "nav.calendar": "Calendar", "nav.notes": "Notes", "nav.trends": "Trends",
    "nav.assistant": "AI Assistant", "nav.settings": "Settings",
    "nav.content_health": "Content Health", "nav.good": "Good",
    "nav.improvements": "improvements",
    // Auth
    "auth.login": "Login", "auth.register": "Register", "auth.logout": "Logout",
    "auth.email": "Email", "auth.password": "Password", "auth.name": "Full Name",
    "auth.confirm_password": "Confirm Password", "auth.forgot": "Forgot password?",
    "auth.no_account": "Don't have an account?", "auth.has_account": "Already have an account?",
    "auth.sign_up": "Create account", "auth.sign_in": "Sign in",
    "auth.demo": "Try demo account",
    // Landing
    "land.hero_title": "Your AI Content Strategist", "land.hero_sub": "Social media analytics, AI content ideas and smart planning — all in one platform. 10× growth powered by AI.",
    "land.start_free": "Start for Free", "land.see_demo": "Watch Demo",
    "land.trusted": "Trusted by 12,000+ content creators",
    "land.feat1_title": "Real-time Analytics", "land.feat1_desc": "Connect TikTok, Instagram, YouTube & Telegram. Get deep analytics and insights in one place.",
    "land.feat2_title": "AI Strategist", "land.feat2_desc": "Your personal AI analyzes your data and tells you exactly what to post, when, and in what format.",
    "land.feat3_title": "Idea Bank", "land.feat3_desc": "Save ideas, AI scores them by trends, competitors & audience pain points. Only high-converting content.",
    "land.feat4_title": "Content Calendar", "land.feat4_desc": "Automatic AI-prioritized content plan. Drag & drop scheduling.",
    "land.feat5_title": "Notion Editor", "land.feat5_desc": "Block editor for strategies, scripts & notes. Obsidian-style knowledge graph.",
    "land.feat6_title": "Trend Watching", "land.feat6_desc": "Monitor trends across all platforms. Be first to know about viral formats.",
    // Pricing
    "price.title": "Simple, transparent pricing", "price.sub": "Start free, scale as you grow",
    "price.monthly": "per month", "price.yearly": "per year (−20%)",
    "price.free": "Free", "price.pro": "Pro", "price.business": "Business",
    "price.current": "Current plan", "price.start": "Get started", "price.upgrade": "Upgrade",
    "price.contact": "Contact us",
    // Settings
    "set.title": "Settings", "set.profile": "Profile", "set.billing": "Billing",
    "set.accounts": "Accounts", "set.notifications": "Notifications", "set.security": "Security",
    "set.save": "Save", "set.saved": "Saved ✓",
    // Calendar
    "cal.add": "Add Post", "cal.auto_plan": "AI Auto-plan",
    "cal.best_times": "Best posting times", "cal.weekly_target": "Weekly target",
    // Common
    "common.save": "Save", "common.cancel": "Cancel", "common.delete": "Delete",
    "common.search": "Search", "common.add": "Add", "common.close": "Close",
    "common.loading": "Loading...", "common.success": "Success!", "common.error": "Error",
    "common.demo_mode": "Demo Mode", "common.light": "Light", "common.dark": "Dark",
  },
} as const;

type Key = keyof typeof T.ru;

interface I18nCtx { lang: Lang; t: (k: Key) => string; setLang: (l: Lang) => void; }
const I18nContext = createContext<I18nCtx>({ lang: "en", t: (k) => k, setLang: () => {} });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    const saved = (localStorage.getItem("lang") as Lang) ?? "ru";
    setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (k: Key): string => (T[lang] as Record<string, string>)[k] ?? (T.en as Record<string, string>)[k] ?? k;

  return <I18nContext.Provider value={{ lang, t, setLang }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
