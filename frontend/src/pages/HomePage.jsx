import React from 'react';
import { PageContainer, PageTitle, PageContent } from '../styles/globalStyles';

const HomePage = () => (
  <PageContainer>
    <PageTitle>Strona Główna</PageTitle>
    <PageContent>
      <p>Witaj w naszej aplikacji! To jest strona główna z pięknym, responsywnym designem.</p>
      <p>Navbar automatycznie zmienia się w hamburger menu na mniejszych ekranach.</p>
      <p>Cała aplikacja używa styled-components do stylizacji.</p>
    </PageContent>
  </PageContainer>
);

export default HomePage;