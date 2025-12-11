import { getAllPhotographers } from "./lib/prisma-db";
import type { Photographer } from '@prisma/client';

export default async function Home() {
  const photographers: Photographer[] = await getAllPhotographers();

  return (
    <main>
      <header>
        <h1>FishEye – Photographes freelances</h1>
      </header>

      <section aria-labelledby="photographers-heading">
        <h2 id="photographers-heading">Liste des photographes</h2>

        <ul>
          {photographers.map((photographer) => (
            <li key={photographer.id}>
              <article>
                <h3>{photographer.name}</h3>
                <p>
                  {photographer.city}, {photographer.country}
                </p>
                <p>{photographer.tagline}</p>
                <p>{photographer.price} €/jour</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
