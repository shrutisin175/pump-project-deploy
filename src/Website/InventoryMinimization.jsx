import React, { useState, useEffect } from "react";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaArrowLeft,
} from "react-icons/fa"; 
import "./InventoryMinimization.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthService } from "../services/authService";

const InventoryMinimization = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await AuthService.isAuthenticated();
      setIsLoggedIn(authenticated);
    };
    checkAuth();
  }, []);

  const handleAccessForm = () => {
    if (isLoggedIn) {
      navigate('/pump-parts');
    } else {
      navigate('/login?from=inventory-minimization');
    }
  };

  return (
    <>
      <div className="inventory-container-com">
        <Navbar />
        <div className="back-arrow" onClick={() => navigate("/")}>
          <FaArrowLeft />
          <span>Back</span>
        </div>
        <h1 className="inventory-container-heading-com">
          Inventory Minimization – Spare Less, Save More
        </h1>
        <p className="inventory-container-paragh-com">
          For many industries, spare parts inventory is a silent capital drain —
          millions locked into shelves with low turnover or duplicated spares
          for similar equipment. At Shaft & Seal, we help clients transition
          from overstocked uncertainty to strategic inventory confidence.
        </p>
        <p className="inventory-container-paragh-com">
          Through our Inventory Minimization program, we perform a detailed
          analysis of your pumping systems, identify redundancy in spare parts,
          and introduce modular, interchangeable designs that reduce SKUs
          without compromising reliability.
        </p>

       <button
  className="inventory-heading-button"
  onClick={() => navigate("/pump-parts")}
>
  <h2>How we help:</h2>
</button>


        <ul className="inventory-container-list-com">
          <li>
            Consolidation of spares across similar pump models via custom
            redesign
          </li>
          <li>
            Reverse engineering of legacy/OEM parts that are no longer available
          </li>
          <li>
            Criticality analysis to determine what to stock vs. what to make
            on-demand
          </li>
          <li>
            Implementation of lean inventory models tailored to your plant’s run
            cycles
          </li>
          <li>
            Custom labelling, tracking, and digitization of spare parts
            libraries
          </li>
        </ul>

        <p className="inventory-container-paragh-com">
          In one case, we helped a major paper plant reduce its spare inventory
          by over 50%, freeing up valuable capital and floor space. By producing
          multi-fit impellers, shaft sleeves, seals, and wear rings, we ensure
          your inventory works smarter.
        </p>
        <p className="inventory-container-paragh-com">
          Inventory isn’t just about parts — it’s about readiness without waste.
          And we make that possible with our unique blend of design,
          engineering, and supply chain optimization.
        </p>
      </div>


      {/* Footer */}
      <footer className="footer-audit-paragraph">
        <div className="footer-content">
          <div className="footer-section">
            <div className="company-watermark">
              <img src="/logo.jpg" alt="Shaft & Seal" className="footer-logo" />
            </div>
          </div>
          
          <div className="footer-section">
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
        
        <div className="footer-copyright">
          <p className="footer-content-para">
            © 2025 Shaft & Seal. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default InventoryMinimization;
