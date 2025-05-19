// // import React, { useEffect } from "react";
// // import {
// //   Modal,
// //   Form,
// //   Input,
// //   Button,
// //   Select,
// //   InputNumber,
// //   Upload,
// //   message,
// // } from "antd";
// // import { PlusOutlined } from "@ant-design/icons";

// // const { Option } = Select;

// // const AddEditProduct = ({
// //   visible,
// //   onCancel,
// //   onSubmit,
// //   categories,
// //   initialValues = null,
// //   isEdit = false,
// // }) => {
// //   const [form] = Form.useForm();
// //   const [imageUrl, setImageUrl] = React.useState(null);

// //   // Reset form when modal opens or initialValues changes
// //   useEffect(() => {
// //     if (visible) {
// //       form.resetFields();
// //       setImageUrl(initialValues?.image || null);

// //       if (isEdit && initialValues) {
// //         // Parse price from "Rs.X" format to numeric value
// //         const priceValue = initialValues.price
// //           ? parseFloat(initialValues.price.replace("Rs.", ""))
// //           : 0;

// //         form.setFieldsValue({
// //           name: initialValues.name,
// //           category: initialValues.category,
// //           price: priceValue,
// //           type: initialValues.type,
// //           threshold: initialValues.threshold,
// //           supplier:
// //             initialValues.supplier !== "Not specified"
// //               ? initialValues.supplier
// //               : "",
// //           contactNumber:
// //             initialValues.contactNumber !== "Not specified"
// //               ? initialValues.contactNumber
// //               : "",
// //         });
// //       }
// //     }
// //   }, [visible, initialValues, form, isEdit]);

// //   const handleImageUpload = (info) => {
// //     if (info.file.status === "done") {
// //       setImageUrl(info.file.originFileObj);
// //       message.success(`${info.file.name} uploaded successfully`);
// //     } else if (info.file.status === "error") {
// //       message.error(`${info.file.name} upload failed.`);
// //     }
// //   };

// //   const handleSubmit = () => {
// //     form
// //       .validateFields()
// //       .then((values) => {
// //         // Add image to values if available
// //         const submitValues = { ...values, image: imageUrl };
// //         onSubmit(submitValues);
// //         form.resetFields();
// //         setImageUrl(null);
// //       })
// //       .catch((info) => {
// //         console.log("Validate Failed:", info);
// //       });
// //   };

// //   return (
// //     <Modal
// //       title={isEdit ? "Edit Product" : "Add New Product"}
// //       open={visible}
// //       onCancel={onCancel}
// //       footer={[
// //         <Button key="cancel" onClick={onCancel}>
// //           Cancel
// //         </Button>,
// //         <Button key="submit" type="primary" onClick={handleSubmit}>
// //           {isEdit ? "Update" : "Add"} Product
// //         </Button>,
// //       ]}
// //       width={600}
// //     >
// //       <Form form={form} layout="vertical">
// //         <div style={{ textAlign: "center", marginBottom: 16 }}>
// //           <Upload
// //             name="avatar"
// //             listType="picture-card"
// //             className="avatar-uploader"
// //             showUploadList={false}
// //             action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
// //             onChange={handleImageUpload}
// //             beforeUpload={(file) => {
// //               const isImage = file.type.startsWith("image/");
// //               if (!isImage) {
// //                 message.error("You can only upload image files!");
// //               }
// //               return isImage;
// //             }}
// //           >
// //             {imageUrl ? (
// //               <img
// //                 src={
// //                   typeof imageUrl === "string"
// //                     ? imageUrl
// //                     : URL.createObjectURL(imageUrl)
// //                 }
// //                 alt="Product"
// //                 style={{ width: "100%" }}
// //               />
// //             ) : (
// //               <div>
// //                 <PlusOutlined />
// //                 <div style={{ marginTop: 8 }}>Upload</div>
// //               </div>
// //             )}
// //           </Upload>
// //         </div>

// //         <Form.Item
// //           name="name"
// //           label="Product Name"
// //           rules={[
// //             { required: true, message: "Please enter product name" },
// //             { min: 2, message: "Product name must be at least 2 characters" },
// //             { max: 100, message: "Product name cannot exceed 100 characters" },
// //           ]}
// //         >
// //           <Input placeholder="Enter product name" />
// //         </Form.Item>

// //         <Form.Item
// //           name="category"
// //           label="Category"
// //           rules={[{ required: true, message: "Please select a category" }]}
// //         >
// //           <Select
// //             placeholder="Select product category"
// //             showSearch
// //             filterOption={(input, option) =>
// //               option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
// //             }
// //           >
// //             {categories.map((category) => (
// //               <Option key={category.id} value={category.name}>
// //                 {category.name}
// //               </Option>
// //             ))}
// //           </Select>
// //         </Form.Item>

// //         <Form.Item
// //           name="price"
// //           label="Price"
// //           rules={[
// //             { required: true, message: "Please enter price" },
// //             {
// //               type: "number",
// //               min: 0.01,
// //               message: "Price must be greater than 0",
// //             },
// //           ]}
// //         >
// //           <InputNumber
// //             addonBefore="Rs."
// //             style={{ width: "100%" }}
// //             min={0.01}
// //             step={0.01}
// //             precision={2}
// //           />
// //         </Form.Item>

// //         <Form.Item
// //           name="type"
// //           label="Type"
// //           rules={[{ required: true, message: "Please select product type" }]}
// //         >
// //           <Select placeholder="Select product type">
// //             <Option value="Prescription Required">Prescription Required</Option>
// //             <Option value="No Prescription">No Prescription</Option>
// //           </Select>
// //         </Form.Item>

// //         <Form.Item
// //           name="threshold"
// //           label="Stock Threshold"
// //           help="Minimum stock level before warning"
// //           rules={[
// //             { required: true, message: "Please enter threshold" },
// //             () => ({
// //               validator(_, value) {
// //                 if (value <= 0) {
// //                   return Promise.reject("Threshold must be at least 1");
// //                 }
// //                 return Promise.resolve();
// //               },
// //             }),
// //           ]}
// //         >
// //           <InputNumber
// //             placeholder="Threshold quantity"
// //             style={{ width: "100%" }}
// //             min={1}
// //             precision={0}
// //           />
// //         </Form.Item>

// //         <Form.Item name="supplier" label="Supplier">
// //           <Input placeholder="Enter supplier name" />
// //         </Form.Item>

// //         <Form.Item name="contactNumber" label="Contact Number">
// //           <Input placeholder="Enter contact number" />
// //         </Form.Item>
// //       </Form>
// //     </Modal>
// //   );
// // };

// // export default AddEditProduct;

import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddEditProduct = ({
  visible,
  onCancel,
  onSubmit,
  categories,
  initialValues = null,
  isEdit = false,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = React.useState(null);

  // Reset form when modal opens or initialValues changes
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setImageUrl(initialValues?.image || null);

      if (isEdit && initialValues) {
        // Parse price from "Rs.X" format to numeric value
        const priceValue = initialValues.price
          ? parseFloat(initialValues.price.replace("Rs.", ""))
          : 0;

        form.setFieldsValue({
          name: initialValues.name,
          category: initialValues.category,
          price: priceValue,
          type: initialValues.type,
          threshold: initialValues.threshold,
        });
      }
    }
  }, [visible, initialValues, form, isEdit]);

  const handleImageUpload = async (info) => {
    try {
      if (info.file.status === "done") {
        // For direct Cloudinary uploads from frontend
        setImageUrl(info.file.response?.secure_url || info.file.originFileObj);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} upload failed.`);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      message.error("Image upload failed");
    }
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // If new image was uploaded (File object), we'll handle it in the API
      const submitValues = {
        ...values,
        image: typeof imageUrl === "string" ? imageUrl : undefined,
        imageFile: typeof imageUrl !== "string" ? imageUrl : undefined,
      };

      onSubmit(submitValues);
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Product" : "Add New Product"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isEdit ? "Update" : "Add"} Product
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            onChange={handleImageUpload}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("You can only upload image files!");
              }
              return isImage;
            }}
          >
            {imageUrl ? (
              <img
                src={
                  typeof imageUrl === "string"
                    ? imageUrl
                    : URL.createObjectURL(imageUrl)
                }
                alt="Product"
                style={{ width: "100%" }}
              />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </div>

        <Form.Item
          name="name"
          label="Product Name"
          rules={[
            { required: true, message: "Please enter product name" },
            { min: 2, message: "Product name must be at least 2 characters" },
            { max: 100, message: "Product name cannot exceed 100 characters" },
          ]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            placeholder="Select product category"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {/* {categories.map((category) => (
              <Option key={category.id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Select> */}
            {Array.isArray(categories) &&
              categories.map((category) => (
                <Option key={category.id} value={category.name}>
                  {category.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[
            { required: true, message: "Please enter price" },
            {
              type: "number",
              min: 0.01,
              message: "Price must be greater than 0",
            },
          ]}
        >
          <InputNumber
            addonBefore="Rs."
            style={{ width: "100%" }}
            min={0.01}
            step={0.01}
            precision={2}
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Please select product type" }]}
        >
          <Select placeholder="Select product type">
            <Option value="Prescription Required">Prescription Required</Option>
            <Option value="No Prescription">No Prescription</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="threshold"
          label="Stock Threshold"
          help="Minimum stock level before warning"
          rules={[
            { required: true, message: "Please enter threshold" },
            () => ({
              validator(_, value) {
                if (value <= 0) {
                  return Promise.reject("Threshold must be at least 1");
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber
            placeholder="Threshold quantity"
            style={{ width: "100%" }}
            min={1}
            precision={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditProduct;
