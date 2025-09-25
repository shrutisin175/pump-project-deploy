import React from "react";
import "./SalesContainer.css";
import wrenchIcon from "./icons/wrench.png";
import boxIcon from "./icons/box.png";
import boltIcon from "./icons/bolt.png";

import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

const SalesContainer = () => {
  const navigate = useNavigate();
  return (
    <div className="sales-container">
      {/* Navbar */}
      <Navbar />

      {/* What Sets Us Apart */}
      <div className="sales-why-choose">
        <h2>What Sets Us Apart</h2>
        <div className="sales-features">
          <div
            className="sales-feature"
            onClick={() => navigate("/reverse-engineering")}
          >
            <img src={wrenchIcon} alt="Wrench Icon" className="icon" />
            <button className="sales-feature-btn">Reverse Engineering</button>
            <p>
              Complete reverse engineering of pump components using advanced CAD/CAM technology and precision metrology.
            </p>
          </div>
          <div
            className="sales-feature"
            onClick={() => navigate("/inventory-minimization-content")}
          >
            <img src={boxIcon} alt="Box Icon" className="icon" />
            <button className="sales-feature-btn">
              Inventory Minimization
            </button>
            <p>
              We help reduce spare parts holding by custom engineering
              interchangeable components.
            </p>
          </div>
          <div
            className="sales-feature"
            onClick={() => navigate("/energy-optimization")}
          >
            <img src={boltIcon} alt="Energy Optimization Icon" className="icon" />
            <button className="sales-feature-btn">
              Energy Optimization
            </button>
            <p>
              Comprehensive energy audits and optimization strategies to reduce operational costs and improve efficiency.
            </p>
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

export default SalesContainer;
