import axios from "axios";

const CheckoutService = {
  /**
   * Process cart checkout
   * @param {Object} checkoutData - Checkout form data
   * @returns {Promise<Object>} - Response data
   */
  processCartCheckout: async (checkoutData) => {
    const token = localStorage.getItem("token");

    const response = await axios.post("/api/checkout/cart", checkoutData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },

  /**
   * Process prescription checkout
   * @param {Object} checkoutData - Checkout form data
   * @returns {Promise<Object>} - Response data
   */
  processPrescriptionCheckout: async (checkoutData) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "/api/checkout/prescription",
      checkoutData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  },

  /**
   * Process single product checkout
   * @param {Object} checkoutData - Checkout form data
   * @returns {Promise<Object>} - Response data
   */
  processProductCheckout: async (checkoutData) => {
    const token = localStorage.getItem("token");

    const response = await axios.post("/api/checkout/product", checkoutData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },

  /**
   * Get prescription products
   * @param {string|number} prescriptionId - Prescription ID
   * @returns {Promise<Object>} - Prescription products data
   */
  getPrescriptionProducts: async (prescriptionId) => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `/api/customer-prescriptions/prescriptions/${prescriptionId}/products`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  /**
   * Get product details
   * @param {string|number} productId - Product ID
   * @returns {Promise<Object>} - Product details
   */
  getProductDetails: async (productId) => {
    const token = localStorage.getItem("token");

    const response = await axios.get(`/api/productsDetails/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  /**
   * Get cart items
   * @returns {Promise<Object>} - Cart items data
   */
  getCartItems: async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get("/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};

export default CheckoutService;
