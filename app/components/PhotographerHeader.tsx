"use client";

import Image from "next/image";
import type { Photographer } from "@prisma/client";
import ContactModal from "./ContactModal";
import { useState } from "react";

type Props = {
  photographer: Photographer;
};

export default function PhotographerHeader({ photographer }: Props) {
  const { name, city, country, tagline, portrait } = photographer;
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <section className="photographer-header">
        <div className="photographer-header__info">
          {/* Heading (h1) statique pour la page photographe */}
          <h1 className="photographer-header__name">{name}</h1>

          <p className="photographer-header__location">
            {city}, {country}
          </p>

          <p className="photographer-header__tagline">{tagline}</p>
        </div>

        {/* Bouton Contact */}
        <button
          className="photographer-header__contact-btn"
          type="button"
          onClick={() => setIsContactOpen(true)}
        >
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

      {/* Modale de contact */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        photographerName={name}
      />
    </>
  );
}