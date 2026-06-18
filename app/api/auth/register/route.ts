import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readDB, writeDB } from "@/lib/db";
import { createToken, setSessionCookie } from "@/lib/auth";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const db = readDB();
    if (!db.users) db.users = [];

    const existing = db.users.find((u) => u.email === email);
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const hash = await bcrypt.hash(password, 10);
    const user = { id: uuid(), name, email, passwordHash: hash, plan: "free" as const, createdAt: new Date().toISOString() };
    db.users.push(user);
    writeDB(db);

    const token = await createToken({ userId: user.id, email: user.email, name: user.name, plan: user.plan });
    await setSessionCookie(token);

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
