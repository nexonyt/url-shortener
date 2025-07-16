import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationPL from './locales/pl/translation.json';
import translationEN from './locales/en/translation.json';

i18n
  .use(LanguageDetector) // automatyczne wykrywanie języka
  .use(initReactI18next) // integracja z Reactem
  .init({
    resources: {
      en: { translation: translationEN },
      pl: { translation: translationPL },
    },
    fallbackLng: 'en', // domyślny język
    interpolation: {
      escapeValue: false, // React domyślnie zabezpiecza przed XSS
    },
  });

export default i18n;
