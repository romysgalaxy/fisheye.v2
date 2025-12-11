import Link from 'next/link';
import Image from 'next/image';
import type { Photographer } from '@prisma/client';

type PhotographerCardProps = {
  photographer: Photographer;
};

export default function PhotographerCard({ photographer }: PhotographerCardProps) {
  const { id, name, city, country, tagline, price, portrait } = photographer;

  return (
    <article className="photographer-card">
      <Link href={`/photographers/${id}`} className="photographer-card__link">
        <Image
          src={`/images/${portrait}`}
          width={200}
          height={200}
          className="photographer-card__image"
          alt=""
        />
        <h2 className="photographer-card__name">{name}</h2>
      </Link>
      <p className="photographer-card__location">
        {city}, {country}
      </p>
      <p className="photographer-card__tagline">{tagline}</p>
      <p className="photographer-card__price">{price}€/jour</p>
    </article>
  );
}
