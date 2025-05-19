// import React, { useState } from "react";
// import { Modal, Form, Input, Button, Avatar, InputNumber, message } from "antd";
// import { UserOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const { Item } = Form;

// const StaffAddEditModal = ({
//   visible,
//   isEditMode,
//   staffMember,
//   onCancel,
//   onSubmitSuccess,
//   setImageFile,
//   setImageUrl,
//   imageUrl,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     if (visible && isEditMode && staffMember) {
//       form.setFieldsValue({
//         name: staffMember.name,
//         email: staffMember.email,
//         address: staffMember.address || "",
//         contactNumber: staffMember.contactNumber,
//         salary: staffMember.salary,
//       });
//     } else if (visible) {
//       form.resetFields();
//     }
//   }, [visible, isEditMode, staffMember, form]);

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
//       Object.entries(values).forEach(([key, value]) => {
//         if (key !== "image") {
//           formData.append(key, value);
//         }
//       });
//       if (imageFile) formData.append("image", imageFile);

//       if (isEditMode) {
//         await axios.put(
//           `/api/staff/${staffMember.pharmacy_staff_id}`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         message.success("Staff member updated successfully!");
//       } else {
//         await axios.post("/api/staff", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         message.success("Staff member added successfully!");
//       }

//       onSubmitSuccess();
//     } catch (err) {
//       console.error("Error saving staff member:", err);
//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//       message.error(
//         err.response?.data?.message ||
//           "Failed to save staff member. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       title={isEditMode ? "Edit Staff Member" : "New Staff Member"}
//       open={visible}
//       onCancel={onCancel}
//       footer={null}
//       width={500}
//     >
//       <Form form={form} layout="vertical" onFinish={handleSubmit}>
//         <div className="flex justify-center mb-4">
//           <div className="relative">
//             <Avatar
//               size={100}
//               icon={<UserOutlined />}
//               src={imageUrl}
//               className="border border-dashed border-gray-300 cursor-pointer"
//             />
//             <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//               <label className="text-xs text-blue-500 cursor-pointer">
//                 Browse image
//                 <input
//                   type="file"
//                   hidden
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                 />
//               </label>
//             </div>
//           </div>
//         </div>

//         <Item
//           name="name"
//           label="Name"
//           rules={[{ required: true, message: "Please enter name" }]}
//         >
//           <Input placeholder="Enter name" />
//         </Item>

//         <Item
//           name="email"
//           label="Email"
//           rules={[
//             { required: true, message: "Please enter email" },
//             { type: "email", message: "Please enter a valid email" },
//           ]}
//         >
//           <Input placeholder="Enter email" />
//         </Item>

//         <Item
//           name="address"
//           label="Address"
//           rules={[{ required: true, message: "Please enter address" }]}
//         >
//           <Input placeholder="Enter address" />
//         </Item>

//         <Item
//           name="contactNumber"
//           label="Contact Number"
//           rules={[
//             { required: true, message: "Please enter contact number" },
//             { pattern: /^[0-9]{10}$/, message: "Must be exactly 10 digits" },
//           ]}
//         >
//           <Input
//             placeholder="Enter 10-digit number"
//             maxLength={10}
//             onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
//           />
//         </Item>

//         <Item
//           name="salary"
//           label="Salary"
//           rules={[
//             { required: true, message: "Please enter salary" },
//             { type: "number", message: "Must be a valid number" },
//             {
//               validator: (_, value) =>
//                 value > 0
//                   ? Promise.resolve()
//                   : Promise.reject("Salary must be positive"),
//             },
//           ]}
//         >
//           <InputNumber
//             prefix="Rs."
//             style={{ width: "100%" }}
//             min={0}
//             formatter={(value) =>
//               `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//             }
//             parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//             onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
//           />
//         </Item>

//         <div className="flex justify-end space-x-2 mt-4">
//           <Button onClick={onCancel}>Cancel</Button>
//           <Button
//             type="primary"
//             htmlType="submit"
//             loading={loading}
//             className="bg-blue-500 hover:bg-blue-600"
//           >
//             {isEditMode ? "Update Staff Member" : "Add Staff Member"}
//           </Button>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default StaffAddEditModal;

import React, { useState } from "react";
import { Modal, Form, Input, Button, Avatar, InputNumber, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Item } = Form;

const StaffAddEditModal = ({
  visible,
  isEditMode,
  staffMember,
  onCancel,
  onSubmitSuccess,
  setImageFile,
  setImageUrl,
  imageUrl,
  imageFile, // Add this prop to receive the imageFile state
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (visible && isEditMode && staffMember) {
      form.setFieldsValue({
        name: staffMember.name || `${staffMember.F_name} ${staffMember.L_name}`,
        email: staffMember.email,
        address: staffMember.address || "",
        contactNumber: staffMember.contactNumber,
        salary: staffMember.salary,
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, isEditMode, staffMember, form]);

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
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "image") {
          formData.append(key, value);
        }
      });

      // Only append image if imageFile exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEditMode) {
        await axios.put(
          `/api/staff/${staffMember.pharmacy_staff_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        message.success("Staff member updated successfully!");
      } else {
        await axios.post("/api/staff", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("Staff member added successfully!");
      }

      onSubmitSuccess();
    } catch (err) {
      console.error("Error saving staff member:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
      message.error(
        err.response?.data?.message ||
          "Failed to save staff member. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEditMode ? "Edit Staff Member" : "New Staff Member"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Avatar
              size={100}
              icon={<UserOutlined />}
              src={imageUrl}
              className="border border-dashed border-gray-300 cursor-pointer"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <label className="text-xs text-blue-500 cursor-pointer">
                Browse image
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

        <Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Enter name" />
        </Item>

        <Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Item>

        <Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input placeholder="Enter address" />
        </Item>

        <Item
          name="contactNumber"
          label="Contact Number"
          rules={[
            { required: true, message: "Please enter contact number" },
            { pattern: /^[0-9]{10}$/, message: "Must be exactly 10 digits" },
          ]}
        >
          <Input
            placeholder="Enter 10-digit number"
            maxLength={10}
            onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
          />
        </Item>

        <Item
          name="salary"
          label="Salary"
          rules={[
            { required: true, message: "Please enter salary" },
            { type: "number", message: "Must be a valid number" },
            {
              validator: (_, value) =>
                value > 0
                  ? Promise.resolve()
                  : Promise.reject("Salary must be positive"),
            },
          ]}
        >
          <InputNumber
            prefix="Rs."
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
          />
        </Item>

        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isEditMode ? "Update Staff Member" : "Add Staff Member"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default StaffAddEditModal;
