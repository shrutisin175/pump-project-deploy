const API_BASE_URL = 'http://127.0.0.1:8000/api';

export class PumpDetailsService {
  static async submitPumpDetails(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/pump-spares/submit-pump-details/`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message,
          submission: data.submission,
          additional_documents_count: data.additional_documents_count
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to submit pump details',
          details: data.details
        };
      }
    } catch (error) {
      console.error('Pump details submission error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }
}
