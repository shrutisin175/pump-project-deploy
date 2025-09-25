import React from "react";
import "./ReverseEngineeringContent.css";
import Navbar from "./Navbar";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

const ReverseEngineeringContent = () => {
  return (
    <div className="reverse-engineering-content">
      {/* Navbar */}
      <Navbar />
      
      <div className="content-header">
        <h1>Reverse Engineering of Pumping Systems</h1>
        <p>Complete reverse engineering of pump components using advanced CAD/CAM technology and precision metrology.</p>
      </div>
      
      <div className="content-body">
        <div className="content-section">
          <h2>Our Reverse Engineering Process</h2>
          
          <div className="pdf-content">
            <div className="content-section-main">
              <h2>Reverse Engineering Services</h2>
              <p>At Shaft & Seal, we specialize in precision Reverse Engineering of industrial pumps, ensuring our clients receive reliable, efficient, and cost-effective solutions for their critical equipment. With years of expertise in pump technology, we offer tailored reverse engineering services for BB3, BB4, BB5 type multistage pumps as well as vertical pumps, delivering unmatched accuracy and performance. At Shaft & Seal, we don't just reproduce parts — we engineer reliability, efficiency, and long-term value.</p>
            </div>

            <div className="content-section-main">
              <h2>Why Reverse Engineering?</h2>
              <p>Over time, industrial pumps face wear, component failure, or discontinuation of OEM support. In such cases, reverse engineering becomes the most practical approach to restore functionality without compromising performance. Our process helps industries reduce downtime, extend pump life, and optimize operations while saving significantly on replacement costs.</p>
            </div>

            <div className="content-section-main">
              <h2>Our Process</h2>
              <div className="process-list">
                <div className="process-item">
                  <span className="process-number">1.</span>
                  <span className="process-text">Detailed Inspection & Analysis – Each component is inspected for material composition, dimensions, and wear patterns.</span>
                </div>
                <div className="process-item">
                  <span className="process-number">2.</span>
                  <span className="process-text">3D Scanning & Modeling – Advanced tools create highly accurate CAD models of pump parts.</span>
                </div>
                <div className="process-item">
                  <span className="process-number">3.</span>
                  <span className="process-text">Material & Metallurgy Study – Ensuring the right selection of alloys and materials for durability.</span>
                </div>
                <div className="process-item">
                  <span className="process-number">4.</span>
                  <span className="process-text">Manufacturing & Testing – Components are reproduced with OEM-level precision and tested for fit, tolerance, and reliability.</span>
                </div>
              </div>
            </div>

            <div className="content-section-main">
              <h2>Applications in BB3, BB4, BB5 & Vertical Pumps</h2>
              <div className="applications-list">
                <div className="application-item">
                  <h3>• BB3 (Axially Split Multistage Pumps):</h3>
                  <p>Accurate reproduction of casings, impellers, and shafts for critical high-pressure applications.</p>
                </div>
                <div className="application-item">
                  <h3>• BB4 (Ring Section Multistage Pumps):</h3>
                  <p>Reverse engineering for complex rotor assemblies and high-energy services.</p>
                </div>
                <div className="application-item">
                  <h3>• BB5 (Double Casing Multistage Pumps):</h3>
                  <p>Advanced engineering to replicate high-pressure, high-temperature components.</p>
                </div>
                <div className="application-item">
                  <h3>• Vertical Pumps:</h3>
                  <p>Comprehensive solutions for columns, bowls, impellers, and shaft systems, ensuring smooth vertical operation.</p>
                </div>
              </div>
            </div>

            <div className="content-section-main">
              <h2>Why Choose Shaft & Seal?</h2>
              <div className="benefits-list">
                <div className="benefit-item">• Expertise in high-end reverse engineering</div>
                <div className="benefit-item">• State-of-the-art tools for precision design & manufacturing</div>
                <div className="benefit-item">• Quick turnaround with reduced downtime</div>
                <div className="benefit-item">• Customized solutions for demanding industries such as oil & gas, power plants, petrochemicals, and water supply</div>
              </div>
            </div>

            <div className="content-section-main">
              <p className="closing-statement">Let us help you bring your pumps back to life with our world-class reverse engineering solutions.</p>
            </div>
          </div>

          <div className="download-section">
            <h2>Download Complete Documentation</h2>
            <p>Get the full technical specifications and detailed process documentation.</p>
            <a 
              href="/Reverse Engineering (1).pdf" 
              download="Reverse Engineering Guide.pdf"
              className="download-btn"
            >
              📄 Download Full Document
            </a>
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

export default ReverseEngineeringContent;
