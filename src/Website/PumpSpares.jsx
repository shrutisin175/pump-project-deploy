import React, { useState, useEffect } from 'react';
import './PumpSpares.css';
import { FaYoutube, FaInstagram, FaFacebook, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import pumpSparesService from '../services/pumpSparesService';
import { AuthService } from '../services/authService';
import { useCart } from '../contexts/CartContext';

const PumpSpares = () => {
  const navigate = useNavigate();
  const { addToCart: addItemToCart, getCartItemCount } = useCart();
  
  const [filters, setFilters] = useState({
    pump_make: '',
    pump_model: '',
    pump_size: '',
    part_number: '',
    part_name: '',
    moc: ''
  });

  const [filterOptions, setFilterOptions] = useState({
    pump_makes: [],
    pump_models: [],
    pump_sizes: [],
    part_numbers: [],
    part_names: []
  });

  const [materials, setMaterials] = useState([]);
  const [partSpecifications, setPartSpecifications] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadAllFilterOptions();
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    console.log('DEBUG: Checking authentication...');
    const authenticated = await AuthService.isAuthenticated();
    console.log('DEBUG: Authentication result:', authenticated);
    setIsAuthenticated(authenticated);
  };

  useEffect(() => {
    if (filters.pump_make && filters.pump_model && filters.pump_size && filters.part_number && filters.part_name) {
      loadMaterials();
    } else {
      setMaterials([]);
      setPartSpecifications(null);
    }
  }, [filters.pump_make, filters.pump_model, filters.pump_size, filters.part_number, filters.part_name]);

  const loadAllFilterOptions = async () => {
    try {
      setLoading(true);
      
      const [pumpMakes, pumpModels, pumpSizes, partNumbers, partNames] = await Promise.all([
        pumpSparesService.fetchPumpMakes(),
        pumpSparesService.fetchPumpModels(),
        pumpSparesService.fetchPumpSizes(),
        pumpSparesService.fetchPartNumbers(),
        pumpSparesService.fetchPartNames()
      ]);

      setFilterOptions({
        pump_makes: pumpMakes,
        pump_models: pumpModels,
        pump_sizes: pumpSizes,
        part_numbers: partNumbers,
        part_names: partNames
      });
      
      setError(null);
    } catch (err) {
      console.error('Error loading filter options:', err);
      setError('Failed to load filter options');
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await pumpSparesService.fetchMaterialsForPart(filters);
      setMaterials(response.materials || []);
      setPartSpecifications(response.part_specifications || null);
      setError(null);
    } catch (err) {
      console.error('Error loading materials:', err);
      if (err.message.includes('404') || err.message.includes('No materials found')) {
        setMaterials([]);
        setPartSpecifications(null);
        setError(null);
      } else {
        setError('Failed to load materials for the selected part');
        setMaterials([]);
        setPartSpecifications(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      
      if (field !== 'moc') {
        newFilters.moc = '';
      }
      
      return newFilters;
    });
  };

  const addToCart = async (materialId) => {
    try {
      const material = await pumpSparesService.fetchMaterialById(materialId);
      
      const selectedPart = {
        id: material.id,
        pumpMake: material.pump_make_name,
        model: material.pump_model_name,
        size: material.pump_size_value,
        partNo: material.part_number_value,
        partName: material.part_name_value,
        moc: material.moc,
        qtyAvailable: material.qty_available,
        unitPrice: material.unit_price,
        drawing: material.drawing || '',
        refPartList: material.ref_part_list || ''
      };

      addItemToCart(selectedPart);
      setError(null);
      setSuccess('Item added to cart successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
    }
  };

  const generateRefNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SS/PS/${year}${month}${day}/${random}`;
  };

  const downloadReceipt = async (materialId) => {
    try {
      console.log('DEBUG: Starting receipt download for material:', materialId);
      console.log('DEBUG: Current authentication state:', isAuthenticated);
      
      setLoading(true);
      
      const response = await fetch(`http://127.0.0.1:8000/api/pump-spares/generate-receipt/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          material_id: materialId,
          email: AuthService.currentCredentials?.email,
          password: AuthService.currentCredentials?.password
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate receipt: ${response.status} ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Check if it's a PDF or DOCX based on content type
      const contentType = response.headers.get('content-type');
      const isPDF = contentType && contentType.includes('application/pdf');
      const fileExtension = isPDF ? 'pdf' : 'docx';
      
      link.download = `Pump_Spares_Quotation_${new Date().toISOString().slice(0, 10)}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setError(null);
    } catch (err) {
      console.error('Error downloading receipt:', err);
      setError('Failed to download receipt');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const isPartFullySelected = filters.pump_make && filters.pump_model && filters.pump_size && filters.part_number && filters.part_name;
  const isPartWithMocSelected = isPartFullySelected && filters.moc;

  return (
    <>
      <div className="pump-spares-container">
        <Navbar />
        
        <div className="pump-spares-header">
          <h1>Pump Spares</h1>
          <p>High-quality pump spare parts with detailed specifications and pricing</p>
        </div>

        {error && (
          <div className="error-message">
            <div className="message-card" style={{borderLeft: '5px solid #dc3545'}}>
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="success-message">
            <div className="message-card" style={{borderLeft: '5px solid #28a745'}}>
              <h3>Success</h3>
              <p>{success}</p>
            </div>
          </div>
        )}

        <div className="filters-section">
          <div className="filters-header">
            <h3>Filter Parts</h3>
            <div className="cart-indicator" onClick={() => navigate('/cart')}>
              <FaShoppingCart />
              <span className="cart-count">{getCartItemCount()}</span>
              <span className="cart-text">View Cart</span>
            </div>
          </div>
          <div className="cart-info-note">
            <p>💡 <strong>Tip:</strong> You can add multiple items to your cart and download receipts for all of them later. Use the "Add to Cart" button to collect items, then view your cart to proceed to checkout.</p>
          </div>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Pump Make:</label>
              <select 
                value={filters.pump_make} 
                onChange={(e) => handleFilterChange('pump_make', e.target.value)}
                disabled={loading}
              >
                <option value="">All Makes</option>
                {filterOptions.pump_makes.map(make => (
                  <option key={make.id} value={make.id}>{make.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Model:</label>
              <select 
                value={filters.pump_model} 
                onChange={(e) => handleFilterChange('pump_model', e.target.value)}
                disabled={loading}
              >
                <option value="">All Models</option>
                {filterOptions.pump_models.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Size:</label>
              <select 
                value={filters.pump_size} 
                onChange={(e) => handleFilterChange('pump_size', e.target.value)}
                disabled={loading}
              >
                <option value="">All Sizes</option>
                {filterOptions.pump_sizes.map(size => (
                  <option key={size.id} value={size.id}>{size.size}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Part No:</label>
              <select 
                value={filters.part_number} 
                onChange={(e) => handleFilterChange('part_number', e.target.value)}
                disabled={loading}
              >
                <option value="">All Part Numbers</option>
                {filterOptions.part_numbers.map(partNo => (
                  <option key={partNo.id} value={partNo.id}>{partNo.part_no}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Part Name:</label>
              <select 
                value={filters.part_name} 
                onChange={(e) => handleFilterChange('part_name', e.target.value)}
                disabled={loading}
              >
                <option value="">All Part Names</option>
                {filterOptions.part_names.map(partName => (
                  <option key={partName.id} value={partName.id}>{partName.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>MOC:</label>
              <select 
                value={filters.moc} 
                onChange={(e) => handleFilterChange('moc', e.target.value)}
                disabled={loading || !isPartFullySelected || materials.length === 0}
              >
                <option value="">
                  {materials.length === 0 && isPartFullySelected ? 'No Materials Available' : 'All Materials'}
                </option>
                {materials.map(material => (
                  <option key={material.id} value={material.id}>{material.moc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {!isPartFullySelected && (
          <div className="no-selection-message">
            <div className="message-card">
              <h3>Select Part Details to View Available Options</h3>
              <p>Please select Pump Make, Model, Size, Part No, and Part Name to see available material options.</p>
            </div>
          </div>
        )}

        {isPartFullySelected && materials.length > 0 && !filters.moc && (
          <div className="no-selection-message">
            <div className="message-card">
              <h3>Select MOC to View Details</h3>
              <p>Please select a Material of Construction (MOC) to see the specific material details and pricing.</p>
            </div>
          </div>
        )}

        {loading && isPartFullySelected && (
          <div className="no-selection-message">
            <div className="message-card">
              <h3>Loading...</h3>
              <p>Please wait while we fetch the available materials for your selection.</p>
            </div>
          </div>
        )}

        {isPartWithMocSelected && !loading && materials.length > 0 && (
          <div className="part-details-container">
            <div className="part-details-card">
              <div className="part-header">
                <h3>Available Options</h3>
                <p>Select from available MOC options for the selected part</p>
              </div>
              
              {partSpecifications && (
                <div className="common-specs">
                  <h4>Part Specifications</h4>
                  <div className="spec-row">
                    <span className="spec-label">Pump Make:</span>
                    <span className="spec-value">{partSpecifications.pump_make}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Model:</span>
                    <span className="spec-value">{partSpecifications.pump_model}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Size:</span>
                    <span className="spec-value">{partSpecifications.pump_size}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Part No:</span>
                    <span className="spec-value">{partSpecifications.part_number}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Part Name:</span>
                    <span className="spec-value">{partSpecifications.part_name}</span>
                  </div>
                </div>
              )}

              <div className="moc-options-section">
                <h4>Material Options & Pricing</h4>
                <div className="moc-table-container">
                  <table className="moc-table">
                    <thead>
                      <tr>
                        <th>Material of Construction (MOC)</th>
                        <th>Quantity Available</th>
                        <th>Unit Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials
                        .filter(material => !filters.moc || material.id == filters.moc)
                        .map((material) => (
                        <tr key={material.id}>
                          <td className="moc-cell">
                            <strong>{material.moc}</strong>
                            <div className="moc-details">
                              Drawing: {material.drawing || '-'}<br/>
                              Ref Part List: {material.ref_part_list || '-'}
                            </div>
                          </td>
                          <td>{material.qty_available}</td>
                          <td className="price-cell">₹{formatPrice(material.unit_price)}</td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <button 
                                className="add-to-cart-btn"
                                onClick={() => addToCart(material.id)}
                                disabled={material.qty_available === 0}
                                title="Add to Cart"
                              >
                                🛒 Add to Cart
                              </button>
                              
                              {isAuthenticated ? (
                                <button 
                                  className="download-receipt-btn"
                                  onClick={() => downloadReceipt(material.id)}
                                  disabled={material.qty_available === 0}
                                  title="Download Receipt"
                                >
                                  📄 {material.qty_available === 0 ? 'Out of Stock' : 'Download Receipt'}
                                </button>
                              ) : (
                                <button 
                                  className="login-required-btn"
                                  onClick={() => navigate('/login')}
                                  title="Login Required"
                                >
                                  🔒 Login to Download
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {isPartFullySelected && !loading && materials.length === 0 && (
          <div className="no-selection-message">
            <div className="message-card">
              <h3>No Materials Found</h3>
              <p>No materials of construction are available for the selected part combination. Please try a different selection.</p>
            </div>
          </div>
        )}

      </div>

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
    </>
  );
};

export default PumpSpares;
