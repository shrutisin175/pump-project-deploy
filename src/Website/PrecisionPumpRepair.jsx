import React from "react";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaArrowLeft,
} from "react-icons/fa";
import "./PrecisionPumpRepair.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const PrecisionPumpRepair = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="precision-pump-container">
        <Navbar />
        <div className="back-arrow" onClick={() => navigate("/")}>
          <FaArrowLeft />
          <span>Back</span>
        </div>
        <h1 className="precision-pump-container-head">
          Precision Pump Repair Process
        </h1>

        <p className="precision-pump-container-para">
          As a Senior Pump Specialist, I present the comprehensive process of
          precision pump repair – a step-by-step methodology followed to restore
          critical pump systems to peak performance and reliability.
        </p>

        <h3 className="precision-pump-container-head-com">1. Receipt of Pump</h3>
        <ul className="precision-pump-container-list-com">
          <li>
            The pump is received at the service center or workshop and logged
            into the system with photographs.
          </li>
          <li>
            A unique job number is assigned for tracking and traceability.
          </li>
        </ul>

        <h3 className="precision-pump-container-head-com">
          2. Cleaning & Initial Inspection
        </h3>
        <ul className="precision-pump-container-list-com">
          <li>
            External surfaces are cleaned using degreasing solvents and pressure
            washing.
          </li>
          <li>
            Visual inspection is conducted to check for cracks, deformation, or
            corrosion.
          </li>
        </ul>

        <h3 className="precision-pump-container-head-com">
          3. Marking of Parts for Ease of Assembly
        </h3>
        <ul className="precision-pump-container-list-com">
          <li>
            All components are marked with serial numbers or color codes to
            ensure proper reassembly.
          </li>
          <li>
            Orientation marks are added to casing, impeller, wear rings, and
            diffusers.
          </li>
        </ul>

        <h3 className="precision-pump-container-head-com">4. Dismantling of Pump</h3>
        <ul className="precision-pump-container-list-com">
          <li>
            The pump is dismantled stage-by-stage using specialized tools to
            prevent component damage.
          </li>
          <li>
            Observations are documented, especially unusual wear or assembly
            deviations.
          </li>
        </ul>

        <h3 className="precision-pump-container-head-com">
          5. Identifying Damaged Parts
        </h3>
        <ul className="precision-pump-container-list-com">
          <li>Components are inspected for wear, cracks, pitting, or corrosion.</li>
          <li>
            Impellers, shafts, sleeves, wear rings, bushings, and mechanical
            seals are examined.
          </li>
          <li>
            Decisions are made whether parts require replacement or can be
            refurbished.
          </li>
        </ul>

        <h3 className="precision-pump-container-head-com">
          6. Commercial Proposal to Customer
        </h3>
        <ul className="precision-pump-container-list-com">
          <li>
            A detailed service report and damage assessment is prepared.
          </li>
          <li>
            Commercial proposal includes repair costs, spare part costs,
            delivery timelines, and warranty.
          </li>
          <li>
            Optional upgrades or modifications are recommended.
          </li>
        </ul>

        <h3 className="precision-pump-container-head-com">
          7. Dimensional & Metallurgical Verification
        </h3>
        <ul className="precision-pump-container-list-com">
          <li>
            Critical dimensions are measured using calipers, micrometers, and
            CMM tools.
          </li>
          <li>
            Hardness testing and metallurgical analysis (spectro or
            microstructure) is performed to confirm material properties.
          </li>
          <li>
            Dimensional comparison is done against OEM drawings or industry
            standards.
          </li>
        </ul>

        <h3 className="precision-pump-container-head-com">
          8. Sourcing or Rebuilding of Parts
        </h3>
        <ul className="precision-pump-container-list-com">
          <li>
            Required components are either sourced from OEMs or rebuilt in-house
            using reverse engineering.
          </li>
          <li>
            Worn impellers, sleeves, or shafts are reconditioned using welding,
            grinding, or coating techniques.
          </li>
          <li>
            Precision machining and balancing ensure they meet design tolerances.
          </li>
        </ul>

        <h3 className="precision-pump-container-head-com">
          9. Rotor Assembly & Balancing
        </h3>
        <ul className="precision-pump-container-list-com">
          <li>
            Shaft, impellers, sleeves, and keys are assembled to form the rotor.
          </li>
          <li>
            The complete rotor is dynamically balanced to ISO Grade 2.5 to
            minimize vibration and enhance bearing life.
          </li>
        </ul>

        <h3 className="precision-pump-container-head-com">
          10. Clearance & Tolerance Maintenance
        </h3>
        <ul className="precision-pump-container-list-com">
          <li>
            Rotating-to-stationary clearances (e.g., impeller to wear ring) are
            checked and set according to API 610 or OEM specs.
          </li>
          <li>
            Axial float, shaft end-play, and bearing fits are precisely
            controlled.
          </li>
        </ul>

        <h3 className="precision-pump-container-head-com">11. Reassembly of Pump</h3>
        <ul className="precision-pump-container-list-com">
          <li>
            The pump is reassembled in a clean and controlled environment.
          </li>
          <li>
            Bearings, mechanical seals, and O-rings are replaced with new ones.
          </li>
          <li>Torque settings are applied as per specifications.</li>
        </ul>

        <h3 className="precision-pump-container-head-com">
          12. Hydrostatic Testing
        </h3>
        <ul className="precision-pump-container-list-com">
          <li>
            The assembled pump is filled with water and hydro-tested at 150% of
            its maximum working pressure.
          </li>
          <li>
            The casing and seal joints are observed for leakage for 30 minutes.
          </li>
          <li>Test certificates are generated and documented.</li>
        </ul>

        <h3 className="precision-pump-container-head-com">
          13. Final Painting & Preservation
        </h3>
        <ul className="precision-pump-container-list-com">
          <li>
            The pump is cleaned and painted with corrosion-resistant paint per
            customer specification (epoxy, PU, etc.).
          </li>
          <li>
            Shaft and sealing surfaces are coated with rust-preventive oil.
          </li>
        </ul>

        <h3 className="precision-pump-container-head-com">
          14. Packaging & Dispatch
        </h3>
        <ul className="precision-pump-container-list-com">
          <li>
            The pump is packed with moisture-proof wrapping and mounted on
            treated wooden pallets.
          </li>
          <li>
            All ports are sealed; handling instructions and shipping documents
            are included.
          </li>
        </ul>

        <h3 className="precision-pump-container-head-com">15. Final Site Trial</h3>
        <ul className="precision-pump-container-list-com">
          <li>Optional site commissioning and alignment support is provided.</li>
          <li>
            The pump is installed, aligned with the motor, and trial run is
            performed.
          </li>
          <li>
            Flow, pressure, vibration, temperature, and noise levels are
            monitored.
          </li>
          <li>Handover is done with full documentation and warranty activation.</li>
        </ul>

        <p className="precision-pump-container-para">
          This rigorous, detail-oriented repair process ensures that every
          repaired pump from Shaft & Seal operates as reliably as a new unit –
          minimizing downtime and extending lifecycle performance.
        </p>
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

export default PrecisionPumpRepair;
