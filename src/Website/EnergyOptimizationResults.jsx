import React, { useState, useEffect } from 'react';
import './EnergyOptimizationResults.css';
import Navbar from './Navbar';
import { FaDownload, FaChartLine, FaFilePdf, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const EnergyOptimizationResults = ({ submissionId, calculations, plots, proposal }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlot, setSelectedPlot] = useState(null);

  useEffect(() => {
    try {
      // If results are passed directly, use them
      if (calculations || plots || proposal) {
        console.log('Using passed results:', { calculations: !!calculations, plots: !!plots, proposal: !!proposal });
        setResults({
          calculations: calculations || {},
          plots: plots || {},
          proposal: proposal || {},
          submissionId: submissionId || 'unknown'
        });
        setLoading(false);
      } else if (submissionId) {
        console.log('No results passed, fetching from backend...');
        // Otherwise fetch from backend
        fetchResults();
      } else {
        console.log('No submissionId or results provided');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in EnergyOptimizationResults useEffect:', error);
      setError('Error loading results');
      setLoading(false);
    }
  }, [submissionId, calculations, plots, proposal]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API call
      // const response = await fetch(`/api/energy-optimization-results/${submissionId}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockResults = {
        submission: {
          project_type: '1R + 1S',
          created_at: new Date().toISOString(),
          analysis_completed: true,
          plots_generated: true,
          proposal_generated: true
        },
        calculations: {
          efficiency_before: 65.2,
          efficiency_after: 78.5,
          power_saving: 15.8,
          daily_cost_saving: 45.60,
          annual_cost_saving: 16644,
          payback_period_days: 1095,
          annual_co2_reduction: 11650,
          annual_trees_saved: 466
        },
        plots: {
          plot1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          plot2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          plot3: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          plot4: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          plot5: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          plot6: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          plot7: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          plot8: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          plot9: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          plot10: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        },
        proposal: {
          executive_summary: {
            title: 'Executive Summary',
            content: 'This proposal presents a comprehensive energy optimization solution...',
            key_metrics: {
              efficiency_improvement: '13.3%',
              annual_savings: '$16,644',
              payback_period: '3.0 years',
              co2_reduction: '11,650 kg/year'
            }
          }
        }
      };
      
      setResults(mockResults);
    } catch (err) {
      setError('Failed to load results');
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  const plotTitles = {
    plot1: 'Qnp–Hnp Curve with SRC1 & SRC2 (when N1 = N2)',
    plot2: 'Qnp–Hnp Curve with SRC1 & SRC3 (when N1 ≠ N2)',
    plot3: 'Qreq–Hreq Curve with SRC (modified/replacement pump Curve)',
    plot4: 'Efficiency (Eff1 vs Eff2)',
    plot5: 'BKW1, BKW2, and Saving vs Time (days)',
    plot6: 'Power Consumption (Before, After) and Saving vs Time (days)',
    plot7: 'Cost of Pump Running (Before, After) vs Time (days)',
    plot8: 'Money Saved vs Time (days) with Investment Cost Curve',
    plot9: 'Number of Trees Saved vs Time (days)',
    plot10: 'CO₂ Reduction (kg) vs Time (days)'
  };

  const downloadProposal = () => {
    // This would generate and download the PDF proposal
    console.log('Downloading proposal...');
  };

  const downloadPlot = (plotId) => {
    // This would download the specific plot
    console.log(`Downloading plot ${plotId}...`);
  };

  if (loading) {
    return (
      <div className="energy-results-container">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading energy optimization results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="energy-results-container">
        <Navbar />
        <div className="error-container">
          <FaExclamationTriangle className="error-icon" />
          <h2>Error Loading Results</h2>
          <p>{error || 'No results found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="energy-results-container">
      <Navbar />
      
      {/* Header */}
      <div className="results-header">
        <div className="header-content">
          <h1>Energy Optimization Analysis Results</h1>
          <div className="project-info">
            <span className="project-type">{results.submission.project_type}</span>
            <span className="analysis-date">
              {new Date(results.submission.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="status-badges">
            {results.submission.analysis_completed && (
              <span className="status-badge completed">
                <FaCheckCircle /> Analysis Complete
              </span>
            )}
            {results.submission.plots_generated && (
              <span className="status-badge completed">
                <FaChartLine /> Plots Generated
              </span>
            )}
            {results.submission.proposal_generated && (
              <span className="status-badge completed">
                <FaFilePdf /> Proposal Ready
              </span>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button className="download-btn" onClick={downloadProposal}>
            <FaDownload /> Download Proposal
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="results-navigation">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'calculations' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculations')}
        >
          Calculations
        </button>
        <button 
          className={`nav-tab ${activeTab === 'plots' ? 'active' : ''}`}
          onClick={() => setActiveTab('plots')}
        >
          Plots & Charts
        </button>
        <button 
          className={`nav-tab ${activeTab === 'proposal' ? 'active' : ''}`}
          onClick={() => setActiveTab('proposal')}
        >
          Proposal
        </button>
      </div>

      {/* Content */}
      <div className="results-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="key-metrics">
              <h2>Key Performance Metrics</h2>
              <div className="metrics-grid">
                <div className="metric-card">
                  <h3>Efficiency Improvement</h3>
                  <div className="metric-value">
                    {(results.calculations.efficiency_after - results.calculations.efficiency_before).toFixed(1)}%
                  </div>
                  <div className="metric-detail">
                    {results.calculations.efficiency_before.toFixed(1)}% → {results.calculations.efficiency_after.toFixed(1)}%
                  </div>
                </div>
                <div className="metric-card">
                  <h3>Power Savings</h3>
                  <div className="metric-value">
                    {results.calculations.power_saving.toFixed(1)} kW
                  </div>
                  <div className="metric-detail">
                    Daily reduction
                  </div>
                </div>
                <div className="metric-card">
                  <h3>Annual Cost Savings</h3>
                  <div className="metric-value">
                    ${results.calculations.annual_cost_saving.toLocaleString()}
                  </div>
                  <div className="metric-detail">
                    ${results.calculations.daily_cost_saving.toFixed(2)} per day
                  </div>
                </div>
                <div className="metric-card">
                  <h3>Payback Period</h3>
                  <div className="metric-value">
                    {(results.calculations.payback_period_days / 365).toFixed(1)} years
                  </div>
                  <div className="metric-detail">
                    {results.calculations.payback_period_days} days
                  </div>
                </div>
                <div className="metric-card">
                  <h3>CO₂ Reduction</h3>
                  <div className="metric-value">
                    {results.calculations.annual_co2_reduction.toLocaleString()} kg
                  </div>
                  <div className="metric-detail">
                    Annual reduction
                  </div>
                </div>
                <div className="metric-card">
                  <h3>Trees Saved</h3>
                  <div className="metric-value">
                    {results.calculations.annual_trees_saved.toFixed(0)}
                  </div>
                  <div className="metric-detail">
                    Annual environmental impact
                  </div>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h2>Executive Summary</h2>
              <div className="summary-content">
                <p>
                  This energy optimization analysis demonstrates significant opportunities for 
                  efficiency improvement and cost reduction in your {results.submission.project_type} pump system.
                </p>
                <p>
                  The proposed optimization will deliver a {((results.calculations.efficiency_after - results.calculations.efficiency_before) / results.calculations.efficiency_before * 100).toFixed(1)}% 
                  improvement in pump efficiency, resulting in annual savings of ${results.calculations.annual_cost_saving.toLocaleString()} 
                  with a payback period of {(results.calculations.payback_period_days / 365).toFixed(1)} years.
                </p>
                <p>
                  Additionally, the optimization will contribute to environmental sustainability by reducing 
                  CO₂ emissions by {results.calculations.annual_co2_reduction.toLocaleString()} kg annually, 
                  equivalent to saving {results.calculations.annual_trees_saved.toFixed(0)} trees.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculations' && (
          <div className="calculations-section">
            <h2>Detailed Calculations</h2>
            <div className="calculations-grid">
              <div className="calculation-group">
                <h3>Efficiency Analysis</h3>
                <div className="calculation-item">
                  <label>Current Efficiency:</label>
                  <span>{results.calculations.efficiency_before.toFixed(1)}%</span>
                </div>
                <div className="calculation-item">
                  <label>Optimized Efficiency:</label>
                  <span>{results.calculations.efficiency_after.toFixed(1)}%</span>
                </div>
                <div className="calculation-item">
                  <label>Efficiency Improvement:</label>
                  <span>{(results.calculations.efficiency_after - results.calculations.efficiency_before).toFixed(1)}%</span>
                </div>
              </div>

              <div className="calculation-group">
                <h3>Power Analysis</h3>
                <div className="calculation-item">
                  <label>Current Power Consumption:</label>
                  <span>{results.calculations.power_saving + results.calculations.power_saving * 0.2} kW</span>
                </div>
                <div className="calculation-item">
                  <label>Optimized Power Consumption:</label>
                  <span>{results.calculations.power_saving * 0.2} kW</span>
                </div>
                <div className="calculation-item">
                  <label>Power Savings:</label>
                  <span>{results.calculations.power_saving.toFixed(1)} kW</span>
                </div>
              </div>

              <div className="calculation-group">
                <h3>Cost Analysis</h3>
                <div className="calculation-item">
                  <label>Daily Cost Savings:</label>
                  <span>${results.calculations.daily_cost_saving.toFixed(2)}</span>
                </div>
                <div className="calculation-item">
                  <label>Annual Cost Savings:</label>
                  <span>${results.calculations.annual_cost_saving.toLocaleString()}</span>
                </div>
                <div className="calculation-item">
                  <label>Payback Period:</label>
                  <span>{(results.calculations.payback_period_days / 365).toFixed(1)} years</span>
                </div>
              </div>

              <div className="calculation-group">
                <h3>Environmental Impact</h3>
                <div className="calculation-item">
                  <label>Annual CO₂ Reduction:</label>
                  <span>{results.calculations.annual_co2_reduction.toLocaleString()} kg</span>
                </div>
                <div className="calculation-item">
                  <label>Annual Trees Saved:</label>
                  <span>{results.calculations.annual_trees_saved.toFixed(0)}</span>
                </div>
                <div className="calculation-item">
                  <label>Daily CO₂ Reduction:</label>
                  <span>{(results.calculations.annual_co2_reduction / 365).toFixed(1)} kg</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plots' && (
          <div className="plots-section">
            <h2>Analysis Plots and Charts</h2>
            <div className="plots-grid">
              {Object.entries(results.plots).map(([plotId, plotData]) => (
                <div key={plotId} className="plot-card">
                  <div className="plot-header">
                    <h3>{plotTitles[plotId]}</h3>
                    <button 
                      className="download-plot-btn"
                      onClick={() => downloadPlot(plotId)}
                    >
                      <FaDownload />
                    </button>
                  </div>
                  <div className="plot-container">
                    <img 
                      src={plotData} 
                      alt={plotTitles[plotId]}
                      onClick={() => setSelectedPlot(plotId)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'proposal' && (
          <div className="proposal-section">
            <h2>Generated Proposal</h2>
            <div className="proposal-content">
              <div className="proposal-section">
                <h3>{results.proposal.executive_summary.title}</h3>
                <div className="proposal-text">
                  {results.proposal.executive_summary.content}
                </div>
                <div className="proposal-metrics">
                  {Object.entries(results.proposal.executive_summary.key_metrics).map(([key, value]) => (
                    <div key={key} className="proposal-metric">
                      <span className="metric-label">{key.replace(/_/g, ' ').toUpperCase()}:</span>
                      <span className="metric-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="proposal-actions">
              <button className="download-proposal-btn" onClick={downloadProposal}>
                <FaFilePdf /> Download Full Proposal (PDF)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Plot Modal */}
      {selectedPlot && (
        <div className="plot-modal" onClick={() => setSelectedPlot(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{plotTitles[selectedPlot]}</h3>
              <button 
                className="close-modal"
                onClick={() => setSelectedPlot(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-plot">
              <img src={results.plots[selectedPlot]} alt={plotTitles[selectedPlot]} />
            </div>
            <div className="modal-actions">
              <button 
                className="download-modal-btn"
                onClick={() => downloadPlot(selectedPlot)}
              >
                <FaDownload /> Download Plot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyOptimizationResults;
