import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './EnergyOptimizationResultsPage.css';
import Navbar from './Navbar';
import { FaDownload, FaChartLine, FaFileAlt, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const EnergyOptimizationResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('calculations');
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get data from navigation state
    const data = location.state;
    if (data) {
      setResultsData(data);
      console.log('Results data received:', data);
    } else {
      console.log('No results data found in location state');
    }
    setLoading(false);
  }, [location.state]);

  const handleDownloadProposal = () => {
    if (resultsData?.analysisResults?.proposal) {
      const proposalData = resultsData.analysisResults.proposal;
      const blob = new Blob([JSON.stringify(proposalData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'energy-optimization-proposal.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const renderCalculations = () => {
    const calculations = resultsData?.analysisResults?.calculations;
    
    if (!calculations) {
      return (
        <div className="no-data">
          <p>No calculation results available.</p>
        </div>
      );
    }

    return (
      <div className="calculations-content">
        <h3>Energy Optimization Calculations</h3>
        
        <div className="calculation-grid">
          <div className="calculation-card">
            <h4>Efficiency Analysis</h4>
            <div className="calculation-item">
              <span className="label">Current Efficiency:</span>
              <span className="value">{calculations.current_efficiency || 'N/A'}%</span>
            </div>
            <div className="calculation-item">
              <span className="label">Optimized Efficiency:</span>
              <span className="value">{calculations.optimized_efficiency || 'N/A'}%</span>
            </div>
            <div className="calculation-item">
              <span className="label">Efficiency Improvement:</span>
              <span className="value improvement">{calculations.efficiency_improvement || 'N/A'}%</span>
            </div>
          </div>

          <div className="calculation-card">
            <h4>Power Consumption</h4>
            <div className="calculation-item">
              <span className="label">Current Power:</span>
              <span className="value">{calculations.current_power || 'N/A'} kW</span>
            </div>
            <div className="calculation-item">
              <span className="label">Optimized Power:</span>
              <span className="value">{calculations.optimized_power || 'N/A'} kW</span>
            </div>
            <div className="calculation-item">
              <span className="label">Power Saving:</span>
              <span className="value saving">{calculations.power_saving || 'N/A'} kW</span>
            </div>
          </div>

          <div className="calculation-card">
            <h4>Cost Analysis</h4>
            <div className="calculation-item">
              <span className="label">Daily Cost Saving:</span>
              <span className="value saving">₹{calculations.daily_cost_saving || 'N/A'}</span>
            </div>
            <div className="calculation-item">
              <span className="label">Annual Cost Saving:</span>
              <span className="value saving">₹{calculations.annual_cost_saving || 'N/A'}</span>
            </div>
            <div className="calculation-item">
              <span className="label">Payback Period:</span>
              <span className="value">{calculations.payback_period || 'N/A'} days</span>
            </div>
          </div>

          <div className="calculation-card">
            <h4>Environmental Impact</h4>
            <div className="calculation-item">
              <span className="label">CO₂ Reduction:</span>
              <span className="value environmental">{calculations.co2_reduction || 'N/A'} kg/year</span>
            </div>
            <div className="calculation-item">
              <span className="label">Trees Saved:</span>
              <span className="value environmental">{calculations.trees_saved || 'N/A'} trees/year</span>
            </div>
            <div className="calculation-item">
              <span className="label">Energy Saved:</span>
              <span className="value environmental">{calculations.energy_saved || 'N/A'} kWh/year</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlots = () => {
    const plots = resultsData?.analysisResults?.plots;
    
    if (!plots) {
      return (
        <div className="no-data">
          <p>No plot data available.</p>
        </div>
      );
    }

    const plotTitles = [
      'Qnp–Hnp Curve with SRC1 & SRC2 (when N1 = N2)',
      'Qnp–Hnp Curve with SRC1 & SRC3 (when N1 ≠ N2)',
      'Qreq–Hreq Curve with SRC (modified/replacement pump Curve)',
      'Efficiency (Eff1 vs Eff2)',
      'BKW1, BKW2, and Saving vs Time (days)',
      'Power Consumption (Before, After) and Saving vs Time (days)',
      'Cost of Pump Running (Before, After) vs Time (days)',
      'Money Saved vs Time (days) with Investment Cost Curve',
      'Number of Trees Saved vs Time (days)',
      'CO₂ Reduction (kg) vs Time (days)'
    ];

    return (
      <div className="plots-content">
        <h3>Energy Optimization Analysis Plots</h3>
        
        <div className="plots-grid">
          {plotTitles.map((title, index) => {
            const plotKey = `plot_${index + 1}`;
            const plotData = plots[plotKey];
            
            return (
              <div key={index} className="plot-card">
                <h4>{title}</h4>
                <div className="plot-container">
                  {plotData ? (
                    <img 
                      src={`data:image/png;base64,${plotData}`} 
                      alt={title}
                      className="plot-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className="plot-placeholder" style={{ display: plotData ? 'none' : 'block' }}>
                    <FaChartLine className="plot-icon" />
                    <p>Plot {index + 1} - {title}</p>
                    <small>Plot data not available</small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProposal = () => {
    const proposal = resultsData?.analysisResults?.proposal;
    
    if (!proposal) {
      return (
        <div className="no-data">
          <p>No proposal data available.</p>
        </div>
      );
    }

    return (
      <div className="proposal-content">
        <div className="proposal-header">
          <h3>Energy Optimization Proposal</h3>
          <button onClick={handleDownloadProposal} className="download-btn">
            <FaDownload /> Download Proposal
          </button>
        </div>
        
        <div className="proposal-body">
          <div className="proposal-section">
            <h4>Executive Summary</h4>
            <p>{proposal.executive_summary || 'Executive summary not available.'}</p>
          </div>
          
          <div className="proposal-section">
            <h4>Current System Analysis</h4>
            <p>{proposal.current_analysis || 'Current system analysis not available.'}</p>
          </div>
          
          <div className="proposal-section">
            <h4>Proposed Optimization</h4>
            <p>{proposal.proposed_optimization || 'Proposed optimization details not available.'}</p>
          </div>
          
          <div className="proposal-section">
            <h4>Expected Benefits</h4>
            <ul>
              {proposal.expected_benefits?.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              )) || ['Expected benefits not available.']}
            </ul>
          </div>
          
          <div className="proposal-section">
            <h4>Implementation Timeline</h4>
            <p>{proposal.implementation_timeline || 'Implementation timeline not available.'}</p>
          </div>
          
          <div className="proposal-section">
            <h4>Investment & ROI</h4>
            <p>{proposal.investment_roi || 'Investment and ROI details not available.'}</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="energy-optimization-results-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="energy-optimization-results-page">
      <Navbar />
      
      <div className="results-container">
        <div className="results-header">
          <h1>📊 Energy Optimization Analysis Results</h1>
          <p>Your energy optimization analysis has been completed successfully!</p>
          
          <div className="header-actions">
            <button onClick={() => navigate('/energy-optimization-form')} className="action-button secondary">
              <FaArrowLeft /> Back to Form
            </button>
            <button onClick={() => navigate('/energy-optimization-form')} className="action-button primary">
              <FaCheckCircle /> Submit New Analysis
            </button>
          </div>
        </div>

        <div className="results-content">
          <div className="results-tabs">
            <button 
              className={`tab-button ${activeTab === 'calculations' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculations')}
            >
              <FaChartLine /> Calculations
            </button>
            <button 
              className={`tab-button ${activeTab === 'plots' ? 'active' : ''}`}
              onClick={() => setActiveTab('plots')}
            >
              <FaChartLine /> Plots & Charts
            </button>
            <button 
              className={`tab-button ${activeTab === 'proposal' ? 'active' : ''}`}
              onClick={() => setActiveTab('proposal')}
            >
              <FaFileAlt /> Proposal
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'calculations' && renderCalculations()}
            {activeTab === 'plots' && renderPlots()}
            {activeTab === 'proposal' && renderProposal()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyOptimizationResultsPage;