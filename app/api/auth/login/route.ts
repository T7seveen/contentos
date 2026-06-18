import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readDB } from "@/lib/db";
import { createToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const db = readDB();
    if (!db.users) db.users = [];

    // Demo user
    if (email === "demo@contentos.ai" && password === "demo1234") {
      const token = await createToken({ userId: "demo", email, name: "Demo User", plan: "pro" });
      await setSessionCookie(token);
      return NextResponse.json({ user: { id: "demo", name: "Demo User", email, plan: "pro" } });
    }

    const user = db.users.find((u) => u.email === email);
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = await createToken({ userId: user.id, email: user.email, name: user.name, plan: user.plan });
    await setSessionCookie(token);

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
