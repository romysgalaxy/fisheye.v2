"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * Header principal du site
 * Affiche le logo et le titre "Nos photographes" sur la page d'accueil
 */
export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="main-header">
      {/* Logo cliquable pour retourner à l'accueil */}
      <Link href="/" className="main-header__logo-link">
        <Image
          src="/logo.svg"
          width={200}
          height={100}
          alt="Fisheye Home page"
          className="main-header__logo"
        />
      </Link>

      {/* Titre affiché uniquement sur la page d'accueil */}
      {isHome && <h1 className="main-header__title">Nos photographes</h1>}
    </header>
  );
}