import React from 'react';
import { PageContainer, PageTitle, PageContent } from '../styles/globalStyles';

const SettingsPage = () => (
  <PageContainer>
    <PageTitle>Ustawienia</PageTitle>
    <PageContent>
      <p>Tutaj możesz skonfigurować różne opcje aplikacji.</p>
      <p>Strona korzysta z tego samego layoutu co pozostałe podstrony.</p>
      <p>Wszystkie komponenty są w pełni responsywne i stylizowane.</p>
    </PageContent>
  </PageContainer>
);

export default SettingsPage;