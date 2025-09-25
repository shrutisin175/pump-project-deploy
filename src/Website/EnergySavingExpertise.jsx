import React from "react";
import "./EnergySavingExpertise.css";
import { FaYoutube, FaInstagram, FaFacebook, FaTwitter, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const EnergySavingExpertise = () => {
     const navigate = useNavigate();
  
  return (
    <div className="energy-saving-container-com">
      <Navbar />
        <div className="back-arrow" onClick={() => navigate("/")}>
              <FaArrowLeft />
              <span>Back</span>
            </div>
      <h1 className="energy-saving-container-com-heading">Energy Saving Expertise – Process & Pump Integrated Approach</h1>

      <p className="energy-saving-container-com-para">
        As a Senior Energy Auditor with extensive experience in pumping system
        energy audits and retrofit implementations, I can confidently say that
        true energy optimization is achieved only when one understands both the
        pump and the process it serves. At Shaft & Seal, this holistic
        understanding is what defines our energy-saving expertise.
      </p>

      <div className="energy-saving-highlight">
        Most audits focus solely on the pump performance – but the real savings
        lie at the intersection of <strong>system demand, process behavior, and pump characteristics</strong>.
      </div>

      <p className="energy-saving-container-com-para">
        Our certified BEE Energy Auditors are trained to interpret process flow logic, system curve dynamics, and pump efficiency simultaneously.
      </p>

      <h3  className="energy-saving-container-com-hea">Here’s how our expertise stands out:</h3>

      <h4  className="energy-saving-container-com-heading">1. Process Understanding:</h4>
      <ul  className="energy-saving-container-com-list">
        <li>We analyze the process requirements – whether continuous or batch, constant or variable flow.</li>
        <li>We identify where process overdesign leads to unnecessary pressure drops or overpumping.</li>
        <li>We factor in tank levels, control valve behavior, and pipe routing losses.</li>
      </ul>

      <h4  className="energy-saving-container-com-heading">2. Pump Performance Analysis:</h4>
       <ul  className="energy-saving-container-com-list">
        <li>We measure real-time flow, head, and kW using ultrasonic flow meters, pressure gauges, and energy analyzers.</li>
        <li>We plot actual operating points and compare them to the Best Efficiency Point (BEP).</li>
        <li>We identify opportunities for <strong>impeller trimming, resizing, or VFD control</strong>.</li>
      </ul>

      <h4  className="energy-saving-container-com-heading">3. Integrated Optimization:</h4>
      <ul  className="energy-saving-container-com-list">
        <li>We create a detailed system curve and match it to optimized pump selections.</li>
        <li>We re-engineer pump internals when necessary to match new duty points.</li>
        <li>We help eliminate throttling losses and increase system responsiveness.</li>
      </ul>

      <h4  className="energy-saving-container-com-heading">4. Post-Audit Implementation:</h4>
       <ul  className="energy-saving-container-com-list">
        <li>We don’t stop at reports – we retrofit, upgrade, and commission.</li>
        <li>Our in-house machining, balancing, and assembly teams ensure precision execution.</li>
        <li>We validate savings through post-implementation measurement and verification.</li>
      </ul>

       <p className="energy-saving-container-com-para">
        Clients across power plants, refineries, paper mills, and chemical
        factories have trusted us to reduce their energy consumption by <strong>25% to 40%</strong>, enhance reliability, and improve process stability.
      </p>

       <p className="energy-saving-container-com-para">
        Because we understand both <strong>hydraulic machinery and process behavior </strong>, we don’t just save energy — we improve systems.
      </p>

      <div className="energy-saving-com-footer">
        That’s the Shaft & Seal advantage.
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
    </div>
  );
};

export default EnergySavingExpertise;
