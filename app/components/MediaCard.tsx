import Image from "next/image";
import type { Media } from "@prisma/client";

type Props = {
  media: Media;
};

export default function MediaCard({ media }: Props) {
  const { title, image, video, likes } = media;
  const basePath = "/images";

  return (
    <article className="media-card">
      <div className="media-card__frame">
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
          className="media-card__like-btn"
          aria-label={`Ajouter un like à ${title}`}
        >
          {likes} ❤️
        </button>
      </div>
    </article>
  );
}
