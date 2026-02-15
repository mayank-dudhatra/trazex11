import React from 'react';
import './SectionLoader.css';

/**
 * Section-level Loader Component
 * Shows loading indicator only in specific section being updated
 * Does not overlay entire page
 */
function SectionLoader({ message = 'Loading...' }) {
  return (
    <div className="section-loader-wrapper">
      <div className="section-loader">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default SectionLoader;
