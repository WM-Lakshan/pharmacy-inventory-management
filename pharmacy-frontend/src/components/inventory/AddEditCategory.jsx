// import React, { useEffect } from "react";
// import { Modal, Form, Input, Button } from "antd";

// const AddEditCategory = ({
//   visible,
//   onCancel,
//   onSubmit,
//   category,
//   loading,
// }) => {
//   const [form] = Form.useForm();
//   const isEdit = !!category;

//   // Reset form when modal opens or category changes
//   useEffect(() => {
//     if (visible) {
//       form.resetFields();

//       if (category) {
//         form.setFieldsValue({
//           name: category.name,
//           description: category.description,
//         });
//       }
//     }
//   }, [visible, category, form]);

//   const handleSubmit = () => {
//     form
//       .validateFields()
//       .then((values) => {
//         onSubmit(values);
//         form.resetFields();
//       })
//       .catch((info) => {
//         console.log("Validate Failed:", info);
//       });
//   };

//   return (
//     <Modal
//       title={isEdit ? "Edit Category" : "Add New Category"}
//       open={visible}
//       onCancel={onCancel}
//       footer={[
//         <Button key="cancel" onClick={onCancel}>
//           Cancel
//         </Button>,
//         <Button
//           key="submit"
//           type="primary"
//           loading={loading}
//           onClick={handleSubmit}
//         >
//           {isEdit ? "Update" : "Add"}
//         </Button>,
//       ]}
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item
//           name="name"
//           label="Category Name"
//           rules={[
//             { required: true, message: "Please enter category name" },
//             { min: 2, message: "Category name must be at least 2 characters" },
//             { max: 50, message: "Category name cannot exceed 50 characters" },
//           ]}
//         >
//           <Input placeholder="Enter category name" />
//         </Form.Item>

//         <Form.Item
//           name="description"
//           label="Description"
//           rules={[
//             { max: 200, message: "Description cannot exceed 200 characters" },
//           ]}
//         >
//           <Input.TextArea placeholder="Enter category description" rows={3} />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default AddEditCategory;

import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import api from "../../services/api";

const AddEditCategory = ({
  visible,
  onCancel,
  onSubmit,
  category,
  loading,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!category;

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (category) {
        form.setFieldsValue({
          name: category.name,
          description: category.description,
        });
      }
    }
  }, [visible, category, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Category" : "Add New Category"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {isEdit ? "Update" : "Add"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Category Name"
          rules={[
            { required: true, message: "Please enter category name" },
            { min: 2, message: "Category name must be at least 2 characters" },
            { max: 50, message: "Category name cannot exceed 50 characters" },
          ]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { max: 200, message: "Description cannot exceed 200 characters" },
          ]}
        >
          <Input.TextArea placeholder="Enter category description" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditCategory;
