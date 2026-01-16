import { getAllPhotographers } from "./lib/prisma-db";
import type { Photographer } from '@prisma/client';
import Header from "./components/Header";
import PhotographerCard from "./components/PhotographerCard";

/**
 * Page d'accueil - Liste tous les photographes
 * Server Component : les données sont chargées côté serveur
 */
export default async function Home() {
  // Récupérer tous les photographes depuis la base de données
  const photographers: Photographer[] = await getAllPhotographers();

  return (
    <>
      <Header />
      <main>
        <section
          className="photographers-section"
          aria-labelledby="photographers-heading"
        >
          <h2 id="photographers-heading" className="sr-only">
            Liste des photographes
          </h2>
          {/* Grille des photographes */}
          <ul className="photographers-grid">
            {photographers.map((photographer) => (
              <li key={photographer.id} className="photographers-grid__item">
                <PhotographerCard photographer={photographer} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
