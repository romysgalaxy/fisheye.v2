import { getPhotographer, getAllMediasForPhotographer } from "@/app/lib/prisma-db";
import type { Photographer, Media } from "@prisma/client";
import PhotographerHeader from "@/app/components/PhotographerHeader";
import Header from "@/app/components/Header";
import Gallery from "@/app/components/Gallery";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PhotographerPage({ params }: Props) {

  const { id } = await params;
  const photographerId = Number(id);

  const photographer: Photographer | null = await getPhotographer(photographerId);
  const medias: Media[] = await getAllMediasForPhotographer(photographerId);

  if (!photographer) {
    return <p>Photographe introuvable…</p>;
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
