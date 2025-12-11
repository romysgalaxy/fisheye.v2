import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
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
      <h1 className="main-header__title">Nos photographes</h1>
    </header>
  );
}
