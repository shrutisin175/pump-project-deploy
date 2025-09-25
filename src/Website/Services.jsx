import React from "react";
import "./Services.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="services-container">
      <Navbar />

      {/* Empty Content Area */}
      <div className="services-main-content">
        <div className="services-grid">
          <div className="working-card">
            <div className="working-icon">
              <div className="gear-icon">⚙️</div>
            </div>
            <h2 className="working-title">We are Working</h2>
            <p className="working-description">
              Our team is currently developing amazing services for you. 
              Please check back soon for updates!
            </p>
            <div className="working-status">
              <div className="status-indicator">
                <div className="status-dot"></div>
                <span>In Development</span>
              </div>
            </div>
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

export default Services;