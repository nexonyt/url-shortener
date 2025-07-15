import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import ContactPage from './pages/ContactPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'settings':
        return <SettingsPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </Layout>
  );
};

export default App;