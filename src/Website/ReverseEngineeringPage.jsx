import React, { useState, useEffect } from "react";
import { FaYoutube, FaInstagram, FaFacebook, FaTwitter, FaArrowLeft, FaUser, FaLock } from "react-icons/fa";
import "./ReverseEngineeringPage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthService } from "../services/authService";

const ReverseEngineeringPage = () => {
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
      navigate('/pump-details-form');
    } else {
      navigate('/login?from=reverse-engineering');
    }
  };


  return (
    <>
      <div className="reverse-engineering-page">
        <Navbar />
        
        <h1 className="reverse-engineering-page-head">Reverse Engineering Services</h1>
        
        <div className="content-section-main">
          <p>
            At Shaft & Seal, we specialize in precision Reverse Engineering of industrial pumps, ensuring our clients receive reliable, efficient, and cost-effective solutions for their critical equipment. With years of expertise in pump technology, we offer tailored reverse engineering services for BB3, BB4, BB5 type multistage pumps as well as vertical pumps, delivering unmatched accuracy and performance. At Shaft & Seal, we don't just reproduce parts — we engineer reliability, efficiency, and long-term value
          </p>
        </div>

        <div className="content-section">
          <h2>Why Reverse Engineering?</h2>
          <p>
            Over time, industrial pumps face wear, component failure, or discontinuation of OEM support. In such cases, reverse engineering becomes the most practical approach to restore functionality without compromising performance. Our process helps industries reduce downtime, extend pump life, and optimize operations while saving significantly on replacement costs.
          </p>
        </div>

        <div className="content-section">
          <h2>Our Process</h2>
          <div className="process-list">
            <div className="process-item">
              <div className="process-number">1</div>
              <div className="process-text">
                <strong>Detailed Inspection & Analysis</strong> – Each component is inspected for material composition, dimensions, and wear patterns.
              </div>
            </div>
            <div className="process-item">
              <div className="process-number">2</div>
              <div className="process-text">
                <strong>3D Scanning & Modeling</strong> – Advanced tools create highly accurate CAD models of pump parts.
              </div>
            </div>
            <div className="process-item">
              <div className="process-number">3</div>
              <div className="process-text">
                <strong>Material & Metallurgy Study</strong> – Ensuring the right selection of alloys and materials for durability.
              </div>
            </div>
            <div className="process-item">
              <div className="process-number">4</div>
              <div className="process-text">
                <strong>Manufacturing & Testing</strong> – Components are reproduced with OEM-level precision and tested for fit, tolerance, and reliability.
              </div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>Applications in BB3, BB4, BB5 & Vertical Pumps</h2>
          <ul className="benefits-list">
            <li className="benefit-item"><strong>BB3 (Axially Split Multistage Pumps):</strong> Accurate reproduction of casings, impellers, and shafts for critical high-pressure applications.</li>
            <li className="benefit-item"><strong>BB4 (Ring Section Multistage Pumps):</strong> Reverse engineering for complex rotor assemblies and high-energy services.</li>
            <li className="benefit-item"><strong>BB5 (Double Casing Multistage Pumps):</strong> Advanced engineering to replicate high-pressure, high-temperature components.</li>
            <li className="benefit-item"><strong>Vertical Pumps:</strong> Comprehensive solutions for columns, bowls, impellers, and shaft systems, ensuring smooth vertical operation.</li>
          </ul>
        </div>

        <div className="content-section">
          <h2>Why Choose Shaft & Seal?</h2>
          <ul className="benefits-list">
            <li className="benefit-item">Expertise in high-end reverse engineering</li>
            <li className="benefit-item">State-of-the-art tools for precision design & manufacturing</li>
            <li className="benefit-item">Quick turnaround with reduced downtime</li>
            <li className="benefit-item">Customized solutions for demanding industries such as oil & gas, power plants, petrochemicals, and water supply</li>
          </ul>
        </div>

        <div className="closing-statement">
          Let us help you bring your pumps back to life with our world-class reverse engineering solutions.
        </div>

        {/* Access Form Section */}
        <div className="access-form-section">
          <h2 className="access-title">Get Started with Reverse Engineering</h2>
          <p className="access-subtitle">
            {isLoggedIn 
              ? "Ready to start your reverse engineering project? Access our detailed pump assessment form." 
              : "Please login to access our pump details form and get started with your reverse engineering project."
            }
          </p>
          
          <button onClick={handleAccessForm} className="access-form-btn">
            {isLoggedIn ? "Access Pump Details Form" : "Login to Access Form"}
          </button>
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
    </>
  );
};

export default ReverseEngineeringPage;
