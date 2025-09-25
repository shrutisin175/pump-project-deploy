import React from "react";
import "./ReverseEngineeringDocs.css";
import Navbar from "./Navbar";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

const ReverseEngineeringDocs = () => {
  return (
    <div className="reverse-engineering-docs">
      {/* Navbar */}
      <Navbar />
      
      <div className="docs-header">
        <h1>Reverse Engineering of Pumping Systems</h1>
        <p>Complete reverse engineering of pump components using advanced CAD/CAM technology and precision metrology.</p>
      </div>
      
      <div className="docs-content">
        <div className="docs-section">
          <h2>Document Content</h2>
          
          {/* Document Viewer */}
          <div className="document-viewer">
            <iframe
              src="/Reverse Engineering (1).pdf"
              title="Reverse Engineering Document"
              className="document-iframe"
              width="100%"
              height="600"
            >
              <p>Your browser doesn't support iframe. <a href="/Reverse Engineering (1).pdf" download>Download the document</a></p>
            </iframe>
          </div>
          
          <div className="docs-download">
            <a 
              href="/Reverse Engineering (1).pdf" 
              download="Reverse Engineering Guide.pdf"
              className="download-link"
            >
              📄 Download Full Document
            </a>
            <p className="download-note">Click to download the complete document</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="footer-audit-paragraph">
        <div className="footer-content">
          <div className="footer-copyright-left">
            <p className="footer-copyright-text">
              © 2025 Shaft & Seal. All rights reserved.
            </p>
          </div>
          
          <div className="footer-social-section">
            <h3 className="footer-heading">Connect With Us</h3>
            <div className="social-icons">
              <a href="https://youtube.com/@shaftnseal?si=rdVfDZ7qPpfzzHxS" target="_blank" rel="noopener noreferrer" title="YouTube">
                <FaYoutube />
              </a>
              <a href="https://www.youtube.com/@shaftnseal" target="_blank" rel="noopener noreferrer" title="Instagram">
                <FaInstagram />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61578595061965" target="_blank" rel="noopener noreferrer" title="Facebook">
                <FaFacebook />
              </a>
              <a href="https://x.com/ShaftnSeal" target="_blank" rel="noopener noreferrer" title="Twitter" className="x-link-text">
                x
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReverseEngineeringDocs;
