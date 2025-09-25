import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      if (!(await AuthService.isAuthenticated())) {
        setError("Please login first to view your profile");
        setLoading(false);
        return;
      }

      const result = await AuthService.getCurrentUserProfile();
      
      if (result.success && result.user) {
        setUser(result.user);
        setError(null);
      } else {
        const errorMsg = result.error || 'Failed to load profile';
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({
      full_name: user.full_name || '',
      personal_email: user.personal_email || '',
      official_phone: user.official_phone || '',
      personal_phone: user.personal_phone || '',
      company_name: user.company_name || '',
      location: user.location || '',
      department: user.department || '',
      gst_number: user.gst_number || '',
      pin_code: user.pin_code || '',
      company_address: user.company_address || ''
    });
    setUpdateMessage({ type: '', text: '' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({});
    setUpdateMessage({ type: '', text: '' });
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage({ type: '', text: '' });

    try {
      const result = await AuthService.updateUserProfile(editData);
      
      if (result.success) {
        setUser(result.user);
        setIsEditing(false);
        setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setUpdateMessage({ type: '', text: '' }), 3000);
      } else {
        setUpdateMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Update error:', error);
      setUpdateMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="profile-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Profile Access Error</h2>
          <div className="error-message">{error}</div>
          <div className="error-actions">
            <button className="login-btn" onClick={handleGoToLogin}>
              🔑 Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-container">
          <div className="error-icon">👤</div>
          <h2>No User Data</h2>
          <div className="error-message">No user profile data available</div>
          <div className="error-actions">
            <button className="login-btn" onClick={handleGoToLogin}>
              🔑 Login to View Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : '👤'}
          </div>
          <h1>{user.full_name || 'User Profile'}</h1>
          <p className="user-email">{user.official_email}</p>
        </div>

        {/* Update Message */}
        {updateMessage.text && (
          <div className={`update-message ${updateMessage.type}`}>
            {updateMessage.text}
          </div>
        )}

        {!isEditing ? (
          // View Mode
          <>
            <div className="profile-sections">
              <div className="profile-section">
                <h2>Personal Information</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">User Code:</span>
                    <span className="value unique-code">{user.user_unique_code}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Full Name:</span>
                    <span className="value">{user.full_name}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Official Email:</span>
                    <span className="value">{user.official_email}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Personal Email:</span>
                    <span className="value">{user.personal_email || 'Not provided'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Official Phone:</span>
                    <span className="value">{user.official_phone}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Personal Phone:</span>
                    <span className="value">{user.personal_phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h2>Company Information</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Company Name:</span>
                    <span className="value">{user.company_name}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Department:</span>
                    <span className="value">{user.department}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Location:</span>
                    <span className="value">{user.location}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">GST Number:</span>
                    <span className="value">{user.gst_number}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Pin Code:</span>
                    <span className="value">{user.pin_code}</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h2>Company Address</h2>
                <div className="address-box">
                  <p>{user.company_address}</p>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="home-btn" onClick={() => navigate('/')}>
                Back to Home
              </button>
              <button className="edit-btn" onClick={handleEditClick}>
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          // Edit Mode
          <form onSubmit={handleUpdateProfile} className="edit-form">
            <div className="profile-sections">
              <div className="profile-section">
                <h2>Personal Information</h2>
                <div className="edit-grid">
                  <div className="edit-item">
                    <label>Full Name:</label>
                    <input
                      type="text"
                      name="full_name"
                      value={editData.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="edit-item">
                    <label>Official Email:</label>
                    <input
                      type="email"
                      value={user.official_email}
                      disabled
                      className="disabled-field"
                      title="Email cannot be changed"
                    />
                  </div>
                  
                  <div className="edit-item">
                    <label>Personal Email:</label>
                    <input
                      type="email"
                      name="personal_email"
                      value={editData.personal_email}
                      onChange={handleInputChange}
                      placeholder="Enter your personal email"
                    />
                  </div>
                  
                  <div className="edit-item">
                    <label>Official Phone:</label>
                    <input
                      type="tel"
                      name="official_phone"
                      value={editData.official_phone}
                      onChange={handleInputChange}
                      placeholder="Enter your official phone"
                    />
                  </div>
                  
                  <div className="edit-item">
                    <label>Personal Phone:</label>
                    <input
                      type="tel"
                      name="personal_phone"
                      value={editData.personal_phone}
                      onChange={handleInputChange}
                      placeholder="Enter your personal phone"
                    />
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h2>Company Information</h2>
                <div className="edit-grid">
                  <div className="edit-item">
                    <label>Company Name:</label>
                    <input
                      type="text"
                      name="company_name"
                      value={editData.company_name}
                      onChange={handleInputChange}
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <div className="edit-item">
                    <label>Department:</label>
                    <input
                      type="text"
                      name="department"
                      value={editData.department}
                      onChange={handleInputChange}
                      placeholder="Enter your department"
                    />
                  </div>
                  
                  <div className="edit-item">
                    <label>Location:</label>
                    <input
                      type="text"
                      name="location"
                      value={editData.location}
                      onChange={handleInputChange}
                      placeholder="Enter your location"
                    />
                  </div>
                  
                  <div className="edit-item">
                    <label>GST Number:</label>
                    <input
                      type="text"
                      name="gst_number"
                      value={editData.gst_number}
                      onChange={handleInputChange}
                      placeholder="Enter GST number"
                    />
                  </div>
                  
                  <div className="edit-item">
                    <label>Pin Code:</label>
                    <input
                      type="text"
                      name="pin_code"
                      value={editData.pin_code}
                      onChange={handleInputChange}
                      placeholder="Enter pin code"
                    />
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h2>Company Address</h2>
                <div className="edit-item">
                  <textarea
                    name="company_address"
                    value={editData.company_address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter company address"
                  />
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button 
                type="submit" 
                className="save-btn" 
                disabled={updateLoading}
              >
                {updateLoading ? "Saving..." : "Save Changes"}
              </button>
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={handleCancelEdit}
                disabled={updateLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
