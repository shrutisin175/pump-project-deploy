import React from "react";
import "./EnergySavingPage.css";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
      FaTwitter,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const EnergySavingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="energy-saving-container-com">
      <Navbar />
      <div className="back-arrow" onClick={() => navigate("/")}>
        <FaArrowLeft />
        <span>Back</span>
      </div>
      <div className="energy-saving-page-com">
        <h1 className="energy-saving-page-title-com">
          Energy Saving in Pumping Systems
        </h1>

        <p className="energy-saving-paragraph-com">
          As a Senior Energy Auditor specializing in pumping systems, I have
          encountered numerous industrial setups where inefficiencies in pump
          operation account for a significant portion of wasted energy. Proper
          pump system assessment and optimization can yield energy savings
          ranging from <strong>20% to 40%</strong>, leading to substantial cost
          reductions and reduced carbon emissions.
        </p>

        <h3 className="energy-saving-page-title-head">
          Common Issues Identified
        </h3>
        <ul className="energy-saving-list-com">
          <li>Pumps operating far from their Best Efficiency Point (BEP)</li>
          <li>Oversized pumps running with throttled valves</li>
          <li>
            Lack of variable frequency drives (VFDs) to match variable demand
          </li>
          <li>Aging and worn-out impellers or motors</li>
          <li>Incorrectly sized piping or poorly designed layouts</li>
        </ul>

        <h3 className="energy-saving-page-title-head">
          Our Energy Audit Process
        </h3>
        <ul className="energy-saving-list-com">
          <li>Recording real-time flow, head, and power consumption</li>
          <li>Plotting the system curve vs. pump’s operating curve</li>
          <li>Identifying mismatch and inefficiency zones</li>
          <li>
            Recommending actions: impeller trimming, resizing, VFD installation
          </li>
        </ul>

        <p className="energy-saving-paragraph-com">
          By aligning the pump curve with the system curve near the BEP, energy
          consumption and mechanical wear are significantly reduced.
        </p>

        <h3 className="energy-saving-page-title-head">Outcomes</h3>
        <ul className="energy-saving-list-com">
          <li>
            <strong>25%–35%</strong> reduction in energy consumption
          </li>
          <li>Lower maintenance and downtime</li>
          <li>Extended pump and motor life</li>
          <li>Improved reliability and sustainability</li>
        </ul>

        <p className="energy-saving-paragraph-com">
          At <strong>Shaft & Seal</strong>, our certified BEE Energy Auditors
          help industries unlock savings through data-driven audits and
          engineered interventions.
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
    </div>
  );
};

export default EnergySavingPage;
