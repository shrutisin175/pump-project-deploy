import React, { useState, useEffect } from "react";
import "./EnergyOptimizationForm.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { FaYoutube, FaInstagram, FaFacebook, FaDownload, FaCheckCircle } from "react-icons/fa";
import { energyOptimizationService } from "../services/energyOptimizationService";
import { AuthService } from "../services/authService";

const EnergyOptimizationForm = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState('');
  
  console.log('EnergyOptimizationForm component rendered'); // Debug log
  
  const [formData, setFormData] = useState({
    projectType: '',
    // Process Parameters
    daTankHeight: '',
    boilerDrumHeight: '',
    daTankPressure: '',
    boilerDrumPressure: '',
    feedWaterTemp: '',
    specificGravity: '',
    // Actual Requirements
    actualFlow24hrs: '',
    actualFlowRequired: '',
    actualSpeedN2: '',
    actualDischargePressure: '',
    actualSuctionPressure: '',
    actualPowerConsumption: '',
    // Name Plate Reading
    flowQnp: '',
    headHnp: '',
    bkwBkwnp: '',
    efficiency: '',
    speedN1: '',
    // File Uploads
    qhnpFile: null,
    qhactFile: null,
    qhmodFile: null,
    despInputFile: null,
    flowchartFile: null
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Load stored credentials first
        AuthService.loadStoredCredentials();
        
        const authenticated = await AuthService.isAuthenticated();
        setIsLoggedIn(authenticated);
        
        console.log('DEBUG: EnergyOptimizationForm auth check:', {
          authenticated,
          hasCredentials: !!AuthService.currentCredentials
        });
        
        // If not authenticated, redirect to login
        if (!authenticated) {
          console.log('User not authenticated, redirecting to login');
          navigate('/login?from=energy-optimization');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
        navigate('/login?from=energy-optimization');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const getImagePath = (projectType) => {
    switch (projectType) {
      case '1R + 1S':
        return encodeURI('/1R +1S.jpg');  // URL encode the space
      case '2R + 1S':
        return encodeURI('/2R + 1S.jpg');
      case 'MR + MS':
        return encodeURI('/MR + MS.jpeg');
      default:
        return '';
    }
  };

  const getPdfPath = (projectType) => {
    switch (projectType) {
      case '1R + 1S':
        return encodeURI('/1 R 1 S.pdf');
      case '2R + 1S':
        return encodeURI('/2R 1S.pdf');
      case 'MR + MS':
        return encodeURI('/MS MR.pdf');
      default:
        return '';
    }
  };

  const handleProjectSelection = (projectType) => {
    setSelectedProject(projectType);
    setImageLoaded(false);
    setImageError('');
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError('');
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError('Failed to load design image');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submit clicked'); // Debug log

    try {
      // Check if project is selected
      if (!selectedProject) {
        setMessage({
          type: 'error',
          text: 'Please select an operation philosophy first!'
        });
        return;
      }

      // Check if QHnp file is uploaded
      if (!formData.qhnpFile) {
        setMessage({
          type: 'error',
          text: 'Please upload your QH.xlsx file!'
        });
        return;
      }

    setLoading(true);
    setMessage({ type: '', text: '' });

      console.log('Starting form submission...'); // Debug log
      const submitFormData = {
        ...formData,
        projectType: selectedProject
      };

      console.log('Submitting form data:', submitFormData); // Debug log

      console.log('Creating form data...'); // Debug log
      if (!energyOptimizationService) {
        throw new Error('Energy optimization service not available');
      }
      const apiFormData = energyOptimizationService.createFormData(submitFormData);
      console.log('Form data created:', apiFormData); // Debug log

      console.log('About to submit to API...'); // Debug log
      const response = await energyOptimizationService.submitEnergyOptimization(apiFormData);
      console.log('API response received:', response); // Debug log

      if (response.success) {
        console.log('Submission successful!'); // Debug log
        
        setMessage({ 
          type: 'success', 
          text: 'Energy optimization project submitted successfully! Redirecting to results...' 
        });
        
        // Handle response and redirect to results page
        const submissionData = response.data?.submission || response.submission;
        const calculations = response.data?.calculations;
        const plots = response.data?.plots;
        const proposal = response.data?.proposal;
        
        console.log('Response data structure:', {
          submissionData: !!submissionData,
          calculations: !!calculations,
          plots: !!plots,
          proposal: !!proposal
        });
        
        if (submissionData && submissionData.id) {
          // Prepare data for results page
          const resultsData = {
            submissionData: {
              ...submissionData,
              id: submissionData.id,
              created_at: submissionData.created_at || new Date().toISOString()
            },
            analysisResults: {
              calculations: calculations || { message: 'Calculations in progress...' },
              plots: plots || { message: 'Plots being generated...' },
              proposal: proposal || { message: 'Proposal being prepared...' },
              submissionId: submissionData.id
            }
          };
          
          // Redirect to results page with data
          navigate('/energy-optimization-results', { 
            state: resultsData 
          });
        } else {
          // Fallback if no submission data
          setMessage({ 
            type: 'error', 
            text: 'Submission failed. Please try again.' 
          });
        }
        
        setFormData({
          projectType: '',
          // Process Parameters
          daTankHeight: '',
          boilerDrumHeight: '',
          daTankPressure: '',
          boilerDrumPressure: '',
          feedWaterTemp: '',
          specificGravity: '',
          // Actual Requirements
          actualFlow24hrs: '',
          actualFlowRequired: '',
          actualSpeedN2: '',
          actualDischargePressure: '',
          actualSuctionPressure: '',
          actualPowerConsumption: '',
          // Name Plate Reading
          flowQnp: '',
          headHnp: '',
          bkwBkwnp: '',
          efficiency: '',
          speedN1: '',
          // File Uploads
          qhnpFile: null,
          qhactFile: null,
          qhmodFile: null,
          despInputFile: null,
          flowchartFile: null
        });
        
        setSelectedProject('');
        
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
        
      } else {
        setMessage({ 
          type: 'error', 
          text: response.error || 'Failed to submit energy optimization project. Please try again.' 
        });
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ 
        type: 'error', 
        text: `Error: ${error.message || 'Something went wrong. Please try again.'}` 
      });
      
      // Reset form state to prevent crashes
      setLoading(false);
      setShowSubmittedData(false);
      setShowResults(false);
      setAnalysisResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    if (!submittedData || !submittedData.id) return;

    const templateContent = `ENERGY OPTIMIZATION PROJECT TEMPLATE

Submission ID: #${submittedData.id || 'N/A'}
Date: ${submittedData.created_at ? new Date(submittedData.created_at).toLocaleDateString() : 'N/A'}
Project Type: ${submittedData.project_type || 'N/A'}

PROCESS PARAMETERS
------------------
DA Tank Height from Pump Center line (h1): ${submittedData.da_tank_height || 'Not provided'} m
Boiler Drum Height from Pump Center line (h2): ${submittedData.boiler_drum_height || 'Not provided'} m
DA Tank Pressure (P1): ${submittedData.da_tank_pressure || 'Not provided'} Kg/cm²
Boiler Drum Pressure (P2): ${submittedData.boiler_drum_pressure || 'Not provided'} Kg/cm²
Feed Water Temperature (t): ${submittedData.feed_water_temp || 'Not provided'} °C
Specific Gravity at t (SG): ${submittedData.specific_gravity || 'Not provided'}
Actual Flow - 24 hrs (Totalizer Reading) (Mact): ${submittedData.actual_flow_24hrs || 'Not provided'} TPH
Actual Flow Required (Qact): ${submittedData.actual_flow_required || 'Not provided'} m³/hr

NAME PLATE READING
------------------
Flow (Qnp): ${submittedData.flow_qnp || 'Not provided'} m³/hr
Head (Hnp): ${submittedData.head_hnp || 'Not provided'} m
BKW (BKWnp): ${submittedData.bkw_bkwnp || 'Not provided'} KWH
Efficiency (ηnp): ${submittedData.efficiency || 'Not provided'}%

UPLOADED DOCUMENTS
-----------------
${submittedData.qhnp_file ? '✓ QHnp Document' : '✗ QHnp Document (Not provided)'}
${submittedData.qhact_file ? '✓ Qnp to Qhact Modification Document' : '✗ Qnp to Qhact Modification Document (Not provided)'}
${submittedData.qhmod_file ? '✓ Qhmod Document' : '✗ Qhmod Document (Not provided)'}

PROJECT NEXT STEPS
------------------
1. Technical Review - Our engineering team will review your energy optimization parameters
2. Analysis & Calculations - We'll perform detailed energy efficiency calculations
3. Optimization Proposal - You'll receive a comprehensive optimization proposal
4. Implementation Plan - Upon approval, we'll provide detailed implementation guidelines
5. Performance Monitoring - We'll help establish monitoring systems for ongoing optimization
6. Results Validation - Final performance validation and efficiency improvements documentation

CONTACT INFORMATION
------------------
For any queries regarding this project, please contact us with your Submission ID: #${submittedData.id}

Email: info@shaftandseal.com
Phone: +91-XXXXXXXXXX

Thank you for choosing Shaft & Seal for your energy optimization needs!

---
Generated on: ${new Date().toLocaleString()}
Shaft & Seal - Engineering Reliability
`;

    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Energy_Optimization_Template_${submittedData.id}_${submittedData.project_type.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="energy-optimization-form-page">
        <Navbar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          flexDirection: 'column'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <h3>Checking Authentication...</h3>
          <p>Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  // If not logged in, don't render the form (redirect will happen in useEffect)
  if (!isLoggedIn) {
    return null;
  }

  return (
      <div className="energy-optimization-form-page">
        <Navbar />
        
        {/* Header Section */}
        <div className="form-header">
          <h1 className="form-page-title">Energy Optimization Form</h1>
          <p className="form-page-subtitle">Configure your energy optimization project parameters and upload required documents</p>
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

        {/* Energy Optimization Form */}
        <div className="energy-form-container">
          <div className="energy-form">
            {/* Project Selection */}
            <div className="form-section">
              <h3 className="section-title">Choose Your Project</h3>
              
              <div className="project-options">
                <div 
                  className={`project-option ${selectedProject === '1R + 1S' ? 'selected' : ''}`}
                  onClick={() => handleProjectSelection('1R + 1S')}
                >
                  <div className="project-option-content">
                    <h3>1R + 1S</h3>
                    <p>1 Running & 1 StandBy</p>
                  </div>
                </div>
                
                <div 
                  className={`project-option ${selectedProject === '2R + 2S' ? 'selected' : ''}`}
                  onClick={() => handleProjectSelection('2R + 2S')}
                >
                  <div className="project-option-content">
                    <h3>2R + 2S</h3>
                    <p>2 Running & 2 StandBy</p>
                  </div>
                </div>
                
                <div 
                  className={`project-option ${selectedProject === 'MR + MS' ? 'selected' : ''}`}
                  onClick={() => handleProjectSelection('MR + MS')}
                >
                  <div className="project-option-content">
                    <h3>MR + MS</h3>
                    <p>Multiple Running & Multiple StandBy</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedProject && (
              <>
                {/* Design Section */}
                <div className="form-section">
                  <h3 className="section-title">Design for {selectedProject}</h3>
                  <div className="design-viewer">
                    {!selectedProject ? (
                      <div className="image-preview">
                        <div className="image-icon">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                          </svg>
                        </div>
                        <h4>Select a Project</h4>
                        <p>Choose a project type to view the design</p>
                      </div>
                    ) : imageError ? (
                      <div className="image-error">
                        <div className="error-icon">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#dc3545' }}>
                            <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2M12,7A2,2 0 0,0 10,9A2,2 0 0,0 12,11A2,2 0 0,0 14,9A2,2 0 0,0 12,7Z"/>
                          </svg>
                        </div>
                        <h4>Error Loading Design</h4>
                        <p>{imageError}</p>
                        <button 
                          onClick={() => handleProjectSelection(selectedProject)} 
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <div className="image-display">
                        {!imageLoaded && (
                          <div className="image-loading">
                            <div className="loading-spinner" style={{
                              width: '40px',
                              height: '40px',
                              border: '4px solid #f3f3f3',
                              borderTop: '4px solid #007bff',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                              margin: '0 auto 16px'
                            }}></div>
                            <h4>Loading Design...</h4>
                            <p>Please wait while we load the {selectedProject} design image</p>
                          </div>
                        )}
                        <img 
                          src={getImagePath(selectedProject)}
                          alt={`${selectedProject} Design`}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                          style={{ 
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            display: imageLoaded ? 'block' : 'none',
                            margin: '0 auto'
                          }}
                        />
                        {imageLoaded && (
                          <div className="image-info">
                            <p><strong>{selectedProject}</strong> Design Document</p>
                            <p>Design preview shown above</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="design-actions">
                    <a 
                      href={getPdfPath(selectedProject)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-design-btn"
                      style={{ display: selectedProject ? 'inline-block' : 'none' }}
                    >
                      View Full Design PDF
                    </a>
                    <a 
                      href={getPdfPath(selectedProject)}
                      download
                      className="download-design-btn"
                      style={{ display: selectedProject ? 'inline-block' : 'none' }}
                    >
                      Download Design PDF
                    </a>
                  </div>
                </div>

                {/* Project Details Form */}
                <div className="form-section">
                  <h3 className="section-title">Project Details - {selectedProject}</h3>
                  <form className="project-details-form" onSubmit={handleSubmit}>
                    {/* Process Parameters */}
                    <div className="form-group-section">
                      <h4>Process Parameters</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>DA Tank Height from Pump Center line (h1)</label>
                          <input 
                            type="number" 
                            name="daTankHeight"
                            value={formData.daTankHeight}
                            onChange={handleInputChange}
                            placeholder="14" 
                          />
                          <span className="unit">m</span>
                        </div>
                        <div className="form-group">
                          <label>Boiler Drum Height from Pump Center line (h2)</label>
                          <input 
                            type="number" 
                            name="boilerDrumHeight"
                            value={formData.boilerDrumHeight}
                            onChange={handleInputChange}
                            placeholder="34" 
                          />
                          <span className="unit">m</span>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>DA Tank Pressure (P1)</label>
                          <input 
                            type="number" 
                            name="daTankPressure"
                            value={formData.daTankPressure}
                            onChange={handleInputChange}
                            step="0.1" 
                            placeholder="1.5" 
                          />
                          <span className="unit">Kg/cm²</span>
                        </div>
                        <div className="form-group">
                          <label>Boiler Drum Pressure (P2)</label>
                          <input 
                            type="number" 
                            name="boilerDrumPressure"
                            value={formData.boilerDrumPressure}
                            onChange={handleInputChange}
                            step="0.1" 
                            placeholder="68" 
                          />
                          <span className="unit">Kg/cm²</span>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Feed Water Temperature (t)</label>
                          <input 
                            type="number" 
                            name="feedWaterTemp"
                            value={formData.feedWaterTemp}
                            onChange={handleInputChange}
                            placeholder="130" 
                          />
                          <span className="unit">°C</span>
                        </div>
                        <div className="form-group">
                          <label>Specific Gravity at t (SG)</label>
                          <input 
                            type="number" 
                            name="specificGravity"
                            value={formData.specificGravity}
                            onChange={handleInputChange}
                            step="0.0001" 
                            placeholder="0.9388" 
                          />
                          <span className="unit">-</span>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Total mass Flow Recorded (M24)</label>
                          <input 
                            type="number" 
                            name="actualFlow24hrs"
                            value={formData.actualFlow24hrs}
                            onChange={handleInputChange}
                            placeholder="960" 
                          />
                          <span className="unit">TPH</span>
                        </div>
                        <div className="form-group">
                          <label>Actual Flow (Qact)</label>
                          <input 
                            type="number" 
                            name="actualFlowRequired"
                            value={formData.actualFlowRequired}
                            onChange={handleInputChange}
                            step="0.1" 
                            placeholder="43" 
                          />
                          <span className="unit">m³/hr</span>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Actual running RPM (N2)</label>
                          <input 
                            type="number" 
                            name="actualSpeedN2"
                            value={formData.actualSpeedN2}
                            onChange={handleInputChange}
                            placeholder="2900" 
                          />
                          <span className="unit">RPM</span>
                        </div>
                        <div className="form-group">
                          <label>Actual discharge Pressure (Pd)</label>
                          <input 
                            type="number" 
                            name="actualDischargePressure"
                            value={formData.actualDischargePressure}
                            onChange={handleInputChange}
                            step="0.1" 
                            placeholder="82" 
                          />
                          <span className="unit">Kg/cm²</span>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Actual Suction Pressure (Ps)</label>
                          <input 
                            type="number" 
                            name="actualSuctionPressure"
                            value={formData.actualSuctionPressure}
                            onChange={handleInputChange}
                            step="0.1" 
                            placeholder="2" 
                          />
                          <span className="unit">Kg/cm²</span>
                        </div>
                        <div className="form-group">
                          <label>Actual Power Consumption (BKW1)</label>
                          <input 
                            type="number" 
                            name="actualPowerConsumption"
                            value={formData.actualPowerConsumption}
                            onChange={handleInputChange}
                            placeholder="165" 
                          />
                          <span className="unit">KWH</span>
                        </div>
                      </div>
                    </div>

                    {/* Name Plate Reading */}
                    <div className="form-group-section">
                      <h4>Name Plate Reading</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Flow (Qnp)</label>
                          <input 
                            type="number" 
                            name="flowQnp"
                            value={formData.flowQnp}
                            onChange={handleInputChange}
                            placeholder="60" 
                          />
                          <span className="unit">m³/hr</span>
                        </div>
                        <div className="form-group">
                          <label>Head (Hnp)</label>
                          <input 
                            type="number" 
                            name="headHnp"
                            value={formData.headHnp}
                            onChange={handleInputChange}
                            placeholder="910" 
                          />
                          <span className="unit">m</span>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>BKW (BKWnp)</label>
                          <input 
                            type="number" 
                            name="bkwBkwnp"
                            value={formData.bkwBkwnp}
                            onChange={handleInputChange}
                            placeholder="235" 
                          />
                          <span className="unit">KWH</span>
                        </div>
                        <div className="form-group">
                          <label>Efficiency (ηnp)</label>
                          <input 
                            type="number" 
                            name="efficiency"
                            value={formData.efficiency}
                            onChange={handleInputChange}
                            step="0.01" 
                            placeholder="0.65" 
                          />
                          <span className="unit">%</span>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>RPM (N1)</label>
                          <input 
                            type="number" 
                            name="speedN1"
                            value={formData.speedN1}
                            onChange={handleInputChange}
                            placeholder="2965" 
                          />
                          <span className="unit">RPM</span>
                        </div>
                      </div>
                    </div>

                    {/* Upload Section */}
                    <div className="form-group-section">
                      <h4>Upload Files</h4>
                      <div className="file-upload-info">
                        <p><strong>📋 File Upload Instructions:</strong></p>
                        <ul>
                          <li><strong>Required:</strong> Upload your QH.xlsx file in the "Upload QHnp" field below</li>
                          <li><strong>Optional:</strong> Leave other fields empty - they will be generated automatically</li>
                          <li><strong>Format:</strong> Excel file with Flow (Q) in column 1, Head (H) in column 2</li>
                        </ul>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group required">
                          <label>Upload QHnp (Required) <span className="required-mark">*</span></label>
                          <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, 'qhnpFile')}
                            accept=".pdf,.xlsx,.xls" 
                            required
                          />
                          <small className="file-help">Original pump Q-H curve from nameplate/manufacturer (Excel format)</small>
                        </div>
                        <div className="form-group optional">
                          <label>Modify Qnp to Qhact (Optional)</label>
                          <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, 'qhactFile')}
                            accept=".pdf,.xlsx,.xls" 
                          />
                          <small className="file-help">Modified Q-H curve for actual operating conditions (will be generated if not provided)</small>
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group optional">
                          <label>Upload Qhmod (Optional)</label>
                          <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, 'qhmodFile')}
                            accept=".pdf,.xlsx,.xls" 
                          />
                          <small className="file-help">Optimized Q-H curve after proposed improvements (will be generated if not provided)</small>
                        </div>
                        <div className="form-group optional">
                          <label>DESP-User Input.xlsx (Optional)</label>
                          <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, 'despInputFile')}
                            accept=".xlsx,.xls" 
                          />
                          <small className="file-help">Additional input data file (if available)</small>
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group optional">
                          <label>FlowChart.pdf (Optional)</label>
                          <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, 'flowchartFile')}
                            accept=".pdf" 
                          />
                          <small className="file-help">Process flowchart document (if available)</small>
                        </div>
                      </div>
                    </div>

                    <div className="form-submit-section">
                      <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={loading}
                        onClick={(e) => {
                          console.log('Submit button clicked!');
                          console.log('Selected project:', selectedProject);
                          console.log('QHnp file:', formData.qhnpFile);
                          console.log('Loading state:', loading);
                        }}
                      >
                        {loading ? 'Submitting...' : 'Submit Energy Optimization Project'}
                      </button>
                      
            {/* Debug info */}
            <div style={{marginTop: '10px', fontSize: '12px', color: '#666'}}>
              Debug: Project={selectedProject ? 'Selected' : 'Not Selected'}, 
              File={formData.qhnpFile ? 'Uploaded' : 'Not Uploaded'}, 
              Loading={loading ? 'Yes' : 'No'}
              {showResults && (
                <div style={{marginTop: '5px', color: '#28a745'}}>
                  ✅ Results Available: {analysisResults ? 'Yes' : 'No'}
                </div>
              )}
            </div>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
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
            
            {/* View Results Button */}
            {showResults && analysisResults && (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button
                  onClick={() => {
                    const resultsSection = document.querySelector('.energy-optimization-results');
                    if (resultsSection) {
                      resultsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
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
                    gap: '8px',
                    marginRight: '10px'
                  }}
                >
                  <FaChartLine /> View Analysis Results
                </button>
              </div>
            )}
            
            <p style={{ color: '#155724', marginBottom: '25px', textAlign: 'center' }}>
              Your energy optimization project has been successfully submitted. Here's a summary of your submission:
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
                  <strong>Project Type:</strong> {selectedProject || submittedData.project_type}
                </div>
                <div>
                  <strong>Submission ID:</strong> #{submittedData.id}
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px', marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Process Parameters</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div><strong>DA Tank Height:</strong> {formData.daTankHeight || submittedData.da_tank_height || 'Not provided'} m</div>
                  <div><strong>Boiler Drum Height:</strong> {formData.boilerDrumHeight || submittedData.boiler_drum_height || 'Not provided'} m</div>
                  <div><strong>DA Tank Pressure:</strong> {formData.daTankPressure || submittedData.da_tank_pressure || 'Not provided'} Kg/cm²</div>
                  <div><strong>Boiler Drum Pressure:</strong> {formData.boilerDrumPressure || submittedData.boiler_drum_pressure || 'Not provided'} Kg/cm²</div>
                  <div><strong>Feed Water Temperature:</strong> {formData.feedWaterTemp || submittedData.feed_water_temp || 'Not provided'} °C</div>
                  <div><strong>Specific Gravity:</strong> {formData.specificGravity || submittedData.specific_gravity || 'Not provided'}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px', marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Actual Requirements</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div><strong>Total Mass Flow (M24):</strong> {formData.actualFlow24hrs || submittedData.actual_flow_24hrs || 'Not provided'} TPH</div>
                  <div><strong>Actual Flow (Qact):</strong> {formData.actualFlowRequired || submittedData.actual_flow_required || 'Not provided'} m³/hr</div>
                  <div><strong>Actual RPM (N2):</strong> {formData.actualSpeedN2 || submittedData.actual_speed_n2 || 'Not provided'} RPM</div>
                  <div><strong>Actual Discharge Pressure:</strong> {formData.actualDischargePressure || submittedData.actual_discharge_pressure || 'Not provided'} Kg/cm²</div>
                  <div><strong>Actual Suction Pressure:</strong> {formData.actualSuctionPressure || submittedData.actual_suction_pressure || 'Not provided'} Kg/cm²</div>
                  <div><strong>Actual Power Consumption:</strong> {formData.actualPowerConsumption || submittedData.actual_power_consumption || 'Not provided'} KWH</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Name Plate Reading</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div><strong>Flow (Qnp):</strong> {formData.flowQnp || submittedData.flow_qnp || 'Not provided'} m³/hr</div>
                  <div><strong>Head (Hnp):</strong> {formData.headHnp || submittedData.head_hnp || 'Not provided'} m</div>
                  <div><strong>BKW:</strong> {formData.bkwBkwnp || submittedData.bkw_bkwnp || 'Not provided'} KWH</div>
                  <div><strong>Efficiency:</strong> {formData.efficiency || submittedData.efficiency || 'Not provided'}%</div>
                  <div><strong>RPM (N1):</strong> {formData.speedN1 || submittedData.speed_n1 || 'Not provided'} RPM</div>
                </div>
              </div>

              {(formData.qhnpFile || formData.qhactFile || formData.qhmodFile || submittedData.qhnp_file || submittedData.qhact_file || submittedData.qhmod_file) && (
                <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Uploaded Documents</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {(formData.qhnpFile || submittedData.qhnp_file) && <li>✓ QHnp Document</li>}
                    {(formData.qhactFile || submittedData.qhact_file) && <li>✓ QHact Document</li>}
                    {(formData.qhmodFile || submittedData.qhmod_file) && <li>✓ QHmod Document</li>}
                    {(formData.despInputFile || submittedData.desp_input_file) && <li>✓ DESP Input File</li>}
                    {(formData.flowchartFile || submittedData.flowchart_file) && <li>✓ Flowchart File</li>}
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
                <FaDownload /> Download Project Template
              </button>
            </div>
          </div>
        )}

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
  );
};

export default EnergyOptimizationForm;
