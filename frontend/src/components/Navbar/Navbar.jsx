import React, { useState } from "react";
import { Link2, Menu, X } from "lucide-react"; // Import Menu and X icons
import { 
  Header, 
  NavContainer, 
  LogoSection, 
  LogoIcon, 
  LogoText, 
  NavLinks, 
  NavLink, 
  HamburgerButton,
  MobileMenu,
  MobileNavLink 
} from "../../styles/navbarStyles";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Header>
      <NavContainer>
        {/* LOGO */}
        <LogoSection>
          <LogoIcon><Link2 size={16} /></LogoIcon>
          <LogoText>URLPRETTY.PL</LogoText>
        </LogoSection>

        {/* DESKTOP LINKS (Hidden on Mobile via CSS) */}
        <NavLinks>
          <NavLink href="/">Skróć link</NavLink>
          <NavLink href="/check-link">Sprawdź link</NavLink>
          <NavLink href="/link-stats">Statystyki</NavLink>
          <NavLink href="/manage-link">Zarządzaj linkiem</NavLink>
        </NavLinks>

        {/* HAMBURGER BUTTON (Visible only on Mobile via CSS) */}
        <HamburgerButton onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </HamburgerButton>
      </NavContainer>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <MobileMenu>
          <MobileNavLink href="/" onClick={() => setIsOpen(false)}>
            Skróć link
          </MobileNavLink>
          <MobileNavLink href="/check-link" onClick={() => setIsOpen(false)}>
            Sprawdź link
          </MobileNavLink>
          <MobileNavLink href="/link-stats" onClick={() => setIsOpen(false)}>
            Statystyki
          </MobileNavLink>
          <MobileNavLink href="/manage-link" onClick={() => setIsOpen(false)}>
            Zarządzaj linkiem
          </MobileNavLink>
        </MobileMenu>
      )}
    </Header>
  );
}