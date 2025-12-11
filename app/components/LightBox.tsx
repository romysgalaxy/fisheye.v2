"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Media } from "@prisma/client";

type LightboxProps = {
  isOpen: boolean;
  media: Media;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Lightbox({
  isOpen,
  media,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const basePath = "/images";

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="lightbox-overlay"
      role="presentation"
      onClick={handleOverlayClick}
    >
      <div
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={media.title}
      >
        {/* Bouton fermer */}
        <button
          ref={closeButtonRef}
          type="button"
          className="lightbox__close"
          aria-label="Fermer la visualisation du média"
          onClick={onClose}
        >
          ×
        </button>

        {/* Bouton précédent */}
        <button
          type="button"
          className="lightbox__nav lightbox__nav--prev"
          aria-label="Média précédent"
          onClick={onPrev}
        >
          ‹
        </button>

        {/* Contenu média */}
        <div className="lightbox__media-container">
          {media.image ? (
            <Image
              src={`${basePath}/${media.image}`}
              alt={media.title}
              fill
              className="lightbox__media"
            />
          ) : media.video ? (
            <video
              src={`${basePath}/${media.video}`}
              controls
              autoPlay
              className="lightbox__media lightbox__video"
              aria-label={media.title}
            />
          ) : null}
        </div>

        {/* Bouton suivant */}
        <button
          type="button"
          className="lightbox__nav lightbox__nav--next"
          aria-label="Média suivant"
          onClick={onNext}
        >
          ›
        </button>
      </div>
    </div>
  );
}
