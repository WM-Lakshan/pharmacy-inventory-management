

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import SuppliersTable from "../components/suppliers/SuppliersTable";
import SupplierViewModal from "../components/suppliers/SupplierViewModal";
import SupplierAddEditModal from "../components/suppliers/SupplierAddEditModal";
import SupplierFilterModal from "../components/suppliers/SupplierFilterModal";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterProduct, setFilterProduct] = useState("All");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
    fetchAvailableProducts();
  }, []);

  useEffect(() => {
    let result = suppliers;

    if (filterType !== "All") {
      result = result.filter((supplier) => supplier.type === filterType);
    }

    if (filterProduct !== "All") {
      result = result.filter((supplier) => {
        // Check if the supplier has the filtered product
        return supplier.products.some((product) => {
          if (typeof product === "object") {
            return (
              product.name === filterProduct || product.id === filterProduct
            );
          }
          return product === filterProduct;
        });
      });
    }

    setFilteredSuppliers(result);
  }, [suppliers, filterType, filterProduct]);

  const fetchAvailableProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/suppliers/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        // Extract product names for filtering
        const productNames = response.data.products.map((p) => p.name);
        setAvailableProducts(productNames);
      }
    } catch (error) {
      console.error("Error fetching available products:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSuppliers(response.data.suppliers || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch suppliers");
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
      setError("Failed to load suppliers. Please try again later.");
      // Fallback mock data only in development
      if (process.env.NODE_ENV !== "production") {
        setSuppliers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupplier = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `/api/suppliers/${selectedSupplier.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setSuppliers(suppliers.filter((s) => s.id !== selectedSupplier.id));
        message.success("Supplier deleted successfully");
        setIsDetailModalVisible(false);
      } else {
        throw new Error(response.data.message || "Failed to delete supplier");
      }
    } catch (err) {
      console.error("Error deleting supplier:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
      message.error(err.response?.data?.message || "Failed to delete supplier");
    }
  };

  if (loading && suppliers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        {/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div> */}
      </div>
    );
  }

  if (error && suppliers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <SuppliersTable
        suppliers={filteredSuppliers}
        loading={loading}
        onRowClick={(record) => {
          setSelectedSupplier(record);
          setIsDetailModalVisible(true);
        }}
        onAddSupplier={() => {
          setIsEditMode(false);
          setIsAddModalVisible(true);
        }}
        onFilterClick={() => setIsFilterModalVisible(true)}
        filterSummary={`${filterType !== "All" ? filterType : "All"}${
          filterProduct !== "All" ? `, ${filterProduct}` : ""
        }`}
      />

      <SupplierViewModal
        visible={isDetailModalVisible}
        supplier={selectedSupplier}
        onClose={() => setIsDetailModalVisible(false)}
        onEdit={() => {
          setIsEditMode(true);
          setIsDetailModalVisible(false);
          setIsAddModalVisible(true);
        }}
        onDelete={handleDeleteSupplier}
      />

      <SupplierAddEditModal
        visible={isAddModalVisible}
        isEditMode={isEditMode}
        supplier={isEditMode ? selectedSupplier : null}
        onCancel={() => {
          setIsAddModalVisible(false);
          if (isEditMode) {
            setSelectedSupplier(null);
          }
          setIsEditMode(false);
        }}
        onSubmitSuccess={() => {
          setIsAddModalVisible(false);
          fetchSuppliers();
        }}
      />

      <SupplierFilterModal
        visible={isFilterModalVisible}
        filterType={filterType}
        filterProduct={filterProduct}
        availableProducts={availableProducts}
        onCancel={() => setIsFilterModalVisible(false)}
        onApply={() => setIsFilterModalVisible(false)}
        onReset={() => {
          setFilterType("All");
          setFilterProduct("All");
          setIsFilterModalVisible(false);
        }}
        onFilterTypeChange={setFilterType}
        onFilterProductChange={setFilterProduct}
      />
    </div>
  );
};

export default Suppliers;
