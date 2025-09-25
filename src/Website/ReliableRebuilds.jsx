import React from "react";
import "./ReliableRebuilds.css";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
      FaTwitter,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const ReliableRebuilds = () => {
  const navigate = useNavigate();

  return (
    <div className="reliable-rebuilds-container-com">
      <Navbar />
       <div className="back-arrow" onClick={() => navigate("/")}>
              <FaArrowLeft />
              <span>Back</span>
            </div>
      <div className="content-wrapper-com">
        <h1 className="content-wrapper-head-com">
          From Downtime to Uptime: Shaft & Seal’s Reliability Strategy
        </h1>

        <p className="content-wrapper-para-com">
          As a reliability engineering expert at Shaft & Seal, our goal is to
          systematically eliminate pump failures and increase uptime using a
          structured, data-driven strategy. Our approach integrates
          condition-based analysis, engineering redesign, and modular
          manufacturing, all aligned with international standards such as API
          610, ISO 14224, and ISO 10816.
        </p>

        <h3 className="content-wrapper-heading-com">
          Our strategy follows a 3-tier model:
        </h3>

        <h4 className="content-wrapper-heading-com-head">
          1. Root Cause Analysis (RCA)
        </h4>
        <ul className="content-wrapper-list-com">
          <li>
            We conduct detailed RCAs using tools like the 5 Whys, Fault Tree
            Analysis, and FMEA.
          </li>
          <li>
            Observations from failed pump components are documented with
            photographic and dimensional evidence.
          </li>
          <li>
            Process conditions, such as cavitation, thermal shock, or dry
            running, are analyzed using real-time data logging.
          </li>
          <li>
            We redesign systems based on root cause insights rather than
            replacing parts blindly.
          </li>
        </ul>

         <h4 className="content-wrapper-heading-com-head">2. Redesign for Reliability</h4>
        <ul className="content-wrapper-list-com">
          <li>Corrective design changes based on RCA:</li>
          <ul className="content-wrapper-list-com">
            <li>
              Impeller vane profile modification to address hydraulic imbalance.
            </li>
            <li>
              Bearing housing redesign for better alignment and lubrication.
            </li>
            <li>Shaft material upgrade to increase fatigue strength.</li>
            <li>
              Seal housing upgrades for better tolerance to temperature/pressure
              variations.
            </li>
          </ul>
          <li>
            Simulations in CAD/CAE to validate critical clearances, balance, and
            fits.
          </li>
        </ul>

        <h4 className="content-wrapper-heading-com-head">3. Modular Manufacturing</h4>
        <ul className="content-wrapper-list-com">
          <li>
            Designing interchangeable parts that serve multiple pump types
            across a plant or fleet.
          </li>
          <li>Reduces spare SKUs and enhances spare part readiness.</li>
          <li>
            Use of CNC-machined aluminum patterns and rapid casting to produce
            high-quality components in days, not weeks.
          </li>
          <li>
            Enables on-demand part production aligned with predictive
            maintenance insights.
          </li>
        </ul>

         <h3 className="content-wrapper-heading-com">Additional Focus Areas:</h3>
        <ul className="content-wrapper-list-com">
          <li>MTBF Tracking to validate improvement post-implementation.</li>
          <li>
            ISO-Certified Processes for global reliability standards compliance.
          </li>
          <li>
            Digital Twin Capability for simulation and future failure
            prevention.
          </li>
          <li>
            Field Trials & Monitoring, including hydro-testing at 150% design
            pressure, vibration, and performance monitoring.
          </li>
        </ul>

        <p className="content-wrapper-para-com">
          This layered reliability approach reduces unplanned shutdowns,
          optimizes operational cost, and improves equipment lifecycle.
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

export default ReliableRebuilds;
