import React from "react";
import "./AlliedProducts.css";
import Navbar from "./Navbar";
import { FaIndustry, FaTools, FaCog, FaArrowLeft } from "react-icons/fa";
import { MdPrecisionManufacturing } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AlliedProducts = () => {
  const navigate = useNavigate();

  return (
    <div className="allied-products-container">
      <Navbar />

      {/* Hero Section */}
      <div className="allied-products-hero">
        <div className="allied-products-hero-content">
          <button className="back-btn" onClick={() => navigate("/products")}>
            <FaArrowLeft /> Back to Products
          </button>
          <h1>Allied Products</h1>
          <p>Comprehensive range of industrial pump components and allied equipment</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="allied-products-main-content">
        <div className="allied-products-grid">
          
          {/* Allied Products Image */}
          <div className="allied-products-image-section">
            <div className="products-image-container">
              <div className="products-image-placeholder">
                <MdPrecisionManufacturing className="products-icon" />
                <p>Allied Products Image</p>
              </div>
            </div>
            <div className="image-caption">
              <h3>Industrial Allied Products</h3>
              <p>High-quality components and equipment for various industrial applications</p>
            </div>
          </div>

          {/* Product Details */}
          <div className="allied-products-details">
            <div className="details-card">
              <h2>Product Overview</h2>
              <p>Our allied products encompass a wide range of industrial components including condensate pumps, mechanical seals, bearings, couplings, and specialized equipment designed for optimal performance in demanding industrial environments.</p>
              
              <div className="specifications">
                <h3>Key Specifications</h3>
                <div className="spec-grid">
                  <div className="spec-item">
                    <FaIndustry className="spec-icon" />
                    <div>
                      <h4>Temperature Range</h4>
                      <p>-40°C to +400°C</p>
                    </div>
                  </div>
                  <div className="spec-item">
                    <MdPrecisionManufacturing className="spec-icon" />
                    <div>
                      <h4>Material Options</h4>
                      <p>Stainless Steel, Cast Iron, Bronze</p>
                    </div>
                  </div>
                  <div className="spec-item">
                    <FaCog className="spec-icon" />
                    <div>
                      <h4>Pressure Rating</h4>
                      <p>Up to 100 bar</p>
                    </div>
                  </div>
                  <div className="spec-item">
                    <FaTools className="spec-icon" />
                    <div>
                      <h4>Certification</h4>
                      <p>ISO 9001, CE Marked</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="features">
                <h3>Key Features</h3>
                <div className="feature-list">
                  <div className="feature-item">✓ Steam-resistant materials</div>
                  <div className="feature-item">✓ Long service life</div>
                  <div className="feature-item">✓ Maintenance-friendly design</div>
                  <div className="feature-item">✓ Corrosion protection</div>
                  <div className="feature-item">✓ Energy-efficient operation</div>
                  <div className="feature-item">✓ Custom specifications available</div>
                </div>
              </div>

              <div className="applications">
                <h3>Applications</h3>
                <div className="application-grid">
                  <div className="application-item">
                    <h4>Steam Power Systems</h4>
                    <p>Condensate return, boiler feed systems</p>
                  </div>
                  <div className="application-item">
                    <h4>Chemical Processing</h4>
                    <p>Chemical transfer, process circulation</p>
                  </div>
                  <div className="application-item">
                    <h4>Water Treatment</h4>
                    <p>Filtration, purification systems</p>
                  </div>
                  <div className="application-item">
                    <h4>Industrial Manufacturing</h4>
                    <p>Cooling systems, lubrication</p>
                  </div>
                </div>
              </div>

              <div className="product-categories">
                <h3>Product Categories</h3>
                <div className="category-grid">
                  <div className="category-item">
                    <h4>Mechanical Seals</h4>
                    <p>Single and double mechanical seals for various applications</p>
                  </div>
                  <div className="category-item">
                    <h4>Bearings & Couplings</h4>
                    <p>High-quality bearings and flexible couplings</p>
                  </div>
                  <div className="category-item">
                    <h4>Gaskets & Seals</h4>
                    <p>Industrial gaskets and sealing solutions</p>
                  </div>
                  <div className="category-item">
                    <h4>Specialty Equipment</h4>
                    <p>Custom-engineered components and systems</p>
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

export default AlliedProducts;
