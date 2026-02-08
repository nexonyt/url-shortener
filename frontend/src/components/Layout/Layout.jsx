import React from 'react';
import { AppContainer, MainContent, Footer } from '../../styles/layoutStyles';

const Layout = ({ children }) => {
  return (
    <AppContainer>
      {children}
      <Footer>
        © 2026 URLPRETTY.PL Wykonano przez <a style={{outline: 'none', textDecoration: 'none', color: 'black'}} href="nexonstudio.pl">nexonstudio.pl</a>.
      </Footer>
    </AppContainer>
  );
};

export default Layout;