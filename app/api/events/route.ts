import { NextRequest, NextResponse } from "next/server";
import { getEvents, saveEvent, deleteEvent } from "@/lib/db";
import { CalendarEvent } from "@/lib/types";

export async function GET() {
  return NextResponse.json(getEvents());
}

export async function POST(req: NextRequest) {
  const ev: CalendarEvent = await req.json();
  saveEvent(ev);
  return NextResponse.json(ev);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  deleteEvent(id);
  return NextResponse.json({ ok: true });
}
