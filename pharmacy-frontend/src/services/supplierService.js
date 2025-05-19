// services/supplierService.js
import axios from "axios";

// Base API URL - adjust as needed
const API_BASE_URL = "http://localhost:5000";

export const supplierService = {
  // Get all suppliers
  getAllSuppliers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/suppliers`);
      return response.data;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch suppliers"
      );
    }
  },

  // Get supplier by ID
  getSupplierById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching supplier #${id}:`, error);
      throw new Error(
        error.response?.data?.message || `Failed to fetch supplier #${id}`
      );
    }
  },

  // Create new supplier
  createSupplier: async (supplierData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/suppliers`,
        supplierData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating supplier:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create supplier"
      );
    }
  },

  // Update supplier
  updateSupplier: async (id, supplierData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/suppliers/${id}`,
        supplierData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating supplier #${id}:`, error);
      throw new Error(
        error.response?.data?.message || `Failed to update supplier #${id}`
      );
    }
  },

  // Delete supplier
  deleteSupplier: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting supplier #${id}:`, error);
      throw new Error(
        error.response?.data?.message || `Failed to delete supplier #${id}`
      );
    }
  },

  // Search suppliers (optional)
  //   searchSuppliers: async (searchTerm) => {
  //     try {
  //       const response = await axios.get(`${API_BASE_URL}/suppliers/search`, {
  //         params: { q: searchTerm },
  //       });
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error searching suppliers:", error);
  //       throw new Error(
  //         error.response?.data?.message || "Failed to search suppliers"
  //       );
  //     }
  //   },
};
