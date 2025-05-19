// components/SupplierDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SupplierDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchSupplierDetails();
  }, [id]);

  const fetchSupplierDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/suppliers/${id}`);
      setSupplier(response.data.supplier);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching supplier details:", err);
      setError("Failed to load supplier details. Please try again.");
      setLoading(false);

      // Mock data for development
      setSupplier({
        id: id,
        name: "Muthuka Lakshan",
        firstName: "Muthuka",
        lastName: "Lakshan",
        supplierId: "456567",
        type: "Taking Return",
        contactNumber: "071 456 4563",
        email: "lakshan@gmail.com",
        product: "panedol",
        address: "123 Pharmacy St, Colombo",
        image: null,
      });
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/manager/suppliers/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await axios.delete(`/api/suppliers/${id}`);
        navigate("/manager/suppliers");
      } catch (err) {
        console.error("Error deleting supplier:", err);
        alert("Failed to delete supplier. Please try again.");
      }
    }
  };

  const handleGoBack = () => {
    navigate("/manager/suppliers");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error || "Supplier not found"}</p>
          <button
            onClick={handleGoBack}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 h-full">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Supplier</h1>
          <button
            onClick={handleEdit}
            className="flex items-center text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-md text-sm transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              History
            </button>
          </nav>
        </div>

        {activeTab === "overview" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Primary Details
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="text-sm font-medium text-gray-500">
                    Supplier name
                  </div>
                  <div className="col-span-2 text-sm text-gray-900">
                    {supplier.name}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="text-sm font-medium text-gray-500">
                    Supplier Id
                  </div>
                  <div className="col-span-2 text-sm text-gray-900">
                    {supplier.supplierId || supplier.id}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="text-sm font-medium text-gray-500">
                    Supplier Type
                  </div>
                  <div className="col-span-2 text-sm text-gray-900">
                    {supplier.type}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="text-sm font-medium text-gray-500">
                    Contact number
                  </div>
                  <div className="col-span-2 text-sm text-gray-900">
                    {supplier.contactNumber}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="col-span-2 text-sm text-gray-900">
                    {supplier.email}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="text-sm font-medium text-gray-500">
                    Product
                  </div>
                  <div className="col-span-2 text-sm text-gray-900">
                    {supplier.product}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center w-48 h-48">
                {supplier.image ? (
                  <img
                    src={supplier.image}
                    alt={supplier.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="py-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order History
            </h2>
            <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-500">
              No order history available for this supplier.
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={handleGoBack}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors"
          >
            Back to List
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
