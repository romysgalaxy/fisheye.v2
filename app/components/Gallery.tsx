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

/**
 * Composant Galerie - Affiche les médias d'un photographe
 * Gère le tri, les likes, et la lightbox
 */
export default function Gallery({ medias, photographerPricePerDay }: GalleryProps) {
  // État des médias (source de vérité)
  const [items, setItems] = useState<Media[]>(medias);

  // Type de tri sélectionné (popularité par défaut)
  const [sortBy, setSortBy] = useState<SortValue>("popularity");

  // Affichage du toast d'erreur
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Médias likés par l'utilisateur dans cette session (réinitialisé au rafraîchissement)
  const [likedMedias, setLikedMedias] = useState<Set<number>>(new Set());

  // Calculer le total des likes pour la barre de likes
  const totalLikes = useMemo(
    () => items.reduce((sum, m) => sum + (m.likes ?? 0), 0),
    [items]
  );

  // Trier les médias selon le critère sélectionné
  const sortedItems = useMemo(() => {
    const copy = [...items];

    if (sortBy === "popularity") {
      // Tri par nombre de likes (décroissant)
      copy.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "date") {
      // Tri par date (plus récent en premier)
      copy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "title") {
      // Tri alphabétique par titre
      copy.sort((a, b) => a.title.localeCompare(b.title, "fr", { sensitivity: "base" }));
    }

    return copy;
  }, [items, sortBy]);

  // État de la lightbox
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  /** Ouvrir la lightbox à un index spécifique */
  const openAtIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  /** Fermer la lightbox */
  const close = useCallback(() => {
    setIsOpen(false);
    setCurrentIndex(null);
  }, []);

  /** Afficher le média précédent dans la lightbox */
  const showPrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === null ? prev : (prev - 1 + sortedItems.length) % sortedItems.length
    );
  }, [sortedItems.length]);

  /** Afficher le média suivant dans la lightbox */
  const showNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === null ? prev : (prev + 1) % sortedItems.length
    );
  }, [sortedItems.length]);

  /**
   * Toggle like/unlike d'un média
   * Envoie la requête à l'API et met à jour l'état avec la réponse de la BDD
   */
  const toggleLike = useCallback(async (mediaId: number) => {
    const isLiked = likedMedias.has(mediaId);
    const action = isLiked ? "unlike" : "like";

    try {
      // Appeler l'API pour mettre à jour le like en BDD
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

      // Mettre à jour le nombre de likes avec la valeur de la BDD (source de vérité)
      setItems((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, likes: updated.likes } : m))
      );

      // Mettre à jour l'état liké/unliké localement
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
      {/* Sélecteur de tri */}
      <SortSelect value={sortBy} onChange={setSortBy} />

      {/* Grille de médias */}
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

      {/* Barre fixe avec le total des likes et le prix */}
      <LikesBar totalLikes={totalLikes} pricePerDay={photographerPricePerDay} />

      {/* Lightbox pour afficher un média en grand */}
      {currentIndex !== null && (
        <Lightbox
          isOpen={isOpen}
          media={sortedItems[currentIndex]}
          onClose={close}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}

      {/* Toast d'erreur en cas de problème avec les likes */}
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
