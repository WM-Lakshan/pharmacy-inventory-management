// // import React, { useState, useEffect } from "react";
// // import { Button, Modal, Input, DatePicker, message, Spin, Tooltip } from "antd";
// // import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// // import axios from "axios";
// // import moment from "moment";
// // import { useNavigate } from "react-router-dom";

// // const SupplierOrders = () => {
// //   // State management
// //   const [orders, setOrders] = useState([]);
// //   const [viewMode, setViewMode] = useState("list"); // list, view, edit, add
// //   const [selectedOrder, setSelectedOrder] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [loadingProducts, setLoadingProducts] = useState(false);
// //   const [editingProductIndex, setEditingProductIndex] = useState(null);
// //   const [isAddProductModalVisible, setIsAddProductModalVisible] =
// //     useState(false);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [productSearchResults, setProductSearchResults] = useState([]);
// //   const [products, setProducts] = useState([]);
// //   const [newProduct, setNewProduct] = useState({
// //     product_id: "",
// //     product_name: "",
// //     quantity: "",
// //     buying_price: "",
// //     value: 0,
// //   });

// //   const navigate = useNavigate();

// //   // Fetch orders data
// //   useEffect(() => {
// //     fetchOrders();
// //     fetchProducts();
// //   }, []);

// //   const fetchOrders = async () => {
// //     setLoading(true);
// //     try {
// //       const token = localStorage.getItem("token");

// //       if (!token) {
// //         // Redirect to login if no token is available
// //         navigate("/login");
// //         return;
// //       }

// //       const response = await axios.get("/api/supplier-orders", {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       // Ensure response.data is an array or extract the correct property
// //       if (response.data.success && Array.isArray(response.data.orders)) {
// //         setOrders(response.data.orders);
// //       } else if (Array.isArray(response.data)) {
// //         setOrders(response.data);
// //       } else {
// //         console.warn("Unexpected response format:", response.data);
// //         setOrders(mockOrdersData); // Fallback to mock data
// //       }
// //     } catch (error) {
// //       console.error("Error fetching orders:", error);

// //       // Handle unauthorized error
// //       if (error.response?.status === 401) {
// //         message.error("Session expired. Please log in again.");
// //         navigate("/login");
// //         return;
// //       }

// //       message.error("Failed to load orders data");
// //       setOrders(mockOrdersData); // Fallback to mock data
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchOrderDetails = async (orderId) => {
// //     setLoadingProducts(true);
// //     try {
// //       const response = await axios.get(`/api/supplier-orders/${orderId}`, {
// //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
// //       });

// //       console.log("API Response:", response.data); // Debug log

// //       setSelectedOrder({
// //         ...response.data.order,
// //         // Ensure products array exists
// //         products: response.data.order.products || [],
// //       });
// //     } catch (error) {
// //       console.error("Error fetching order:", error);
// //       message.error("Failed to load order details");
// //     } finally {
// //       setLoadingProducts(false);
// //     }
// //   };

// //   const fetchProducts = async () => {
// //     try {
// //       const token = localStorage.getItem("token");

// //       if (!token) {
// //         navigate("/login");
// //         return;
// //       }

// //       const response = await axios.get("/api/supplier-orders/products", {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       if (response.data.success && Array.isArray(response.data.products)) {
// //         setProducts(response.data.products);
// //       } else if (Array.isArray(response.data)) {
// //         setProducts(response.data);
// //       } else {
// //         console.warn("Unexpected products response format:", response.data);
// //         setProducts(mockProductsData); // Fallback to mock data
// //       }
// //     } catch (error) {
// //       console.error("Error fetching products:", error);

// //       // Handle unauthorized error
// //       if (error.response?.status === 401) {
// //         message.error("Session expired. Please log in again.");
// //         navigate("/login");
// //         return;
// //       }

// //       // Use mock data for development
// //       setProducts(mockProductsData);
// //     }
// //   };

// //   // Handle view order details
// //   const handleViewOrder = async (order) => {
// //     try {
// //       setLoadingProducts(true);
// //       const response = await axios.get(
// //         `/api/supplier-orders/${order.order_id}`,
// //         {
// //           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
// //         }
// //       );

// //       setSelectedOrder({
// //         ...response.data.order,
// //         products: response.data.order.products || [],
// //       });
// //       setViewMode("view");
// //     } catch (error) {
// //       console.error("Error fetching order details:", error);
// //       message.error("Failed to load order details");
// //     } finally {
// //       setLoadingProducts(false);
// //     }
// //   };
// //   // Handle edit button click
// //   const handleEditOrder = () => {
// //     setViewMode("edit");
// //   };

// //   // Handle add new order
// //   const handleAddOrder = () => {
// //     const newOrder = {
// //       order_id: Math.floor(100000 + Math.random() * 900000).toString(), // Generate a random order ID
// //       supplier_id: "",
// //       manager_id: "", // Default manager ID
// //       expected_date: "",
// //       products: [],
// //       total_value: 0,
// //     };
// //     setSelectedOrder(newOrder);
// //     setViewMode("add");
// //   };

// //   // Handle delete order
// //   const handleDeleteOrder = async (orderId) => {
// //     try {
// //       const token = localStorage.getItem("token");

// //       if (!token) {
// //         navigate("/login");
// //         return;
// //       }

// //       await axios.delete(`/api/supplier-orders/${orderId}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       message.success("Order deleted successfully");
// //       fetchOrders();
// //       setViewMode("list");
// //     } catch (error) {
// //       console.error("Error deleting order:", error);

// //       // Handle unauthorized error
// //       if (error.response?.status === 401) {
// //         message.error("Session expired. Please log in again.");
// //         navigate("/login");
// //         return;
// //       }

// //       message.error("Failed to delete order");
// //     }
// //   };

// //   // Handle add product button
// //   const showAddProductModal = () => {
// //     setIsAddProductModalVisible(true);
// //     setSearchTerm("");
// //     setProductSearchResults([]);
// //     setNewProduct({
// //       product_id: "",
// //       product_name: "",
// //       quantity: "",
// //       buying_price: "",
// //       value: 0,
// //     });
// //   };

// //   // Handle product search
// //   const handleProductSearch = (value) => {
// //     setSearchTerm(value);
// //     if (value.trim() === "") {
// //       setProductSearchResults([]);
// //       return;
// //     }

// //     const results = products.filter((product) =>
// //       product.name.toLowerCase().includes(value.toLowerCase())
// //     );
// //     setProductSearchResults(results);
// //   };

// //   // Handle selecting a product from search results
// //   const handleSelectProduct = (product) => {
// //     setNewProduct({
// //       product_id: product.id,
// //       product_name: product.name,
// //       quantity: 1,
// //       buying_price: product.price,
// //       value: product.price, // Initial value
// //     });
// //     setProductSearchResults([]);
// //     setSearchTerm(product.name);
// //   };

// //   // Handle quantity change for new product
// //   const handleQuantityChange = (value) => {
// //     const quantity = parseInt(value) || 0;
// //     const price = parseFloat(newProduct.buying_price) || 0;
// //     setNewProduct({
// //       ...newProduct,
// //       quantity,
// //       value: quantity * price,
// //     });
// //   };

// //   // Handle price change for new product
// //   const handlePriceChange = (value) => {
// //     const price = parseFloat(value) || 0;
// //     const quantity = parseInt(newProduct.quantity) || 0;
// //     setNewProduct({
// //       ...newProduct,
// //       buying_price: value,
// //       value: quantity * price,
// //     });
// //   };

// //   // Add product to order
// //   // const handleAddProduct = () => {
// //   //   if (
// //   //     !newProduct.product_id ||
// //   //     !newProduct.quantity ||
// //   //     !newProduct.buying_price
// //   //   ) {
// //   //     message.error("Please select a product, specify quantity and price");
// //   //     return;
// //   //   }

// //   //   const updatedOrder = { ...selectedOrder };
// //   //   const existingIndex = newProduct.editIndex;

// //   //   // // Check if product already exists in the order
// //   //   // const existingProductIndex = updatedOrder.products.findIndex(
// //   //   //   (p) => p.product_id === newProduct.product_id
// //   //   // );

// //   //   // if (existingProductIndex >= 0) {
// //   //   //   // Update existing product
// //   //   //   updatedOrder.products[existingProductIndex] = {
// //   //   //     ...updatedOrder.products[existingProductIndex],
// //   //   //     quantity:
// //   //   //       parseInt(updatedOrder.products[existingProductIndex].quantity) +
// //   //   //       parseInt(newProduct.quantity),
// //   //   //     value:
// //   //   //       (parseInt(updatedOrder.products[existingProductIndex].quantity) +
// //   //   //         parseInt(newProduct.quantity)) *
// //   //   //       parseFloat(newProduct.buying_price),
// //   //   //   };
// //   //   // } else {
// //   //   //   // Add new product
// //   //   //   updatedOrder.products = [...updatedOrder.products, { ...newProduct }];
// //   //   // }
// //   //   if (existingIndex !== undefined) {
// //   //     // Editing existing product - replace at the same index
// //   //     updatedOrder.products[existingIndex] = {
// //   //       ...newProduct,
// //   //       value: newProduct.quantity * newProduct.buying_price,
// //   //     };
// //   //   } else {
// //   //     // Adding new product
// //   //     updatedOrder.products = [
// //   //       ...updatedOrder.products,
// //   //       {
// //   //         ...newProduct,
// //   //         value: newProduct.quantity * newProduct.buying_price,
// //   //       },
// //   //     ];
// //   //   }

// //   //   // Recalculate total order value
// //   //   updatedOrder.total_value = updatedOrder.products.reduce(
// //   //     (sum, product) => sum + product.value,
// //   //     0
// //   //   );

// //   //   setSelectedOrder(updatedOrder);
// //   //   setIsAddProductModalVisible(false);
// //   //   message.success(
// //   //     existingIndex !== undefined
// //   //       ? "Product updated successfully"
// //   //       : "Product added successfully"
// //   //   );
// //   //   // Recalculate total value
// //   //   updatedOrder.total_value = updatedOrder.products.reduce(
// //   //     (sum, product) => sum + parseFloat(product.value || 0),
// //   //     0
// //   //   );

// //   //   setSelectedOrder(updatedOrder);
// //   //   setIsAddProductModalVisible(false);
// //   //   message.success("Product added successfully");
// //   // };
// //   ////////uncomment this code to add product to order

// //   const handleAddProduct = () => {
// //     if (
// //       !newProduct.product_id ||
// //       !newProduct.quantity ||
// //       !newProduct.buying_price
// //     ) {
// //       message.error("Please complete all product fields");
// //       return;
// //     }

// //     const updatedOrder = { ...selectedOrder };
// //     const productValue = newProduct.quantity * newProduct.buying_price;

// //     if (editingProductIndex !== null) {
// //       // Update existing product
// //       updatedOrder.products[editingProductIndex] = {
// //         ...newProduct,
// //         value: productValue,
// //       };
// //     } else {
// //       // Add new product
// //       updatedOrder.products = [
// //         ...updatedOrder.products,
// //         {
// //           ...newProduct,
// //           value: productValue,
// //         },
// //       ];
// //     }

// //     // Recalculate total order value
// //     updatedOrder.total_value = updatedOrder.products.reduce(
// //       (sum, product) => sum + product.value,
// //       0
// //     );

// //     setSelectedOrder(updatedOrder);
// //     setIsAddProductModalVisible(false);
// //     setEditingProductIndex(null);
// //     setNewProduct({
// //       product_id: "",
// //       product_name: "",
// //       quantity: "",
// //       buying_price: "",
// //       value: 0,
// //     });
// //   };

// //   // Handle edit product in order
// //   // const handleEditProduct = (index) => {
// //   //   const productToEdit = selectedOrder.products[index];
// //   //   setNewProduct({
// //   //     ...productToEdit,
// //   //     editIndex: index,
// //   //   });
// //   //   setSearchTerm(productToEdit.product_name);
// //   //   setIsAddProductModalVisible(true);
// //   // };

// //   // const handleEditProduct = (index) => {
// //   //   const productToEdit = selectedOrder.products[index];
// //   //   setNewProduct({
// //   //     ...productToEdit,
// //   //     editIndex: index, // Mark this as an edit operation
// //   //     isEditing: true, // Additional flag for clarity
// //   //   });
// //   //   setSearchTerm(productToEdit.product_name);
// //   //   setIsAddProductModalVisible(true);
// //   // };

// //   const handleEditProduct = (index) => {
// //     const product = selectedOrder.products[index];
// //     setNewProduct({
// //       product_id: product.product_id,
// //       product_name: product.product_name,
// //       quantity: product.quantity,
// //       buying_price: product.buying_price,
// //       value: product.value,
// //     });
// //     setEditingProductIndex(index);
// //     setIsAddProductModalVisible(true);
// //   };

// //   // Handle delete product from order
// //   const handleDeleteProduct = (index) => {
// //     const updatedOrder = { ...selectedOrder };
// //     updatedOrder.products = updatedOrder.products.filter((_, i) => i !== index);

// //     // Recalculate total value
// //     updatedOrder.total_value = updatedOrder.products.reduce(
// //       (sum, product) => sum + parseFloat(product.value || 0),
// //       0
// //     );

// //     setSelectedOrder(updatedOrder);
// //   };

// //   // Save order
// //   const handleSaveOrder = async () => {
// //     if (!selectedOrder.supplier_id || !selectedOrder.expected_date) {
// //       message.error("Please fill in all required fields");
// //       return;
// //     }

// //     try {
// //       const token = localStorage.getItem("token");

// //       if (!token) {
// //         navigate("/login");
// //         return;
// //       }

// //       const orderToSave = {
// //         ...selectedOrder,
// //         expected_date: selectedOrder.expected_date.split("T")[0], // Extract date part
// //       };

// //       if (viewMode === "edit") {
// //         await axios.put(
// //           `/api/supplier-orders/${selectedOrder.order_id}`,
// //           selectedOrder,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }
// //         );
// //         message.success("Order updated successfully");
// //       } else {
// //         await axios.post("/api/supplier-orders", selectedOrder, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         message.success("Order added successfully");
// //       }
// //       fetchOrders();
// //       setViewMode("list");
// //     } catch (error) {
// //       console.error("Error saving order:", error);

// //       // Handle unauthorized error
// //       if (error.response?.status === 401) {
// //         message.error("Session expired. Please log in again.");
// //         navigate("/login");
// //         return;
// //       }

// //       message.error("Failed to save order");
// //     }
// //   };

// //   // Render order list table
// //   const renderOrdersTable = () => (
// //     <div className="bg-white p-6 rounded-lg shadow">
// //       <div className="flex justify-between mb-4 items-center">
// //         <h2 className="text-xl font-semibold">Orders</h2>
// //         <Button
// //           type="primary"
// //           icon={<PlusOutlined />}
// //           onClick={handleAddOrder}
// //           className="bg-blue-500"
// //         >
// //           Add Order
// //         </Button>
// //       </div>

// //       <div className="overflow-x-auto">
// //         <table className="min-w-full bg-white">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Order ID
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Order Value
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Manager ID
// //               </th>
// //               {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Supplier Name
// //               </th> */}
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Time
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Expected Delivery
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody className="divide-y divide-gray-200">
// //             {loading ? (
// //               <tr>
// //                 <td colSpan="6" className="text-center py-4">
// //                   <Spin />
// //                 </td>
// //               </tr>
// //             ) : orders.length === 0 ? (
// //               <tr>
// //                 <td colSpan="6" className="text-center py-4 text-gray-500">
// //                   No orders found
// //                 </td>
// //               </tr>
// //             ) : (
// //               Array.isArray(orders) &&
// //               orders.map((order) => (
// //                 <tr
// //                   key={order.order_id}
// //                   onClick={() => handleViewOrder(order)}
// //                   className="hover:bg-gray-50 cursor-pointer"
// //                 >
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     {order.order_id}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     Rs.{order.total_value}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     {order.manager_id}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     {order.supplier_id}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">{order.time}</td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     {order.expected_date}
// //                   </td>
// //                 </tr>
// //               ))
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );

// //   // Render order detail view
// //   const renderOrderDetail = () => {
// //     if (!selectedOrder) return null;

// //     return (
// //       <div className="bg-white p-6 rounded-lg shadow">
// //         <div className="flex justify-between mb-6">
// //           <h2 className="text-xl font-semibold">View Order</h2>
// //           <div className="flex gap-2">
// //             <Button
// //               icon={<EditOutlined />}
// //               onClick={handleEditOrder}
// //               className="flex items-center"
// //             >
// //               Edit
// //             </Button>
// //             <Button
// //               danger
// //               onClick={() => handleDeleteOrder(selectedOrder.order_id)}
// //               className="bg-red-500 text-white flex items-center"
// //             >
// //               Delete
// //             </Button>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-2 gap-6 mb-8">
// //           <div>
// //             <p className="text-gray-500 mb-1">Order ID</p>
// //             <p className="font-medium">{selectedOrder.order_id}</p>
// //           </div>
// //           <div>
// //             <p className="text-gray-500 mb-1">Supplier Id</p>
// //             <p className="font-medium">{selectedOrder.supplier_id}</p>
// //           </div>
// //           <div>
// //             <p className="text-gray-500 mb-1">Supplier Name</p>
// //             <p className="font-medium">{selectedOrder.supplier_id}</p>
// //           </div>
// //           <div>
// //             <p className="text-gray-500 mb-1">Manager ID</p>
// //             <p className="font-medium">{selectedOrder.manager_id}</p>
// //           </div>
// //           <div>
// //             <p className="text-gray-500 mb-1">Expected Date</p>
// //             <p className="font-medium">{selectedOrder.expected_date}</p>
// //           </div>
// //         </div>

// //         <h3 className="text-lg font-medium mb-4">Products</h3>
// //         <div className="overflow-x-auto">
// //           {selectedOrder.products && selectedOrder.products.length > 0 ? (
// //             <table className="min-w-full table-auto">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-4 py-2 text-left text-gray-500">
// //                     Product ID
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-gray-500">
// //                     Product Name
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-gray-500">
// //                     Quantity
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-gray-500">
// //                     Buying Price
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-gray-500">Value</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {selectedOrder.products?.map((product, index) => (
// //                   <tr key={index} className="border-b">
// //                     <td className="px-4 py-2">{product.product_id}</td>
// //                     <td className="px-4 py-2">{product.product_name}</td>
// //                     <td className="px-4 py-2">{product.quantity}</td>
// //                     <td className="px-4 py-2">Rs.{product.buying_price}</td>
// //                     <td className="px-4 py-2">Rs.{product.value}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           ) : (
// //             <p>No products in this order</p>
// //           )}
// //         </div>

// //         <div className="mt-6 text-right">
// //           <p className="text-lg font-medium">
// //             Total value: Rs.{selectedOrder.total_value || 0}
// //           </p>
// //         </div>

// //         <div className="mt-8 flex justify-end">
// //           <Button onClick={() => setViewMode("list")}>Back to List</Button>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Render edit order view
// //   const renderEditOrder = () => {
// //     if (!selectedOrder) return null;

// //     return (
// //       <div className="bg-white p-6 rounded-lg shadow">
// //         <h2 className="text-xl font-semibold mb-6">Add Order</h2>

// //         <div className="grid grid-cols-2 gap-6 mb-8">
// //           <div>
// //             <p className="text-gray-500 mb-1">Order ID</p>
// //             <Input value={selectedOrder.order_id} disabled />
// //           </div>
// //           <div>
// //             <p className="text-gray-500 mb-1">Supplier Name</p>
// //             <Input
// //               value={selectedOrder.supplier_id}
// //               onChange={(e) =>
// //                 setSelectedOrder({
// //                   ...selectedOrder,
// //                   supplier_id: e.target.value,
// //                 })
// //               }
// //               disabled={viewMode === "edit"}
// //             />
// //           </div>
// //           <div>
// //             <p className="text-gray-500 mb-1">Manager ID</p>
// //             <Input value={selectedOrder.manager_id} disabled />
// //           </div>
// //           <div>
// //             <p className="text-gray-500 mb-1">Expected Date</p>
// //             <DatePicker
// //               style={{ width: "100%" }}
// //               value={
// //                 selectedOrder.expected_date
// //                   ? moment(selectedOrder.expected_date.split("T")[0])
// //                   : null
// //               }
// //               onChange={(date, dateString) =>
// //                 setSelectedOrder({
// //                   ...selectedOrder,
// //                   expected_date: dateString,
// //                 })
// //               }
// //               format="YYYY-MM-DD"
// //             />
// //           </div>
// //         </div>

// //         <div className="flex justify-between items-center mb-4">
// //           <h3 className="text-lg font-medium">Products</h3>
// //           <Button
// //             type="primary"
// //             onClick={showAddProductModal}
// //             className="bg-blue-500"
// //           >
// //             Add Product
// //           </Button>
// //         </div>

// //         <div className="overflow-x-auto">
// //           {selectedOrder.products && selectedOrder.products.length > 0 ? (
// //             <table className="min-w-full table-auto">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-4 py-2 text-left text-gray-500">
// //                     Product ID
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-gray-500">
// //                     Product Name
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-gray-500">
// //                     Quantity
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-gray-500">
// //                     Buying Price
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-gray-500">Value</th>
// //                   <th className="px-4 py-2 text-left text-gray-500">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {selectedOrder.products?.map((product, index) => (
// //                   <tr
// //                     // delete product.product_id
// //                     key={`${product.product_id}-${index}`}
// //                     className="border-b"
// //                   >
// //                     <td className="px-4 py-2">{product.product_id}</td>
// //                     <td className="px-4 py-2">{product.product_name}</td>
// //                     <td className="px-4 py-2">{product.quantity}</td>
// //                     <td className="px-4 py-2">Rs.{product.buying_price}</td>
// //                     <td className="px-4 py-2">Rs.{product.value}</td>
// //                     <td className="px-4 py-2">
// //                       <div className="flex gap-2">
// //                         <Tooltip title="Edit">
// //                           <Button
// //                             size="small"
// //                             icon={<EditOutlined />}
// //                             onClick={() => handleEditProduct(index)}
// //                             className="flex items-center justify-center"
// //                           />
// //                         </Tooltip>
// //                         <Tooltip title="Delete">
// //                           <Button
// //                             size="small"
// //                             danger
// //                             icon={<DeleteOutlined />}
// //                             onClick={() => handleDeleteProduct(index)}
// //                             className="flex items-center justify-center bg-red-500 text-white"
// //                           />
// //                         </Tooltip>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           ) : (
// //             <p>No products in this order</p>
// //           )}
// //         </div>

// //         <div className="mt-6 text-right">
// //           <p className="text-lg font-medium">
// //             Total value: Rs.{selectedOrder.total_value || 0}
// //           </p>
// //         </div>

// //         <div className="mt-8 flex justify-end gap-2">
// //           <Button
// //             onClick={() =>
// //               viewMode === "edit" ? setViewMode("view") : setViewMode("list")
// //             }
// //           >
// //             Discard
// //           </Button>
// //           <Button
// //             type="primary"
// //             onClick={handleSaveOrder}
// //             className="bg-blue-500"
// //           >
// //             {viewMode === "edit" ? "Save" : "Add Order"}
// //           </Button>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Render add order view
// //   const renderAddOrder = () => {
// //     return renderEditOrder(); // Reuse edit view for add functionality
// //   };

// //   // Render add product modal
// //   const renderAddProductModal = () => (
// //     <Modal
// //       title="Add Product"
// //       open={isAddProductModalVisible}
// //       onCancel={() => setIsAddProductModalVisible(false)}
// //       footer={[
// //         <Button key="cancel" onClick={() => setIsAddProductModalVisible(false)}>
// //           Discard
// //         </Button>,
// //         <Button
// //           key="add"
// //           type="primary"
// //           onClick={handleAddProduct}
// //           className="bg-blue-500"
// //         >
// //           Add Product
// //         </Button>,
// //       ]}
// //     >
// //       <div className="space-y-4">
// //         <div>
// //           <p className="mb-1">Product Name</p>
// //           <Input
// //             placeholder="Enter product name"
// //             value={searchTerm}
// //             onChange={(e) => handleProductSearch(e.target.value)}
// //           />
// //           {productSearchResults.length > 0 && (
// //             <div className="mt-2 border rounded max-h-40 overflow-y-auto">
// //               {productSearchResults.map((product) => (
// //                 <div
// //                   key={product.id}
// //                   className="p-2 hover:bg-gray-100 cursor-pointer"
// //                   onClick={() => handleSelectProduct(product)}
// //                 >
// //                   {product.name}
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //           {newProduct.product_name && (
// //             <p className="mt-1 text-blue-500">
// //               Selected: {newProduct.product_name}
// //             </p>
// //           )}
// //         </div>

// //         <div>
// //           <p className="mb-1">Quantity</p>
// //           <Input
// //             type="number"
// //             placeholder="Enter product quantity"
// //             value={newProduct.quantity}
// //             onChange={(e) => handleQuantityChange(e.target.value)}
// //             min={1}
// //           />
// //         </div>

// //         <div>
// //           <p className="mb-1">Buying Price (Rs.)</p>
// //           <Input
// //             type="number"
// //             placeholder="Enter buying price"
// //             value={newProduct.buying_price}
// //             onChange={(e) => handlePriceChange(e.target.value)}
// //             min={0}
// //             step={0.01}
// //           />
// //         </div>

// //         {newProduct.buying_price && newProduct.quantity && (
// //           <div className="flex justify-end">
// //             <p>Total: Rs.{newProduct.value}</p>
// //           </div>
// //         )}
// //       </div>
// //     </Modal>
// //   );

// //   // Mock data for development
// //   const mockOrdersData = [
// //     {
// //       order_id: "456567",
// //       supplier_id: "456567",
// //       manager_id: "35",
// //       time: "11/12/22",
// //       expected_date: "12/12/2012",
// //       total_value: 15155,
// //       products: [
// //         {
// //           product_id: "12152",
// //           product_name: "aedcaeaed",
// //           quantity: 2216263,
// //           buying_price: 7535,
// //           value: 111222,
// //         },
// //         {
// //           product_id: "515161",
// //           product_name: "acacfadc",
// //           quantity: 2152151512,
// //           buying_price: 5724,
// //           value: 211222,
// //         },
// //         {
// //           product_id: "52562",
// //           product_name: "ascadCddc",
// //           quantity: 15155,
// //           buying_price: 2775,
// //           value: 51222,
// //         },
// //       ],
// //     },
// //     {
// //       order_id: "Bru",
// //       supplier_id: "5724",
// //       manager_id: "22 Packets",
// //       time: "21/12/22",
// //       expected_date: "21/12/22",
// //       total_value: 2557,
// //       products: [],
// //     },
// //     {
// //       order_id: "Red Bull",
// //       supplier_id: "2775",
// //       manager_id: "36 Packets",
// //       time: "5/12/22",
// //       expected_date: "5/12/22",
// //       total_value: 4075,
// //       products: [],
// //     },
// //   ];

// //   const mockProductsData = [
// //     { id: "12152", name: "aedcaeaed", price: 7535 },
// //     { id: "515161", name: "acacfadc", price: 5724 },
// //     { id: "52562", name: "ascadCddc", price: 2775 },
// //     { id: "12345", name: "Paracetamol", price: 500 },
// //     { id: "12346", name: "Amoxicillin", price: 1200 },
// //     { id: "12347", name: "Ibuprofen", price: 450 },
// //   ];

// //   // Main render
// //   return (
// //     <div className="p-6">
// //       {viewMode === "list" && renderOrdersTable()}
// //       {viewMode === "view" && renderOrderDetail()}
// //       {viewMode === "edit" && renderEditOrder()}
// //       {viewMode === "add" && renderAddOrder()}
// //       {renderAddProductModal()}
// //     </div>
// //   );
// // };

// // export default SupplierOrders;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { message } from "antd";
// import OrdersTable from "../components/OrdersTable";
// import OrderDetailView from "../components/OrderDetailView";
// import OrderEditForm from "../components/OrderEditForm.jsx";

// const SupplierOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [viewMode, setViewMode] = useState("list"); // list, view, edit, add
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();

//   // Fetch orders data
//   useEffect(() => {
//     fetchOrders();
//     fetchProducts();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const response = await axios.get("/api/supplier-orders", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success && Array.isArray(response.data.orders)) {
//         setOrders(response.data.orders);
//       } else if (Array.isArray(response.data)) {
//         setOrders(response.data);
//       } else {
//         console.warn("Unexpected response format:", response.data);
//         setOrders(mockOrdersData);
//       }
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       if (error.response?.status === 401) {
//         message.error("Session expired. Please log in again.");
//         navigate("/login");
//         return;
//       }
//       message.error("Failed to load orders data");
//       setOrders(mockOrdersData);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrderDetails = async (orderId) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`/api/supplier-orders/${orderId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setSelectedOrder({
//         ...response.data.order,
//         products: response.data.order.products || [],
//       });
//     } catch (error) {
//       console.error("Error fetching order:", error);
//       message.error("Failed to load order details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const response = await axios.get("/api/supplier-orders/products/all", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success && Array.isArray(response.data.products)) {
//         setProducts(response.data.products);
//       } else if (Array.isArray(response.data)) {
//         setProducts(response.data);
//       } else {
//         console.warn("Unexpected products response format:", response.data);
//         setProducts(mockProductsData);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       if (error.response?.status === 401) {
//         message.error("Session expired. Please log in again.");
//         navigate("/login");
//         return;
//       }
//       setProducts(mockProductsData);
//     }
//   };

//   const handleViewOrder = async (order) => {
//     try {
//       await fetchOrderDetails(order.order_id);
//       setViewMode("view");
//     } catch (error) {
//       console.error("Error fetching order details:", error);
//       message.error("Failed to load order details");
//     }
//   };

//   const handleAddOrder = () => {
//     const newOrder = {
//       order_id: Math.floor(100000 + Math.random() * 900000).toString(),
//       supplier_id: "",
//       supplier_name: "",
//       manager_id: "",
//       products: [],
//       total_value: 0,
//     };
//     setSelectedOrder(newOrder);
//     setViewMode("add");
//   };

//   const handleDeleteOrder = async (orderId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       await axios.delete(`/api/supplier-orders/${orderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       message.success("Order deleted successfully");
//       fetchOrders();
//       setViewMode("list");
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       if (error.response?.status === 401) {
//         message.error("Session expired. Please log in again.");
//         navigate("/login");
//         return;
//       }
//       message.error("Failed to delete order");
//     }
//   };

//   const handleSaveOrder = async (orderData) => {
//     try {
//       const invalidProducts = orderData.products.filter(
//         (p) => p.buying_price <= 0 || p.quantity <= 0
//       );

//       if (invalidProducts.length > 0) {
//         message.error("Some products have invalid prices or quantities");
//         return;
//       }
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       // const orderToSave = {
//       //   ...orderData,
//       //   expected_date: orderData.expected_date.split("T")[0],
//       // };

//       const orderToSave = {
//         ...orderData,
//         expected_date: orderData.expected_date.split("T")[0],
//         products: orderData.products.map((p) => ({
//           ...p,
//           unit_type: p.unit_type || "unit",
//           units_per_package: p.units_per_package || 1,
//         })),
//       };

//       if (viewMode === "edit") {
//         await axios.put(
//           `/api/supplier-orders/${orderData.order_id}`,
//           orderToSave,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         message.success("Order updated successfully");
//       } else {
//         await axios.post("/api/supplier-orders", orderToSave, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         message.success("Order added successfully");
//       }
//       fetchOrders();
//       setViewMode("list");
//     } catch (error) {
//       console.error("Error saving order:", error);
//       if (error.response?.status === 401) {
//         message.error("Session expired. Please log in again.");
//         navigate("/login");
//         return;
//       }
//       message.error("Failed to save order");
//     }
//   };

//   // Mock data for development
//   const mockOrdersData = [
//     // ... (same as before)
//   ];

//   const mockProductsData = [
//     // ... (same as before)
//   ];

//   return (
//     <div className="p-6">
//       {viewMode === "list" && (
//         <OrdersTable
//           orders={orders}
//           loading={loading}
//           onView={handleViewOrder}
//           onAdd={handleAddOrder}
//         />
//       )}
//       {viewMode === "view" && selectedOrder && (
//         <OrderDetailView
//           order={selectedOrder}
//           onEdit={() => setViewMode("edit")}
//           onDelete={handleDeleteOrder}
//           onBack={() => setViewMode("list")}
//         />
//       )}
//       {(viewMode === "edit" || viewMode === "add") && selectedOrder && (
//         <OrderEditForm
//           order={selectedOrder}
//           products={products}
//           mode={viewMode}
//           onSave={handleSaveOrder}
//           onCancel={() =>
//             viewMode === "edit" ? setViewMode("view") : setViewMode("list")
//           }
//           onChange={setSelectedOrder}
//         />
//       )}
//     </div>
//   );
// };

// export default SupplierOrders;

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

      // Prepare order data for saving - no expected_date needed
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
