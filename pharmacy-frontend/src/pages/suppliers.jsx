// // import React, { useState, useEffect } from "react";
// // import "antd/dist/reset.css";
// // import {
// //   Table,
// //   Button,
// //   Modal,
// //   Form,
// //   Input,
// //   message,
// //   Avatar,
// //   Select,
// //   Tag,
// // } from "antd";
// // import {
// //   UserOutlined,
// //   EditOutlined,
// //   DeleteOutlined,
// //   PlusOutlined,
// //   FilterOutlined,
// // } from "@ant-design/icons";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";

// // const { Option } = Select;

// // const Suppliers = () => {
// //   const [suppliers, setSuppliers] = useState([]);
// //   const [filteredSuppliers, setFilteredSuppliers] = useState([]);
// //   const [selectedSupplier, setSelectedSupplier] = useState(null);
// //   const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
// //   const [isAddModalVisible, setIsAddModalVisible] = useState(false);
// //   const [isEditMode, setIsEditMode] = useState(false);
// //   const [form] = Form.useForm();
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [imageFile, setImageFile] = useState(null);
// //   const [imageUrl, setImageUrl] = useState(null);
// //   const [filterType, setFilterType] = useState("All");
// //   const [filterProduct, setFilterProduct] = useState("All");
// //   const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
// //   const [availableProducts, setAvailableProducts] = useState([
// //     "K95",
// //     "N95",
// //     "Surgical Mask",
// //     "Hand Sanitizer",
// //     "Gloves",
// //     "Face Shield",
// //   ]);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     fetchSuppliers();
// //   }, []);

// //   useEffect(() => {
// //     // Apply both type and product filters
// //     let result = suppliers;

// //     // Apply type filter if not "All"
// //     if (filterType !== "All") {
// //       result = result.filter((supplier) => supplier.type === filterType);
// //     }

// //     // Apply product filter if not "All"
// //     if (filterProduct !== "All") {
// //       result = result.filter((supplier) =>
// //         supplier.products.includes(filterProduct)
// //       );
// //     }

// //     setFilteredSuppliers(result);
// //   }, [suppliers, filterType, filterProduct]);

// //   // const fetchSuppliers = async () => {
// //   //   try {
// //   //     setLoading(true);
// //   //     const response = await axios.get("/api/suppliers");
// //   //     setSuppliers(response.data.suppliers || []);
// //   //     // setLoading(false);
// //   //   } catch (err) {
// //   //     console.error("Error fetching suppliers:", err);
// //   //     setError("Failed to load suppliers. Please try again later.");
// //   //     // setLoading(false);

// //   //     // Mock data for development
// //   //     setSuppliers([
// //   //       {
// //   //         id: "23567",
// //   //         name: "Richard Martin",
// //   //         products: ["K95"],
// //   //         contactNumber: "7687765556",
// //   //         email: "richard@gmail.com",
// //   //         type: "Taking Return",
// //   //         address: "123 Main St, Colombo",
// //   //       },
// //   //       {
// //   //         id: "25831",
// //   //         name: "Tom Homan",
// //   //         products: ["K95", "N95"],
// //   //         contactNumber: "9867545368",
// //   //         email: "tomhoman@gmail.com",
// //   //         type: "Taking Return",
// //   //         address: "456 Oak Dr, Kandy",
// //   //       },
// //   //       {
// //   //         id: "56841",
// //   //         name: "Veandir",
// //   //         products: ["K95", "Hand Sanitizer"],
// //   //         contactNumber: "9867545566",
// //   //         email: "veandir@gmail.com",
// //   //         type: "Not Taking Return",
// //   //         address: "789 Pine Ave, Galle",
// //   //       },
// //   //       {
// //   //         id: "34567",
// //   //         name: "Charin",
// //   //         products: ["K95", "Surgical Mask"],
// //   //         contactNumber: "9267545457",
// //   //         email: "charin@gmail.com",
// //   //         type: "Taking Return",
// //   //         address: "101 Hill Rd, Negombo",
// //   //       },
// //   //       {
// //   //         id: "45678",
// //   //         name: "Hoffman",
// //   //         products: ["K95", "Gloves"],
// //   //         contactNumber: "9367546531",
// //   //         email: "hoffman@gmail.com",
// //   //         type: "Taking Return",
// //   //         address: "202 Beach Ln, Matara",
// //   //       },
// //   //       {
// //   //         id: "56789",
// //   //         name: "Fanden Jake",
// //   //         products: ["K95", "Face Shield"],
// //   //         contactNumber: "9667545982",
// //   //         email: "fanden@gmail.com",
// //   //         type: "Not Taking Return",
// //   //         address: "303 Lake View, Anuradhapura",
// //   //       },
// //   //       {
// //   //         id: "67890",
// //   //         name: "Martin",
// //   //         products: ["K95", "N95", "Surgical Mask"],
// //   //         contactNumber: "9867545457",
// //   //         email: "martin@gmail.com",
// //   //         type: "Taking Return",
// //   //         address: "404 River Side, Jaffna",
// //   //       },
// //   //       {
// //   //         id: "78901",
// //   //         name: "Joe Nike",
// //   //         products: ["K95", "Hand Sanitizer", "Gloves"],
// //   //         contactNumber: "9567545769",
// //   //         email: "joenike@gmail.com",
// //   //         type: "Taking Return",
// //   //         address: "505 Mountain Dr, Nuwara Eliya",
// //   //       },
// //   //     ]);
// //   //   } finally {
// //   //     setLoading(false);
// //   //   }
// //   // };
// //   const fetchSuppliers = async () => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem("token");

// //       const response = await axios.get("/api/suppliers", {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //         //baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
// //       });

// //       setSuppliers(response.data.suppliers || []);
// //     } catch (err) {
// //       console.error("Error fetching suppliers:", err);
// //       if (err.response?.status === 401) {
// //         // Redirect to login if unauthorized
// //         navigate("/login");
// //       }
// //       setError("Failed to load suppliers. Please try again later.");
// //       setSuppliers([
// //         {
// //           id: "78901",
// //           name: "Joe Nike",
// //           products: ["K95", "Hand Sanitizer", "Gloves"],
// //           contactNumber: "9567545769",
// //           email: "joenike@gmail.com",
// //           type: "Taking Return",
// //           address: "505 Mountain Dr, Nuwara Eliya",
// //         },
// //       ]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const columns = [
// //     {
// //       title: "Supplier ID",
// //       dataIndex: "id",
// //       key: "id",
// //     },
// //     {
// //       title: "Supplier Name",
// //       dataIndex: "name",
// //       key: "name",
// //     },
// //     {
// //       title: "Products",
// //       dataIndex: "products",
// //       key: "products",
// //       render: (products) => (
// //         <div>
// //           {products.map((product, index) => (
// //             <Tag key={index} color="blue" className="mb-1">
// //               {product}
// //             </Tag>
// //           ))}
// //         </div>
// //       ),
// //     },
// //     {
// //       title: "Contact Number",
// //       dataIndex: "contactNumber",
// //       key: "contactNumber",
// //     },
// //     {
// //       title: "Email",
// //       dataIndex: "email",
// //       key: "email",
// //     },
// //     {
// //       title: "Type",
// //       dataIndex: "type",
// //       key: "type",
// //       render: (type) => (
// //         <span
// //           className={
// //             type === "Taking Return" ? "text-green-500" : "text-red-500"
// //           }
// //         >
// //           {type}
// //         </span>
// //       ),
// //     },
// //   ];

// //   const handleRowClick = (record) => {
// //     setSelectedSupplier(record);
// //     setIsDetailModalVisible(true);
// //   };

// //   const handleAddSupplier = () => {
// //     setIsEditMode(false);
// //     form.resetFields();
// //     setImageUrl(null);
// //     setIsAddModalVisible(true);
// //   };

// //   const handleEditSupplier = () => {
// //     setIsEditMode(true);
// //     setIsDetailModalVisible(false);

// //     form.setFieldsValue({
// //       name: selectedSupplier.name,
// //       email: selectedSupplier.email,
// //       contactNumber: selectedSupplier.contactNumber,
// //       products: selectedSupplier.products,
// //       type: selectedSupplier.type,
// //       address: selectedSupplier.address || "",
// //     });

// //     setIsAddModalVisible(true);
// //   };

// //   // const handleDeleteSupplier = async () => {
// //   //   try {
// //   //     // This would be an API call to delete the supplier
// //   //     await axios.delete(`/api/suppliers/${selectedSupplier.id}`);

// //   //     const updatedSuppliers = suppliers.filter(
// //   //       (supplier) => supplier.id !== selectedSupplier.id
// //   //     );
// //   //     setSuppliers(updatedSuppliers);
// //   //     message.success("Supplier deleted successfully");
// //   //     setIsDetailModalVisible(false);
// //   //     setSelectedSupplier(null);
// //   //   } catch (err) {
// //   //     console.error("Error deleting supplier:", err);
// //   //     message.error("Failed to delete supplier. Please try again.");
// //   //   }
// //   // };
// //   const handleDeleteSupplier = async () => {
// //     try {
// //       const token = localStorage.getItem("token"); // Get token
// //       if (!token) throw new Error("No token found");

// //       await axios.delete(`/api/suppliers/${selectedSupplier.id}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`, // Attach token
// //         },
// //       });

// //       // Update state and show success message
// //       setSuppliers(suppliers.filter((s) => s.id !== selectedSupplier.id));
// //       message.success("Supplier deleted successfully");
// //       setIsDetailModalVisible(false);
// //     } catch (err) {
// //       console.error("Error deleting supplier:", err);
// //       if (err.response?.status === 401) {
// //         message.error("Unauthorized: Please log in again");
// //         navigate("/login"); // Redirect to login if unauthorized
// //       } else {
// //         message.error("Failed to delete supplier");
// //       }
// //     }
// //   };

// //   // const handleFormSubmit = async (values) => {
// //   //   // try {
// //   //   //   setLoading(true);

// //   //   //   if (isEditMode) {
// //   //   //     // Edit existing supplier
// //   //   //     await axios.put(`/api/suppliers/${selectedSupplier.id}`, values);

// //   //   //     const updatedSuppliers = suppliers.map((supplier) =>
// //   //   //       supplier.id === selectedSupplier.id
// //   //   //         ? { ...supplier, ...values }
// //   //   //         : supplier
// //   //   //     );
// //   //   //     setSuppliers(updatedSuppliers);
// //   //   //     message.success("Supplier updated successfully");
// //   //   //   } else {
// //   //   //     // Add new supplier
// //   //   //     await axios.post("/api/suppliers", values);

// //   //   //     const newSupplier = {
// //   //   //       id: Math.floor(10000 + Math.random() * 90000).toString(),
// //   //   //       ...values,
// //   //   //     };
// //   //   //     setSuppliers([...suppliers, newSupplier]);
// //   //   //     message.success("Supplier added successfully");
// //   //   //   }

// //   //   //   setIsAddModalVisible(false);
// //   //   //   form.resetFields();
// //   //   //   setImageUrl(null);
// //   //   //   setLoading(false);
// //   //   // } catch (err) {
// //   //   //   console.error("Error saving supplier:", err);
// //   //   //   message.error(
// //   //   //     "Failed to save supplier. Please check your inputs and try again."
// //   //   //   );
// //   //   //   setLoading(false);
// //   //   // }

// //   //   try {
// //   //     setLoading(true);

// //   //     const response = isEditMode
// //   //       ? await axios.put(`/api/suppliers/${selectedSupplier.id}`, values)
// //   //       : await axios.post("/api/suppliers", values);

// //   //     // ... rest of your success handling
// //   //   } catch (err) {
// //   //     console.error("Full error details:", err);
// //   //     console.error("Error response data:", err.response?.data);
// //   //     message.error(
// //   //       err.response?.data?.message ||
// //   //         "Failed to save supplier. Please check your inputs and try again."
// //   //     );
// //   //     setLoading(false);
// //   //   }
// //   // };

// //   const handleFormSubmit = async (values) => {
// //     try {
// //       setLoading(true);

// //       // Get the token from where you store it (localStorage, cookies, etc.)
// //       const token = localStorage.getItem("token"); // or your auth context

// //       if (!token) {
// //         throw new Error("No authentication token found");
// //       }

// //       const formData = new FormData();

// //       // Convert products to consistent format
// //       let productsValue;
// //       if (Array.isArray(values.products)) {
// //         productsValue = values.products;
// //       } else if (values.products) {
// //         // Check if it's already JSON string
// //         try {
// //           const parsed = JSON.parse(values.products);
// //           productsValue = Array.isArray(parsed) ? parsed : [parsed];
// //         } catch {
// //           // Treat as comma-separated string
// //           productsValue = values.products
// //             .split(",")
// //             .map((p) => p.trim())
// //             .filter((p) => p);
// //         }
// //       } else {
// //         productsValue = [];
// //       }

// //       // Stringify only if not already a string
// //       formData.append(
// //         "products",
// //         typeof productsValue === "string"
// //           ? productsValue
// //           : JSON.stringify(productsValue)
// //       );

// //       // Append other fields
// //       Object.entries(values).forEach(([key, value]) => {
// //         if (key !== "products" && key !== "image") {
// //           formData.append(key, value);
// //         }
// //       });

// //       // If you're uploading an image
// //       if (imageFile) {
// //         formData.append("image", imageFile);
// //       }

// //       const response = await axios.post("/api/suppliers", formData, {
// //         headers: {
// //           "Content-Type": "multipart/form-data",
// //           Authorization: `Bearer ${token}`, // Include the token
// //         },
// //       });

// //       // Handle success...
// //       message.success("Supplier created successfully!");
// //       setIsAddModalVisible(false);
// //       fetchSuppliers(); // Refresh the list
// //     } catch (err) {
// //       console.error("Error details:", {
// //         status: err.response?.status,
// //         message: err.response?.data?.message || err.message,
// //       });

// //       message.error(
// //         err.response?.data?.message ||
// //           "Failed to save supplier. Please log in again."
// //       );

// //       // If token is invalid/expired, redirect to login
// //       if (err.response?.status === 401) {
// //         localStorage.removeItem("token");
// //         navigate("/login");
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // const handleImageUpload = (e) => {
// //   //   const file = e.target.files[0];
// //   //   if (file) {
// //   //     const reader = new FileReader();
// //   //     reader.onload = (e) => {
// //   //       setImageUrl(e.target.result);
// //   //     };
// //   //     reader.readAsDataURL(file);
// //   //   }
// //   // };
// //   const handleImageUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setImageFile(file); // Store the File object
// //       const reader = new FileReader();
// //       reader.onload = (e) => setImageUrl(e.target.result);
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleFilterModalOk = () => {
// //     setIsFilterModalVisible(false);
// //   };

// //   const getFilterSummary = () => {
// //     const typeFilter = filterType !== "All" ? filterType : "";
// //     const productFilter = filterProduct !== "All" ? filterProduct : "";

// //     if (typeFilter && productFilter) {
// //       return `${typeFilter}, ${productFilter}`;
// //     } else if (typeFilter) {
// //       return typeFilter;
// //     } else if (productFilter) {
// //       return productFilter;
// //     } else {
// //       return "All";
// //     }
// //   };

// //   if (loading && suppliers.length === 0) {
// //     return (
// //       <div className="flex items-center justify-center h-full">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //       </div>
// //     );
// //   }

// //   if (error && suppliers.length === 0) {
// //     return (
// //       <div className="flex items-center justify-center h-full">
// //         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
// //           <p className="font-bold">Error</p>
// //           <p>{error}</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6 bg-white shadow rounded-lg">
// //       <div className="flex justify-between items-center mb-6">
// //         <h2 className="text-xl font-semibold">Suppliers</h2>
// //         <div className="flex space-x-2 gap-4 ml-4">
// //           <Button
// //             type="primary"
// //             icon={<PlusOutlined />}
// //             onClick={handleAddSupplier}
// //             className="bg-blue-500 hover:bg-blue-600"
// //           >
// //             Add Supplier
// //           </Button>
// //           <Button
// //             icon={<FilterOutlined />}
// //             onClick={() => setIsFilterModalVisible(true)}
// //           >
// //             Filter: {getFilterSummary()}
// //           </Button>
// //         </div>
// //       </div>

// //       <Table
// //         columns={columns}
// //         dataSource={filteredSuppliers}
// //         rowKey="id"
// //         loading={loading}
// //         onRow={(record) => ({
// //           onClick: () => handleRowClick(record),
// //         })}
// //         className="cursor-pointer"
// //         pagination={{ pageSize: 10 }}
// //       />

// //       {/* Filter Modal */}
// //       <Modal
// //         title="Filter Suppliers"
// //         open={isFilterModalVisible}
// //         onCancel={() => setIsFilterModalVisible(false)}
// //         onOk={handleFilterModalOk}
// //         footer={[
// //           <Button
// //             key="reset"
// //             onClick={() => {
// //               setFilterType("All");
// //               setFilterProduct("All");
// //             }}
// //           >
// //             Reset Filters
// //           </Button>,
// //           <Button
// //             key="apply"
// //             type="primary"
// //             onClick={handleFilterModalOk}
// //             className="bg-blue-500 hover:bg-blue-600"
// //           >
// //             Apply
// //           </Button>,
// //         ]}
// //       >
// //         <div className="space-y-4">
// //           <div className="mb-4">
// //             <div className="font-medium mb-2">Filter by Type:</div>
// //             <Select
// //               style={{ width: "100%" }}
// //               value={filterType}
// //               onChange={(value) => setFilterType(value)}
// //             >
// //               <Option value="All">All Types</Option>
// //               <Option value="Taking Return">Taking Return</Option>
// //               <Option value="Not Taking Return">Not Taking Return</Option>
// //             </Select>
// //           </div>

// //           <div>
// //             <div className="font-medium mb-2">Filter by Product:</div>
// //             <Select
// //               style={{ width: "100%" }}
// //               value={filterProduct}
// //               onChange={(value) => setFilterProduct(value)}
// //             >
// //               <Option value="All">All Products</Option>
// //               {availableProducts.map((product) => (
// //                 <Option key={product} value={product}>
// //                   {product}
// //                 </Option>
// //               ))}
// //             </Select>
// //           </div>
// //         </div>
// //       </Modal>

// //       {/* Supplier Details Modal */}
// //       {selectedSupplier && (
// //         <Modal
// //           title="Supplier Overview"
// //           open={isDetailModalVisible}
// //           onCancel={() => setIsDetailModalVisible(false)}
// //           footer={[
// //             <Button
// //               key="edit"
// //               type="default"
// //               icon={<EditOutlined />}
// //               onClick={handleEditSupplier}
// //             >
// //               Edit
// //             </Button>,
// //             <Button
// //               key="delete"
// //               danger
// //               icon={<DeleteOutlined />}
// //               onClick={handleDeleteSupplier}
// //             >
// //               Delete
// //             </Button>,
// //           ]}
// //           width={700}
// //         >
// //           <div className="flex">
// //             <div className="flex-grow">
// //               <h3 className="text-lg font-medium mb-4">Primary Details</h3>
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="font-medium">Supplier ID</div>
// //                 <div>{selectedSupplier.id}</div>
// //                 <div className="font-medium">Supplier Name</div>
// //                 <div>{selectedSupplier.name}</div>
// //                 <div className="font-medium">Supplier Type</div>
// //                 <div
// //                   className={
// //                     selectedSupplier.type === "Taking Return"
// //                       ? "text-green-500"
// //                       : "text-red-500"
// //                   }
// //                 >
// //                   {selectedSupplier.type}
// //                 </div>

// //                 <div className="font-medium">Contact number</div>
// //                 <div>{selectedSupplier.contactNumber}</div>

// //                 <div className="font-medium">Email</div>
// //                 <div>{selectedSupplier.email}</div>

// //                 <div className="font-medium">Products</div>
// //                 <div className="flex flex-wrap">
// //                   {selectedSupplier.products.map((product, index) => (
// //                     <Tag key={index} color="blue" className="mb-1 mr-1">
// //                       {product}
// //                     </Tag>
// //                   ))}
// //                 </div>

// //                 <div className="font-medium">Address</div>
// //                 <div>{selectedSupplier.address || "N/A"}</div>
// //               </div>
// //             </div>
// //             <div className="ml-8 flex items-start justify-center">
// //               <Avatar size={100} icon={<UserOutlined />} src={imageUrl} />
// //             </div>
// //           </div>
// //         </Modal>
// //       )}

// //       {/* Add/Edit Supplier Modal */}
// //       <Modal
// //         title={isEditMode ? "Edit Supplier" : "New Supplier"}
// //         open={isAddModalVisible}
// //         onCancel={() => {
// //           setIsAddModalVisible(false);
// //           form.resetFields();
// //           setImageUrl(null);
// //         }}
// //         footer={null}
// //         width={500}
// //       >
// //         <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
// //           <div className="flex justify-center mb-4">
// //             <div className="relative">
// //               <Avatar
// //                 size={100}
// //                 icon={<UserOutlined />}
// //                 src={imageUrl}
// //                 className="border border-dashed border-gray-300 cursor-pointer"
// //               />
// //               <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
// //                 <label className="text-xs text-blue-500 cursor-pointer">
// //                   Browse image
// //                   <input
// //                     type="file"
// //                     hidden
// //                     accept="image/*"
// //                     onChange={handleImageUpload}
// //                   />
// //                 </label>
// //               </div>
// //             </div>
// //           </div>

// //           <Form.Item
// //             name="name"
// //             label="Supplier Name"
// //             rules={[{ required: true, message: "Please enter supplier name" }]}
// //           >
// //             <Input placeholder="Enter supplier name" />
// //           </Form.Item>

// //           <Form.Item
// //             name="email"
// //             label="Email"
// //             rules={[
// //               { required: true, message: "Please enter email" },
// //               { type: "email", message: "Please enter a valid email" },
// //             ]}
// //           >
// //             <Input placeholder="Enter email" />
// //           </Form.Item>

// //           {/* <Form.Item
// //             name="contactNumber"
// //             label="Contact Number"
// //             rules={[{ required: true, message: "Please enter contact number" }]}
// //           >
// //             <Input placeholder="Enter supplier contact number" />
// //           </Form.Item> */}

// //           <Form.Item
// //             name="contactNumber"
// //             label="Contact Number"
// //             rules={[
// //               {
// //                 required: true,
// //                 message: "Please enter a contact number",
// //               },
// //               {
// //                 pattern: /^[0-9]{10}$/, // Exactly 10 digits
// //                 message: "Must be exactly 10 digits (numbers only)",
// //               },
// //             ]}
// //           >
// //             <Input
// //               placeholder="Enter 10-digit number"
// //               maxLength={10} // Prevents typing more than 10 chars
// //               onKeyPress={(e) => {
// //                 if (!/[0-9]/.test(e.key)) {
// //                   // Blocks non-numeric input
// //                   e.preventDefault();
// //                 }
// //               }}
// //             />
// //           </Form.Item>

// //           <Form.Item
// //             name="products"
// //             label="Products"
// //             rules={[{ required: true, message: "Please select products" }]}
// //           >
// //             <Select
// //               mode="multiple"
// //               placeholder="Select products"
// //               style={{ width: "100%" }}
// //             >
// //               {availableProducts.map((product) => (
// //                 <Option key={product} value={product}>
// //                   {product}
// //                 </Option>
// //               ))}
// //             </Select>
// //           </Form.Item>

// //           <Form.Item
// //             name="type"
// //             label="Supplier Type"
// //             rules={[{ required: true, message: "Please select supplier type" }]}
// //             initialValue="Taking Return"
// //           >
// //             <Select>
// //               <Option value="Taking Return">Taking Return</Option>
// //               <Option value="Not Taking Return">Not Taking Return</Option>
// //             </Select>
// //           </Form.Item>

// //           <Form.Item
// //             name="address"
// //             label="Address"
// //             rules={[{ required: true, message: "Please enter address" }]}
// //           >
// //             <Input placeholder="Enter supplier address" />
// //           </Form.Item>

// //           <div className="flex justify-end space-x-2 mt-4">
// //             <Button
// //               onClick={() => {
// //                 setIsAddModalVisible(false);
// //                 form.resetFields();
// //                 setImageUrl(null);
// //               }}
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               type="primary"
// //               htmlType="submit"
// //               loading={loading}
// //               className="bg-blue-500 hover:bg-blue-600"
// //             >
// //               {isEditMode ? "Update Supplier" : "Add Supplier"}
// //             </Button>
// //           </div>
// //         </Form>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default Suppliers;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { message } from "antd";
// import SuppliersTable from "../components/suppliers/SuppliersTable";
// import SupplierViewModal from "../components/suppliers/SupplierViewModal";
// import SupplierAddEditModal from "../components/suppliers/SupplierAddEditModal";
// import SupplierFilterModal from "../components/suppliers/SupplierFilterModal";

// const Suppliers = () => {
//   const [suppliers, setSuppliers] = useState([]);
//   const [filteredSuppliers, setFilteredSuppliers] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
//   const [isAddModalVisible, setIsAddModalVisible] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterType, setFilterType] = useState("All");
//   const [filterProduct, setFilterProduct] = useState("All");
//   const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
//   const [availableProducts] = useState([
//     "K95",
//     "N95",
//     "Surgical Mask",
//     "Hand Sanitizer",
//     "Gloves",
//     "Face Shield",
//   ]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

//   // useEffect(() => {
//   //   let result = suppliers;
//   //   if (filterType !== "All") {
//   //     result = result.filter((supplier) => supplier.type === filterType);
//   //   }
//   //   if (filterProduct !== "All") {
//   //     result = result.filter((supplier) =>
//   //       supplier.products.includes(filterProduct)
//   //     );
//   //   }
//   //   setFilteredSuppliers(result);
//   // }, [suppliers, filterType, filterProduct]);

//   useEffect(() => {
//     let result = suppliers;
//     if (filterType !== "All") {
//       result = result.filter((supplier) => supplier.type === filterType);
//     }
//     if (filterProduct !== "All") {
//       result = result.filter((supplier) =>
//         supplier.products.some((p) =>
//           typeof p === "object" ? p.name === filterProduct : p === filterProduct
//         )
//       );
//     }
//     setFilteredSuppliers(result);
//   }, [suppliers, filterType, filterProduct]);

//   const fetchSuppliers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/api/suppliers", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSuppliers(response.data.suppliers || []);
//     } catch (err) {
//       console.error("Error fetching suppliers:", err);
//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//       setError("Failed to load suppliers. Please try again later.");
//       // Fallback mock data
//       setSuppliers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteSupplier = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`/api/suppliers/${selectedSupplier.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSuppliers(suppliers.filter((s) => s.id !== selectedSupplier.id));
//       message.success("Supplier deleted successfully");
//       setIsDetailModalVisible(false);
//     } catch (err) {
//       console.error("Error deleting supplier:", err);
//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//       message.error("Failed to delete supplier");
//     }
//   };

//   if (loading && suppliers.length === 0) {
//     return <div>Loading...</div>;
//   }

//   if (error && suppliers.length === 0) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="p-6 bg-white shadow rounded-lg">
//       <SuppliersTable
//         suppliers={filteredSuppliers}
//         loading={loading}
//         onRowClick={(record) => {
//           setSelectedSupplier(record);
//           setIsDetailModalVisible(true);
//         }}
//         onAddSupplier={() => setIsAddModalVisible(true)}
//         onFilterClick={() => setIsFilterModalVisible(true)}
//         filterSummary={`${filterType !== "All" ? filterType : "All"}${
//           filterProduct !== "All" ? `, ${filterProduct}` : ""
//         }`}
//       />

//       <SupplierViewModal
//         visible={isDetailModalVisible}
//         supplier={selectedSupplier}
//         onClose={() => setIsDetailModalVisible(false)}
//         onEdit={() => {
//           setIsEditMode(true);
//           setIsDetailModalVisible(false);
//           setIsAddModalVisible(true);
//         }}
//         onDelete={handleDeleteSupplier}
//       />

//       <SupplierAddEditModal
//         visible={isAddModalVisible}
//         isEditMode={isEditMode}
//         supplier={selectedSupplier}
//         availableProducts={availableProducts}
//         onCancel={() => {
//           setIsAddModalVisible(false);
//           setSelectedSupplier(null);
//         }}
//         onSubmitSuccess={() => {
//           setIsAddModalVisible(false);
//           fetchSuppliers();
//         }}
//       />

//       <SupplierFilterModal
//         visible={isFilterModalVisible}
//         filterType={filterType}
//         filterProduct={filterProduct}
//         availableProducts={availableProducts}
//         onCancel={() => setIsFilterModalVisible(false)}
//         onApply={() => setIsFilterModalVisible(false)}
//         onReset={() => {
//           setFilterType("All");
//           setFilterProduct("All");
//         }}
//         onFilterTypeChange={setFilterType}
//         onFilterProductChange={setFilterProduct}
//       />
//     </div>
//   );
// };

// export default Suppliers;

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
