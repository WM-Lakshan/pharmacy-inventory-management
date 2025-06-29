
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import OrdersTable from "../components/OrdersTable";
import OrderDetailView from "../components/OrderDetailView";
import OrderEditForm from "../components/OrderEditForm.jsx";

const SupplierOrders = () => {
  const [orders, setOrders] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // list, view, edit, add
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch orders data
  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("/api/supplier-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
      } else if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.warn("Unexpected response format:", response.data);
        setOrders(mockOrdersData);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) {
        message.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      message.error("Failed to load orders data");
      setOrders(mockOrdersData);
    } finally {
      setLoading(false);
    }
  };
  const fetchSupplierName = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/supplier-orders/supplier/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSelectedOrder({
        ...response.data.order,
        products: response.data.order.products || [],
      });
    } catch (error) {
      console.error("Error Supplier:", error);
      message.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/supplier-orders/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSelectedOrder({
        ...response.data.order,
        products: response.data.order.products || [],
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      message.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("/api/supplier-orders/products/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.warn("Unexpected products response format:", response.data);
        setProducts(mockProductsData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response?.status === 401) {
        message.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      setProducts(mockProductsData);
    }
  };

  const handleViewOrder = async (order) => {
    try {
      await fetchOrderDetails(order.order_id);
      setViewMode("view");
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Failed to load order details");
    }
  };

  const handleAddOrder = () => {
    const newOrder = {
      order_id: Math.floor(100000 + Math.random() * 900000).toString(),
      supplier_id: "",
      supplier_name: "",
      manager_id: "",
      products: [],
      total_value: 0,
    };
    setSelectedOrder(newOrder);
    setViewMode("add");
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(`/api/supplier-orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Order deleted successfully");
      fetchOrders();
      setViewMode("list");
    } catch (error) {
      console.error("Error deleting order:", error);
      if (error.response?.status === 401) {
        message.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      message.error("Failed to delete order");
    }
  };

  const handleSaveOrder = async (orderData) => {
    try {
      const invalidProducts = orderData.products.filter(
        (p) => p.buying_price <= 0 || p.quantity <= 0
      );

      if (invalidProducts.length > 0) {
        message.error("Some products have invalid prices or quantities");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Prepare order data for saving 
      const orderToSave = {
        ...orderData,
        products: orderData.products.map((p) => ({
          ...p,
          unit_type: p.unit_type || "unit",
          units_per_package: p.units_per_package || 1,
        })),
      };

      // Make sure to delete expected_date if it exists
      if (orderToSave.expected_date) {
        delete orderToSave.expected_date;
      }

      if (viewMode === "edit") {
        await axios.put(
          `/api/supplier-orders/${orderData.order_id}`,
          orderToSave,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Order updated successfully");
      } else {
        await axios.post("/api/supplier-orders", orderToSave, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Order added successfully");
      }

      fetchOrders();
      setViewMode("list");
    } catch (error) {
      console.error("Error saving order:", error);
      if (error.response?.status === 401) {
        message.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      message.error("Failed to save order");
    }
  };

  // Mock data for development
  const mockOrdersData = [
    // ... (same as before)
  ];

  const mockProductsData = [
    // ... (same as before)
  ];

  return (
    <div className="p-6">
      {viewMode === "list" && (
        <OrdersTable
          orders={orders}
          loading={loading}
          onView={handleViewOrder}
          onAdd={handleAddOrder}
        />
      )}
      {viewMode === "view" && selectedOrder && (
        <OrderDetailView
          order={selectedOrder}
          onEdit={() => setViewMode("edit")}
          onDelete={handleDeleteOrder}
          onBack={() => setViewMode("list")}
        />
      )}
      {(viewMode === "edit" || viewMode === "add") && selectedOrder && (
        <OrderEditForm
          order={selectedOrder}
          products={products}
          mode={viewMode}
          onSave={handleSaveOrder}
          onCancel={() =>
            viewMode === "edit" ? setViewMode("view") : setViewMode("list")
          }
          onChange={setSelectedOrder}
        />
      )}
    </div>
  );
};

export default SupplierOrders;
