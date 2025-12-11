"use client";

import { useState, useCallback } from "react";
import type { Media } from "@prisma/client";
import MediaCard from "./MediaCard";
import Lightbox from "./LightBox";

type GalleryProps = {
  medias: Media[];
};

export default function Gallery({ medias }: GalleryProps) {
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
    setCurrentIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + medias.length) % medias.length;
    });
  }, [medias.length]);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % medias.length;
    });
  }, [medias.length]);

  return (
    <>
      <section className="gallery-grid" aria-label="Galerie des travaux">
        {medias.map((media, index) => (
          <MediaCard
            key={media.id}
            media={media}
            onOpen={() => openAtIndex(index)}
          />
        ))}
      </section>

      {currentIndex !== null && (
        <Lightbox
          isOpen={isOpen}
          media={medias[currentIndex]}
          onClose={close}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </>
  );
}