import React from "react";
import "./PrivacyPolicy.css";
import logoImage from "./logo.jpg";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaArrowLeft } from "react-icons/fa";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-container">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="privacy-content">
        <h1>Privacy Policy</h1>
        
        <div className="privacy-section">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, 
            contact us, or subscribe to our services. This may include:
          </p>
          <ul>
            <li>Name and contact information (email, phone number, address)</li>
            <li>Company information and job title</li>
            <li>Technical specifications and requirements</li>
            <li>Communication preferences</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and fulfill your orders and requests</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and customer service requests</li>
            <li>Communicate with you about products, services, and events</li>
            <li>Monitor and analyze trends, usage, and activities</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            without your consent, except as described in this policy. We may share your information in the following circumstances:
          </p>
          <ul>
            <li>With your consent or at your direction</li>
            <li>With service providers who perform services on our behalf</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights, property, or safety</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or destruction. 
            However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>
        </div>

        <div className="privacy-section">
          <h2>5. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our website. 
            These technologies help us:
          </p>
          <ul>
            <li>Remember your preferences and settings</li>
            <li>Analyze how our website is used</li>
            <li>Provide personalized content and advertisements</li>
            <li>Improve our services and user experience</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>6. Your Rights and Choices</h2>
          <p>You have certain rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> You can request access to your personal information</li>
            <li><strong>Correction:</strong> You can request correction of inaccurate information</li>
            <li><strong>Deletion:</strong> You can request deletion of your personal information</li>
            <li><strong>Portability:</strong> You can request a copy of your data in a portable format</li>
            <li><strong>Opt-out:</strong> You can opt out of marketing communications</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our services, 
            comply with legal obligations, resolve disputes, and enforce our agreements. The specific 
            retention period depends on the type of information and the purpose for which it was collected.
          </p>
        </div>

        <div className="privacy-section">
          <h2>8. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. 
            We ensure that such transfers comply with applicable data protection laws and implement 
            appropriate safeguards to protect your information.
          </p>
        </div>

        <div className="privacy-section">
          <h2>9. Children's Privacy</h2>
          <p>
            Our services are not intended for children under the age of 13. We do not knowingly 
            collect personal information from children under 13. If you believe we have collected 
            information from a child under 13, please contact us immediately.
          </p>
        </div>

        <div className="privacy-section">
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
            We encourage you to review this policy periodically.
          </p>
        </div>

        <div className="privacy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> sales@shaftnseal.com<br />
            <strong>Phone:</strong> +91-82796-73706<br />
            <strong>Address:</strong> Plot No 4, Sahajanand Industrial Hub, Kathwada GIDC, Near Kotak Mahindra Bank, Ahmedabad – 382433, Gujarat
          </p>
          <p><strong>Last Updated:</strong> January 2025</p>
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

export default PrivacyPolicy; 