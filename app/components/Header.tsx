"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="main-header">
      <Link href="/" className="main-header__logo-link">
        <Image
          src="/logo.svg"
          width={200}
          height={100}
          alt="Fisheye Home page"
          className="main-header__logo"
        />
      </Link>

      {isHome && <h1 className="main-header__title">Nos photographes</h1>}
    </header>
  );
}