import React from "react";
import "./TermsConditions.css";
import logoImage from "./logo.jpg";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaArrowLeft } from "react-icons/fa";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="terms-content">
        <h1>Terms & Conditions</h1>
        
        <div className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Shaft & Seal website and services, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </div>

        <div className="terms-section">
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Shaft & Seal's website for personal, non-commercial transitory viewing only.
          </p>
          <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>3. Disclaimer</h2>
          <p>
            The materials on Shaft & Seal's website are provided on an 'as is' basis. Shaft & Seal makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </div>

        <div className="terms-section">
          <h2>4. Limitations</h2>
          <p>
            In no event shall Shaft & Seal or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Shaft & Seal's website, even if Shaft & Seal or a Shaft & Seal authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </div>

        <div className="terms-section">
          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on Shaft & Seal's website could include technical, typographical, or photographic errors. Shaft & Seal does not warrant that any of the materials on its website are accurate, complete or current. Shaft & Seal may make changes to the materials contained on its website at any time without notice.
          </p>
        </div>

        <div className="terms-section">
          <h2>6. Links</h2>
          <p>
            Shaft & Seal has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Shaft & Seal of the site. Use of any such linked website is at the user's own risk.
          </p>
        </div>

        <div className="terms-section">
          <h2>7. Modifications</h2>
          <p>
            Shaft & Seal may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
          </p>
        </div>

        <div className="terms-section">
          <h2>8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </div>

        <div className="terms-section">
          <h2>Contact Information</h2>
          <p>
            If you have any questions about these Terms & Conditions, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> sales@shaftnseal.com<br />
            <strong>Phone:</strong> +91-82796-73706<br />
            <strong>Address:</strong> Plot No 4, Sahajanand Industrial Hub, Kathwada GIDC, Near Kotak Mahindra Bank, Ahmedabad – 382433, Gujarat
          </p>
        </div>
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

export default TermsConditions; 