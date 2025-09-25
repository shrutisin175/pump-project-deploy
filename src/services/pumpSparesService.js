import { AuthService } from './authService';

const API_BASE_URL = 'http://127.0.0.1:8000/api/pump-spares';

class PumpSparesService {
  async fetchFilteredOptions(filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    const url = `${API_BASE_URL}/filtered-options/?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch filtered options');
    }
    
    return response.json();
  }

  async fetchMaterialsForPart(filters) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    const url = `${API_BASE_URL}/materials-for-part/?${params.toString()}`;
    console.log('Fetching materials from URL:', url);
    console.log('Filters:', filters);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`Failed to fetch materials for part: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Materials response:', data);
    return data;
  }

  async fetchMaterialById(materialId) {
    const url = `${API_BASE_URL}/material/${materialId}/`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch material details');
    }
    
    return response.json();
  }

  async fetchPumpMakes() {
    const response = await fetch(`${API_BASE_URL}/pump-makes/`);
    if (!response.ok) throw new Error('Failed to fetch pump makes');
    return response.json();
  }

  async fetchPumpModels() {
    const response = await fetch(`${API_BASE_URL}/pump-models/`);
    if (!response.ok) throw new Error('Failed to fetch pump models');
    return response.json();
  }

  async fetchPumpSizes() {
    const response = await fetch(`${API_BASE_URL}/pump-sizes/`);
    if (!response.ok) throw new Error('Failed to fetch pump sizes');
    return response.json();
  }

  async fetchPartNumbers() {
    const response = await fetch(`${API_BASE_URL}/part-numbers/`);
    if (!response.ok) throw new Error('Failed to fetch part numbers');
    return response.json();
  }

  async fetchPartNames() {
    const response = await fetch(`${API_BASE_URL}/part-names/`);
    if (!response.ok) throw new Error('Failed to fetch part names');
    return response.json();
  }

  async generateReceipt(materialId) {
    // Get current credentials for authentication
    const credentials = AuthService.currentCredentials;
    
    console.log('DEBUG: Current credentials:', credentials);
    
    if (!credentials) {
      throw new Error('Authentication required. Please log in to download receipts.');
    }

    console.log('DEBUG: Sending request with credentials:', {
      material_id: materialId,
      email: credentials.email,
      password: credentials.password ? '[HIDDEN]' : 'undefined'
    });

    const response = await fetch(`${API_BASE_URL}/generate-receipt/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        material_id: materialId,
        email: credentials.email,
        password: credentials.password
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DEBUG: Receipt generation failed:', response.status, errorText);
      throw new Error(`Failed to generate receipt: ${response.status} ${errorText}`);
    }

    console.log('DEBUG: Receipt generated successfully');
    // Return the blob for download
    return response.blob();
  }
}

export default new PumpSparesService();
