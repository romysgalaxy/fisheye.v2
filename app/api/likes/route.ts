import { NextResponse } from "next/server";
import { incrementLike, decrementLike } from "@/app/lib/prisma-db";

/**
 * API pour gérer les likes/unlikes des médias
 * POST /api/likes avec { mediaId: number, action: "like" | "unlike" }
 */
export async function POST(request: Request) {
  try {
    // Récupérer les données de la requête
    const body = (await request.json()) as { mediaId?: number; action?: "like" | "unlike" };

    // Vérifier que mediaId est présent
    if (typeof body.mediaId !== "number") {
      return NextResponse.json({ error: "mediaId manquant" }, { status: 400 });
    }

    // Exécuter l'action (like ou unlike)
    const action = body.action || "like";
    const updated = action === "like"
      ? await incrementLike(body.mediaId)
      : await decrementLike(body.mediaId);

    // Retourner le média mis à jour avec le nouveau nombre de likes
    return NextResponse.json(updated);
  } catch (e) {
    console.error("Erreur API /api/likes:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}