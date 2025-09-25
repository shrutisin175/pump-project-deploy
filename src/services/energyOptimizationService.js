const API_BASE_URL = 'http://localhost:8000/api/pump-spares';

export const energyOptimizationService = {
  async getCsrfToken() {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api/pump-spares', '')}/api/accounts/profile/`, {
        method: 'GET',
        credentials: 'include',
      });
      return response.headers.get('X-CSRFToken') || '';
    } catch (error) {
      console.warn('Could not get CSRF token:', error);
      return '';
    }
  },

  async submitEnergyOptimization(formData) {
    try {
      console.log('Submitting energy optimization form data:', formData);
      
      const csrfToken = await this.getCsrfToken();
      console.log('CSRF Token:', csrfToken);
      
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
      };
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }
      
      const response = await fetch(`${API_BASE_URL}/submit-energy-optimization/`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: headers,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorData;
        try {
          const responseText = await response.text();
          console.log('Raw error response:', responseText);
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        console.error('API Error:', errorData);
        throw new Error(errorData.error || errorData.details || JSON.stringify(errorData) || 'Failed to submit energy optimization project');
      }

      const result = await response.json();
      console.log('Success response:', result);
      return result;
    } catch (error) {
      console.error('Error submitting energy optimization:', error);
      
      // Check if it's a network error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server. Please check if the backend server is running.');
      }
      
      throw error;
    }
  },

  async getEnergyOptimizationSubmissions() {
    try {
      const response = await fetch(`${API_BASE_URL}/energy-optimization-submissions/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch energy optimization submissions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching energy optimization submissions:', error);
      throw error;
    }
  },


  createFormData(formData) {
    console.log('Creating FormData from:', formData);
    const data = new FormData();
    
    // Map frontend camelCase to backend camelCase field names (backend handles snake_case conversion)
    if (formData.projectType) {
      data.append('projectType', formData.projectType);
      console.log('Added projectType:', formData.projectType);
    }
    if (formData.daTankHeight) {
      data.append('daTankHeight', formData.daTankHeight);
      console.log('Added daTankHeight:', formData.daTankHeight);
    }
    if (formData.boilerDrumHeight) {
      data.append('boilerDrumHeight', formData.boilerDrumHeight);
      console.log('Added boilerDrumHeight:', formData.boilerDrumHeight);
    }
    if (formData.daTankPressure) {
      data.append('daTankPressure', formData.daTankPressure);
      console.log('Added daTankPressure:', formData.daTankPressure);
    }
    if (formData.boilerDrumPressure) {
      data.append('boilerDrumPressure', formData.boilerDrumPressure);
      console.log('Added boilerDrumPressure:', formData.boilerDrumPressure);
    }
    if (formData.feedWaterTemp) {
      data.append('feedWaterTemp', formData.feedWaterTemp);
      console.log('Added feedWaterTemp:', formData.feedWaterTemp);
    }
    if (formData.specificGravity) {
      data.append('specificGravity', formData.specificGravity);
      console.log('Added specificGravity:', formData.specificGravity);
    }
    if (formData.actualFlow24hrs) {
      data.append('actualFlow24hrs', formData.actualFlow24hrs);
      console.log('Added actualFlow24hrs:', formData.actualFlow24hrs);
    }
    if (formData.actualFlowRequired) {
      data.append('actualFlowRequired', formData.actualFlowRequired);
      console.log('Added actualFlowRequired:', formData.actualFlowRequired);
    }
    if (formData.flowQnp) {
      data.append('flowQnp', formData.flowQnp);
      console.log('Added flowQnp:', formData.flowQnp);
    }
    if (formData.headHnp) {
      data.append('headHnp', formData.headHnp);
      console.log('Added headHnp:', formData.headHnp);
    }
    if (formData.bkwBkwnp) {
      data.append('bkwBkwnp', formData.bkwBkwnp);
      console.log('Added bkwBkwnp:', formData.bkwBkwnp);
    }
    if (formData.efficiency) {
      data.append('efficiency', formData.efficiency);
      console.log('Added efficiency:', formData.efficiency);
    }
    
    if (formData.qhnpFile) {
      data.append('qhnpFile', formData.qhnpFile);
      console.log('Added qhnpFile:', formData.qhnpFile.name);
    }
    if (formData.qhactFile) {
      data.append('qhactFile', formData.qhactFile);
      console.log('Added qhactFile:', formData.qhactFile.name);
    }
    if (formData.qhmodFile) {
      data.append('qhmodFile', formData.qhmodFile);
      console.log('Added qhmodFile:', formData.qhmodFile.name);
    }
    if (formData.despInputFile) {
      data.append('despInputFile', formData.despInputFile);
      console.log('Added despInputFile:', formData.despInputFile.name);
    }
    if (formData.flowchartFile) {
      data.append('flowchartFile', formData.flowchartFile);
      console.log('Added flowchartFile:', formData.flowchartFile.name);
    }
    if (formData.actualSpeedN2) {
      data.append('actualSpeedN2', formData.actualSpeedN2);
      console.log('Added actualSpeedN2:', formData.actualSpeedN2);
    }
    if (formData.actualDischargePressure) {
      data.append('actualDischargePressure', formData.actualDischargePressure);
      console.log('Added actualDischargePressure:', formData.actualDischargePressure);
    }
    if (formData.actualSuctionPressure) {
      data.append('actualSuctionPressure', formData.actualSuctionPressure);
      console.log('Added actualSuctionPressure:', formData.actualSuctionPressure);
    }
    if (formData.actualPowerConsumption) {
      data.append('actualPowerConsumption', formData.actualPowerConsumption);
      console.log('Added actualPowerConsumption:', formData.actualPowerConsumption);
    }
    if (formData.speedN1) {
      data.append('speedN1', formData.speedN1);
      console.log('Added speedN1:', formData.speedN1);
    }
    
    console.log('FormData entries:');
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }
    
    return data;
  }
};

export default energyOptimizationService;
