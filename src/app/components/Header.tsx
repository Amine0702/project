import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const Header = () => (
  <header>
    <div className="header-area">
      <div id="sticky-header" className="main-header-area">
        <div className="container-fluid">
          <div className="row align-items-center">
            {/* Logo */}
            <div className="col-xl-3 col-lg-2">
              <div className="Logo">
                <Link href="/">
                  <img src="img/logo/logo.png" alt="Logo" />
                </Link>
              </div>
            </div>

            {/* Menu principal */}
            <div className="col-xl-6 col-lg-7">
              <div className="main-menu d-none d-lg-block">
                <nav>
                  <ul id="navigation">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/#services">Services</Link></li>
                    <li><Link href="/#features">Features</Link></li>
                    <li><Link href="/#CompanyInfo">About</Link></li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Bouton + Icône utilisateur */}
            <div className="col-xl-3 col-lg-3">
              <div className="Appointment">
                {/* 
                  Retire "d-none d-lg-flex" pour l'afficher sur toutes les tailles.
                  On ajoute "d-flex align-items-center" et un petit écart via le style gap.
                */}
                <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
                  <Link href="/app" className="boxed-btn3">
                    <i className="fa fa-phone"></i> Accéder à vos tableaux
                  </Link>
                  {/* Affiche l'icône de profil seulement si l'utilisateur est connecté */}
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </div>

            {/* Menu mobile */}
            <div className="col-12">
              <div className="mobile_menu d-block d-lg-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
