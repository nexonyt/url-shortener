import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Navbar from './components/Navbar/Navbar';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import ContactPage from './pages/ContactPage';
import LinkNotFoundPage from './pages/LinkNotFoundPage'; 
import LinkExpiredPage from './pages/LinkExpiredPage';
import PasswordRequiredPage from './pages/PasswordRequired';
import CheckLink from './pages/CheckLink';
import LinkStats from './pages/LinksStats';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <Layout>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/check-link" element={<CheckLink/>}/>
          <Route path="/link-stats" element={<LinkStats/>}/>
          <Route path="/link-not-found/:uuid" element={<LinkNotFoundPage />} />
          <Route path="/link-expired/:uuid" element={<LinkExpiredPage />} />
          <Route path="/password-required/:uuid" element={<PasswordRequiredPage />} />
          <Route path="*" element={<HomePage />} /> {/* fallback */}
        </Routes>
        <ToastContainer position="bottom-right" autoClose={2000} />
      </Layout>
    </Router>
  );
};

export default App;
