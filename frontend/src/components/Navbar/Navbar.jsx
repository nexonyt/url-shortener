import React, { useState } from 'react';
import { Menu, X, Home, User, Settings, Mail } from 'lucide-react';
import {
  Header,
  Nav,
  Logo,
  NavLinks,
  NavLink,
  HamburgerButton,
  MobileMenu,
  MobileNavLink
} from '../../styles/navbarStyles';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Strona Główna', icon: Home },
    { id: 'about', label: 'O Nas', icon: User },
    { id: 'settings', label: 'Ustawienia', icon: Settings },
    { id: 'contact', label: 'Kontakt', icon: Mail }
  ];

  return (
    <Header>
      <Nav>
        <Logo>MojaApp</Logo>
        
        <NavLinks>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={currentPage === item.id ? 'active' : ''}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </NavLinks>

        <HamburgerButton onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </HamburgerButton>
      </Nav>

      <MobileMenu isOpen={isMenuOpen}>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <MobileNavLink
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={currentPage === item.id ? 'active' : ''}
            >
              <Icon size={20} />
              {item.label}
            </MobileNavLink>
          );
        })}
      </MobileMenu>
    </Header>
  );
};

export default Navbar;