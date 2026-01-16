import { getPhotographer, getAllMediasForPhotographer } from "@/app/lib/prisma-db";
import type { Photographer, Media } from "@prisma/client";
import PhotographerHeader from "@/app/components/PhotographerHeader";
import Header from "@/app/components/Header";
import Gallery from "@/app/components/Gallery";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Page d'un photographe individuel
 * Affiche le header du photographe et sa galerie de médias
 */
export default async function PhotographerPage({ params }: Props) {
  // Récupérer l'ID depuis les paramètres d'URL
  const { id } = await params;
  const photographerId = Number(id);

  // Charger le photographe et ses médias depuis la base de données
  const photographer: Photographer | null = await getPhotographer(photographerId);
  const medias: Media[] = await getAllMediasForPhotographer(photographerId);

  // Si le photographe n'existe pas, afficher la page 404
  if (!photographer) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <PhotographerHeader photographer={photographer} />
        <Gallery medias={medias} photographerPricePerDay={photographer.price} />
      </main>
    </>
  );
}
