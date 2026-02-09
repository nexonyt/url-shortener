import styled from "styled-components";

export const Header = styled.header`
  width: 100%;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  position: relative; /* Important for positioning the mobile menu */
  z-index: 50;
`;

export const NavContainer = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #0f172a;
`;

export const LogoIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #2563eb; /* bg-blue-600 */
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* shadow-md */
`;

export const LogoText = styled.span`
  font-size: 1.125rem;
  letter-spacing: -0.025em;
`;

// --- DESKTOP MENU ---

export const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  /* Hide on mobile screens (less than 768px) */
  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled.a`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #0f172a;
  }
`;

export const LoginButton = styled.a`
  background: #0f172a;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: #1e293b;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// --- HAMBURGER & MOBILE MENU ---

export const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #0f172a;
  padding: 0.25rem;
  
  /* Show only on mobile screens */
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const MobileMenu = styled.div`
  position: absolute;
  top: 100%; /* Position directly below the header */
  left: 0;
  width: 100%;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  /* Animation for sliding in */
  animation: slideDown 0.3s ease-out forwards;
  
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

export const MobileNavLink = styled(NavLink)`
  font-size: 1rem;
  padding: 0.5rem 0;
  width: 100%;
  display: block;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;