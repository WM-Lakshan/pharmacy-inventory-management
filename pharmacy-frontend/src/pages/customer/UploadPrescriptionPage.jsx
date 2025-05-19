// // // import React, { useState, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import {
// // //   Steps,
// // //   Form,
// // //   Input,
// // //   Button,
// // //   Select,
// // //   Upload,
// // //   message,
// // //   Card,
// // //   Divider,
// // //   Result,
// // // } from "antd";
// // // import {
// // //   UploadOutlined,
// // //   InboxOutlined,
// // //   CloseOutlined,
// // //   ArrowLeftOutlined,
// // //   CheckCircleOutlined,
// // // } from "@ant-design/icons";
// // // import axios from "axios";
// // // // import Header from "../../components/customer/Header";
// // // // import Footer from "../../components/customer/Footer";

// // // const { Step } = Steps;
// // // const { Option } = Select;
// // // const { Dragger } = Upload;
// // // const { TextArea } = Input;

// // // const UploadPrescriptionPage = () => {
// // //   const navigate = useNavigate();
// // //   const [currentStep, setCurrentStep] = useState(0);
// // //   const [form] = Form.useForm();
// // //   const [fileList, setFileList] = useState([]);
// // //   const [uploading, setUploading] = useState(false);
// // //   const [orderCompleted, setOrderCompleted] = useState(false);

// // //   useEffect(() => {
// // //     const token = localStorage.getItem("token");
// // //     if (!token) {
// // //       message.warning("Please login to upload prescriptions");
// // //       navigate("/login");
// // //     }
// // //   }, []);

// // //   const handleNext = async () => {
// // //     try {
// // //       // Validate form for current step
// // //       await form.validateFields();

// // //       // If on the last step, submit the form
// // //       if (currentStep === 1) {
// // //         handleSubmit();
// // //       } else {
// // //         setCurrentStep(currentStep + 1);
// // //       }
// // //     } catch (error) {
// // //       console.error("Form validation failed:", error);
// // //     }
// // //   };

// // //   const handlePrevious = () => {
// // //     setCurrentStep(currentStep - 1);
// // //   };

// // //   const handleSubmit = async () => {
// // //     if (fileList.length === 0) {
// // //       message.error("Please upload your prescription");
// // //       return;
// // //     }

// // //     setUploading(true);

// // //     //   try {
// // //     //     const formData = new FormData();

// // //     //     // Append form values
// // //     //     const values = form.getFieldsValue();
// // //     //     Object.keys(values).forEach((key) => {
// // //     //       formData.append(key, values[key]);
// // //     //     });

// // //     //     // Append prescription file
// // //     //     fileList.forEach((file) => {
// // //     //       formData.append("prescription", file.originFileObj);
// // //     //     });

// // //     //     // try {
// // //     //     //   const token = localStorage.getItem("token");
// // //     //     //   await axios.delete(`/api/staff/${selectedMember.pharmacy_staff_id}`, {
// // //     //     //     headers: { Authorization: `Bearer ${token}` },
// // //     //     //   });
// // //     //     // Submit to API
// // //     //     const token = localStorage.getItem("token");
// // //     //     await axios.post("/api/landing/upload-prescription", formData, {
// // //     //       headers: {
// // //     //         "Content-Type": "multipart/form-data",
// // //     //         Authorization: { Authorization: `Bearer ${token}` },
// // //     //       },
// // //     //     });

// // //     //     // Show success
// // //     //     message.success("Prescription uploaded successfully");
// // //     //     setOrderCompleted(true);

// // //     //     // Reset form after successful submission
// // //     //     form.resetFields();
// // //     //     setFileList([]);
// // //     //   } catch (error) {
// // //     //     console.error("Error uploading prescription:", error);
// // //     //     message.error("Failed to upload prescription. Please try again.");

// // //     //     // For demo purposes, show success anyway
// // //     //     setOrderCompleted(true);
// // //     //   } finally {
// // //     //     setUploading(false);
// // //     //   }
// // //     // };

// // //     try {
// // //       const token = localStorage.getItem("token");
// // //       if (!token) {
// // //         message.error("Please login to upload prescriptions");
// // //         navigate("/login");
// // //         return;
// // //       }

// // //       const formData = new FormData();
// // //       const values = form.getFieldsValue();

// // //       Object.keys(values).forEach((key) => {
// // //         if (values[key]) formData.append(key, values[key]);
// // //       });

// // //       fileList.forEach((file) => {
// // //         formData.append("prescription", file.originFileObj);
// // //       });

// // //       const response = await axios.post(
// // //         "/api/landing/upload-prescription",
// // //         formData,
// // //         {
// // //           headers: {
// // //             "Content-Type": "multipart/form-data",
// // //             Authorization: `Bearer ${token}`,
// // //           },
// // //         }
// // //       );

// // //       if (response.data.success) {
// // //         message.success("Prescription uploaded successfully");
// // //         setOrderCompleted(true);
// // //         form.resetFields();
// // //         setFileList([]);
// // //       } else {
// // //         message.error(response.data.message || "Upload failed");
// // //       }
// // //     } catch (error) {
// // //       console.error("Upload error:", error.response?.data || error.message);
// // //       if (error.response?.status === 401) {
// // //         message.error("Session expired. Please login again.");
// // //         navigate("/login");
// // //       } else {
// // //         message.error(
// // //           error.response?.data?.message ||
// // //             "Failed to upload prescription. Please try again."
// // //         );
// // //       }
// // //     } finally {
// // //       setUploading(false);
// // //     }
// // //   };

// // //   const handleFileChange = ({ fileList }) => {
// // //     // Update fileList state
// // //     setFileList(fileList);
// // //   };

// // //   const uploadProps = {
// // //     name: "prescription",
// // //     multiple: false,
// // //     fileList,
// // //     beforeUpload: (file) => {
// // //       // Check file type
// // //       // const isImage = file.type.startsWith("image/");
// // //       // const isPdf = file.type === "application/pdf";

// // //       // if (!isImage && !isPdf) {
// // //       //   message.error("You can only upload image or PDF files!");
// // //       //   return Upload.LIST_IGNORE;
// // //       // }

// // //       // // Check file size (5MB limit)
// // //       // const isLt5M = file.size / 1024 / 1024 < 5;
// // //       // if (!isLt5M) {
// // //       //   message.error("File must be smaller than 5MB!");
// // //       //   return Upload.LIST_IGNORE;
// // //       // }

// // //       // return false; // Prevent auto upload

// // //       const validTypes = ["image/jpeg", "image/png", "application/pdf"];
// // //       const isLt5M = file.size / 1024 / 1024 < 5;

// // //       if (!validTypes.includes(file.type)) {
// // //         message.error("You can only upload JPG, PNG or PDF files!");
// // //         return Upload.LIST_IGNORE;
// // //       }
// // //       if (!isLt5M) {
// // //         message.error("File must be smaller than 5MB!");
// // //         return Upload.LIST_IGNORE;
// // //       }
// // //       return false;
// // //     },
// // //     onChange: handleFileChange,
// // //     onRemove: (file) => {
// // //       setFileList(fileList.filter((f) => f.uid !== file.uid));
// // //     },
// // //   };

// // //   // If order is completed, show success page
// // //   if (orderCompleted) {
// // //     return (
// // //       <div className="min-h-screen flex flex-col">
// // //         {/* <Header /> */}

// // //         <main className="flex-grow container mx-auto px-4 py-8">
// // //           <Card className="max-w-2xl mx-auto">
// // //             <Result
// // //               status="success"
// // //               icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
// // //               title="Prescription Uploaded Successfully!"
// // //               subTitle="We'll notify you when your order is ready."
// // //               extra={[
// // //                 <Button
// // //                   type="primary"
// // //                   key="dashboard"
// // //                   onClick={() => navigate("/dashboard")}
// // //                   className="bg-blue-600"
// // //                 >
// // //                   Go to Dashboard
// // //                 </Button>,
// // //                 <Button key="home" onClick={() => navigate("/")}>
// // //                   Return Home
// // //                 </Button>,
// // //               ]}
// // //             />
// // //           </Card>
// // //         </main>

// // //         {/* <Footer /> */}
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen flex flex-col">
// // //       {/* <Header /> */}

// // //       <main className="flex-grow container mx-auto px-4 py-8">
// // //         <Card className="max-w-2xl mx-auto">
// // //           <div className="flex items-center justify-between mb-6">
// // //             <Button
// // //               icon={<CloseOutlined />}
// // //               type="text"
// // //               onClick={() => navigate(-1)}
// // //             />
// // //             <h1 className="text-xl font-semibold text-center text-blue-600 flex-grow">
// // //               Upload Prescription
// // //             </h1>
// // //             <div className="w-8"></div> {/* Spacer for alignment */}
// // //           </div>

// // //           <Steps current={currentStep} className="mb-8">
// // //             <Step title="Customer Info" />
// // //             <Step title="Upload Prescription" />
// // //           </Steps>

// // //           <Form
// // //             form={form}
// // //             layout="vertical"
// // //             initialValues={{
// // //               deliveryMethod: "Order Pickup",
// // //             }}
// // //           >
// // //             {currentStep === 0 && (
// // //               <div className="space-y-4">
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                   <Form.Item
// // //                     name="fullName"
// // //                     label="Full name"
// // //                     rules={[
// // //                       { required: true, message: "Please enter your name" },
// // //                     ]}
// // //                   >
// // //                     <Input placeholder="Enter your full name" />
// // //                   </Form.Item>

// // //                   <Form.Item name="address" label="Address">
// // //                     <Input placeholder="Enter your address" />
// // //                   </Form.Item>
// // //                 </div>

// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                   <Form.Item
// // //                     name="telephone"
// // //                     label="Telephone number"
// // //                     rules={[
// // //                       {
// // //                         required: true,
// // //                         message: "Please enter your phone number",
// // //                       },
// // //                     ]}
// // //                   >
// // //                     <Input placeholder="Enter your telephone number" />
// // //                   </Form.Item>

// // //                   <Form.Item
// // //                     name="deliveryMethod"
// // //                     label="Delivery method"
// // //                     rules={[
// // //                       {
// // //                         required: true,
// // //                         message: "Please select delivery method",
// // //                       },
// // //                     ]}
// // //                   >
// // //                     <Select>
// // //                       <Option value="Order Pickup">Order Pickup</Option>
// // //                       <Option value="Home Delivery">Home Delivery</Option>
// // //                     </Select>
// // //                   </Form.Item>
// // //                 </div>

// // //                 <Form.Item
// // //                   name="deliveryAddress"
// // //                   label="Address for Delivery"
// // //                   rules={[
// // //                     {
// // //                       required:
// // //                         form.getFieldValue("deliveryMethod") ===
// // //                         "Home Delivery",
// // //                       message: "Please enter delivery address",
// // //                     },
// // //                   ]}
// // //                 >
// // //                   <TextArea
// // //                     rows={4}
// // //                     placeholder="Enter address for delivery"
// // //                     disabled={
// // //                       form.getFieldValue("deliveryMethod") !== "Home Delivery"
// // //                     }
// // //                   />
// // //                 </Form.Item>
// // //               </div>
// // //             )}

// // //             {currentStep === 1 && (
// // //               <div className="space-y-6">
// // //                 <Dragger {...uploadProps} className="px-6 py-8">
// // //                   <p className="text-5xl text-gray-300">
// // //                     <InboxOutlined />
// // //                   </p>
// // //                   <p className="text-lg mt-3">
// // //                     Click or drag prescription to upload
// // //                   </p>
// // //                   <p className="text-gray-500">
// // //                     Support for a single JPG, PNG, or PDF file up to 5MB
// // //                   </p>
// // //                 </Dragger>

// // //                 <div className="bg-blue-50 p-4 rounded-md">
// // //                   <p className="text-blue-700 text-sm">
// // //                     <strong>Note:</strong> Your prescription will be verified by
// // //                     our pharmacist. You will receive a confirmation call once
// // //                     your order is ready.
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             <Divider />

// // //             <div className="flex justify-between mt-6">
// // //               {currentStep > 0 ? (
// // //                 <Button icon={<ArrowLeftOutlined />} onClick={handlePrevious}>
// // //                   Back
// // //                 </Button>
// // //               ) : (
// // //                 <div></div> // Empty div for spacing
// // //               )}

// // //               <Button
// // //                 type="primary"
// // //                 onClick={handleNext}
// // //                 loading={uploading}
// // //                 className="bg-blue-600"
// // //               >
// // //                 {currentStep === 1 ? "Save" : "Next"}
// // //               </Button>
// // //             </div>
// // //           </Form>
// // //         </Card>
// // //       </main>

// // //       {/* <Footer /> */}
// // //     </div>
// // //   );
// // // };

// // // export default UploadPrescriptionPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Steps,
//   Form,
//   Input,
//   Button,
//   Select,
//   Upload,
//   message,
//   Card,
//   Divider,
//   Result,
// } from "antd";
// import {
//   UploadOutlined,
//   InboxOutlined,
//   CloseOutlined,
//   ArrowLeftOutlined,
//   CheckCircleOutlined,
// } from "@ant-design/icons";
// import axios from "axios";

// const { Step } = Steps;
// const { Option } = Select;
// const { Dragger } = Upload;
// const { TextArea } = Input;

// const UploadPrescriptionPage = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [orderCompleted, setOrderCompleted] = useState(false);

//   // Check authentication on component mount and set up form
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       message.error("Please login to upload prescriptions");
//       navigate("/login");
//     }

//     // Set form field dependencies
//     form.setFieldsValue({
//       deliveryMethod: "Order Pickup",
//     });

//     // Watch for changes in deliveryMethod to update form validation rules
//     form.getFieldValue("deliveryMethod") === "Home Delivery"
//       ? form.validateFields(["deliveryAddress"])
//       : form.setFields([
//           {
//             name: "deliveryAddress",
//             errors: [],
//           },
//         ]);

//   }, [navigate, form]);

//   const handleNext = async () => {
//     try {
//       // Validate form for current step
//       await form.validateFields();

//       // If on the last step, submit the form
//       if (currentStep === 1) {
//         handleSubmit();
//       } else {
//         setCurrentStep(currentStep + 1);
//       }
//     } catch (error) {
//       console.error("Form validation failed:", error);
//     }
//   };

//   const handlePrevious = () => {
//     setCurrentStep(currentStep - 1);
//   };

//   const handleSubmit = async () => {
//     try {
//       // Validate form before submission
//       await form.validateFields();

//       if (fileList.length === 0) {
//         message.error("Please upload your prescription");
//         return;
//       }

//       setUploading(true);

//       // Get the token from localStorage
//       const token = localStorage.getItem("token");

//       if (!token) {
//         message.error("Authentication required. Please login again.");
//         navigate("/login");
//         return;
//       }

//       const formData = new FormData();

//       // Append form values
//       const values = form.getFieldsValue();

//       // Log form values for debugging
//       console.log("Form values:", values);

//       // Append each field to formData
//       Object.keys(values).forEach((key) => {
//         if (values[key] !== undefined && values[key] !== null) {
//           formData.append(key, values[key]);
//         }
//       });

//       // Append prescription file
//       fileList.forEach((file) => {
//         formData.append("prescription", file.originFileObj);
//       });

//       // Submit to API with the correct content type and token
//       const response = await axios.post("/api/landing/upload-prescription", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       // Show success message and update state
//       message.success("Prescription uploaded successfully!");
//       setOrderCompleted(true);

//       // Reset form after successful submission
//       form.resetFields();
//       setFileList([]);
//     } catch (error) {
//       console.error("Upload error:", error);

//       // Handle form validation errors
//       if (error.errorFields) {
//         // This is a form validation error
//         return; // Form will show validation errors
//       }

//       // Handle authentication errors
//       if (error.response && error.response.status === 401) {
//         message.error("Session expired. Please login again.");
//         localStorage.removeItem("token");
//         navigate("/login");
//       } else if (error.response && error.response.status === 400) {
//         // Show specific error messages from the server
//         message.error(error.response.data.message || "Please check your form inputs");
//       } else {
//         // Handle other errors
//         message.error(
//           error.response?.data?.message ||
//           "Failed to upload prescription. Please try again."
//         );
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleFileChange = ({ fileList }) => {
//     // Update fileList state
//     setFileList(fileList);
//   };

//   const uploadProps = {
//     name: "prescription",
//     multiple: false,
//     fileList,
//     beforeUpload: (file) => {
//       // Check file type
//       const isImage = file.type.startsWith("image/");
//       const isPdf = file.type === "application/pdf";

//       if (!isImage && !isPdf) {
//         message.error("You can only upload image or PDF files!");
//         return Upload.LIST_IGNORE;
//       }

//       // Check file size (5MB limit)
//       const isLt5M = file.size / 1024 / 1024 < 5;
//       if (!isLt5M) {
//         message.error("File must be smaller than 5MB!");
//         return Upload.LIST_IGNORE;
//       }

//       return false; // Prevent auto upload
//     },
//     onChange: handleFileChange,
//     onRemove: (file) => {
//       const index = fileList.indexOf(file);
//       const newFileList = fileList.slice();
//       newFileList.splice(index, 1);
//       setFileList(newFileList);
//     },
//   };

//   // If order is completed, show success page
//   if (orderCompleted) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <main className="flex-grow container mx-auto px-4 py-8">
//           <Card className="max-w-2xl mx-auto">
//             <Result
//               status="success"
//               icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
//               title="Prescription Uploaded Successfully!"
//               subTitle="We'll notify you when your order is ready. Your prescription will expire in 48 hours."
//               extra={[
//                 <Button
//                   type="primary"
//                   key="dashboard"
//                   onClick={() => navigate("/dashboard")}
//                   className="bg-blue-600"
//                 >
//                   Go to Dashboard
//                 </Button>,
//                 <Button key="home" onClick={() => navigate("/")}>
//                   Return Home
//                 </Button>,
//               ]}
//             />
//           </Card>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="flex-grow container mx-auto px-4 py-8">
//         <Card className="max-w-2xl mx-auto">
//           <div className="flex items-center justify-between mb-6">
//             <Button
//               icon={<CloseOutlined />}
//               type="text"
//               onClick={() => navigate(-1)}
//             />
//             <h1 className="text-xl font-semibold text-center text-blue-600 flex-grow">
//               Upload Prescription
//             </h1>
//             <div className="w-8"></div> {/* Spacer for alignment */}
//           </div>

//           <Steps current={currentStep} className="mb-8">
//             <Step title="Customer Info" />
//             <Step title="Upload Prescription" />
//           </Steps>

//           <Form
//             form={form}
//             layout="vertical"
//             initialValues={{
//               deliveryMethod: "Order Pickup",
//               name: "",
//               telephone: ""
//             }}
//           >
//             {currentStep === 0 && (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Form.Item
//                     name="name"
//                     label="Full name"
//                     rules={[
//                       { required: true, message: "Please enter your name" },
//                     ]}
//                   >
//                     <Input placeholder="Enter your full name" />
//                   </Form.Item>

//                   <Form.Item name="address" label="Address">
//                     <Input placeholder="Enter your address" />
//                   </Form.Item>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Form.Item
//                     name="telephone"
//                     label="Telephone number"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please enter your phone number",
//                       },
//                     ]}
//                   >
//                     <Input placeholder="Enter your telephone number" />
//                   </Form.Item>

//                   <Form.Item
//                     name="deliveryMethod"
//                     label="Delivery method"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please select delivery method",
//                       },
//                     ]}
//                   >
//                     <Select onChange={(value) => {
//                       // When delivery method changes, update form validation rules
//                       if (value === "Home Delivery") {
//                         form.validateFields(["deliveryAddress"]);
//                       } else {
//                         form.setFields([
//                           {
//                             name: "deliveryAddress",
//                             errors: [],
//                           },
//                         ]);
//                       }
//                     }}>
//                       <Option value="Order Pickup">Order Pickup</Option>
//                       <Option value="Home Delivery">Home Delivery</Option>
//                     </Select>
//                   </Form.Item>
//                 </div>

//                 <Form.Item
//                   name="deliveryAddress"
//                   label="Address for Delivery"
//                   rules={[
//                     {
//                       required: form.getFieldValue("deliveryMethod") === "Home Delivery",
//                       message: "Please enter delivery address",
//                       validator: (_, value) => {
//                         if (form.getFieldValue("deliveryMethod") === "Home Delivery" && (!value || value.trim() === "")) {
//                           return Promise.reject("Please enter delivery address");
//                         }
//                         return Promise.resolve();
//                       }
//                     },
//                   ]}
//                 >
//                   <TextArea
//                     rows={4}
//                     placeholder="Enter address for delivery"
//                     disabled={form.getFieldValue("deliveryMethod") !== "Home Delivery"}
//                   />
//                 </Form.Item>
//               </div>
//             )}

//             {currentStep === 1 && (
//               <div className="space-y-6">
//                 <Dragger {...uploadProps} className="px-6 py-8">
//                   <p className="text-5xl text-gray-300">
//                     <InboxOutlined />
//                   </p>
//                   <p className="text-lg mt-3">
//                     Click or drag prescription to upload
//                   </p>
//                   <p className="text-gray-500">
//                     Support for a single JPG, PNG, or PDF file up to 5MB
//                   </p>
//                 </Dragger>

//                 <div className="bg-blue-50 p-4 rounded-md">
//                   <p className="text-blue-700 text-sm">
//                     <strong>Note:</strong> Your prescription will be verified by
//                     our pharmacist. It will expire in 48 hours. You will receive
//                     a confirmation call once your order is ready.
//                   </p>
//                 </div>
//               </div>
//             )}

//             <Divider />

//             <div className="flex justify-between mt-6">
//               {currentStep > 0 ? (
//                 <Button icon={<ArrowLeftOutlined />} onClick={handlePrevious}>
//                   Back
//                 </Button>
//               ) : (
//                 <div></div> // Empty div for spacing
//               )}

//               <Button
//                 type="primary"
//                 onClick={handleNext}
//                 loading={uploading}
//                 className="bg-blue-600"
//               >
//                 {currentStep === 1 ? "Save" : "Next"}
//               </Button>
//             </div>
//           </Form>
//         </Card>
//       </main>
//     </div>
//   );
// };

// export default UploadPrescriptionPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Steps,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Card,
  Divider,
  Result,
} from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Step } = Steps;
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

const UploadPrescriptionPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Form state management (manual approach)
  const [formData, setFormData] = useState({
    name: "",
    telephone: "",
    address: "",
    deliveryMethod: "Order Pickup",
    // deliveryAddress: "",
    note: "",
  });

  // Handle form field changes
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Form validation state
  const [errors, setErrors] = useState({});

  // Check authentication when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Please login to upload prescriptions");
      navigate("/login");
    }
  }, [navigate]);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Please enter your phone number";
    }

    // if (
    //   formData.deliveryMethod === "Home Delivery" &&
    //   !formData.deliveryAddress.trim()
    // ) {
    //   newErrors.deliveryAddress = "Please enter delivery address";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Validate first step before proceeding
      if (validateForm()) {
        setCurrentStep(1);
      } else {
        // Show validation error messages
        for (const field in errors) {
          message.error(errors[field]);
        }
      }
    } else {
      // Final step submission
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    setCurrentStep(0);
  };

  const handleSubmit = async () => {
    // Final validation
    if (!validateForm()) {
      for (const field in errors) {
        message.error(errors[field]);
      }
      return;
    }

    // Check file upload
    if (fileList.length === 0) {
      message.error("Please upload your prescription");
      return;
    }

    setUploading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication required. Please login again.");
        navigate("/login");
        return;
      }

      // Create form data for submission
      const submitData = new FormData();

      // Map frontend field names to backend expected names
      submitData.append("fullName", formData.name);
      submitData.append("telephone", formData.telephone);
      submitData.append("address", formData.address);
      submitData.append("deliveryMethod", formData.deliveryMethod);
      //submitData.append("deliveryAddress", formData.deliveryAddress);
      submitData.append("note", formData.note);
      // Add all form fields to FormData
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      }

      // Add prescription file
      if (fileList[0]?.originFileObj) {
        submitData.append("prescription", fileList[0].originFileObj);
      }

      // Debug log
      console.log("Final form data being sent:");
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // Submit form
      const response = await axios.post(
        "/api/landing/upload-prescription",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Prescription uploaded successfully!");
      setOrderCompleted(true);

      // Reset form
      setFormData({
        name: "",
        telephone: "",
        address: "",
        deliveryMethod: "Order Pickup",
        // deliveryAddress: "",
        note: "",
      });
      setFileList([]);
    } catch (error) {
      console.error("Upload error:", error);

      if (error.response?.status === 401) {
        message.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 400) {
        message.error(error.response.data.message || "Missing required fields");
      } else {
        message.error("Failed to upload prescription. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (info) => {
    // Limit to only one file
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);
  };

  const uploadProps = {
    name: "prescription",
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      // Check file type
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      if (!isImage && !isPdf) {
        message.error("You can only upload image or PDF files!");
        return Upload.LIST_IGNORE;
      }

      // Check file size (5MB limit)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("File must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }

      return false; // Prevent auto upload
    },
    onChange: handleFileChange,
  };

  // Show success page if order is completed
  if (orderCompleted) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <Result
              status="success"
              icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              title="Prescription Uploaded Successfully!"
              subTitle="We'll notify you when your order is ready. Your prescription will expire in 48 hours."
              extra={[
                // <Button
                //   type="primary"
                //   key="dashboard"
                //   onClick={() => navigate("/dashboard")}
                //   className="bg-blue-600"
                // >
                //   Go to Dashboard
                // </Button>,
                <Button key="home" onClick={() => navigate("/home")}>
                  Return Home
                </Button>,
              ]}
            />
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              icon={<CloseOutlined />}
              type="text"
              onClick={() => navigate(-1)}
            />
            <h1 className="text-xl font-semibold text-center text-blue-600 flex-grow">
              Upload Prescription
            </h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>

          <Steps current={currentStep} className="mb-8">
            <Step title="Customer Info" />
            <Step title="Upload Prescription" />
          </Steps>

          {currentStep === 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    status={errors.name ? "error" : ""}
                  />
                  {errors.name && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) =>
                      handleFormChange("address", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Enter your telephone number"
                    value={formData.telephone}
                    onChange={(e) =>
                      handleFormChange("telephone", e.target.value)
                    }
                    status={errors.telephone ? "error" : ""}
                  />
                  {errors.telephone && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.telephone}
                    </div>
                  )}
                </div>

                <div className="form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery method <span className="text-red-500">*</span>
                  </label>
                  <Select
                    style={{ width: "100%" }}
                    value={formData.deliveryMethod}
                    onChange={(value) =>
                      handleFormChange("deliveryMethod", value)
                    }
                  >
                    <Option value="Order Pickup">Order Pickup</Option>
                    <Option value="Home Delivery">Home Delivery</Option>
                  </Select>
                </div>
              </div>

              {/* <div className="form-item">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address for Delivery
                  {formData.deliveryMethod === "Home Delivery" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <TextArea
                  rows={4}
                  placeholder="Enter address for delivery"
                  disabled={formData.deliveryMethod !== "Home Delivery"}
                  value={formData.deliveryAddress}
                  onChange={(e) =>
                    handleFormChange("deliveryAddress", e.target.value)
                  }
                  status={errors.deliveryAddress ? "error" : ""}
                />
                {errors.deliveryAddress && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.deliveryAddress}
                  </div>
                )}
              </div> */}
            </div>
          ) : (
            <div className="space-y-6">
              <Dragger {...uploadProps} className="px-6 py-8">
                <p className="text-5xl text-gray-300">
                  <InboxOutlined />
                </p>
                <p className="text-lg mt-3">
                  Click or drag prescription to upload
                </p>
                <p className="text-gray-500">
                  Support for a single JPG, PNG, or PDF file up to 5MB
                </p>
              </Dragger>

              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-blue-700 text-sm">
                  <strong>Note:</strong> Your prescription will be verified by
                  our pharmacist. It will expire in 48 hours. You will receive a
                  confirmation call once your order is ready.
                </p>
              </div>

              <div className="form-item">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <TextArea
                  rows={4}
                  placeholder="Any special instructions or notes for the pharmacist"
                  value={formData.note}
                  onChange={(e) => handleFormChange("note", e.target.value)}
                />
              </div>
            </div>
          )}

          <Divider />

          <div className="flex justify-between mt-6">
            {currentStep > 0 ? (
              <Button icon={<ArrowLeftOutlined />} onClick={handlePrevious}>
                Back
              </Button>
            ) : (
              <div></div> // Empty div for spacing
            )}

            <Button
              type="primary"
              onClick={handleNext}
              loading={uploading}
              className="bg-blue-600"
            >
              {currentStep === 1 ? "Upload" : "Next"}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default UploadPrescriptionPage;
