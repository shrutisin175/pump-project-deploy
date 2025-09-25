import React from "react";
import "./CentrifugalPumps.css";
import Navbar from "./Navbar";
import { FaWater, FaIndustry, FaTools, FaCog, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CentrifugalPumps = () => {
  const navigate = useNavigate();

  return (
    <div className="centrifugal-pumps-container">
      <Navbar />

      {/* Hero Section */}
      <div className="centrifugal-pumps-hero">
        <div className="centrifugal-pumps-hero-content">
          <button className="back-btn" onClick={() => navigate("/products")}>
            <FaArrowLeft /> Back to Products
          </button>
          <h1>Centrifugal Pumps</h1>
          <p>High-performance centrifugal pump solutions for industrial applications</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="centrifugal-pumps-main-content">
        <div className="centrifugal-pumps-grid">
          
          {/* Centrifugal Pump Image */}
          <div className="centrifugal-pump-image-section">
            <div className="pump-image-container">
              <div className="pump-image-placeholder">
                <FaWater className="pump-icon" />
                <p>Centrifugal Pump Image</p>
              </div>
            </div>
            <div className="image-caption">
              <h3>Industrial Centrifugal Pump</h3>
              <p>High-efficiency design for optimal performance in demanding industrial environments</p>
            </div>
          </div>

          {/* Product Details */}
          <div className="centrifugal-pump-details">
            <div className="details-card">
              <h2>Product Overview</h2>
              <p>Our centrifugal pumps are engineered for high-pressure applications, particularly in power plants and industrial facilities. These pumps deliver exceptional performance, reliability, and energy efficiency.</p>
              
              <div className="specifications">
                <h3>Key Specifications</h3>
                <div className="spec-grid">
                  <div className="spec-item">
                    <FaIndustry className="spec-icon" />
                    <div>
                      <h4>Pressure Rating</h4>
                      <p>Up to 350 bar</p>
                    </div>
                  </div>
                  <div className="spec-item">
                    <FaWater className="spec-icon" />
                    <div>
                      <h4>Flow Capacity</h4>
                      <p>50 - 2000 m³/h</p>
                    </div>
                  </div>
                  <div className="spec-item">
                    <FaCog className="spec-icon" />
                    <div>
                      <h4>Power Range</h4>
                      <p>75 - 5000 kW</p>
                    </div>
                  </div>
                  <div className="spec-item">
                    <FaTools className="spec-icon" />
                    <div>
                      <h4>Efficiency</h4>
                      <p>85 - 92%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="features">
                <h3>Key Features</h3>
                <div className="feature-list">
                  <div className="feature-item">✓ High-pressure boiler feed applications</div>
                  <div className="feature-item">✓ Corrosion-resistant materials</div>
                  <div className="feature-item">✓ Energy-efficient design</div>
                  <div className="feature-item">✓ Low maintenance requirements</div>
                  <div className="feature-item">✓ Long service life</div>
                  <div className="feature-item">✓ Custom specifications available</div>
                </div>
              </div>

              <div className="applications">
                <h3>Applications</h3>
                <div className="application-grid">
                  <div className="application-item">
                    <h4>Power Generation</h4>
                    <p>Boiler feed systems, cooling water circulation</p>
                  </div>
                  <div className="application-item">
                    <h4>Oil & Gas</h4>
                    <p>Pipeline transportation, refinery processes</p>
                  </div>
                  <div className="application-item">
                    <h4>Chemical Processing</h4>
                    <p>Chemical transfer, process circulation</p>
                  </div>
                  <div className="application-item">
                    <h4>Water Treatment</h4>
                    <p>Municipal water supply, industrial filtration</p>
                  </div>
                </div>
              </div>

              <div className="cta-section">
                <h3>Ready to Get Started?</h3>
                <p>Contact our team for custom specifications, pricing, and technical support.</p>
                <div className="cta-buttons">
                  <button className="primary-btn" onClick={() => navigate("/contact")}>
                    Get Quote
                  </button>
                  <button className="secondary-btn" onClick={() => navigate("/pump-parts")}>
                    Request Parts
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="footer-audit-paragraph">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Contact Information</h4>
            <p>Email: info@pumpexperts.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Industrial Way, Tech City, TC 12345</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Pump Experts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CentrifugalPumps;
