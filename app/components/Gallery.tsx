"use client";

import { useCallback, useMemo, useState } from "react";
import type { Media } from "@prisma/client";
import MediaCard from "./MediaCard";
import Lightbox from "./LightBox";
import LikesBar from "./LikesBar";

type GalleryProps = {
  medias: Media[];
  photographerPricePerDay: number; // pour l’encart bas (voir maquette)
};

export default function Gallery({ medias, photographerPricePerDay }: GalleryProps) {
  const [items, setItems] = useState<Media[]>(medias);

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const totalLikes = useMemo(
    () => items.reduce((sum, m) => sum + (m.likes ?? 0), 0),
    [items]
  );

  const openAtIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setCurrentIndex(null);
  }, []);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === null ? prev : (prev - 1 + items.length) % items.length
    );
  }, [items.length]);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === null ? prev : (prev + 1) % items.length
    );
  }, [items.length]);

  const likeMedia = useCallback(async (mediaId: number) => {
    // ✅ optimistic UI
    setItems((prev) =>
      prev.map((m) => (m.id === mediaId ? { ...m, likes: m.likes + 1 } : m))
    );

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId }),
      });

      if (!res.ok) throw new Error("Like failed");

      const updated = (await res.json()) as { id: number; likes: number };

      // ✅ resync (au cas où)
      setItems((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, likes: updated.likes } : m))
      );
    } catch {
      // rollback si erreur
      setItems((prev) =>
        prev.map((m) => (m.id === mediaId ? { ...m, likes: m.likes - 1 } : m))
      );
    }
  }, []);

  return (
    <>
      <section className="gallery-grid" aria-label="Galerie des travaux">
        {items.map((media, index) => (
          <MediaCard
            key={media.id}
            media={media}
            onOpen={() => openAtIndex(index)}
            onLike={() => likeMedia(media.id)}
          />
        ))}
      </section>

      <LikesBar totalLikes={totalLikes} pricePerDay={photographerPricePerDay} />

      {currentIndex !== null && (
        <Lightbox
          isOpen={isOpen}
          media={items[currentIndex]}
          onClose={close}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </>
  );
}
