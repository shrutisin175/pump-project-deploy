import React, { useState } from 'react';
import './PumpPartsForm.css';
import { FaArrowLeft, FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const PumpPartsForm = () => {
  const [pumpMake, setPumpMake] = useState('');
  const [partNo, setPartNo] = useState('');
  const [moc, setMoc] = useState('');
  const [itemType, setItemType] = useState('');
  const [showPumpMake, setShowPumpMake] = useState(false);
  const [showPartNo, setShowPartNo] = useState(false);
  const [showMoc, setShowMoc] = useState(false);
  const [showItemType, setShowItemType] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="flow-chart">
        <Navbar />
        <div className="back-arrows" onClick={() => navigate("/")}>
          <FaArrowLeft />
          <span>Back</span>
        </div>

        <div className="flow-row">

          <div className="box" onClick={() => setShowPumpMake(!showPumpMake)}>
            Pump Make
            {showPumpMake && (
              <select
                className="dropdown"
                value={pumpMake}
                onChange={(e) => setPumpMake(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Make1">Make1</option>
                <option value="Make2">Make2</option>
              </select>
            )}
          </div>

          <div className="arrow">→</div>

          <div className="box">Pump Model</div>

          <div className="arrow">→</div>

         <div className="box" onClick={() => setShowItemType(!showItemType)}>
    Size
    {showItemType && (
      <select
        className="dropdown"
        value={itemType}
        onChange={(e) => setItemType(e.target.value)}
      >
        <option value="">Select</option>
        <option value="common">Common Item</option>
        <option value="unique">Unique Item</option>
      </select>
    )}
  </div>

          <div className="arrow">→</div>

          <div className="box" onClick={() => setShowPartNo(!showPartNo)}>
            Part No
            {showPartNo && (
              <select
                className="dropdown"
                value={partNo}
                onChange={(e) => setPartNo(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Part1">Part1</option>
                <option value="Part2">Part2</option>
              </select>
            )}
          </div>

          <div className="arrow">→</div>

          <div className="box">Part Name</div>

          <div className="arrow">→</div>

          <div className="box" onClick={() => setShowMoc(!showMoc)}>
            MOC
            {showMoc && (
              <select
                className="dropdown"
                value={moc}
                onChange={(e) => setMoc(e.target.value)}
              >
                <option value="">Select</option>
                <option value="SS">SS</option>
                <option value="CI">CI</option>
              </select>
            )}
          </div>

          <div className="arrow">→</div>

          <div className="box">Unit Price</div>

          <div className="arrow">→</div>

          <div className="box">Available Qty</div>

          <div className="arrow">→</div>

          <div className="box">Drg.</div>

          <div className="arrow">→</div>

          <div className="box highlight">
            <button className="add-btn">Add to Cart</button>
          </div>
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
    </>
  );
};

export default PumpPartsForm;
