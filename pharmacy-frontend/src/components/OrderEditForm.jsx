// // import React, { useState, useEffect } from "react";
// // import {
// //   Button,
// //   DatePicker,
// //   Input,
// //   Table,
// //   Tooltip,
// //   Modal,
// //   message,
// //   Form,
// //   Select,
// //   InputNumber,
// // } from "antd";
// // import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
// // import moment from "moment";
// // import axios from "axios";
// // import { UNIT_TYPES, INVALID_NESTING } from "../constants/units";

// // const OrderEditForm = ({
// //   order,
// //   products,
// //   mode,
// //   onSave,
// //   onCancel,
// //   onChange,
// // }) => {
// //   const [isAddProductModalVisible, setIsAddProductModalVisible] =
// //     useState(false);
// //   const [productSearchTerm, setProductSearchTerm] = useState("");
// //   const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
// //   const [productSearchResults, setProductSearchResults] = useState([]);
// //   const [newProduct, setNewProduct] = useState({
// //     product_id: "",
// //     product_name: "",
// //     quantity: "",
// //     buying_price: "",
// //     value: 0,
// //     unit_type: "unit", // default to 'unit'
// //     units_per_package: 1, // default to 1
// //     expired_date: null,
// //   });
// //   const [editingProductIndex, setEditingProductIndex] = useState(null);
// //   const [form] = Form.useForm();
// //   const [supplierResults, setSupplierResults] = useState([]);
// //   const [selectedSupplier, setSelectedSupplier] = useState(null);
// //   const [supplierSearchLoading, setSupplierSearchLoading] = useState(false);

// //   // Add debounce for auto-search
// //   useEffect(() => {
// //     const delayDebounce = setTimeout(() => {
// //       if (supplierSearchTerm.trim()) {
// //         handleSupplierSearch();
// //       } else {
// //         setSupplierResults([]);
// //       }
// //     }, 500); // 500ms delay

// //     return () => clearTimeout(delayDebounce);
// //   }, [supplierSearchTerm]);

// //   const handleSupplierSearch = async () => {
// //     if (!supplierSearchTerm.trim()) {
// //       setSupplierResults([]);
// //       return;
// //     }

// //     setSupplierSearchLoading(true);
// //     try {
// //       const response = await axios.get(
// //         `/api/supplier-orders/search-suppliers?search=${supplierSearchTerm}`,
// //         {
// //           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
// //         }
// //       );
// //       setSupplierResults(response.data.suppliers || []);
// //     } catch (error) {
// //       console.error("Error searching suppliers:", error);
// //       setSupplierResults([]);
// //     } finally {
// //       setSupplierSearchLoading(false);
// //     }
// //   };

// //   // Supplier selection handler
// //   const handleSelectSupplier = (supplier) => {
// //     setSelectedSupplier(supplier);
// //     onChange({
// //       ...order,
// //       supplier_id: supplier.supplier_id,
// //     });
// //     setSupplierResults([]);
// //     setSupplierSearchTerm("");
// //   };

// //   const validateProductSelection = () => {
// //     if (
// //       !UNIT_TYPES.find((u) => u.value === newProduct.unit_type)?.singular &&
// //       newProduct.units_per_package < 1
// //     ) {
// //       message.error(`Units per ${newProduct.unit_type} must be at least 1`);
// //       return false;
// //     }

// //     if (!newProduct.expired_date) {
// //       message.error("Please select an expiry date");
// //       return false;
// //     }

// //     if (moment(newProduct.expired_date) < moment().startOf("day")) {
// //       message.error("Expiry date must be in the future");
// //       return false;
// //     }

// //     // Check if product exists in inventory
// //     if (!newProduct.product_id) {
// //       message.error("Please select a valid product");
// //       return false;
// //     }

// //     // Check if product already exists in order (except when editing)
// //     if (
// //       editingProductIndex === null &&
// //       order.products.some((p) => p.product_id === newProduct.product_id)
// //     ) {
// //       message.error("This product is already in the order");
// //       return false;
// //     }

// //     // Validate quantity
// //     if (!newProduct.quantity || newProduct.quantity <= 0) {
// //       message.error("Please enter a valid quantity");
// //       return false;
// //     }

// //     // Validate price
// //     if (!newProduct.buying_price || newProduct.buying_price <= 0) {
// //       message.error("Please enter a valid price");
// //       return false;
// //     }

// //     return true;
// //   };

// //   const handleAddProduct = () => {
// //     if (!validateProductSelection()) {
// //       return;
// //     }

// //     if (
// //       !newProduct.product_id ||
// //       !newProduct.quantity ||
// //       !newProduct.buying_price
// //     ) {
// //       message.error("Please complete all product fields");
// //       return;
// //     }
// //     if (newProduct.buying_price <= 0) {
// //       message.error("Price must be greater than 0");
// //       return;
// //     }

// //     const updatedOrder = { ...order };
// //     const productValue = newProduct.quantity * newProduct.buying_price;

// //     if (editingProductIndex !== null) {
// //       updatedOrder.products[editingProductIndex] = {
// //         ...newProduct,
// //         value: productValue,
// //       };
// //     } else {
// //       updatedOrder.products = [
// //         ...updatedOrder.products,
// //         {
// //           ...newProduct,
// //           value: productValue,
// //         },
// //       ];
// //     }

// //     updatedOrder.total_value = updatedOrder.products.reduce(
// //       (sum, product) => sum + product.value,
// //       0
// //     );

// //     onChange(updatedOrder);
// //     setIsAddProductModalVisible(false);
// //     setEditingProductIndex(null);
// //     setNewProduct({
// //       product_id: "",
// //       product_name: "",
// //       quantity: "",
// //       buying_price: "",
// //       value: 0,
// //       unit_type: "unit",
// //       units_per_package: 1,
// //       expired_date: null,
// //     });
// //     setProductSearchTerm("");
// //   };

// //   const validateUnitSelection = (unitType, parentUnitType) => {
// //     if (INVALID_NESTING[unitType]?.includes(parentUnitType)) {
// //       return `${
// //         UNIT_TYPES.find((u) => u.value === unitType)?.label
// //       } cannot be placed inside ${
// //         UNIT_TYPES.find((u) => u.value === parentUnitType)?.label
// //       }`;
// //     }
// //     return null;
// //   };

// //   const disabledDate = (current) => {
// //     return current && current < moment().startOf("day");
// //   };

// //   const handleDateChange = (date, dateString) => {
// //     if (date && date < moment().startOf("day")) {
// //       message.error("Invalid expired date");
// //       form.setFieldsValue({ expired_date: null });
// //       return;
// //     }
// //     onChange({ ...order });
// //   };

// //   const handleProductSearch = (value) => {
// //     setProductSearchTerm(value);
// //     if (value.trim() === "") {
// //       setProductSearchResults([]);
// //       return;
// //     }

// //     const results = products.filter(
// //       (product) =>
// //         product.name.toLowerCase().includes(value.toLowerCase()) &&
// //         !order.products.some((p) => p.product_id === product.id)
// //     );

// //     setProductSearchResults(results);
// //   };

// //   const handleSelectProduct = (product) => {
// //     setNewProduct({
// //       product_id: product.id,
// //       product_name: product.name,
// //       quantity: 1,
// //       buying_price: product.price,
// //       value: product.price,
// //       unit_type: product.default_unit_type || "unit",
// //       units_per_package: product.default_units_per_package || 1,
// //     });
// //     setProductSearchResults([]);
// //     setProductSearchTerm(product.name);
// //   };

// //   const handleQuantityChange = (value) => {
// //     const quantity = parseInt(value) || 0;
// //     const price = parseFloat(newProduct.buying_price) || 0;
// //     setNewProduct({
// //       ...newProduct,
// //       quantity,
// //       value: quantity * price,
// //     });
// //   };

// //   const handlePriceChange = (value) => {
// //     const price = Math.max(0, parseFloat(value) || 0);
// //     const quantity = parseInt(newProduct.quantity) || 0;
// //     setNewProduct({
// //       ...newProduct,
// //       buying_price: price,
// //       value: quantity * price,
// //     });
// //   };

// //   const handleUnitsPerPackageChange = (value) => {
// //     // Ensure value is at least 1 and not negative
// //     const units = Math.max(1, parseInt(value) || 1);
// //     setNewProduct({
// //       ...newProduct,
// //       units_per_package: units,
// //     });
// //   };

// //   const handleEditProduct = (index) => {
// //     const product = order.products[index];

// //     // Check if this product is being used as a container
// //     const isContainer = order.products.some((p) =>
// //       INVALID_NESTING[p.unit_type]?.includes(product.unit_type)
// //     );

// //     if (isContainer) {
// //       message.error(
// //         "Cannot edit this product as it's being used as a container"
// //       );
// //       return;
// //     }

// //     setNewProduct({
// //       ...product,
// //       unit_type: product.unit_type || "unit",
// //       units_per_package: product.units_per_package || 1,
// //       expired_date: product.expired_date || null,
// //     });
// //     setProductSearchTerm(product.product_name);
// //     setEditingProductIndex(index);
// //     setIsAddProductModalVisible(true);
// //   };

// //   const handleDeleteProduct = (index) => {
// //     const updatedOrder = { ...order };
// //     updatedOrder.products = updatedOrder.products.filter((_, i) => i !== index);
// //     updatedOrder.total_value = updatedOrder.products.reduce(
// //       (sum, product) => sum + parseFloat(product.value || 0),
// //       0
// //     );
// //     onChange(updatedOrder);
// //   };

// //   const productColumns = [
// //     {
// //       title: "Product Name",
// //       dataIndex: "product_name",
// //       key: "product_name",
// //     },
// //     {
// //       title: "Unit Type",
// //       dataIndex: "unit_type",
// //       key: "unit_type",
// //       render: (value) =>
// //         UNIT_TYPES.find((u) => u.value === value)?.label || value,
// //     },
// //     {
// //       title: "Units/Package",
// //       dataIndex: "units_per_package",
// //       key: "units_per_package",
// //       render: (value, record) =>
// //         UNIT_TYPES.find((u) => u.value === record.unit_type)?.singular
// //           ? "N/A"
// //           : value,
// //     },
// //     {
// //       title: "Quantity",
// //       dataIndex: "quantity",
// //       key: "quantity",
// //     },
// //     {
// //       title: "Expired Date",
// //       dataIndex: "expired_date",
// //       key: "expired_date",
// //     },
// //     {
// //       title: "Buying Price",
// //       dataIndex: "buying_price",
// //       key: "buying_price",
// //       render: (price) => `Rs.${price}`,
// //     },
// //     {
// //       title: "Value",
// //       dataIndex: "value",
// //       key: "value",
// //       render: (value) => `Rs.${value}`,
// //     },
// //     {
// //       title: "Actions",
// //       key: "actions",
// //       render: (_, __, index) => (
// //         <div className="flex gap-2">
// //           <Tooltip title="Edit">
// //             <Button
// //               size="small"
// //               icon={<EditOutlined />}
// //               onClick={() => handleEditProduct(index)}
// //             />
// //           </Tooltip>
// //           <Tooltip title="Delete">
// //             <Button
// //               size="small"
// //               danger
// //               icon={<DeleteOutlined />}
// //               onClick={() => handleDeleteProduct(index)}
// //             />
// //           </Tooltip>
// //         </div>
// //       ),
// //     },
// //   ];

// //   return (
// //     <div className="bg-white p-6 rounded-lg shadow">
// //       <h2 className="text-xl font-semibold mb-6">
// //         {mode === "edit" ? "Edit Order" : "Add Order"}
// //       </h2>

// //       <Form>
// //         <div className="grid grid-cols-2 gap-6 mb-8">
// //           {mode === "edit" && (
// //             <>
// //               <div>
// //                 <p className="text-gray-500 mb-1">Order ID</p>
// //                 <Input value={order.order_id} disabled />
// //               </div>
// //               <div>
// //                 <p className="text-gray-500 mb-1">Manager ID</p>
// //                 <Input value={order.manager_id} disabled />
// //               </div>
// //             </>
// //           )}
// //           {/* Supplier Search Field */}
// //           <div>
// //             <p className="text-gray-500 mb-1">Supplier</p>
// //             {selectedSupplier ? (
// //               <div className="flex items-center justify-between border p-2 rounded">
// //                 <span>{selectedSupplier.supplier_name}</span>
// //                 <Button size="small" onClick={() => setSelectedSupplier(null)}>
// //                   Change
// //                 </Button>
// //               </div>
// //             ) : (
// //               <>
// //                 <Input
// //                   placeholder="Search suppliers..."
// //                   value={supplierSearchTerm}
// //                   onChange={(e) => setSupplierSearchTerm(e.target.value)}
// //                   onPressEnter={handleSupplierSearch}
// //                   suffix={
// //                     supplierSearchLoading ? (
// //                       <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
// //                     ) : null
// //                   }
// //                 />
// //                 {supplierResults.length > 0 && (
// //                   <div className="mt-2 border rounded max-h-40 overflow-y-auto">
// //                     {supplierResults.map((supplier) => (
// //                       <div
// //                         key={supplier.supplier_id}
// //                         className="p-2 hover:bg-gray-100 cursor-pointer"
// //                         onClick={() => handleSelectSupplier(supplier)}
// //                       >
// //                         {supplier.supplier_name}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </Form>

// //       <div className="flex justify-between items-center mb-4">
// //         <h3 className="text-lg font-medium">Products</h3>
// //         <Button
// //           type="primary"
// //           onClick={() => setIsAddProductModalVisible(true)}
// //           className="bg-blue-500"
// //         >
// //           Add Product
// //         </Button>
// //       </div>

// //       <Table
// //         columns={productColumns}
// //         dataSource={order.products}
// //         rowKey={(record, index) => `${record.product_id}-${index}`}
// //         pagination={false}
// //       />

// //       <div className="mt-6 text-right">
// //         <p className="text-lg font-medium">
// //           Total value: Rs.{order.total_value || 0}
// //         </p>
// //       </div>

// //       <div className="mt-8 flex justify-end gap-2">
// //         <Button onClick={onCancel}>Discard</Button>
// //         <Button
// //           type="primary"
// //           onClick={() => onSave(order)}
// //           className="bg-blue-500"
// //           disabled={!order.supplier_id || order.products.length === 0}
// //         >
// //           {mode === "edit" ? "Save" : "Add Order"}
// //         </Button>
// //       </div>

// //       {/* Add Product Modal */}
// //       <Modal
// //         title={editingProductIndex !== null ? "Edit Product" : "Add Product"}
// //         open={isAddProductModalVisible}
// //         onCancel={() => {
// //           setIsAddProductModalVisible(false);
// //           setProductSearchTerm("");
// //           setEditingProductIndex(null);
// //           setNewProduct({
// //             product_id: "",
// //             product_name: "",
// //             quantity: "",
// //             buying_price: "",
// //             value: 0,
// //             unit_type: "unit",
// //             units_per_package: 1,
// //             expired_date: null,
// //           });
// //         }}
// //         footer={[
// //           <Button
// //             key="cancel"
// //             onClick={() => {
// //               setIsAddProductModalVisible(false);
// //               setProductSearchTerm("");
// //               setEditingProductIndex(null);
// //               setNewProduct({
// //                 product_id: "",
// //                 product_name: "",
// //                 quantity: "",
// //                 buying_price: "",
// //                 value: 0,
// //                 unit_type: "unit",
// //                 units_per_package: 1,
// //                 expired_date: null,
// //               });
// //             }}
// //           >
// //             Discard
// //           </Button>,
// //           <Button
// //             key="add"
// //             type="primary"
// //             onClick={handleAddProduct}
// //             className="bg-blue-500"
// //           >
// //             {editingProductIndex !== null ? "Update" : "Add"} Product
// //           </Button>,
// //         ]}
// //       >
// //         <div className="space-y-4">
// //           <div>
// //             <p className="mb-1">Product Name</p>
// //             <Input
// //               placeholder="Enter product name"
// //               value={productSearchTerm}
// //               onChange={(e) => handleProductSearch(e.target.value)}
// //               disabled={editingProductIndex !== null}
// //             />

// //             {productSearchResults.length > 0 && (
// //               <div className="mt-2 border rounded max-h-40 overflow-y-auto">
// //                 {productSearchResults.map((product) => (
// //                   <div
// //                     key={product.id}
// //                     className="p-2 hover:bg-gray-100 cursor-pointer"
// //                     onClick={() => handleSelectProduct(product)}
// //                   >
// //                     {product.name}
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //             {newProduct.product_name && (
// //               <p className="mt-1 text-blue-500">
// //                 Selected: {newProduct.product_name}
// //               </p>
// //             )}
// //           </div>
// //           <div>
// //             <p className="mb-1">Unit Type</p>
// //             <Select
// //               style={{ width: "100%" }}
// //               value={newProduct.unit_type}
// //               onChange={(value) =>
// //                 setNewProduct({ ...newProduct, unit_type: value })
// //               }
// //               options={UNIT_TYPES.map((type) => ({
// //                 label: type.label,
// //                 value: type.value,
// //               }))}
// //             />
// //           </div>

// //           {!UNIT_TYPES.find((u) => u.value === newProduct.unit_type)
// //             ?.singular && (
// //             <div>
// //               <p className="mb-1">Units per {newProduct.unit_type}</p>
// //               <InputNumber
// //                 min={1}
// //                 value={newProduct.units_per_package}
// //                 onChange={handleUnitsPerPackageChange}
// //                 style={{ width: "100%" }}
// //               />
// //               {newProduct.units_per_package < 1 && (
// //                 <p className="text-red-500 text-xs mt-1">
// //                   Must be at least 1 unit per package
// //                 </p>
// //               )}
// //             </div>
// //           )}

// //           <div>
// //             <p className="mb-1">Quantity</p>
// //             <Input
// //               type="number"
// //               placeholder="Enter product quantity"
// //               value={newProduct.quantity}
// //               onChange={(e) => handleQuantityChange(e.target.value)}
// //               min={1}
// //             />
// //           </div>

// //           <div>
// //             <p className="mb-1">Buying Price (Rs.)</p>
// //             <Input
// //               type="number"
// //               placeholder="Enter buying price"
// //               value={newProduct.buying_price}
// //               onChange={(e) => handlePriceChange(e.target.value)}
// //               min={0}
// //               step={0.01}
// //             />
// //           </div>
// //           <div>
// //             <p className="mb-1">Expiry Date</p>
// //             <DatePicker
// //               style={{ width: "100%" }}
// //               value={
// //                 newProduct.expired_date ? moment(newProduct.expired_date) : null
// //               }
// //               onChange={(date, dateString) =>
// //                 setNewProduct({ ...newProduct, expired_date: dateString })
// //               }
// //               format="YYYY-MM-DD"
// //               disabledDate={(current) =>
// //                 current && current < moment().startOf("day")
// //               }
// //             />
// //           </div>

// //           {newProduct.buying_price && newProduct.quantity && (
// //             <div className="flex justify-end">
// //               <p>Total: Rs.{newProduct.value}</p>
// //             </div>
// //           )}
// //         </div>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default OrderEditForm;

// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   DatePicker,
//   Input,
//   Table,
//   Tooltip,
//   Modal,
//   message,
//   Form,
//   Select,
//   InputNumber,
// } from "antd";
// import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import moment from "moment";
// import axios from "axios";
// import { UNIT_TYPES, INVALID_NESTING } from "../constants/units";

// const OrderEditForm = ({
//   order,
//   products,
//   mode,
//   onSave,
//   onCancel,
//   onChange,
// }) => {
//   const [isAddProductModalVisible, setIsAddProductModalVisible] =
//     useState(false);
//   const [productSearchTerm, setProductSearchTerm] = useState("");
//   const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
//   const [productSearchResults, setProductSearchResults] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     product_id: "",
//     product_name: "",
//     quantity: "",
//     buying_price: "",
//     value: 0,
//     unit_type: "unit", // default to 'unit'
//     units_per_package: 1, // default to 1
//     expired_date: null,
//   });
//   const [editingProductIndex, setEditingProductIndex] = useState(null);
//   const [form] = Form.useForm();
//   const [supplierResults, setSupplierResults] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [supplierSearchLoading, setSupplierSearchLoading] = useState(false);

//   // Add debounce for auto-search
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (supplierSearchTerm.trim()) {
//         handleSupplierSearch();
//       } else {
//         setSupplierResults([]);
//       }
//     }, 500); // 500ms delay

//     return () => clearTimeout(delayDebounce);
//   }, [supplierSearchTerm]);

//   // Set selected supplier if it exists in the order data
//   useEffect(() => {
//     if (order.supplier_id && order.supplier_name && !selectedSupplier) {
//       setSelectedSupplier({
//         supplier_id: order.supplier_id,
//         supplier_name: order.supplier_name,
//       });
//     }
//   }, [order, selectedSupplier]);

//   const handleSupplierSearch = async () => {
//     if (!supplierSearchTerm.trim()) {
//       setSupplierResults([]);
//       return;
//     }

//     setSupplierSearchLoading(true);
//     try {
//       const response = await axios.get(
//         `/api/supplier-orders/search-suppliers?search=${supplierSearchTerm}`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );

//       console.log("Supplier search response:", response.data);

//       // Check if the response has the expected format
//       if (response.data.success && Array.isArray(response.data.suppliers)) {
//         setSupplierResults(response.data.suppliers);
//       } else {
//         console.warn(
//           "Unexpected supplier search response format:",
//           response.data
//         );
//         setSupplierResults([]);
//       }
//     } catch (error) {
//       console.error("Error searching suppliers:", error);
//       setSupplierResults([]);
//     } finally {
//       setSupplierSearchLoading(false);
//     }
//   };

//   // Supplier selection handler
//   const handleSelectSupplier = (supplier) => {
//     setSelectedSupplier(supplier);
//     onChange({
//       ...order,
//       supplier_id: supplier.supplier_id,
//       supplier_name: supplier.supplier_name,
//     });
//     setSupplierResults([]);
//     setSupplierSearchTerm("");
//   };

//   const validateProductSelection = () => {
//     if (
//       !UNIT_TYPES.find((u) => u.value === newProduct.unit_type)?.singular &&
//       newProduct.units_per_package < 1
//     ) {
//       message.error(`Units per ${newProduct.unit_type} must be at least 1`);
//       return false;
//     }

//     if (!newProduct.expired_date) {
//       message.error("Please select an expiry date");
//       return false;
//     }

//     if (moment(newProduct.expired_date) < moment().startOf("day")) {
//       message.error("Expiry date must be in the future");
//       return false;
//     }

//     // Check if product exists in inventory
//     if (!newProduct.product_id) {
//       message.error("Please select a valid product");
//       return false;
//     }

//     // Check if product already exists in order (except when editing)
//     if (
//       editingProductIndex === null &&
//       order.products.some((p) => p.product_id === newProduct.product_id)
//     ) {
//       message.error("This product is already in the order");
//       return false;
//     }

//     // Validate quantity
//     if (!newProduct.quantity || newProduct.quantity <= 0) {
//       message.error("Please enter a valid quantity");
//       return false;
//     }

//     // Validate price
//     if (!newProduct.buying_price || newProduct.buying_price <= 0) {
//       message.error("Please enter a valid price");
//       return false;
//     }

//     return true;
//   };

//   const handleAddProduct = () => {
//     if (!validateProductSelection()) {
//       return;
//     }

//     if (
//       !newProduct.product_id ||
//       !newProduct.quantity ||
//       !newProduct.buying_price
//     ) {
//       message.error("Please complete all product fields");
//       return;
//     }
//     if (newProduct.buying_price <= 0) {
//       message.error("Price must be greater than 0");
//       return;
//     }

//     // Check for duplicate product
//     if (
//       editingProductIndex === null &&
//       order.products.some((p) => p.product_id === newProduct.product_id)
//     ) {
//       message.error("This product is already in the order");
//       return;
//     }

//     const updatedOrder = { ...order };
//     const productValue = newProduct.quantity * newProduct.buying_price;

//     if (editingProductIndex !== null) {
//       updatedOrder.products[editingProductIndex] = {
//         ...newProduct,
//         value: productValue,
//       };
//     } else {
//       updatedOrder.products = [
//         ...updatedOrder.products,
//         {
//           ...newProduct,
//           value: productValue,
//         },
//       ];
//     }

//     updatedOrder.total_value = updatedOrder.products.reduce(
//       (sum, product) => sum + product.value,
//       0
//     );

//     onChange(updatedOrder);
//     setIsAddProductModalVisible(false);
//     setEditingProductIndex(null);
//     setNewProduct({
//       product_id: "",
//       product_name: "",
//       quantity: "",
//       buying_price: "",
//       value: 0,
//       unit_type: "unit",
//       units_per_package: 1,
//       expired_date: null,
//     });
//     setProductSearchTerm("");
//   };

//   const validateUnitSelection = (unitType, parentUnitType) => {
//     if (INVALID_NESTING[unitType]?.includes(parentUnitType)) {
//       return `${
//         UNIT_TYPES.find((u) => u.value === unitType)?.label
//       } cannot be placed inside ${
//         UNIT_TYPES.find((u) => u.value === parentUnitType)?.label
//       }`;
//     }
//     return null;
//   };

//   const disabledDate = (current) => {
//     return current && current < moment().startOf("day");
//   };

//   const handleProductSearch = (value) => {
//     setProductSearchTerm(value);
//     if (value.trim() === "") {
//       setProductSearchResults([]);
//       return;
//     }

//     // Get all products that match the search term
//     const results = products.filter((product) =>
//       product.name.toLowerCase().includes(value.toLowerCase())
//     );

//     setProductSearchResults(results);
//   };

//   const handleSelectProduct = (product) => {
//     // Check if product is already in the order
//     if (order.products.some((p) => p.product_id === product.id)) {
//       message.warning("This product is already in the order");
//     }

//     setNewProduct({
//       product_id: product.id,
//       product_name: product.name,
//       quantity: 1,
//       buying_price: product.price,
//       value: product.price,
//       unit_type: product.default_unit_type || "unit",
//       units_per_package: product.default_units_per_package || 1,
//     });
//     setProductSearchResults([]);
//     setProductSearchTerm(product.name);
//   };

//   const handleQuantityChange = (value) => {
//     const quantity = parseInt(value) || 0;
//     const price = parseFloat(newProduct.buying_price) || 0;
//     setNewProduct({
//       ...newProduct,
//       quantity,
//       value: quantity * price,
//     });
//   };

//   const handlePriceChange = (value) => {
//     const price = Math.max(0, parseFloat(value) || 0);
//     const quantity = parseInt(newProduct.quantity) || 0;
//     setNewProduct({
//       ...newProduct,
//       buying_price: price,
//       value: quantity * price,
//     });
//   };

//   const handleUnitsPerPackageChange = (value) => {
//     // Ensure value is at least 1 and not negative
//     const units = Math.max(1, parseInt(value) || 1);
//     setNewProduct({
//       ...newProduct,
//       units_per_package: units,
//     });
//   };

//   const handleEditProduct = (index) => {
//     const product = order.products[index];

//     // Check if this product is being used as a container
//     const isContainer = order.products.some((p) =>
//       INVALID_NESTING[p.unit_type]?.includes(product.unit_type)
//     );

//     if (isContainer) {
//       message.error(
//         "Cannot edit this product as it's being used as a container"
//       );
//       return;
//     }

//     setNewProduct({
//       ...product,
//       unit_type: product.unit_type || "unit",
//       units_per_package: product.units_per_package || 1,
//       expired_date: product.expired_date || null,
//     });
//     setProductSearchTerm(product.product_name);
//     setEditingProductIndex(index);
//     setIsAddProductModalVisible(true);
//   };

//   const handleDeleteProduct = (index) => {
//     const updatedOrder = { ...order };
//     updatedOrder.products = updatedOrder.products.filter((_, i) => i !== index);
//     updatedOrder.total_value = updatedOrder.products.reduce(
//       (sum, product) => sum + parseFloat(product.value || 0),
//       0
//     );
//     onChange(updatedOrder);
//   };

//   const productColumns = [
//     {
//       title: "Product Name",
//       dataIndex: "product_name",
//       key: "product_name",
//     },
//     {
//       title: "Unit Type",
//       dataIndex: "unit_type",
//       key: "unit_type",
//       render: (value) =>
//         UNIT_TYPES.find((u) => u.value === value)?.label || value,
//     },
//     {
//       title: "Units/Package",
//       dataIndex: "units_per_package",
//       key: "units_per_package",
//       render: (value, record) =>
//         UNIT_TYPES.find((u) => u.value === record.unit_type)?.singular
//           ? "N/A"
//           : value,
//     },
//     {
//       title: "Quantity",
//       dataIndex: "quantity",
//       key: "quantity",
//     },
//     {
//       title: "Expired Date",
//       dataIndex: "expired_date",
//       key: "expired_date",
//     },
//     {
//       title: "Buying Price",
//       dataIndex: "buying_price",
//       key: "buying_price",
//       render: (price) => `Rs.${price}`,
//     },
//     {
//       title: "Value",
//       dataIndex: "value",
//       key: "value",
//       render: (value) => `Rs.${value}`,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, __, index) => (
//         <div className="flex gap-2">
//           <Tooltip title="Edit">
//             <Button
//               size="small"
//               icon={<EditOutlined />}
//               onClick={() => handleEditProduct(index)}
//             />
//           </Tooltip>
//           <Tooltip title="Delete">
//             <Button
//               size="small"
//               danger
//               icon={<DeleteOutlined />}
//               onClick={() => handleDeleteProduct(index)}
//             />
//           </Tooltip>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <h2 className="text-xl font-semibold mb-6">
//         {mode === "edit" ? "Edit Order" : "Add Order"}
//       </h2>

//       <Form>
//         <div className="grid grid-cols-2 gap-6 mb-8">
//           {mode === "edit" && (
//             <>
//               <div>
//                 <p className="text-gray-500 mb-1">Order ID</p>
//                 <Input value={order.order_id} disabled />
//               </div>
//               <div>
//                 <p className="text-gray-500 mb-1">Manager ID</p>
//                 <Input value={order.manager_id} disabled />
//               </div>
//             </>
//           )}
//           {/* Supplier Search Field */}
//           <div>
//             <p className="text-gray-500 mb-1">Supplier</p>
//             {selectedSupplier ? (
//               <div className="border p-2 rounded bg-blue-50">
//                 <span className="font-medium">
//                   {selectedSupplier.supplier_name}
//                 </span>
//               </div>
//             ) : (
//               <>
//                 <Input
//                   placeholder="Search suppliers..."
//                   value={supplierSearchTerm}
//                   onChange={(e) => setSupplierSearchTerm(e.target.value)}
//                   onPressEnter={handleSupplierSearch}
//                   suffix={
//                     supplierSearchLoading ? (
//                       <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
//                     ) : null
//                   }
//                 />
//                 {supplierResults.length > 0 && (
//                   <div className="mt-2 border rounded max-h-40 overflow-y-auto">
//                     {supplierResults.map((supplier) => (
//                       <div
//                         key={supplier.supplier_id}
//                         className="p-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => handleSelectSupplier(supplier)}
//                       >
//                         {supplier.supplier_name}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </Form>

//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-medium">Products</h3>
//         <Button
//           type="primary"
//           onClick={() => setIsAddProductModalVisible(true)}
//           className="bg-blue-500"
//         >
//           Add Product
//         </Button>
//       </div>

//       <Table
//         columns={productColumns}
//         dataSource={order.products}
//         rowKey={(record, index) => `${record.product_id}-${index}`}
//         pagination={false}
//       />

//       <div className="mt-6 text-right">
//         <p className="text-lg font-medium">
//           Total value: Rs.{order.total_value || 0}
//         </p>
//       </div>

//       <div className="mt-8 flex justify-end gap-2">
//         <Button onClick={onCancel}>Discard</Button>
//         <Button
//           type="primary"
//           onClick={() => onSave(order)}
//           className="bg-blue-500"
//           disabled={!order.supplier_id || order.products.length === 0}
//         >
//           {mode === "edit" ? "Save" : "Add Order"}
//         </Button>
//       </div>

//       {/* Add Product Modal */}
//       <Modal
//         title={editingProductIndex !== null ? "Edit Product" : "Add Product"}
//         open={isAddProductModalVisible}
//         onCancel={() => {
//           setIsAddProductModalVisible(false);
//           setProductSearchTerm("");
//           setEditingProductIndex(null);
//           setNewProduct({
//             product_id: "",
//             product_name: "",
//             quantity: "",
//             buying_price: "",
//             value: 0,
//             unit_type: "unit",
//             units_per_package: 1,
//             expired_date: null,
//           });
//         }}
//         footer={[
//           <Button
//             key="cancel"
//             onClick={() => {
//               setIsAddProductModalVisible(false);
//               setProductSearchTerm("");
//               setEditingProductIndex(null);
//               setNewProduct({
//                 product_id: "",
//                 product_name: "",
//                 quantity: "",
//                 buying_price: "",
//                 value: 0,
//                 unit_type: "unit",
//                 units_per_package: 1,
//                 expired_date: null,
//               });
//             }}
//           >
//             Discard
//           </Button>,
//           <Button
//             key="add"
//             type="primary"
//             onClick={handleAddProduct}
//             className="bg-blue-500"
//           >
//             {editingProductIndex !== null ? "Update" : "Add"} Product
//           </Button>,
//         ]}
//       >
//         <div className="space-y-4">
//           <div>
//             <p className="mb-1">Product Name</p>
//             <Input
//               placeholder="Enter product name"
//               value={productSearchTerm}
//               onChange={(e) => handleProductSearch(e.target.value)}
//               disabled={editingProductIndex !== null}
//             />

//             {productSearchResults.length > 0 && (
//               <div className="mt-2 border rounded max-h-40 overflow-y-auto">
//                 {productSearchResults.map((product) => (
//                   <div
//                     key={product.id}
//                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => handleSelectProduct(product)}
//                   >
//                     {product.name}
//                     {order.products.some(
//                       (p) => p.product_id === product.id
//                     ) && (
//                       <span className="ml-2 text-xs text-orange-500">
//                         (Already in order)
//                       </span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//             {newProduct.product_name && (
//               <p className="mt-1 text-blue-500">
//                 Selected: {newProduct.product_name}
//               </p>
//             )}
//           </div>
//           <div>
//             <p className="mb-1">Unit Type</p>
//             <Select
//               style={{ width: "100%" }}
//               value={newProduct.unit_type}
//               onChange={(value) =>
//                 setNewProduct({ ...newProduct, unit_type: value })
//               }
//               options={UNIT_TYPES.map((type) => ({
//                 label: type.label,
//                 value: type.value,
//               }))}
//             />
//           </div>

//           {!UNIT_TYPES.find((u) => u.value === newProduct.unit_type)
//             ?.singular && (
//             <div>
//               <p className="mb-1">Units per {newProduct.unit_type}</p>
//               <InputNumber
//                 min={1}
//                 value={newProduct.units_per_package}
//                 onChange={handleUnitsPerPackageChange}
//                 style={{ width: "100%" }}
//               />
//               {newProduct.units_per_package < 1 && (
//                 <p className="text-red-500 text-xs mt-1">
//                   Must be at least 1 unit per package
//                 </p>
//               )}
//             </div>
//           )}

//           <div>
//             <p className="mb-1">Quantity</p>
//             <Input
//               type="number"
//               placeholder="Enter product quantity"
//               value={newProduct.quantity}
//               onChange={(e) => handleQuantityChange(e.target.value)}
//               min={1}
//             />
//           </div>

//           <div>
//             <p className="mb-1">Buying Price (Rs.)</p>
//             <Input
//               type="number"
//               placeholder="Enter buying price"
//               value={newProduct.buying_price}
//               onChange={(e) => handlePriceChange(e.target.value)}
//               min={0}
//               step={0.01}
//             />
//           </div>
//           <div>
//             <p className="mb-1">Expiry Date</p>
//             <DatePicker
//               style={{ width: "100%" }}
//               value={
//                 newProduct.expired_date ? moment(newProduct.expired_date) : null
//               }
//               onChange={(date, dateString) =>
//                 setNewProduct({ ...newProduct, expired_date: dateString })
//               }
//               format="YYYY-MM-DD"
//               disabledDate={(current) =>
//                 current && current < moment().startOf("day")
//               }
//             />
//           </div>

//           {newProduct.buying_price && newProduct.quantity && (
//             <div className="flex justify-end">
//               <p>Total: Rs.{newProduct.value}</p>
//             </div>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default OrderEditForm;

//////gonna remove the expected date

// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   DatePicker,
//   Input,
//   Table,
//   Tooltip,
//   Modal,
//   message,
//   Form,
//   Select,
//   InputNumber,
// } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import moment from "moment";
// import axios from "axios";
// import { UNIT_TYPES, INVALID_NESTING } from "../constants/units";

// const OrderEditForm = ({
//   order,
//   products,
//   mode,
//   onSave,
//   onCancel,
//   onChange,
// }) => {
//   const [isAddProductModalVisible, setIsAddProductModalVisible] =
//     useState(false);
//   const [productSearchTerm, setProductSearchTerm] = useState("");
//   const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
//   const [productSearchResults, setProductSearchResults] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     product_id: "",
//     product_name: "",
//     quantity: "",
//     buying_price: "",
//     value: 0,
//     unit_type: "unit", // default to 'unit'
//     units_per_package: 1, // default to 1
//     expired_date: null,
//   });
//   const [editingProductIndex, setEditingProductIndex] = useState(null);
//   const [form] = Form.useForm();
//   const [supplierResults, setSupplierResults] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [supplierSearchLoading, setSupplierSearchLoading] = useState(false);

//   // Add debounce for auto-search
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (supplierSearchTerm.trim()) {
//         handleSupplierSearch();
//       } else {
//         setSupplierResults([]);
//       }
//     }, 500); // 500ms delay

//     return () => clearTimeout(delayDebounce);
//   }, [supplierSearchTerm]);

//   // Set selected supplier if it exists in the order data
//   useEffect(() => {
//     if (order.supplier_id && order.supplier_name && !selectedSupplier) {
//       setSelectedSupplier({
//         supplier_id: order.supplier_id,
//         supplier_name: order.supplier_name,
//       });
//     }
//   }, [order, selectedSupplier]);

//   const handleSupplierSearch = async () => {
//     if (!supplierSearchTerm.trim()) {
//       setSupplierResults([]);
//       return;
//     }

//     setSupplierSearchLoading(true);
//     try {
//       const response = await axios.get(
//         `/api/supplier-orders/search-suppliers?search=${supplierSearchTerm}`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );

//       console.log("Supplier search response:", response.data);

//       // Check if the response has the expected format
//       if (response.data.success && Array.isArray(response.data.suppliers)) {
//         setSupplierResults(response.data.suppliers);
//       } else {
//         console.warn(
//           "Unexpected supplier search response format:",
//           response.data
//         );
//         setSupplierResults([]);
//       }
//     } catch (error) {
//       console.error("Error searching suppliers:", error);
//       setSupplierResults([]);
//     } finally {
//       setSupplierSearchLoading(false);
//     }
//   };

//   // Supplier selection handler
//   const handleSelectSupplier = (supplier) => {
//     setSelectedSupplier(supplier);
//     onChange({
//       ...order,
//       supplier_id: supplier.supplier_id,
//       supplier_name: supplier.supplier_name,
//     });
//     setSupplierResults([]);
//     setSupplierSearchTerm("");
//   };

//   const validateProductSelection = () => {
//     if (
//       !UNIT_TYPES.find((u) => u.value === newProduct.unit_type)?.singular &&
//       newProduct.units_per_package < 1
//     ) {
//       message.error(`Units per ${newProduct.unit_type} must be at least 1`);
//       return false;
//     }

//     if (!newProduct.expired_date) {
//       message.error("Please select an expiry date");
//       return false;
//     }

//     if (moment(newProduct.expired_date) < moment().startOf("day")) {
//       message.error("Expiry date must be in the future");
//       return false;
//     }

//     // Check if product exists in inventory
//     if (!newProduct.product_id) {
//       message.error("Please select a valid product");
//       return false;
//     }

//     // Check if product already exists in order (except when editing)
//     if (
//       editingProductIndex === null &&
//       order.products.some((p) => p.product_id === newProduct.product_id)
//     ) {
//       message.error("This product is already in the order");
//       return false;
//     }

//     // Validate quantity
//     if (!newProduct.quantity || newProduct.quantity <= 0) {
//       message.error("Please enter a valid quantity");
//       return false;
//     }

//     // Validate price
//     if (!newProduct.buying_price || newProduct.buying_price <= 0) {
//       message.error("Please enter a valid price");
//       return false;
//     }

//     return true;
//   };

//   const handleAddProduct = () => {
//     if (!validateProductSelection()) {
//       return;
//     }

//     if (
//       !newProduct.product_id ||
//       !newProduct.quantity ||
//       !newProduct.buying_price
//     ) {
//       message.error("Please complete all product fields");
//       return;
//     }
//     if (newProduct.buying_price <= 0) {
//       message.error("Price must be greater than 0");
//       return;
//     }

//     // Check for duplicate product
//     if (
//       editingProductIndex === null &&
//       order.products.some((p) => p.product_id === newProduct.product_id)
//     ) {
//       message.error("This product is already in the order");
//       return;
//     }

//     const updatedOrder = { ...order };
//     const productValue = newProduct.quantity * newProduct.buying_price;

//     if (editingProductIndex !== null) {
//       updatedOrder.products[editingProductIndex] = {
//         ...newProduct,
//         value: productValue,
//       };
//     } else {
//       updatedOrder.products = [
//         ...updatedOrder.products,
//         {
//           ...newProduct,
//           value: productValue,
//         },
//       ];
//     }

//     updatedOrder.total_value = updatedOrder.products.reduce(
//       (sum, product) => sum + product.value,
//       0
//     );

//     onChange(updatedOrder);
//     setIsAddProductModalVisible(false);
//     setEditingProductIndex(null);
//     setNewProduct({
//       product_id: "",
//       product_name: "",
//       quantity: "",
//       buying_price: "",
//       value: 0,
//       unit_type: "unit",
//       units_per_package: 1,
//       expired_date: null,
//     });
//     setProductSearchTerm("");
//   };

//   const handleProductSearch = (value) => {
//     setProductSearchTerm(value);
//     if (value.trim() === "") {
//       setProductSearchResults([]);
//       return;
//     }

//     // Get all products that match the search term
//     const results = products.filter((product) =>
//       product.name.toLowerCase().includes(value.toLowerCase())
//     );

//     setProductSearchResults(results);
//   };

//   const handleSelectProduct = (product) => {
//     // Check if product is already in the order
//     if (order.products.some((p) => p.product_id === product.id)) {
//       message.warning("This product is already in the order");
//     }

//     setNewProduct({
//       product_id: product.id,
//       product_name: product.name,
//       quantity: 1,
//       buying_price: product.price,
//       value: product.price,
//       unit_type: product.default_unit_type || "unit",
//       units_per_package: product.default_units_per_package || 1,
//     });
//     setProductSearchResults([]);
//     setProductSearchTerm(product.name);
//   };

//   const handleQuantityChange = (value) => {
//     const quantity = parseInt(value) || 0;
//     const price = parseFloat(newProduct.buying_price) || 0;
//     setNewProduct({
//       ...newProduct,
//       quantity,
//       value: quantity * price,
//     });
//   };

//   const handlePriceChange = (value) => {
//     const price = Math.max(0, parseFloat(value) || 0);
//     const quantity = parseInt(newProduct.quantity) || 0;
//     setNewProduct({
//       ...newProduct,
//       buying_price: price,
//       value: quantity * price,
//     });
//   };

//   const handleUnitsPerPackageChange = (value) => {
//     // Ensure value is at least 1 and not negative
//     const units = Math.max(1, parseInt(value) || 1);
//     setNewProduct({
//       ...newProduct,
//       units_per_package: units,
//     });
//   };

//   const handleEditProduct = (index) => {
//     const product = order.products[index];

//     // Check if this product is being used as a container
//     const isContainer = order.products.some((p) =>
//       INVALID_NESTING[p.unit_type]?.includes(product.unit_type)
//     );

//     if (isContainer) {
//       message.error(
//         "Cannot edit this product as it's being used as a container"
//       );
//       return;
//     }

//     setNewProduct({
//       ...product,
//       unit_type: product.unit_type || "unit",
//       units_per_package: product.units_per_package || 1,
//       expired_date: product.expired_date || null,
//     });
//     setProductSearchTerm(product.product_name);
//     setEditingProductIndex(index);
//     setIsAddProductModalVisible(true);
//   };

//   const handleDeleteProduct = (index) => {
//     const updatedOrder = { ...order };
//     updatedOrder.products = updatedOrder.products.filter((_, i) => i !== index);
//     updatedOrder.total_value = updatedOrder.products.reduce(
//       (sum, product) => sum + parseFloat(product.value || 0),
//       0
//     );
//     onChange(updatedOrder);
//   };

//   const productColumns = [
//     {
//       title: "Product Name",
//       dataIndex: "product_name",
//       key: "product_name",
//     },
//     {
//       title: "Unit Type",
//       dataIndex: "unit_type",
//       key: "unit_type",
//       render: (value) =>
//         UNIT_TYPES.find((u) => u.value === value)?.label || value,
//     },
//     {
//       title: "Units/Package",
//       dataIndex: "units_per_package",
//       key: "units_per_package",
//       render: (value, record) =>
//         UNIT_TYPES.find((u) => u.value === record.unit_type)?.singular
//           ? "N/A"
//           : value,
//     },
//     {
//       title: "Quantity",
//       dataIndex: "quantity",
//       key: "quantity",
//     },
//     {
//       title: "Expired Date",
//       dataIndex: "expired_date",
//       key: "expired_date",
//     },
//     {
//       title: "Buying Price",
//       dataIndex: "buying_price",
//       key: "buying_price",
//       render: (price) => `Rs.${price}`,
//     },
//     {
//       title: "Value",
//       dataIndex: "value",
//       key: "value",
//       render: (value) => `Rs.${value}`,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record, index) => (
//         <div className="flex gap-2">
//           <Tooltip title="Edit">
//             <Button
//               size="small"
//               icon={<EditOutlined />}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleEditProduct(index);
//               }}
//             />
//           </Tooltip>
//           <Tooltip title="Delete">
//             <Button
//               size="small"
//               danger
//               icon={<DeleteOutlined />}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleDeleteProduct(index);
//               }}
//             />
//           </Tooltip>
//         </div>
//       ),
//     },
//   ];

//   // Prepare order for saving by ensuring expected_date is handled properly
//   const prepareOrderForSave = () => {
//     const preparedOrder = { ...order };

//     // Remove expected_date field completely if it doesn't exist or is not needed
//     delete preparedOrder.expected_date;

//     return preparedOrder;
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <h2 className="text-xl font-semibold mb-6">
//         {mode === "edit" ? "Edit Order" : "Add Order"}
//       </h2>

//       <Form>
//         <div className="grid grid-cols-1 gap-6 mb-8">
//           {mode === "edit" && (
//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <p className="text-gray-500 mb-1">Order ID</p>
//                 <Input value={order.order_id} disabled />
//               </div>
//               <div>
//                 <p className="text-gray-500 mb-1">Manager ID</p>
//                 <Input value={order.manager_id} disabled />
//               </div>
//             </div>
//           )}
//           {/* Supplier Search Field */}
//           <div>
//             <p className="text-gray-500 mb-1">Supplier</p>
//             {selectedSupplier ? (
//               <div className="border p-2 rounded bg-blue-50">
//                 <span className="font-medium">
//                   {selectedSupplier.supplier_name}
//                 </span>
//               </div>
//             ) : (
//               <>
//                 <Input
//                   placeholder="Search suppliers..."
//                   value={supplierSearchTerm}
//                   onChange={(e) => setSupplierSearchTerm(e.target.value)}
//                   onPressEnter={handleSupplierSearch}
//                   prefix={<SearchOutlined className="text-gray-400" />}
//                 />
//                 {supplierSearchLoading && (
//                   <div className="mt-2 flex items-center">
//                     <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>
//                     <span className="text-sm text-gray-500">Searching...</span>
//                   </div>
//                 )}
//                 {supplierResults.length > 0 && (
//                   <div className="mt-2 border rounded max-h-40 overflow-y-auto">
//                     {supplierResults.map((supplier) => (
//                       <div
//                         key={supplier.supplier_id}
//                         className="p-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => handleSelectSupplier(supplier)}
//                       >
//                         {supplier.supplier_name}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </Form>

//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-medium">Products</h3>
//         <Button
//           type="primary"
//           onClick={() => setIsAddProductModalVisible(true)}
//           className="bg-blue-500"
//         >
//           Add Product
//         </Button>
//       </div>

//       <Table
//         columns={productColumns}
//         dataSource={order.products}
//         rowKey={(record) => record.product_id.toString()} // Use product_id as rowKey
//         pagination={false}
//       />

//       <div className="mt-6 text-right">
//         <p className="text-lg font-medium">
//           Total value: Rs.{order.total_value || 0}
//         </p>
//       </div>

//       <div className="mt-8 flex justify-end gap-2">
//         <Button onClick={onCancel}>Discard</Button>
//         <Button
//           type="primary"
//           onClick={() => onSave(prepareOrderForSave())}
//           className="bg-blue-500"
//           disabled={!order.supplier_id || order.products.length === 0}
//         >
//           {mode === "edit" ? "Save" : "Add Order"}
//         </Button>
//       </div>

//       {/* Add Product Modal */}
//       <Modal
//         title={editingProductIndex !== null ? "Edit Product" : "Add Product"}
//         open={isAddProductModalVisible}
//         onCancel={() => {
//           setIsAddProductModalVisible(false);
//           setProductSearchTerm("");
//           setEditingProductIndex(null);
//           setNewProduct({
//             product_id: "",
//             product_name: "",
//             quantity: "",
//             buying_price: "",
//             value: 0,
//             unit_type: "unit",
//             units_per_package: 1,
//             expired_date: null,
//           });
//         }}
//         footer={[
//           <Button
//             key="cancel"
//             onClick={() => {
//               setIsAddProductModalVisible(false);
//               setProductSearchTerm("");
//               setEditingProductIndex(null);
//               setNewProduct({
//                 product_id: "",
//                 product_name: "",
//                 quantity: "",
//                 buying_price: "",
//                 value: 0,
//                 unit_type: "unit",
//                 units_per_package: 1,
//                 expired_date: null,
//               });
//             }}
//           >
//             Discard
//           </Button>,
//           <Button
//             key="add"
//             type="primary"
//             onClick={handleAddProduct}
//             className="bg-blue-500"
//           >
//             {editingProductIndex !== null ? "Update" : "Add"} Product
//           </Button>,
//         ]}
//       >
//         <div className="space-y-4">
//           <div>
//             <p className="mb-1">Product Name</p>
//             <Input
//               placeholder="Enter product name"
//               value={productSearchTerm}
//               onChange={(e) => handleProductSearch(e.target.value)}
//               disabled={editingProductIndex !== null}
//               prefix={<SearchOutlined className="text-gray-400" />}
//             />

//             {productSearchResults.length > 0 && (
//               <div className="mt-2 border rounded max-h-40 overflow-y-auto">
//                 {productSearchResults.map((product) => (
//                   <div
//                     key={product.id}
//                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => handleSelectProduct(product)}
//                   >
//                     {product.name}
//                     {order.products.some(
//                       (p) => p.product_id === product.id
//                     ) && (
//                       <span className="ml-2 text-xs text-orange-500">
//                         (Already in order)
//                       </span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//             {newProduct.product_name && (
//               <p className="mt-1 text-blue-500">
//                 Selected: {newProduct.product_name}
//               </p>
//             )}
//           </div>
//           <div>
//             <p className="mb-1">Unit Type</p>
//             <Select
//               style={{ width: "100%" }}
//               value={newProduct.unit_type}
//               onChange={(value) =>
//                 setNewProduct({ ...newProduct, unit_type: value })
//               }
//               options={UNIT_TYPES.map((type) => ({
//                 label: type.label,
//                 value: type.value,
//               }))}
//             />
//           </div>

//           {!UNIT_TYPES.find((u) => u.value === newProduct.unit_type)
//             ?.singular && (
//             <div>
//               <p className="mb-1">Units per {newProduct.unit_type}</p>
//               <InputNumber
//                 min={1}
//                 value={newProduct.units_per_package}
//                 onChange={handleUnitsPerPackageChange}
//                 style={{ width: "100%" }}
//               />
//               {newProduct.units_per_package < 1 && (
//                 <p className="text-red-500 text-xs mt-1">
//                   Must be at least 1 unit per package
//                 </p>
//               )}
//             </div>
//           )}

//           <div>
//             <p className="mb-1">Quantity</p>
//             <Input
//               type="number"
//               placeholder="Enter product quantity"
//               value={newProduct.quantity}
//               onChange={(e) => handleQuantityChange(e.target.value)}
//               min={1}
//             />
//           </div>

//           <div>
//             <p className="mb-1">Buying Price (Rs.)</p>
//             <Input
//               type="number"
//               placeholder="Enter buying price"
//               value={newProduct.buying_price}
//               onChange={(e) => handlePriceChange(e.target.value)}
//               min={0}
//               step={0.01}
//             />
//           </div>
//           <div>
//             <p className="mb-1">Expiry Date</p>
//             <DatePicker
//               style={{ width: "100%" }}
//               value={
//                 newProduct.expired_date ? moment(newProduct.expired_date) : null
//               }
//               onChange={(date, dateString) =>
//                 setNewProduct({ ...newProduct, expired_date: dateString })
//               }
//               format="YYYY-MM-DD"
//               disabledDate={(current) =>
//                 current && current < moment().startOf("day")
//               }
//             />
//           </div>

//           {newProduct.buying_price && newProduct.quantity && (
//             <div className="flex justify-end">
//               <p>Total: Rs.{newProduct.value}</p>
//             </div>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default OrderEditForm;
import React, { useState, useEffect } from "react";
import {
  Button,
  DatePicker,
  Input,
  Table,
  Tooltip,
  Modal,
  message,
  Form,
  Select,
  InputNumber,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import { UNIT_TYPES, INVALID_NESTING } from "../constants/units";

const OrderEditForm = ({
  order,
  products,
  mode,
  onSave,
  onCancel,
  onChange,
}) => {
  const [isAddProductModalVisible, setIsAddProductModalVisible] =
    useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [productSearchResults, setProductSearchResults] = useState([]);
  const [newProduct, setNewProduct] = useState({
    product_id: "",
    product_name: "",
    quantity: "",
    buying_price: "",
    value: 0,
    unit_type: "unit", // default to 'unit'
    units_per_package: 1, // default to 1
    expired_date: null,
  });
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [form] = Form.useForm();
  const [supplierResults, setSupplierResults] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierSearchLoading, setSupplierSearchLoading] = useState(false);

  // Add debounce for auto-search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (supplierSearchTerm.trim()) {
        handleSupplierSearch();
      } else {
        setSupplierResults([]);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [supplierSearchTerm]);

  // Set selected supplier if it exists in the order data
  useEffect(() => {
    if (order.supplier_id && order.supplier_name && !selectedSupplier) {
      setSelectedSupplier({
        supplier_id: order.supplier_id,
        supplier_name: order.supplier_name,
      });
    }
  }, [order, selectedSupplier]);

  const handleSupplierSearch = async () => {
    if (!supplierSearchTerm.trim()) {
      setSupplierResults([]);
      return;
    }

    setSupplierSearchLoading(true);
    try {
      const response = await axios.get(
        `/api/supplier-orders/search-suppliers?search=${supplierSearchTerm}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Supplier search response:", response.data);

      // Check if the response has the expected format
      if (response.data.success && Array.isArray(response.data.suppliers)) {
        setSupplierResults(response.data.suppliers);
      } else {
        console.warn(
          "Unexpected supplier search response format:",
          response.data
        );
        setSupplierResults([]);
      }
    } catch (error) {
      console.error("Error searching suppliers:", error);
      setSupplierResults([]);
    } finally {
      setSupplierSearchLoading(false);
    }
  };

  // Supplier selection handler
  const handleSelectSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    onChange({
      ...order,
      supplier_id: supplier.supplier_id,
      supplier_name: supplier.supplier_name,
    });
    setSupplierResults([]);
    setSupplierSearchTerm("");
  };

  const validateProductSelection = () => {
    if (
      !UNIT_TYPES.find((u) => u.value === newProduct.unit_type)?.singular &&
      newProduct.units_per_package < 1
    ) {
      message.error(`Units per ${newProduct.unit_type} must be at least 1`);
      return false;
    }

    if (!newProduct.expired_date) {
      message.error("Please select an expiry date");
      return false;
    }

    if (moment(newProduct.expired_date) < moment().startOf("day")) {
      message.error("Expiry date must be in the future");
      return false;
    }

    // Check if product exists in inventory
    if (!newProduct.product_id) {
      message.error("Please select a valid product");
      return false;
    }

    // Check if product already exists in order (except when editing)
    if (
      editingProductIndex === null &&
      order.products.some((p) => p.product_id === newProduct.product_id)
    ) {
      message.error("This product is already in the order");
      return false;
    }

    // Validate quantity
    if (!newProduct.quantity || newProduct.quantity <= 0) {
      message.error("Please enter a valid quantity");
      return false;
    }

    // Validate price
    if (!newProduct.buying_price || newProduct.buying_price <= 0) {
      message.error("Please enter a valid price");
      return false;
    }

    return true;
  };

  const handleAddProduct = () => {
    if (!validateProductSelection()) {
      return;
    }

    if (
      !newProduct.product_id ||
      !newProduct.quantity ||
      !newProduct.buying_price
    ) {
      message.error("Please complete all product fields");
      return;
    }
    if (newProduct.buying_price <= 0) {
      message.error("Price must be greater than 0");
      return;
    }

    // Check for duplicate product
    if (
      editingProductIndex === null &&
      order.products.some((p) => p.product_id === newProduct.product_id)
    ) {
      message.error("This product is already in the order");
      return;
    }

    const updatedOrder = { ...order };
    const productValue = newProduct.quantity * newProduct.buying_price;

    if (editingProductIndex !== null) {
      updatedOrder.products[editingProductIndex] = {
        ...newProduct,
        value: productValue,
      };
    } else {
      updatedOrder.products = [
        ...updatedOrder.products,
        {
          ...newProduct,
          value: productValue,
        },
      ];
    }

    updatedOrder.total_value = updatedOrder.products.reduce(
      (sum, product) => sum + product.value,
      0
    );

    onChange(updatedOrder);
    setIsAddProductModalVisible(false);
    setEditingProductIndex(null);
    setNewProduct({
      product_id: "",
      product_name: "",
      quantity: "",
      buying_price: "",
      value: 0,
      unit_type: "unit",
      units_per_package: 1,
      expired_date: null,
    });
    setProductSearchTerm("");
  };

  const handleProductSearch = (value) => {
    setProductSearchTerm(value);
    if (value.trim() === "") {
      setProductSearchResults([]);
      return;
    }

    // Get all products that match the search term
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );

    setProductSearchResults(results);
  };

  const handleSelectProduct = (product) => {
    // Check if product is already in the order
    if (order.products.some((p) => p.product_id === product.id)) {
      message.warning("This product is already in the order");
    }

    setNewProduct({
      product_id: product.id,
      product_name: product.name,
      quantity: 1,
      buying_price: product.price,
      value: product.price,
      unit_type: product.default_unit_type || "unit",
      units_per_package: product.default_units_per_package || 1,
    });
    setProductSearchResults([]);
    setProductSearchTerm(product.name);
  };

  const handleQuantityChange = (value) => {
    const quantity = parseInt(value) || 0;
    const price = parseFloat(newProduct.buying_price) || 0;
    setNewProduct({
      ...newProduct,
      quantity,
      value: quantity * price,
    });
  };

  const handlePriceChange = (value) => {
    const price = Math.max(0, parseFloat(value) || 0);
    const quantity = parseInt(newProduct.quantity) || 0;
    setNewProduct({
      ...newProduct,
      buying_price: price,
      value: quantity * price,
    });
  };

  const handleUnitsPerPackageChange = (value) => {
    setNewProduct({
      ...newProduct,
      units_per_package: value === null ? null : value,
    });
  };

  const handleEditProduct = (index) => {
    const product = order.products[index];

    // Check if this product is being used as a container
    const isContainer = order.products.some((p) =>
      INVALID_NESTING[p.unit_type]?.includes(product.unit_type)
    );

    if (isContainer) {
      message.error(
        "Cannot edit this product as it's being used as a container"
      );
      return;
    }

    setNewProduct({
      ...product,
      unit_type: product.unit_type || "unit",
      units_per_package: product.units_per_package || 1,
      expired_date: product.expired_date || null,
    });
    setProductSearchTerm(product.product_name);
    setEditingProductIndex(index);
    setIsAddProductModalVisible(true);
  };

  const handleDeleteProduct = (index) => {
    const updatedOrder = { ...order };
    updatedOrder.products = updatedOrder.products.filter((_, i) => i !== index);
    updatedOrder.total_value = updatedOrder.products.reduce(
      (sum, product) => sum + parseFloat(product.value || 0),
      0
    );
    onChange(updatedOrder);
  };

  const productColumns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Unit Type",
      dataIndex: "unit_type",
      key: "unit_type",
      render: (value) =>
        UNIT_TYPES.find((u) => u.value === value)?.label || value,
    },
    {
      title: "Units/Package",
      dataIndex: "units_per_package",
      key: "units_per_package",
      render: (value, record) =>
        UNIT_TYPES.find((u) => u.value === record.unit_type)?.singular
          ? "N/A"
          : value,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Expired Date",
      dataIndex: "expired_date",
      key: "expired_date",
    },
    {
      title: "Buying Price",
      dataIndex: "buying_price",
      key: "buying_price",
      render: (price) => `Rs.${price}`,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => `Rs.${value}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record, index) => (
        <div className="flex gap-2">
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEditProduct(index);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteProduct(index);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">
        {mode === "edit" ? "Edit Order" : "Add Order"}
      </h2>

      <Form>
        <div className="grid grid-cols-1 gap-6 mb-8">
          {mode === "edit" && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 mb-1">Order ID</p>
                <Input value={order.order_id} disabled />
              </div>
              <div>
                <p className="text-gray-500 mb-1">Manager ID</p>
                <Input value={order.manager_id} disabled />
              </div>
            </div>
          )}
          {/* Supplier Search Field */}
          <div>
            <p className="text-gray-500 mb-1">Supplier</p>
            {selectedSupplier ? (
              <div className="border p-2 rounded bg-blue-50">
                <span className="font-medium">
                  {selectedSupplier.supplier_name}
                </span>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Search suppliers..."
                  value={supplierSearchTerm}
                  onChange={(e) => setSupplierSearchTerm(e.target.value)}
                  onPressEnter={handleSupplierSearch}
                  prefix={<SearchOutlined className="text-gray-400" />}
                />
                {supplierSearchLoading && (
                  <div className="mt-2 flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>
                    <span className="text-sm text-gray-500">Searching...</span>
                  </div>
                )}
                {supplierResults.length > 0 && (
                  <div className="mt-2 border rounded max-h-40 overflow-y-auto">
                    {supplierResults.map((supplier) => (
                      <div
                        key={supplier.supplier_id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectSupplier(supplier)}
                      >
                        {supplier.supplier_name}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Form>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Products</h3>
        <Button
          type="primary"
          onClick={() => setIsAddProductModalVisible(true)}
          className="bg-blue-500"
        >
          Add Product
        </Button>
      </div>

      <Table
        columns={productColumns}
        dataSource={order.products}
        rowKey={(record) => record.product_id.toString()} // Use product_id as rowKey
        pagination={false}
      />

      <div className="mt-6 text-right">
        <p className="text-lg font-medium">
          Total value: Rs.{order.total_value || 0}
        </p>
      </div>

      <div className="mt-8 flex justify-end gap-2">
        <Button onClick={onCancel}>Discard</Button>
        <Button
          type="primary"
          onClick={() => onSave(order)}
          className="bg-blue-500"
          disabled={!order.supplier_id || order.products.length === 0}
        >
          {mode === "edit" ? "Save" : "Add Order"}
        </Button>
      </div>

      {/* Add Product Modal */}
      <Modal
        title={editingProductIndex !== null ? "Edit Product" : "Add Product"}
        open={isAddProductModalVisible}
        onCancel={() => {
          setIsAddProductModalVisible(false);
          setProductSearchTerm("");
          setEditingProductIndex(null);
          setNewProduct({
            product_id: "",
            product_name: "",
            quantity: "",
            buying_price: "",
            value: 0,
            unit_type: "unit",
            units_per_package: 1,
            expired_date: null,
          });
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsAddProductModalVisible(false);
              setProductSearchTerm("");
              setEditingProductIndex(null);
              setNewProduct({
                product_id: "",
                product_name: "",
                quantity: "",
                buying_price: "",
                value: 0,
                unit_type: "unit",
                units_per_package: 1,
                expired_date: null,
              });
            }}
          >
            Discard
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={handleAddProduct}
            className="bg-blue-500"
          >
            {editingProductIndex !== null ? "Update" : "Add"} Product
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div>
            <p className="mb-1">Product Name</p>
            <Input
              placeholder="Enter product name"
              value={productSearchTerm}
              onChange={(e) => handleProductSearch(e.target.value)}
              disabled={editingProductIndex !== null}
              prefix={<SearchOutlined className="text-gray-400" />}
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
                    {order.products.some(
                      (p) => p.product_id === product.id
                    ) && (
                      <span className="ml-2 text-xs text-orange-500">
                        (Already in order)
                      </span>
                    )}
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
            <p className="mb-1">Unit Type</p>
            <Select
              style={{ width: "100%" }}
              value={newProduct.unit_type}
              onChange={(value) =>
                setNewProduct({ ...newProduct, unit_type: value })
              }
              options={UNIT_TYPES.map((type) => ({
                label: type.label,
                value: type.value,
              }))}
            />
          </div>

          {!UNIT_TYPES.find((u) => u.value === newProduct.unit_type)
            ?.singular && (
            <div>
              <p className="mb-1">{newProduct.unit_type} per Units </p>
              <InputNumber
                value={newProduct.units_per_package}
                onChange={handleUnitsPerPackageChange}
                style={{ width: "100%" }}
                // Allow backspace, delete, and numeric input only
                onKeyDown={(e) => {
                  if (
                    [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ].includes(e.key)
                  ) {
                    return; // Allow navigation and deletion keys
                  }
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                // Format display (show empty if undefined/null)
                formatter={(value) => {
                  if (value === undefined || value === null || value === "")
                    return "";
                  return `${value}`;
                }}
                // Parse input (convert empty to null, otherwise to number)
                parser={(value) => {
                  if (value === "" || value === null) return null; // Allows empty field
                  const parsed = parseInt(value.replace(/[^0-9]/g, ""), 10);
                  return isNaN(parsed) ? null : parsed;
                }}
              />
              {newProduct.units_per_package < 1 && (
                <p className="text-red-500 text-xs mt-1">
                  Must be at least 1 unit per package
                </p>
              )}
            </div>
          )}

          <div>
            <p className="mb-1">Quantity</p>
            <Input
              type="number"
              placeholder="Enter product quantity"
              value={newProduct.quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              min={1}
              // Prevent typing non-numeric characters
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              // Ensure positive numbers only
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
          </div>

          <div>
            <p className="mb-1">Buying Price (Rs.)</p>
            <Input
              type="number"
              placeholder="Enter buying price"
              value={newProduct.buying_price}
              onChange={(e) => handlePriceChange(e.target.value)}
              min={0}
              step={0.01}
              // Prevent typing non-numeric characters except decimal point
              onKeyPress={(e) => {
                if (!/[0-9.]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              // Ensure valid decimal numbers only
              onInput={(e) => {
                // Allow only numbers and single decimal point
                e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                //    .replace(/(\..*)\./g, "$1"); // Remove multiple decimal points
              }}
            />
          </div>
          <div>
            <p className="mb-1">Expiry Date</p>
            <DatePicker
              style={{ width: "100%" }}
              value={
                newProduct.expired_date ? moment(newProduct.expired_date) : null
              }
              onChange={(date, dateString) =>
                setNewProduct({ ...newProduct, expired_date: dateString })
              }
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current < moment().startOf("day")
              }
            />
          </div>

          {newProduct.buying_price && newProduct.quantity && (
            <div className="flex justify-end">
              <p>Total: Rs.{newProduct.value}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default OrderEditForm;
