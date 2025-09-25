import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './InventoryMinimizationContent.css';
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

const InventoryMinimizationContent = () => {
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
      navigate('/inventory-details');
    } else {
      navigate('/login?from=inventory-minimization');
    }
  };
  return (
    <div className="inventory-minimization-content">
      <Navbar />
      
      <div className="content-header">
        <h1 style={{ color: 'white', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)' }}>
          Inventory Minimization
        </h1>
      </div>

      <div className="content-body">
        <div className="content-section-main">
          <p>
            At Shaft & Seal, we make spare part management simple, cost-effective, and reliable. 
            You don't need to stockpile inventory or tie up working capital.
          </p>
          
          <p className="highlight-text">
            <span className="highlight-black">👉 Share your requirement — we'll keep it in our stock and ship it the moment you need it.</span>
          </p>
        </div>

        <div className="content-section">
          <h2>Why Our Model Works</h2>
          <ul className="benefits-list">
            <li className="benefit-item"><span className="highlight-black">No Capital Blocked</span> – Free your cash from idle inventory.</li>
            <li className="benefit-item"><span className="highlight-black">No Storage Hassle</span> – Reduce warehousing costs and management effort.</li>
            <li className="benefit-item"><span className="highlight-black">No Obsolescence</span> – Spares are maintained fresh and ready-to-use.</li>
            <li className="benefit-item"><span className="highlight-black">Always Available</span> – Critical parts for BB3, BB4, BB5, and vertical pumps ready at short notice.</li>
          </ul>
        </div>

        <div className="content-section">
          <h2>Transparent Pricing for Registered Users</h2>
          <ul className="benefits-list">
            <li className="benefit-item"><span className="highlight-black">Live Online Pricing</span> – Always check current prices via your dashboard.</li>
            <li className="benefit-item"><span className="highlight-black">No Hidden Costs</span> – What you see is exactly what you pay.</li>
            <li className="benefit-item"><span className="highlight-black">No Surprises</span> – Predictable costs help you budget confidently.</li>
            <li className="benefit-item"><span className="highlight-black">Constantly Updated</span> – Reflecting market changes in real time.</li>
          </ul>
        </div>

        <div className="content-section">
          <h2>How It Works</h2>
          <div className="process-list">
            <div className="process-item">
              <span className="process-number">1.</span>
              <span className="process-text"><span className="highlight-black">Share Your Requirement</span> – Tell us the spares you may need.</span>
            </div>
            <div className="process-item">
              <span className="process-number">2.</span>
              <span className="process-text"><span className="highlight-black">We Stock for You</span> – Reserved exclusively in our ready-to-ship inventory.</span>
            </div>
            <div className="process-item">
              <span className="process-number">3.</span>
              <span className="process-text"><span className="highlight-black">Instant Access to Pricing</span> – Registered users can view prices anytime online.</span>
            </div>
            <div className="process-item">
              <span className="process-number">4.</span>
              <span className="process-text"><span className="highlight-black">Fast Dispatch</span> – Parts shipped immediately to minimize downtime.</span>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>Your Advantage</h2>
          <ul className="benefits-list">
            <li className="benefit-item">Lower inventory and storage costs</li>
            <li className="benefit-item">Faster response and reduced downtime</li>
            <li className="benefit-item">Better cash flow and operational efficiency</li>
            <li className="benefit-item">Full transparency with no hidden costs</li>
          </ul>
        </div>


        <div className="content-section">
          <p className="closing-statement">
            Your requirement, our stock. Live pricing. No hidden costs. Always ready.
          </p>
        </div>

        {/* Access Form Section */}
        <div className="access-form-section">
          <h2 className="access-title">Get Started with Inventory Minimization</h2>
          <p className="access-subtitle">
            {isLoggedIn 
              ? "Ready to optimize your spare parts inventory?" 
              : "Please login to access our inventory minimization form and get started with your project."
            }
          </p>
          
          <button onClick={handleAccessForm} className="access-form-btn">
            {isLoggedIn ? "Access Inventory Form" : "Login to Access Form"}
          </button>
        </div>
      </div>

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

export default InventoryMinimizationContent;
