// import React, { useState } from "react";
// import {
//   Search,
//   Bell,
//   LogOut,
//   Home,
//   Package,
//   FileText,
//   Users,
//   ShoppingCart,
//   Filter,
//   Download,
//   Edit,
//   Trash,
//   X,
// } from "lucide-react";

// const PharmacyDashboard = () => {
//   // Views state: 'dashboard', 'productDetails'
//   const [currentView, setCurrentView] = useState("dashboard");
//   // Selected product for details view
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   // Modal state
//   const [showAddModal, setShowAddModal] = useState(false);

//   // Sample data
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       name: "k95",
//       price: "Rs.430",
//       quantity: "43 Packets",
//       expiry: "11/12/22",
//       status: "In-stock",
//       productId: "456567",
//       category: "masks",
//       expiryDate: "13/4/23",
//       supplier: "Ronald Martin",
//       contactNumber: "98789 86757",
//       openingStock: 40,
//       remainingStock: 34,
//       onTheWay: 15,
//       threshold: 10,
//       image: "/api/placeholder/200/200",
//     },
//     {
//       id: 2,
//       name: "k95",
//       price: "Rs.257",
//       quantity: "22 Packets",
//       expiry: "21/12/22",
//       status: "Out of stock",
//       productId: "456568",
//       category: "masks",
//       expiryDate: "21/12/22",
//       supplier: "John Smith",
//       contactNumber: "98765 43210",
//       openingStock: 30,
//       remainingStock: 0,
//       onTheWay: 10,
//       threshold: 5,
//       image: "/api/placeholder/200/200",
//     },
//     {
//       id: 3,
//       name: "k95",
//       price: "Rs.405",
//       quantity: "36 Packets",
//       expiry: "5/12/22",
//       status: "In-stock",
//       productId: "456569",
//       category: "masks",
//       expiryDate: "5/12/22",
//       supplier: "Alice Johnson",
//       contactNumber: "87612 34567",
//       openingStock: 50,
//       remainingStock: 36,
//       onTheWay: 0,
//       threshold: 15,
//       image: "/api/placeholder/200/200",
//     },
//     // Rest of the products with similar data structure
//     {
//       id: 4,
//       name: "k95",
//       price: "Rs.502",
//       quantity: "14 Packets",
//       expiry: "8/12/22",
//       status: "Out of stock",
//     },
//     {
//       id: 5,
//       name: "k95",
//       price: "Rs.530",
//       quantity: "5 Packets",
//       expiry: "9/1/23",
//       status: "In-stock",
//     },
//     {
//       id: 6,
//       name: "k95",
//       price: "Rs.605",
//       quantity: "10 Packets",
//       expiry: "9/1/23",
//       status: "In-stock",
//     },
//     {
//       id: 7,
//       name: "k95",
//       price: "Rs.408",
//       quantity: "23 Packets",
//       expiry: "15/12/23",
//       status: "Out of stock",
//     },
//     {
//       id: 8,
//       name: "k95",
//       price: "Rs.359",
//       quantity: "43 Packets",
//       expiry: "6/6/23",
//       status: "In-stock",
//     },
//     {
//       id: 9,
//       name: "k95",
//       price: "Rs.205",
//       quantity: "41 Packets",
//       expiry: "11/11/22",
//       status: "Low stock",
//     },
//   ]);

//   const summaryData = [
//     { name: "Categories", value: 14, subtitle: "Last 7 days" },
//     { name: "Low Stocks", value: 12, subtitle: "Ordered" },
//     { name: "Empty", value: 2, subtitle: "Not in stock" },
//   ];

//   // Form state
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     category: "",
//     buyingPrice: "",
//     quantity: "",
//     expiryDate: "",
//     type: "",
//     image: null,
//   });

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add new product logic here
//     console.log("New product:", newProduct);
//     // Close modal after adding
//     setShowAddModal(false);
//   };

//   // Handle file upload
//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setNewProduct((prev) => ({ ...prev, image: e.target.files[0] }));
//     }
//   };

//   // Handle row click to show product details
//   const handleRowClick = (product) => {
//     setSelectedProduct(product);
//     setCurrentView("productDetails");
//   };

//   // Delete product
//   const handleDeleteProduct = () => {
//     // Logic to delete the product
//     setProducts(products.filter((p) => p.id !== selectedProduct.id));
//     setCurrentView("dashboard");
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
//         <h1 className="px-6 py-4 text-xl font-bold text-blue-600">
//           L.W.Pharmacy
//         </h1>
//         <div className="flex-1">
//           <SidebarItem icon={<Home size={20} />} label="Dashboard" active />
//           <SidebarItem icon={<Package size={20} />} label="Inventory" />
//           <SidebarItem icon={<FileText size={20} />} label="Reports" />
//           <SidebarItem icon={<Users size={20} />} label="Suppliers" />
//           <SidebarItem icon={<ShoppingCart size={20} />} label="Orders" />
//         </div>
//         <div className="p-4 border-t border-gray-200">
//           <button className="flex items-center text-gray-600 hover:text-gray-900">
//             <LogOut size={18} className="mr-2" />
//             <span>Log Out</span>
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Nav */}
//         <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
//           <div className="relative w-64">
//             <Search
//               className="absolute left-2 top-2.5 text-gray-400"
//               size={18}
//             />
//             <input
//               type="text"
//               placeholder="Search product, supplier, order"
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//           </div>
//           <div className="flex items-center gap-4">
//             <button className="relative p-1 text-gray-400 hover:text-gray-600">
//               <Bell size={20} />
//               <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
//             </button>
//             <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
//               <img
//                 src="/api/placeholder/32/32"
//                 alt="User profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         </header>

//         {/* Main Content Body */}
//         <main className="flex-1 overflow-y-auto p-6">
//           {currentView === "productDetails" ? (
//             /* Product Details View */
//             <div className="bg-white rounded-lg shadow p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold text-gray-700">
//                   {selectedProduct?.name}
//                 </h2>
//                 <div className="flex gap-2">
//                   <button className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
//                     <Edit size={16} />
//                     <span>Edit</span>
//                   </button>
//                   <button className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
//                     <Download size={16} />
//                     <span>Download</span>
//                   </button>
//                 </div>
//               </div>

//               {/* Tabs */}
//               <div className="flex border-b border-gray-200 mb-6">
//                 <div className="text-blue-600 border-b-2 border-blue-600 pb-2 px-4 font-medium">
//                   Overview
//                 </div>
//                 <div className="text-gray-500 pb-2 px-4 font-medium cursor-pointer hover:text-gray-700">
//                   History
//                 </div>
//               </div>

//               <div className="flex">
//                 {/* Left side - Details */}
//                 <div className="w-2/3 pr-8">
//                   <div className="mb-8">
//                     <h3 className="text-lg font-medium text-gray-700 mb-4">
//                       Primary Details
//                     </h3>
//                     <table className="w-full">
//                       <tbody>
//                         <DetailRow
//                           label="Product name"
//                           value={selectedProduct?.name}
//                         />
//                         <DetailRow
//                           label="Product ID"
//                           value={selectedProduct?.productId}
//                         />
//                         <DetailRow
//                           label="Product category"
//                           value={selectedProduct?.category}
//                         />
//                         <DetailRow
//                           label="Expiry Date"
//                           value={selectedProduct?.expiryDate}
//                         />
//                       </tbody>
//                     </table>
//                   </div>

//                   <div>
//                     <h3 className="text-lg font-medium text-gray-700 mb-4">
//                       Supplier Details
//                     </h3>
//                     <table className="w-full">
//                       <tbody>
//                         <DetailRow
//                           label="Supplier name"
//                           value={selectedProduct?.supplier}
//                         />
//                         <DetailRow
//                           label="Contact Number"
//                           value={selectedProduct?.contactNumber}
//                         />
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Right side - Image and Stats */}
//                 <div className="w-1/3">
//                   <div className="border border-dashed border-gray-300 rounded-md p-2 mb-8 flex justify-center">
//                     <img
//                       src={selectedProduct?.image || "/api/placeholder/200/200"}
//                       alt="Product"
//                       className="max-w-full h-auto max-h-48"
//                     />
//                   </div>

//                   <table className="w-full">
//                     <tbody>
//                       <DetailRow
//                         label="Opening Stock"
//                         value={selectedProduct?.openingStock}
//                         align="right"
//                       />
//                       <DetailRow
//                         label="Remaining Stock"
//                         value={selectedProduct?.remainingStock}
//                         align="right"
//                       />
//                       <DetailRow
//                         label="On the way"
//                         value={selectedProduct?.onTheWay}
//                         align="right"
//                       />
//                       <DetailRow
//                         label="Threshold"
//                         value={selectedProduct?.threshold}
//                         align="right"
//                       />
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Delete button */}
//               <div className="flex justify-end mt-8">
//                 <button
//                   className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
//                   onClick={handleDeleteProduct}
//                 >
//                   <Trash size={16} />
//                   <span>Delete</span>
//                 </button>
//               </div>

//               {/* Back button */}
//               <div className="mt-4">
//                 <button
//                   className="text-blue-600 hover:text-blue-800"
//                   onClick={() => setCurrentView("dashboard")}
//                 >
//                   ← Back to products
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Dashboard Summary Cards */}
//               <div className="bg-white rounded-lg shadow p-6 mb-6">
//                 <h2 className="text-xl font-semibold text-gray-700 mb-4">
//                   Overall Inventory
//                 </h2>
//                 <div className="flex justify-between">
//                   {summaryData.map((item, index) => (
//                     <div key={index} className="text-center">
//                       <div
//                         className={`text-lg font-semibold ${
//                           index === 0
//                             ? "text-blue-500"
//                             : index === 1
//                             ? "text-orange-500"
//                             : "text-gray-500"
//                         }`}
//                       >
//                         {item.name}
//                       </div>
//                       <div className="text-3xl font-bold mt-2">
//                         {item.value}
//                       </div>
//                       <div className="text-sm text-gray-500 mt-1">
//                         {item.subtitle}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Products Table */}
//               <div className="bg-white rounded-lg shadow mb-6">
//                 <div className="p-6 border-b border-gray-200 flex justify-between items-center">
//                   <h2 className="text-xl font-semibold text-gray-700">
//                     Products
//                   </h2>
//                   <div className="flex gap-2">
//                     <button
//                       className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
//                       onClick={() => setShowAddModal(true)}
//                     >
//                       Add Product
//                     </button>
//                     <button className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
//                       <Filter size={16} />
//                       <span>Filters</span>
//                     </button>
//                     <button className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
//                       <Download size={16} />
//                       <span>Download all</span>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Products Table */}
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="bg-gray-50">
//                         <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
//                           Products
//                         </th>
//                         <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
//                           Buying Price
//                         </th>
//                         <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
//                           Quantity
//                         </th>
//                         <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
//                           Expiry Date
//                         </th>
//                         <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
//                           Availability
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {products.map((product) => (
//                         <tr
//                           key={product.id}
//                           className="hover:bg-gray-50 cursor-pointer"
//                           onClick={() => handleRowClick(product)}
//                         >
//                           <td className="px-6 py-4 text-sm text-gray-900">
//                             {product.name}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-900">
//                             {product.price}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-900">
//                             {product.quantity}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-900">
//                             {product.expiry}
//                           </td>
//                           <td className="px-6 py-4 text-sm">
//                             <span
//                               className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
//                                 ${
//                                   product.status === "In-stock"
//                                     ? "bg-green-100 text-green-800"
//                                     : product.status === "Out of stock"
//                                     ? "bg-red-100 text-red-800"
//                                     : "bg-yellow-100 text-yellow-800"
//                                 }`}
//                             >
//                               {product.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </>
//           )}
//         </main>
//       </div>

//       {/* Add Product Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
//           {/* Modal Backdrop */}
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//             onClick={() => setShowAddModal(false)}
//           ></div>

//           {/* Modal Content */}
//           <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10">
//             <div className="flex justify-between items-center border-b border-gray-200 p-4">
//               <h3 className="text-lg font-semibold text-gray-700">
//                 Add New Product
//               </h3>
//               <button
//                 className="text-gray-400 hover:text-gray-600"
//                 onClick={() => setShowAddModal(false)}
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6">
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-6 flex justify-center">
//                   <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center p-2 cursor-pointer hover:bg-gray-50">
//                     <input
//                       type="file"
//                       id="productImage"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                     />
//                     <label
//                       htmlFor="productImage"
//                       className="cursor-pointer text-sm text-gray-500"
//                     >
//                       <div className="mb-2">Drag image here</div>
//                       <div>or</div>
//                       <div className="text-blue-500 mt-1">Browse image</div>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-y-4">
//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-1">
//                       Product Name
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       placeholder="Enter product name"
//                       className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={newProduct.name}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-1">
//                       Category
//                     </label>
//                     <select
//                       name="category"
//                       className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={newProduct.category}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Select product category</option>
//                       <option value="masks">Masks</option>
//                       <option value="tablets">Tablets</option>
//                       <option value="syrup">Syrup</option>
//                     </select>
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-1">
//                       Buying Price
//                     </label>
//                     <input
//                       type="text"
//                       name="buyingPrice"
//                       placeholder="Enter buying price"
//                       className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={newProduct.buyingPrice}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-1">
//                       Quantity
//                     </label>
//                     <input
//                       type="text"
//                       name="quantity"
//                       placeholder="Enter product quantity"
//                       className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={newProduct.quantity}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-1">
//                       Expiry Date
//                     </label>
//                     <input
//                       type="text"
//                       name="expiryDate"
//                       placeholder="Enter expiry date"
//                       className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={newProduct.expiryDate}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-1">
//                       Type
//                     </label>
//                     <select
//                       name="type"
//                       className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={newProduct.type}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Select product Type</option>
//                       <option value="essential">Essential</option>
//                       <option value="non-essential">Non-essential</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-4 mt-6">
//                   <button
//                     type="button"
//                     className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
//                     onClick={() => setShowAddModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
//                   >
//                     Add Product
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Sidebar Item Component
// const SidebarItem = ({ icon, label, active }) => (
//   <div
//     className={`flex items-center px-6 py-3 text-sm cursor-pointer
//       ${
//         active
//           ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600 font-medium"
//           : "text-gray-600 hover:bg-gray-50"
//       }`}
//   >
//     <span className="mr-3">{icon}</span>
//     <span>{label}</span>
//   </div>
// );

// // Detail Row Component for product details
// const DetailRow = ({ label, value, align = "left" }) => (
//   <tr className="border-b border-gray-100">
//     <td className="py-3 text-sm text-gray-500">{label}</td>
//     <td className={`py-3 text-sm font-medium text-gray-900 text-${align}`}>
//       {value}
//     </td>
//   </tr>
// );

// export default PharmacyDashboard;

import React, { useState } from "react";
import {
  Search,
  Bell,
  LogOut,
  Home,
  Package,
  FileText,
  Users,
  ShoppingCart,
  Filter,
  Download,
  Edit,
  Trash,
  X,
} from "lucide-react";

const PharmacyDashboard = () => {
  // Views state: 'dashboard', 'productDetails'
  const [currentView, setCurrentView] = useState("dashboard");
  // Selected product for details view
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "k95",
      price: "Rs.430",
      quantity: "43 Packets",
      expiry: "11/12/22",
      status: "In-stock",
      productId: "456567",
      category: "masks",
      expiryDate: "13/4/23",
      supplier: "Ronald Martin",
      contactNumber: "98789 86757",
      openingStock: 40,
      remainingStock: 34,
      onTheWay: 15,
      threshold: 10,
      image: "/api/placeholder/200/200",
    },
    {
      id: 2,
      name: "k95",
      price: "Rs.257",
      quantity: "22 Packets",
      expiry: "21/12/22",
      status: "Out of stock",
      productId: "456568",
      category: "masks",
      expiryDate: "21/12/22",
      supplier: "John Smith",
      contactNumber: "98765 43210",
      openingStock: 30,
      remainingStock: 0,
      onTheWay: 10,
      threshold: 5,
      image: "/api/placeholder/200/200",
    },
    {
      id: 3,
      name: "k95",
      price: "Rs.405",
      quantity: "36 Packets",
      expiry: "5/12/22",
      status: "In-stock",
      productId: "456569",
      category: "masks",
      expiryDate: "5/12/22",
      supplier: "Alice Johnson",
      contactNumber: "87612 34567",
      openingStock: 50,
      remainingStock: 36,
      onTheWay: 0,
      threshold: 15,
      image: "/api/placeholder/200/200",
    },
    // Rest of the products with similar data structure
    {
      id: 4,
      name: "k95",
      price: "Rs.502",
      quantity: "14 Packets",
      expiry: "8/12/22",
      status: "Out of stock",
    },
    {
      id: 5,
      name: "k95",
      price: "Rs.530",
      quantity: "5 Packets",
      expiry: "9/1/23",
      status: "In-stock",
    },
    {
      id: 6,
      name: "k95",
      price: "Rs.605",
      quantity: "10 Packets",
      expiry: "9/1/23",
      status: "In-stock",
    },
    {
      id: 7,
      name: "k95",
      price: "Rs.408",
      quantity: "23 Packets",
      expiry: "15/12/23",
      status: "Out of stock",
    },
    {
      id: 8,
      name: "k95",
      price: "Rs.359",
      quantity: "43 Packets",
      expiry: "6/6/23",
      status: "In-stock",
    },
    {
      id: 9,
      name: "k95",
      price: "Rs.205",
      quantity: "41 Packets",
      expiry: "11/11/22",
      status: "Low stock",
    },
  ]);

  const summaryData = [
    { name: "Categories", value: 14, subtitle: "Last 7 days" },
    { name: "Low Stocks", value: 12, subtitle: "Ordered" },
    { name: "Empty", value: 2, subtitle: "Not in stock" },
  ];

  // Form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    buyingPrice: "",
    quantity: "",
    expiryDate: "",
    type: "",
    image: null,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a new product with unique ID and convert form data to match product structure
    const newProductEntry = {
      id: products.length + 1,
      name: newProduct.name,
      price: `Rs.${newProduct.buyingPrice}`,
      quantity: `${newProduct.quantity} Packets`,
      expiry: newProduct.expiryDate,
      status: "In-stock",
      productId: `456${products.length + 570}`,
      category: newProduct.category,
      expiryDate: newProduct.expiryDate,
      supplier: "New Supplier", // Default values for demonstration
      contactNumber: "N/A",
      openingStock: parseInt(newProduct.quantity) || 0,
      remainingStock: parseInt(newProduct.quantity) || 0,
      onTheWay: 0,
      threshold: 5,
      image: "/api/placeholder/200/200",
    };

    // Add new product to the list
    setProducts([newProductEntry, ...products]);

    // Reset form fields
    setNewProduct({
      name: "",
      category: "",
      buyingPrice: "",
      quantity: "",
      expiryDate: "",
      type: "",
      image: null,
    });

    // Close modal after adding
    setShowAddModal(false);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProduct((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  // Handle row click to show product details
  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setCurrentView("productDetails");
  };

  // Delete product
  const handleDeleteProduct = () => {
    // Logic to delete the product
    setProducts(products.filter((p) => p.id !== selectedProduct.id));
    setCurrentView("dashboard");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <h1 className="px-6 py-4 text-xl font-bold text-blue-600">
          L.W.Pharmacy
        </h1>
        <div className="flex-1">
          <SidebarItem icon={<Home size={20} />} label="Dashboard" active />
          <SidebarItem icon={<Package size={20} />} label="Inventory" />
          <SidebarItem icon={<FileText size={20} />} label="Reports" />
          <SidebarItem icon={<Users size={20} />} label="Suppliers" />
          <SidebarItem icon={<ShoppingCart size={20} />} label="Orders" />
        </div>
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <LogOut size={18} className="mr-2" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Nav */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
          <div className="relative w-64">
            <Search
              className="absolute left-2 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search product, supplier, order"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-1 text-gray-400 hover:text-gray-600">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
              <img
                src="/api/placeholder/32/32"
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === "productDetails" ? (
            /* Product Details View */
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">
                  {selectedProduct?.name}
                </h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <div className="text-blue-600 border-b-2 border-blue-600 pb-2 px-4 font-medium">
                  Overview
                </div>
                <div className="text-gray-500 pb-2 px-4 font-medium cursor-pointer hover:text-gray-700">
                  History
                </div>
              </div>

              <div className="flex">
                {/* Left side - Details */}
                <div className="w-2/3 pr-8">
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      Primary Details
                    </h3>
                    <table className="w-full">
                      <tbody>
                        <DetailRow
                          label="Product name"
                          value={selectedProduct?.name}
                        />
                        <DetailRow
                          label="Product ID"
                          value={selectedProduct?.productId}
                        />
                        <DetailRow
                          label="Product category"
                          value={selectedProduct?.category}
                        />
                        <DetailRow
                          label="Expiry Date"
                          value={selectedProduct?.expiryDate}
                        />
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      Supplier Details
                    </h3>
                    <table className="w-full">
                      <tbody>
                        <DetailRow
                          label="Supplier name"
                          value={selectedProduct?.supplier}
                        />
                        <DetailRow
                          label="Contact Number"
                          value={selectedProduct?.contactNumber}
                        />
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right side - Image and Stats */}
                <div className="w-1/3">
                  <div className="border border-dashed border-gray-300 rounded-md p-2 mb-8 flex justify-center">
                    <img
                      src={selectedProduct?.image || "/api/placeholder/200/200"}
                      alt="Product"
                      className="max-w-full h-auto max-h-48"
                    />
                  </div>

                  <table className="w-full">
                    <tbody>
                      <DetailRow
                        label="Opening Stock"
                        value={selectedProduct?.openingStock}
                        align="right"
                      />
                      <DetailRow
                        label="Remaining Stock"
                        value={selectedProduct?.remainingStock}
                        align="right"
                      />
                      <DetailRow
                        label="On the way"
                        value={selectedProduct?.onTheWay}
                        align="right"
                      />
                      <DetailRow
                        label="Threshold"
                        value={selectedProduct?.threshold}
                        align="right"
                      />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Delete button */}
              <div className="flex justify-end mt-8">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                  onClick={handleDeleteProduct}
                >
                  <Trash size={16} />
                  <span>Delete</span>
                </button>
              </div>

              {/* Back button */}
              <div className="mt-4">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => setCurrentView("dashboard")}
                >
                  ← Back to products
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard Summary Cards */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Overall Inventory
                </h2>
                <div className="flex justify-between">
                  {summaryData.map((item, index) => (
                    <div key={index} className="text-center">
                      <div
                        className={`text-lg font-semibold ${
                          index === 0
                            ? "text-blue-500"
                            : index === 1
                            ? "text-orange-500"
                            : "text-gray-500"
                        }`}
                      >
                        {item.name}
                      </div>
                      <div className="text-3xl font-bold mt-2">
                        {item.value}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.subtitle}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Products
                  </h2>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                      onClick={() => setShowAddModal(true)}
                    >
                      Add Product
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
                      <Filter size={16} />
                      <span>Filters</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50">
                      <Download size={16} />
                      <span>Download all</span>
                    </button>
                  </div>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                          Products
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                          Buying Price
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                          Expiry Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                          Availability
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleRowClick(product)}
                        >
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.price}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.expiry}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                                ${
                                  product.status === "In-stock"
                                    ? "bg-green-100 text-green-800"
                                    : product.status === "Out of stock"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                              {product.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          {/* Modal Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowAddModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Add New Product
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-6 flex justify-center">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center p-2 cursor-pointer hover:bg-gray-50">
                    <input
                      type="file"
                      id="productImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="productImage"
                      className="cursor-pointer text-sm text-gray-500"
                    >
                      <div className="mb-2">Drag image here</div>
                      <div>or</div>
                      <div className="text-blue-500 mt-1">Browse image</div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-y-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter product name"
                      className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newProduct.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select product category</option>
                      <option value="masks">Masks</option>
                      <option value="tablets">Tablets</option>
                      <option value="syrup">Syrup</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Buying Price
                    </label>
                    <input
                      type="text"
                      name="buyingPrice"
                      placeholder="Enter buying price"
                      className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newProduct.buyingPrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="text"
                      name="quantity"
                      placeholder="Enter product quantity"
                      className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newProduct.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="Enter expiry date"
                      className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newProduct.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newProduct.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select product Type</option>
                      <option value="essential">Essential</option>
                      <option value="non-essential">Non-essential</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, active }) => (
  <div
    className={`flex items-center px-6 py-3 text-sm cursor-pointer
      ${
        active
          ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600 font-medium"
          : "text-gray-600 hover:bg-gray-50"
      }`}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </div>
);

// Detail Row Component for product details
const DetailRow = ({ label, value, align = "left" }) => (
  <tr className="border-b border-gray-100">
    <td className="py-3 text-sm text-gray-500">{label}</td>
    <td className={`py-3 text-sm font-medium text-gray-900 text-${align}`}>
      {value}
    </td>
  </tr>
);

export default PharmacyDashboard;
