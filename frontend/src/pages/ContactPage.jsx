import React from 'react';
import { PageContainer, PageTitle, PageContent } from '../styles/globalStyles';

const ContactPage = () => (
  <PageContainer>
    <PageTitle>Kontakt</PageTitle>
    <PageContent>
      <p>Skontaktuj się z nami w razie jakichkolwiek pytań!</p>
      <p>Email: kontakt@mojaapp.pl</p>
      <p>Telefon: +48 123 456 789</p>
    </PageContent>
  </PageContainer>
);

export default ContactPage;