import React, { useState, useEffect } from "react";
import "./LoginRegister.css";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthService } from "../services/authService";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

const LoginRegister = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    otp: ""
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    officialEmail: "",
    personalEmail: "",
    officialPhone: "",
    personalPhone: "",
    companyName: "",
    location: "",
    department: "",
    gstNumber: "",
    pinCode: "",
    companyAddress: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const toggleForm = () => {
    setShowRegister(false);
    setShowForgotPassword(false);
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const fromReverseEngineering = searchParams.get('from') === 'reverse-engineering';
  const fromEnergyOptimization = searchParams.get('from') === 'energy-optimization';
  const fromInventoryMinimization = searchParams.get('from') === 'inventory-minimization';

  // Check if user is already logged in
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        AuthService.loadStoredCredentials();
        const isAuthenticated = await AuthService.isAuthenticated();
        
        if (isAuthenticated) {
          setMessage({ type: 'info', text: 'You are already logged in! Redirecting...' });
          
          // Redirect based on the source
          setTimeout(() => {
            if (fromReverseEngineering) {
              navigate("/pump-details-form");
            } else if (fromEnergyOptimization) {
              navigate("/operational-philosophy");
            } else if (fromInventoryMinimization) {
              navigate("/inventory-minimization-content");
            } else {
              navigate("/");
            }
          }, 2000);
        }
      } catch (error) {
        console.log('No existing authentication found');
      }
    };
    
    checkExistingAuth();
  }, [navigate, fromReverseEngineering, fromEnergyOptimization, fromInventoryMinimization]);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };

  const validateGST = (gst) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const validatePIN = (pin) => {
    const pinRegex = /^[1-9][0-9]{5}$/;
    return pinRegex.test(pin);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    return true; 
  };

  const validateRegistration = () => {
    const newErrors = {};

    if (!registerData.officialEmail.trim()) {
      newErrors.officialEmail = "Email is required";
    } else if (!validateEmail(registerData.officialEmail)) {
      newErrors.officialEmail = "Please enter a valid email address";
    }

    if (!registerData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!registerData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (registerData.personalEmail.trim() && !validateEmail(registerData.personalEmail)) {
      newErrors.personalEmail = "Please enter a valid email address";
    }

    if (registerData.officialPhone.trim() && !validatePhone(registerData.officialPhone)) {
      newErrors.officialPhone = "Please enter a valid 10-digit phone number";
    }

    if (registerData.personalPhone.trim() && !validatePhone(registerData.personalPhone)) {
      newErrors.personalPhone = "Please enter a valid 10-digit phone number";
    }

    if (registerData.gstNumber.trim() && !validateGST(registerData.gstNumber)) {
      newErrors.gstNumber = "Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)";
    }

    if (registerData.pinCode.trim() && !validatePIN(registerData.pinCode)) {
      newErrors.pinCode = "Please enter a valid 6-digit PIN code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Add a small delay to make the login process feel more realistic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await AuthService.loginUser(loginData.email, loginData.password, loginData.otp);
      
      if (result.success) {
        if (result.otp_required) {
          setShowOTP(true);
          setMessage({ type: 'info', text: result.message || 'OTP has been sent to your registered email address.' });
        } else {
          if (fromReverseEngineering) {
            setMessage({ type: 'success', text: 'Login successful! Redirecting to pump details form...' });
            setTimeout(() => {
              navigate("/pump-details-form");
            }, 1500);
          } else if (fromEnergyOptimization) {
            setMessage({ type: 'success', text: 'Login successful! Redirecting to operational philosophy...' });
            setTimeout(() => {
              navigate("/operational-philosophy");
            }, 1500);
          } else if (fromInventoryMinimization) {
            setMessage({ type: 'success', text: 'Login successful! Redirecting to inventory minimization content...' });
            setTimeout(() => {
              navigate("/inventory-minimization-content");
            }, 1500);
          } else {
            setMessage({ type: 'success', text: 'Login successful! Redirecting to home...' });
            setTimeout(() => {
              navigate("/");
            }, 1500);
          }
        }
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await AuthService.verifyOTP(loginData.email, loginData.password, loginData.otp);
      
      if (result.success) {
        if (fromReverseEngineering) {
          setMessage({ type: 'success', text: 'Login successful! Redirecting to pump details form...' });
          setTimeout(() => {
            navigate("/pump-details-form");
          }, 1500);
        } else if (fromEnergyOptimization) {
          setMessage({ type: 'success', text: 'Login successful! Redirecting to operational philosophy...' });
          setTimeout(() => {
            navigate("/operational-philosophy");
          }, 1500);
        } else if (fromInventoryMinimization) {
          setMessage({ type: 'success', text: 'Login successful! Redirecting to inventory minimization content...' });
          setTimeout(() => {
            navigate("/inventory-minimization-content");
          }, 1500);
        } else {
          setMessage({ type: 'success', text: 'Login successful! Redirecting to home...' });
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'OTP verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegistration()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await AuthService.registerUser(registerData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Registration successful! You can now login.' });
        setRegisterData({
          name: "",
          officialEmail: "",
          personalEmail: "",
          officialPhone: "",
          personalPhone: "",
          companyName: "",
          location: "",
          department: "",
          gstNumber: "",
          pinCode: "",
          companyAddress: "",
          password: "",
          confirmPassword: ""
        });
        setTimeout(() => {
          setShowRegister(false);
          setShowForgotPassword(false);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await AuthService.requestPasswordReset(resetEmail);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setShowResetForm(true);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send reset email. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetConfirm = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await AuthService.confirmPasswordReset(resetEmail, resetToken, newPassword);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setResetEmail("");
        setResetToken("");
        setNewPassword("");
        setConfirmNewPassword("");
        setTimeout(() => {
          setShowForgotPassword(false);
          setShowResetForm(false);
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-register-auth-container">
      <Navbar />
      
      {/* Background Design Elements */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-register-page">
        <div className="login-register-grid">
          {/* Hero / Marketing Panel */}
          <section className="login-register-hero">
            <h1 className="hero-title dark-blue-heading">Engineer Your Reliability</h1>
            <p className="hero-subtitle">Access quotes, manage orders, and track pump audits—all in one place.</p>

            <div className="hero-features">
                      <div className="feature-item">🛡️ Enterprise-grade security</div>
        <div className="feature-item">⏰ 24×7 customer support</div>
        <div className="feature-item">🏭 Trusted by 50+ industries</div>
            </div>

            <div className="trust-badges">
              <div className="badge">ISO 9001</div>
              <div className="badge">Made in India</div>
              <div className="badge">GST Ready</div>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                ⭐⭐⭐⭐⭐
              </div>
              <p>"Shaft & Seal transformed our maintenance cycle. Reliable parts, faster turnaround."</p>
              <span className="author">Head of Maintenance, PowerGen Co.</span>
            </div>
          </section>

          {/* Auth Box */}
          <div className="login-register-auth-box">
            <div className="back-arrow" onClick={() => navigate("/")}>
              ←
              <span>Back</span>
            </div>

            <div className="login-register-auth-toggle">
              <button
                className={!showRegister && !showForgotPassword ? "login-register-active-tab" : ""}
                onClick={toggleForm}
              >
                Login
              </button>
              <button
                className={showRegister ? "login-register-active-tab" : ""}
                onClick={() => {
                  setShowRegister(true);
                  setShowForgotPassword(false);
                      setErrors({});
                      setMessage({ type: '', text: '' });
                }}
              >
                Register
              </button>
            </div>

                {/* Message Display */}
                {message.text && (
                  <div className={`message ${message.type}`}>
                    {message.text}
                  </div>
                )}

            {/* Login Form */}
            {!showRegister && !showForgotPassword && !showOTP && (
              <div className="login-register-login-form">
                    <h2 className="login-register-form-title">Welcome Back</h2>
                    <p className="form-subtitle">Sign in to your account</p>
                    <form onSubmit={handleLoginSubmit}>
                      <div className="input-group">
                        <input 
                          type="email" 
                          name="email"
                          placeholder="Email ID" 
                          value={loginData.email}
                          onChange={handleLoginChange}
                          required
                          disabled={loading}
                        />
                      </div>
                      <div className="input-group password-group">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="password"
                          placeholder="Password" 
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                          disabled={loading}
                        />
                        <button 
                          type="button" 
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                      <button type="submit" className="login-register-submit-btn" disabled={loading}>
                        {loading ? "Authenticating..." : "Sign In"}
                      </button>
                  <p
                    className="forgot-password-link"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setShowRegister(false);
                    }}
                  >
                    Forgot Password?
                  </p>
                </form>
              </div>
            )}

            {/* OTP Verification Form */}
            {showOTP && !showRegister && !showForgotPassword && (
              <div className="login-register-login-form">
                    <h2 className="login-register-form-title">Verify OTP</h2>
                    <p className="form-subtitle">Enter the OTP sent to your email</p>
                    
                    {/* Email notification info */}
                    <div style={{
                      backgroundColor: '#e8f5e9',
                      border: '1px solid #4caf50',
                      borderRadius: '8px',
                      padding: '12px',
                      margin: '15px 0',
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: '0', color: '#2e7d32', fontSize: '14px' }}>
                        📧 Please check your email for the OTP code
                      </p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                        The OTP is valid for 5 minutes
                      </p>
                    </div>
                    
                    <form onSubmit={handleOTPSubmit}>
                      <div className="input-group">
                        <input 
                          type="text" 
                          name="otp"
                          placeholder="Enter 6-digit OTP" 
                          value={loginData.otp}
                          onChange={handleLoginChange}
                          required
                          disabled={loading}
                          maxLength="6"
                          pattern="[0-9]{6}"
                        />
                      </div>
                      <button type="submit" className="login-register-submit-btn" disabled={loading}>
                        {loading ? "Verifying OTP..." : "Verify OTP"}
                      </button>
                  <p
                    className="forgot-password-link"
                    onClick={() => {
                      setShowOTP(false);
                      setLoginData({ ...loginData, otp: "" });
                      setMessage({ type: '', text: '' });
                    }}
                  >
                    Back to Login
                  </p>
                </form>
              </div>
            )}

            {/* Registration Form */}
            {showRegister && !showForgotPassword && (
              <div className="login-register-register-form">
                    <h2 className="form-title">Create Account</h2>
                    <p className="form-subtitle">Join us today</p>
                    <form onSubmit={handleRegisterSubmit}>
                      <div className="input-group">
                        <input 
                          type="text" 
                          name="name"
                          placeholder="Full Name" 
                          value={registerData.name}
                          onChange={handleRegisterChange}
                          className={errors.name ? "error" : ""}
                          disabled={loading}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                      </div>

                      <div className="input-group">
                        <input 
                          type="email" 
                          name="officialEmail"
                          placeholder="Official Email ID" 
                          value={registerData.officialEmail}
                          onChange={handleRegisterChange}
                          className={errors.officialEmail ? "error" : ""}
                          disabled={loading}
                        />
                        {errors.officialEmail && <span className="error-message">{errors.officialEmail}</span>}
                      </div>

                      <div className="input-group">
                        <input 
                          type="email" 
                          name="personalEmail"
                          placeholder="Personal Email ID" 
                          value={registerData.personalEmail}
                          onChange={handleRegisterChange}
                          className={errors.personalEmail ? "error" : ""}
                          disabled={loading}
                        />
                        {errors.personalEmail && <span className="error-message">{errors.personalEmail}</span>}
                      </div>

                      <div className="input-group">
                        <input 
                          type="tel" 
                          name="officialPhone"
                          placeholder="Official Phone Number" 
                          value={registerData.officialPhone}
                          onChange={handleRegisterChange}
                          className={errors.officialPhone ? "error" : ""}
                          disabled={loading}
                        />
                        {errors.officialPhone && <span className="error-message">{errors.officialPhone}</span>}
                      </div>

                      <div className="input-group">
                        <input 
                          type="tel" 
                          name="personalPhone"
                          placeholder="Personal Phone Number" 
                          value={registerData.personalPhone}
                          onChange={handleRegisterChange}
                          className={errors.personalPhone ? "error" : ""}
                          disabled={loading}
                        />
                        {errors.personalPhone && <span className="error-message">{errors.personalPhone}</span>}
                      </div>

                      <div className="input-group">
                        <input 
                          type="text" 
                          name="companyName"
                          placeholder="Company Name" 
                          value={registerData.companyName}
                          onChange={handleRegisterChange}
                          className={errors.companyName ? "error" : ""}
                          disabled={loading}
                        />
                        {errors.companyName && <span className="error-message">{errors.companyName}</span>}
                      </div>

                      <div className="input-group">
                        <input 
                          type="text" 
                          name="location"
                          placeholder="Location" 
                          value={registerData.location}
                          onChange={handleRegisterChange}
                          className={errors.location ? "error" : ""}
                          disabled={loading}
                        />
                        {errors.location && <span className="error-message">{errors.location}</span>}
                      </div>

                      <div className="input-group">
                        <input 
                          type="text" 
                          name="department"
                          placeholder="Department" 
                          value={registerData.department}
                          onChange={handleRegisterChange}
                          className={errors.department ? "error" : ""}
                          disabled={loading}
                        />
                        {errors.department && <span className="error-message">{errors.department}</span>}
                      </div>

                      <div className="input-group">
                        <input 
                          type="text" 
                          name="gstNumber"
                          placeholder="GST Number" 
                          value={registerData.gstNumber}
                          onChange={handleRegisterChange}
                          className={errors.gstNumber ? "error" : ""}
                          disabled={loading}
                        />
                        {errors.gstNumber && <span className="error-message">{errors.gstNumber}</span>}
                      </div>

                      <div className="input-group">
                        <input 
                          type="text" 
                          name="pinCode"
                          placeholder="PIN Code" 
                          value={registerData.pinCode}
                          onChange={handleRegisterChange}
                          className={errors.pinCode ? "error" : ""}
                          disabled={loading}
                        />
                        {errors.pinCode && <span className="error-message">{errors.pinCode}</span>}
                      </div>

                      <div className="input-group">
                        <textarea 
                          name="companyAddress"
                          placeholder="Company Address" 
                          value={registerData.companyAddress}
                          onChange={handleRegisterChange}
                          className={errors.companyAddress ? "error" : ""}
                          disabled={loading}
                          rows="3"
                        />
                        {errors.companyAddress && <span className="error-message">{errors.companyAddress}</span>}
                      </div>

                      <div className="input-group password-group">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="password"
                          placeholder="Password" 
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          className={errors.password ? "error" : ""}
                          disabled={loading}
                        />
                        <button 
                          type="button" 
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                      </div>

                      <div className="input-group password-group">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          name="confirmPassword"
                          placeholder="Confirm Password" 
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          className={errors.confirmPassword ? "error" : ""}
                          disabled={loading}
                        />
                        <button 
                          type="button" 
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? "🙈" : "👁️"}
                        </button>
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                      </div>

                      <button type="submit" className="login-register-submit-btn" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                      </button>
                </form>
              </div>
            )}

            {/* Forgot Password Form */}
            {showForgotPassword && !showResetForm && (
              <div className="forgot-password-form">
                <h2 className="login-register-form-title">Reset Password</h2>
                    <p className="form-subtitle">Enter your email to receive reset instructions</p>
                <form onSubmit={handlePasswordReset}>
                      <div className="input-group">
                  <input
                    type="email"
                    placeholder="Enter your registered Email ID"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                          disabled={loading}
                  />
                      </div>
                      <button type="submit" className="login-register-submit-btn" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                      </button>
                  <p
                    className="forgot-password-link"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setShowRegister(false);
                    }}
                  >
                    Back to Login
                  </p>
                </form>
              </div>
            )}

            {/* Password Reset Confirmation Form */}
            {showForgotPassword && showResetForm && (
              <div className="forgot-password-form">
                <h2 className="login-register-form-title">Enter New Password</h2>
                <p className="form-subtitle">Enter the token from your email and your new password</p>
                <form onSubmit={handlePasswordResetConfirm}>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Enter reset token from email"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="input-group password-group">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength="6"
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <div className="input-group password-group">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength="6"
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    >
                      {showConfirmNewPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <button type="submit" className="login-register-submit-btn" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                  <p
                    className="forgot-password-link"
                    onClick={() => {
                      setShowResetForm(false);
                      setResetToken("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                    }}
                  >
                    Back to Email Entry
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
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

export default LoginRegister;
