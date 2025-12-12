"use client";

type Props = {
  totalLikes: number;
  pricePerDay: number;
};

export default function LikesBar({ totalLikes, pricePerDay }: Props) {
  return (
    <aside className="likes-bar" aria-label="Informations du photographe">
      <p className="likes-bar__likes">
        {totalLikes} <span aria-hidden="true">♥</span>
      </p>
      <p className="likes-bar__price">{pricePerDay}€ / jour</p>
    </aside>
  );
}
