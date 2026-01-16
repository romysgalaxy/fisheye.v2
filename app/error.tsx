"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Page d'erreur globale
 * Affichée quand une erreur inattendue se produit
 */
export default function Error({ error, reset }: ErrorProps) {
  // Logger l'erreur dans la console au montage
  useEffect(() => {
    console.error("Erreur capturée:", error);
  }, [error]);

  return (
    <div className="error-container">
      <h1>Oups !</h1>
      <p>Une erreur inattendue s'est produite.</p>
      <button onClick={reset} className="error-button">
        Réessayer
      </button>
    </div>
  );
}
