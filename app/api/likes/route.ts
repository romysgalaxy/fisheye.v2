import { NextResponse } from "next/server";
import { incrementLike } from "@/app/lib/prisma-db";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { mediaId?: number };

    if (typeof body.mediaId !== "number") {
      return NextResponse.json({ error: "mediaId manquant" }, { status: 400 });
    }

    const updated = await incrementLike(body.mediaId);
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}