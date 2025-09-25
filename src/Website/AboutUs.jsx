import React from "react";
import "./AboutUs.css";
import logoImage from "./logo.jpg"; // Make sure this is the same logo as in the image
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaYoutube, FaInstagram, FaFacebook, FaArrowLeft, FaCog, FaBolt, FaRecycle, FaCheckCircle, FaCrosshairs, FaSeedling, FaWrench } from "react-icons/fa";

const AboutUs = () => {
     const navigate = useNavigate();
  return (
    <div className="about-us-login">
      {/* Custom Styled Header (based on screenshot) */}
      <Navbar />
      
      <div className="about-us-header-banner">
        <div className="about-us-header-right">
          <h1>SHAFT N SEAL (OPC) PRIVATE LTD</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-us-login-box">
        <div className="about-us-hero-section">
          <h2>About Shaft & Seal</h2>
          <p className="about-us-hero-text">
            <strong>Shaft & Seal OPC Pvt. Ltd.</strong> is a specialized engineering firm committed to innovation, quality,
            and cost-effective solutions in the field of <strong>reverse engineering of pumps and pump spares</strong>.
            With a particular focus on <strong>Boiler Feed Pumps</strong>, <strong>Condensate Pumps</strong>, and other high-performance
            industrial pumps, we serve power plants, chemical industries, refineries, and manufacturing units across India.
          </p>
          <p className="about-us-hero-text">
            We are driven by a passion for mechanical precision and problem-solving. Our work ensures extended equipment
            life, optimized performance, and significant cost savings for our clients.
          </p>
        </div>

        <div className="about-us-services-section">
          <h2>Our Core Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon"><FaWrench /></div>
              <h3>Reverse Engineering of Pump Spares</h3>
              <p>Shaft sleeves, impellers, wear rings, casings, and other critical components with precision engineering.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><FaBolt /></div>
              <h3>Energy Saving Solutions</h3>
              <p>Efficiency audits, hydraulic redesigns, and customized retrofits for optimal performance.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><FaRecycle /></div>
              <h3>Obsolete Pump Support</h3>
              <p>Custom spares for discontinued pump models to extend equipment lifecycle.</p>
            </div>
          </div>
        </div>

        <div className="about-us-why-choose">
          <h2>Why Choose Shaft & Seal?</h2>
          <div className="highlights-grid">
            <div className="highlight-item">
              <div className="highlight-icon"><FaCheckCircle /></div>
              <span>Precision Engineering with CAD, CAM, Metrology</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon"><FaCheckCircle /></div>
              <span>Energy Optimization & Cost Efficiency</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon"><FaCheckCircle /></div>
              <span>Quick Turnaround for Critical Systems</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon"><FaCheckCircle /></div>
              <span>Focused Attention & Accountability (OPC Model)</span>
            </div>
          </div>
        </div>

        <div className="about-us-vision-section">
          <h2>Our Vision</h2>
          <div className="vision-content">
            <p>To be the most trusted partner for reverse engineering and pump efficiency solutions, driving innovation in industrial pump technology.</p>
          </div>
        </div>

        <div className="about-us-mission-section">
          <h2>Our Mission</h2>
          <div className="mission-content">
            <div className="mission-points">
              <div className="mission-point">
                <div className="mission-icon"><FaCrosshairs /></div>
                <span>Deliver high-quality components with fast turnaround</span>
              </div>
              <div className="mission-point">
                <div className="mission-icon"><FaSeedling /></div>
                <span>Reduce industrial energy waste via pump system redesign</span>
              </div>
              <div className="mission-point">
                <div className="mission-icon"><FaWrench /></div>
                <span>Support legacy systems through precision manufacturing</span>
              </div>
            </div>
          </div>
        </div>

        <div className="about-us-expertise">
          <h2>Our Expertise</h2>
          <div className="expertise-grid">
            <div className="expertise-card">
              <h4>Boiler Feed Pumps</h4>
              <p>Specialized in high-pressure boiler feed pump components and efficiency optimization.</p>
            </div>
            <div className="expertise-card">
              <h4>Condensate Pumps</h4>
              <p>Expert reverse engineering and performance enhancement for condensate systems.</p>
            </div>
            <div className="expertise-card">
              <h4>Industrial Pumps</h4>
              <p>Comprehensive solutions for various industrial pump applications and maintenance.</p>
            </div>
            <div className="expertise-card">
              <h4>Energy Audits</h4>
              <p>Detailed energy efficiency analysis and optimization recommendations.</p>
            </div>
          </div>
        </div>

        {/* Industry Info moved to bottom */}
        <div className="about-us-industry-section">
          <h3>Industry Focus</h3>
          <p><strong>Industry:</strong> Engineering Services | Mechanical Components | Industrial Solutions | Boiler Feed Pump</p>
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

export default AboutUs;
