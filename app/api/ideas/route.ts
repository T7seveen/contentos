import { NextRequest, NextResponse } from "next/server";
import { getIdeas, saveIdea, deleteIdea } from "@/lib/db";
import { Idea } from "@/lib/types";

export async function GET() {
  try {
    return NextResponse.json(getIdeas());
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch ideas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const idea: Idea = await req.json();
    saveIdea(idea);
    return NextResponse.json(idea);
  } catch (e) {
    return NextResponse.json({ error: "Failed to save idea" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    deleteIdea(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete idea" }, { status: 500 });
  }
}
