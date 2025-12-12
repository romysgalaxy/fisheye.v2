"use client";

import Image from "next/image";
import type { Media } from "@prisma/client";

type Props = {
  media: Media;
  onOpen: () => void;
  onLike: () => void;
};

export default function MediaCard({ media, onOpen, onLike }: Props) {
  const { title, image, video, likes } = media;
  const basePath = "/images";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <article className="media-card">
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
            aria-label={title}
            className="media-card__media media-card__video"
            muted
            preload="metadata"
          />
        ) : null}
      </div>

      <div className="media-card__info">
        <h3 className="media-card__title">{title}</h3>

        <button
          type="button"
          className="media-card__like-btn"
          aria-label={`Ajouter un like à ${title}`}
          onClick={onLike}
        >
          <span aria-hidden="true">{likes} ♥</span>
          <span className="sr-only">{likes} likes</span>
        </button>
      </div>
    </article>
  );
}
