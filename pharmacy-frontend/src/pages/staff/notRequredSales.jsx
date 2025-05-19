// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Table,
// // //   Button,
// // //   Modal,
// // //   Tag,
// // //   Select,
// // //   Typography,
// // //   Card,
// // //   Space,
// // //   Input,
// // //   message,
// // //   Spin,
// // //   Divider,
// // // } from "antd";
// // // import {
// // //   Eye,
// // //   RotateCcw,
// // //   Truck,
// // //   ShoppingBag,
// // //   Search,
// // //   Filter,
// // // } from "lucide-react";
// // // import axios from "axios";

// // // const { Title, Text } = Typography;
// // // const { Option } = Select;

// // // const SalesManagement = () => {
// // //   const [orders, setOrders] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [detailsModalVisible, setDetailsModalVisible] = useState(false);
// // //   const [currentOrder, setCurrentOrder] = useState(null);
// // //   const [currentOrderProducts, setCurrentOrderProducts] = useState([]);
// // //   const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
// // //   const [searchText, setSearchText] = useState("");
// // //   const [filteredStatus, setFilteredStatus] = useState(null);

// // //   useEffect(() => {
// // //     fetchOrders();
// // //   }, []);

// // //   const fetchOrders = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const response = await axios.get("/api/staff/orders", {
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //       });

// // //       if (response.data.success) {
// // //         setOrders(response.data.orders);
// // //       } else {
// // //         console.error("API returned success: false", response.data);
// // //         message.error(
// // //           "Failed to fetch orders: " +
// // //             (response.data.message || "Unknown error")
// // //         );
// // //         loadMockData();
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching orders:", error);
// // //       message.error("Error loading orders");
// // //       loadMockData();
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const loadMockData = () => {
// // //     const mockOrders = [
// // //       {
// // //         order_id: "12152",
// // //         customer_id: "2216263",
// // //         value: "Rs.4306",
// // //         delivery_method: "2216263",
// // //         time: "11/12/22",
// // //         status: "Delayed",
// // //       },
// // //       {
// // //         order_id: "515161",
// // //         customer_id: "2152151512",
// // //         value: "Rs.2557",
// // //         delivery_method: "2152151512",
// // //         time: "21/12/22",
// // //         status: "Confirmed",
// // //       },
// // //       {
// // //         order_id: "52562",
// // //         customer_id: "15155",
// // //         value: "Rs.4075",
// // //         delivery_method: "15155",
// // //         time: "5/12/22",
// // //         status: "Out for delivery",
// // //       },
// // //     ];
// // //     setOrders(mockOrders);
// // //   };

// // //   const handleViewDetails = async (order) => {
// // //     setCurrentOrder(order);
// // //     setDetailsModalVisible(true);

// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const response = await axios.get(
// // //         `/api/staff/orders/${order.order_id}/products`,
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${token}`,
// // //           },
// // //         }
// // //       );

// // //       if (response.data.success) {
// // //         setCurrentOrderProducts(response.data.products);
// // //       } else {
// // //         setMockOrderProducts();
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching order products:", error);
// // //       setMockOrderProducts();
// // //     }
// // //   };

// // //   const setMockOrderProducts = () => {
// // //     const mockProducts = [
// // //       {
// // //         id: "P001",
// // //         name: "Paracetamol 500mg",
// // //         quantity: 3,
// // //         price: 45,
// // //         total: 135,
// // //         expiry_date: "2025-06-30",
// // //       },
// // //       {
// // //         id: "P002",
// // //         name: "Vitamin C 1000mg",
// // //         quantity: 2,
// // //         price: 120,
// // //         total: 240,
// // //         expiry_date: "2025-05-15",
// // //       },
// // //       {
// // //         id: "P003",
// // //         name: "Ibuprofen 400mg",
// // //         quantity: 1,
// // //         price: 65,
// // //         total: 65,
// // //         expiry_date: "2024-12-20",
// // //       },
// // //     ];
// // //     setCurrentOrderProducts(mockProducts);
// // //   };

// // //   const handleStatusChange = async (orderId, newStatus) => {
// // //     try {
// // //       setStatusUpdateLoading(true);
// // //       const token = localStorage.getItem("token");

// // //       // Check if status requires inventory reduction
// // //       const reduceInventory =
// // //         newStatus === "Delivered" || newStatus === "Ready for pickup";

// // //       const response = await axios.put(
// // //         `/api/staff/orders/${orderId}/status`,
// // //         {
// // //           status: newStatus,
// // //           reduceInventory,
// // //         },
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${token}`,
// // //             "Content-Type": "application/json",
// // //           },
// // //         }
// // //       );

// // //       if (response.data.success) {
// // //         message.success(`Order status updated to ${newStatus}`);

// // //         // Update local state instead of refetching
// // //         setOrders((prevOrders) =>
// // //           prevOrders.map((order) =>
// // //             order.order_id === orderId ? { ...order, status: newStatus } : order
// // //           )
// // //         );

// // //         // If current order modal is open, update its status too
// // //         if (currentOrder && currentOrder.order_id === orderId) {
// // //           setCurrentOrder((prev) => ({ ...prev, status: newStatus }));
// // //         }

// // //         // If inventory was reduced, show additional notification
// // //         if (reduceInventory && response.data.inventoryReduced) {
// // //           message.info("Product quantities have been reduced from inventory");
// // //         }
// // //       } else {
// // //         message.error(response.data.message || "Failed to update status");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error updating order status:", error);
// // //       message.error(
// // //         "Failed to update status: " +
// // //           (error.response?.data?.message || error.message)
// // //       );
// // //     } finally {
// // //       setStatusUpdateLoading(false);
// // //     }
// // //   };

// // //   const statusColors = {
// // //     Pending: "gold",
// // //     Confirmed: "blue",
// // //     Processing: "purple",
// // //     "Out for delivery": "cyan",
// // //     "Ready for pickup": "green",
// // //     Delivered: "green",
// // //     Delayed: "orange",
// // //     Cancelled: "red",
// // //   };

// // //   const statusOptions = [
// // //     {
// // //       value: "Delivered",
// // //       label: "Delivered",
// // //       icon: <Truck className="h-4 w-4 mr-1" />,
// // //     },
// // //     {
// // //       value: "Ready for pickup",
// // //       label: "Ready for pickup",
// // //       icon: <ShoppingBag className="h-4 w-4 mr-1" />,
// // //     },
// // //   ];

// // //   const handleSearch = (value) => {
// // //     setSearchText(value);
// // //   };

// // //   const handleFilter = (value) => {
// // //     setFilteredStatus(value);
// // //   };

// // //   const clearFilters = () => {
// // //     setSearchText("");
// // //     setFilteredStatus(null);
// // //   };

// // //   const filteredOrders = orders.filter((order) => {
// // //     // Filter by search text
// // //     const matchesSearch =
// // //       !searchText.trim() ||
// // //       order.order_id.toString().includes(searchText) ||
// // //       order.customer_id.toString().includes(searchText);

// // //     // Filter by status
// // //     const matchesStatus = !filteredStatus || order.status === filteredStatus;

// // //     return matchesSearch && matchesStatus;
// // //   });

// // //   const columns = [
// // //     {
// // //       title: "Order ID",
// // //       dataIndex: "order_id",
// // //       key: "order_id",
// // //       render: (text) => <span className="font-medium">{text}</span>,
// // //     },
// // //     {
// // //       title: "Customer ID",
// // //       dataIndex: "customer_id",
// // //       key: "customer_id",
// // //     },
// // //     {
// // //       title: "Value",
// // //       dataIndex: "value",
// // //       key: "value",
// // //     },
// // //     {
// // //       title: "Delivery Method",
// // //       dataIndex: "delivery_method",
// // //       key: "delivery_method",
// // //     },
// // //     {
// // //       title: "Time",
// // //       dataIndex: "time",
// // //       key: "time",
// // //     },
// // //     {
// // //       title: "Status",
// // //       dataIndex: "status",
// // //       key: "status",
// // //       render: (status) => (
// // //         <Tag color={statusColors[status] || "default"}>{status}</Tag>
// // //       ),
// // //     },
// // //     {
// // //       title: "Actions",
// // //       key: "actions",
// // //       render: (_, record) => (
// // //         <Button
// // //           type="primary"
// // //           size="small"
// // //           icon={<Eye className="h-4 w-4 mr-1" />}
// // //           onClick={() => handleViewDetails(record)}
// // //           className="bg-blue-500 hover:bg-blue-600"
// // //         >
// // //           View Details
// // //         </Button>
// // //       ),
// // //     },
// // //   ];

// // //   return (
// // //     <div className="p-6">
// // //       <Card>
// // //         <div className="flex justify-between items-center mb-6">
// // //           <Title level={4}>Sales Management</Title>
// // //           <Button
// // //             type="primary"
// // //             icon={<RotateCcw className="h-4 w-4" />}
// // //             onClick={fetchOrders}
// // //             className="bg-blue-500 hover:bg-blue-600"
// // //           >
// // //             Refresh
// // //           </Button>
// // //         </div>

// // //         {/* Search and filter controls */}
// // //         <div className="mb-6 flex flex-wrap gap-4">
// // //           <Input
// // //             placeholder="Search by Order ID or Customer ID"
// // //             value={searchText}
// // //             onChange={(e) => handleSearch(e.target.value)}
// // //             prefix={<Search className="text-gray-400 h-4 w-4" />}
// // //             style={{ width: 320 }}
// // //             allowClear
// // //           />

// // //           <Select
// // //             placeholder="Filter by Status"
// // //             style={{ width: 200 }}
// // //             value={filteredStatus}
// // //             onChange={handleFilter}
// // //             allowClear
// // //           >
// // //             <Option value="Pending">Pending</Option>
// // //             <Option value="Confirmed">Confirmed</Option>
// // //             <Option value="Processing">Processing</Option>
// // //             <Option value="Out for delivery">Out for delivery</Option>
// // //             <Option value="Ready for pickup">Ready for pickup</Option>
// // //             <Option value="Delivered">Delivered</Option>
// // //             <Option value="Delayed">Delayed</Option>
// // //             <Option value="Cancelled">Cancelled</Option>
// // //           </Select>

// // //           {(searchText || filteredStatus) && (
// // //             <Button
// // //               onClick={clearFilters}
// // //               icon={<Filter className="h-4 w-4" />}
// // //             >
// // //               Clear Filters
// // //             </Button>
// // //           )}
// // //         </div>

// // //         <Table
// // //           columns={columns}
// // //           dataSource={filteredOrders}
// // //           rowKey="order_id"
// // //           loading={loading}
// // //           pagination={{ pageSize: 10 }}
// // //           scroll={{ x: "max-content" }}
// // //         />
// // //       </Card>

// // //       {/* Order Details Modal */}
// // //       <Modal
// // //         title="Order Details"
// // //         open={detailsModalVisible}
// // //         onCancel={() => setDetailsModalVisible(false)}
// // //         width={800}
// // //         footer={[
// // //           <Button key="back" onClick={() => setDetailsModalVisible(false)}>
// // //             Close
// // //           </Button>,
// // //         ]}
// // //       >
// // //         {currentOrder && (
// // //           <div className="p-4">
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //               <div>
// // //                 <Card title="Order Information" className="mb-6">
// // //                   <div className="space-y-3">
// // //                     <div className="flex justify-between">
// // //                       <Text strong>Order ID:</Text>
// // //                       <Text>{currentOrder.order_id}</Text>
// // //                     </div>
// // //                     <div className="flex justify-between">
// // //                       <Text strong>Customer ID:</Text>
// // //                       <Text>{currentOrder.customer_id}</Text>
// // //                     </div>
// // //                     <div className="flex justify-between">
// // //                       <Text strong>Value:</Text>
// // //                       <Text>{currentOrder.value}</Text>
// // //                     </div>
// // //                     <div className="flex justify-between">
// // //                       <Text strong>Delivery Method:</Text>
// // //                       <Text>{currentOrder.delivery_method}</Text>
// // //                     </div>
// // //                     <div className="flex justify-between">
// // //                       <Text strong>Order Date:</Text>
// // //                       <Text>{currentOrder.time}</Text>
// // //                     </div>
// // //                     <div className="flex justify-between">
// // //                       <Text strong>Status:</Text>
// // //                       <Tag
// // //                         color={statusColors[currentOrder.status] || "default"}
// // //                       >
// // //                         {currentOrder.status}
// // //                       </Tag>
// // //                     </div>
// // //                   </div>
// // //                 </Card>

// // //                 <Card title="Update Status" className="mb-6">
// // //                   <div className="space-y-4">
// // //                     <Text>Change the status of this order:</Text>
// // //                     <Select
// // //                       style={{ width: "100%" }}
// // //                       placeholder="Select new status"
// // //                       onChange={(value) =>
// // //                         handleStatusChange(currentOrder.order_id, value)
// // //                       }
// // //                       loading={statusUpdateLoading}
// // //                     >
// // //                       {statusOptions.map((option) => (
// // //                         <Option key={option.value} value={option.value}>
// // //                           <div className="flex items-center">
// // //                             {option.icon}
// // //                             <span>{option.label}</span>
// // //                           </div>
// // //                         </Option>
// // //                       ))}
// // //                     </Select>

// // //                     <div className="p-3 bg-blue-50 rounded text-sm">
// // //                       <Text type="secondary">
// // //                         Note: Setting the status to "Delivered" or "Ready for
// // //                         pickup" will reduce product quantities from inventory.
// // //                       </Text>
// // //                     </div>
// // //                   </div>
// // //                 </Card>
// // //               </div>

// // //               <div>
// // //                 <Card title="Order Products" className="h-full">
// // //                   {!currentOrderProducts.length ? (
// // //                     <div className="flex justify-center items-center py-12">
// // //                       <Spin size="large" />
// // //                     </div>
// // //                   ) : (
// // //                     <div className="space-y-4">
// // //                       {currentOrderProducts.map((product, index) => (
// // //                         <div
// // //                           key={index}
// // //                           className="border-b pb-3 last:border-b-0"
// // //                         >
// // //                           <div className="flex justify-between">
// // //                             <Text strong>{product.name}</Text>
// // //                             <Text>Rs.{product.total}</Text>
// // //                           </div>
// // //                           <div className="flex justify-between text-sm text-gray-500 mt-1">
// // //                             <Text>
// // //                               Qty: {product.quantity} x Rs.{product.price}
// // //                             </Text>
// // //                             <Text>Expires: {product.expiry_date}</Text>
// // //                           </div>
// // //                         </div>
// // //                       ))}

// // //                       <Divider />

// // //                       <div className="flex justify-between font-bold">
// // //                         <Text>Total:</Text>
// // //                         <Text>{currentOrder.value}</Text>
// // //                       </div>
// // //                     </div>
// // //                   )}
// // //                 </Card>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </Modal>
// // //     </div>
// // //   );
// // // };

// // // export default SalesManagement;

// // import React, { useState, useEffect } from "react";
// // import {
// //   Table,
// //   Button,
// //   Modal,
// //   Tag,
// //   Select,
// //   Typography,
// //   Card,
// //   Space,
// //   Input,
// //   message,
// //   Spin,
// //   Divider,
// //   Popconfirm,
// // } from "antd";
// // import {
// //   Eye,
// //   RotateCcw,
// //   Truck,
// //   ShoppingBag,
// //   Search,
// //   Filter,
// // } from "lucide-react";
// // import axios from "axios";

// // const { Title, Text } = Typography;
// // const { Option } = Select;

// // const SalesManagement = () => {
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [detailsModalVisible, setDetailsModalVisible] = useState(false);
// //   const [currentOrder, setCurrentOrder] = useState(null);
// //   const [currentOrderProducts, setCurrentOrderProducts] = useState([]);
// //   const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
// //   const [searchText, setSearchText] = useState("");
// //   const [filteredStatus, setFilteredStatus] = useState(null);

// //   useEffect(() => {
// //     fetchOrders();
// //   }, []);

// //   const fetchOrders = async () => {
// //     setLoading(true);
// //     try {
// //       const token = localStorage.getItem("token");

// //       const response = await axios.get("/api/staff-orders/orders", {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       if (response.data.success) {
// //         setOrders(response.data.orders);
// //       } else {
// //         console.error("API returned success: false", response.data);
// //         message.error(
// //           "Failed to fetch orders: " +
// //             (response.data.message || "Unknown error")
// //         );
// //         loadMockData();
// //       }
// //     } catch (error) {
// //       console.error("Error fetching orders:", error);
// //       message.error("Error loading orders");
// //       loadMockData();
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadMockData = () => {
// //     const mockOrders = [
// //       {
// //         order_id: "12152",
// //         customer_id: "2216263",
// //         value: "Rs.4306",
// //         delivery_method: "Order Pickup",
// //         time: "11/12/22",
// //         status: "Delayed",
// //         customer_name: "John Doe",
// //         address: "123 Main St, Colombo",
// //         telephone: "0771234567",
// //       },
// //       {
// //         order_id: "515161",
// //         customer_id: "2152151512",
// //         value: "Rs.2557",
// //         delivery_method: "Deliver",
// //         time: "21/12/22",
// //         status: "Confirmed",
// //         customer_name: "Jane Smith",
// //         address: "456 Park Ave, Kandy",
// //         telephone: "0777654321",
// //       },
// //       {
// //         order_id: "52562",
// //         customer_id: "15155",
// //         value: "Rs.4075",
// //         delivery_method: "Order Pickup",
// //         time: "5/12/22",
// //         status: "Out for delivery",
// //         customer_name: "Sam Wilson",
// //         address: "789 Beach Rd, Galle",
// //         telephone: "0761237890",
// //       },
// //     ];
// //     setOrders(mockOrders);
// //   };

// //   const handleViewDetails = async (order) => {
// //     setCurrentOrder(order);
// //     setDetailsModalVisible(true);

// //     try {
// //       const token = localStorage.getItem("token");

// //       const response = await axios.get(
// //         `/api/staff-orders/orders/${order.order_id}/products`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         setCurrentOrderProducts(response.data.products);
// //       } else {
// //         setMockOrderProducts();
// //       }
// //     } catch (error) {
// //       console.error("Error fetching order products:", error);
// //       setMockOrderProducts();
// //     }
// //   };

// //   const setMockOrderProducts = () => {
// //     const mockProducts = [
// //       {
// //         id: "P001",
// //         name: "Paracetamol 500mg",
// //         quantity: 3,
// //         price: 45,
// //         total: 135,
// //         expiry_date: "2025-06-30",
// //       },
// //       {
// //         id: "P002",
// //         name: "Vitamin C 1000mg",
// //         quantity: 2,
// //         price: 120,
// //         total: 240,
// //         expiry_date: "2025-05-15",
// //       },
// //       {
// //         id: "P003",
// //         name: "Ibuprofen 400mg",
// //         quantity: 1,
// //         price: 65,
// //         total: 65,
// //         expiry_date: "2024-12-20",
// //       },
// //     ];
// //     setCurrentOrderProducts(mockProducts);
// //   };

// //   const handleStatusChange = async (orderId, newStatus) => {
// //     try {
// //       setStatusUpdateLoading(true);
// //       const token = localStorage.getItem("token");

// //       // Check if status requires inventory reduction
// //       const reduceInventory =
// //         newStatus === "Delivered" || newStatus === "Ready for pickup";

// //       const response = await axios.put(
// //         `/api/staff-orders/orders/${orderId}/status`,
// //         {
// //           status: newStatus,
// //           reduceInventory,
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         message.success(`Order status updated to ${newStatus}`);

// //         // Update local state instead of refetching
// //         setOrders((prevOrders) =>
// //           prevOrders.map((order) =>
// //             order.order_id === orderId ? { ...order, status: newStatus } : order
// //           )
// //         );

// //         // If current order modal is open, update its status too
// //         if (currentOrder && currentOrder.order_id === orderId) {
// //           setCurrentOrder((prev) => ({ ...prev, status: newStatus }));
// //         }

// //         // Show notification message about customer notification
// //         message.info("A notification has been sent to the customer");

// //         // If inventory was reduced, show additional notification
// //         if (reduceInventory && response.data.inventoryReduced) {
// //           message.info("Product quantities have been reduced from inventory");
// //         }
// //       } else {
// //         message.error(response.data.message || "Failed to update status");
// //       }
// //     } catch (error) {
// //       console.error("Error updating order status:", error);
// //       message.error(
// //         "Failed to update status: " +
// //           (error.response?.data?.message || error.message)
// //       );
// //     } finally {
// //       setStatusUpdateLoading(false);
// //     }
// //   };

// //   const statusColors = {
// //     Pending: "gold",
// //     Confirmed: "blue",
// //     Processing: "purple",
// //     "Out for delivery": "cyan",
// //     "Ready for pickup": "green",
// //     Delivered: "green",
// //     Delayed: "orange",
// //     Cancelled: "red",
// //   };

// //   const statusOptions = [
// //     {
// //       value: "Delivered",
// //       label: "Delivered",
// //       icon: <Truck className="h-4 w-4 mr-1" />,
// //     },
// //     {
// //       value: "Ready for pickup",
// //       label: "Ready for pickup",
// //       icon: <ShoppingBag className="h-4 w-4 mr-1" />,
// //     },
// //   ];

// //   const handleSearch = (value) => {
// //     setSearchText(value);
// //   };

// //   const handleFilter = (value) => {
// //     setFilteredStatus(value);
// //   };

// //   const clearFilters = () => {
// //     setSearchText("");
// //     setFilteredStatus(null);
// //   };

// //   const filteredOrders = orders.filter((order) => {
// //     // Filter by search text
// //     const matchesSearch =
// //       !searchText.trim() ||
// //       order.order_id.toString().includes(searchText) ||
// //       order.customer_id.toString().includes(searchText);

// //     // Filter by status
// //     const matchesStatus = !filteredStatus || order.status === filteredStatus;

// //     return matchesSearch && matchesStatus;
// //   });

// //   const columns = [
// //     {
// //       title: "Order ID",
// //       dataIndex: "order_id",
// //       key: "order_id",
// //       render: (text) => <span className="font-medium">{text}</span>,
// //     },
// //     {
// //       title: "Customer ID",
// //       dataIndex: "customer_id",
// //       key: "customer_id",
// //     },
// //     {
// //       title: "Value",
// //       dataIndex: "value",
// //       key: "value",
// //     },
// //     {
// //       title: "Delivery Method",
// //       dataIndex: "delivery_method",
// //       key: "delivery_method",
// //     },
// //     {
// //       title: "Time",
// //       dataIndex: "time",
// //       key: "time",
// //     },
// //     {
// //       title: "Status",
// //       dataIndex: "status",
// //       key: "status",
// //       render: (status) => (
// //         <Tag color={statusColors[status] || "default"}>{status}</Tag>
// //       ),
// //     },
// //     {
// //       title: "Actions",
// //       key: "actions",
// //       render: (_, record) => (
// //         <Button
// //           type="primary"
// //           size="small"
// //           icon={<Eye className="h-4 w-4 mr-1" />}
// //           onClick={() => handleViewDetails(record)}
// //           className="bg-blue-500 hover:bg-blue-600"
// //         >
// //           View Details
// //         </Button>
// //       ),
// //     },
// //   ];

// //   return (
// //     <div className="p-6">
// //       <Card>
// //         <div className="flex justify-between items-center mb-6">
// //           <Title level={4}>Sales Management</Title>
// //           <Button
// //             type="primary"
// //             icon={<RotateCcw className="h-4 w-4" />}
// //             onClick={fetchOrders}
// //             className="bg-blue-500 hover:bg-blue-600"
// //           >
// //             Refresh
// //           </Button>
// //         </div>

// //         {/* Search and filter controls */}
// //         <div className="mb-6 flex flex-wrap gap-4">
// //           <Input
// //             placeholder="Search by Order ID "
// //             value={searchText}
// //             onChange={(e) => handleSearch(e.target.value)}
// //             prefix={<Search className="text-gray-400 h-4 w-4" />}
// //             style={{ width: 320 }}
// //             allowClear
// //           />

// //           <Select
// //             placeholder="Filter by Status"
// //             style={{ width: 200 }}
// //             value={filteredStatus}
// //             onChange={handleFilter}
// //             allowClear
// //           >
// //             <Option value="Pending">Pending</Option>
// //             <Option value="Confirmed">Confirmed</Option>
// //             <Option value="Processing">Processing</Option>
// //             <Option value="Out for delivery">Out for delivery</Option>
// //             <Option value="Ready for pickup">Ready for pickup</Option>
// //             <Option value="Delivered">Delivered</Option>
// //             <Option value="Delayed">Delayed</Option>
// //             <Option value="Cancelled">Cancelled</Option>
// //           </Select>

// //           {(searchText || filteredStatus) && (
// //             <Button
// //               onClick={clearFilters}
// //               icon={<Filter className="h-4 w-4" />}
// //             >
// //               Clear Filters
// //             </Button>
// //           )}
// //         </div>

// //         <Table
// //           columns={columns}
// //           dataSource={filteredOrders}
// //           rowKey="order_id"
// //           loading={loading}
// //           pagination={{ pageSize: 10 }}
// //           scroll={{ x: "max-content" }}
// //         />
// //       </Card>

// //       {/* Order Details Modal */}
// //       <Modal
// //         title="Order Details"
// //         open={detailsModalVisible}
// //         onCancel={() => setDetailsModalVisible(false)}
// //         width={800}
// //         footer={[
// //           <Button key="back" onClick={() => setDetailsModalVisible(false)}>
// //             Close
// //           </Button>,
// //         ]}
// //       >
// //         {currentOrder && (
// //           <div className="p-4">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div>
// //                 <Card title="Order Information" className="mb-6">
// //                   <div className="space-y-3">
// //                     <div className="flex justify-between">
// //                       <Text strong>Order ID:</Text>
// //                       <Text>{currentOrder.order_id}</Text>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <Text strong>Customer ID:</Text>
// //                       <Text>{currentOrder.customer_id}</Text>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <Text strong>Customer Name:</Text>
// //                       <Text>{currentOrder.customer_name}</Text>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <Text strong>Address:</Text>
// //                       <Text>{currentOrder.address}</Text>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <Text strong>Telephone:</Text>
// //                       <Text>{currentOrder.telephone}</Text>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <Text strong>Value:</Text>
// //                       <Text>{currentOrder.value}</Text>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <Text strong>Delivery Method:</Text>
// //                       <Text>{currentOrder.delivery_method}</Text>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <Text strong>Order Date:</Text>
// //                       <Text>{currentOrder.time}</Text>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <Text strong>Status:</Text>
// //                       <Tag
// //                         color={statusColors[currentOrder.status] || "default"}
// //                       >
// //                         {currentOrder.status}
// //                       </Tag>
// //                     </div>
// //                   </div>
// //                 </Card>

// //                 <Card title="Update Status" className="mb-6">
// //                   <div className="space-y-4">
// //                     <Text>Change the status of this order:</Text>
// //                     {statusOptions.map((option) => (
// //                       <Popconfirm
// //                         key={option.value}
// //                         title="Update Order Status"
// //                         description={`Are you sure you want to change the status to ${option.label}? This will send a notification to the customer and reduce inventory.`}
// //                         onConfirm={() =>
// //                           handleStatusChange(
// //                             currentOrder.order_id,
// //                             option.value
// //                           )
// //                         }
// //                         okText="Yes"
// //                         cancelText="No"
// //                       >
// //                         <Button
// //                           type="primary"
// //                           icon={option.icon}
// //                           loading={statusUpdateLoading}
// //                           className="w-full mb-2 bg-blue-500 hover:bg-blue-600"
// //                         >
// //                           {option.label}
// //                         </Button>
// //                       </Popconfirm>
// //                     ))}

// //                     <div className="p-3 bg-blue-50 rounded text-sm">
// //                       <Text type="secondary">
// //                         Note: Setting the status to "Delivered" or "Ready for
// //                         pickup" will reduce product quantities from inventory
// //                         and send a notification to the customer.
// //                       </Text>
// //                     </div>
// //                   </div>
// //                 </Card>
// //               </div>

// //               <div>
// //                 <Card title="Order Products" className="h-full">
// //                   {!currentOrderProducts.length ? (
// //                     <div className="flex justify-center items-center py-12">
// //                       <Spin size="large" />
// //                     </div>
// //                   ) : (
// //                     <div className="space-y-4">
// //                       {currentOrderProducts.map((product, index) => (
// //                         <div
// //                           key={index}
// //                           className="border-b pb-3 last:border-b-0"
// //                         >
// //                           <div className="flex justify-between">
// //                             <Text strong>{product.name}</Text>
// //                             <Text>Rs.{product.total}</Text>
// //                           </div>
// //                           <div className="flex justify-between text-sm text-gray-500 mt-1">
// //                             {/* <Text>Expires: {product.expiry_date}</Text> */}
// //                             <Text>
// //                               Qty: {product.quantity} x Rs.{product.price}
// //                             </Text>
// //                           </div>
// //                         </div>
// //                       ))}

// //                       <Divider />

// //                       <div className="flex justify-between font-bold">
// //                         <Text>Total:</Text>
// //                         <Text>{currentOrder.value}</Text>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </Card>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default SalesManagement;

// /////////////////working////////////////////////

// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Tag,
//   Select,
//   Typography,
//   Card,
//   Space,
//   Input,
//   message,
//   Spin,
//   Divider,
//   Popconfirm,
// } from "antd";
// import {
//   Eye,
//   RotateCcw,
//   Truck,
//   ShoppingBag,
//   Search,
//   Filter,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import axios from "axios";

// const { Title, Text } = Typography;
// const { Option } = Select;

// const SalesManagement = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [detailsModalVisible, setDetailsModalVisible] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null);
//   const [currentOrderProducts, setCurrentOrderProducts] = useState([]);
//   const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [filteredStatus, setFilteredStatus] = useState(null);
//   const [cancelLoading, setCancelLoading] = useState(false);
//   const [completeLoading, setCompleteLoading] = useState(false);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get("/api/staff-orders/orders", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         setOrders(response.data.orders);
//       } else {
//         console.error("API returned success: false", response.data);
//         message.error(
//           "Failed to fetch orders: " +
//             (response.data.message || "Unknown error")
//         );
//         loadMockData();
//       }
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       message.error("Error loading orders");
//       loadMockData();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMockData = () => {
//     const mockOrders = [
//       {
//         order_id: "12152",
//         customer_id: "2216263",
//         value: "Rs.4306",
//         delivery_method: "Order Pickup",
//         time: "11/12/22",
//         status: "Delayed",
//         customer_name: "John Doe",
//         address: "123 Main St, Colombo",
//         telephone: "0771234567",
//       },
//       {
//         order_id: "515161",
//         customer_id: "2152151512",
//         value: "Rs.2557",
//         delivery_method: "Deliver",
//         time: "21/12/22",
//         status: "Confirmed",
//         customer_name: "Jane Smith",
//         address: "456 Park Ave, Kandy",
//         telephone: "0777654321",
//       },
//       {
//         order_id: "52562",
//         customer_id: "15155",
//         value: "Rs.4075",
//         delivery_method: "Order Pickup",
//         time: "5/12/22",
//         status: "Out for delivery",
//         customer_name: "Sam Wilson",
//         address: "789 Beach Rd, Galle",
//         telephone: "0761237890",
//       },
//     ];
//     setOrders(mockOrders);
//   };

//   const handleViewDetails = async (order) => {
//     setCurrentOrder(order);
//     setDetailsModalVisible(true);

//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         `/api/staff-orders/orders/${order.order_id}/products`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         setCurrentOrderProducts(response.data.products);
//       } else {
//         setMockOrderProducts();
//       }
//     } catch (error) {
//       console.error("Error fetching order products:", error);
//       setMockOrderProducts();
//     }
//   };

//   const setMockOrderProducts = () => {
//     const mockProducts = [
//       {
//         id: "P001",
//         name: "Paracetamol 500mg",
//         quantity: 3,
//         price: 45,
//         total: 135,
//         expiry_date: "2025-06-30",
//       },
//       {
//         id: "P002",
//         name: "Vitamin C 1000mg",
//         quantity: 2,
//         price: 120,
//         total: 240,
//         expiry_date: "2025-05-15",
//       },
//       {
//         id: "P003",
//         name: "Ibuprofen 400mg",
//         quantity: 1,
//         price: 65,
//         total: 65,
//         expiry_date: "2024-12-20",
//       },
//     ];
//     setCurrentOrderProducts(mockProducts);
//   };

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       setStatusUpdateLoading(true);
//       const token = localStorage.getItem("token");

//       // Check if status requires inventory reduction
//       // We're removing this condition as inventory reduction will be handled separately
//       const reduceInventory = false;

//       const response = await axios.put(
//         `/api/staff-orders/orders/${orderId}/status`,
//         {
//           status: newStatus,
//           reduceInventory,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         message.success(`Order status updated to ${newStatus}`);

//         // Update local state instead of refetching
//         setOrders((prevOrders) =>
//           prevOrders.map((order) =>
//             order.order_id === orderId ? { ...order, status: newStatus } : order
//           )
//         );

//         // If current order modal is open, update its status too
//         if (currentOrder && currentOrder.order_id === orderId) {
//           setCurrentOrder((prev) => ({ ...prev, status: newStatus }));
//         }

//         // Show notification message about customer notification
//         message.info("A notification has been sent to the customer");
//       } else {
//         message.error(response.data.message || "Failed to update status");
//       }
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       message.error(
//         "Failed to update status: " +
//           (error.response?.data?.message || error.message)
//       );
//     } finally {
//       setStatusUpdateLoading(false);
//     }
//   };

//   // New function to handle order completion
//   const handleOrderComplete = async (orderId) => {
//     try {
//       setCompleteLoading(true);
//       const token = localStorage.getItem("token");

//       // First, update the status to "Confirmed"
//       const statusResponse = await axios.put(
//         `/api/staff-orders/orders/${orderId}/status`,
//         {
//           status: "Confirmed",
//           reduceInventory: true, // Set to true to reduce inventory
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (statusResponse.data.success) {
//         // Update the local state
//         setOrders((prevOrders) =>
//           prevOrders.map((order) =>
//             order.order_id === orderId
//               ? { ...order, status: "Confirmed" }
//               : order
//           )
//         );

//         // If current order modal is open, update its status too
//         if (currentOrder && currentOrder.order_id === orderId) {
//           setCurrentOrder((prev) => ({ ...prev, status: "Confirmed" }));
//         }

//         message.success("Order marked as completed and confirmed");
//         message.info("Product quantities have been reduced from inventory");
//         message.info("A notification has been sent to the customer");
//       } else {
//         throw new Error(
//           statusResponse.data.message || "Failed to complete order"
//         );
//       }
//     } catch (error) {
//       console.error("Error completing order:", error);
//       message.error(
//         "Failed to complete order: " +
//           (error.response?.data?.message || error.message)
//       );
//     } finally {
//       setCompleteLoading(false);
//     }
//   };

//   // New function to handle order cancellation
//   const handleOrderCancel = async (orderId) => {
//     try {
//       setCancelLoading(true);
//       const token = localStorage.getItem("token");

//       // First update the order status to "Cancelled"
//       const statusResponse = await axios.put(
//         `/api/staff-orders/orders/${orderId}/status`,
//         {
//           status: "Cancelled",
//           reduceInventory: false,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (statusResponse.data.success) {
//         // Then attempt to delete the payment record
//         try {
//           const paymentResponse = await axios.delete(
//             `/api/staff-orders/payments/${orderId}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           if (paymentResponse.data.success) {
//             message.success("Payment record has been deleted");
//           }
//         } catch (paymentError) {
//           console.error("Error deleting payment record:", paymentError);
//           message.warning(
//             "Could not delete payment record, but order was cancelled"
//           );
//         }

//         // Update the local state
//         setOrders((prevOrders) =>
//           prevOrders.map((order) =>
//             order.order_id === orderId
//               ? { ...order, status: "Cancelled" }
//               : order
//           )
//         );

//         // If current order modal is open, update its status too
//         if (currentOrder && currentOrder.order_id === orderId) {
//           setCurrentOrder((prev) => ({ ...prev, status: "Cancelled" }));
//         }

//         message.success("Order has been cancelled");
//         message.info("A notification has been sent to the customer");
//       } else {
//         throw new Error(
//           statusResponse.data.message || "Failed to cancel order"
//         );
//       }
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//       message.error(
//         "Failed to cancel order: " +
//           (error.response?.data?.message || error.message)
//       );
//     } finally {
//       setCancelLoading(false);
//     }
//   };

//   const statusColors = {
//     Pending: "gold",
//     Confirmed: "blue",
//     Processing: "purple",
//     "Out for delivery": "cyan",
//     "Ready for pickup": "green",
//     Delivered: "green",
//     Delayed: "orange",
//     Cancelled: "red",
//   };

//   const statusOptions = [
//     {
//       value: "Delivered",
//       label: "Delivered",
//       icon: <Truck className="h-4 w-4 mr-1" />,
//     },
//     {
//       value: "Ready for pickup",
//       label: "Ready for pickup",
//       icon: <ShoppingBag className="h-4 w-4 mr-1" />,
//     },
//   ];

//   const handleSearch = (value) => {
//     setSearchText(value);
//   };

//   const handleFilter = (value) => {
//     setFilteredStatus(value);
//   };

//   const clearFilters = () => {
//     setSearchText("");
//     setFilteredStatus(null);
//   };

//   const filteredOrders = orders.filter((order) => {
//     // Filter by search text
//     const matchesSearch =
//       !searchText.trim() ||
//       order.order_id.toString().includes(searchText) ||
//       order.customer_id.toString().includes(searchText);

//     // Filter by status
//     const matchesStatus = !filteredStatus || order.status === filteredStatus;

//     return matchesSearch && matchesStatus;
//   });

//   const columns = [
//     {
//       title: "Order ID",
//       dataIndex: "order_id",
//       key: "order_id",
//       render: (text) => <span className="font-medium">{text}</span>,
//     },
//     {
//       title: "Customer ID",
//       dataIndex: "customer_id",
//       key: "customer_id",
//     },
//     {
//       title: "Value",
//       dataIndex: "value",
//       key: "value",
//     },
//     {
//       title: "Delivery Method",
//       dataIndex: "delivery_method",
//       key: "delivery_method",
//     },
//     {
//       title: "Time",
//       dataIndex: "time",
//       key: "time",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <Tag color={statusColors[status] || "default"}>{status}</Tag>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           <Button
//             type="primary"
//             size="small"
//             icon={<Eye className="h-4 w-4 mr-1" />}
//             onClick={() => handleViewDetails(record)}
//             className="bg-blue-500 hover:bg-blue-600"
//           >
//             View
//           </Button>

//           {/* Only show Done button if status is not Confirmed or Cancelled */}
//           {record.status !== "Confirmed" && record.status !== "Cancelled" && (
//             <Popconfirm
//               title="Complete Order"
//               description="Are you sure you want to mark this order as completed? This will confirm the order and reduce inventory."
//               onConfirm={() => handleOrderComplete(record.order_id)}
//               okText="Yes"
//               cancelText="No"
//             >
//               <Button
//                 type="primary"
//                 size="small"
//                 icon={<CheckCircle className="h-4 w-4 mr-1" />}
//                 loading={completeLoading}
//                 className="bg-green-500 hover:bg-green-600"
//               >
//                 Done
//               </Button>
//             </Popconfirm>
//           )}

//           {/* Only show Cancel button if status is not Cancelled */}
//           {record.status !== "Cancelled" && (
//             <Popconfirm
//               title="Cancel Order"
//               description="Are you sure you want to cancel this order? This will delete the payment record."
//               onConfirm={() => handleOrderCancel(record.order_id)}
//               okText="Yes"
//               cancelText="No"
//               okButtonProps={{ danger: true }}
//             >
//               <Button
//                 type="primary"
//                 size="small"
//                 danger
//                 icon={<XCircle className="h-4 w-4 mr-1" />}
//                 loading={cancelLoading}
//               >
//                 Cancel
//               </Button>
//             </Popconfirm>
//           )}
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <Card>
//         <div className="flex justify-between items-center mb-6">
//           <Title level={4}>Sales Management</Title>
//           <Button
//             type="primary"
//             icon={<RotateCcw className="h-4 w-4" />}
//             onClick={fetchOrders}
//             className="bg-blue-500 hover:bg-blue-600"
//           >
//             Refresh
//           </Button>
//         </div>

//         {/* Search and filter controls */}
//         <div className="mb-6 flex flex-wrap gap-4">
//           <Input
//             placeholder="Search by Order ID "
//             value={searchText}
//             onChange={(e) => handleSearch(e.target.value)}
//             prefix={<Search className="text-gray-400 h-4 w-4" />}
//             style={{ width: 320 }}
//             allowClear
//           />

//           <Select
//             placeholder="Filter by Status"
//             style={{ width: 200 }}
//             value={filteredStatus}
//             onChange={handleFilter}
//             allowClear
//           >
//             <Option value="Pending">Pending</Option>
//             <Option value="Confirmed">Confirmed</Option>
//             <Option value="Processing">Processing</Option>
//             <Option value="Out for delivery">Out for delivery</Option>
//             <Option value="Ready for pickup">Ready for pickup</Option>
//             <Option value="Delivered">Delivered</Option>
//             <Option value="Delayed">Delayed</Option>
//             <Option value="Cancelled">Cancelled</Option>
//           </Select>

//           {(searchText || filteredStatus) && (
//             <Button
//               onClick={clearFilters}
//               icon={<Filter className="h-4 w-4" />}
//             >
//               Clear Filters
//             </Button>
//           )}
//         </div>

//         <Table
//           columns={columns}
//           dataSource={filteredOrders}
//           rowKey="order_id"
//           loading={loading}
//           pagination={{ pageSize: 10 }}
//           scroll={{ x: "max-content" }}
//         />
//       </Card>

//       {/* Order Details Modal */}
//       <Modal
//         title="Order Details"
//         open={detailsModalVisible}
//         onCancel={() => setDetailsModalVisible(false)}
//         width={800}
//         footer={[
//           <Button key="back" onClick={() => setDetailsModalVisible(false)}>
//             Close
//           </Button>,
//         ]}
//       >
//         {currentOrder && (
//           <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <Card title="Order Information" className="mb-6">
//                   <div className="space-y-3">
//                     <div className="flex justify-between">
//                       <Text strong>Order ID:</Text>
//                       <Text>{currentOrder.order_id}</Text>
//                     </div>
//                     <div className="flex justify-between">
//                       <Text strong>Customer ID:</Text>
//                       <Text>{currentOrder.customer_id}</Text>
//                     </div>
//                     <div className="flex justify-between">
//                       <Text strong>Customer Name:</Text>
//                       <Text>{currentOrder.customer_name}</Text>
//                     </div>
//                     <div className="flex justify-between">
//                       <Text strong>Address:</Text>
//                       <Text>{currentOrder.address}</Text>
//                     </div>
//                     <div className="flex justify-between">
//                       <Text strong>Telephone:</Text>
//                       <Text>{currentOrder.telephone}</Text>
//                     </div>
//                     <div className="flex justify-between">
//                       <Text strong>Value:</Text>
//                       <Text>{currentOrder.value}</Text>
//                     </div>
//                     <div className="flex justify-between">
//                       <Text strong>Delivery Method:</Text>
//                       <Text>{currentOrder.delivery_method}</Text>
//                     </div>
//                     <div className="flex justify-between">
//                       <Text strong>Order Date:</Text>
//                       <Text>{currentOrder.time}</Text>
//                     </div>
//                     <div className="flex justify-between">
//                       <Text strong>Status:</Text>
//                       <Tag
//                         color={statusColors[currentOrder.status] || "default"}
//                       >
//                         {currentOrder.status}
//                       </Tag>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card title="Order Actions" className="mb-6">
//                   <div className="space-y-4">
//                     <Text>Manage this order:</Text>

//                     <div className="flex space-x-2">
//                       {/* Display regular status options */}
//                       {statusOptions.map((option) => (
//                         <Popconfirm
//                           key={option.value}
//                           title="Update Order Status"
//                           description={`Are you sure you want to change the status to ${option.label}? This will send a notification to the customer.`}
//                           onConfirm={() =>
//                             handleStatusChange(
//                               currentOrder.order_id,
//                               option.value
//                             )
//                           }
//                           okText="Yes"
//                           cancelText="No"
//                         >
//                           <Button
//                             type="primary"
//                             icon={option.icon}
//                             loading={statusUpdateLoading}
//                             className="bg-blue-500 hover:bg-blue-600"
//                           >
//                             {option.label}
//                           </Button>
//                         </Popconfirm>
//                       ))}
//                     </div>

//                     <Divider />

//                     <div className="flex space-x-2">
//                       {/* Only show Done button if order is not already confirmed or cancelled */}
//                       {currentOrder.status !== "Confirmed" &&
//                         currentOrder.status !== "Cancelled" && (
//                           <Popconfirm
//                             title="Complete Order"
//                             description="Are you sure you want to mark this order as completed? This will confirm the order and reduce inventory."
//                             onConfirm={() =>
//                               handleOrderComplete(currentOrder.order_id)
//                             }
//                             okText="Yes"
//                             cancelText="No"
//                           >
//                             <Button
//                               type="primary"
//                               icon={<CheckCircle className="h-4 w-4 mr-1" />}
//                               loading={completeLoading}
//                               className="bg-green-500 hover:bg-green-600"
//                             >
//                               Mark as Done
//                             </Button>
//                           </Popconfirm>
//                         )}

//                       {/* Only show Cancel button if order is not already cancelled */}
//                       {currentOrder.status !== "Cancelled" && (
//                         <Popconfirm
//                           title="Cancel Order"
//                           description="Are you sure you want to cancel this order? This will delete the payment record."
//                           onConfirm={() =>
//                             handleOrderCancel(currentOrder.order_id)
//                           }
//                           okText="Yes"
//                           cancelText="No"
//                           okButtonProps={{ danger: true }}
//                         >
//                           <Button
//                             type="primary"
//                             danger
//                             icon={<XCircle className="h-4 w-4 mr-1" />}
//                             loading={cancelLoading}
//                           >
//                             Cancel Order
//                           </Button>
//                         </Popconfirm>
//                       )}
//                     </div>

//                     <div className="p-3 bg-blue-50 rounded text-sm">
//                       <Text type="secondary">
//                         Note: Marking as "Done" will confirm the order, reduce
//                         inventory, and notify the customer. Cancelling will mark
//                         the order as cancelled and attempt to remove the payment
//                         record.
//                       </Text>
//                     </div>
//                   </div>
//                 </Card>
//               </div>

//               <div>
//                 <Card title="Order Products" className="h-full">
//                   {!currentOrderProducts.length ? (
//                     <div className="flex justify-center items-center py-12">
//                       <Spin size="large" />
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {currentOrderProducts.map((product, index) => (
//                         <div
//                           key={index}
//                           className="border-b pb-3 last:border-b-0"
//                         >
//                           <div className="flex justify-between">
//                             <Text strong>{product.name}</Text>
//                             <Text>Rs.{product.total}</Text>
//                           </div>
//                           <div className="flex justify-between text-sm text-gray-500 mt-1">
//                             <Text>
//                               Qty: {product.quantity} x Rs.{product.price}
//                             </Text>
//                             {product.expiry_date && (
//                               <Text>Expires: {product.expiry_date}</Text>
//                             )}
//                           </div>
//                         </div>
//                       ))}

//                       <Divider />

//                       <div className="flex justify-between font-bold">
//                         <Text>Total:</Text>
//                         <Text>{currentOrder.value}</Text>
//                       </div>
//                     </div>
//                   )}
//                 </Card>
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default SalesManagement;

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Tag,
  Select,
  Typography,
  Card,
  Space,
  Input,
  message,
  Spin,
  Divider,
  Popconfirm,
} from "antd";
import {
  Eye,
  RotateCcw,
  Truck,
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

const SalesManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentOrderProducts, setCurrentOrderProducts] = useState([]);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/staff-orders/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        console.error("API returned success: false", response.data);
        message.error(
          "Failed to fetch orders: " +
            (response.data.message || "Unknown error")
        );
        loadMockData();
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Error loading orders");
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mockOrders = [
      {
        order_id: "12152",
        customer_id: "2216263",
        value: "Rs.4306",
        delivery_method: "Order Pickup",
        time: "11/12/22",
        status: "Delayed",
        customer_name: "John Doe",
        address: "123 Main St, Colombo",
        telephone: "0771234567",
      },
      {
        order_id: "515161",
        customer_id: "2152151512",
        value: "Rs.2557",
        delivery_method: "Deliver",
        time: "21/12/22",
        status: "Confirmed",
        customer_name: "Jane Smith",
        address: "456 Park Ave, Kandy",
        telephone: "0777654321",
      },
      {
        order_id: "52562",
        customer_id: "15155",
        value: "Rs.4075",
        delivery_method: "Order Pickup",
        time: "5/12/22",
        status: "Out for delivery",
        customer_name: "Sam Wilson",
        address: "789 Beach Rd, Galle",
        telephone: "0761237890",
      },
    ];
    setOrders(mockOrders);
  };

  const handleViewDetails = async (order) => {
    setCurrentOrder(order);
    setDetailsModalVisible(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `/api/staff-orders/orders/${order.order_id}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCurrentOrderProducts(response.data.products);
      } else {
        setMockOrderProducts();
      }
    } catch (error) {
      console.error("Error fetching order products:", error);
      setMockOrderProducts();
    }
  };

  const setMockOrderProducts = () => {
    const mockProducts = [
      {
        id: "P001",
        name: "Paracetamol 500mg",
        quantity: 3,
        price: 45,
        total: 135,
        expiry_date: "2025-06-30",
      },
      {
        id: "P002",
        name: "Vitamin C 1000mg",
        quantity: 2,
        price: 120,
        total: 240,
        expiry_date: "2025-05-15",
      },
      {
        id: "P003",
        name: "Ibuprofen 400mg",
        quantity: 1,
        price: 65,
        total: 65,
        expiry_date: "2024-12-20",
      },
    ];
    setCurrentOrderProducts(mockProducts);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setStatusUpdateLoading(true);
      const token = localStorage.getItem("token");

      // Check if status requires inventory reduction
      // We're removing this condition as inventory reduction will be handled separately
      const reduceInventory = false;

      const response = await axios.put(
        `/api/staff-orders/orders/${orderId}/status`,
        {
          status: newStatus,
          reduceInventory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        message.success(`Order status updated to ${newStatus}`);

        // Update local state instead of refetching
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId ? { ...order, status: newStatus } : order
          )
        );

        // If current order modal is open, update its status too
        if (currentOrder && currentOrder.order_id === orderId) {
          setCurrentOrder((prev) => ({ ...prev, status: newStatus }));
        }

        // Show notification message about customer notification
        message.info("A notification has been sent to the customer");
      } else {
        message.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error(
        "Failed to update status: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // New function to handle order completion
  const handleOrderComplete = async (orderId) => {
    try {
      setCompleteLoading(true);
      const token = localStorage.getItem("token");

      // First, update the status to "Confirmed"
      const statusResponse = await axios.put(
        `/api/staff-orders/orders/${orderId}/status`,
        {
          status: "Confirmed",
          reduceInventory: true, // Set to true to reduce inventory
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (statusResponse.data.success) {
        // Update the local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId
              ? { ...order, status: "Confirmed" }
              : order
          )
        );

        // If current order modal is open, update its status too
        if (currentOrder && currentOrder.order_id === orderId) {
          setCurrentOrder((prev) => ({ ...prev, status: "Confirmed" }));
        }

        message.success("Order marked as completed and confirmed");
        message.info("Product quantities have been reduced from inventory");
        message.info("A notification has been sent to the customer");
      } else {
        throw new Error(
          statusResponse.data.message || "Failed to complete order"
        );
      }
    } catch (error) {
      console.error("Error completing order:", error);
      message.error(
        "Failed to complete order: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setCompleteLoading(false);
    }
  };

  // New function to handle order cancellation
  const handleOrderCancel = async (orderId) => {
    try {
      setCancelLoading(true);
      const token = localStorage.getItem("token");

      // First update the order status to "Cancelled"
      const statusResponse = await axios.put(
        `/api/staff-orders/orders/${orderId}/status`,
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

      if (statusResponse.data.success) {
        // Then attempt to delete the payment record
        try {
          const paymentResponse = await axios.delete(
            `/api/staff-orders/payments/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (paymentResponse.data.success) {
            message.success("Payment record has been deleted");
          }
        } catch (paymentError) {
          console.error("Error deleting payment record:", paymentError);
          message.warning(
            "Could not delete payment record, but order was cancelled"
          );
        }

        // Update the local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId
              ? { ...order, status: "Cancelled" }
              : order
          )
        );

        // If current order modal is open, update its status too
        if (currentOrder && currentOrder.order_id === orderId) {
          setCurrentOrder((prev) => ({ ...prev, status: "Cancelled" }));
        }

        message.success("Order has been cancelled");
        message.info("A notification has been sent to the customer");
      } else {
        throw new Error(
          statusResponse.data.message || "Failed to cancel order"
        );
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      message.error(
        "Failed to cancel order: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setCancelLoading(false);
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

  const statusOptions = [
    {
      value: "Delivered",
      label: "Delivered",
      icon: <Truck className="h-4 w-4 mr-1" />,
    },
    {
      value: "Ready for pickup",
      label: "Ready for pickup",
      icon: <ShoppingBag className="h-4 w-4 mr-1" />,
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

  const filteredOrders = orders.filter((order) => {
    // Filter by search text
    const matchesSearch =
      !searchText.trim() ||
      order.order_id.toString().includes(searchText) ||
      order.customer_id.toString().includes(searchText);

    // Filter by status
    const matchesStatus = !filteredStatus || order.status === filteredStatus;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Customer ID",
      dataIndex: "customer_id",
      key: "customer_id",
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
      title: "Time",
      dataIndex: "time",
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
    //   {
    //     title: "Actions",
    //     key: "actions",
    //     render: (_, record) => (
    //       <Space>
    //         <Button
    //           type="primary"
    //           size="small"
    //           icon={<Eye className="h-4 w-4 mr-1" />}
    //           onClick={() => handleViewDetails(record)}
    //           className="bg-blue-500 hover:bg-blue-600"
    //         >
    //           View
    //         </Button>

    //         {/* Only show Done button if status is not Confirmed or Cancelled */}
    //         {record.status !== "Confirmed" && record.status !== "Cancelled" && (
    //           <Popconfirm
    //             title="Complete Order"
    //             description="Are you sure you want to mark this order as completed? This will confirm the order and reduce inventory."
    //             onConfirm={() => handleOrderComplete(record.order_id)}
    //             okText="Yes"
    //             cancelText="No"
    //           >
    //             <Button
    //               type="primary"
    //               size="small"
    //               icon={<CheckCircle className="h-4 w-4 mr-1" />}
    //               loading={completeLoading}
    //               className="bg-green-500 hover:bg-green-600"
    //             >
    //               Done
    //             </Button>
    //           </Popconfirm>
    //         )}

    //         {/* Only show Cancel button if status is not Cancelled */}
    //         {record.status !== "Cancelled" && (
    //           <Popconfirm
    //             title="Cancel Order"
    //             description="Are you sure you want to cancel this order? This will delete the payment record."
    //             onConfirm={() => handleOrderCancel(record.order_id)}
    //             okText="Yes"
    //             cancelText="No"
    //             okButtonProps={{ danger: true }}
    //           >
    //             <Button
    //               type="primary"
    //               size="small"
    //               danger
    //               icon={<XCircle className="h-4 w-4 mr-1" />}
    //               loading={cancelLoading}
    //             >
    //               Cancel
    //             </Button>
    //           </Popconfirm>
    //         )}
    //       </Space>
    //     ),
    //   },
    // ];

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<Eye className="h-4 w-4 mr-1" />}
            onClick={() => handleViewDetails(record)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            View
          </Button>

          {/* Only show Done button if payment method is CashOnDelivery and status is not Confirmed or Cancelled */}
          {record.payment_method === "CashOnDelivery" &&
            record.status !== "Confirmed" &&
            record.status !== "Cancelled" && (
              <Popconfirm
                title="Complete Order"
                description="Are you sure you want to mark this order as completed? This will confirm the order and reduce inventory."
                onConfirm={() => handleOrderComplete(record.order_id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckCircle className="h-4 w-4 mr-1" />}
                  loading={completeLoading}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Done
                </Button>
              </Popconfirm>
            )}

          {/* Only show Cancel button if payment method is CashOnDelivery and status is not Cancelled */}
          {record.payment_method === "CashOnDelivery" &&
            record.status !== "Cancelled" && (
              <Popconfirm
                title="Cancel Order"
                description="Are you sure you want to cancel this order? This will delete the payment record."
                onConfirm={() => handleOrderCancel(record.order_id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="primary"
                  size="small"
                  danger
                  icon={<XCircle className="h-4 w-4 mr-1" />}
                  loading={cancelLoading}
                >
                  Cancel
                </Button>
              </Popconfirm>
            )}
        </Space>
      ),
    },
  ];
  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={4}>Sales Management</Title>
          <Button
            type="primary"
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={fetchOrders}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Refresh
          </Button>
        </div>

        {/* Search and filter controls */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Input
            placeholder="Search by Order ID "
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
            <Option value="Pending">Pending</Option>
            <Option value="Confirmed">Confirmed</Option>
            <Option value="Processing">Processing</Option>
            <Option value="Out for delivery">Out for delivery</Option>
            <Option value="Ready for pickup">Ready for pickup</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Delayed">Delayed</Option>
            <Option value="Cancelled">Cancelled</Option>
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
          dataSource={filteredOrders}
          rowKey="order_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Order Details Modal */}
      <Modal
        title="Order Details"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        width={800}
        footer={[
          <Button key="back" onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {currentOrder && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Card title="Order Information" className="mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Text strong>Order ID:</Text>
                      <Text>{currentOrder.order_id}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Customer ID:</Text>
                      <Text>{currentOrder.customer_id}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Customer Name:</Text>
                      <Text>{currentOrder.customer_name}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Address:</Text>
                      <Text>{currentOrder.address}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Telephone:</Text>
                      <Text>{currentOrder.telephone}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Value:</Text>
                      <Text>{currentOrder.value}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Delivery Method:</Text>
                      <Text>{currentOrder.delivery_method}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Order Date:</Text>
                      <Text>{currentOrder.time}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Status:</Text>
                      <Tag
                        color={statusColors[currentOrder.status] || "default"}
                      >
                        {currentOrder.status}
                      </Tag>
                    </div>
                  </div>
                </Card>

                <Card title="Order Actions" className="mb-6">
                  <div className="space-y-4">
                    <Text>Manage this order:</Text>

                    <div className="flex space-x-2">
                      {currentOrder.payment_method === "CashOnDelivery" &&
                        currentOrder.status !== "Confirmed" &&
                        currentOrder.status !== "Cancelled" && (
                          <Popconfirm
                            title="Complete Order"
                            description="Are you sure you want to mark this order as completed? This will confirm the order and reduce inventory."
                            onConfirm={() =>
                              handleOrderComplete(currentOrder.order_id)
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
                              Mark as Done
                            </Button>
                          </Popconfirm>
                        )}

                      {/* Only show Cancel button if payment method is "CashOnDelivery" and order is not already cancelled */}
                      {currentOrder.payment_method === "CashOnDelivery" &&
                        currentOrder.status !== "Cancelled" && (
                          <Popconfirm
                            title="Cancel Order"
                            description="Are you sure you want to cancel this order? This will delete the payment record."
                            onConfirm={() =>
                              handleOrderCancel(currentOrder.order_id)
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
                              Cancel Order
                            </Button>
                          </Popconfirm>
                        )}
                    </div>

                    <Divider />

                    <div className="flex space-x-2">
                      {/* Only show Done button if delivery method is "Order Pickup" and order is not already confirmed or cancelled */}
                      {currentOrder.delivery_method === "Order Pickup" &&
                        currentOrder.status !== "Confirmed" &&
                        currentOrder.status !== "Cancelled" && (
                          <Popconfirm
                            title="Complete Order"
                            description="Are you sure you want to mark this order as completed? This will confirm the order and reduce inventory."
                            onConfirm={() =>
                              handleOrderComplete(currentOrder.order_id)
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
                              Mark as Done
                            </Button>
                          </Popconfirm>
                        )}

                      {/* Only show Cancel button if delivery method is "Order Pickup" and order is not already cancelled */}
                      {currentOrder.delivery_method === "Order Pickup" &&
                        currentOrder.status !== "Cancelled" && (
                          <Popconfirm
                            title="Cancel Order"
                            description="Are you sure you want to cancel this order? This will delete the payment record."
                            onConfirm={() =>
                              handleOrderCancel(currentOrder.order_id)
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
                              Cancel Order
                            </Button>
                          </Popconfirm>
                        )}
                    </div>

                    <div className="p-3 bg-blue-50 rounded text-sm">
                      <Text type="secondary">
                        Note: For "Order Pickup" orders, you can use the "Mark
                        as Done" button to confirm the order, reduce inventory,
                        and notify the customer. The "Cancel" button will mark
                        the order as cancelled and attempt to remove the payment
                        record.
                      </Text>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <Card title="Order Products" className="h-full">
                  {!currentOrderProducts.length ? (
                    <div className="flex justify-center items-center py-12">
                      <Spin size="large" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentOrderProducts.map((product, index) => (
                        <div
                          key={index}
                          className="border-b pb-3 last:border-b-0"
                        >
                          <div className="flex justify-between">
                            <Text strong>{product.name}</Text>
                            <Text>Rs.{product.total}</Text>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <Text>
                              Qty: {product.quantity} x Rs.{product.price}
                            </Text>
                            {product.expiry_date && (
                              <Text>Expires: {product.expiry_date}</Text>
                            )}
                          </div>
                        </div>
                      ))}

                      <Divider />

                      <div className="flex justify-between font-bold">
                        <Text>Total:</Text>
                        <Text>{currentOrder.value}</Text>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SalesManagement;
