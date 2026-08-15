import React from 'react';
import { ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="container">
        {/* Medical Disclaimer Banner */}
        <div className="disclaimer-banner animate-pulse-slow">
          <ShieldAlert className="disclaimer-icon" size={24} />
          <p className="disclaimer-text">
            <strong>Medical Disclaimer:</strong> This is an educational prototype and is not a medical diagnostic tool. 
            Please consult a qualified healthcare professional for medical advice.
          </p>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} HealthGen AI. All rights reserved. BTech Project Prototype.</p>
          <div className="footer-links">
            <span>Privacy Policy</span>
            <span>&bull;</span>
            <span>Terms of Service</span>
            <span>&bull;</span>
            <span>Contact Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
