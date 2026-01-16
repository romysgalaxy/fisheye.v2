"use client";

import Image from "next/image";
import type { Media } from "@prisma/client";

type Props = {
  media: Media;
  onOpen: () => void;
  onLike: () => void;
  isLiked: boolean;
};

/**
 * Carte d'un média (image ou vidéo)
 * Affiche le média avec son titre et le bouton like
 */
export default function MediaCard({ media, onOpen, onLike, isLiked }: Props) {
  const { title, image, video, likes } = media;
  const basePath = "/images";

  /** Gestion du clavier pour ouvrir la lightbox (Enter ou Espace) */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <article className="media-card">
      {/* Aperçu cliquable du média */}
      <div
        className="media-card__frame"
        role="button"
        tabIndex={0}
        aria-label={`Voir ${title} en grand`}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
      >
        {image ? (
          <Image
            src={`${basePath}/${image}`}
            alt={title}
            fill
            className="media-card__media"
          />
        ) : video ? (
          <video
            src={`${basePath}/${video}`}
            title={title}
            className="media-card__media media-card__video"
            muted
            preload="metadata"
          />
        ) : null}
      </div>

      {/* Titre et bouton like */}
      <div className="media-card__info">
        <h3 className="media-card__title">{title}</h3>

        <button
          type="button"
          className="media-card__like-btn"
          aria-label={isLiked ? `Retirer le like de ${title}` : `Ajouter un like à ${title}`}
          onClick={onLike}
          style={{ color: isLiked ? "#901c1c" : "#D3573C" }}
        >
          {/* Cœur plein si liké, vide sinon */}
          <span aria-hidden="true">{likes} {isLiked ? "❤" : "♥"}</span>
          <span className="sr-only">{likes} likes</span>
        </button>
      </div>
    </article>
  );
}
