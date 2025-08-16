import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Navbar from './components/Navbar/Navbar';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import ContactPage from './pages/ContactPage';
import LinkNotFoundPage from './pages/LinkNotFoundPage'; // <- dodaj ten plik
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
          <Route path="/link-not-found" element={<LinkNotFoundPage />} />
          <Route path="*" element={<HomePage />} /> {/* fallback */}

        </Routes>
        <ToastContainer position="bottom-right" autoClose={2000} />
      </Layout>
    </Router>
  );
};

export default App;
