import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Make sure this import is present
import axios from "axios";
import {
  ClipboardList,
  Check,
  X,
  AlertCircle,
  Clock,
  Package,
  Truck,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";
import {
  Table,
  Modal,
  Button,
  Spin,
  Tag,
  message,
  Card,
  Empty,
  Space,
  Popconfirm,
  Divider,
} from "antd";
import { ExclamationCircleFilled, ReloadOutlined } from "@ant-design/icons";

const { confirm } = Modal;

const CustomerPrescriptions = () => {
  const navigate = useNavigate(); // Initialize the navigate hook
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // State for the product modal
  const [productsModalVisible, setProductsModalVisible] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionProducts, setPrescriptionProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please login.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "/api/customer-prescriptions/prescriptions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPrescriptions(response.data.prescriptions || []);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setError("Failed to load your prescriptions. Please try again later.");

      // For demo/development purposes, load mock data
      if (process.env.NODE_ENV !== "production") {
        setMockPrescriptions();
      }
    } finally {
      setLoading(false);
    }
  };

  const setMockPrescriptions = () => {
    const mockData = [
      {
        prescription_id: "2216263",
        value: "Rs.4306",
        delivery_method: "Home Delivery",
        uploaded_at: "11/12/22",
        status: "Delayed",
      },
      {
        prescription_id: "2152151512",
        value: "Rs.2557",
        delivery_method: "Store Pickup",
        uploaded_at: "21/12/22",
        status: "Confirmed",
      },
      {
        prescription_id: "15155",
        value: "Rs.4075",
        delivery_method: "Home Delivery",
        uploaded_at: "5/12/22",
        status: "Out for delivery",
      },
      {
        prescription_id: "15156",
        value: "Rs.4075",
        delivery_method: "Store Pickup",
        uploaded_at: "5/12/22",
        status: "Not available",
      },
      {
        prescription_id: "15157",
        value: "Rs.4075",
        delivery_method: "Home Delivery",
        uploaded_at: "5/12/22",
        status: "Available",
      },
    ];

    setPrescriptions(mockData);
  };

  // Function to fetch prescription products
  // const fetchPrescriptionProducts = async (prescriptionId) => {
  //   setLoadingProducts(true);
  //   try {
  //     const token = localStorage.getItem("token");

  //     const response = await axios.get(
  //       `/api/customer-prescriptions/prescriptions/${prescriptionId}/products`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       setPrescriptionProducts(response.data.products || []);
  //     } else {
  //       // If API fails, set mock data for demonstration
  //       setMockPrescriptionProducts();
  //     }
  //   } catch (error) {
  //     console.error("Error fetching prescription products:", error);
  //     // Set mock data for demonstration
  //     setMockPrescriptionProducts();
  //   } finally {
  //     setLoadingProducts(false);
  //   }
  // };
const fetchPrescriptionProducts = async (prescriptionId) => {
  setLoadingProducts(true);
  try {
    const token = localStorage.getItem("token");

    // This endpoint should match the one we defined in our routes
    const response = await axios.get(
      `/api/customer-prescriptions/prescriptions/${prescriptionId}/products`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      setPrescriptionProducts(response.data.products || []);
    } else {
      // If API fails, set mock data for demonstration
      setMockPrescriptionProducts();
    }
  } catch (error) {
    console.error("Error fetching prescription products:", error);
    // Set mock data for demonstration
    setMockPrescriptionProducts();
  } finally {
    setLoadingProducts(false);
  }
};

  
  // Mock prescription products for testing
  const setMockPrescriptionProducts = () => {
    const mockProducts = [
      {
        id: "101",
        name: "Panadol",
        quantity: 10,
        price: 123,
        total: 1230,
      },
      {
        id: "102",
        name: "Amoxicillin",
        quantity: 5,
        price: 245,
        total: 1225,
      },
      {
        id: "103",
        name: "Vitamin C",
        quantity: 2,
        price: 350,
        total: 700,
      },
    ];
    setPrescriptionProducts(mockProducts);
  };

  // Show the products modal
  const showProductsModal = (prescription) => {
    setSelectedPrescription(prescription);
    fetchPrescriptionProducts(prescription.prescription_id);
    setProductsModalVisible(true);
  };

  // Function to proceed to checkout
  const proceedToCheckout = (prescription) => {
    if (!prescription) return;

    const prescriptionId = prescription.prescription_id;

    // Navigate to the checkout page with prescription details
    navigate("/checkout", {
      state: {
        source: "prescription", 
      prescriptionId: prescriptionId,
      deliveryMethod: "Order Pickup" 
      },
    });
  };

  const acceptPrescription = async (prescription) => {
    if (!prescription) return;

    setProcessingAction(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `/api/customer-prescriptions/prescriptions/${prescription.prescription_id}/status`,
        {
          status: "Confirmed",
          reduceInventory: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setPrescriptions((prevPrescriptions) =>
          prevPrescriptions.map((p) =>
            p.prescription_id === prescription.prescription_id
              ? { ...p, status: "Confirmed" }
              : p
          )
        );
        message.success("Order accepted successfully!");
      } else {
        message.error(response.data.message || "Failed to accept order.");
      }
    } catch (error) {
      console.error("Error accepting prescription:", error);
      message.error("Failed to accept order. Please try again.");
    } finally {
      setProcessingAction(false);
    }
  };

  const cancelPrescription = async (prescription) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `/api/customer-prescriptions/prescriptions/${prescription.prescription_id}/status`,
        {
          status: "Cancelled",
          reduceInventory: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setPrescriptions((prevPrescriptions) =>
          prevPrescriptions.map((p) =>
            p.prescription_id === prescription.prescription_id
              ? { ...p, status: "Cancelled" }
              : p
          )
        );
        message.success("Order cancelled successfully.");
      } else {
        message.error(response.data.message || "Failed to cancel order.");
      }
    } catch (error) {
      console.error("Error cancelling prescription:", error);
      message.error("Failed to cancel order. Please try again.");
    }
  };

  const showAcceptConfirm = (prescription) => {
    confirm({
      title: "Proceed to Checkout",
      icon: <ShoppingBag className="w-5 h-5" />,
      content:
        "You'll be redirected to checkout where you can select delivery method and payment options.",
      okText: "Proceed",
      okType: "primary",
      okButtonProps: {
        className: "bg-green-600 hover:bg-green-700",
      },
      cancelText: "Cancel",
      onOk() {
        // Use the proceedToCheckout function instead of acceptPrescription
        return proceedToCheckout(prescription);
      },
    });
  };

  const showCancelConfirm = (prescription) => {
    confirm({
      title: "Confirm Order Cancellation",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to cancel this prescription?",
      okText: "Yes, Cancel Order",
      okType: "danger",
      cancelText: "No",
      onOk() {
        return cancelPrescription(prescription);
      },
    });
  };

  // Function to get status tag configuration
  const getStatusTag = (status) => {
    const statusConfig = {
      Available: {
        icon: <Check className="w-4 h-4" />,
        color: "green",
        text: "Available",
      },
      "Not available": {
        icon: <X className="w-4 h-4" />,
        color: "red",
        text: "Not Available",
      },
      Delayed: {
        icon: <Clock className="w-4 h-4" />,
        color: "orange",
        text: "Delayed",
      },
      Confirmed: {
        icon: <CheckCircle className="w-4 h-4" />,
        color: "blue",
        text: "Confirmed",
      },
      "Out for delivery": {
        icon: <Truck className="w-4 h-4" />,
        color: "cyan",
        text: "Out for Delivery",
      },
      "Ready for pickup": {
        icon: <Package className="w-4 h-4" />,
        color: "purple",
        text: "Ready for Pickup",
      },
      Pending: {
        icon: <Clock className="w-4 h-4" />,
        color: "gray",
        text: "Pending",
      },
      default: {
        icon: <AlertCircle className="w-4 h-4" />,
        color: "gray",
        text: status,
      },
    };

    return statusConfig[status] || statusConfig.default;
  };

  const columns = [
    {
      title: "Prescription ID",
      dataIndex: "prescription_id",
      key: "prescription_id",
      render: (id) => <span className="font-medium">{id}</span>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Delivery Method",
      dataIndex: "delivery_method",
      key: "delivery_method",
    },
    {
      title: "Uploaded At",
      dataIndex: "uploaded_at",
      key: "uploaded_at",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const { icon, color, text } = getStatusTag(status);
        return (
          <Tag
            icon={icon}
            color={color}
            className="flex items-center gap-1 capitalize"
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {/* View Products Button - Add this button for all prescriptions */}
          <Button
            type="primary"
            icon={<ShoppingBag className="w-4 h-4" />}
            onClick={() => showProductsModal(record)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            View Products
          </Button>

          {record.status === "Available" && (
            <>
              <Button
                type="primary"
                ghost
                className="border-green-500 text-green-600 hover:text-white hover:bg-green-600"
                onClick={() => showAcceptConfirm(record)}
                loading={processingAction}
              >
                Checkout
              </Button>
              <Popconfirm
                title="Cancel Prescription"
                description="Are you sure to cancel this prescription?"
                onConfirm={() => showCancelConfirm(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Cancel</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin tip="Loading your prescriptions..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md text-center">
          <div className="flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Error Loading Prescriptions
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={fetchPrescriptions}
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Empty
          image={<ClipboardList className="w-16 h-16 text-gray-400 mx-auto" />}
          imageStyle={{ height: 60 }}
          description={
            <span className="text-gray-600">
              You don't have any prescriptions at the moment.
            </span>
          }
        >
          <Button
            type="primary"
            onClick={() => (window.location.href = "/upload-prescription")}
          >
            Upload Prescription
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Prescriptions</h1>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchPrescriptions}
          className="flex items-center"
        >
          Refresh
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={prescriptions}
          rowKey="prescription_id"
          pagination={pagination}
          onChange={(pagination) => setPagination(pagination)}
          className="rounded-lg overflow-hidden"
        />
      </div>

      {/* Prescription Products Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-blue-500" />
            <span>Order Products</span>
          </div>
        }
        open={productsModalVisible}
        onCancel={() => setProductsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setProductsModalVisible(false)}>
            Close
          </Button>,
          // Add a checkout button in the modal footer if status is Available
          selectedPrescription?.status === "Available" && (
            <Button
              key="checkout"
              type="primary"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setProductsModalVisible(false);
                proceedToCheckout(selectedPrescription);
              }}
            >
              Proceed to Checkout
            </Button>
          ),
        ].filter(Boolean)} // Filter out false/null values
        width={600}
      >
        {loadingProducts ? (
          <div className="py-10 flex justify-center">
            <Spin />
          </div>
        ) : (
          <div>
            {prescriptionProducts.map((product, index) => (
              <React.Fragment key={product.id}>
                <div className="py-3">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{product.name}</div>
                    <div className="font-semibold">Rs.{product.total}</div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    Qty: {product.quantity} x Rs.{product.price}
                  </div>
                </div>
                {index < prescriptionProducts.length - 1 && (
                  <Divider className="my-1" />
                )}
              </React.Fragment>
            ))}

            <Divider className="my-3" />

            <div className="flex justify-between items-center text-lg font-bold">
              <div>Total:</div>
              <div>
                Rs.
                {prescriptionProducts.reduce(
                  (sum, product) => sum + product.total,
                  0
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerPrescriptions;
