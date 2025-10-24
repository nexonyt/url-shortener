import styled from 'styled-components';

// Główne opakowanie
export const Header = styled.header`
  background: rgba(255, 255, 255, 0.8); /* bg-white/80 */
  backdrop-filter: blur(12px); /* backdrop-blur-md */
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  border-bottom: 1px solid rgba(226, 232, 240, 0.7); /* border-slate-200/70 */
`;

// Wewnętrzny kontener
export const NavContainer = styled.div`
  max-width: 64rem; /* max-w-5xl */
  margin: 0 auto;
  padding: 0 1rem; /* px-4 */
  height: 4rem; /* h-16 */
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// Logo + ikona
export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* space-x-2 */
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
  font-weight: 700;
  font-size: 1.25rem; /* text-xl */
  color: #1e293b; /* text-slate-800 */
`;

// Linki w desktopowej nawigacji
export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem; /* space-x-8 */

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled.a`
  color: #475569; /* text-slate-600 */
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb; /* hover:text-blue-600 */
  }
`;

// Przycisk logowania
export const LoginButton = styled.a`
  background: #1e293b; /* bg-slate-800 */
  color: white;
  padding: 0.5rem 1rem; /* px-4 py-2 */
  border-radius: 0.5rem; /* rounded-lg */
  font-weight: 600;
  font-size: 0.875rem; /* text-sm */
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* shadow-sm */

  &:hover {
    background: #0f172a; /* hover:bg-slate-900 */
  }
`;
