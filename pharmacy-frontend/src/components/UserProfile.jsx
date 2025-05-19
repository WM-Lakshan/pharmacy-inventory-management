// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Button,
//   Card,
//   Avatar,
//   Form,
//   Input,
//   message,
//   Divider,
//   Spin,
//   Upload,
//   Modal,
// } from "antd";
// import {
//   UserOutlined,
//   EditOutlined,
//   SaveOutlined,
//   LockOutlined,
//   UploadOutlined,
//   MailOutlined,
//   PhoneOutlined,
//   HomeOutlined,
//   IdcardOutlined,
// } from "@ant-design/icons";

// const UserProfile = () => {
//   const [userDetails, setUserDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [passwordModalVisible, setPasswordModalVisible] = useState(false);
//   const [uploadModalVisible, setUploadModalVisible] = useState(false);
//   const [imageUrl, setImageUrl] = useState(null);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [form] = Form.useForm();
//   const [passwordForm] = Form.useForm();

//   // Fetch user details on component mount
//   useEffect(() => {
//     fetchUserDetails();
//   }, []);

//   const fetchUserDetails = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       if (!token) {
//         message.error("Authentication required. Please log in.");
//         // In a real app, you would redirect to login here
//         return;
//       }

//       const response = await axios.get("/api/users/profile", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         setUserDetails(response.data.user);
//         setImageUrl(response.data.user.profileImage || null);

//         // For customers, name is a single field
//         // For staff, manager, and supplier, name is fullName (concatenation of F_name and L_name)
//         form.setFieldsValue({
//           name: response.data.user.fullName || response.data.user.name,
//           userId: response.data.user.id,
//           address: response.data.user.address,
//           contact: response.data.user.contactNumber,
//           email: response.data.user.email,
//         });
//       } else {
//         message.error(response.data.message || "Failed to load user details");
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       message.error("Error loading user profile");

//       // For demo/development purposes, set mock data if API fails
//       const mockUser = {
//         id: "456567",
//         fullName: "Muthuka Lakshan",
//         address: "no:03, bchabchabchjac",
//         contactNumber: "071 456 4563",
//         email: "lakshan@gmail.com",
//         profileImage: null,
//       };

//       setUserDetails(mockUser);
//       form.setFieldsValue({
//         name: mockUser.fullName,
//         userId: mockUser.id,
//         address: mockUser.address,
//         contact: mockUser.contactNumber,
//         email: mockUser.email,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditToggle = () => {
//     if (editMode) {
//       // If we're in edit mode and clicking save, submit the form
//       form.submit();
//     } else {
//       // Otherwise, just toggle edit mode
//       setEditMode(true);
//     }
//   };

//   const handleUpdateDetails = async (values) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       if (!token) {
//         message.error("Authentication required. Please log in.");
//         return;
//       }

//       const updatedDetails = {
//         name: values.name,
//         address: values.address,
//         contactNumber: values.contact,
//         email: values.email,
//       };

//       const response = await axios.put("/api/users/profile", updatedDetails, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         message.success("Profile updated successfully");
//         setUserDetails({
//           ...userDetails,
//           fullName: values.name, // Update fullName for display
//           address: values.address,
//           contactNumber: values.contact,
//           email: values.email,
//         });
//         setEditMode(false);
//       } else {
//         message.error(response.data.message || "Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);

//       // Check for email already exists error
//       if (
//         error.response &&
//         error.response.status === 400 &&
//         error.response.data.message ===
//           "Email already in use by another account"
//       ) {
//         message.error(
//           "This email is already registered with another account. Please use a different email."
//         );
//         // Focus on the email field
//         form.getFieldInstance("email").focus();
//       } else {
//         message.error("Error updating profile. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordChange = async (values) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       if (!token) {
//         message.error("Authentication required. Please log in.");
//         return;
//       }

//       if (values.newPassword !== values.confirmPassword) {
//         message.error("New passwords do not match");
//         return;
//       }

//       const passwordData = {
//         currentPassword: values.currentPassword,
//         newPassword: values.newPassword,
//       };

//       const response = await axios.put("/api/users/password", passwordData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         message.success("Password changed successfully");
//         setPasswordModalVisible(false);
//         passwordForm.resetFields();
//       } else {
//         message.error(response.data.message || "Failed to change password");
//       }
//     } catch (error) {
//       console.error("Error changing password:", error);

//       // Check for incorrect current password error
//       if (
//         error.response &&
//         error.response.status === 400 &&
//         error.response.data.message === "Current password is incorrect"
//       ) {
//         message.error("Current password is incorrect. Please try again.");
//         // Focus on the current password field
//         passwordForm.getFieldInstance("currentPassword").focus();
//       } else {
//         message.error("Error changing password. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProfileImageUpload = async (options) => {
//     const { file, onSuccess, onError } = options;

//     setUploadLoading(true);

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         message.error("Authentication required. Please log in.");
//         onError();
//         return;
//       }

//       // Create form data
//       const formData = new FormData();
//       formData.append("profileImage", file);

//       const response = await axios.post("/api/users/profile-image", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.data.success) {
//         setImageUrl(response.data.imageUrl);
//         message.success("Profile image updated successfully");
//         onSuccess();
//       } else {
//         message.error(response.data.message || "Failed to upload image");
//         onError();
//       }
//     } catch (error) {
//       console.error("Error uploading profile image:", error);
//       message.error("Error uploading image. Please try again.");
//       onError();

//       // For demo/development, set a local URL to see the changes
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = () => {
//           setImageUrl(reader.result);
//           message.success("Profile image updated successfully (Demo mode)");
//         };
//         reader.readAsDataURL(file);
//       }
//     } finally {
//       setUploadLoading(false);
//       setUploadModalVisible(false);
//     }
//   };

//   if (loading && !userDetails) {
//     return (
//       <div className="flex justify-center items-center h-full">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   const uploadButton = (
//     <div className="flex flex-col items-center">
//       <UploadOutlined className="text-2xl" />
//       <div className="mt-2">Upload</div>
//     </div>
//   );

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <Card className="shadow-md">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-semibold text-gray-800">User Profile</h1>
//           <div className="flex space-x-4">
//             <Button
//               type="primary"
//               onClick={handleEditToggle}
//               icon={editMode ? <SaveOutlined /> : <EditOutlined />}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               {editMode ? "Save" : "Edit Profile"}
//             </Button>
//             {!editMode && (
//               <Button
//                 type="default"
//                 onClick={() => setPasswordModalVisible(true)}
//                 icon={<LockOutlined />}
//               >
//                 Change Password
//               </Button>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row">
//           {/* Profile Image Section */}
//           <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
//             <div
//               className="w-48 h-48 border-2 border-gray-200 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
//               onClick={() => setUploadModalVisible(true)}
//             >
//               {imageUrl ? (
//                 <img
//                   src={imageUrl}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <Avatar
//                   icon={<UserOutlined />}
//                   className="w-full h-full text-5xl flex items-center justify-center bg-gray-200 text-gray-500"
//                 />
//               )}
//             </div>
//             <Button
//               type="dashed"
//               onClick={() => setUploadModalVisible(true)}
//               icon={<UploadOutlined />}
//               className="mt-4"
//             >
//               Change Photo
//             </Button>
//           </div>

//           {/* User Details Form */}
//           <div className="flex-1">
//             <Form
//               form={form}
//               layout="vertical"
//               onFinish={handleUpdateDetails}
//               initialValues={{
//                 name: userDetails?.fullName || userDetails?.name || "",
//                 userId: userDetails?.id || "",
//                 address: userDetails?.address || "",
//                 contact: userDetails?.contactNumber || "",
//                 email: userDetails?.email || "",
//               }}
//             >
//               <Form.Item
//                 name="name"
//                 label="Full Name"
//                 rules={[{ required: true, message: "Please enter your name" }]}
//               >
//                 {editMode ? (
//                   <Input prefix={<UserOutlined className="text-gray-400" />} />
//                 ) : (
//                   <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
//                     <UserOutlined className="text-gray-400 mr-2" />
//                     {userDetails?.fullName || userDetails?.name}
//                   </div>
//                 )}
//               </Form.Item>

//               <Form.Item name="userId" label="User ID">
//                 <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
//                   <IdcardOutlined className="text-gray-400 mr-2" />
//                   {userDetails?.id}
//                 </div>
//               </Form.Item>

//               <Form.Item
//                 name="address"
//                 label="Address"
//                 rules={[
//                   { required: true, message: "Please enter your address" },
//                 ]}
//               >
//                 {editMode ? (
//                   <Input prefix={<HomeOutlined className="text-gray-400" />} />
//                 ) : (
//                   <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
//                     <HomeOutlined className="text-gray-400 mr-2" />
//                     {userDetails?.address}
//                   </div>
//                 )}
//               </Form.Item>

//               <Form.Item
//                 name="contact"
//                 label="Contact Number"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter your contact number",
//                   },
//                 ]}
//               >
//                 {editMode ? (
//                   <Input prefix={<PhoneOutlined className="text-gray-400" />} />
//                 ) : (
//                   <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
//                     <PhoneOutlined className="text-gray-400 mr-2" />
//                     {userDetails?.contactNumber}
//                   </div>
//                 )}
//               </Form.Item>

//               <Form.Item
//                 name="email"
//                 label="Email"
//                 rules={[
//                   { required: true, message: "Please enter your email" },
//                   { type: "email", message: "Please enter a valid email" },
//                 ]}
//                 help={
//                   editMode
//                     ? "Changing your email requires it to be unique across all users."
//                     : ""
//                 }
//               >
//                 {editMode ? (
//                   <Input prefix={<MailOutlined className="text-gray-400" />} />
//                 ) : (
//                   <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
//                     <MailOutlined className="text-gray-400 mr-2" />
//                     {userDetails?.email}
//                   </div>
//                 )}
//               </Form.Item>

//               {editMode && (
//                 <Form.Item>
//                   <div className="flex justify-end space-x-4">
//                     <Button onClick={() => setEditMode(false)}>Cancel</Button>
//                     <Button
//                       type="primary"
//                       htmlType="submit"
//                       loading={loading}
//                       className="bg-blue-600 hover:bg-blue-700"
//                     >
//                       Save Changes
//                     </Button>
//                   </div>
//                 </Form.Item>
//               )}
//             </Form>
//           </div>
//         </div>
//       </Card>

//       {/* Password Change Modal */}
//       <Modal
//         title="Change Password"
//         visible={passwordModalVisible}
//         onCancel={() => setPasswordModalVisible(false)}
//         footer={null}
//       >
//         <Form
//           form={passwordForm}
//           layout="vertical"
//           onFinish={handlePasswordChange}
//         >
//           <Form.Item
//             name="currentPassword"
//             label="Current Password"
//             rules={[
//               { required: true, message: "Please enter your current password" },
//             ]}
//           >
//             <Input.Password
//               prefix={<LockOutlined className="text-gray-400" />}
//             />
//           </Form.Item>

//           <Form.Item
//             name="newPassword"
//             label="New Password"
//             rules={[
//               { required: true, message: "Please enter your new password" },
//               { min: 8, message: "Password must be at least 8 characters" },
//             ]}
//           >
//             <Input.Password
//               prefix={<LockOutlined className="text-gray-400" />}
//             />
//           </Form.Item>

//           <Form.Item
//             name="confirmPassword"
//             label="Confirm New Password"
//             dependencies={["newPassword"]}
//             rules={[
//               { required: true, message: "Please confirm your new password" },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || getFieldValue("newPassword") === value) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject(
//                     new Error("The two passwords do not match")
//                   );
//                 },
//               }),
//             ]}
//           >
//             <Input.Password
//               prefix={<LockOutlined className="text-gray-400" />}
//             />
//           </Form.Item>

//           <div className="flex justify-end space-x-4">
//             <Button onClick={() => setPasswordModalVisible(false)}>
//               Cancel
//             </Button>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               Change Password
//             </Button>
//           </div>
//         </Form>
//       </Modal>

//       {/* Upload Profile Image Modal */}
//       <Modal
//         title="Upload Profile Picture"
//         visible={uploadModalVisible}
//         onCancel={() => setUploadModalVisible(false)}
//         footer={null}
//       >
//         <div className="text-center">
//           <Upload
//             name="avatar"
//             listType="picture-card"
//             className="avatar-uploader"
//             showUploadList={false}
//             customRequest={handleProfileImageUpload}
//             beforeUpload={(file) => {
//               const isJpgOrPng =
//                 file.type === "image/jpeg" || file.type === "image/png";
//               if (!isJpgOrPng) {
//                 message.error("You can only upload JPG/PNG file!");
//               }
//               const isLt2M = file.size / 1024 / 1024 < 2;
//               if (!isLt2M) {
//                 message.error("Image must be smaller than 2MB!");
//               }
//               return isJpgOrPng && isLt2M;
//             }}
//           >
//             {imageUrl ? (
//               <img src={imageUrl} alt="Avatar" style={{ width: "100%" }} />
//             ) : (
//               uploadButton
//             )}
//           </Upload>
//           <Divider />
//           <p className="text-gray-500 mb-4">
//             Upload a new profile picture. JPG or PNG format, max 2MB.
//           </p>
//           <div className="flex justify-end space-x-4">
//             <Button onClick={() => setUploadModalVisible(false)}>Cancel</Button>
//             <Button
//               type="primary"
//               loading={uploadLoading}
//               className="bg-blue-600 hover:bg-blue-700"
//               onClick={() => setUploadModalVisible(false)}
//             >
//               Done
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default UserProfile;

// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Card,
// // //   Avatar,
// // //   Button,
// // //   Form,
// // //   Input,
// // //   message,
// // //   Tabs,
// // //   Divider,
// // //   Modal,
// // //   Spin,
// // //   Upload,
// // //   Image,
// // // } from "antd";
// // // import {
// // //   UserOutlined,
// // //   EditOutlined,
// // //   SaveOutlined,
// // //   CloseOutlined,
// // //   UploadOutlined,
// // //   LockOutlined,
// // //   EyeInvisibleOutlined,
// // //   EyeTwoTone,
// // //   LoadingOutlined,
// // // } from "@ant-design/icons";
// // // import axios from "axios";

// // // const { TabPane } = Tabs;

// // // const UserProfile = () => {
// // //   // State variables
// // //   const [user, setUser] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [editMode, setEditMode] = useState(false);
// // //   const [passwordChanging, setPasswordChanging] = useState(false);
// // //   const [previewVisible, setPreviewVisible] = useState(false);
// // //   const [uploadLoading, setUploadLoading] = useState(false);
// // //   const [activeTab, setActiveTab] = useState("1");

// // //   // Form instances
// // //   const [form] = Form.useForm();
// // //   const [passwordForm] = Form.useForm();

// // //   // Fetch user data on component mount
// // //   useEffect(() => {
// // //     fetchUserProfile();
// // //   }, []);

// // //   const fetchUserProfile = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const token = localStorage.getItem("token");

// // //       if (!token) {
// // //         message.error("Please login to view your profile");
// // //         return;
// // //       }

// // //       const response = await axios.get("/api/users/profile", {
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //       });

// // //       if (response.data.success) {
// // //         const userData = response.data.user;
// // //         setUser(userData);

// // //         // Initialize form with user data
// // //         form.setFieldsValue({
// // //           name: userData.fullName,
// // //           email: userData.email,
// // //           address: userData.address || "",
// // //           contactNumber: userData.contactNumber || "",
// // //         });
// // //       } else {
// // //         message.error(response.data.message || "Failed to load profile");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching profile:", error);
// // //       message.error("Failed to load profile. Please try again later.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleProfileUpdate = async (values) => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       if (!token) {
// // //         message.error("Authentication required");
// // //         return;
// // //       }

// // //       const response = await axios.put("/api/users/profile", values, {
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           "Content-Type": "application/json",
// // //         },
// // //       });

// // //       if (response.data.success) {
// // //         message.success("Profile updated successfully");
// // //         setEditMode(false);
// // //         fetchUserProfile(); // Refresh data
// // //       } else {
// // //         message.error(response.data.message || "Failed to update profile");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error updating profile:", error);
// // //       message.error(
// // //         error.response?.data?.message || "Failed to update profile"
// // //       );
// // //     }
// // //   };

// // //   const handlePasswordChange = async (values) => {
// // //     try {
// // //       setPasswordChanging(true);

// // //       const token = localStorage.getItem("token");
// // //       if (!token) {
// // //         message.error("Authentication required");
// // //         return;
// // //       }

// // //       const response = await axios.put(
// // //         "/api/users/password",
// // //         {
// // //           currentPassword: values.currentPassword,
// // //           newPassword: values.newPassword,
// // //         },
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${token}`,
// // //             "Content-Type": "application/json",
// // //           },
// // //         }
// // //       );

// // //       if (response.data.success) {
// // //         message.success("Password changed successfully");
// // //         passwordForm.resetFields();
// // //       } else {
// // //         message.error(response.data.message || "Failed to change password");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error changing password:", error);

// // //       if (error.response?.status === 404) {
// // //         message.error(
// // //           "API endpoint not found. Please check server configuration."
// // //         );
// // //       } else if (error.response?.status === 401) {
// // //         message.error("Authentication error. Please login again.");
// // //       } else if (error.response?.data?.message) {
// // //         message.error(error.response.data.message);
// // //       } else {
// // //         message.error("Failed to change password. Please try again later.");
// // //       }
// // //     } finally {
// // //       setPasswordChanging(false);
// // //     }
// // //   };

// // //   const handleAvatarClick = () => {
// // //     if (editMode) {
// // //       // In edit mode, avatar click triggers file upload
// // //       document.getElementById("avatar-upload").click();
// // //     } else {
// // //       // In view mode, avatar click shows preview
// // //       setPreviewVisible(true);
// // //     }
// // //   };

// // //   const handleAvatarChange = async (info) => {
// // //     if (info.file.status === "uploading") {
// // //       setUploadLoading(true);
// // //       return;
// // //     }

// // //     if (info.file.status === "done") {
// // //       setUploadLoading(false);
// // //       message.success("Profile image updated successfully");

// // //       // Update user state with new image URL
// // //       setUser({
// // //         ...user,
// // //         profileImage: info.file.response.imageUrl,
// // //       });
// // //     } else if (info.file.status === "error") {
// // //       setUploadLoading(false);
// // //       message.error("Error uploading image");
// // //     }
// // //   };

// // //   const customUploadRequest = async ({ file, onSuccess, onError }) => {
// // //     const formData = new FormData();
// // //     formData.append("profileImage", file);

// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const response = await axios.post("/api/users/profile-image", formData, {
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           "Content-Type": "multipart/form-data",
// // //         },
// // //       });

// // //       if (response.data.success) {
// // //         onSuccess(response.data, file);
// // //       } else {
// // //         onError(new Error(response.data.message || "Upload failed"));
// // //       }
// // //     } catch (error) {
// // //       console.error("Error uploading image:", error);
// // //       onError(error);
// // //     }
// // //   };

// // //   const handleTabChange = (key) => {
// // //     setActiveTab(key);
// // //   };

// // //   const toggleEditMode = () => {
// // //     if (editMode) {
// // //       // If exiting edit mode, reset form to original values
// // //       form.setFieldsValue({
// // //         name: user.fullName,
// // //         email: user.email,
// // //         address: user.address || "",
// // //         contactNumber: user.contactNumber || "",
// // //       });
// // //     }
// // //     setEditMode(!editMode);
// // //   };

// // //   // If still loading
// // //   if (loading) {
// // //     return (
// // //       <div className="flex justify-center items-center min-h-screen">
// // //         <Spin size="large" />
// // //       </div>
// // //     );
// // //   }

// // //   // If user data failed to load
// // //   if (!user) {
// // //     return (
// // //       <div className="flex flex-col items-center justify-center min-h-screen p-4">
// // //         <div className="text-red-500 text-xl mb-4">
// // //           Failed to load user profile
// // //         </div>
// // //         <Button type="primary" onClick={fetchUserProfile}>
// // //           Retry
// // //         </Button>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
// // //       <Card
// // //         className="mb-6 shadow-md"
// // //         title={
// // //           <div className="flex justify-between items-center">
// // //             <span className="text-lg font-medium">User Profile</span>
// // //             <Button
// // //               type={editMode ? "default" : "primary"}
// // //               icon={editMode ? <CloseOutlined /> : <EditOutlined />}
// // //               onClick={toggleEditMode}
// // //             >
// // //               {editMode ? "Cancel" : "Edit Profile"}
// // //             </Button>
// // //           </div>
// // //         }
// // //       >
// // //         <div className="flex flex-col md:flex-row items-center md:items-start">
// // //           <div className="mb-6 md:mb-0 md:mr-8 flex flex-col items-center">
// // //             <div
// // //               className={`relative cursor-pointer ${editMode ? "group" : ""}`}
// // //               onClick={handleAvatarClick}
// // //             >
// // //               <Avatar
// // //                 size={120}
// // //                 icon={<UserOutlined />}
// // //                 src={user.profileImage}
// // //                 className={`${
// // //                   editMode ? "hover:opacity-70" : ""
// // //                 } transition-opacity duration-200`}
// // //               />
// // //               {editMode && (
// // //                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-200">
// // //                   <UploadOutlined className="text-white text-2xl" />
// // //                 </div>
// // //               )}
// // //             </div>
// // //             <Upload
// // //               name="profileImage"
// // //               showUploadList={false}
// // //               customRequest={customUploadRequest}
// // //               onChange={handleAvatarChange}
// // //               accept="image/*"
// // //               className="hidden"
// // //             >
// // //               <input id="avatar-upload" type="file" className="hidden" />
// // //             </Upload>
// // //             {editMode && (
// // //               <div className="text-xs text-gray-500 mt-2 text-center">
// // //                 Click avatar to change
// // //               </div>
// // //             )}
// // //             <div className="mt-3 text-center">
// // //               <h3 className="text-lg font-medium">{user.fullName}</h3>
// // //               <p className="text-gray-500">{user.role}</p>
// // //             </div>
// // //           </div>

// // //           <div className="flex-1 w-full max-w-lg">
// // //             <Tabs activeKey={activeTab} onChange={handleTabChange}>
// // //               <TabPane
// // //                 tab={
// // //                   <span>
// // //                     <UserOutlined className="mr-2" />
// // //                     Personal Info
// // //                   </span>
// // //                 }
// // //                 key="1"
// // //               >
// // //                 <Form
// // //                   form={form}
// // //                   layout="vertical"
// // //                   onFinish={handleProfileUpdate}
// // //                   disabled={!editMode}
// // //                   className="mt-4"
// // //                 >
// // //                   <Form.Item
// // //                     name="name"
// // //                     label="Full Name"
// // //                     rules={[
// // //                       { required: true, message: "Please enter your name" },
// // //                     ]}
// // //                   >
// // //                     <Input placeholder="Enter your full name" />
// // //                   </Form.Item>

// // //                   <Form.Item
// // //                     name="email"
// // //                     label="Email"
// // //                     rules={[
// // //                       { required: true, message: "Please enter your email" },
// // //                       { type: "email", message: "Please enter a valid email" },
// // //                     ]}
// // //                   >
// // //                     <Input placeholder="Enter your email" disabled />
// // //                   </Form.Item>

// // //                   <Form.Item
// // //                     name="contactNumber"
// // //                     label="Contact Number"
// // //                     rules={[
// // //                       {
// // //                         required: true,
// // //                         message: "Please enter your contact number",
// // //                       },
// // //                     ]}
// // //                   >
// // //                     <Input placeholder="Enter your contact number" />
// // //                   </Form.Item>

// // //                   <Form.Item name="address" label="Address">
// // //                     <Input.TextArea placeholder="Enter your address" rows={3} />
// // //                   </Form.Item>

// // //                   {editMode && (
// // //                     <Form.Item>
// // //                       <Button
// // //                         type="primary"
// // //                         htmlType="submit"
// // //                         icon={<SaveOutlined />}
// // //                         className="w-full"
// // //                       >
// // //                         Save Changes
// // //                       </Button>
// // //                     </Form.Item>
// // //                   )}
// // //                 </Form>
// // //               </TabPane>

// // //               <TabPane
// // //                 tab={
// // //                   <span>
// // //                     <LockOutlined className="mr-2" />
// // //                     Security
// // //                   </span>
// // //                 }
// // //                 key="2"
// // //               >
// // //                 <Form
// // //                   form={passwordForm}
// // //                   layout="vertical"
// // //                   onFinish={handlePasswordChange}
// // //                   className="mt-4"
// // //                 >
// // //                   <Form.Item
// // //                     name="currentPassword"
// // //                     label="Current Password"
// // //                     rules={[
// // //                       {
// // //                         required: true,
// // //                         message: "Please enter your current password",
// // //                       },
// // //                     ]}
// // //                   >
// // //                     <Input.Password
// // //                       placeholder="Enter your current password"
// // //                       iconRender={(visible) =>
// // //                         visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
// // //                       }
// // //                     />
// // //                   </Form.Item>

// // //                   <Form.Item
// // //                     name="newPassword"
// // //                     label="New Password"
// // //                     rules={[
// // //                       {
// // //                         required: true,
// // //                         message: "Please enter your new password",
// // //                       },
// // //                       {
// // //                         min: 8,
// // //                         message: "Password must be at least 8 characters",
// // //                       },
// // //                     ]}
// // //                   >
// // //                     <Input.Password
// // //                       placeholder="Enter your new password"
// // //                       iconRender={(visible) =>
// // //                         visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
// // //                       }
// // //                     />
// // //                   </Form.Item>

// // //                   <Form.Item
// // //                     name="confirmPassword"
// // //                     label="Confirm New Password"
// // //                     dependencies={["newPassword"]}
// // //                     rules={[
// // //                       {
// // //                         required: true,
// // //                         message: "Please confirm your new password",
// // //                       },
// // //                       ({ getFieldValue }) => ({
// // //                         validator(_, value) {
// // //                           if (
// // //                             !value ||
// // //                             getFieldValue("newPassword") === value
// // //                           ) {
// // //                             return Promise.resolve();
// // //                           }
// // //                           return Promise.reject(
// // //                             new Error("The two passwords do not match")
// // //                           );
// // //                         },
// // //                       }),
// // //                     ]}
// // //                   >
// // //                     <Input.Password
// // //                       placeholder="Confirm your new password"
// // //                       iconRender={(visible) =>
// // //                         visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
// // //                       }
// // //                     />
// // //                   </Form.Item>

// // //                   <Form.Item>
// // //                     <Button
// // //                       type="primary"
// // //                       htmlType="submit"
// // //                       loading={passwordChanging}
// // //                       className="w-full"
// // //                     >
// // //                       Change Password
// // //                     </Button>
// // //                   </Form.Item>
// // //                 </Form>
// // //               </TabPane>
// // //             </Tabs>
// // //           </div>
// // //         </div>
// // //       </Card>

// // //       {/* Modal for image preview */}
// // //       <Modal
// // //         visible={previewVisible}
// // //         footer={null}
// // //         onCancel={() => setPreviewVisible(false)}
// // //         centered
// // //         width={600}
// // //       >
// // //         <Image
// // //           alt="Profile"
// // //           style={{ width: "100%" }}
// // //           src={
// // //             user.profileImage ||
// // //             "https://via.placeholder.com/400x400?text=No+Image"
// // //           }
// // //         />
// // //       </Modal>
// // //     </div>
// // //   );
// // // };

// // // export default UserProfile;

// // import React, { useState, useEffect } from "react";
// // import {
// //   Card,
// //   Avatar,
// //   Button,
// //   Form,
// //   Input,
// //   message,
// //   Tabs,
// //   Divider,
// //   Modal,
// //   Spin,
// //   Upload,
// //   Image,
// //   Typography,
// // } from "antd";
// // import {
// //   UserOutlined,
// //   EditOutlined,
// //   SaveOutlined,
// //   CloseOutlined,
// //   UploadOutlined,
// //   LockOutlined,
// //   EyeInvisibleOutlined,
// //   EyeTwoTone,
// //   LoadingOutlined,
// //   InfoCircleOutlined,
// // } from "@ant-design/icons";
// // import axios from "axios";

// // const { TabPane } = Tabs;
// // const { Title, Text } = Typography;

// // const UserProfile = () => {
// //   // State variables
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [editMode, setEditMode] = useState(false);
// //   const [passwordChanging, setPasswordChanging] = useState(false);
// //   const [previewVisible, setPreviewVisible] = useState(false);
// //   const [uploadLoading, setUploadLoading] = useState(false);
// //   const [activeTab, setActiveTab] = useState("1");

// //   // Form instances
// //   const [form] = Form.useForm();
// //   const [passwordForm] = Form.useForm();

// //   // Fetch user data on component mount
// //   useEffect(() => {
// //     fetchUserProfile();
// //   }, []);

// //   const fetchUserProfile = async () => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem("token");

// //       if (!token) {
// //         message.error("Please login to view your profile");
// //         return;
// //       }

// //       const response = await axios.get("/api/users/profile", {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       if (response.data.success) {
// //         const userData = response.data.user;
// //         setUser(userData);

// //         // Initialize form with user data
// //         form.setFieldsValue({
// //           name: userData.fullName,
// //           email: userData.email,
// //           address: userData.address || "",
// //           contactNumber: userData.contactNumber || "",
// //         });
// //       } else {
// //         message.error(response.data.message || "Failed to load profile");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching profile:", error);
// //       message.error("Failed to load profile. Please try again later.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleProfileUpdate = async (values) => {
// //     try {
// //       const token = localStorage.getItem("token");

// //       if (!token) {
// //         message.error("Authentication required");
// //         return;
// //       }

// //       const response = await axios.put("/api/users/profile", values, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       if (response.data.success) {
// //         message.success("Profile updated successfully");
// //         setEditMode(false);
// //         fetchUserProfile(); // Refresh data
// //       } else {
// //         message.error(response.data.message || "Failed to update profile");
// //       }
// //     } catch (error) {
// //       console.error("Error updating profile:", error);
// //       message.error(
// //         error.response?.data?.message || "Failed to update profile"
// //       );
// //     }
// //   };

// //   const handlePasswordChange = async (values) => {
// //     try {
// //       setPasswordChanging(true);

// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         message.error("Authentication required");
// //         return;
// //       }

// //       const response = await axios.put(
// //         "/api/users/change-password",
// //         {
// //           currentPassword: values.currentPassword,
// //           newPassword: values.newPassword,
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         message.success("Password changed successfully");
// //         passwordForm.resetFields();
// //       } else {
// //         message.error(response.data.message || "Failed to change password");
// //       }
// //     } catch (error) {
// //       console.error("Error changing password:", error);

// //       if (error.response?.status === 404) {
// //         message.error(
// //           "API endpoint not found. Please check server configuration."
// //         );
// //       } else if (error.response?.status === 401) {
// //         message.error("Authentication error. Please login again.");
// //       } else if (error.response?.data?.message) {
// //         message.error(error.response.data.message);
// //       } else {
// //         message.error("Failed to change password. Please try again later.");
// //       }
// //     } finally {
// //       setPasswordChanging(false);
// //     }
// //   };

// //   const handleAvatarClick = () => {
// //     if (editMode) {
// //       // In edit mode, avatar click triggers file upload
// //       document.getElementById("avatar-upload").click();
// //     } else {
// //       // In view mode, avatar click shows preview
// //       setPreviewVisible(true);
// //     }
// //   };

// //   const handleAvatarChange = async (info) => {
// //     if (info.file.status === "uploading") {
// //       setUploadLoading(true);
// //       return;
// //     }

// //     if (info.file.status === "done") {
// //       setUploadLoading(false);
// //       message.success("Profile image updated successfully");

// //       // Update user state with new image URL
// //       setUser({
// //         ...user,
// //         profileImage: info.file.response.imageUrl,
// //       });
// //     } else if (info.file.status === "error") {
// //       setUploadLoading(false);
// //       message.error("Error uploading image");
// //     }
// //   };

// //   const customUploadRequest = async ({ file, onSuccess, onError }) => {
// //     const formData = new FormData();
// //     formData.append("profileImage", file);

// //     try {
// //       const token = localStorage.getItem("token");

// //       const response = await axios.post("/api/users/profile-image", formData, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "multipart/form-data",
// //         },
// //       });

// //       if (response.data.success) {
// //         onSuccess(response.data, file);
// //       } else {
// //         onError(new Error(response.data.message || "Upload failed"));
// //       }
// //     } catch (error) {
// //       console.error("Error uploading image:", error);
// //       onError(error);
// //     }
// //   };

// //   const handleTabChange = (key) => {
// //     setActiveTab(key);
// //   };

// //   const toggleEditMode = () => {
// //     if (editMode) {
// //       // If exiting edit mode, reset form to original values
// //       form.setFieldsValue({
// //         name: user.fullName,
// //         email: user.email,
// //         address: user.address || "",
// //         contactNumber: user.contactNumber || "",
// //       });
// //     }
// //     setEditMode(!editMode);
// //   };

// //   // If still loading
// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center min-h-screen">
// //         <Spin size="large" />
// //       </div>
// //     );
// //   }

// //   // If user data failed to load
// //   if (!user) {
// //     return (
// //       <div className="flex flex-col items-center justify-center min-h-screen p-4">
// //         <div className="text-red-500 text-xl mb-4">
// //           Failed to load user profile
// //         </div>
// //         <Button type="primary" onClick={fetchUserProfile}>
// //           Retry
// //         </Button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="w-full max-w-5xl mx-auto p-4">
// //       <Card
// //         className="shadow-md"
// //         title={
// //           <div className="flex justify-between items-center">
// //             <Title level={4} className="m-0">
// //               User Profile
// //             </Title>
// //             <Button
// //               type={editMode ? "default" : "primary"}
// //               icon={editMode ? <CloseOutlined /> : <EditOutlined />}
// //               onClick={toggleEditMode}
// //             >
// //               {editMode ? "Cancel" : "Edit Profile"}
// //             </Button>
// //           </div>
// //         }
// //       >
// //         <div className="flex flex-col lg:flex-row">
// //           {/* Left column - Avatar and basic info */}
// //           <div className="w-full lg:w-1/4 flex flex-col items-center mb-6 lg:mb-0 lg:pr-8 border-b lg:border-b-0 lg:border-r border-gray-200 pb-6 lg:pb-0">
// //             <div
// //               className={`relative cursor-pointer ${editMode ? "group" : ""}`}
// //               onClick={handleAvatarClick}
// //             >
// //               {uploadLoading ? (
// //                 <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-full">
// //                   <LoadingOutlined style={{ fontSize: 24 }} />
// //                 </div>
// //               ) : (
// //                 <Avatar
// //                   size={128}
// //                   icon={<UserOutlined />}
// //                   src={user.profileImage}
// //                   className={`${
// //                     editMode ? "hover:opacity-80" : ""
// //                   } transition-opacity duration-300`}
// //                 />
// //               )}

// //               {editMode && (
// //                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300">
// //                   <UploadOutlined className="text-white text-2xl" />
// //                 </div>
// //               )}
// //             </div>

// //             <Upload
// //               name="profileImage"
// //               showUploadList={false}
// //               customRequest={customUploadRequest}
// //               onChange={handleAvatarChange}
// //               accept="image/*"
// //               className="hidden"
// //             >
// //               <input id="avatar-upload" type="file" className="hidden" />
// //             </Upload>

// //             {editMode && (
// //               <Text type="secondary" className="mt-2 text-center text-xs">
// //                 Click avatar to change photo
// //               </Text>
// //             )}

// //             <div className="mt-4 text-center">
// //               <Title level={4} className="m-0">
// //                 {user.fullName}
// //               </Title>
// //               <Text type="secondary" className="capitalize">
// //                 {user.role}
// //               </Text>
// //             </div>

// //             <Divider className="lg:hidden" />
// //           </div>

// //           {/* Right column - Tabs for profile info and password change */}
// //           <div className="w-full lg:w-3/4 lg:pl-8">
// //             <Tabs activeKey={activeTab} onChange={handleTabChange}>
// //               <TabPane
// //                 tab={
// //                   <span>
// //                     <UserOutlined className="mr-1" />
// //                     Personal Info
// //                   </span>
// //                 }
// //                 key="1"
// //               >
// //                 <Form
// //                   form={form}
// //                   layout="vertical"
// //                   onFinish={handleProfileUpdate}
// //                   disabled={!editMode}
// //                 >
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     <Form.Item
// //                       name="name"
// //                       label="Full Name"
// //                       rules={[
// //                         { required: true, message: "Please enter your name" },
// //                       ]}
// //                     >
// //                       <Input
// //                         placeholder="Enter your full name"
// //                         disabled={!editMode}
// //                       />
// //                     </Form.Item>

// //                     <Form.Item
// //                       name="email"
// //                       label="Email"
// //                       rules={[
// //                         { required: true, message: "Please enter your email" },
// //                         {
// //                           type: "email",
// //                           message: "Please enter a valid email",
// //                         },
// //                       ]}
// //                       tooltip={editMode ? "Email cannot be changed" : null}
// //                     >
// //                       <Input
// //                         placeholder="Enter your email"
// //                         disabled
// //                         addonAfter={editMode ? <InfoCircleOutlined /> : null}
// //                       />
// //                     </Form.Item>

// //                     <Form.Item
// //                       name="contactNumber"
// //                       label="Contact Number"
// //                       rules={[
// //                         {
// //                           required: true,
// //                           message: "Please enter your contact number",
// //                         },
// //                       ]}
// //                     >
// //                       <Input
// //                         placeholder="Enter your contact number"
// //                         disabled={!editMode}
// //                       />
// //                     </Form.Item>

// //                     <Form.Item
// //                       name="address"
// //                       label="Address"
// //                       className="md:col-span-2"
// //                     >
// //                       <Input.TextArea
// //                         placeholder="Enter your address"
// //                         rows={3}
// //                         disabled={!editMode}
// //                       />
// //                     </Form.Item>
// //                   </div>

// //                   {editMode && (
// //                     <Form.Item className="mb-0 mt-4">
// //                       <Button
// //                         type="primary"
// //                         htmlType="submit"
// //                         icon={<SaveOutlined />}
// //                         block
// //                       >
// //                         Save Changes
// //                       </Button>
// //                     </Form.Item>
// //                   )}
// //                 </Form>
// //               </TabPane>

// //               <TabPane
// //                 tab={
// //                   <span>
// //                     <LockOutlined className="mr-1" />
// //                     Change Password
// //                   </span>
// //                 }
// //                 key="2"
// //               >
// //                 <Form
// //                   form={passwordForm}
// //                   layout="vertical"
// //                   onFinish={handlePasswordChange}
// //                 >
// //                   <Form.Item
// //                     name="currentPassword"
// //                     label="Current Password"
// //                     rules={[
// //                       {
// //                         required: true,
// //                         message: "Please enter your current password",
// //                       },
// //                     ]}
// //                   >
// //                     <Input.Password
// //                       placeholder="Enter your current password"
// //                       iconRender={(visible) =>
// //                         visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
// //                       }
// //                     />
// //                   </Form.Item>

// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     <Form.Item
// //                       name="newPassword"
// //                       label="New Password"
// //                       rules={[
// //                         {
// //                           required: true,
// //                           message: "Please enter your new password",
// //                         },
// //                         {
// //                           min: 8,
// //                           message: "Password must be at least 8 characters",
// //                         },
// //                       ]}
// //                     >
// //                       <Input.Password
// //                         placeholder="Enter your new password"
// //                         iconRender={(visible) =>
// //                           visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
// //                         }
// //                       />
// //                     </Form.Item>

// //                     <Form.Item
// //                       name="confirmPassword"
// //                       label="Confirm New Password"
// //                       dependencies={["newPassword"]}
// //                       rules={[
// //                         {
// //                           required: true,
// //                           message: "Please confirm your new password",
// //                         },
// //                         ({ getFieldValue }) => ({
// //                           validator(_, value) {
// //                             if (
// //                               !value ||
// //                               getFieldValue("newPassword") === value
// //                             ) {
// //                               return Promise.resolve();
// //                             }
// //                             return Promise.reject(
// //                               new Error("The passwords do not match")
// //                             );
// //                           },
// //                         }),
// //                       ]}
// //                     >
// //                       <Input.Password
// //                         placeholder="Confirm your new password"
// //                         iconRender={(visible) =>
// //                           visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
// //                         }
// //                       />
// //                     </Form.Item>
// //                   </div>

// //                   <Form.Item className="mb-0 mt-4">
// //                     <Button
// //                       type="primary"
// //                       htmlType="submit"
// //                       loading={passwordChanging}
// //                       icon={<LockOutlined />}
// //                       block
// //                     >
// //                       Change Password
// //                     </Button>
// //                   </Form.Item>
// //                 </Form>
// //               </TabPane>
// //             </Tabs>
// //           </div>
// //         </div>
// //       </Card>

// //       {/* Modal for image preview */}
// //       <Modal
// //         visible={previewVisible}
// //         footer={null}
// //         onCancel={() => setPreviewVisible(false)}
// //         centered
// //         width={500}
// //         bodyStyle={{ padding: 0 }}
// //       >
// //         <Image
// //           alt="Profile"
// //           width="100%"
// //           src={
// //             user.profileImage ||
// //             "https://via.placeholder.com/400x400?text=No+Image"
// //           }
// //           fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
// //         />
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default UserProfile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Avatar,
  Form,
  Input,
  message,
  Divider,
  Spin,
  Upload,
  Modal,
  Image,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  LockOutlined,
  UploadOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Fetch user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication required. Please log in.");
        // In a real app, you would redirect to login here
        return;
      }

      const response = await axios.get("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUserDetails(response.data.user);
        setImageUrl(response.data.user.profileImage || null);

        // For customers, name is a single field
        // For staff, manager, and supplier, name is fullName (concatenation of F_name and L_name)
        form.setFieldsValue({
          name: response.data.user.fullName || response.data.user.name,
          userId: response.data.user.id,
          address: response.data.user.address,
          contact: response.data.user.contactNumber,
          email: response.data.user.email,
        });
      } else {
        message.error(response.data.message || "Failed to load user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      message.error("Error loading user profile");

      // For demo/development purposes, set mock data if API fails
      const mockUser = {
        id: "456567",
        fullName: "Muthuka Lakshan",
        address: "no:03, bchabchabchjac",
        contactNumber: "071 456 4563",
        email: "lakshan@gmail.com",
        profileImage: null,
      };

      setUserDetails(mockUser);
      form.setFieldsValue({
        name: mockUser.fullName,
        userId: mockUser.id,
        address: mockUser.address,
        contact: mockUser.contactNumber,
        email: mockUser.email,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      // If we're in edit mode and clicking save, submit the form
      form.submit();
    } else {
      // Otherwise, just toggle edit mode
      setEditMode(true);
    }
  };

  const handleUpdateDetails = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication required. Please log in.");
        return;
      }

      const updatedDetails = {
        name: values.name,
        address: values.address,
        contactNumber: values.contact,
        email: values.email,
      };

      const response = await axios.put("/api/users/profile", updatedDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        message.success("Profile updated successfully");
        setUserDetails({
          ...userDetails,
          fullName: values.name, // Update fullName for display
          address: values.address,
          contactNumber: values.contact,
          email: values.email,
        });
        setEditMode(false);
      } else {
        message.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      // Check for email already exists error
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message ===
          "Email already in use by another account"
      ) {
        message.error(
          "This email is already registered with another account. Please use a different email."
        );
        // Focus on the email field
        form.getFieldInstance("email").focus();
      } else {
        message.error("Error updating profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication required. Please log in.");
        return;
      }

      if (values.newPassword !== values.confirmPassword) {
        message.error("New passwords do not match");
        return;
      }

      const passwordData = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      const response = await axios.put("/api/users/password", passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        message.success("Password changed successfully");
        setPasswordModalVisible(false);
        passwordForm.resetFields();
      } else {
        message.error(response.data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);

      // Check for incorrect current password error
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "Current password is incorrect"
      ) {
        message.error("Current password is incorrect. Please try again.");
        // Focus on the current password field
        passwordForm.getFieldInstance("currentPassword").focus();
      } else {
        message.error("Error changing password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = async (options) => {
    const { file, onSuccess, onError } = options;

    setUploadLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication required. Please log in.");
        onError();
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await axios.post("/api/users/profile-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setImageUrl(response.data.imageUrl);
        message.success("Profile image updated successfully");
        onSuccess();
      } else {
        message.error(response.data.message || "Failed to upload image");
        onError();
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      message.error("Error uploading image. Please try again.");
      onError();

      // For demo/development, set a local URL to see the changes
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImageUrl(reader.result);
          message.success("Profile image updated successfully (Demo mode)");
        };
        reader.readAsDataURL(file);
      }
    } finally {
      setUploadLoading(false);
      setUploadModalVisible(false);
    }
  };

  const handleAvatarClick = () => {
    if (editMode) {
      // In edit mode, clicking the avatar opens the upload modal
      setUploadModalVisible(true);
    } else if (imageUrl) {
      // Not in edit mode and image exists, show image preview
      setImagePreviewVisible(true);
    }
  };

  if (loading && !userDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const uploadButton = (
    <div className="flex flex-col items-center">
      <UploadOutlined className="text-2xl" />
      <div className="mt-2">Upload</div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <Card className="shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
            User Profile
          </h1>
          <div className="flex space-x-3 md:space-x-4">
            <Button
              type="primary"
              onClick={handleEditToggle}
              icon={editMode ? <SaveOutlined /> : <EditOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editMode ? "Save" : "Edit Profile"}
            </Button>
            {!editMode && (
              <Button
                type="default"
                onClick={() => setPasswordModalVisible(true)}
                icon={<LockOutlined />}
              >
                Change Password
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
            <div
              className={`w-36 h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 border-2 border-gray-200 rounded-full flex items-center justify-center overflow-hidden ${
                editMode ? "cursor-pointer" : imageUrl ? "cursor-pointer" : ""
              }`}
              onClick={handleAvatarClick}
              title={
                editMode ? "Upload new image" : imageUrl ? "View image" : ""
              }
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Avatar
                  icon={<UserOutlined />}
                  className="w-full h-full text-5xl flex items-center justify-center bg-gray-200 text-gray-500"
                />
              )}
            </div>
            {editMode && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Click avatar to change profile picture
              </p>
            )}
          </div>

          {/* User Details Form */}
          <div className="flex-1 w-full">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateDetails}
              initialValues={{
                name: userDetails?.fullName || userDetails?.name || "",
                userId: userDetails?.id || "",
                address: userDetails?.address || "",
                contact: userDetails?.contactNumber || "",
                email: userDetails?.email || "",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                  className="col-span-1"
                >
                  {editMode ? (
                    <Input
                      prefix={<UserOutlined className="text-gray-400" />}
                    />
                  ) : (
                    <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                      <UserOutlined className="text-gray-400 mr-2" />
                      {userDetails?.fullName || userDetails?.name}
                    </div>
                  )}
                </Form.Item>

                <Form.Item name="userId" label="User ID" className="col-span-1">
                  <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                    <IdcardOutlined className="text-gray-400 mr-2" />
                    {userDetails?.id}
                  </div>
                </Form.Item>
              </div>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
                help={
                  editMode
                    ? "Changing your email requires it to be unique across all users."
                    : ""
                }
              >
                {editMode ? (
                  <Input prefix={<MailOutlined className="text-gray-400" />} />
                ) : (
                  <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                    <MailOutlined className="text-gray-400 mr-2" />
                    {userDetails?.email}
                  </div>
                )}
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="contact"
                  label="Contact Number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your contact number",
                    },
                  ]}
                  className="col-span-1"
                >
                  {editMode ? (
                    <Input
                      prefix={<PhoneOutlined className="text-gray-400" />}
                    />
                  ) : (
                    <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                      <PhoneOutlined className="text-gray-400 mr-2" />
                      {userDetails?.contactNumber}
                    </div>
                  )}
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    { required: true, message: "Please enter your address" },
                  ]}
                  className="col-span-1"
                >
                  {editMode ? (
                    <Input
                      prefix={<HomeOutlined className="text-gray-400" />}
                    />
                  ) : (
                    <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                      <HomeOutlined className="text-gray-400 mr-2" />
                      {userDetails?.address}
                    </div>
                  )}
                </Form.Item>
              </div>

              {editMode && (
                <Form.Item>
                  <div className="flex justify-end space-x-4 mt-4">
                    <Button onClick={() => setEditMode(false)}>Cancel</Button>
                    {/* <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save Changes
                    </Button> */}
                  </div>
                </Form.Item>
              )}
            </Form>
          </div>
        </div>
      </Card>

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <div className="flex justify-end space-x-4">
            <Button onClick={() => setPasswordModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Change Password
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Upload Profile Image Modal - Only visible in edit mode */}
      <Modal
        title="Upload Profile Picture"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
      >
        <div className="text-center">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={handleProfileImageUpload}
            beforeUpload={(file) => {
              const isJpgOrPng =
                file.type === "image/jpeg" || file.type === "image/png";
              if (!isJpgOrPng) {
                message.error("You can only upload JPG/PNG file!");
              }
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error("Image must be smaller than 2MB!");
              }
              return isJpgOrPng && isLt2M;
            }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="Avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
          <Divider />
          <p className="text-gray-500 mb-4">
            Upload a new profile picture. JPG or PNG format, max 2MB.
          </p>
          <div className="flex justify-end space-x-4">
            <Button onClick={() => setUploadModalVisible(false)}>Cancel</Button>
            <Button
              type="primary"
              loading={uploadLoading}
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setUploadModalVisible(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Image Preview Modal - Only visible when not in edit mode */}
      <Modal
        visible={imagePreviewVisible}
        footer={null}
        onCancel={() => setImagePreviewVisible(false)}
        centered
        width="auto"
        bodyStyle={{ padding: 0, maxWidth: "90vw", overflow: "hidden" }}
      >
        <div className="p-0">
          <Image
            src={imageUrl}
            alt="Profile"
            style={{ maxWidth: "100%", display: "block" }}
            preview={false}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;
