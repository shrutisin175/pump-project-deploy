import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './InventoryDetails.css';
import { useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaArrowLeft, FaDownload } from "react-icons/fa";
import inventoryService from '../services/inventoryService';

const InventoryDetails = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiData = await inventoryService.getAllInventoryItems();
        const transformedData = inventoryService.transformInventoryData(apiData);
        setInventoryData(transformedData);
        setFilteredData(transformedData);
      } catch (err) {
        setError('Failed to load inventory data. Please try again later.');
        console.error('Error fetching inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(inventoryData);
    } else {
      const filtered = inventoryData.filter(item =>
        item.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.drawing.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.moc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.refLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.drawingVendor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, inventoryData]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (parseInt(item.unitPrice) * item.quantity), 0);
  };

  const scrollToCart = () => {
    const cartSection = document.querySelector('.cart-section');
    if (cartSection) {
      cartSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Trigger animation by temporarily removing and re-adding the animation class
      setTimeout(() => {
        cartSection.style.animation = 'none';
        cartSection.offsetHeight; // Trigger reflow
        cartSection.style.animation = 'cartHighlight 0.5s ease-in-out';
      }, 300);
    }
  };

  const handleDownloadReceipt = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before downloading receipt.');
      return;
    }

    try {
      setLoading(true);
      
      const cartItemsForReceipt = cart.map(item => ({
        id: item.id,
        partName: item.partName,
        partNo: item.partNo,
        moc: item.moc,
        unitPrice: parseFloat(item.unitPrice),
        quantity: item.quantity,
        uom: item.uom,
        drawing: item.drawing,
        availability: item.availability
      }));

      const customerInfo = {
        name: 'Valued Customer',
        address: '',
        email: '',
        company: '',
        gst_number: '',
        location: ''
      };

      await inventoryService.generateInventoryReceipt(cartItemsForReceipt, customerInfo);
      
      setCart([]);
      
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-details-page">
      <Navbar />
      
      <div className="inventory-header">
        <div className="back-button" onClick={() => navigate("/inventory-minimization-content")}>
          <FaArrowLeft />
          <span>Back to Inventory</span>
        </div>
        <h1>Inventory Database - Pump Spares</h1>
        <p>Browse our comprehensive collection of pump spares and parts</p>
      </div>

      <div className="inventory-container">
        <div className="search-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by part name, part number, or drawing number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="cart-summary" onClick={scrollToCart} style={{ cursor: 'pointer' }} title="Click to view cart details">
            <FaShoppingCart className="cart-icon" />
            <span className="cart-count">{cart.length}</span>
            <span className="cart-total">₹{getTotalPrice().toLocaleString()}</span>
            <span className="cart-hint">View Cart</span>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading inventory data...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button 
                className="retry-btn" 
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Part Name</th>
                  <th>Part No</th>
                  <th>Drawing</th>
                  <th>Ref Location</th>
                  <th>MOC</th>
                  <th>Availability</th>
                  <th>UOM</th>
                  <th>Unit Price (₹)</th>
                  <th>Drawing for Vendor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="no-data">
                      {searchTerm ? 'No items found matching your search.' : 'No inventory data available.'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className={item.partName.includes("Shaft") ? "highlighted-row" : ""}>
                      <td className="part-name">{item.partName}</td>
                      <td>{item.partNo}</td>
                      <td>{item.drawing}</td>
                      <td>{item.refLocation}</td>
                      <td>{item.moc}</td>
                      <td className="availability">{item.availability}</td>
                      <td>{item.uom}</td>
                      <td className="price">₹{parseInt(item.unitPrice).toLocaleString()}</td>
                      <td>{item.drawingVendor}</td>
                      <td>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-section" id="cart-section">
            <h3>Shopping Cart</h3>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-details">
                    <h4>{item.partName}</h4>
                    <p>Part No: {item.partNo} | Price: ₹{parseInt(item.unitPrice).toLocaleString()}</p>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-total-section">
              <h4>Total: ₹{getTotalPrice().toLocaleString()}</h4>
              <button 
                className="checkout-btn" 
                onClick={handleDownloadReceipt}
                disabled={loading}
              >
                <FaDownload className="download-icon" />
                {loading ? 'Generating Receipt...' : 'Download Receipt'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryDetails;
