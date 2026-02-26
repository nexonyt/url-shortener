import React from 'react';
import { AppContainer, MainContent, Footer } from '../../styles/layoutStyles';

const Layout = ({ children }) => {
  return (
    <AppContainer>
      {children}
      <Footer>
        © 2026 URLPRETTY.PL Wykonano przez <a style={{outline: 'none', textDecoration: 'none', color: 'black'}} href="nexonstudio.pl">nexonstudio.pl</a>. Version: {import.meta.env.VITE_APP_VERSION}
      </Footer>
    </AppContainer>
  );
};

export default Layout;