const API_BASE_URL = 'http://127.0.0.1:8000/api';

export class AuthService {
  static currentUser = null;
  static currentCredentials = null;

  // Load credentials from localStorage on initialization
  static loadStoredCredentials() {
    try {
      const stored = localStorage.getItem('authCredentials');
      if (stored) {
        this.currentCredentials = JSON.parse(stored);
        console.log('DEBUG: Loaded stored credentials:', this.currentCredentials?.email);
      }
    } catch (error) {
      console.error('Error loading stored credentials:', error);
    }
  }

  // Save credentials to localStorage
  static saveCredentials(credentials) {
    try {
      localStorage.setItem('authCredentials', JSON.stringify(credentials));
      console.log('DEBUG: Saved credentials to localStorage');
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  }

  // Clear credentials from localStorage
  static clearStoredCredentials() {
    try {
      localStorage.removeItem('authCredentials');
      console.log('DEBUG: Cleared credentials from localStorage');
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  }

  static async registerUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: userData.name,
          official_email: userData.officialEmail,
          personal_email: userData.personalEmail,
          official_phone: userData.officialPhone,
          personal_phone: userData.personalPhone,
          company_name: userData.companyName,
          location: userData.location,
          department: userData.department,
          gst_number: userData.gstNumber,
          pin_code: userData.pinCode,
          company_address: userData.companyAddress,
          password: userData.password,
          confirmPassword: userData.confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          user: data.user,
          message: data.message
        };
      } else {
        return {
          success: false,
          error: data.error || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  static async loginUser(email, password, otp = null) {
    try {
      const requestBody = { email, password };
      if (otp) {
        requestBody.otp = otp;
      }

      const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
        if (data.otp_required) {
          return {
            success: true,
            otp_required: true,
            message: data.message,
            otp_for_testing: data.otp_for_testing
          };
        } else {
          this.currentCredentials = { email, password };
          this.currentUser = data.user;
          
          // Save credentials to localStorage
          this.saveCredentials(this.currentCredentials);
          
          console.log('DEBUG: User logged in successfully, credentials stored:', {
            email: this.currentCredentials.email,
            hasPassword: !!this.currentCredentials.password
          });
          
          return {
            success: true,
            user: data.user,
            message: data.message
          };
        }
      } else {
        return {
          success: false,
          error: data.error || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  static async verifyOTP(email, password, otp) {
    return this.loginUser(email, password, otp);
  }

  static async logoutUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      this.currentCredentials = null;
      this.currentUser = null;
      
      // Clear stored credentials
      this.clearStoredCredentials();

      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      console.error('Logout error:', error);
      this.currentCredentials = null;
      this.currentUser = null;
      
      // Clear stored credentials even on error
      this.clearStoredCredentials();
      
      return {
        success: true,
        message: 'Logout successful'
      };
    }
  }

  static async getCurrentUserProfile() {
    if (!this.currentCredentials) {
      return {
        success: false,
        error: 'Please login first.'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.currentCredentials)
      });

      if (response.ok) {
        const userData = await response.json();
        this.currentUser = userData;
        return {
          success: true,
          user: userData
        };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Failed to fetch user profile'
        };
      }
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  static async updateUserProfile(updateData) {
    if (!this.currentCredentials) {
      return {
        success: false,
        error: 'Please login first.'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...this.currentCredentials,
          ...updateData
        })
      });

      if (response.ok) {
        const userData = await response.json();
        this.currentUser = userData;
        return {
          success: true,
          user: userData
        };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Failed to update profile'
        };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  static async isAuthenticated() {
    // Load stored credentials if not already loaded
    if (!this.currentCredentials) {
      this.loadStoredCredentials();
    }
    
    console.log('DEBUG: Checking authentication, current credentials:', {
      hasCredentials: !!this.currentCredentials,
      email: this.currentCredentials?.email
    });
    
    if (!this.currentCredentials) {
      return false;
    }

    try {
      const result = await this.getCurrentUserProfile();
      console.log('DEBUG: Authentication check result:', result.success);
      return result.success;
    } catch (error) {
      console.error('DEBUG: Authentication check error:', error);
      return false;
    }
  }

  static async getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const result = await this.getCurrentUserProfile();
    return result.success ? result.user : null;
  }

  static async submitContactForm(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to send message'
        };
      }
    } catch (error) {
      console.error('Contact form error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  static async requestPasswordReset(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to send reset email'
        };
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  static async confirmPasswordReset(email, token, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/password-reset-confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          token: token,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to reset password'
        };
      }
    } catch (error) {
      console.error('Password reset confirm error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }
}
