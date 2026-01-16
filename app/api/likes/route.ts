import { NextResponse } from "next/server";
import { incrementLike, decrementLike } from "@/app/lib/prisma-db";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { mediaId?: number; action?: "like" | "unlike" };

    if (typeof body.mediaId !== "number") {
      return NextResponse.json({ error: "mediaId manquant" }, { status: 400 });
    }

    const action = body.action || "like";
    const updated = action === "like"
      ? await incrementLike(body.mediaId)
      : await decrementLike(body.mediaId);

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Erreur API /api/likes:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}