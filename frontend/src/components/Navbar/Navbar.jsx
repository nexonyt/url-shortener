import { Link2 } from "lucide-react";
import { Header, NavContainer, LogoSection, LogoIcon, LogoText, NavLinks, NavLink, LoginButton } from "../../styles/navbarStyles";

export default function Navbar() {
  return (
    <Header>
      <NavContainer>
        <LogoSection>
          <LogoIcon><Link2 size={16} /></LogoIcon>
          <LogoText>URLPRETTY.PL</LogoText>
        </LogoSection>

        <NavLinks>
          <NavLink href="/">Skróć link</NavLink>
          <NavLink href="check-link">Sprawdź link</NavLink>
          <NavLink href="link-stats">Statystyki</NavLink>
          <NavLink href="manage-link">Zarządzaj linkiem</NavLink>
        </NavLinks>

        {/* <LoginButton href="#">Zaloguj się</LoginButton> */}
      </NavContainer>
    </Header>
  );
}
