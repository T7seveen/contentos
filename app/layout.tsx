import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContentOS — AI Social Media Platform",
  description: "AI-powered social media analytics and content management platform",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
