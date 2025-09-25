const API_BASE_URL = 'http://localhost:8000/api/pump-spares';

class InventoryService {
  async getAllInventoryItems() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Handle wrapped response format
      return data.value || data;
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  }

  async getAllMaterials() {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  }

  async getMaterialById(materialId) {
    try {
      const response = await fetch(`${API_BASE_URL}/material/${materialId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching material by ID:', error);
      throw error;
    }
  }

  async getFilteredOptions(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const url = `${API_BASE_URL}/filtered-options/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching filtered options:', error);
      throw error;
    }
  }

  async getMaterialsForPart(filters) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await fetch(`${API_BASE_URL}/materials-for-part/?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching materials for part:', error);
      throw error;
    }
  }

  async generateReceipt(materialId, credentials = null) {
    try {
      const requestBody = { material_id: materialId };
      if (credentials) {
        requestBody.email = credentials.email;
        requestBody.password = credentials.password;
      }

      const response = await fetch(`${API_BASE_URL}/generate-receipt/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `receipt_material_${materialId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true, message: 'Receipt downloaded successfully' };
    } catch (error) {
      console.error('Error generating receipt:', error);
      throw error;
    }
  }

  transformInventoryData(apiData) {
    return apiData.map(item => ({
      id: item.id,
      partName: item.part_name,
      partNo: item.part_no,
      drawing: item.drawing || 'N/A',
      refLocation: item.ref_location || 'N/A',
      moc: item.moc,
      availability: item.availability.toString(),
      uom: item.uom,
      unitPrice: item.unit_price.toString(),
      drawingVendor: item.drawing_vendor || 'N/A',
      originalData: item
    }));
  }

  transformMaterialData(apiData) {
    return apiData.map(item => ({
      id: item.id,
      partName: item.part_name_value,
      partNo: item.part_number_value,
      drawing: item.drawing || 'N/A',
      refLocation: item.ref_part_list || 'N/A',
      moc: item.moc,
      availability: item.qty_available.toString(),
      uom: 'nos', 
      unitPrice: item.unit_price.toString(),
      drawingVendor: item.drawing || 'N/A',
      pumpMake: item.pump_make_name,
      pumpModel: item.pump_model_name,
      pumpSize: item.pump_size_value,
      originalData: item 
    }));
  }

  async getInventoryItemById(itemId) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/item/${itemId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching inventory item by ID:', error);
      throw error;
    }
  }

  async searchInventory(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const url = `${API_BASE_URL}/inventory/search/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Error searching inventory:', error);
      throw error;
    }
  }

  async getInventoryStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/stats/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      throw error;
    }
  }

  async searchMaterials(searchTerm = '') {
    try {
      const allMaterials = await this.getAllMaterials();
      const transformedData = this.transformMaterialData(allMaterials);
      
      if (!searchTerm) {
        return transformedData;
      }

      const filtered = transformedData.filter(item =>
        item.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.drawing.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.moc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pumpMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pumpModel.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return filtered;
    } catch (error) {
      console.error('Error searching materials:', error);
      throw error;
    }
  }

  async generateInventoryReceipt(cartItems, customerInfo = {}, credentials = null) {
    try {
      const requestBody = {
        cart_items: cartItems,
        customer_info: customerInfo
      };
      
      if (credentials) {
        requestBody.email = credentials.email;
        requestBody.password = credentials.password;
      }

      const response = await fetch(`${API_BASE_URL}/inventory/generate-receipt/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'inventory_receipt.docx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true, message: 'Inventory receipt downloaded successfully' };
    } catch (error) {
      console.error('Error generating inventory receipt:', error);
      throw error;
    }
  }
}

export default new InventoryService();
