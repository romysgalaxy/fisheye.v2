import Image from "next/image";
import type { Photographer } from "@prisma/client";
import Header from "./Header";

type Props = {
  photographer: Photographer;
};

export default function PhotographerHeader({ photographer }: Props) {
  const { name, city, country, tagline, portrait } = photographer;

  return (
    <main>
      <Header />
      <section className="photographer-header">
        <div className="photographer-header__info">
          <h1 className="photographer-header__name">{name}</h1>

          <p className="photographer-header__location">
            {city}, {country}
          </p>

          <p className="photographer-header__tagline">{tagline}</p>
        </div>

        {/* Bouton Contact */}
        <button className="photographer-header__contact-btn">
          Contactez-moi
        </button>

        {/* Image profil */}
        <div className="photographer-header__image-wrapper">
          <Image
            src={`/images/${portrait}`}
            width={200}
            height={200}
            alt={name}
            className="photographer-header__image"
          />
        </div>
      </section>

    </main>

  );
}
