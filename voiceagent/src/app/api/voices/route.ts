import { NextResponse } from "next/server";
import { VOICE_CATALOG } from "@/lib/voice-catalog";

export async function GET() {
  return NextResponse.json({
    voices: VOICE_CATALOG.map((v) => ({
      id: v.id,
      provider: v.provider,
      name: v.name,
      gender: v.gender,
      accent: v.accent,
      language: v.language,
      description: v.description,
    })),
  });
}
