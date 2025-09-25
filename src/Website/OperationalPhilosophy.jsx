import React, { useState, useEffect } from "react";
import "./OperationalPhilosophy.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { FaYoutube, FaInstagram, FaFacebook, FaCheckCircle } from "react-icons/fa";
import { AuthService } from "../services/authService";
import { energyOptimizationService } from "../services/energyOptimizationService";

const OperationalPhilosophy = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [selectedProject, setSelectedProject] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // Track current form step
  const [calculatedValues, setCalculatedValues] = useState({}); // Store calculated values
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
  const [formLoading, setFormLoading] = useState(false);
  const [calculatingSRC, setCalculatingSRC] = useState(false);
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
        
        console.log('DEBUG: OperationalPhilosophy auth check:', {
          authenticated,
          hasCredentials: !!AuthService.currentCredentials
        });
        
        // If not authenticated, redirect to login
        if (!authenticated) {
          console.log('User not authenticated, redirecting to login');
          navigate('/login?from=operational-philosophy');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
        navigate('/login?from=operational-philosophy');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="operational-philosophy-page">
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

  // Form handling functions
  const getImagePath = (projectType) => {
    switch (projectType) {
      case '1R + 1S':
        return encodeURI('/1R +1S.jpg');
      case '2R + 2S':
        return encodeURI('/2R + 1S.jpg');
      case 'MR + MS':
        return encodeURI('/MR + MS.jpeg');
      default:
        return '';
    }
  };

  const handleProjectSelection = (projectType) => {
    setSelectedProject(projectType);
    setImageLoaded(false);
    setImageError('');
    setFormData(prev => ({ ...prev, projectType }));
    setCurrentStep(1); // Reset to step 1 when selecting new project
    setCalculatedValues({}); // Reset calculated values
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
    
    // Calculate k1 and SRC values in real-time if we have required values
    if (currentStep === 2 && calculatedValues.shValue) {
      calculateRealTimeSRC(name, value);
    }
  };

  // Calculate k1 and SRC values in real-time
  const calculateRealTimeSRC = async (fieldName, value) => {
    try {
      setCalculatingSRC(true);
      
      // Add a small delay to show the calculation is happening
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get current form values
      const qnp = parseFloat(formData.flowQnp) || 0;
      const hnp = parseFloat(formData.headHnp) || 0;
      const qact = parseFloat(formData.actualFlowRequired) || 0;
      const hact = parseFloat(formData.actualDischargePressure) || 0;
      const shValue = calculatedValues.shValue || 0;
      
      const updates = {};
      
      // Calculate k1 if we have Qnp and Hnp
      if (qnp > 0 && hnp > 0 && shValue > 0) {
        const k1 = (hnp - shValue) / (qnp * qnp);
        
        // Generate theoretical SRC curve points
        const maxFlow = Math.max(qnp, qact) * 1.2;
        const theoreticalSRC = [];
        
        for (let i = 0; i <= 10; i++) {
          const qi = (maxFlow / 10) * i;
          const src = shValue + k1 * (qi * qi);
          theoreticalSRC.push({ q: qi, src: src });
        }
        
        updates.k1 = k1;
        updates.theoreticalSRC = theoreticalSRC;
      }
      
      // Calculate k2 if we have Qact and Hact
      if (qact > 0 && hact > 0 && shValue > 0) {
        const k2 = (hact - shValue) / (qact * qact);
        
        // Generate actual SRC curve points
        const maxFlow = Math.max(qnp, qact) * 1.2;
        const actualSRC = [];
        
        for (let i = 0; i <= 10; i++) {
          const qi = (maxFlow / 10) * i;
          const src = shValue + k2 * (qi * qi);
          actualSRC.push({ q: qi, src: src });
        }
        
        updates.k2 = k2;
        updates.actualSRC = actualSRC;
      }
      
      // Update calculated values if we have any updates
      if (Object.keys(updates).length > 0) {
        setCalculatedValues(prev => ({
          ...prev,
          ...updates
        }));
      }
    } catch (error) {
      console.error('Error calculating real-time SRC:', error);
    } finally {
      setCalculatingSRC(false);
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  // Handle Process Parameters submission (Step 1 only)
  const handleProcessParametersSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Add delay to simulate calculation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate backend calculation for SH value
      const shValue = calculateSH(formData);
      
      // Store calculated value
      setCalculatedValues(prev => ({
        ...prev,
        shValue: shValue
      }));
      
      setMessage({ 
        type: 'success', 
        text: `Step 1 completed! SH value calculated: ${shValue.toFixed(2)}. Proceeding to Step 2...` 
      });
      
      // Move to next step automatically
      setTimeout(() => {
        setCurrentStep(2);
        setMessage({ type: '', text: '' });
      }, 2000);
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Error calculating SH value. Please try again.' 
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Step 2 submission (Name Plate Reading + File Upload)
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate required fields
      const requiredFields = [
        'flowQnp', 'headHnp', 'bkwBkwnp', 'efficiency', 'speedN1',
        'actualFlowRequired', 'actualDischargePressure', 'actualSpeedN2', 'actualPowerConsumption'
      ];
      
      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill all required fields: ${missingFields.join(', ')}`);
      }
      
      if (!formData.qhnpFile) {
        throw new Error('Please upload the Q-H curve file');
      }
      
      if (!calculatedValues.shValue) {
        throw new Error('SH value not calculated. Please complete Step 1 first.');
      }

      console.log('Submitting Step 2 with data:', {
        shValue: calculatedValues.shValue,
        qnp: formData.flowQnp,
        hnp: formData.headHnp,
        qact: formData.actualFlowRequired,
        hact: formData.actualDischargePressure,
        hasFile: !!formData.qhnpFile
      });

      // Call backend to calculate SRC curves
      const response = await calculateSRCCurves({
        shValue: calculatedValues.shValue,
        qnp: parseFloat(formData.flowQnp),
        hnp: parseFloat(formData.headHnp),
        qact: parseFloat(formData.actualFlowRequired),
        hact: parseFloat(formData.actualDischargePressure),
        qhFile: formData.qhnpFile
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Store calculated values from backend
      setCalculatedValues(prev => ({
        ...prev,
        qnp: response.qnp,
        hnp: response.hnp,
        k1: response.k1,
        k2: response.k2,
        srcCurveData: response.srcCurveData,
        theoreticalSRC: response.theoreticalSRC,
        actualSRC: response.actualSRC
      }));
      
      setMessage({ 
        type: 'success', 
        text: `Step 2 completed! k1: ${response.k1.toFixed(4)}, k2: ${response.k2.toFixed(4)}. SRC curves generated successfully!` 
      });
      
      // Move to next step
      setTimeout(() => {
        setCurrentStep(3);
        setMessage({ type: '', text: '' });
      }, 2000);
      
    } catch (error) {
      console.error('Step 2 submission error:', error);
      setMessage({ 
        type: 'error', 
        text: `Error processing Step 2: ${error.message}` 
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Helper function for SH calculation (this would be backend calculation)
  const calculateSH = (data) => {
    // This is a simplified calculation - actual calculation would be in backend
    const h1 = parseFloat(data.daTankHeight) || 0;
    const h2 = parseFloat(data.boilerDrumHeight) || 0;
    const p1 = parseFloat(data.daTankPressure) || 0;
    const p2 = parseFloat(data.boilerDrumPressure) || 0;
    const sg = parseFloat(data.specificGravity) || 1;
    
    // Simplified SH calculation
    return (h2 - h1) + ((p2 - p1) * 10.2) / sg;
  };

  // Process Q-H curve file to extract Qnp and Hnp
  const processQHCurveFile = async (file) => {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    
    try {
      // Simulate file processing - in real implementation, this would parse Excel/CSV
      // For now, return sample data
      return {
        qnp: parseFloat(formData.flowQnp) || 60,
        hnp: parseFloat(formData.headHnp) || 910,
        curveData: [
          { q: 0, h: 1000 },
          { q: 20, h: 950 },
          { q: 40, h: 850 },
          { q: 60, h: 700 },
          { q: 80, h: 500 }
        ]
      };
    } catch (error) {
      return { error: 'Failed to process Q-H curve file' };
    }
  };

  // Calculate k1 = (Hnp - SH) / Qnp²
  const calculateK1 = (qnp, hnp, sh) => {
    if (qnp === 0) return 0;
    return (hnp - sh) / (qnp * qnp);
  };

  // Calculate k2 = (Hact - SH) / Qact²
  const calculateK2 = (qact, hact, sh) => {
    if (qact === 0) return 0;
    return (hact - sh) / (qact * qact);
  };

  // Call backend API to calculate SRC curves
  const calculateSRCCurves = async (data) => {
    try {
      const formDataToSend = new FormData();
      
      // Add all calculation parameters
      formDataToSend.append('shValue', data.shValue);
      formDataToSend.append('qnp', data.qnp);
      formDataToSend.append('hnp', data.hnp);
      formDataToSend.append('qact', data.qact);
      formDataToSend.append('hact', data.hact);
      
      // Add file if available
      if (data.qhFile) {
        formDataToSend.append('qhFile', data.qhFile);
      }

      const response = await fetch('http://localhost:8000/api/calculate-src-curves/', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('Error calling SRC calculation API:', error);
      
      // Fallback: Calculate locally if backend is not available
      console.log('Backend not available, calculating locally...');
      
      const k1 = (data.hnp - data.shValue) / (data.qnp * data.qnp);
      const k2 = (data.hact - data.shValue) / (data.qact * data.qact);
      
      // Generate SRC curve data points
      const maxFlow = Math.max(data.qnp, data.qact) * 1.2;
      const theoreticalSRC = [];
      const actualSRC = [];
      
      for (let i = 0; i <= 20; i++) {
        const qi = (maxFlow / 20) * i;
        const theoreticalSrc = data.shValue + k1 * (qi * qi);
        const actualSrc = data.shValue + k2 * (qi * qi);
        theoreticalSRC.push({ q: qi, src: theoreticalSrc });
        actualSRC.push({ q: qi, src: actualSrc });
      }
      
      return {
        success: true,
        qnp: data.qnp,
        hnp: data.hnp,
        k1: k1,
        k2: k2,
        theoreticalSRC: theoreticalSRC,
        actualSRC: actualSRC,
        operatingPoint: {
          qact: data.qact,
          hact: data.hact
        }
      };
    }
  };

  return (
    <div className="operational-philosophy-page">
      <Navbar />
      
      {/* Header Section */}
      <div className="philosophy-header">
        <h1 className="philosophy-title">Choose Your Operation Philosophy</h1>
        <p className="philosophy-subtitle">Select your pump configuration and provide project details for energy optimization analysis</p>
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

      {/* Main Content */}
      <div className="philosophy-content">
        {/* Project Selection */}
        <div className="project-selection-section">
          <h2 className="section-title">Select Your Pump Configuration</h2>
          
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

        {/* Selected Project Details */}
        {selectedProject && (
          <div className="project-details-section">
            <h2 className="section-title">Project Details - {selectedProject}</h2>
            
            <div className="project-details-container">
              {/* Design Section */}
              <div className="design-section">
                <h3>Design Reference</h3>
                <div className="design-viewer">
                  {!imageLoaded && (
                    <div className="image-loading">
                      <div className="loading-spinner" style={{
                        width: '40px', height: '40px', border: '4px solid #f3f3f3',
                        borderTop: '4px solid #007bff', borderRadius: '50%',
                        animation: 'spin 1s linear infinite', margin: '0 auto 16px'
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
                      display: imageLoaded ? 'block' : 'none'
                    }}
                  />
                </div>
              </div>

              {/* Form Section */}
              <div className="form-section">
                <h3>Project Details - Step {currentStep} of 3</h3>
                
                {/* Progress Indicator */}
                <div className="progress-indicator">
                  <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Process Parameters</span>
                  </div>
                  <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Name Plate Reading</span>
                  </div>
                  <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Graph Analysis</span>
                  </div>
                </div>

                {/* Step 1: Process Parameters */}
                {currentStep === 1 && (
                  <form onSubmit={handleProcessParametersSubmit} className="project-details-form">
                  <div className="form-group-section">
                    <h4>Process Parameters</h4>
                    <p className="step-description">Enter the process parameters. These will be used to calculate the SH value.</p>
                    <div className="form-row">
                      <div className="form-group">
                        <label>DA Tank Height from Pump Center line (h1)</label>
                        <input type="number" name="daTankHeight" value={formData.daTankHeight} onChange={handleInputChange} step="0.01" required />
                        <span className="unit">m</span>
                      </div>
                      <div className="form-group">
                        <label>Boiler Drum Height from Pump Center line (h2)</label>
                        <input type="number" name="boilerDrumHeight" value={formData.boilerDrumHeight} onChange={handleInputChange} step="0.01" required />
                        <span className="unit">m</span>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>DA Tank Pressure (P1)</label>
                        <input type="number" name="daTankPressure" value={formData.daTankPressure} onChange={handleInputChange} step="0.01" required />
                        <span className="unit">Kg/cm²</span>
                      </div>
                      <div className="form-group">
                        <label>Boiler Drum Pressure (P2)</label>
                        <input type="number" name="boilerDrumPressure" value={formData.boilerDrumPressure} onChange={handleInputChange} step="0.01" required />
                        <span className="unit">Kg/cm²</span>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Feed Water Temperature (t)</label>
                        <input type="number" name="feedWaterTemp" value={formData.feedWaterTemp} onChange={handleInputChange} step="0.01" required />
                        <span className="unit">°C</span>
                      </div>
                      <div className="form-group">
                        <label>Specific Gravity at t (SG)</label>
                        <input type="number" name="specificGravity" value={formData.specificGravity} onChange={handleInputChange} step="0.0001" required />
                        <span className="unit">-</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Display calculated SH value if available */}
                  {calculatedValues.shValue && (
                    <div className="calculated-value-display">
                      <h4>Calculated Values</h4>
                      <div className="calculated-result">
                        <strong>SH Value: {calculatedValues.shValue.toFixed(2)}</strong>
                        <p>This value will be stored and used for further calculations in the next steps.</p>
                      </div>
                    </div>
                  )}
                  
                    <div className="form-submit-section">
                      <button type="submit" className="submit-btn" disabled={formLoading}>
                        {formLoading ? 'Calculating SH Value...' : 'Calculate SH Value & Proceed'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 2: Name Plate Reading + File Upload */}
                {currentStep === 2 && (
                  <form onSubmit={handleStep2Submit} className="project-details-form">
                    <div className="form-group-section">
                      <h4>Step 1: Nominal Point Values (Name Plate Reading)</h4>
                      <p className="step-description">Enter the nominal point values from the pump name plate. These will be used to calculate k1 and prepare the Theoretical SRC formula.</p>
                      
                      {calculatedValues.shValue && (
                        <div className="calculated-value-display">
                          <h4>Step 1 Results</h4>
                          <div className="calculated-result">
                            <strong>SH Value: {calculatedValues.shValue.toFixed(2)}</strong>
                            <p>This value will be used for SRC curve calculations.</p>
                          </div>
                        </div>
                      )}

                      {/* Real-time k1 and SRC calculation display */}
                      {(calculatedValues.k1 || calculatedValues.k2) && (
                        <div className="calculated-value-display">
                          <h4>Real-time Calculations</h4>
                          <div className="calculated-result">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                              {calculatedValues.k1 && (
                                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <strong style={{ color: '#3b82f6' }}>k1 (Theoretical)</strong>
                                    <span style={{ color: '#10b981', fontSize: '0.8rem' }}>✓</span>
                                  </div>
                                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1e40af' }}>
                                    {calculatedValues.k1.toFixed(4)}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '5px' }}>
                                    SRC = {calculatedValues.shValue.toFixed(2)} + {calculatedValues.k1.toFixed(4)} × Q²
                                  </div>
                                </div>
                              )}
                              
                              {calculatedValues.k2 && (
                                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <strong style={{ color: '#10b981' }}>k2 (Actual)</strong>
                                    <span style={{ color: '#10b981', fontSize: '0.8rem' }}>✓</span>
                                  </div>
                                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#059669' }}>
                                    {calculatedValues.k2.toFixed(4)}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '5px' }}>
                                    SRC = {calculatedValues.shValue.toFixed(2)} + {calculatedValues.k2.toFixed(4)} × Q²
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Sample SRC Values */}
                            {(calculatedValues.theoreticalSRC || calculatedValues.actualSRC) && (
                              <div style={{ marginTop: '20px' }}>
                                <h5 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '15px', textAlign: 'center' }}>Sample SRC Values:</h5>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                                  {(calculatedValues.theoreticalSRC || calculatedValues.actualSRC).slice(0, 8).map((point, index) => (
                                    <div key={index} style={{ 
                                      background: 'rgba(255, 255, 255, 0.1)', 
                                      padding: '6px 8px', 
                                      borderRadius: '6px',
                                      fontSize: '0.75rem',
                                      textAlign: 'center',
                                      border: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}>
                                      <div style={{ color: '#93c5fd' }}>Q: {point.q.toFixed(1)}</div>
                                      <div style={{ color: '#fbbf24', fontWeight: '600' }}>SRC: {point.src.toFixed(1)}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="form-row">
                        <div className="form-group">
                          <label>Flow (Qnp)</label>
                          <input type="number" name="flowQnp" value={formData.flowQnp} onChange={handleInputChange} step="0.01" required />
                          <span className="unit">m³/hr</span>
                        </div>
                        <div className="form-group">
                          <label>Head (Hnp)</label>
                          <input type="number" name="headHnp" value={formData.headHnp} onChange={handleInputChange} step="0.01" required />
                          <span className="unit">m</span>
                        </div>
                      </div>
                      
                      {/* Manual k1 Calculation Button */}
                      <div className="form-row" style={{ justifyContent: 'center', marginTop: '20px' }}>
                        <button 
                          type="button" 
                          onClick={() => calculateRealTimeSRC('manual', '')}
                          disabled={!formData.flowQnp || !formData.headHnp || !calculatedValues.shValue || calculatingSRC}
                          style={{
                            background: calculatingSRC ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: calculatingSRC ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                            opacity: (!formData.flowQnp || !formData.headHnp || !calculatedValues.shValue || calculatingSRC) ? 0.5 : 1
                          }}
                          onMouseOver={(e) => {
                            if (e.target.disabled === false) {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                            }
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                          }}
                        >
                          {calculatingSRC ? (
                            <>
                              <span style={{ 
                                display: 'inline-block', 
                                width: '16px', 
                                height: '16px', 
                                border: '2px solid #ffffff', 
                                borderTop: '2px solid transparent', 
                                borderRadius: '50%', 
                                animation: 'spin 1s linear infinite',
                                marginRight: '8px'
                              }}></span>
                              Calculating...
                            </>
                          ) : (
                            '🔢 Calculate k1 & SRC Values'
                          )}
                        </button>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>BKW (BKWnp)</label>
                          <input type="number" name="bkwBkwnp" value={formData.bkwBkwnp} onChange={handleInputChange} step="0.01" required />
                          <span className="unit">KWH</span>
                        </div>
                        <div className="form-group">
                          <label>Efficiency (ηnp)</label>
                          <input type="number" name="efficiency" value={formData.efficiency} onChange={handleInputChange} step="0.01" required />
                          <span className="unit">%</span>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Speed (N1)</label>
                          <input type="number" name="speedN1" value={formData.speedN1} onChange={handleInputChange} step="0.01" required />
                          <span className="unit">rpm</span>
                        </div>
                      </div>
                    </div>

                    {/* File Upload - Step 2 */}
                    <div className="form-group-section">
                      <h4>Step 2: Upload Pump Q-H Dataset</h4>
                      <div className="file-upload-info">
                        <p><strong>📋 File Upload Instructions:</strong></p>
                        <ul>
                          <li><strong>Required:</strong> Upload your QH.xlsx/CSV file containing the complete Flow vs Head curve</li>
                          <li><strong>Format:</strong> Excel/CSV file with Flow (Q) in column 1, Head (H) in column 2</li>
                          <li><strong>Purpose:</strong> Use the full dataset to generate SRC curve and compare with manufacturer's Q-H curve</li>
                          <li><strong>Range:</strong> File should contain data from 0 to Qmax for complete curve plotting</li>
                        </ul>
                      </div>
                      <div className="form-row">
                        <div className="form-group required">
                          <label>Upload Q-H Dataset (Required) <span className="required-mark">*</span></label>
                          <input type="file" onChange={(e) => handleFileChange(e, 'qhnpFile')} accept=".csv,.xlsx,.xls" required />
                          <small className="file-help">Complete pump Q-H curve from manufacturer (Excel/CSV format)</small>
                        </div>
                      </div>
                    </div>

                    {/* Actual Requirements */}
                    <div className="form-group-section">
                      <h4>Actual Operating Parameters</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Actual Flow Required (Qact)</label>
                          <input type="number" name="actualFlowRequired" value={formData.actualFlowRequired} onChange={handleInputChange} step="0.01" required />
                          <span className="unit">m³/hr</span>
                        </div>
                        <div className="form-group">
                          <label>Actual Discharge Pressure (Hact)</label>
                          <input type="number" name="actualDischargePressure" value={formData.actualDischargePressure} onChange={handleInputChange} step="0.01" required />
                          <span className="unit">m</span>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Actual running Speed (N2)</label>
                          <input type="number" name="actualSpeedN2" value={formData.actualSpeedN2} onChange={handleInputChange} step="0.01" required />
                          <span className="unit">rpm</span>
                        </div>
                        <div className="form-group">
                          <label>Actual Power Consumption</label>
                          <input type="number" name="actualPowerConsumption" value={formData.actualPowerConsumption} onChange={handleInputChange} step="0.01" required />
                          <span className="unit">kW</span>
                        </div>
                      </div>
                      
                      {/* Manual k2 Calculation Button */}
                      <div className="form-row" style={{ justifyContent: 'center', marginTop: '20px' }}>
                        <button 
                          type="button" 
                          onClick={() => calculateRealTimeSRC('manual', '')}
                          disabled={!formData.actualFlowRequired || !formData.actualDischargePressure || !calculatedValues.shValue || calculatingSRC}
                          style={{
                            background: calculatingSRC ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: calculatingSRC ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                            opacity: (!formData.actualFlowRequired || !formData.actualDischargePressure || !calculatedValues.shValue || calculatingSRC) ? 0.5 : 1
                          }}
                          onMouseOver={(e) => {
                            if (e.target.disabled === false) {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                            }
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                          }}
                        >
                          {calculatingSRC ? (
                            <>
                              <span style={{ 
                                display: 'inline-block', 
                                width: '16px', 
                                height: '16px', 
                                border: '2px solid #ffffff', 
                                borderTop: '2px solid transparent', 
                                borderRadius: '50%', 
                                animation: 'spin 1s linear infinite',
                                marginRight: '8px'
                              }}></span>
                              Calculating...
                            </>
                          ) : (
                            '🔢 Calculate k2 & Actual SRC Values'
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="form-submit-section">
                      <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={formLoading}
                        style={{
                          background: formLoading ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '15px 30px',
                          borderRadius: '10px',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          cursor: formLoading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                          opacity: formLoading ? 0.7 : 1
                        }}
                      >
                        {formLoading ? (
                          <>
                            <span style={{ 
                              display: 'inline-block', 
                              width: '20px', 
                              height: '20px', 
                              border: '2px solid #ffffff', 
                              borderTop: '2px solid transparent', 
                              borderRadius: '50%', 
                              animation: 'spin 1s linear infinite',
                              marginRight: '10px'
                            }}></span>
                            Processing Q-H Curve...
                          </>
                        ) : (
                          '🚀 Process Q-H Curve & Generate SRC'
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Graph Analysis */}
                {currentStep === 3 && (
                  <div className="graph-analysis-section">
                    <h4>SRC Curve Analysis</h4>
                    <p className="step-description">Analysis complete! Here are the calculated SRC curves and comparison.</p>
                    
                    {calculatedValues.k1 && calculatedValues.k2 && (
                      <div className="calculated-value-display">
                        <h4>Calculated Values</h4>
                        <div className="calculated-result">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <strong>k1 (Theoretical): {calculatedValues.k1.toFixed(4)}</strong>
                            <strong>k2 (Actual): {calculatedValues.k2.toFixed(4)}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Qnp: {calculatedValues.qnp} m³/hr</span>
                            <span>Hnp: {calculatedValues.hnp} m</span>
                          </div>
                          <p>SRC curves generated successfully! Graph visualization coming soon...</p>
                        </div>
                      </div>
                    )}

                    {/* Display SRC Curve Data */}
                    {calculatedValues.theoreticalSRC && calculatedValues.actualSRC && (
                      <div className="src-curves-display">
                        <h4>SRC Curve Data</h4>
                        <div className="curves-container">
                          <div className="curve-section">
                            <h5>Theoretical SRC Curve (k1)</h5>
                            <div className="curve-data">
                              {calculatedValues.theoreticalSRC.map((point, index) => (
                                <div key={index} className="curve-point">
                                  <span>Q: {point.q.toFixed(2)} m³/hr</span>
                                  <span>SRC: {point.src.toFixed(2)} m</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="curve-section">
                            <h5>Actual SRC Curve (k2)</h5>
                            <div className="curve-data">
                              {calculatedValues.actualSRC.map((point, index) => (
                                <div key={index} className="curve-point">
                                  <span>Q: {point.q.toFixed(2)} m³/hr</span>
                                  <span>SRC: {point.src.toFixed(2)} m</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="form-submit-section">
                      <button type="button" className="submit-btn" onClick={() => {
                        setCurrentStep(1);
                        setCalculatedValues({});
                        setFormData({
                          projectType: '',
                          daTankHeight: '',
                          boilerDrumHeight: '',
                          daTankPressure: '',
                          boilerDrumPressure: '',
                          feedWaterTemp: '',
                          specificGravity: '',
                          actualFlow24hrs: '',
                          actualFlowRequired: '',
                          actualSpeedN2: '',
                          actualDischargePressure: '',
                          actualSuctionPressure: '',
                          actualPowerConsumption: '',
                          flowQnp: '',
                          headHnp: '',
                          bkwBkwnp: '',
                          efficiency: '',
                          speedN1: '',
                          qhnpFile: null,
                          qhactFile: null,
                          qhmodFile: null,
                          despInputFile: null,
                          flowchartFile: null
                        });
                      }}>
                        Start New Analysis
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

export default OperationalPhilosophy;