"use client";

type Props = {
  totalLikes: number;
  pricePerDay: number;
};

/**
 * Barre fixe en bas à droite
 * Affiche le total des likes et le prix par jour du photographe
 */
export default function LikesBar({ totalLikes, pricePerDay }: Props) {
  return (
    <aside className="likes-bar" aria-labelledby="likes-bar-heading">
      <h2 id="likes-bar-heading" className="sr-only">
        Informations du photographe
      </h2>
      <p className="likes-bar__likes">
        {totalLikes} <span aria-hidden="true">♥</span>
      </p>
      <p className="likes-bar__price">{pricePerDay}€ / jour</p>
    </aside>
  );
}
