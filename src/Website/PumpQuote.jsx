import React, { useState, useEffect } from 'react';
import './PumpQuote.css';
import { FaArrowLeft, FaPrint, FaDownload, FaEdit, FaSave } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const PumpQuote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get data from navigation state or use defaults
  const [quoteData, setQuoteData] = useState({
    selectedParts: [],
    customerInfo: {
      refNo: '',
      date: '',
      customerName: '',
      customerAddress: '',
      deliveryLocation: 'Mumbai, Maharashtra',
      deliveryWeeks: '2-3 weeks'
    }
  });

  useEffect(() => {
    if (location.state) {
      setQuoteData(location.state);
    }
  }, [location.state]);

  const handleCustomerInfoChange = (field, value) => {
    setQuoteData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [field]: value
      }
    }));
  };

  const calculateTotal = () => {
    return quoteData.selectedParts.reduce((sum, part) => sum + part.unitPrice, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you could save to localStorage or send to backend
    console.log('Quote saved:', quoteData);
  };

  if (!quoteData.selectedParts || quoteData.selectedParts.length === 0) {
    return (
      <div className="pump-quote-container">
        <Navbar />
        <div className="no-data-message">
          <h2>No Parts Selected</h2>
          <p>Please go back and select pump parts to generate a quote.</p>
          <button onClick={() => navigate('/pump-spares')} className="back-btn">
            <FaArrowLeft /> Back to Pump Spares
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pump-quote-container">
        <Navbar />
        
        <div className="quote-header">
          <div className="back-arrows" onClick={() => navigate("/pump-spares")}>
            <FaArrowLeft />
            <span>Back to Pump Spares</span>
          </div>
          
          <div className="quote-actions">
            <button className="action-btn edit-btn" onClick={() => setIsEditing(!isEditing)}>
              <FaEdit />
              {isEditing ? 'Cancel Edit' : 'Edit Quote'}
            </button>
            {isEditing && (
              <button className="action-btn save-btn" onClick={handleSave}>
                <FaSave />
                Save Quote
              </button>
            )}
            <button className="action-btn print-btn" onClick={handlePrint}>
              <FaPrint />
              Print Quote
            </button>
            <button className="action-btn download-btn">
              <FaDownload />
              Download PDF
            </button>
          </div>
        </div>

        <div className="quote-document">
          <div className="quote-header-section">
            <div className="company-header">
              <h1>SHAFT & SEAL PVT LTD</h1>
              <p>Specialized in Pump Spares & Engineering Solutions</p>
            </div>
            
            <div className="quote-info">
              <h2>OFFER FOR SUPPLY OF PUMP SPARES</h2>
              <div className="quote-details">
                <div className="detail-row">
                  <span className="label">Ref No:</span>
                  <span className="value">{quoteData.customerInfo.refNo}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{quoteData.customerInfo.date}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="customer-section">
            <div className="section-title">To:</div>
            {isEditing ? (
              <div className="editable-fields">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={quoteData.customerInfo.customerName}
                  onChange={(e) => handleCustomerInfoChange('customerName', e.target.value)}
                  className="customer-input"
                />
                <textarea
                  placeholder="Customer Address"
                  value={quoteData.customerInfo.customerAddress}
                  onChange={(e) => handleCustomerInfoChange('customerAddress', e.target.value)}
                  className="customer-textarea"
                  rows="3"
                />
              </div>
            ) : (
              <div className="customer-info">
                <div className="customer-name">{quoteData.customerInfo.customerName || '[Customer Name]'}</div>
                <div className="customer-address">{quoteData.customerInfo.customerAddress || '[Customer Address]'}</div>
              </div>
            )}
          </div>

          <div className="divider"></div>

          <div className="offer-details-section">
            <h3>1. OFFER DETAILS</h3>
            <p>We are pleased to submit our offer for the supply of the following pump spares as per your requirement:</p>
            
            <div className="parts-table-container">
              <table className="parts-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Description of Spare</th>
                    <th>Qty</th>
                    <th>Unit Price (INR)</th>
                    <th>Total Price (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {quoteData.selectedParts.map((part, index) => (
                    <tr key={part.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="part-description">
                          <strong>{part.partName}</strong><br/>
                          <span className="part-details">
                            Pump Make: {part.pumpMake}<br/>
                            Model: {part.model}<br/>
                            Size: {part.size}<br/>
                            Part No: {part.partNo}<br/>
                            MOC: {part.moc}
                          </span>
                        </div>
                      </td>
                      <td>{part.qtyAvailable}</td>
                      <td>₹{formatPrice(part.unitPrice)}</td>
                      <td>₹{formatPrice(part.unitPrice * part.qtyAvailable)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td colSpan="4" className="total-label">Total Basic Price:</td>
                    <td className="total-value">₹{formatPrice(calculateTotal())}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="price-breakdown">
              <p><strong>GST:</strong> Extra as applicable</p>
              <p><strong>Packing & Forwarding:</strong> Extra at actuals</p>
              <p><strong>Freight & Insurance:</strong> Extra at actuals or on customer's account</p>
              <p><strong>Delivery Terms:</strong> Ex-works {quoteData.customerInfo.deliveryLocation}</p>
            </div>
          </div>

          <div className="divider"></div>

          <div className="commercial-terms-section">
            <h3>2. COMMERCIAL TERMS</h3>
            <ol>
              <li><strong>Validity of Offer:</strong> Valid for 30 (thirty) days from the date of this quotation.</li>
              <li><strong>Price Basis:</strong> Prices are based on current raw material rates and are subject to change without prior notice if the order is not placed within the validity period.</li>
              <li><strong>Taxes & Duties:</strong> All taxes, duties, levies (present or future) applicable shall be borne by the buyer.</li>
              <li><strong>Packing & Forwarding:</strong> Will be charged extra at actuals.</li>
              <li><strong>Freight & Insurance:</strong> Freight and transit insurance to the customer's site will be borne by the buyer unless otherwise mentioned in writing.</li>
              <li><strong>Delivery Schedule:</strong> Expected delivery: {quoteData.customerInfo.deliveryWeeks} from the date of receipt of firm Purchase Order and advance payment.</li>
              <li><strong>Material Acceptance:</strong> The material supplied shall be deemed to have been accepted by the buyer as free from any defect in material, design, manufacturing, or workmanship unless written notice of any such defect is received by us within seven (7) days from the date of delivery at the buyer's premises.</li>
            </ol>
          </div>

          <div className="divider"></div>

          <div className="payment-terms-section">
            <h3>3. PAYMENT TERMS</h3>
            <ul>
              <li><strong>Advance:</strong> 50% of order value along with Purchase Order.</li>
              <li><strong>Balance:</strong> Before dispatch / Against proforma invoice.</li>
              <li><strong>Payment Mode:</strong> NEFT/RTGS only.</li>
              <li><strong>Delayed Payment:</strong> Any delayed payment beyond agreed terms will attract interest @ 18% per annum from the due date till realization.</li>
              <li><strong>Ownership:</strong> Goods remain our property until full and final payment is received.</li>
            </ul>
          </div>

          <div className="divider"></div>

          <div className="warranty-terms-section">
            <h3>4. WARRANTY TERMS</h3>
            <ul>
              <li>Warranty is applicable for 6 months from supply date or 3 months from commissioning, whichever occurs earlier.</li>
              <li>Warranty covers manufacturing defects only.</li>
              <li>Warranty excludes normal wear & tear, misuse, mishandling, improper storage, faulty installation.</li>
              <li>Our liability under warranty is limited to repair/replacement of defective part only.</li>
            </ul>
          </div>

          <div className="divider"></div>

          <div className="other-conditions-section">
            <h3>5. OTHER CONDITIONS</h3>
            <ul>
              <li>Technical support (if required) will be chargeable extra unless explicitly mentioned otherwise.</li>
              <li>Storage and preservation of spares after delivery is the responsibility of the buyer.</li>
              <li>Any modification to this offer is valid only if confirmed by us in writing.</li>
              <li>Buyer agrees to all terms and conditions mentioned herein by placing a Purchase Order against this offer.</li>
            </ul>
          </div>

          <div className="divider"></div>

          <div className="closing-section">
            <p>We look forward to your confirmation and valuable order.</p>
            
            <div className="company-signature">
              <p><strong>For</strong></p>
              <p><strong>Shaft & Seal Pvt Ltd</strong></p>
              <p><strong>Authorized Signatory</strong></p>
              <div className="signature-line">
                <p>Name: _________________________</p>
                <p>Designation: _________________________</p>
                <p>Contact Details: _________________________</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PumpQuote;
