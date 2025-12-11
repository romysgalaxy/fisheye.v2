import { getAllPhotographers } from "./lib/prisma-db";
import type { Photographer } from '@prisma/client';
import Header from "./components/Header";
import PhotographerCard from "./components/PhotographerCard";

export default async function Home() {
  const photographers: Photographer[] = await getAllPhotographers();

  return (
    <main>
      <Header />
      <section
        className="photographers-section"
        aria-labelledby="photographers-heading"
      >
        <h2 id="photographers-heading" className="sr-only">
          Liste des photographes
        </h2>

        <ul className="photographers-grid">
          {photographers.map((photographer) => (
            <li key={photographer.id} className="photographers-grid__item">
              <PhotographerCard photographer={photographer} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
