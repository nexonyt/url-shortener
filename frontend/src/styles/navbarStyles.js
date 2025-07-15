import styled from 'styled-components';

export const Header = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled.button`
  color: white;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 25px;
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

export const MobileMenu = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 20px;
    animation: slideDown 0.3s ease;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const MobileNavLink = styled.button`
  color: white;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  text-align: left;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.2);
  }
`;