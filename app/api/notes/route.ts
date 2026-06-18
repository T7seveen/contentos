import { NextRequest, NextResponse } from "next/server";
import { getNotes, saveNote, deleteNote } from "@/lib/db";
import { Note } from "@/lib/types";

export async function GET() {
  return NextResponse.json(getNotes());
}

export async function POST(req: NextRequest) {
  const note: Note = await req.json();
  note.updatedAt = new Date().toISOString();
  saveNote(note);
  return NextResponse.json(note);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  deleteNote(id);
  return NextResponse.json({ ok: true });
}
