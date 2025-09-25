import React from "react";
import { FaYoutube, FaInstagram, FaFacebook, FaTwitter, FaArrowLeft } from "react-icons/fa";
import "./EnergyAudit.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const EnergyAudit = () => {
   const navigate = useNavigate();
  return (
    <div className="energy-audit-container">
      <Navbar />
       <div className="back-arrow" onClick={() => navigate("/")}>
        <FaArrowLeft />
        <span>Back</span>
      </div>
      <h1 className="audit-title">Energy Saving Expertise – Process & Pump Integrated Approach</h1>

      <p className="audit-paragraph">
        As a Senior Energy Auditor with extensive experience...
      </p>

      <p className="audit-paragraph">
        Most audits focus solely on the pump performance...
      </p>

      <h2 className="audit-subtitle">Here’s how our expertise stands out:</h2>

      <h3 className="audit-section-heading">1. Process Understanding</h3>
      <ul className="audit-list">
        <li>We analyze the process requirements...</li>
        <li>We identify where process overdesign...</li>
        <li>We factor in tank levels, control valve behavior...</li>
      </ul>

      <h3 className="audit-section-heading">2. Pump Performance Analysis</h3>
      <ul className="audit-list">
        <li>We measure real-time flow, head, and kW...</li>
        <li>We plot actual operating points...</li>
        <li>We identify opportunities for impeller trimming</li>
      </ul>

      <h3 className="audit-section-heading">3. Integrated Optimization</h3>
      <ul className="audit-list">
        <li>We create a detailed system curve...</li>
        <li>We re-engineer pump internals...</li>
        <li>We help eliminate throttling losses...</li>
      </ul>

      <h3 className="audit-section-heading">4. Post-Audit Implementation</h3>
      <ul className="audit-list">
        <li>We don’t stop at reports – we retrofit...</li>
        <li>Our in-house machining, balancing...</li>
        <li>We validate savings through post-implementation...</li>
      </ul>

      <p className="audit-paragraph">
        Clients across power plants, refineries...
      </p>

      <p className="audit-paragraph">
        Because we understand both hydraulic machinery and process behavior...
      </p>

      <p className="audit-paragraph">That’s the Shaft & Seal advantage.</p>

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

    </div>
  );
};

export default EnergyAudit;
