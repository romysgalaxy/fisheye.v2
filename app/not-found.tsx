import Link from "next/link";

/**
 * Page 404 - Page introuvable
 * Affichée quand l'utilisateur accède à une URL inexistante
 */
export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Page introuvable</p>
      <p style={{ fontSize: "1rem", color: "#999", marginBottom: "2rem" }}>
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link href="/" className="not-found-button">
        Retour à l'accueil
      </Link>
    </div>
  );
}
