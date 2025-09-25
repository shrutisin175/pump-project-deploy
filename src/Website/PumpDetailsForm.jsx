import React, { useState, useEffect } from "react";
import { FaUpload, FaPlus, FaTrash, FaArrowLeft, FaDownload, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { PumpDetailsService } from "../services/pumpDetailsService";
import { AuthService } from "../services/authService";
import "./PumpDetailsForm.css";

const PumpDetailsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    make: '',
    model: '',
    flow: '',
    head: '',
    bkw: '',
    efficiency: '',
    pumpCurve: null,
    csDrawing: null,
    otherDocuments: []
  });
  const [additionalDocs, setAdditionalDocs] = useState([{ id: 1, file: null, label: '' }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submittedData, setSubmittedData] = useState(null);
  const [showSubmittedData, setShowSubmittedData] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  // Auto-fill customer details from registration data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const isAuthenticated = await AuthService.isAuthenticated();
        if (isAuthenticated) {
          const user = await AuthService.getCurrentUser();
          if (user) {
            setUserData(user);
            // Auto-fill customer details
            setFormData(prev => ({
              ...prev,
              customerName: user.full_name || '',
              email: user.official_email || user.personal_email || '',
              phone: user.official_phone || user.personal_phone || ''
            }));
          }
        } else {
          // Redirect to login if not authenticated
          navigate('/login?from=pump-details-form');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setMessage({ 
          type: 'error', 
          text: 'Failed to load user data. Please login again.' 
        });
        navigate('/login?from=pump-details-form');
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (field === 'pumpCurve' || field === 'csDrawing') {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleAdditionalDocChange = (id, field, value) => {
    setAdditionalDocs(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, [field]: value } : doc
      )
    );
  };

  const addDocumentField = () => {
    const newId = Math.max(...additionalDocs.map(doc => doc.id)) + 1;
    setAdditionalDocs(prev => [...prev, { id: newId, file: null, label: '' }]);
  };

  const removeDocumentField = (id) => {
    if (additionalDocs.length > 1) {
      setAdditionalDocs(prev => prev.filter(doc => doc.id !== id));
    }
  };

  const handleDownloadTemplate = (submissionData = null) => {
    const data = submissionData || submittedData;
    if (!data) return;

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Pump Project Template - ${data.id}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #ffffff;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header h2 {
            color: #6c757d;
            margin: 10px 0 0 0;
            font-size: 16px;
            font-weight: normal;
          }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section-title {
            background-color: #f8f9fa;
            color: #495057;
            padding: 10px 15px;
            margin: 0 0 15px 0;
            font-size: 18px;
            font-weight: bold;
            border-left: 4px solid #007bff;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
          }
          .info-item {
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .info-label {
            font-weight: bold;
            color: #495057;
            display: inline-block;
            width: 120px;
          }
          .info-value {
            color: #6c757d;
          }
          .documents-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .documents-list li {
            padding: 5px 0;
            border-bottom: 1px solid #f8f9fa;
          }
          .documents-list li:before {
            content: "✓ ";
            color: #28a745;
            font-weight: bold;
            margin-right: 8px;
          }
          .documents-list li.not-provided:before {
            content: "✗ ";
            color: #dc3545;
          }
          .steps-list {
            counter-reset: step-counter;
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .steps-list li {
            counter-increment: step-counter;
            padding: 8px 0;
            border-bottom: 1px solid #f8f9fa;
            position: relative;
            padding-left: 30px;
          }
          .steps-list li:before {
            content: counter(step-counter);
            position: absolute;
            left: 0;
            top: 8px;
            background-color: #007bff;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
          }
          .contact-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          @media print {
            body { margin: 0; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>REVERSE ENGINEERING PROJECT TEMPLATE</h1>
          <h2>Submission ID: #${data.id} | Date: ${new Date(data.created_at).toLocaleDateString()}</h2>
        </div>

        <div class="section">
          <div class="section-title">CUSTOMER INFORMATION</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Name:</span>
              <span class="info-value">${data.customer_name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">${data.email}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone:</span>
              <span class="info-value">${data.phone}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">PUMP SPECIFICATIONS</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Make:</span>
              <span class="info-value">${data.make || 'Not specified'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Model:</span>
              <span class="info-value">${data.model || 'Not specified'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Flow:</span>
              <span class="info-value">${data.flow || 'Not specified'} m³/hr</span>
            </div>
            <div class="info-item">
              <span class="info-label">Head:</span>
              <span class="info-value">${data.head || 'Not specified'} meters</span>
            </div>
            <div class="info-item">
              <span class="info-label">BKW:</span>
              <span class="info-value">${data.bkw || 'Not specified'} KWH</span>
            </div>
            <div class="info-item">
              <span class="info-label">Efficiency:</span>
              <span class="info-value">${data.efficiency || 'Not specified'}%</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">UPLOADED DOCUMENTS</div>
          <ul class="documents-list">
            <li class="${data.pump_curve ? '' : 'not-provided'}">Pump Curve</li>
            <li class="${data.cs_drawing ? '' : 'not-provided'}">C/S Drawing with Part List</li>
            ${data.additional_documents && data.additional_documents.length > 0 
              ? data.additional_documents.map(doc => `<li>${doc.label}</li>`).join('')
              : '<li class="not-provided">No additional documents provided</li>'
            }
          </ul>
        </div>

        <div class="section">
          <div class="section-title">PROJECT NEXT STEPS</div>
          <ol class="steps-list">
            <li>Technical Review - Our engineering team will review your pump specifications and uploaded documents</li>
            <li>Initial Assessment - We'll provide a preliminary analysis and feasibility study</li>
            <li>Detailed Proposal - You'll receive a comprehensive proposal with timeline and pricing</li>
            <li>Project Execution - Upon approval, we'll begin the reverse engineering process</li>
            <li>Quality Assurance - All components will undergo rigorous testing and validation</li>
            <li>Delivery - Final components and documentation will be delivered as per agreed timeline</li>
          </ol>
        </div>

        <div class="contact-info">
          <div class="section-title">CONTACT INFORMATION</div>
          <p><strong>For any queries regarding this project, please contact us with your Submission ID: #${data.id}</strong></p>
          <p>Email: info@shaftandseal.com</p>
          <p>Phone: +91-XXXXXXXXXX</p>
        </div>

        <div class="footer">
          <p>Thank you for choosing Shaft & Seal for your reverse engineering needs!</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p><strong>Shaft & Seal - Engineering Reliability</strong></p>
        </div>
      </body>
      </html>
    `;

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
        // Close the window after printing
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      }, 500);
    };
  };

  const addAnotherPump = () => {
    // Reset form data but keep customer details
    setFormData(prev => ({
      customerName: prev.customerName,
      email: prev.email,
      phone: prev.phone,
      make: '', model: '', flow: '', head: '', bkw: '', efficiency: '',
      pumpCurve: null, csDrawing: null, otherDocuments: []
    }));
    
    // Reset additional documents
    setAdditionalDocs([{ id: 1, file: null, label: '' }]);
    
    // Clear messages and submitted data
    setMessage({ type: '', text: '' });
    setSubmittedData(null);
    setShowSubmittedData(false);
    
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    const submitData = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key !== 'pumpCurve' && key !== 'csDrawing' && key !== 'otherDocuments') {
        // Send empty string for optional fields if not filled
        submitData.append(key, formData[key] || '');
      }
    });
    
    if (formData.pumpCurve) submitData.append('pumpCurve', formData.pumpCurve);
    if (formData.csDrawing) submitData.append('csDrawing', formData.csDrawing);
    
    additionalDocs.forEach((doc, index) => {
      if (doc.file && doc.label) {
        submitData.append(`additionalDoc_${doc.id}`, doc.file);
        submitData.append(`additionalDocLabel_${doc.id}`, doc.label);
      }
    });

    try {
      const result = await PumpDetailsService.submitPumpDetails(submitData);
      
      if (result.success) {
        const newCount = submissionCount + 1;
        setSubmissionCount(newCount);
        
        // Add to submission history
        const newSubmission = {
          ...result.submission,
          submissionNumber: newCount,
          submittedAt: new Date().toLocaleString()
        };
        setSubmissionHistory(prev => [...prev, newSubmission]);
        
        setMessage({ 
          type: 'success', 
          text: `${result.message} ${result.additional_documents_count > 0 ? `${result.additional_documents_count} additional documents uploaded.` : ''} ${newCount > 1 ? `(${newCount} pumps submitted)` : ''}` 
        });
        
        setSubmittedData(result.submission);
        setShowSubmittedData(true);
        
        // Don't reset form completely - keep customer details for multiple submissions
        setFormData(prev => ({
          customerName: prev.customerName,
          email: prev.email,
          phone: prev.phone,
          make: '', model: '', flow: '', head: '', bkw: '', efficiency: '',
          pumpCurve: null, csDrawing: null, otherDocuments: []
        }));
        setAdditionalDocs([{ id: 1, file: null, label: '' }]);
        
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Failed to submit pump details. Please try again.' 
        });
        if (result.details) {
          console.error('Validation errors:', result.details);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pump-details-form-page">
        <Navbar />
        
        {/* Header Section */}
        <div className="form-header">
          <h1 className="form-page-title">Pump Details Form</h1>
          <p className="form-page-subtitle">Please provide detailed information about your pump for reverse engineering services.</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`message ${message.type}`} style={{
            padding: '15px',
            margin: '20px auto',
            maxWidth: '800px',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message.text}
          </div>
        )}

        {/* Pump Details Form */}
        <div className="pump-form-container">
          {isLoadingUserData ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '18px', color: '#666' }}>Loading your information...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pump-form">
              {/* Customer Info Section */}
              <div className="form-section">
                <h3 className="section-title">Customer Information</h3>
                
                {/* Multiple submissions counter */}
                {submissionCount > 0 && (
                  <div style={{
                    backgroundColor: '#e7f3ff',
                    color: '#004085',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    border: '1px solid #b8daff',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    📊 You have submitted {submissionCount} pump{submissionCount > 1 ? 's' : ''} so far. Fill in details for another pump below.
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Customer Name"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

            {/* Pump Details Section */}
            <div className="form-section">
              <h3 className="section-title">Pump Details</h3>
              <div style={{
                backgroundColor: '#1e3a8a',
                padding: '10px',
                borderRadius: '5px', 
                marginBottom: '15px',
                fontSize: '18px',
                color: '#ffffff',
                border: '1px solid #1e40af'
              }}>
                ℹ️ Pump specifications are optional. Fill in whatever information you have available. Our team will work with you to gather any missing details.
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="make"
                    placeholder="Make (Optional)"
                    value={formData.make}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="model"
                    placeholder="Model (Optional)"
                    value={formData.model}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="input-label">Flow (m³/hr) - Optional</label>
                  <input
                    type="number"
                    name="flow"
                    placeholder="Flow"
                    value={formData.flow}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Head (meter) - Optional</label>
                  <input
                    type="number"
                    name="head"
                    placeholder="Head"
                    value={formData.head}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="input-label">BKW (KWH) - Optional</label>
                  <input
                    type="number"
                    name="bkw"
                    placeholder="BKW"
                    value={formData.bkw}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Efficiency (%) - Optional</label>
                  <input
                    type="number"
                    name="efficiency"
                    placeholder="Efficiency"
                    value={formData.efficiency}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="form-section">
              <h3 className="section-title">Document Upload</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="upload-label">Pump Curve</label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'pumpCurve')}
                      id="pumpCurve"
                    />
                    <label htmlFor="pumpCurve" className="file-upload-btn">
                      <FaUpload /> Attach PDF or JPG
                    </label>
                    {formData.pumpCurve && (
                      <span className="file-name">{formData.pumpCurve.name}</span>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="upload-label">C/S Drawing with Part List</label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'csDrawing')}
                      id="csDrawing"
                    />
                    <label htmlFor="csDrawing" className="file-upload-btn">
                      <FaUpload /> Attach PDF or JPG
                    </label>
                    {formData.csDrawing && (
                      <span className="file-name">{formData.csDrawing.name}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Documents */}
              <div className="additional-docs-section">
                <h4 className="subsection-title">Other Documents</h4>
                
                {additionalDocs.map((doc) => (
                  <div key={doc.id} className="additional-doc-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Document Label"
                        value={doc.label}
                        onChange={(e) => handleAdditionalDocChange(doc.id, 'label', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleAdditionalDocChange(doc.id, 'file', e.target.files[0])}
                          id={`additionalDoc_${doc.id}`}
                        />
                        <label htmlFor={`additionalDoc_${doc.id}`} className="file-upload-btn">
                          <FaUpload /> Attach PDF or JPG
                        </label>
                        {doc.file && (
                          <span className="file-name">{doc.file.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="add-doc-btn"
                  onClick={addDocumentField}
                >
                  <FaPlus /> Add Another Document
                </button>
              </div>
            </div>

              {/* Submit Button */}
              <div className="form-submit-section">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit All'}
                </button>
              </div>

              {/* Add Another Pump Button */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: '5px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}>
                <p style={{ 
                  margin: '0 0 15px 0', 
                  color: '#6c757d',
                  fontSize: '14px'
                }}>
                  Need to submit details for multiple pumps?
                </p>
                <button 
                  type="button"
                  onClick={addAnotherPump}
                  style={{
                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
                    width: 'fit-content'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #20c997, #17a2b8)';
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
                  }}
                >
                  <span style={{ fontSize: '18px' }}>+</span> Add Another Pump
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Submitted Data Display Section */}
        {showSubmittedData && submittedData && (
          <div className="submitted-data-section" style={{
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            padding: '30px',
            margin: '30px auto',
            maxWidth: '800px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <FaCheckCircle style={{ color: '#28a745', fontSize: '24px', marginRight: '10px' }} />
              <h2 style={{ color: '#155724', margin: 0 }}>Submission Successful!</h2>
            </div>
            
            <p style={{ color: '#155724', marginBottom: '25px', textAlign: 'center' }}>
              Your pump details have been successfully submitted and stored in our database. Here's a summary of your submission:
            </p>

            <div className="submission-details" style={{
              backgroundColor: '#fff',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <strong>Customer Name:</strong> {submittedData.customer_name}
                </div>
                <div>
                  <strong>Email:</strong> {submittedData.email}
                </div>
                <div>
                  <strong>Phone:</strong> {submittedData.phone}
                </div>
                <div>
                  <strong>Submission ID:</strong> #{submittedData.id}
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px', marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Pump Specifications</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div><strong>Make:</strong> {submittedData.make}</div>
                  <div><strong>Model:</strong> {submittedData.model}</div>
                  <div><strong>Flow:</strong> {submittedData.flow} m³/hr</div>
                  <div><strong>Head:</strong> {submittedData.head} meters</div>
                  <div><strong>BKW:</strong> {submittedData.bkw} KWH</div>
                  <div><strong>Efficiency:</strong> {submittedData.efficiency}%</div>
                </div>
              </div>

              {(submittedData.pump_curve || submittedData.cs_drawing || (submittedData.additional_documents && submittedData.additional_documents.length > 0)) && (
                <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Uploaded Documents</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {submittedData.pump_curve && <li>Pump Curve</li>}
                    {submittedData.cs_drawing && <li>C/S Drawing with Part List</li>}
                    {submittedData.additional_documents && submittedData.additional_documents.map((doc, index) => (
                      <li key={index}>{doc.label}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => handleDownloadTemplate()}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaDownload /> Download PDF Template
              </button>
            </div>
          </div>
        )}

        {/* Submission History Section */}
        {submissionHistory.length > 0 && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#495057',
              textAlign: 'center'
            }}>
              📋 Your Pump Submissions ({submissionHistory.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {submissionHistory.map((submission, index) => (
                <div key={submission.id} style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#495057' }}>
                        Pump #{submission.submissionNumber}: {submission.make || 'Unknown'} {submission.model || 'Model'}
                      </h4>
                      <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#6c757d' }}>
                        <strong>ID:</strong> #{submission.id} | <strong>Submitted:</strong> {submission.submittedAt}
                      </p>
                      <div style={{ fontSize: '13px', color: '#6c757d' }}>
                        <div><strong>Flow:</strong> {submission.flow || 'Not specified'} m³/hr</div>
                        <div><strong>Head:</strong> {submission.head || 'Not specified'} meters</div>
                        <div><strong>BKW:</strong> {submission.bkw || 'Not specified'} KWH</div>
                        <div><strong>Efficiency:</strong> {submission.efficiency || 'Not specified'}%</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button
                        onClick={() => handleDownloadTemplate(submission)}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FaDownload /> Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p style={{ margin: '0', fontSize: '14px', color: '#6c757d' }}>
                💡 Each pump submission is processed separately. You can download PDF templates for any submission above.
              </p>
            </div>
          </div>
        )}
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/shaftnseal" target="_blank" rel="noopener noreferrer" title="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61578595061965" target="_blank" rel="noopener noreferrer" title="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
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

export default PumpDetailsForm;
