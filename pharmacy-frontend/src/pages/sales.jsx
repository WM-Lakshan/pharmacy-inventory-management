// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal, Input, Select, Tooltip, message } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   PlusOutlined,
//   EyeOutlined,
// } from "@ant-design/icons";
// import axios from "axios";

// const { Option } = Select;

// const Sales = () => {
//   // State management
//   const [sales, setSales] = useState([]);
//   const [viewMode, setViewMode] = useState("list"); // list, view, edit
//   const [selectedSale, setSelectedSale] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [isAddProductModalVisible, setIsAddProductModalVisible] =
//     useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [productSearchResults, setProductSearchResults] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     product_id: "",
//     product_name: "",
//     quantity: "",
//     price: "",
//     value: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     status: "all",
//     dateRange: null,
//   });

//   // Fetch sales data
//   useEffect(() => {
//     fetchSales();
//     fetchProducts();
//   }, []);

//   const fetchSales = async () => {
//     setLoading(true);
//     try {
//       // Replace with your actual API endpoint
//       const response = await axios.get("/api/sales");
//       setSales(Array.isArray(response?.data) ? response.data : []);
//     } catch (error) {
//       console.error("Error fetching sales:", error);
//       message.error("Failed to load sales data");
//       // Using mock data for development
//       setSales(Array.isArray(mockSalesData) ? mockSalesData : []);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       // Replace with your actual API endpoint
//       const response = await axios.get("/api/products");
//       setProducts(response.data || mockProductsData);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       // Using mock data for development
//       setProducts(mockProductsData);
//     }
//   };

//   // Handle clicking on a sale row
//   const handleViewSale = (sale) => {
//     setSelectedSale(sale);
//     setViewMode("view");
//   };

//   // Handle edit button click
//   const handleEditSale = () => {
//     setViewMode("edit");
//   };

//   // Handle delete sale
//   const handleDeleteSale = async (saleId) => {
//     try {
//       await axios.delete(`/api/sales/${saleId}`);
//       message.success("Sale deleted successfully");
//       fetchSales();
//       setViewMode("list");
//     } catch (error) {
//       console.error("Error deleting sale:", error);
//       message.error("Failed to delete sale");
//     }
//   };

//   // Handle add product button in edit view
//   const showAddProductModal = () => {
//     setIsAddProductModalVisible(true);
//   };

//   // Handle product search
//   const handleProductSearch = (value) => {
//     setSearchTerm(value);
//     if (value.trim() === "") {
//       setProductSearchResults([]);
//       return;
//     }

//     const results = products.filter((product) =>
//       product.name.toLowerCase().includes(value.toLowerCase())
//     );
//     setProductSearchResults(results);
//   };

//   // Handle selecting a product from search results
//   const handleSelectProduct = (product) => {
//     setNewProduct({
//       product_id: product.id,
//       product_name: product.name,
//       quantity: 1,
//       price: product.price,
//       value: product.price, // Initial value is price * quantity = 1
//     });
//     setProductSearchResults([]);
//   };

//   // Handle quantity change for new product
//   const handleQuantityChange = (value) => {
//     const quantity = parseInt(value) || 0;
//     setNewProduct({
//       ...newProduct,
//       quantity,
//       value: quantity * (parseFloat(newProduct.price) || 0),
//     });
//   };

//   // Add product to sale
//   const handleAddProduct = () => {
//     if (!newProduct.product_id || !newProduct.quantity) {
//       message.error("Please select a product and specify quantity");
//       return;
//     }

//     const updatedSale = { ...selectedSale };
//     updatedSale.products = [...updatedSale.products, { ...newProduct }];

//     // Recalculate total value
//     updatedSale.totalValue = updatedSale.products.reduce(
//       (sum, product) => sum + product.value,
//       0
//     );

//     setSelectedSale(updatedSale);
//     setIsAddProductModalVisible(false);
//     setNewProduct({
//       product_id: "",
//       product_name: "",
//       quantity: "",
//       price: "",
//       value: 0,
//     });

//     message.success("Product added successfully");
//   };

//   // Handle edit product in sale
//   const handleEditProduct = (index) => {
//     const productToEdit = selectedSale.products[index];
//     setNewProduct({
//       product_id: productToEdit.product_id,
//       product_name: productToEdit.product_name,
//       quantity: productToEdit.quantity,
//       price: productToEdit.price,
//       value: productToEdit.value,
//       editIndex: index,
//     });
//     setIsAddProductModalVisible(true);
//   };

//   // Handle delete product from sale
//   const handleDeleteProduct = (index) => {
//     const updatedSale = { ...selectedSale };
//     updatedSale.products = updatedSale.products.filter((_, i) => i !== index);

//     // Recalculate total value
//     updatedSale.totalValue = updatedSale.products.reduce(
//       (sum, product) => sum + product.value,
//       0
//     );

//     setSelectedSale(updatedSale);
//   };

//   // Save updated sale
//   const handleSaveSale = async () => {
//     try {
//       await axios.put(`/api/sales/${selectedSale.id}`, selectedSale);
//       message.success("Sale updated successfully");
//       setViewMode("view");
//       fetchSales();
//     } catch (error) {
//       console.error("Error updating sale:", error);
//       message.error("Failed to update sale");
//     }
//   };

//   // Handle filter changes
//   const handleFilterChange = (filterType, value) => {
//     setFilters({
//       ...filters,
//       [filterType]: value,
//     });
//   };

//   // Add new sale record
//   const handleAddRecord = () => {
//     const newSale = {
//       id: Math.floor(Math.random() * 10000),
//       order_id: "",
//       prescription_id: "",
//       value: 0,
//       customer_id: "",
//       staff_id: "",
//       time: new Date().toLocaleDateString(),
//       status: "Pending",
//       products: [],
//     };

//     setSelectedSale(newSale);
//     setViewMode("edit");
//   };

//   // Column definitions for sales table
//   const columns = [
//     {
//       title: "Order ID",
//       dataIndex: "order_id",
//       key: "order_id",
//     },
//     {
//       title: "Prescription ID",
//       dataIndex: "prescription_id",
//       key: "prescription_id",
//     },
//     {
//       title: "Value",
//       dataIndex: "value",
//       key: "value",
//       render: (value) => `Rs.${value}`,
//     },
//     {
//       title: "Customer ID",
//       dataIndex: "customer_id",
//       key: "customer_id",
//     },
//     {
//       title: "Staff ID",
//       dataIndex: "staff_id",
//       key: "staff_id",
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
//       render: (status) => {
//         let color = "gray";
//         if (status === "Confirmed") color = "blue";
//         else if (status === "Out for delivery") color = "green";
//         else if (status === "Delayed") color = "orange";

//         return <span style={{ color }}>{status}</span>;
//       },
//     },
//   ];

//   // Render sales list view
//   const renderSalesTable = () => (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <div className="flex justify-between mb-4 items-center">
//         <h2 className="text-xl font-semibold">Sales</h2>
//         <div className="flex gap-2">
//           <Select
//             placeholder="Filter by status"
//             style={{ width: 150 }}
//             onChange={(value) => handleFilterChange("status", value)}
//             value={filters.status}
//           >
//             <Option value="all">All</Option>
//             <Option value="Confirmed">Confirmed</Option>
//             <Option value="Out for delivery">Out for delivery</Option>
//             <Option value="Delayed">Delayed</Option>
//           </Select>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={handleAddRecord}
//           >
//             Add Record
//           </Button>
//         </div>
//       </div>

//       <Table
//         columns={columns}
//         dataSource={sales || []}
//         loading={loading}
//         rowKey="order_id"
//         onRow={(record) => ({
//           onClick: () => handleViewSale(record),
//           style: { cursor: "pointer" },
//         })}
//         pagination={{ pageSize: 10 }}
//       />
//     </div>
//   );

//   // Render sale detail view
//   const renderSaleDetail = () => {
//     if (!selectedSale) return null;

//     return (
//       <div className="bg-white p-6 rounded-lg shadow">
//         <div className="flex justify-between mb-6">
//           <h2 className="text-xl font-semibold">View Record</h2>
//           <div className="flex gap-2">
//             <Button icon={<EditOutlined />} onClick={handleEditSale}>
//               Edit
//             </Button>
//             <Button danger onClick={() => handleDeleteSale(selectedSale.id)}>
//               Delete
//             </Button>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6 mb-8">
//           <div>
//             <p className="text-gray-500 mb-1">Sales ID</p>
//             <p className="font-medium">{selectedSale.order_id}</p>
//           </div>
//           <div>
//             <p className="text-gray-500 mb-1">Prescription ID</p>
//             <p className="font-medium">{selectedSale.prescription_id}</p>
//           </div>
//           <div>
//             <p className="text-gray-500 mb-1">Customer ID</p>
//             <p className="font-medium">{selectedSale.customer_id}</p>
//           </div>
//           <div>
//             <p className="text-gray-500 mb-1">Staff ID</p>
//             <p className="font-medium">{selectedSale.staff_id}</p>
//           </div>
//           <div>
//             <p className="text-gray-500 mb-1">State</p>
//             <p className="font-medium">{selectedSale.status}</p>
//           </div>
//         </div>

//         <h3 className="text-lg font-medium mb-4">Products</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-2 text-left text-gray-500">
//                   Product ID
//                 </th>
//                 <th className="px-4 py-2 text-left text-gray-500">
//                   Product Name
//                 </th>
//                 <th className="px-4 py-2 text-left text-gray-500">Quantity</th>
//                 <th className="px-4 py-2 text-left text-gray-500">Price</th>
//                 <th className="px-4 py-2 text-left text-gray-500">Value</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedSale.products?.map((product, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="px-4 py-2">{product.product_id}</td>
//                   <td className="px-4 py-2">{product.product_name}</td>
//                   <td className="px-4 py-2">{product.quantity}</td>
//                   <td className="px-4 py-2">Rs.{product.price}</td>
//                   <td className="px-4 py-2">Rs.{product.value}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-6 text-right">
//           <p className="text-lg font-medium">
//             Total value: Rs.{selectedSale.totalValue || 0}
//           </p>
//         </div>

//         <div className="mt-8 flex justify-end">
//           <Button onClick={() => setViewMode("list")}>Back to List</Button>
//         </div>
//       </div>
//     );
//   };

//   // Render edit sale view
//   const renderEditSale = () => {
//     if (!selectedSale) return null;

//     return (
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-6">Edit Record</h2>

//         <div className="grid grid-cols-2 gap-6 mb-8">
//           <div>
//             <p className="text-gray-500 mb-1">Sales ID</p>
//             <Input value={selectedSale.order_id} disabled />
//           </div>
//           <div>
//             <p className="text-gray-500 mb-1">Customer ID</p>
//             <Input
//               value={selectedSale.customer_id}
//               onChange={(e) =>
//                 setSelectedSale({
//                   ...selectedSale,
//                   customer_id: e.target.value,
//                 })
//               }
//             />
//           </div>
//           <div>
//             <p className="text-gray-500 mb-1">Manager ID</p>
//             <Input
//               value={selectedSale.staff_id}
//               onChange={(e) =>
//                 setSelectedSale({ ...selectedSale, staff_id: e.target.value })
//               }
//             />
//           </div>
//           <div>
//             <p className="text-gray-500 mb-1">State</p>
//             <Select
//               style={{ width: "100%" }}
//               value={selectedSale.status}
//               onChange={(value) =>
//                 setSelectedSale({ ...selectedSale, status: value })
//               }
//             >
//               <Option value="Pending">Pending</Option>
//               <Option value="Confirmed">Confirmed</Option>
//               <Option value="Out for delivery">Out for delivery</Option>
//               <Option value="Delayed">Delayed</Option>
//             </Select>
//           </div>
//         </div>

//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-medium">Products</h3>
//           <Button type="primary" onClick={showAddProductModal}>
//             Add Product
//           </Button>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-2 text-left text-gray-500">
//                   Product ID
//                 </th>
//                 <th className="px-4 py-2 text-left text-gray-500">
//                   Product Name
//                 </th>
//                 <th className="px-4 py-2 text-left text-gray-500">Quantity</th>
//                 <th className="px-4 py-2 text-left text-gray-500">Price</th>
//                 <th className="px-4 py-2 text-left text-gray-500">Value</th>
//                 <th className="px-4 py-2 text-left text-gray-500">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedSale.products?.map((product, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="px-4 py-2">{product.product_id}</td>
//                   <td className="px-4 py-2">{product.product_name}</td>
//                   <td className="px-4 py-2">{product.quantity}</td>
//                   <td className="px-4 py-2">Rs.{product.price}</td>
//                   <td className="px-4 py-2">Rs.{product.value}</td>
//                   <td className="px-4 py-2">
//                     <div className="flex gap-2">
//                       <Button
//                         size="small"
//                         icon={<EditOutlined />}
//                         onClick={() => handleEditProduct(index)}
//                       />
//                       <Button
//                         size="small"
//                         danger
//                         icon={<DeleteOutlined />}
//                         onClick={() => handleDeleteProduct(index)}
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-6 text-right">
//           <p className="text-lg font-medium">
//             Total value: Rs.{selectedSale.totalValue || 0}
//           </p>
//         </div>

//         <div className="mt-8 flex justify-end gap-2">
//           <Button onClick={() => setViewMode("view")}>Discard</Button>
//           <Button type="primary" onClick={handleSaveSale}>
//             Save
//           </Button>
//         </div>
//       </div>
//     );
//   };

//   // Render add product modal
//   const renderAddProductModal = () => (
//     <Modal
//       title="Add Product"
//       open={isAddProductModalVisible}
//       onCancel={() => setIsAddProductModalVisible(false)}
//       footer={[
//         <Button key="cancel" onClick={() => setIsAddProductModalVisible(false)}>
//           Discard
//         </Button>,
//         <Button key="add" type="primary" onClick={handleAddProduct}>
//           Add Product
//         </Button>,
//       ]}
//     >
//       <div className="space-y-4">
//         <div>
//           <p className="mb-1">Product Name</p>
//           <Input
//             placeholder="Enter product name"
//             value={searchTerm}
//             onChange={(e) => handleProductSearch(e.target.value)}
//           />
//           {productSearchResults.length > 0 && (
//             <div className="mt-2 border rounded max-h-40 overflow-y-auto">
//               {productSearchResults.map((product) => (
//                 <div
//                   key={product.id}
//                   className="p-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => handleSelectProduct(product)}
//                 >
//                   {product.name}
//                 </div>
//               ))}
//             </div>
//           )}
//           {newProduct.product_name && (
//             <p className="mt-1 text-blue-500">
//               Selected: {newProduct.product_name}
//             </p>
//           )}
//         </div>

//         <div>
//           <p className="mb-1">Quantity</p>
//           <Input
//             type="number"
//             placeholder="Enter product quantity"
//             value={newProduct.quantity}
//             onChange={(e) => handleQuantityChange(e.target.value)}
//             min={1}
//           />
//         </div>

//         {newProduct.price && (
//           <div className="flex justify-between">
//             <p>Price: Rs.{newProduct.price}</p>
//             <p>Total: Rs.{newProduct.value}</p>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );

//   // Mock data for development
//   const mockSalesData = [
//     {
//       id: 1,
//       order_id: "12152",
//       prescription_id: "2216263",
//       value: 4306,
//       customer_id: "2216263",
//       staff_id: "7535",
//       time: "11/12/22",
//       status: "Delayed",
//       products: [
//         {
//           product_id: "12152",
//           product_name: "aedcaeaed",
//           quantity: 2216263,
//           price: 7535,
//           value: 111222,
//         },
//         {
//           product_id: "515161",
//           product_name: "acacfadc",
//           quantity: 2152151512,
//           price: 5724,
//           value: 211222,
//         },
//         {
//           product_id: "52562",
//           product_name: "ascadCddc",
//           quantity: 15155,
//           price: 2775,
//           value: 51222,
//         },
//       ],
//       totalValue: 15155,
//     },
//     {
//       id: 2,
//       order_id: "515161",
//       prescription_id: "2152151512",
//       value: 2557,
//       customer_id: "2152151512",
//       staff_id: "5724",
//       time: "21/12/22",
//       status: "Confirmed",
//       products: [],
//     },
//     {
//       id: 3,
//       order_id: "52562",
//       prescription_id: "15155",
//       value: 4075,
//       customer_id: "15155",
//       staff_id: "2775",
//       time: "5/12/22",
//       status: "Out for delivery",
//       products: [],
//     },
//   ];

//   const mockProductsData = [
//     { id: "12152", name: "aedcaeaed", price: 7535 },
//     { id: "515161", name: "acacfadc", price: 5724 },
//     { id: "52562", name: "ascadCddc", price: 2775 },
//     { id: "12345", name: "Paracetamol", price: 500 },
//     { id: "12346", name: "Amoxicillin", price: 1200 },
//     { id: "12347", name: "Ibuprofen", price: 450 },
//   ];

//   // Main render
//   return (
//     <div className="p-6">
//       {viewMode === "list" && renderSalesTable()}
//       {viewMode === "view" && renderSaleDetail()}
//       {viewMode === "edit" && renderEditSale()}
//       {renderAddProductModal()}
//     </div>
//   );
// };

// export default Sales;

//////////////////////////////////////////////////// with add ////////////////////////////////////////////////////////////////
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
  Tooltip,
  message,
  DatePicker,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const Sales = () => {
  // State management
  const [sales, setSales] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // list, view, edit
  const [selectedSale, setSelectedSale] = useState(null);
  const [products, setProducts] = useState([]);
  const [isAddProductModalVisible, setIsAddProductModalVisible] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearchResults, setProductSearchResults] = useState([]);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [currentOrderProducts, setCurrentOrderProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    product_id: "",
    product_name: "",
    quantity: "",
    price: "",
    value: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: null,
  });
  const navigate = useNavigate();

  // Fetch sales data
  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication required. Please log in.");
        navigate("/");
        return;
      }

      const response = await axios.get("/api/sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data);

      // Check if the response has the expected structure
      if (response.data && response.data.success) {
        setSales(response.data.sales || []);
      } else if (Array.isArray(response.data)) {
        // Handle case where API directly returns an array
        setSales(response.data);
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      message.error("Failed to load sales data");

      // For development purposes, use mock data
      setSales(mockSalesData);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication required. Please log in.");
        navigate("/");
        return;
      }

      const response = await axios.get("/api/sales/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Products API Response:", response.data);

      if (response.data && response.data.success) {
        setProducts(response.data.products || []);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        throw new Error("Unexpected API response format for products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to load products data");

      // For development purposes, use mock data
      setProducts(mockProductsData);
    }
  };

  // Handle clicking on a sale row
  const handleViewSale = (sale) => {
    console.log("Viewing sale:", sale);
    setSelectedSale(sale);

    // Set currentOrderProducts from the sale, if available
    if (sale && Array.isArray(sale.products)) {
      console.log(
        `Setting ${sale.products.length} products from selected sale`
      );
      setCurrentOrderProducts(sale.products);
    } else {
      console.log(
        "No products found in selected sale, clearing current products"
      );
      setCurrentOrderProducts([]);

      // If the sale has an ID, try to fetch the products
      if (sale && sale.order_id) {
        fetchSaleProducts(sale.order_id);
      }
    }

    setViewMode("view");
  };

  const fetchSaleProducts = async (saleId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication required. Please log in.");
        return;
      }

      console.log(`Fetching products for sale ID: ${saleId}`);

      const response = await axios.get(`/api/sales/${saleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Sale details response:", response.data);

      // Check the response structure and extract products
      if (response.data && response.data.success && response.data.sale) {
        // If the API returns sale with products included
        if (Array.isArray(response.data.sale.products)) {
          console.log(
            `Found ${response.data.sale.products.length} products in API response`
          );
          setCurrentOrderProducts(response.data.sale.products);

          // Update the selected sale with products to keep everything in sync
          setSelectedSale((prev) => ({
            ...prev,
            products: response.data.sale.products,
          }));
        } else {
          console.warn("Products array not found in API response");
          setMockOrderProducts(); // Fallback to mock data
        }
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error fetching sale products:", error);
      message.error("Failed to load sale products");
      setMockOrderProducts(); // Fallback to mock data
    }
  };

  // Handle edit button click
  const handleEditSale = () => {
    setViewMode("edit");
  };

  // Handle delete sale
  const handleDeleteSale = async (saleId) => {
    try {
      const response = await axios.delete(`/api/sales/${saleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      message.success("Sale deleted successfully");
      fetchSales();
      setViewMode("list");
    } catch (error) {
      console.error("Error deleting sale:", error);
      message.error("Failed to delete sale");
    }
  };

  // Handle add product button in edit view
  const showAddProductModal = () => {
    setIsAddProductModalVisible(true);
    setSearchTerm("");
    setProductSearchResults([]);
    setNewProduct({
      product_id: "",
      product_name: "",
      quantity: "",
      price: "",
      value: 0,
    });
  };

  // Handle product search
  const handleProductSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setProductSearchResults([]);
      return;
    }

    const results = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setProductSearchResults(results);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setFilters({
      ...filters,
      dateRange: dates,
    });
  };

  // Filter sales data based on selected filters
  const getFilteredSales = () => {
    let filteredData = [...sales];

    // Filter by status
    if (filters.status !== "all") {
      filteredData = filteredData.filter(
        (sale) => sale.status === filters.status
      );
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const startDate = filters.dateRange[0].startOf("day");
      const endDate = filters.dateRange[1].endOf("day");

      filteredData = filteredData.filter((sale) => {
        const saleDate = moment(sale.time, "DD/MM/YY"); // Adjust format to match your data
        return saleDate.isBetween(startDate, endDate, null, "[]");
      });
    }

    return filteredData;
  };

  // Handle selecting a product from search results
  const handleSelectProduct = (product) => {
    setNewProduct({
      product_id: product.id,
      product_name: product.name,
      quantity: 1,
      price: product.price,
      value: product.price, // Initial value is price * quantity = 1
    });
    setProductSearchResults([]);
    setSearchTerm(product.name);
  };

  // Handle quantity change for new product
  const handleQuantityChange = (value) => {
    const quantity = parseInt(value) || 0;
    const price = parseFloat(newProduct.price) || 0;
    setNewProduct({
      ...newProduct,
      quantity,
      value: quantity * price,
    });
  };

  const handleViewDetails = async (order) => {
    setCurrentOrder(order);
    setDetailsModalVisible(true);
    setCurrentOrderProducts([]); // Clear previous products first

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication required. Please log in.");
        return;
      }

      console.log(`Fetching products for sale ID: ${order.order_id}`);

      const response = await axios.get(`/api/sales/${order.order_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Sale details response:", response.data);

      // Check the response structure and extract products
      if (response.data && response.data.success && response.data.sale) {
        // If the API returns sale with products included
        if (Array.isArray(response.data.sale.products)) {
          setCurrentOrderProducts(response.data.sale.products);
        } else {
          console.warn("Products array not found in API response");
          setMockOrderProducts(); // Fallback to mock data
        }
      } else if (response.data && Array.isArray(response.data.products)) {
        // If the API directly returns products array
        setCurrentOrderProducts(response.data.products);
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error fetching sale products:", error);
      message.error("Failed to load sale products");
      setMockOrderProducts(); // Fallback to mock data
    }
  };

  // Handle price change for new product
  const handlePriceChange = (value) => {
    const price = parseFloat(value) || 0;
    const quantity = parseInt(newProduct.quantity) || 0;
    setNewProduct({
      ...newProduct,
      price: value,
      value: quantity * price,
    });
  };

  // Add product to sale
  const handleAddProduct = () => {
    if (!newProduct.product_id || !newProduct.quantity || !newProduct.price) {
      message.error("Please select a product, specify quantity and price");
      return;
    }

    const updatedSale = { ...selectedSale };
    const productValue =
      parseFloat(newProduct.quantity) * parseFloat(newProduct.price);

    if (editingProductIndex !== null) {
      // Update existing product
      updatedSale.products[editingProductIndex] = {
        ...newProduct,
        value: productValue,
      };
    } else {
      // Add new product
      updatedSale.products = [
        ...updatedSale.products,
        {
          ...newProduct,
          value: productValue,
        },
      ];
    }

    // Recalculate total value
    updatedSale.totalValue = updatedSale.products.reduce(
      (sum, product) => sum + parseFloat(product.value || 0),
      0
    );

    setSelectedSale(updatedSale);
    setIsAddProductModalVisible(false);
    setEditingProductIndex(null);
    setNewProduct({
      product_id: "",
      product_name: "",
      quantity: "",
      price: "",
      value: 0,
    });
    message.success(
      editingProductIndex !== null
        ? "Product updated successfully"
        : "Product added successfully"
    );
  };

  // Handle edit product in sale
  const handleEditProduct = (index) => {
    const product = selectedSale.products[index];
    setNewProduct({
      product_id: product.product_id,
      product_name: product.product_name,
      quantity: product.quantity,
      price: product.price,
      value: product.value,
    });
    setEditingProductIndex(index);
    setSearchTerm(product.product_name);
    setIsAddProductModalVisible(true);
  };

  // Handle delete product from sale
  const handleDeleteProduct = (index) => {
    const updatedSale = { ...selectedSale };
    updatedSale.products = updatedSale.products.filter((_, i) => i !== index);

    // Recalculate total value
    updatedSale.totalValue = updatedSale.products.reduce(
      (sum, product) => sum + parseFloat(product.value || 0),
      0
    );

    setSelectedSale(updatedSale);
  };

  // Save updated sale
  const handleSaveSale = async () => {
    try {
      await axios.put(`/api/sales/${selectedSale.id}`, selectedSale);
      message.success("Sale updated successfully");
      setViewMode("view");
      fetchSales();
    } catch (error) {
      console.error("Error updating sale:", error);
      message.error("Failed to update sale");
    }
  };

  // Column definitions for sales table
  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
    },
    // {
    //   title: "Prescription ID",
    //   dataIndex: "prescription_id",
    //   key: "prescription_id",
    // },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => `Rs.${value}`,
    },
    {
      title: "Customer ID",
      dataIndex: "customer_id",
      key: "customer_id",
    },
    // {
    //   title: "Staff ID",
    //   dataIndex: "staff_id",
    //   key: "staff_id",
    // },
    {
      title: "Date",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "gray";
        if (status === "Confirmed") color = "blue";
        else if (status === "Out for delivery") color = "green";
        else if (status === "Delayed") color = "orange";

        return <span style={{ color }}>{status}</span>;
      },
    },
  ];

  // Render sales list view
  const renderSalesTable = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-xl font-semibold">Sales</h2>
        <div className="flex gap-2">
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            onChange={(value) => handleFilterChange("status", value)}
            value={filters.status}
          >
            <Option value="all">All</Option>
            <Option value="Confirmed">Confirmed</Option>
            <Option value="Out for delivery">Out for delivery</Option>
            <Option value="Delayed">Delayed</Option>
          </Select>
          <DatePicker.RangePicker
            onChange={handleDateRangeChange}
            value={filters.dateRange}
            format="DD/MM/YY"
            placeholder={["Start date", "End date"]}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={getFilteredSales()}
        loading={loading}
        rowKey="order_id"
        onRow={(record) => ({
          onClick: () => handleViewSale(record),
          style: { cursor: "pointer" },
        })}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );

  // Render sale detail view
  // const renderSaleDetail = () => {
  //   if (!selectedSale) return null;

  //   return (
  //     <div className="bg-white p-6 rounded-lg shadow">
  //       <div className="flex justify-between mb-6">
  //         <h2 className="text-xl font-semibold">View Record</h2>
  //         <div className="flex gap-2">
  //           <Button icon={<EditOutlined />} onClick={handleEditSale}>
  //             Edit
  //           </Button>
  //           <Button danger onClick={() => handleDeleteSale(selectedSale.id)}>
  //             Delete
  //           </Button>
  //         </div>
  //       </div>

  //       <div className="grid grid-cols-2 gap-6 mb-8">
  //         <div>
  //           <p className="text-gray-500 mb-1">Sales ID</p>
  //           <p className="font-medium">{selectedSale.order_id}</p>
  //         </div>
  //         <div>
  //           <p className="text-gray-500 mb-1">Prescription ID</p>
  //           <p className="font-medium">{selectedSale.prescription_id}</p>
  //         </div>
  //         <div>
  //           <p className="text-gray-500 mb-1">Customer ID</p>
  //           <p className="font-medium">{selectedSale.customer_id}</p>
  //         </div>
  //         {/* <div>
  //           <p className="text-gray-500 mb-1">Staff ID</p>
  //           <p className="font-medium">{selectedSale.staff_id}</p>
  //         </div> */}
  //         <div>
  //           <p className="text-gray-500 mb-1">Date</p>
  //           <p className="font-medium">{selectedSale.time}</p>
  //         </div>
  //         <div>
  //           <p className="text-gray-500 mb-1">State</p>
  //           <p className="font-medium">{selectedSale.status}</p>
  //         </div>
  //       </div>

  //       <h3 className="text-lg font-medium mb-4">Products</h3>
  //       <div className="overflow-x-auto">
  //         <table className="min-w-full table-auto">
  //           <thead className="bg-gray-50">
  //             <tr>
  //               <th className="px-4 py-2 text-left text-gray-500">
  //                 Product ID
  //               </th>
  //               <th className="px-4 py-2 text-left text-gray-500">
  //                 Product Name
  //               </th>
  //               <th className="px-4 py-2 text-left text-gray-500">Quantity</th>
  //               <th className="px-4 py-2 text-left text-gray-500">Price</th>
  //               <th className="px-4 py-2 text-left text-gray-500">Value</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {selectedSale.products?.map((product, index) => (
  //               <tr key={index} className="border-b">
  //                 <td className="px-4 py-2">{product.product_id}</td>
  //                 <td className="px-4 py-2">{product.product_name}</td>
  //                 <td className="px-4 py-2">{product.quantity}</td>
  //                 <td className="px-4 py-2">Rs.{product.price}</td>
  //                 <td className="px-4 py-2">Rs.{product.value}</td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>

  //       <div className="mt-6 text-right">
  //         <p className="text-lg font-medium">
  //           Total value: Rs.{selectedSale.totalValue || 0}
  //         </p>
  //       </div>

  //       <div className="mt-8 flex justify-end">
  //         <Button onClick={() => setViewMode("list")}>Back to List</Button>
  //       </div>
  //     </div>
  //   );
  // };

  const renderSaleDetail = () => {
    if (!selectedSale) return null;

    console.log("Rendering sale detail for:", selectedSale);

    // Get products from the selected sale or from the currentOrderProducts state
    const productsToDisplay =
      selectedSale.products || currentOrderProducts || [];
    console.log("Products to display:", productsToDisplay);

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">View Record</h2>
          <div className="flex gap-2">
            <Button icon={<EditOutlined />} onClick={handleEditSale}>
              Edit
            </Button>
            <Button danger onClick={() => handleDeleteSale(selectedSale.id)}>
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-gray-500 mb-1">Sales ID</p>
            <p className="font-medium">{selectedSale.order_id}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Prescription ID</p>
            <p className="font-medium">{selectedSale.prescription_id}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Customer ID</p>
            <p className="font-medium">{selectedSale.customer_id}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Staff ID</p>
            <p className="font-medium">{selectedSale.staff_id}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">State</p>
            <p className="font-medium">{selectedSale.status}</p>
          </div>
        </div>

        <h3 className="text-lg font-medium mb-4">Products</h3>
        {productsToDisplay.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No products found for this sale
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-500">
                    Product ID
                  </th>
                  <th className="px-4 py-2 text-left text-gray-500">
                    Product Name
                  </th>
                  <th className="px-4 py-2 text-left text-gray-500">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-gray-500">Price</th>
                  <th className="px-4 py-2 text-left text-gray-500">Value</th>
                </tr>
              </thead>
              <tbody>
                {productsToDisplay.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{product.product_id}</td>
                    <td className="px-4 py-2">{product.product_name}</td>
                    <td className="px-4 py-2">{product.quantity}</td>
                    <td className="px-4 py-2">Rs.{product.price}</td>
                    <td className="px-4 py-2">
                      Rs.{product.value || product.price * product.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-right">
          <p className="text-lg font-medium">
            Total value: Rs.{selectedSale.totalValue || 0}
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={() => setViewMode("list")}>Back to List</Button>
        </div>
      </div>
    );
  };

  // Render edit sale view
  const renderEditSale = () => {
    if (!selectedSale) return null;

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Edit Record</h2>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-gray-500 mb-1">Sales ID</p>
            <Input value={selectedSale.order_id} disabled />
          </div>
          <div>
            <p className="text-gray-500 mb-1">Prescription ID</p>
            <Input
              value={selectedSale.prescription_id}
              onChange={(e) =>
                setSelectedSale({
                  ...selectedSale,
                  prescription_id: e.target.value,
                })
              }
            />
          </div>
          <div>
            <p className="text-gray-500 mb-1">Customer ID</p>
            <Input
              value={selectedSale.customer_id}
              onChange={(e) =>
                setSelectedSale({
                  ...selectedSale,
                  customer_id: e.target.value,
                })
              }
            />
          </div>

          {/* <div>
            <p className="text-gray-500 mb-1">Staff ID</p>
            <Input value={selectedSale.staff_id} disabled />
          </div> */}
          <div>
            <p className="text-gray-500 mb-1">Date/Time</p>
            <DatePicker
              style={{ width: "100%" }}
              value={
                selectedSale.time ? moment(selectedSale.time, "DD/MM/YY") : null
              }
              onChange={(date, dateString) =>
                setSelectedSale({
                  ...selectedSale,
                  time: dateString,
                })
              }
              format="DD/MM/YY"
            />
          </div>
          <div>
            <p className="text-gray-500 mb-1">State</p>
            <Select
              style={{ width: "100%" }}
              value={selectedSale.status}
              onChange={(value) =>
                setSelectedSale({ ...selectedSale, status: value })
              }
            >
              <Option value="Pending">Pending</Option>
              <Option value="Confirmed">Confirmed</Option>
              <Option value="Out for delivery">Out for delivery</Option>
              <Option value="Delayed">Delayed</Option>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Products</h3>
          <Button type="primary" onClick={showAddProductModal}>
            Add Product
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-gray-500">
                  Product ID
                </th>
                <th className="px-4 py-2 text-left text-gray-500">
                  Product Name
                </th>
                <th className="px-4 py-2 text-left text-gray-500">Quantity</th>
                <th className="px-4 py-2 text-left text-gray-500">Price</th>
                <th className="px-4 py-2 text-left text-gray-500">Value</th>
                <th className="px-4 py-2 text-left text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedSale.products?.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{product.product_id}</td>
                  <td className="px-4 py-2">{product.product_name}</td>
                  <td className="px-4 py-2">{product.quantity}</td>
                  <td className="px-4 py-2">Rs.{product.price}</td>
                  <td className="px-4 py-2">Rs.{product.value}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEditProduct(index)}
                      />
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteProduct(index)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right">
          <p className="text-lg font-medium">
            Total value: Rs.{selectedSale.totalValue || 0}
          </p>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <Button onClick={() => setViewMode("view")}>Discard</Button>
          <Button type="primary" onClick={handleSaveSale}>
            Save
          </Button>
        </div>
      </div>
    );
  };

  // Render add product modal
  const renderAddProductModal = () => (
    <Modal
      title={editingProductIndex !== null ? "Edit Product" : "Add Product"}
      open={isAddProductModalVisible}
      onCancel={() => {
        setIsAddProductModalVisible(false);
        setEditingProductIndex(null);
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            setIsAddProductModalVisible(false);
            setEditingProductIndex(null);
          }}
        >
          Discard
        </Button>,
        <Button key="add" type="primary" onClick={handleAddProduct}>
          {editingProductIndex !== null ? "Update Product" : "Add Product"}
        </Button>,
      ]}
    >
      <div className="space-y-4">
        <div>
          <p className="mb-1">Product Name</p>
          <Input
            placeholder="Enter product name"
            value={searchTerm}
            onChange={(e) => handleProductSearch(e.target.value)}
            disabled={editingProductIndex !== null}
          />
          {productSearchResults.length > 0 && (
            <div className="mt-2 border rounded max-h-40 overflow-y-auto">
              {productSearchResults.map((product) => (
                <div
                  key={product.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectProduct(product)}
                >
                  {product.name}
                </div>
              ))}
            </div>
          )}
          {newProduct.product_name && (
            <p className="mt-1 text-blue-500">
              Selected: {newProduct.product_name}
            </p>
          )}
        </div>

        <div>
          <p className="mb-1">Quantity</p>
          <Input
            type="number"
            placeholder="Enter product quantity"
            value={newProduct.quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            min={1}
          />
        </div>

        <div>
          <p className="mb-1">Price (Rs.)</p>
          <Input
            type="number"
            placeholder="Enter price"
            value={newProduct.price}
            onChange={(e) => handlePriceChange(e.target.value)}
            min={0}
            step={0.01}
          />
        </div>

        {newProduct.price && newProduct.quantity && (
          <div className="flex justify-end">
            <p>Total: Rs.{newProduct.value}</p>
          </div>
        )}
      </div>
    </Modal>
  );

  // Mock data for development
  const mockSalesData = [
    {
      id: 1,
      order_id: "12152",
      prescription_id: "2216263",
      value: 4306,
      customer_id: "2216263",
      time: "11/12/22",
      status: "Delayed",
      products: [
        {
          product_id: "12152",
          product_name: "aedcaeaed",
          quantity: 2216263,
          price: 7535,
          value: 111222,
        },
        {
          product_id: "515161",
          product_name: "acacfadc",
          quantity: 2152151512,
          price: 5724,
          value: 211222,
        },
        {
          product_id: "52562",
          product_name: "ascadCddc",
          quantity: 15155,
          price: 2775,
          value: 51222,
        },
      ],
      totalValue: 15155,
    },
    {
      id: 2,
      order_id: "515161",
      prescription_id: "2152151512",
      value: 2557,
      customer_id: "2152151512",
      staff_id: "5724",
      time: "21/12/22",
      status: "Confirmed",
      products: [],
    },
    {
      id: 3,
      order_id: "52562",
      prescription_id: "15155",
      value: 4075,
      customer_id: "15155",
      staff_id: "2775",
      time: "5/12/22",
      status: "Out for delivery",
      products: [],
    },
  ];

  const mockProductsData = [
    { id: "12152", name: "aedcaeaed", price: 7535 },
    { id: "515161", name: "acacfadc", price: 5724 },
    { id: "52562", name: "ascadCddc", price: 2775 },
    { id: "12345", name: "Paracetamol", price: 500 },
    { id: "12346", name: "Amoxicillin", price: 1200 },
    { id: "12347", name: "Ibuprofen", price: 450 },
  ];

  // Main render
  return (
    <div className="p-6">
      {viewMode === "list" && renderSalesTable()}
      {viewMode === "view" && renderSaleDetail()}
      {viewMode === "edit" && renderEditSale()}
      {renderAddProductModal()}
    </div>
  );
};

export default Sales;
