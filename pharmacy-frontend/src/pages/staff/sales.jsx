// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Card,
//   Button,
//   Table,
//   Input,
//   Modal,
//   Form,
//   InputNumber,
//   message,
//   Select,
//   Typography,
//   Divider,
//   List,
//   Image,
//   Avatar,
// } from "antd";
// import {
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   SearchOutlined,
//   MedicineBoxOutlined,
//   ArrowLeftOutlined,
//   EyeOutlined,
// } from "@ant-design/icons";
// import axios from "axios";

// const { Title, Text } = Typography;
// const { Option } = Select;

// const PrescriptionProductManagement = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Extract data from location state
//   const {
//     prescriptionId,
//     customerId,
//     prescriptionState: initialState,
//     isFromPrescriptionSelection,
//   } = location.state || {};

//   const [currentPrescriptionState, setCurrentPrescriptionState] = useState(
//     initialState || "Pending"
//   );
//   const [products, setProducts] = useState([]);
//   const [productsModalVisible, setProductsModalVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [productQuantity, setProductQuantity] = useState(1);
//   const [selectedProductRow, setSelectedProductRow] = useState(null);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [editForm] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [totalValue, setTotalValue] = useState(0);
//   const [prescriptionModalVisible, setPrescriptionModalVisible] =
//     useState(false);
//   const [imageLoading, setImageLoading] = useState(false);
//   const [prescriptionImage, setPrescriptionImage] = useState(null);
//   const [availabilityOptions] = useState([
//     { value: "Available", label: "Available" },
//     { value: "Not available", label: "Not available" },
//     { value: "Pending", label: "Pending" },
//     { value: "Ready for pickup", label: "Ready for pickup" },
//     { value: "Confirmed", label: "Confirmed" },
//     { value: "Delayed", label: "Delayed" },
//     { value: "Out for delivery", label: "Out for delivery" },
//   ]);

//   // Validate if we have the required data
//   useEffect(() => {
//     if (!prescriptionId || !customerId) {
//       message.error("Missing prescription or customer information");
//       navigate(-1);
//     }
//   }, [prescriptionId, customerId, navigate]);

//   useEffect(() => {
//     if (prescriptionId) {
//       fetchPrescriptionProducts();
//       fetchPrescriptionImage();
//     }
//   }, [prescriptionId]);

//   useEffect(() => {
//     // Calculate total value whenever products change
//     const newTotal = products.reduce((sum, product) => {
//       return sum + product.price * product.quantity;
//     }, 0);
//     setTotalValue(newTotal);
//   }, [products]);

//   const fetchPrescriptionImage = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       // Fetch prescription details to get the file path
//       const response = await axios.get(
//         `/api/staff-sales/prescriptions/${prescriptionId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.success && response.data.prescription) {
//         setPrescriptionImage(response.data.prescription.file_path);
//       } else {
//         console.error(
//           "Error fetching prescription image:",
//           response.data.message
//         );
//         // Use a fallback image or show an error message
//       }
//     } catch (error) {
//       console.error("Error fetching prescription image:", error);
//       // Handle error - maybe set a fallback image path
//     }
//   };

//   // const fetchPrescriptionProducts = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const token = localStorage.getItem("token");

//   //     // In a real implementation, this would be an API call
//   //     const response = await axios.get(
//   //       `/api/staff-sales/prescriptions/${prescriptionId}/products`,
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );

//   //     // For demo purposes, use mock data
//   //     setMockProducts();
//   //   } catch (error) {
//   //     console.error("Error fetching prescription products:", error);
//   //     message.error("Error loading products");
//   //     // Set mock data for demo purposes
//   //     setMockProducts();
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   /// ////////correct version ////////////////////

//   const fetchPrescriptionProducts = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       console.log(`Fetching products for prescription ${prescriptionId}`);

//       const response = await axios.get(
//         `/api/staff-sales/prescriptions/${prescriptionId}/products`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log("Prescription products response:", response.data);

//       if (response.data.success) {
//         // If the API request is successful, set products from the response
//         setProducts(response.data.products || []);

//         // If there's prescription info in the response, set that too
//         if (response.data.prescription) {
//           const prescription = response.data.prescription;

//           // If you need the prescription file path for the image modal
//           setPrescriptionImage(prescription.file_path);

//           // Optionally update prescription state if needed
//           // setCurrentPrescriptionState(prescription.status);
//         }
//       } else {
//         message.error(response.data.message || "Failed to load products");
//         // Only use mock data in development mode as fallback
//         if (process.env.NODE_ENV !== "production") {
//           setMockProducts();
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching prescription products:", error);
//       console.error("Error details:", error.response?.data || error.message);
//       message.error("Error loading products");

//       // Only use mock data in development mode as fallback
//       if (process.env.NODE_ENV !== "production") {
//         setMockProducts();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Make sure to call this function whenever the prescriptionId changes
//   useEffect(() => {
//     if (prescriptionId) {
//       fetchPrescriptionProducts();
//     }
//   }, [prescriptionId]);

//   const setMockProducts = () => {
//     const mockData = [];
//     setProducts(mockData);
//   };

//   const searchProducts = async (query) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       console.log("Searching for products with query:", query);

//       const response = await axios.get(`/api/staff-sales/products/search`, {
//         params: { query },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       console.log("Search response:", response.data);

//       if (response.data.success) {
//         // Filter out products with zero quantity
//         const formattedResults = response.data.products
//           .filter((product) => product.quantity_available > 0) // Only include in-stock products
//           .map((product) => ({
//             id: product.id,
//             name: product.name,
//             quantity_available: product.quantity_available,
//             price: product.price,
//             requires_prescription: product.requires_prescription,
//           }));

//         setSearchResults(formattedResults);

//         // Show message if any products were filtered out
//         if (response.data.products.length > formattedResults.length) {
//           message.info(
//             "Some products were excluded because they are out of stock"
//           );
//         }
//       } else {
//         console.error("Search failed:", response.data.message);
//         message.error(response.data.message || "Search failed");
//         // For demonstration/testing, fall back to mock data when API fails
//         setMockSearchResults();
//       }
//     } catch (error) {
//       console.error("Error searching products:", error);
//       console.error("Error details:", error.response?.data || error.message);
//       message.error("Error during product search");

//       // For demonstration/testing, fall back to mock data when API fails
//       setMockSearchResults();
//     }
//   };

//   const setMockSearchResults = () => {
//     const mockResults = [
//       {
//         id: "12152",
//         name: "Paracetamol 500mg",
//         quantity_available: 500,
//         price: 45,
//       },
//       {
//         id: "515161",
//         name: "Amoxicillin 250mg",
//         quantity_available: 350,
//         price: 120,
//       },
//       {
//         id: "52562",
//         name: "Ibuprofen 400mg",
//         quantity_available: 420,
//         price: 60,
//       },
//       {
//         id: "52563",
//         name: "Aspirin 100mg",
//         quantity_available: 300,
//         price: 35,
//       },
//       {
//         id: "52564",
//         name: "Loratadine 10mg",
//         quantity_available: 200,
//         price: 80,
//       },
//     ];
//     setSearchResults(mockResults);
//   };

//   const handleSearchChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     searchProducts(query);
//   };

//   const handleProductSelect = (product) => {
//     setSelectedProduct(product);
//   };

//   // const handleAddProduct = async () => {
//   //   if (!selectedProduct) {
//   //     message.error("Please select a product");
//   //     return;
//   //   }

//   //   if (!productQuantity || productQuantity < 1) {
//   //     message.error("Please enter a valid quantity");
//   //     return;
//   //   }

//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     const payload = {
//   //       prescriptionId,
//   //       productId: selectedProduct.id,
//   //       quantity: productQuantity,
//   //       price: selectedProduct.price,
//   //     };

//   //     const response = await axios.post(
//   //       `/api/staff-sales/prescriptions/${prescriptionId}/products`,
//   //       payload,
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );

//   //     // For demo purposes, add the product locally
//   //     const newProduct = {
//   //       id: selectedProduct.id,
//   //       name: selectedProduct.name,
//   //       quantity: productQuantity,
//   //       price: selectedProduct.price,
//   //       value: selectedProduct.price * productQuantity,
//   //     };

//   //     setProducts([...products, newProduct]);
//   //     message.success("Product added successfully");
//   //     setProductsModalVisible(false);
//   //     setSelectedProduct(null);
//   //     setProductQuantity(1);
//   //     setSearchQuery("");
//   //     setSearchResults([]);
//   //   } catch (error) {
//   //     console.error("Error adding product:", error);
//   //     message.error("Error adding product to prescription");
//   //   }
//   // };

//   const handleAddProduct = async () => {
//     if (!selectedProduct) {
//       message.error("Please select a product");
//       return;
//     }

//     if (!productQuantity || productQuantity < 1) {
//       message.error("Please enter a valid quantity");
//       return;
//     }

//     // Check if product is already in the prescription
//     const existingProduct = products.find((p) => p.id === selectedProduct.id);
//     if (existingProduct) {
//       message.error(
//         "This product is already in the prescription. Please edit the existing entry instead."
//       );
//       return;
//     }

//     // Add an additional check to ensure quantity requested doesn't exceed available stock
//     if (productQuantity > selectedProduct.quantity_available) {
//       message.error(
//         `Only ${selectedProduct.quantity_available} items available in stock`
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       // Log the data being sent to the API
//       console.log("Adding product with data:", {
//         productId: selectedProduct.id,
//         quantity: productQuantity,
//         price: selectedProduct.price,
//       });

//       const response = await axios.post(
//         `/api/staff-sales/prescriptions/${prescriptionId}/products`,
//         {
//           productId: selectedProduct.id,
//           quantity: productQuantity,
//           price: selectedProduct.price,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Add product response:", response.data);

//       if (response.data.success) {
//         message.success("Product added successfully");

//         // Create a new product entry with the correct format for the table
//         const newProduct = {
//           id: selectedProduct.id,
//           name: selectedProduct.name,
//           quantity: productQuantity,
//           price: selectedProduct.price,
//           // Calculate the value for the table display
//           value: selectedProduct.price * productQuantity,
//         };

//         // Add the new product to the list
//         setProducts([...products, newProduct]);

//         // Reset UI state
//         setProductsModalVisible(false);
//         setSelectedProduct(null);
//         setProductQuantity(1);
//         setSearchQuery("");
//         setSearchResults([]);
//       } else {
//         message.error(response.data.message || "Failed to add product");
//       }
//     } catch (error) {
//       console.error("Error adding product:", error);
//       console.error("Error details:", error.response?.data || error.message);
//       message.error("Error adding product to prescription");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditProduct = (record) => {
//     setSelectedProductRow(record);
//     editForm.setFieldsValue({
//       quantity: record.quantity,
//     });
//     setEditModalVisible(true);
//   };

//   const handleUpdateProduct = async () => {
//     try {
//       const values = await editForm.validateFields();

//       // For demo purposes, update the product locally
//       const updatedProducts = products.map((p) => {
//         if (p.id === selectedProductRow.id) {
//           const updatedQuantity = values.quantity;
//           return {
//             ...p,
//             quantity: updatedQuantity,
//             value: updatedQuantity * p.price,
//           };
//         }
//         return p;
//       });

//       setProducts(updatedProducts);
//       message.success("Product quantity updated successfully");
//       setEditModalVisible(false);
//     } catch (error) {
//       console.error("Error updating product:", error);
//       message.error("Error updating product quantity");
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     try {
//       // For demo purposes, remove the product locally
//       const updatedProducts = products.filter((p) => p.id !== productId);
//       setProducts(updatedProducts);
//       message.success("Product removed successfully");
//     } catch (error) {
//       console.error("Error removing product:", error);
//       message.error("Error removing product");
//     }
//   };

//   const updatePrescriptionState = async (newState) => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.put(
//         `/api/staff-sales/prescriptions/${prescriptionId}/status`,
//         { status: newState },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // For demo purposes, just update the local state
//       setCurrentPrescriptionState(newState);
//       message.success(`Prescription status updated to ${newState}`);
//     } catch (error) {
//       console.error("Error updating prescription state:", error);
//       message.error("Error updating prescription state");
//     }
//   };

//   // const handleAddRecord = async () => {
//   //   try {
//   //     if (products.length === 0) {
//   //       message.error("Please add at least one product");
//   //       return;
//   //     }

//   //     // First update the prescription state to Available if not already set
//   //     if (currentPrescriptionState !== "Available") {
//   //       await updatePrescriptionState("Available");
//   //     }

//   //     // For demo purposes
//   //     message.success("Record added successfully");
//   //     message.success("Customer notification sent");

//   //     // Navigate back to prescription management after a short delay
//   //     setTimeout(() => {
//   //       navigate(-1);
//   //     }, 1500);
//   //   } catch (error) {
//   //     console.error("Error adding record:", error);
//   //     message.error("Error adding record");
//   //   }
//   // };

//   const handleAddRecord = async () => {
//     try {
//       if (products.length === 0) {
//         message.error("Please add at least one product");
//         return;
//       }

//       // Always set the prescription state to "Available" when saving
//       const newState = "Available";

//       // Update the prescription status
//       const token = localStorage.getItem("token");

//       const response = await axios.put(
//         `/api/staff-sales/prescriptions/${prescriptionId}/status`,
//         { status: newState },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         // Update local state
//         setCurrentPrescriptionState(newState);
//         message.success(`Record saved. Prescription status set to ${newState}`);
//         message.success("Customer notification sent");

//         // Navigate back to prescription management after a short delay
//         setTimeout(() => {
//           navigate(-1);
//         }, 1500);
//       } else {
//         message.error(response.data.message || "Failed to update status");
//       }
//     } catch (error) {
//       console.error("Error saving record:", error);
//       message.error("Error saving record");
//     }
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   const handleDiscard = () => {
//     // Show confirmation dialog before discarding changes
//     Modal.confirm({
//       title: "Discard changes?",
//       content:
//         "Any unsaved changes will be lost. Are you sure you want to continue?",
//       okText: "Yes, discard",
//       cancelText: "No, keep editing",
//       onOk: () => {
//         navigate(-1);
//       },
//     });
//   };

//   const columns = [
//     {
//       title: "Product ID",
//       dataIndex: "id",
//       key: "id",
//     },
//     {
//       title: "Product Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Quantity",
//       dataIndex: "quantity",
//       key: "quantity",
//     },
//     {
//       title: "Price",
//       dataIndex: "price",
//       key: "price",
//       render: (price) => `Rs.${price.toLocaleString()}`,
//     },
//     {
//       title: "Value",
//       dataIndex: "value",
//       key: "value",
//       render: (_, record) =>
//         `Rs.${(record.price * record.quantity).toLocaleString()}`,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <div className="flex gap-2">
//           <Button
//             type="text"
//             icon={<EditOutlined />}
//             onClick={() => handleEditProduct(record)}
//           />
//           <Button
//             type="text"
//             danger
//             icon={<DeleteOutlined />}
//             onClick={() => handleDeleteProduct(record.id)}
//           />
//         </div>
//       ),
//     },
//   ];
//   const handleViewPrescription = () => {
//     setPrescriptionModalVisible(true);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex items-center mb-4">
//         <Button
//           type="default"
//           icon={<ArrowLeftOutlined />}
//           onClick={handleGoBack}
//           className="mr-4"
//         >
//           Back to Prescriptions
//         </Button>
//         <Title level={4} className="m-0">
//           Prescription Product Management
//         </Title>
//       </div>

//       <Card title="Manage Prescription" className="w-full">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <Text className="text-gray-500">Prescription ID</Text>
//             <Input value={prescriptionId} disabled className="mt-1" />
//           </div>
//           <div>
//             <Text className="text-gray-500">Customer ID</Text>
//             <Input value={customerId} disabled className="mt-1" />
//           </div>

//           {/* <div>
//             <Text className="text-gray-500">Status</Text>
//             <Select
//               className="w-full mt-1"
//               value={currentPrescriptionState}
//               onChange={updatePrescriptionState}
//             >
//               {availabilityOptions.map((option) => (
//                 <Option key={option.value} value={option.value}>
//                   {option.label}
//                 </Option>
//               ))}
//             </Select>
//           </div> */}

//           <div className="flex items-end">
//             <Button
//               type="default"
//               icon={<EyeOutlined className="h-4 w-4 mr-1" />}
//               onClick={handleViewPrescription}
//               className="border-blue-500 text-blue-500 hover:text-blue-600 hover:border-blue-600"
//             >
//               View Prescription
//             </Button>
//           </div>

//           <div>
//             <Text className="text-gray-500">Date</Text>
//             <Input
//               value={new Date().toLocaleDateString()}
//               disabled
//               className="mt-1"
//             />
//           </div>
//         </div>

//         <Title level={5} className="mb-4">
//           Products
//         </Title>

//         <div className="flex justify-end mb-4">
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => setProductsModalVisible(true)}
//             className="bg-blue-500 hover:bg-blue-600"
//           >
//             Add Product
//           </Button>
//         </div>

//         <Table
//           columns={columns}
//           dataSource={products}
//           rowKey="id"
//           loading={loading}
//           pagination={false}
//         />

//         <div className="flex justify-between items-center mt-6">
//           <Title level={5}>Total value</Title>
//           <Title level={5}>Rs.{totalValue.toLocaleString()}</Title>
//         </div>

//         <div className="flex justify-end mt-6 space-x-4">
//           <Button onClick={handleDiscard}>Discard</Button>
//           <Button
//             type="primary"
//             onClick={handleAddRecord}
//             className="bg-blue-500 hover:bg-blue-600"
//           >
//             Save Changes
//           </Button>
//         </div>
//       </Card>
//       <Modal
//         title="Prescription Image"
//         open={prescriptionModalVisible}
//         onCancel={() => setPrescriptionModalVisible(false)}
//         footer={[
//           <Button key="back" onClick={() => setPrescriptionModalVisible(false)}>
//             Close
//           </Button>,
//         ]}
//         width={800}
//       >
//         <div className="flex justify-center items-center p-4">
//           {imageLoading && <Spin size="large" />}
//           <Image
//             src={prescriptionImage || "/api/placeholder/400/600"}
//             alt="Prescription"
//             style={{ maxHeight: "600px" }}
//             onLoad={() => setImageLoading(false)}
//             fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
//           />
//         </div>
//       </Modal>

//       {/* Add Product Modal */}
//       <Modal
//         title="Add Product"
//         open={productsModalVisible}
//         onCancel={() => {
//           setProductsModalVisible(false);
//           setSelectedProduct(null);
//           setProductQuantity(1);
//           setSearchQuery("");
//           setSearchResults([]);
//         }}
//         footer={null}
//       >
//         <div className="space-y-4">
//           <div>
//             <Text className="text-gray-500">Product Name</Text>
//             <Input
//               placeholder="Start typing product name..."
//               prefix={<SearchOutlined />}
//               value={searchQuery}
//               onChange={handleSearchChange}
//               className="mt-1"
//             />
//           </div>

//           {/* Product List - Showing as dropdown items rather than table */}
//           {searchResults.length > 0 && (
//             <div className="max-h-60 overflow-y-auto border rounded-md">
//               <List
//                 itemLayout="horizontal"
//                 dataSource={searchResults}
//                 renderItem={(item) => (
//                   <List.Item
//                     className={`cursor-pointer hover:bg-gray-100 ${
//                       selectedProduct?.id === item.id ? "bg-blue-50" : ""
//                     }`}
//                     onClick={() => handleProductSelect(item)}
//                   >
//                     <List.Item.Meta
//                       avatar={
//                         <Avatar
//                           icon={<MedicineBoxOutlined />}
//                           className={
//                             selectedProduct?.id === item.id
//                               ? "bg-blue-500"
//                               : "bg-gray-300"
//                           }
//                         />
//                       }
//                       title={
//                         <div className="flex justify-between">
//                           <span>{item.name}</span>
//                           <span className="font-medium text-blue-600">
//                             Rs.{item.price.toLocaleString()}
//                           </span>
//                         </div>
//                       }
//                       description={`Available: ${item.quantity_available} units`}
//                     />
//                   </List.Item>
//                 )}
//               />
//             </div>
//           )}

//           {/* Quantity field is always visible */}
//           <div className="mt-4">
//             <Text className="text-gray-500">Quantity</Text>
//             <InputNumber
//               min={1}
//               value={productQuantity}
//               onChange={(value) => {
//                 // Ensure the value is a positive integer or null
//                 if (value === null || value === "") {
//                   setProductQuantity(1); // Set to minimum if cleared
//                 } else {
//                   const num = parseInt(value, 10);
//                   if (!isNaN(num)) {
//                     setProductQuantity(Math.max(1, num)); // Ensure at least 1
//                   }
//                 }
//               }}
//               className="w-full mt-1"
//               placeholder="Enter product quantity"
//               // Prevent typing non-numeric characters
//               onKeyPress={(e) => {
//                 if (!/[0-9]/.test(e.key)) {
//                   e.preventDefault();
//                 }
//               }}
//               // Ensure only numbers are entered (handles paste operations)
//               onInput={(e) => {
//                 e.target.value = e.target.value.replace(/[^0-9]/g, "");
//               }}
//             />
//           </div>

//           {/* Product details summary when selected */}
//           {selectedProduct && (
//             <div className="mt-4 p-3 bg-blue-50 rounded-md">
//               <Title level={5}>Selected Product</Title>
//               <div className="flex justify-between">
//                 <Text strong>Name:</Text>
//                 <Text>{selectedProduct.name}</Text>
//               </div>
//               <div className="flex justify-between">
//                 <Text strong>Price:</Text>
//                 <Text>Rs.{selectedProduct.price.toLocaleString()}</Text>
//               </div>
//               <div className="flex justify-between">
//                 <Text strong>Total Value:</Text>
//                 <Text>
//                   Rs.
//                   {(selectedProduct.price * productQuantity).toLocaleString()}
//                 </Text>
//               </div>
//             </div>
//           )}

//           <div className="flex justify-end mt-6 space-x-4">
//             <Button
//               onClick={() => {
//                 setProductsModalVisible(false);
//                 setSelectedProduct(null);
//                 setProductQuantity(1);
//                 setSearchQuery("");
//                 setSearchResults([]);
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="primary"
//               onClick={handleAddProduct}
//               disabled={!selectedProduct || productQuantity < 1}
//               className="bg-blue-500 hover:bg-blue-600"
//             >
//               Add Product
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       {/* Edit Product Modal - MODIFIED TO ONLY ALLOW QUANTITY CHANGES */}
//       <Modal
//         title="Update Product Quantity"
//         open={editModalVisible}
//         onCancel={() => setEditModalVisible(false)}
//         onOk={handleUpdateProduct}
//       >
//         {selectedProductRow && (
//           <div className="space-y-4">
//             <div className="p-3 bg-gray-50 rounded-md mb-4">
//               <div className="flex justify-between mb-2">
//                 <Text strong>Product:</Text>
//                 <Text>{selectedProductRow.name}</Text>
//               </div>
//               <div className="flex justify-between">
//                 <Text strong>Price:</Text>
//                 <Text className="text-blue-600">
//                   Rs.{selectedProductRow.price.toLocaleString()}
//                 </Text>
//               </div>
//             </div>

//             <Form form={editForm} layout="vertical">
//               <Form.Item
//                 name="quantity"
//                 label="Quantity"
//                 rules={[
//                   { required: true, message: "Please enter quantity" },
//                   {
//                     validator: (_, value) => {
//                       if (value && (isNaN(value) || value < 1)) {
//                         return Promise.reject(
//                           "Please enter a valid positive number"
//                         );
//                       }
//                       return Promise.resolve();
//                     },
//                   },
//                 ]}
//               >
//                 <InputNumber
//                   min={1}
//                   className="w-full"
//                   placeholder="Enter new quantity"
//                   // Prevent typing non-numeric characters
//                   onKeyPress={(e) => {
//                     if (!/[0-9]/.test(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   // Ensure only numbers are entered (handles paste operations)
//                   onInput={(e) => {
//                     e.target.value = e.target.value.replace(/[^0-9]/g, "");
//                   }}
//                 />
//               </Form.Item>

//               <div className="mt-2 text-gray-500 text-sm">
//                 <Text italic>
//                   Note: Only quantity can be changed. Product price cannot be
//                   modified.
//                 </Text>
//               </div>
//             </Form>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default PrescriptionProductManagement;

////////////////////////////////working code/////////////////////////////////////

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Table,
  Input,
  Modal,
  Form,
  InputNumber,
  message,
  Select,
  Typography,
  Divider,
  List,
  Image,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  MedicineBoxOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

const PrescriptionProductManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data from location state
  const {
    prescriptionId,
    customerId,
    prescriptionState: initialState,
    isFromPrescriptionSelection,
  } = location.state || {};

  const [currentPrescriptionState, setCurrentPrescriptionState] = useState(
    initialState || "Pending"
  );
  const [products, setProducts] = useState([]);
  const [productsModalVisible, setProductsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedProductRow, setSelectedProductRow] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [prescriptionModalVisible, setPrescriptionModalVisible] =
    useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [availabilityOptions] = useState([
    { value: "Available", label: "Available" },
    { value: "Not available", label: "Not available" },
    { value: "Pending", label: "Pending" },
    { value: "Ready for pickup", label: "Ready for pickup" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Delayed", label: "Delayed" },
    { value: "Out for delivery", label: "Out for delivery" },
  ]);

  // Validate if we have the required data
  useEffect(() => {
    if (!prescriptionId || !customerId) {
      message.error("Missing prescription or customer information");
      navigate(-1);
    }
  }, [prescriptionId, customerId, navigate]);

  useEffect(() => {
    if (prescriptionId) {
      fetchPrescriptionProducts();
      fetchPrescriptionImage();
    }
  }, [prescriptionId]);

  useEffect(() => {
    // Calculate total value whenever products change
    const newTotal = products.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0);
    setTotalValue(newTotal);
  }, [products]);

  const fetchPrescriptionImage = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch prescription details to get the file path
      const response = await axios.get(
        `/api/staff-sales/prescriptions/${prescriptionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success && response.data.prescription) {
        setPrescriptionImage(response.data.prescription.file_path);
      } else {
        console.error(
          "Error fetching prescription image:",
          response.data.message
        );
        // Use a fallback image or show an error message
      }
    } catch (error) {
      console.error("Error fetching prescription image:", error);
      // Handle error - maybe set a fallback image path
    }
  };

  const fetchPrescriptionProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      console.log(`Fetching products for prescription ${prescriptionId}`);

      const response = await axios.get(
        `/api/staff-sales/prescriptions/${prescriptionId}/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Prescription products response:", response.data);

      if (response.data.success) {
        // If the API request is successful, set products from the response
        setProducts(response.data.products || []);

        // If there's prescription info in the response, set that too
        if (response.data.prescription) {
          const prescription = response.data.prescription;

          // If you need the prescription file path for the image modal
          setPrescriptionImage(prescription.file_path);

          // Optionally update prescription state if needed
          // setCurrentPrescriptionState(prescription.status);
        }
      } else {
        message.error(response.data.message || "Failed to load products");
        // Only use mock data in development mode as fallback
        if (process.env.NODE_ENV !== "production") {
          setMockProducts();
        }
      }
    } catch (error) {
      console.error("Error fetching prescription products:", error);
      console.error("Error details:", error.response?.data || error.message);
      message.error("Error loading products");

      // Only use mock data in development mode as fallback
      if (process.env.NODE_ENV !== "production") {
        setMockProducts();
      }
    } finally {
      setLoading(false);
    }
  };

  // Make sure to call this function whenever the prescriptionId changes
  useEffect(() => {
    if (prescriptionId) {
      fetchPrescriptionProducts();
    }
  }, [prescriptionId]);

  const setMockProducts = () => {
    const mockData = [];
    setProducts(mockData);
  };

  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Searching for products with query:", query);

      const response = await axios.get(`/api/staff-sales/products/search`, {
        params: { query },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Search response:", response.data);

      if (response.data.success) {
        // Filter out products with zero quantity
        const formattedResults = response.data.products
          .filter((product) => product.quantity_available > 0) // Only include in-stock products
          .map((product) => ({
            id: product.id,
            name: product.name,
            quantity_available: product.quantity_available,
            price: product.price,
            requires_prescription: product.requires_prescription,
          }));

        setSearchResults(formattedResults);

        // Show message if any products were filtered out
        if (response.data.products.length > formattedResults.length) {
          message.info(
            "Some products were excluded because they are out of stock"
          );
        }
      } else {
        console.error("Search failed:", response.data.message);
        message.error(response.data.message || "Search failed");
        // For demonstration/testing, fall back to mock data when API fails
        setMockSearchResults();
      }
    } catch (error) {
      console.error("Error searching products:", error);
      console.error("Error details:", error.response?.data || error.message);
      message.error("Error during product search");

      // For demonstration/testing, fall back to mock data when API fails
      setMockSearchResults();
    }
  };

  const setMockSearchResults = () => {
    const mockResults = [
      {
        id: "12152",
        name: "Paracetamol 500mg",
        quantity_available: 500,
        price: 45,
      },
      {
        id: "515161",
        name: "Amoxicillin 250mg",
        quantity_available: 350,
        price: 120,
      },
      {
        id: "52562",
        name: "Ibuprofen 400mg",
        quantity_available: 420,
        price: 60,
      },
      {
        id: "52563",
        name: "Aspirin 100mg",
        quantity_available: 300,
        price: 35,
      },
      {
        id: "52564",
        name: "Loratadine 10mg",
        quantity_available: 200,
        price: 80,
      },
    ];
    setSearchResults(mockResults);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchProducts(query);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleAddProduct = async () => {
    if (!selectedProduct) {
      message.error("Please select a product");
      return;
    }

    if (!productQuantity || productQuantity < 1) {
      message.error("Please enter a valid quantity");
      return;
    }

    // Check if product is already in the prescription
    const existingProduct = products.find((p) => p.id === selectedProduct.id);
    if (existingProduct) {
      message.error(
        "This product is already in the prescription. Please edit the existing entry instead."
      );
      return;
    }

    // Add an additional check to ensure quantity requested doesn't exceed available stock
    if (productQuantity > selectedProduct.quantity_available) {
      message.error(
        `Only ${selectedProduct.quantity_available} items available in stock`
      );
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Log the data being sent to the API
      console.log("Adding product with data:", {
        productId: selectedProduct.id,
        quantity: productQuantity,
        price: selectedProduct.price,
      });

      const response = await axios.post(
        `/api/staff-sales/prescriptions/${prescriptionId}/products`,
        {
          productId: selectedProduct.id,
          quantity: productQuantity,
          price: selectedProduct.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      //console.log("Add product response:", response.data);

      if (response.data.success) {
        message.success("Product added successfully");

        // Create a new product entry with the correct format for the table
        const newProduct = {
          id: selectedProduct.id,
          name: selectedProduct.name,
          quantity: productQuantity,
          price: selectedProduct.price,
          // Calculate the value for the table display
          value: selectedProduct.price * productQuantity,
        };

        // Add the new product to the list
        setProducts([...products, newProduct]);

        // Reset UI state
        setProductsModalVisible(false);
        setSelectedProduct(null);
        setProductQuantity(1);
        setSearchQuery("");
        setSearchResults([]);
      } else {
        message.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      console.error("Error details:", error.response?.data || error.message);
      message.error("Error adding product to prescription");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (record) => {
    setSelectedProductRow(record);
    editForm.setFieldsValue({
      quantity: record.quantity,
    });
    setEditModalVisible(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const values = await editForm.validateFields();
      const token = localStorage.getItem("token");

      // Call API to update quantity
      const response = await axios.put(
        `/api/staff-sales/prescriptions/${prescriptionId}/products/${selectedProductRow.id}`,
        {
          quantity: values.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Update local state
        const updatedProducts = products.map((p) => {
          if (p.id === selectedProductRow.id) {
            return {
              ...p,
              quantity: values.quantity,
              value: values.quantity * p.price,
            };
          }
          return p;
        });

        setProducts(updatedProducts);
        message.success("Product quantity updated successfully");
        setEditModalVisible(false);
      } else {
        message.error(response.data.message || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Error updating product quantity");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `/api/staff-sales/prescriptions/${prescriptionId}/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Remove product from local state
        const updatedProducts = products.filter((p) => p.id !== productId);
        setProducts(updatedProducts);
        message.success("Product removed successfully");
      } else {
        message.error(response.data.message || "Failed to remove product");
      }
    } catch (error) {
      console.error("Error removing product:", error);
      message.error("Error removing product");
    }
  };

  const updatePrescriptionState = async (newState) => {
    try {
      const token = localStorage.getItem("token");
      const staffId = localStorage.getItem("userId");

      const response = await axios.put(
        `/api/staff-sales/prescriptions/${prescriptionId}/status`,
        { status: newState, staffId: staffId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // For demo purposes, just update the local state
      setCurrentPrescriptionState(newState);
      message.success(`Prescription status updated to ${newState}`);
    } catch (error) {
      console.error("Error updating prescription state:", error);
      message.error("Error updating prescription state");
    }
  };

  const handleAddRecord = async () => {
    try {
      if (products.length === 0) {
        message.error("Please add at least one product");
        return;
      }

      const token = localStorage.getItem("token");

      // Update prescription status to "Available"
      const response = await axios.put(
        `/api/staff-sales/prescriptions/${prescriptionId}/status`,
        {
          status: "Available",
          reduceInventory: true, // Add this if you want to reduce inventory on save
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setCurrentPrescriptionState("Available");
        message.success("Prescription saved successfully");
        message.success("Customer notification sent");

        // Navigate back after a short delay
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      } else {
        message.error(response.data.message || "Failed to save prescription");
      }
    } catch (error) {
      console.error("Error saving record:", error);
      message.error("Error saving record");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDiscard = () => {
    // Show confirmation dialog before discarding changes
    Modal.confirm({
      title: "Discard changes?",
      content:
        "Any unsaved changes will be lost. Are you sure you want to continue?",
      okText: "Yes, discard",
      cancelText: "No, keep editing",
      onOk: () => {
        navigate(-1);
      },
    });
  };

  const columns = [
    {
      title: "Product ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `Rs.${price.toLocaleString()}`,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (_, record) =>
        `Rs.${(record.price * record.quantity).toLocaleString()}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProduct(record.id)}
          />
        </div>
      ),
    },
  ];
  const handleViewPrescription = () => {
    setPrescriptionModalVisible(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={handleGoBack}
          className="mr-4"
        >
          Back to Prescriptions
        </Button>
        <Title level={4} className="m-0">
          Prescription Product Management
        </Title>
      </div>

      <Card title="Manage Prescription" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Text className="text-gray-500">Prescription ID</Text>
            <Input value={prescriptionId} disabled className="mt-1" />
          </div>
          <div>
            <Text className="text-gray-500">Customer ID</Text>
            <Input value={customerId} disabled className="mt-1" />
          </div>

          <div className="flex items-end">
            <Button
              type="default"
              icon={<EyeOutlined className="h-4 w-4 mr-1" />}
              onClick={handleViewPrescription}
              className="border-blue-500 text-blue-500 hover:text-blue-600 hover:border-blue-600"
            >
              View Prescription
            </Button>
          </div>

          <div>
            <Text className="text-gray-500">Date</Text>
            <Input
              value={new Date().toLocaleDateString()}
              disabled
              className="mt-1"
            />
          </div>
        </div>

        <Title level={5} className="mb-4">
          Products
        </Title>

        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setProductsModalVisible(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Add Product
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          pagination={false}
        />

        <div className="flex justify-between items-center mt-6">
          <Title level={5}>Total value</Title>
          <Title level={5}>Rs.{totalValue.toLocaleString()}</Title>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <Button onClick={handleDiscard}>Discard</Button>
          <Button
            type="primary"
            onClick={handleAddRecord}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Save Changes
          </Button>
        </div>
      </Card>
      <Modal
        title="Prescription Image"
        open={prescriptionModalVisible}
        onCancel={() => setPrescriptionModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPrescriptionModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <div className="flex justify-center items-center p-4">
          {imageLoading && <Spin size="large" />}
          <Image
            src={prescriptionImage || "/api/placeholder/400/600"}
            alt="Prescription"
            style={{ maxHeight: "600px" }}
            onLoad={() => setImageLoading(false)}
            fallback="data:image/png;base64,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"
          />
        </div>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        title="Add Product"
        open={productsModalVisible}
        onCancel={() => {
          setProductsModalVisible(false);
          setSelectedProduct(null);
          setProductQuantity(1);
          setSearchQuery("");
          setSearchResults([]);
        }}
        footer={null}
      >
        <div className="space-y-4">
          <div>
            <Text className="text-gray-500">Product Name</Text>
            <Input
              placeholder="Start typing product name..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={handleSearchChange}
              className="mt-1"
            />
          </div>

          {/* Product List - Showing as dropdown items rather than table */}
          {searchResults.length > 0 && (
            <div className="max-h-60 overflow-y-auto border rounded-md">
              <List
                itemLayout="horizontal"
                dataSource={searchResults}
                renderItem={(item) => (
                  <List.Item
                    className={`cursor-pointer hover:bg-gray-100 ${
                      selectedProduct?.id === item.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleProductSelect(item)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<MedicineBoxOutlined />}
                          className={
                            selectedProduct?.id === item.id
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }
                        />
                      }
                      title={
                        <div className="flex justify-between">
                          <span>{item.name}</span>
                          <span className="font-medium text-blue-600">
                            Rs.{item.price.toLocaleString()}
                          </span>
                        </div>
                      }
                      description={`Available: ${item.quantity_available} units`}
                    />
                  </List.Item>
                )}
              />
            </div>
          )}

          {/* Quantity field is always visible */}
          <div className="mt-4">
            <Text className="text-gray-500">Quantity</Text>
            <InputNumber
              min={1}
              value={productQuantity}
              onChange={(value) => {
                // Ensure the value is a positive integer or null
                if (value === null || value === "") {
                  setProductQuantity(1); // Set to minimum if cleared
                } else {
                  const num = parseInt(value, 10);
                  if (!isNaN(num)) {
                    setProductQuantity(Math.max(1, num)); // Ensure at least 1
                  }
                }
              }}
              className="w-full mt-1"
              placeholder="Enter product quantity"
              // Prevent typing non-numeric characters
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              // Ensure only numbers are entered (handles paste operations)
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
          </div>

          {/* Product details summary when selected */}
          {selectedProduct && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <Title level={5}>Selected Product</Title>
              <div className="flex justify-between">
                <Text strong>Name:</Text>
                <Text>{selectedProduct.name}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Price:</Text>
                <Text>Rs.{selectedProduct.price.toLocaleString()}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Total Value:</Text>
                <Text>
                  Rs.
                  {(selectedProduct.price * productQuantity).toLocaleString()}
                </Text>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6 space-x-4">
            <Button
              onClick={() => {
                setProductsModalVisible(false);
                setSelectedProduct(null);
                setProductQuantity(1);
                setSearchQuery("");
                setSearchResults([]);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleAddProduct}
              disabled={!selectedProduct || productQuantity < 1}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Add Product
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal - MODIFIED TO ONLY ALLOW QUANTITY CHANGES */}
      <Modal
        title="Update Product Quantity"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleUpdateProduct}
      >
        {selectedProductRow && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <Text strong>Product:</Text>
                <Text>{selectedProductRow.name}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Price:</Text>
                <Text className="text-blue-600">
                  Rs.{selectedProductRow.price.toLocaleString()}
                </Text>
              </div>
            </div>

            <Form form={editForm} layout="vertical">
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[
                  { required: true, message: "Please enter quantity" },
                  {
                    validator: (_, value) => {
                      if (value && (isNaN(value) || value < 1)) {
                        return Promise.reject(
                          "Please enter a valid positive number"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  className="w-full"
                  placeholder="Enter new quantity"
                  // Prevent typing non-numeric characters
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  // Ensure only numbers are entered (handles paste operations)
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                />
              </Form.Item>

              <div className="mt-2 text-gray-500 text-sm">
                <Text italic>
                  Note: Only quantity can be changed. Product price cannot be
                  modified.
                </Text>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PrescriptionProductManagement;
