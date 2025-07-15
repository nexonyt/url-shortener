import React from 'react';
import { PageContainer, PageTitle, PageContent } from '../styles/globalStyles';

const AboutPage = () => (
  <PageContainer>
    <PageTitle>O Nas</PageTitle>
    <PageContent>
      <p>Jesteśmy zespołem pasjonatów tworzących nowoczesne aplikacje webowe.</p>
      <p>Specjalizujemy się w React, styled-components i responsywnym designie.</p>
      <p>Nasza misja to tworzenie pięknych i funkcjonalnych interfejsów użytkownika.</p>
    </PageContent>
  </PageContainer>
);

export default AboutPage;