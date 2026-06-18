import { NextResponse } from "next/server";
import { getTrends } from "@/lib/db";

export async function GET() {
  return NextResponse.json(getTrends());
}
