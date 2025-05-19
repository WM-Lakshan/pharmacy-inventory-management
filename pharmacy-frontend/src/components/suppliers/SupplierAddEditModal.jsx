// // import React, { useState } from "react";
// // import { Modal, Form, Input, Select, Button, Avatar, message } from "antd";
// // import { UserOutlined } from "@ant-design/icons";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // const { Option } = Select;

// // const SupplierAddEditModal = ({
// //   visible,
// //   isEditMode,
// //   supplier,
// //   availableProducts,
// //   onCancel,
// //   onSubmitSuccess,
// // }) => {
// //   const [form] = Form.useForm();
// //   const [loading, setLoading] = useState(false);
// //   const [imageFile, setImageFile] = useState(null);
// //   const [imageUrl, setImageUrl] = useState(null);
// //   const navigate = useNavigate();

// //   React.useEffect(() => {
// //     if (visible && isEditMode && supplier) {
// //       form.setFieldsValue({
// //         name: supplier.name,
// //         email: supplier.email,
// //         contactNumber: supplier.contactNumber,
// //         products: supplier.products,
// //         type: supplier.type,
// //         address: supplier.address || "",
// //       });
// //     } else if (visible) {
// //       form.resetFields();
// //     }
// //   }, [visible, isEditMode, supplier, form]);

// //   const handleImageUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setImageFile(file);
// //       const reader = new FileReader();
// //       reader.onload = (e) => setImageUrl(e.target.result);
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleSubmit = async (values) => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem("token");

// //       const formData = new FormData();
// //       formData.append("products", JSON.stringify(values.products));
// //       Object.entries(values).forEach(([key, value]) => {
// //         if (key !== "products" && key !== "image") {
// //           formData.append(key, value);
// //         }
// //       });
// //       if (imageFile) formData.append("image", imageFile);

// //       if (isEditMode) {
// //         await axios.put(`/api/suppliers/${supplier.id}`, formData, {
// //           headers: {
// //             "Content-Type": "multipart/form-data",
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         message.success("Supplier updated successfully!");
// //       } else {
// //         await axios.post("/api/suppliers", formData, {
// //           headers: {
// //             "Content-Type": "multipart/form-data",
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         message.success("Supplier added successfully!");
// //       }

// //       onSubmitSuccess();
// //     } catch (err) {
// //       console.error("Error saving supplier:", err);
// //       if (err.response?.status === 401) {
// //         navigate("/login");
// //       }
// //       message.error(
// //         err.response?.data?.message ||
// //           "Failed to save supplier. Please try again."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Modal
// //       title={isEditMode ? "Edit Supplier" : "New Supplier"}
// //       open={visible}
// //       onCancel={onCancel}
// //       footer={null}
// //       width={500}
// //     >
// //       <Form form={form} layout="vertical" onFinish={handleSubmit}>
// //         <div className="flex justify-center mb-4">
// //           <div className="relative">
// //             <Avatar
// //               size={100}
// //               icon={<UserOutlined />}
// //               src={imageUrl}
// //               className="border border-dashed border-gray-300 cursor-pointer"
// //             />
// //             <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
// //               <label className="text-xs text-blue-500 cursor-pointer">
// //                 Browse image
// //                 <input
// //                   type="file"
// //                   hidden
// //                   accept="image/*"
// //                   onChange={handleImageUpload}
// //                 />
// //               </label>
// //             </div>
// //           </div>
// //         </div>

// //         <Form.Item
// //           name="name"
// //           label="Supplier Name"
// //           rules={[{ required: true, message: "Please enter supplier name" }]}
// //         >
// //           <Input placeholder="Enter supplier name" />
// //         </Form.Item>

// //         <Form.Item
// //           name="email"
// //           label="Email"
// //           rules={[
// //             { required: true, message: "Please enter email" },
// //             { type: "email", message: "Please enter a valid email" },
// //           ]}
// //         >
// //           <Input placeholder="Enter email" />
// //         </Form.Item>

// //         <Form.Item
// //           name="contactNumber"
// //           label="Contact Number"
// //           rules={[
// //             { required: true, message: "Please enter contact number" },
// //             { pattern: /^[0-9]{10}$/, message: "Must be exactly 10 digits" },
// //           ]}
// //         >
// //           <Input
// //             placeholder="Enter 10-digit number"
// //             maxLength={10}
// //             onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
// //           />
// //         </Form.Item>

// //         <Form.Item
// //           name="products"
// //           label="Products"
// //           rules={[{ required: true, message: "Please select products" }]}
// //         >
// //           <Select mode="multiple" placeholder="Select products">
// //             {availableProducts.map((product) => (
// //               <Option key={product} value={product}>
// //                 {product}
// //               </Option>
// //             ))}
// //           </Select>
// //         </Form.Item>

// //         <Form.Item
// //           name="type"
// //           label="Supplier Type"
// //           rules={[{ required: true, message: "Please select supplier type" }]}
// //           initialValue="Taking Return"
// //         >
// //           <Select>
// //             <Option value="Taking Return">Taking Return</Option>
// //             <Option value="Not Taking Return">Not Taking Return</Option>
// //           </Select>
// //         </Form.Item>

// //         <Form.Item
// //           name="address"
// //           label="Address"
// //           rules={[{ required: true, message: "Please enter address" }]}
// //         >
// //           <Input placeholder="Enter supplier address" />
// //         </Form.Item>

// //         <div className="flex justify-end space-x-2 mt-4">
// //           <Button onClick={onCancel}>Cancel</Button>
// //           <Button
// //             type="primary"
// //             htmlType="submit"
// //             loading={loading}
// //             className="bg-blue-500 hover:bg-blue-600"
// //           >
// //             {isEditMode ? "Update Supplier" : "Add Supplier"}
// //           </Button>
// //         </div>
// //       </Form>
// //     </Modal>
// //   );
// // };

// // export default SupplierAddEditModal;

// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Select,
//   Button,
//   Avatar,
//   message,
//   Spin,
// } from "antd";
// import { UserOutlined } from "@ant-design/icons";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const { Option } = Select;

// const SupplierAddEditModal = ({
//   visible,
//   isEditMode,
//   supplier,
//   onCancel,
//   onSubmitSuccess,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(false);
//   const [availableProducts, setAvailableProducts] = useState([]);
//   const [imageFile, setImageFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState(null);
//   const navigate = useNavigate();

//   // Fetch products when modal opens
//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (visible) {
//         try {
//           setLoadingProducts(true);
//           const token = localStorage.getItem("token");
//           const response = await axios.get("/api/suppliers/products", {
//             headers: { Authorization: `Bearer ${token}` },
//             params: { limit: 1000 }, // Adjust as needed
//           });

//           if (response.data.success) {
//             setAvailableProducts(
//               response.data.products.map((product) => ({
//                 id: product._id || product.id,
//                 name: product.name,
//               }))
//             );
//           }
//         } catch (error) {
//           console.error("Error fetching products:", error);
//           message.error("Failed to load products");
//         } finally {
//           setLoadingProducts(false);
//         }
//       }
//     };

//     fetchProducts();
//   }, [visible]);

//   // Initialize form values when modal opens or supplier changes
//   useEffect(() => {
//     if (visible && isEditMode && supplier) {
//       form.setFieldsValue({
//         name: supplier.name,
//         email: supplier.email,
//         contactNumber: supplier.contactNumber,
//         products: supplier.products?.map((p) => p.id) || [],
//         type: supplier.type,
//         address: supplier.address || "",
//       });
//       if (supplier.imageUrl) setImageUrl(supplier.imageUrl);
//     } else if (visible) {
//       form.resetFields();
//       setImageUrl(null);
//     }
//   }, [visible, isEditMode, supplier, form]);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onload = (e) => setImageUrl(e.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (values) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const formData = new FormData();
//       formData.append("name", values.name);
//       formData.append("email", values.email);
//       formData.append("contactNumber", values.contactNumber);
//       formData.append("products", JSON.stringify(values.products || []));
//       formData.append("type", values.type);
//       formData.append("address", values.address);
//       if (imageFile) formData.append("image", imageFile);
//       if (isEditMode && !imageFile && imageUrl) {
//         formData.append("currentImage", imageUrl);
//       }

//       if (isEditMode) {
//         await axios.put(`/api/suppliers/${supplier.id}`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         message.success("Supplier updated successfully!");
//       } else {
//         await axios.post("/api/suppliers", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         message.success("Supplier added successfully!");
//       }

//       onSubmitSuccess();
//       onCancel();
//     } catch (err) {
//       console.error("Error saving supplier:", err);
//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//       message.error(
//         err.response?.data?.message ||
//           `Failed to ${
//             isEditMode ? "update" : "add"
//           } supplier. Please try again.`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       title={isEditMode ? "Edit Supplier" : "Add New Supplier"}
//       open={visible}
//       onCancel={onCancel}
//       footer={null}
//       width={600}
//       destroyOnClose
//     >
//       {loadingProducts ? (
//         <div className="flex justify-center py-8">
//           <Spin size="large" />
//         </div>
//       ) : (
//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//           <div className="flex justify-center mb-4">
//             <div className="relative group">
//               <Avatar
//                 size={100}
//                 icon={<UserOutlined />}
//                 src={imageUrl}
//                 className="border border-dashed border-gray-300 cursor-pointer"
//               />
//               <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-full">
//                 <label className="text-white cursor-pointer text-sm font-medium">
//                   Change Image
//                   <input
//                     type="file"
//                     hidden
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                   />
//                 </label>
//               </div>
//             </div>
//           </div>

//           <Form.Item
//             name="name"
//             label="Supplier Name"
//             rules={[{ required: true, message: "Please enter supplier name" }]}
//           >
//             <Input placeholder="Enter supplier name" />
//           </Form.Item>

//           <Form.Item
//             name="email"
//             label="Email"
//             rules={[
//               { required: true, message: "Please enter email" },
//               { type: "email", message: "Please enter a valid email" },
//             ]}
//           >
//             <Input placeholder="Enter email" />
//           </Form.Item>

//           <Form.Item
//             name="contactNumber"
//             label="Contact Number"
//             rules={[
//               { required: true, message: "Please enter contact number" },
//               {
//                 pattern: /^[0-9]{10}$/,
//                 message: "Please enter a valid 10-digit number",
//               },
//             ]}
//           >
//             <Input
//               placeholder="Enter 10-digit phone number"
//               maxLength={10}
//               onKeyPress={(e) => {
//                 if (!/[0-9]/.test(e.key)) {
//                   e.preventDefault();
//                 }
//               }}
//             />
//           </Form.Item>

//           <Form.Item
//             name="products"
//             label="Products"
//             rules={[
//               { required: true, message: "Please select at least one product" },
//             ]}
//           >
//             <Select
//               mode="multiple"
//               placeholder="Select products"
//               optionFilterProp="children"
//               showSearch
//               filterOption={(input, option) =>
//                 option.children.toLowerCase().includes(input.toLowerCase())
//               }
//             >
//               {availableProducts.map((product) => (
//                 <Option key={product.id} value={product.id}>
//                   {product.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="type"
//             label="Supplier Type"
//             rules={[{ required: true, message: "Please select supplier type" }]}
//           >
//             <Select placeholder="Select supplier type">
//               <Option value="Taking Return">Taking Return</Option>
//               <Option value="Not Taking Return">Not Taking Return</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="address"
//             label="Address"
//             rules={[{ required: true, message: "Please enter address" }]}
//           >
//             <Input.TextArea
//               placeholder="Enter full address"
//               rows={3}
//               showCount
//               maxLength={200}
//             />
//           </Form.Item>

//           <div className="flex justify-end gap-4 mt-6">
//             <Button onClick={onCancel} disabled={loading}>
//               Cancel
//             </Button>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               {isEditMode ? "Update Supplier" : "Add Supplier"}
//             </Button>
//           </div>
//         </Form>
//       )}
//     </Modal>
//   );
// };

// export default SupplierAddEditModal;

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Avatar,
  message,
  Spin,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const SupplierAddEditModal = ({
  visible,
  isEditMode,
  supplier,
  onCancel,
  onSubmitSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  // Fetch products when modal opens
  useEffect(() => {
    const fetchProducts = async () => {
      if (visible) {
        try {
          setLoadingProducts(true);
          const token = localStorage.getItem("token");
          const response = await axios.get("/api/suppliers/products", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.success) {
            setAvailableProducts(response.data.products || []);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
          message.error("Failed to load products");
        } finally {
          setLoadingProducts(false);
        }
      }
    };

    fetchProducts();
  }, [visible]);

  // Initialize form values when modal opens or supplier changes
  useEffect(() => {
    if (visible && isEditMode && supplier) {
      // Extract IDs from products array for the form
      const productIds =
        supplier.products?.map((p) => (typeof p === "object" ? p.id : p)) || [];

      form.setFieldsValue({
        name: supplier.name,
        email: supplier.email,
        contactNumber: supplier.contactNumber,
        products: productIds,
        type: supplier.type,
        address: supplier.address || "",
      });

      setImageUrl(supplier.imageUrl || supplier.image);
    } else if (visible) {
      form.resetFields();
      setImageUrl(null);
    }
  }, [visible, isEditMode, supplier, form]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("contactNumber", values.contactNumber);
      formData.append("products", JSON.stringify(values.products || []));
      formData.append("type", values.type);
      formData.append("address", values.address);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEditMode && !imageFile && imageUrl) {
        formData.append("currentImage", imageUrl);
      }

      if (isEditMode) {
        await axios.put(`/api/suppliers/${supplier.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("Supplier updated successfully!");
      } else {
        await axios.post("/api/suppliers", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("Supplier added successfully!");
      }

      onSubmitSuccess();
      onCancel();
    } catch (err) {
      console.error("Error saving supplier:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
      message.error(
        err.response?.data?.message ||
          `Failed to ${
            isEditMode ? "update" : "add"
          } supplier. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEditMode ? "Edit Supplier" : "Add New Supplier"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      {loadingProducts ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={imageUrl}
                className="border border-dashed border-gray-300 cursor-pointer"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-full">
                <label className="text-white cursor-pointer text-sm font-medium">
                  Change Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          <Form.Item
            name="name"
            label="Supplier Name"
            rules={[{ required: true, message: "Please enter supplier name" }]}
          >
            <Input placeholder="Enter supplier name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="contactNumber"
            label="Contact Number"
            rules={[
              { required: true, message: "Please enter contact number" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit number",
              },
            ]}
          >
            <Input
              placeholder="Enter 10-digit phone number"
              maxLength={10}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="products"
            label="Products"
            rules={[
              { required: true, message: "Please select at least one product" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select products"
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {availableProducts.map((product) => (
                <Option key={product.id} value={product.id}>
                  {product.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Supplier Type"
            rules={[{ required: true, message: "Please select supplier type" }]}
          >
            <Select placeholder="Select supplier type">
              <Option value="Taking Return">Taking Return</Option>
              <Option value="Not Taking Return">Not Taking Return</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input.TextArea
              placeholder="Enter full address"
              rows={3}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEditMode ? "Update Supplier" : "Add Supplier"}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default SupplierAddEditModal;
