import React from 'react';
import { AppContainer, MainContent, Footer } from '../../styles/layoutStyles';

const Layout = ({ children }) => {
  return (
    <AppContainer>
      {children}
      <Footer>
        © 2025 URLPRETTY.PL Wszystkie prawa zastrzeżone.
      </Footer>
    </AppContainer>
  );
};

export default Layout;