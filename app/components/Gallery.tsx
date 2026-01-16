"use client";

import { useCallback, useMemo, useState } from "react";
import type { Media } from "@prisma/client";
import MediaCard from "./MediaCard";
import Lightbox from "./LightBox";
import LikesBar from "./LikesBar";
import SortSelect from "./SortSelect";
import Toast from "./Toast";

type SortValue = "popularity" | "date" | "title";

type GalleryProps = {
  medias: Media[];
  photographerPricePerDay: number;
};

export default function Gallery({ medias, photographerPricePerDay }: GalleryProps) {
  const [items, setItems] = useState<Media[]>(medias);

  // ✅ tri sélectionné
  const [sortBy, setSortBy] = useState<SortValue>("popularity");

  // État pour le toast d'erreur
  const [showErrorToast, setShowErrorToast] = useState(false);

  // État pour suivre les médias likés par l'utilisateur dans cette session
  const [likedMedias, setLikedMedias] = useState<Set<number>>(new Set());

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

  // ✅ toggle like/unlike
  const toggleLike = useCallback(async (mediaId: number) => {
    const isLiked = likedMedias.has(mediaId);
    const action = isLiked ? "unlike" : "like";

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId, action }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Like/Unlike failed");
      }

      const updated = (await res.json()) as { id: number; likes: number };

      // Mettre à jour avec la réponse de la BDD
      setItems((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, likes: updated.likes } : m))
      );

      // Mettre à jour l'état liké/unliké
      setLikedMedias((prev) => {
        const next = new Set(prev);
        if (isLiked) {
          next.delete(mediaId);
        } else {
          next.add(mediaId);
        }
        return next;
      });
    } catch (error) {
      console.error("Erreur lors du toggle like:", error);
      setShowErrorToast(true);
    }
  }, [likedMedias]);

  return (
    <>
      {/* ✅ Barre de tri */}
      <SortSelect value={sortBy} onChange={setSortBy} />

      <section className="gallery-grid" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="sr-only">
          Galerie des travaux
        </h2>
        {sortedItems.map((media, index) => (
          <MediaCard
            key={media.id}
            media={media}
            onOpen={() => openAtIndex(index)}
            onLike={() => toggleLike(media.id)}
            isLiked={likedMedias.has(media.id)}
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

      {showErrorToast && (
        <Toast
          message="Impossible de mettre à jour le like. Veuillez réessayer."
          type="error"
          onClose={() => setShowErrorToast(false)}
        />
      )}
    </>
  );
}
