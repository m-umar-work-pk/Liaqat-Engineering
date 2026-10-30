import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './Home';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageNotFound from '@/components/pageNotFound';
import About from './About';
import Contact from './Contact';
import Services from './Services';

const Frontend = () => {
  return (
    <>
      {/* Persistent global header */}
      <Header />
      
      {/* Centralized route management for public pages */}
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route path='services' element={<Services />} />
          
          {/* Catch-all route for public-facing 404 errors */}
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </main>
      
      {/* Persistent global footer */}
      <Footer />
    </>
  );
};

export default Frontend;