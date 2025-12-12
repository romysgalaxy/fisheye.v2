"use client";

import { useCallback, useMemo, useState } from "react";
import type { Media } from "@prisma/client";
import MediaCard from "./MediaCard";
import Lightbox from "./LightBox";
import LikesBar from "./LikesBar";
import SortSelect from "./SortSelect";

type SortValue = "popularity" | "date" | "title";

type GalleryProps = {
  medias: Media[];
  photographerPricePerDay: number;
};

export default function Gallery({ medias, photographerPricePerDay }: GalleryProps) {
  const [items, setItems] = useState<Media[]>(medias);

  // ✅ tri sélectionné
  const [sortBy, setSortBy] = useState<SortValue>("popularity");

  // ✅ total likes (sur les items en state)
  const totalLikes = useMemo(
    () => items.reduce((sum, m) => sum + (m.likes ?? 0), 0),
    [items]
  );

  // ✅ tri (copie du tableau, jamais mutate l’original)
  const sortedItems = useMemo(() => {
    const copy = [...items];

    if (sortBy === "popularity") {
      copy.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "date") {
      copy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "title") {
      copy.sort((a, b) => a.title.localeCompare(b.title, "fr", { sensitivity: "base" }));
    }

    return copy;
  }, [items, sortBy]);

  // Lightbox state basé sur l’index de sortedItems
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

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
      prev === null ? prev : (prev - 1 + sortedItems.length) % sortedItems.length
    );
  }, [sortedItems.length]);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === null ? prev : (prev + 1) % sortedItems.length
    );
  }, [sortedItems.length]);

  // ✅ like : on met à jour items (source de vérité)
  const likeMedia = useCallback(async (mediaId: number) => {
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

      setItems((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, likes: updated.likes } : m))
      );
    } catch {
      setItems((prev) =>
        prev.map((m) => (m.id === mediaId ? { ...m, likes: m.likes - 1 } : m))
      );
    }
  }, []);

  return (
    <>
      {/* ✅ Barre de tri */}
      <SortSelect value={sortBy} onChange={setSortBy} />

      <section className="gallery-grid" aria-label="Galerie des travaux">
        {sortedItems.map((media, index) => (
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
          media={sortedItems[currentIndex]}
          onClose={close}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </>
  );
}
