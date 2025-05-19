import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SupplierForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    product: "",
    type: "Taking Return",
    address: "",
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchSupplierData();
    }
  }, [isEdit, id]);

  const fetchSupplierData = async () => {
    try {
      const response = await axios.get(`/api/suppliers/${id}`);
      const supplier = response.data.supplier;

      setFormData({
        name: supplier.name || "",
        email: supplier.email || "",
        contactNumber: supplier.contactNumber || supplier.phone || "",
        product: supplier.product || "",
        type: supplier.type || "Taking Return",
        address: supplier.address || "",
      });

      setLoading(false);
    } catch (err) {
      console.error("Error fetching supplier data:", err);
      setError("Failed to load supplier data. Please try again.");
      setLoading(false);

      // Mock data for development
      if (isEdit) {
        setFormData({
          name: "Muthuka Lakshan",
          email: "lakshan@gmail.com",
          contactNumber: "071 456 4563",
          product: "panedol",
          type: "Taking Return",
          address: "123 Pharmacy St, Colombo",
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Convert form data to match your API
      const apiData = {
        name: formData.name,
        email: formData.email,
        phone: formData.contactNumber,
        address: formData.address,
        product: formData.product,
        type: formData.type,
      };

      if (isEdit) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/suppliers/${id}`,
          apiData
        );
      } else {
        await axios.post("${import.meta.env.VITE_API_URL}/suppliers", apiData);
      }

      navigate("/manager/suppliers");
    } catch (err) {
      console.error("Error saving supplier:", err);
      setError(
        "Failed to save supplier. Please check your inputs and try again."
      );
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/manager/suppliers");
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 h-full">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {isEdit ? "Edit Supplier" : "Add New Supplier"}
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="product"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product
              </label>
              <input
                type="text"
                id="product"
                name="product"
                value={formData.product}
                onChange={handleChange}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Taking Return">Taking Return</option>
                <option value="Not Taking Return">Not Taking Return</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Supplier"
                : "Add Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;
