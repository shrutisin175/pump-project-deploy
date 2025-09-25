import React, { useState } from "react";
import "./ContactUs.css";
import logoImage from "./logo.jpg";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthService } from "../services/authService";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

const ContactUs = () => {
  const navigate = useNavigate();
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const result = await AuthService.submitContactForm(formData);
      
      if (result.success) {
        setShowThankYou(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setSubmitMessage({ type: 'success', text: result.message });
        
        setTimeout(() => {
          setShowThankYou(false);
          setSubmitMessage({ type: '', text: '' });
        }, 5000);
      } else {
        setSubmitMessage({ type: 'error', text: result.error });
        setTimeout(() => {
          setSubmitMessage({ type: '', text: '' });
        }, 5000);
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
      setTimeout(() => {
        setSubmitMessage({ type: '', text: '' });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-container">
      <Navbar />

      <div className="contact-main-content">
        <div className="contact-content-box">
          <h1>Contact Us</h1>
          <p>
            <strong>Address:</strong> Plot No 4, Sahajanand Industrial Hub,
            Kathwada GIDC,
            <br />
            Near Kotak Mahindra Bank, Ahmedabad – 382433, Gujarat
          </p>
          <p>
            <strong>GST Number:</strong> 24ABOCS9081K1ZM
          </p>
          <p>
            <strong>Phone:</strong> +91-82796-73706
          </p>
          <p>
            <strong>Email:</strong> sales@shaftnseal.com
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a
              href="https://www.shaftnseal.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.shaftnseal.com
            </a>
          </p>
        </div>

        <div className="contact-map">
         <iframe
  title="Sales Shaftnseal"
  src="https://www.google.com/maps?q=23.0394362,72.6895278&z=17&output=embed"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
        </div>
      </div>

      <div className="contact-form-section">
        <div className="contact-form-container">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us about your inquiry..."
                  rows="4"
                ></textarea>
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          
          {submitMessage.text && (
            <div className={`submit-message ${submitMessage.type}`}>
              {submitMessage.text}
            </div>
          )}
        </div>
      </div>

      {showThankYou && (
        <div className="thank-you-popup">
          <div className="thank-you-card">
            <div className="thank-you-icon">✓</div>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully. We'll get back to you soon!</p>
          </div>
        </div>
      )}

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

export default ContactUs;
