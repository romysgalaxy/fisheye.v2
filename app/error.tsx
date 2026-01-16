"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
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
