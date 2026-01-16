"use client";

import Image from "next/image";
import type { Photographer } from "@prisma/client";
import ContactModal from "./ContactModal";
import { useState } from "react";

type Props = {
  photographer: Photographer;
};

/**
 * Header d'un photographe
 * Affiche les informations du photographe et le bouton de contact
 */
export default function PhotographerHeader({ photographer }: Props) {
  const { name, city, country, tagline, portrait } = photographer;

  // État d'ouverture de la modale de contact
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <section className="photographer-header">
        {/* Informations du photographe */}
        <div className="photographer-header__info">
          <h1 className="photographer-header__name">{name}</h1>
          <p className="photographer-header__location">
            {city}, {country}
          </p>
          <p className="photographer-header__tagline">{tagline}</p>
        </div>

        {/* Bouton pour ouvrir la modale de contact */}
        <button
          className="photographer-header__contact-btn"
          type="button"
          onClick={() => setIsContactOpen(true)}
        >
          Contactez-moi
        </button>

        {/* Photo de profil */}
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