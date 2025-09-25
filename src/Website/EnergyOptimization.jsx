import React, { useState, useEffect } from "react";
import "./EnergyOptimization.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa";
import { AuthService } from "../services/authService";

const EnergyOptimization = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        AuthService.loadStoredCredentials();
        const authenticated = await AuthService.isAuthenticated();
        setIsLoggedIn(authenticated);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleAccessForm = () => {
    if (isLoggedIn) {
      // Navigate to the operational philosophy page
      navigate('/operational-philosophy');
    } else {
      navigate('/login?from=energy-optimization');
    }
  };

  if (isLoading) {
    return (
      <div className="energy-optimization-content">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Energy Optimization page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="energy-optimization-wrapper">
      <div className="energy-optimization-content">
        {/* Navbar */}
        <Navbar />

        {/* Header Section */}
        <div className="content-header">
          <h1>Energy Optimization – Shaft & Seal</h1>
        </div>

        {/* Main Content */}
        <div className="content-body">
          {/* Introduction Section */}
          <div className="content-section-main">
            <p>
              At Shaft & Seal, we specialize in maximizing pump efficiency across BB3, BB4, BB5 multistage pumps and vertical pumps. Our Energy Optimization services help industries reduce operational costs, improve system reliability, and extend equipment life, ensuring your pumps deliver peak performance with minimum energy consumption.
            </p>
          </div>

          {/* Why Energy Optimization Matters */}
          <div className="content-section">
            <h2>Why Energy Optimization Matters</h2>
            <p>
              Industrial pumps are the backbone of critical operations in power plants, petrochemical facilities, water supply, and more. Even small inefficiencies can lead to high energy costs, increased wear, and unplanned downtime. Optimizing pump operation ensures:
            </p>
            <ul className="benefits-list">
              <li className="benefit-item">Lower energy consumption</li>
              <li className="benefit-item">Improved system reliability</li>
              <li className="benefit-item">Extended pump life</li>
              <li className="benefit-item">Reduced environmental footprint</li>
            </ul>
          </div>

          {/* Boiler Feed Water Pump Example */}
          <div className="content-section">
            <h2>Boiler Feed Water Pump – Example Benchmark</h2>
            <p>
              To illustrate our approach, consider Boiler Feed Water Pumps (BFW) using BB3, BB4, BB5, or vertical pump configurations:
            </p>
            
            <div className="benchmark-table-container">
              <table className="benchmark-table">
                <thead>
                  <tr>
                    <th>Boiler Pressure</th>
                    <th>Pump Head (m)</th>
                    <th>Flow per MW</th>
                    <th>Pump Efficiency</th>
                    <th>Power Consumption (kW per MW)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>45 kg/cm²</td>
                    <td>580</td>
                    <td>4 TPH</td>
                    <td>70–75%</td>
                    <td>16 kW</td>
                  </tr>
                  <tr>
                    <td>68 kg/cm²</td>
                    <td>860</td>
                    <td>3.7 TPH</td>
                    <td>70–75%</td>
                    <td>14 kW</td>
                  </tr>
                  <tr>
                    <td>110 kg/cm²</td>
                    <td>1400</td>
                    <td>3.3 TPH</td>
                    <td>70–75%</td>
                    <td>12 kW</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="key-insights">
              <h3>Key Insights:</h3>
              <ul className="insights-list">
                <li>Higher boiler pressure requires higher pump head, but optimized pump design reduces specific energy consumption per MW.</li>
                <li>Energy savings can be further enhanced through impeller trimming, hydraulic refinements, and precise alignment.</li>
                <li>Monitoring power per MW ensures pumps operate at peak efficiency, minimizing energy waste.</li>
              </ul>
            </div>
          </div>

          {/* Energy Optimization Process */}
          <div className="content-section">
            <h2>Our Energy Optimization Process</h2>
            <div className="process-list">
              <div className="process-item">
                <div className="process-number">1</div>
                <div className="process-text">
                  <strong>Performance Audit</strong> – Analyze pumps under actual operating conditions to identify losses.
                </div>
              </div>
              <div className="process-item">
                <div className="process-number">2</div>
                <div className="process-text">
                  <strong>Hydraulic & Mechanical Refinement</strong> – Optimize impellers, shafts, casings, and column assemblies for BB3, BB4, BB5, and vertical pumps.
                </div>
              </div>
              <div className="process-item">
                <div className="process-number">3</div>
                <div className="process-text">
                  <strong>Retrofits & Upgrades</strong> – Replace worn or outdated components with high-efficiency alternatives.
                </div>
              </div>
              <div className="process-item">
                <div className="process-number">4</div>
                <div className="process-text">
                  <strong>Validation & Reporting</strong> – Test optimized pumps and provide clear efficiency metrics and ROI.
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Shaft & Seal */}
          <div className="content-section">
            <h2>Why Choose Shaft & Seal?</h2>
            <ul className="benefits-list">
              <li className="benefit-item">Expertise across multistage and vertical pump configurations</li>
              <li className="benefit-item">Cutting-edge tools for precision optimization</li>
              <li className="benefit-item">Customized solutions for power plants, petrochemicals, water supply, and other industrial sectors</li>
              <li className="benefit-item">Measurable energy savings with reduced operational costs</li>
            </ul>
          </div>

          {/* Closing Statement */}
          <div className="closing-statement">
            At Shaft & Seal, we don't just optimize pumps — we deliver performance, reliability, and energy efficiency. Whether it's BB3, BB4, BB5, or vertical pumps, we ensure your pumps operate at their best, saving energy and improving productivity.
          </div>

          {/* Access Form Section */}
          <div className="access-form-section">
            <h2 className="access-title">Get Started with Energy Optimization</h2>
            <p className="access-subtitle">
              {isLoggedIn 
                ? "Ready to start your energy optimization project? Access our detailed analysis form to choose your operation philosophy and provide specifications for your BB3, BB4, BB5, or vertical pump systems to receive precision-optimized solutions." 
                : "Please login to access our energy optimization form and get started with your project."
              }
            </p>
            
            <button onClick={handleAccessForm} className="access-form-btn">
              {isLoggedIn ? "Choose Your Operation Philosophy" : "Login to Access Form"}
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
      </div>
    </div>
  );
};

export default EnergyOptimization;