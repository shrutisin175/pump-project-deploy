import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logoImage from "./logo.jpg";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuthStatus();
      }
    };
    
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown-container')) {
        setShowDropdown(false);
      }
    };
    
    const interval = setInterval(checkAuthStatus, 5000); 
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  const handleLogout = async () => {
    setShowDropdown(false);
    try {
      await AuthService.logoutUser();
      setIsAuthenticated(false);
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setIsAuthenticated(false);
      setCurrentUser(null);
      navigate('/');
    }
  };


  return (
    <div className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <img src={logoImage} alt="Company Logo" />
      </div>
      <div className="navbar-links">
        <span className="navbar-link" onClick={() => navigate("/")}>
          Home
        </span>
        <span className="navbar-link" onClick={() => navigate("/products")}>
          Products
        </span>
        <span className="navbar-link" onClick={() => navigate("/services")}>
          Services
        </span>
        <span className="navbar-link" onClick={() => navigate("/contact")}>
          Contact Us
        </span>
        
        {isAuthenticated ? (
          <div className="profile-dropdown-container">
            <span 
              className="navbar-link" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              👤
            </span>
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-menu">
                  <div 
                    className="dropdown-item" 
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                  >
                    <span className="dropdown-icon">👤</span>
                    Profile
                  </div>
                  <div 
                    className="dropdown-item logout-item" 
                    onClick={handleLogout}
                  >
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <span className="navbar-link" onClick={() => navigate("/login")}>
            Login
          </span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
