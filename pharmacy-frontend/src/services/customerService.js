import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Backend URL

export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/customers/create`,
      customerData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const loginCustomer = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/customers/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};
