import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './Layout.css';

/**
 * Persistent Layout Component
 * Wraps content with fixed Navbar and Footer that don't reload on route changes
 */
function Layout({ children }) {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="layout-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
