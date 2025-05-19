import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Select,
  Tag,
  message,
  Modal,
  Input,
  Space,
  Tooltip,
  Popconfirm,
  Badge,
  Card,
  Typography,
  Divider,
  Image,
  Spin,
} from "antd";
import {
  Search,
  Eye,
  FileText,
  CheckCircle,
  Clock,
  RefreshCw,
  Truck,
  ShoppingBag,
  Filter,
  RotateCcw,
  X,
  AlertCircle,
  Edit,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const PrescriptionManagement = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Update the fetchPrescriptions function
  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Log the token (first few characters for security)
      console.log(
        "Token available:",
        token ? `${token.substring(0, 10)}...` : "No token found"
      );

      // Make the API request with detailed error handling
      const response = await axios.get("/api/staffprescription/prescriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response);

      if (response.data.success) {
        setPrescriptions(response.data.prescriptions);
      } else {
        console.error("API returned success: false", response.data);
        message.error(
          "Failed to fetch prescriptions: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);

      // More detailed error logging
      if (error.response) {
        // Server responded with an error status
        console.error("Server error response:", {
          status: error.response.status,
          data: error.response.data,
        });
        message.error(
          `Server error: ${error.response.status} - ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        // Request was made but no response
        console.error("No response received:", error.request);
        message.error(
          "No response from server. Check your connection and server status."
        );
      } else {
        // Error in setting up the request
        console.error("Request setup error:", error.message);
        message.error("Error setting up request: " + error.message);
      }

      // Load mock data for development/testing
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  // Update the mock data to match your actual schema
  const loadMockData = () => {
    const mockPrescriptions = [
      {
        prescription_id: "2216263",
        customer_id: "12152",
        address: "Rs.4306",
        deliver_method: "Deliver",
        telephone: "11/12/22",
        uploaded_at: "11/12/22",
        status: "Delayed",
        file_path: "/placeholder/400/600",
        expiry_date: "2023-11-12",
      },
      // Add more mock data as needed
    ];
    setPrescriptions(mockPrescriptions);
  };

  const handleView = (record) => {
    setCurrentPrescription(record);
    setViewModalVisible(true);
    setImageLoading(true);
  };

  const handleEdit = (record) => {
    const staffId = localStorage.getItem("userId");

    // Navigate to the PrescriptionProductManagement component with prescription data
    navigate("/staff/sales", {
      state: {
        prescriptionId: record.prescription_id,
        customerId: record.customer_id,
        prescriptionState: record.status,
        isFromPrescriptionSelection: true,
        staffId: staffId,
      },
    });
  };
  const handleCompletePrescription = async (prescriptionId) => {
    try {
      setCompleteLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `/api/staffprescription/prescriptions/${prescriptionId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        message.success("Prescription marked as completed");
        // Update local state
        setPrescriptions((prev) =>
          prev.map((p) =>
            p.prescription_id === prescriptionId
              ? { ...p, status: "Completed" }
              : p
          )
        );
        if (currentPrescription?.prescription_id === prescriptionId) {
          setCurrentPrescription({
            ...currentPrescription,
            status: "Completed",
          });
        }
        message.info("Inventory has been reduced and customer notified");
      }
    } catch (error) {
      console.error("Error completing prescription:", error);
      message.error(
        error.response?.data?.message || "Failed to complete prescription"
      );
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleCancelPrescription = async (prescriptionId) => {
    try {
      setCancelLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `/api/staffprescription/prescriptions/${prescriptionId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        message.success("Prescription cancelled successfully");
        // Update local state
        setPrescriptions((prev) =>
          prev.map((p) =>
            p.prescription_id === prescriptionId
              ? { ...p, status: "Cancelled" }
              : p
          )
        );
        if (currentPrescription?.prescription_id === prescriptionId) {
          setCurrentPrescription({
            ...currentPrescription,
            status: "Cancelled",
          });
        }
        message.info("Customer has been notified");
      }
    } catch (error) {
      console.error("Error cancelling prescription:", error);
      message.error(
        error.response?.data?.message || "Failed to cancel prescription"
      );
    } finally {
      setCancelLoading(false);
    }
  };

  // const handleStatusChange = async (prescriptionId, newStatus) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     console.log(
  //       `Updating prescription ${prescriptionId} to status: ${newStatus}`
  //     );

  //     const response = await axios.put(
  //       `/api/staffprescription/prescriptions/${prescriptionId}/status`,
  //       { status: newStatus },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       message.success(`Prescription status updated to ${newStatus}`);

  //       // Update local state instead of refetching
  //       setPrescriptions((prevPrescriptions) =>
  //         prevPrescriptions.map((prescription) =>
  //           prescription.prescription_id === prescriptionId
  //             ? { ...prescription, status: newStatus }
  //             : prescription
  //         )
  //       );
  //     } else {
  //       message.error(response.data.message || "Failed to update status");
  //     }
  //   } catch (error) {
  //     console.error("Error updating prescription status:", error);

  //     // Debug response
  //     if (error.response) {
  //       console.log("Status update error response:", {
  //         status: error.response.status,
  //         data: error.response.data,
  //       });
  //     }

  //     message.error(
  //       "Failed to update status: " +
  //         (error.response?.data?.message || error.message)
  //     );
  //   }
  // };

  //////////correct one /////////

  // const handleStatusChange = async (prescriptionId, newStatus) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     console.log(
  //       `Updating prescription ${prescriptionId} to status: ${newStatus}`
  //     );

  //     // Check if status requires inventory reduction
  //     const requiresInventoryReduction =
  //       newStatus === "Out for delivery" || newStatus === "Ready for pickup";

  //     // Add a parameter to the API call to indicate if inventory should be reduced
  //     const response = await axios.put(
  //       `/api/staffprescription/prescriptions/${prescriptionId}/status`,
  //       {
  //         status: newStatus,
  //         reduceInventory: requiresInventoryReduction,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       message.success(`Prescription status updated to ${newStatus}`);

  //       // Update local state instead of refetching
  //       setPrescriptions((prevPrescriptions) =>
  //         prevPrescriptions.map((prescription) =>
  //           prescription.prescription_id === prescriptionId
  //             ? { ...prescription, status: newStatus }
  //             : prescription
  //         )
  //       );

  //       // If inventory was reduced, show an additional notification
  //       if (requiresInventoryReduction && response.data.inventoryReduced) {
  //         message.info("Product quantities have been reduced from inventory");
  //       }
  //     } else {
  //       message.error(response.data.message || "Failed to update status");
  //     }
  //   } catch (error) {
  //     console.error("Error updating prescription status:", error);

  //     if (error.response) {
  //       console.log("Status update error response:", {
  //         status: error.response.status,
  //         data: error.response.data,
  //       });
  //     }

  //     message.error(
  //       "Failed to update status: " +
  //         (error.response?.data?.message || error.message)
  //     );
  //   }
  // };

  ////////////////////////correct final///////////////

  const handleStatusChange = async (prescriptionId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const staffId = localStorage.getItem("userId");

      console.log(
        `Updating prescription ${prescriptionId} to status: ${newStatus}`
      );

      // Check if status requires inventory reduction
      const requiresInventoryReduction =
        newStatus === "Out for delivery" || newStatus === "Ready for pickup";

      // Add a parameter to the API call to indicate if inventory should be reduced
      const response = await axios.put(
        `/api/staffprescription/prescriptions/${prescriptionId}/status`,
        {
          status: newStatus,
          reduceInventory: requiresInventoryReduction,
          staffId: staffId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        message.success(`Prescription status updated to ${newStatus}`);

        // Update local state instead of refetching
        setPrescriptions((prevPrescriptions) =>
          prevPrescriptions.map((prescription) =>
            prescription.prescription_id === prescriptionId
              ? { ...prescription, status: newStatus }
              : prescription
          )
        );

        // If inventory was reduced, show an additional notification
        if (requiresInventoryReduction && response.data.inventoryReduced) {
          message.info("Product quantities have been reduced from inventory");
        }
      } else {
        message.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating prescription status:", error);

      if (error.response) {
        console.log("Status update error response:", {
          status: error.response.status,
          data: error.response.data,
        });
      }

      message.error(
        "Failed to update status: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const statusColors = {
    Pending: "gold",
    Confirmed: "blue",
    Available: "green",
    "Not available": "red",
    Delayed: "orange",
    "Out for delivery": "cyan",
    "Ready for pickup": "green",
    Completed: "green",
    Expired: "red",
  };

  const statusOptions = [
    {
      value: "Pending",
      label: "Pending",
      icon: <RefreshCw className="h-4 w-4 mr-1" />,
    },
    // {
    //   value: "Confirmed",
    //   label: "Confirmed",
    //   icon: <CheckCircle className="h-4 w-4 mr-1" />,
    // },
    // {
    //   value: "Available",
    //   label: "Available",
    //   icon: <CheckCircle className="h-4 w-4 mr-1" />,
    // },
    {
      value: "Not available",
      label: "Not available",
      icon: <X className="h-4 w-4 mr-1" />,
    },
    {
      value: "Delayed",
      label: "Delayed",
      icon: <Clock className="h-4 w-4 mr-1" />,
    },
    {
      value: "Out for delivery",
      label: "Out for delivery",
      icon: <Truck className="h-4 w-4 mr-1" />,
    },
    {
      value: "Ready for pickup",
      label: "Ready for pickup",
      icon: <ShoppingBag className="h-4 w-4 mr-1" />,
    },
    {
      value: "Completed",
      label: "Completed",
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
    },
    {
      value: "Cancelled",
      label: "Cancelled",
      icon: <XCircle className="h-4 w-4 mr-1" />,
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleFilter = (value) => {
    setFilteredStatus(value);
  };

  const clearFilters = () => {
    setSearchText("");
    setFilteredStatus(null);
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    if (!searchText.trim()) {
      return true; // Show all when search is empty
    }

    // Check if prescription_id exists and convert to string for comparison
    return (
      prescription.prescription_id !== undefined &&
      String(prescription.prescription_id).includes(searchText)
    );
  });

  const columns = [
    {
      title: "Prescription ID",
      dataIndex: "prescription_id",
      key: "prescription_id",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Delivery Method",
      dataIndex: "delivery_method",
      key: "delivery_method",
      render: (deliveryMethod) => (
        <Tag color={deliveryMethod === "Home Delivery" ? "green" : "blue"}>
          {deliveryMethod || "Order Pickup"}
        </Tag>
      ),
    },
    {
      title: "Telephone",
      dataIndex: "telephone",
      key: "telephone",
    },
    {
      title: "Time",
      dataIndex: "uploaded_at",
      key: "time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Space size="middle" onClick={(e) => e.stopPropagation()}>
    //       <Button
    //         type="primary"
    //         size="small"
    //         icon={<Eye className="h-4 w-4" />}
    //         onClick={(e) => {
    //           e.stopPropagation(); // Stop event from bubbling up to the row
    //           handleView(record);
    //         }}
    //         className="bg-blue-500 hover:bg-blue-600"
    //       >
    //         View
    //       </Button>
    //       <Button
    //         type="default"
    //         size="small"
    //         icon={<Edit className="h-4 w-4" />}
    //         onClick={(e) => {
    //           e.stopPropagation(); // Stop event from bubbling up to the row
    //           handleEdit(record);
    //         }}
    //         className="border-blue-500 text-blue-500 hover:text-blue-600 hover:border-blue-600"
    //       >
    //         Manage
    //       </Button>
    //       <Select
    //         placeholder="Update Status"
    //         style={{ width: 160 }}
    //         onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
    //         onChange={(value, option, e) => {
    //           // If e is provided by Select, stop propagation
    //           if (e && e.stopPropagation) {
    //             e.stopPropagation();
    //           }
    //           handleStatusChange(record.prescription_id, value);
    //         }}
    //         loading={statusUpdateLoading}
    //         disabled={statusUpdateLoading}
    //       >
    //         {statusOptions.map((option) => (
    //           <Option key={option.value} value={option.value}>
    //             <div className="flex items-center">
    //               {option.icon}
    //               <span>{option.label}</span>
    //             </div>
    //           </Option>
    //         ))}
    //       </Select>
    //     </Space>
    //   ),
    // },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle" onClick={(e) => e.stopPropagation()}>
          {/* View button */}
          <Button
            type="primary"
            size="small"
            icon={<Eye className="h-4 w-4" />}
            onClick={() => handleView(record)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            View
          </Button>

          {/* Manage button */}
          <Button
            type="default"
            size="small"
            icon={<Edit className="h-4 w-4" />}
            onClick={() => handleEdit(record)}
            className="border-blue-500 text-blue-500 hover:text-blue-600 hover:border-blue-600"
          >
            Manage
          </Button>

          {/* Complete button - only for non-completed/non-cancelled prescriptions */}
          {record.status !== "Completed" && record.status !== "Cancelled" && (
            <Popconfirm
              title="Complete Prescription"
              description="Are you sure you want to mark this prescription as completed? This will reduce inventory."
              onConfirm={() =>
                handleCompletePrescription(record.prescription_id)
              }
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                size="small"
                icon={<CheckCircle className="h-4 w-4" />}
                loading={completeLoading}
                className="bg-green-500 hover:bg-green-600"
              >
                Complete
              </Button>
            </Popconfirm>
          )}

          {/* Cancel button - only for non-cancelled prescriptions */}
          {record.status !== "Cancelled" && (
            <Popconfirm
              title="Cancel Prescription"
              description="Are you sure you want to cancel this prescription?"
              onConfirm={() => handleCancelPrescription(record.prescription_id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="primary"
                size="small"
                danger
                icon={<XCircle className="h-4 w-4" />}
                loading={cancelLoading}
              >
                Cancel
              </Button>
            </Popconfirm>
          )}

          {/* Status dropdown */}
          {/* <Select
            placeholder="Update Status"
            style={{ width: 160 }}
            onChange={(value) =>
              handleStatusChange(record.prescription_id, value)
            }
            loading={statusUpdateLoading}
            disabled={statusUpdateLoading}
          >
            {statusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                <div className="flex items-center">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </Option>
            ))} 
          </Select>*/}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={4}>Prescription Management</Title>
          <Button
            type="primary"
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={fetchPrescriptions}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Refresh
          </Button>
        </div>

        {/* Search and filter controls */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Input
            placeholder="Search by Prescription ID or Customer ID"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<Search className="text-gray-400 h-4 w-4" />}
            style={{ width: 320 }}
            allowClear
          />

          <Select
            placeholder="Filter by Status"
            style={{ width: 200 }}
            value={filteredStatus}
            onChange={handleFilter}
            allowClear
          >
            {statusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                <div className="flex items-center">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </Option>
            ))}
          </Select>

          {(searchText || filteredStatus) && (
            <Button
              onClick={clearFilters}
              icon={<Filter className="h-4 w-4" />}
            >
              Clear Filters
            </Button>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={filteredPrescriptions}
          rowKey="prescription_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          // Remove the onRow handler or modify it to not navigate automatically
          // You can optionally keep the cursor style if you want rows to appear clickable
          onRow={(record) => ({
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      {/* Prescription View Modal */}
      <Modal
        title="Prescription Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={800}
        footer={[
          <Button key="back" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {currentPrescription && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Card title="Prescription Information" className="mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Text strong>Prescription ID:</Text>
                      <Text>{currentPrescription.prescription_id}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Customer ID:</Text>
                      <Text>{currentPrescription.customer_id}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Customer Name:</Text>
                      <Text>{currentPrescription.customer_name || "N/A"}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Address:</Text>
                      <Text>{currentPrescription.address}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Note:</Text>
                      <Text>
                        {currentPrescription.note || "No notes provided"}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Delivery Method:</Text>
                      <Tag
                        color={
                          currentPrescription.deliver_method === "Deliver"
                            ? "blue"
                            : "purple"
                        }
                      >
                        {currentPrescription.deliver_method === "Deliver"
                          ? "Home Delivery"
                          : "Order Pickup"}
                      </Tag>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Telephone:</Text>
                      <Text>{currentPrescription.telephone}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Uploaded Date:</Text>
                      <Text>{currentPrescription.uploaded_at}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Status:</Text>
                      <Tag
                        color={
                          statusColors[currentPrescription.status] || "default"
                        }
                      >
                        {currentPrescription.status}
                      </Tag>
                    </div>
                  </div>
                </Card>

                {/* <Card title="Update Status" className="mb-6">
                  <div className="space-y-4">
                    <Text>Change the status of this prescription:</Text>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select new status"
                      onChange={(value) =>
                        handleStatusChange(
                          currentPrescription.prescription_id,
                          value
                        )
                      }
                    >
                      {statusOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          <div className="flex items-center">
                            {option.icon}
                            <span>{option.label}</span>
                          </div>
                        </Option>
                      ))}
                    </Select>

                    <div className="p-3 bg-blue-50 rounded text-sm">
                      <Text type="secondary">
                        Note: Updating the status will send a notification to
                        the customer.
                      </Text>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <Card title="Prescription Image" className="h-full">
                  {imageLoading && (
                    <div className="flex justify-center items-center py-12">
                      <Spin size="large" />
                    </div>
                  )}
                  <div className="flex justify-center">
                    <Image
                      src={currentPrescription.file_path}
                      alt="Prescription"
                      style={{ maxHeight: "400px" }}
                      onLoad={() => setImageLoading(false)}
                      fallback="data:image/png;base64,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"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </Modal> */}
                <Card title="Prescription Actions" className="mb-6">
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      {currentPrescription.status !== "Completed" &&
                        currentPrescription.status !== "Cancelled" && (
                          <Popconfirm
                            title="Complete Prescription"
                            description="Are you sure you want to mark this prescription as completed? This will reduce inventory."
                            onConfirm={() =>
                              handleCompletePrescription(
                                currentPrescription.prescription_id
                              )
                            }
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              type="primary"
                              icon={<CheckCircle className="h-4 w-4 mr-1" />}
                              loading={completeLoading}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Complete
                            </Button>
                          </Popconfirm>
                        )}

                      {currentPrescription.status !== "Cancelled" && (
                        <Popconfirm
                          title="Cancel Prescription"
                          description="Are you sure you want to cancel this prescription?"
                          onConfirm={() =>
                            handleCancelPrescription(
                              currentPrescription.prescription_id
                            )
                          }
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            type="primary"
                            danger
                            icon={<XCircle className="h-4 w-4 mr-1" />}
                            loading={cancelLoading}
                          >
                            Cancel
                          </Button>
                        </Popconfirm>
                      )}
                    </div>

                    <Divider />

                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select new status"
                      onChange={(value) =>
                        handleStatusChange(
                          currentPrescription.prescription_id,
                          value
                        )
                      }
                    >
                      {statusOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          <div className="flex items-center">
                            {option.icon}
                            <span>{option.label}</span>
                          </div>
                        </Option>
                      ))}
                    </Select>

                    <div className="p-3 bg-blue-50 rounded text-sm">
                      <Text type="secondary">
                        Note: For "Order Pickup" prescriptions, use the
                        "Complete" button to confirm. Cancelling will delete
                        payment records for CashOnDelivery prescriptions.
                      </Text>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <Card title="Prescription Image" className="h-full">
                  {imageLoading && (
                    <div className="flex justify-center items-center py-12">
                      <Spin size="large" />
                    </div>
                  )}
                  <div className="flex justify-center">
                    <Image
                      src={currentPrescription.file_path}
                      alt="Prescription"
                      style={{ maxHeight: "400px" }}
                      onLoad={() => setImageLoading(false)}
                      fallback="data:image/png;base64,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"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PrescriptionManagement;
