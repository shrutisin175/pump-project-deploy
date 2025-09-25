import React, { useState } from 'react';
import './Cart.css';
import { FaArrowLeft, FaTrash, FaPlus, FaMinus, FaShoppingCart, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useCart } from '../contexts/CartContext';
import inventoryService from '../services/inventoryService';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount } = useCart();
  const [isDownloading, setIsDownloading] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 100) {
      updateQuantity(itemId, newQuantity);
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

  const handleDownloadReceipt = async () => {
    if (items.length === 0) {
      alert('Your cart is empty. Add items to generate a receipt.');
      return;
    }

    setIsDownloading(true);
    try {
      const cartItems = items.map(item => ({
        id: item.id,
        partName: item.partName || item.part_name || 'Unknown Part',
        partNo: item.partNo || item.part_no || 'N/A',
        moc: item.moc || 'N/A',
        unitPrice: parseFloat(item.unitPrice || item.unit_price || 0),
        quantity: item.quantity || 1,
        uom: item.uom || 'nos',
        drawing: item.drawing || 'N/A',
        availability: item.availability || 0
      }));

      const customerInfo = {
        name: 'Valued Customer',
        address: '',
        refNo: generateRefNumber(),
        date: new Date().toLocaleDateString('en-GB')
      };

      await inventoryService.generateInventoryReceipt(cartItems, customerInfo);
      
      alert('Receipt downloaded successfully!');
      
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert(`Failed to download receipt: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <Navbar />
        
        <div className="cart-header">
          <div className="back-arrows" onClick={() => navigate("/pump-spares")}>
            <FaArrowLeft />
            <span>Back to Pump Spares</span>
          </div>
          <h1>Shopping Cart</h1>
        </div>

        <div className="empty-cart">
          <div className="empty-cart-icon">
            <FaShoppingCart />
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some pump spares to get started!</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate("/pump-spares")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cart-container">
        <Navbar />
        
        <div className="cart-header">
          <div className="back-arrows" onClick={() => navigate("/pump-spares")}>
            <FaArrowLeft />
            <span>Back to Pump Spares</span>
          </div>
          <h1>Shopping Cart</h1>
          <p>{getCartItemCount()} items in your cart</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <div className="item-info">
                    <h3>{item.partName}</h3>
                    <p className="item-specs">
                      <strong>Pump:</strong> {item.pumpMake} {item.model} {item.size}<br/>
                      <strong>Part No:</strong> {item.partNo}<br/>
                      <strong>MOC:</strong> {item.moc}
                    </p>
                  </div>
                  <div className="item-price">
                    <span className="price">₹{formatPrice(item.unitPrice)}</span>
                    <span className="price-label">per unit</span>
                  </div>
                </div>
                
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 100}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  
                  <div className="item-total">
                    <span className="total-price">₹{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                  
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items ({getCartItemCount()}):</span>
                <span>₹{formatPrice(getCartTotal())}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{formatPrice(getCartTotal())}</span>
              </div>
              
              <div className="cart-actions">
                <button 
                  className="continue-shopping-btn"
                  onClick={() => navigate('/pump-spares')}
                >
                  Continue Shopping
                </button>
                <button 
                  className="clear-cart-btn"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <button 
                  className="checkout-btn"
                  onClick={handleDownloadReceipt}
                  disabled={isDownloading}
                >
                  <FaDownload />
                  {isDownloading ? 'Downloading Receipt...' : 'Download Receipt'}
                </button>
              </div>
              
              <div className="cart-note">
                <p>💡 <strong>Tip:</strong> You can continue shopping and add more items to your cart before proceeding to checkout.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
