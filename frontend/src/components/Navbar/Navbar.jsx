import { Link2 } from "lucide-react";
import { Header, NavContainer, LogoSection, LogoIcon, LogoText, NavLinks, NavLink, LoginButton } from "../../styles/navbarStyles";

export default function Navbar() {
  return (
    <Header>
      <NavContainer>
        <LogoSection>
          <LogoIcon><Link2 size={16} /></LogoIcon>
          <LogoText>Short.ly</LogoText>
        </LogoSection>

        <NavLinks>
          <NavLink href="#">Funkcje</NavLink>
          <NavLink href="#">Cennik</NavLink>
          <NavLink href="#">API</NavLink>
        </NavLinks>

        <LoginButton href="#">Zaloguj się</LoginButton>
      </NavContainer>
    </Header>
  );
}
