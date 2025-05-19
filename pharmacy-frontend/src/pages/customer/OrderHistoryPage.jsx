import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Tag,
  Typography,
  Button,
  Spin,
  Empty,
  Modal,
  Divider,
  Space,
} from "antd";
import { Eye, RotateCcw } from "lucide-react";
import axios from "axios";

const { Title, Text } = Typography;

const CustomerOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      const response = await axios.get("/api/order-history/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        console.error("API returned success: false", response.data);
        setError(
          "Failed to fetch orders: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error loading orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (order) => {
    setCurrentOrder(order);
    setDetailsModalVisible(true);
    setLoadingProducts(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `/api/order-history/orders/${order.order_id}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrderProducts(response.data.products);
      } else {
        setError("Failed to fetch order products");
      }
    } catch (error) {
      console.error("Error fetching order products:", error);
      setError("Error loading order details");
    } finally {
      setLoadingProducts(false);
    }
  };

  const statusColors = {
    Pending: "gold",
    Confirmed: "blue",
    Processing: "purple",
    "Out for delivery": "cyan",
    "Ready for pickup": "green",
    Delivered: "green",
    Delayed: "orange",
    Cancelled: "red",
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "time",
      key: "time",
      render: (time) => <span>{new Date(time).toLocaleDateString()}</span>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => <span>Rs.{value}</span>,
    },
    {
      title: "Delivery Method",
      dataIndex: "delivery_method",
      key: "delivery_method",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<Eye className="h-4 w-4 mr-1" />}
          onClick={() => handleViewDetails(record)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading your orders..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md text-center">
          <div className="flex flex-col items-center">
            <div className="text-red-500 text-5xl mb-4">!</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Error Loading Orders
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              type="primary"
              onClick={fetchOrders}
              className="bg-blue-500"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md text-center">
          <Empty
            description={
              <span className="text-gray-600">
                You don't have any orders yet
              </span>
            }
          />
          <Button
            type="primary"
            className="mt-4 bg-blue-500"
            onClick={() => (window.location.href = "/")}
          >
            Start Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>My Orders</Title>
        <Button
          type="primary"
          icon={<RotateCcw className="h-4 w-4 mr-2" />}
          onClick={fetchOrders}
          className="bg-blue-500"
        >
          Refresh
        </Button>
      </div>

      <Card className="shadow-md">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="order_id"
          pagination={{ pageSize: 10 }}
          className="border rounded-lg overflow-hidden"
        />
      </Card>

      {/* Order Details Modal */}
      <Modal
        title="Order Details"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        width={700}
        footer={[
          <Button key="back" onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {currentOrder && (
          <div>
            <Card title="Order Information" className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text type="secondary">Order ID:</Text>
                  <div className="font-medium">{currentOrder.order_id}</div>
                </div>
                <div>
                  <Text type="secondary">Date:</Text>
                  <div className="font-medium">
                    {new Date(currentOrder.time).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <Text type="secondary">Status:</Text>
                  <div>
                    <Tag color={statusColors[currentOrder.status] || "default"}>
                      {currentOrder.status}
                    </Tag>
                  </div>
                </div>
                <div>
                  <Text type="secondary">Delivery Method:</Text>
                  <div className="font-medium">
                    {currentOrder.delivery_method}
                  </div>
                </div>
                <div>
                  <Text type="secondary">Address:</Text>
                  <div className="font-medium">
                    {currentOrder.address || "N/A"}
                  </div>
                </div>
                <div>
                  <Text type="secondary">Total:</Text>
                  <div className="font-medium text-blue-600">
                    Rs.{currentOrder.value}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Order Items">
              {loadingProducts ? (
                <div className="flex justify-center py-8">
                  <Spin />
                </div>
              ) : orderProducts.length === 0 ? (
                <Empty description="No items found" />
              ) : (
                <div className="space-y-4">
                  {orderProducts.map((product, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <Text strong>{product.name}</Text>
                          <div className="text-gray-500 text-sm">
                            Qty: {product.quantity} x Rs.{product.price}
                          </div>
                        </div>
                        <Text className="font-medium">Rs.{product.total}</Text>
                      </div>
                    </div>
                  ))}

                  <Divider />

                  <div className="flex justify-between font-bold">
                    <Text>Total:</Text>
                    <Text className="text-blue-600">
                      Rs.{currentOrder.value}
                    </Text>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerOrderHistory;
