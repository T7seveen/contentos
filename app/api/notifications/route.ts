import { NextRequest, NextResponse } from "next/server";
import { getNotifications, addNotification, markNotificationsRead } from "@/lib/db";
import { Notification } from "@/lib/types";

export async function GET() {
  return NextResponse.json(getNotifications());
}

export async function POST(req: NextRequest) {
  const notif: Notification = await req.json();
  addNotification(notif);
  return NextResponse.json(notif);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  markNotificationsRead(body.ids);
  return NextResponse.json({ ok: true });
}
