import React, { useState } from 'react';
import { Menu, X, Home, User, Settings, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/page-logo.png';
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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { path: '/', label: 'Strona Główna', icon: Home },
    { path: '/about', label: 'Sprawdź link', icon: User },
    { path: '/settings', label: 'Statystyki', icon: Settings },
    { path: '/contact', label: 'Kontakt', icon: Mail }
  ];

  return (
    <Header>
      <Nav>
        <Logo><img  width="932" height="169" src={logo} alt="URL Shortener" /></Logo>

        <NavLinks>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                as={Link}
                to={item.path}
                className={isActive ? 'active' : ''}
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
          const isActive = location.pathname === item.path;

          return (
            <MobileNavLink
              key={item.path}
              as={Link}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={isActive ? 'active' : ''}
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
