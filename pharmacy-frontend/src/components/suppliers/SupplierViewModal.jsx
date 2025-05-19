// // import React from "react";
// // import { Modal, Button, Tag, Avatar } from "antd";
// // import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

// // const SupplierViewModal = ({
// //   visible,
// //   supplier,
// //   onClose,
// //   onEdit,
// //   onDelete,
// // }) => {
// //   if (!supplier) return null;

// //   return (
// //     <Modal
// //       title="Supplier Overview"
// //       open={visible}
// //       onCancel={onClose}
// //       footer={[
// //         <Button
// //           key="edit"
// //           type="default"
// //           icon={<EditOutlined />}
// //           onClick={onEdit}
// //         >
// //           Edit
// //         </Button>,
// //         <Button
// //           key="delete"
// //           danger
// //           icon={<DeleteOutlined />}
// //           onClick={onDelete}
// //         >
// //           Delete
// //         </Button>,
// //       ]}
// //       width={700}
// //     >
// //       <div className="flex">
// //         <div className="flex-grow">
// //           <h3 className="text-lg font-medium mb-4">Primary Details</h3>
// //           <div className="grid grid-cols-2 gap-4">
// //             <div className="font-medium">Supplier ID</div>
// //             <div>{supplier.id}</div>
// //             <div className="font-medium">Supplier Name</div>
// //             <div>{supplier.name}</div>
// //             <div className="font-medium">Supplier Type</div>
// //             <div
// //               className={
// //                 supplier.type === "Taking Return"
// //                   ? "text-green-500"
// //                   : "text-red-500"
// //               }
// //             >
// //               {supplier.type}
// //             </div>
// //             <div className="font-medium">Contact number</div>
// //             <div>{supplier.contactNumber}</div>
// //             <div className="font-medium">Email</div>
// //             <div>{supplier.email}</div>
// //             <div className="font-medium">Products</div>
// //             <div className="flex flex-wrap">
// //               {supplier.products.map((product, index) => (
// //                 <Tag key={index} color="blue" className="mb-1 mr-1">
// //                   {product}
// //                 </Tag>
// //               ))}
// //             </div>
// //             <div className="font-medium">Address</div>
// //             <div>{supplier.address || "N/A"}</div>
// //           </div>
// //         </div>
// //         <div className="ml-8 flex items-start justify-center">
// //           <Avatar
// //             size={100}
// //             icon={<UserOutlined />}
// //             src={supplier.image}
// //             className="border border-gray-300"
// //           />
// //         </div>
// //       </div>
// //     </Modal>
// //   );
// // };

// // export default SupplierViewModal;

// import React from "react";
// import { Modal, Button, Tag, Avatar } from "antd";
// import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

// const SupplierViewModal = ({
//   visible,
//   supplier,
//   onClose,
//   onEdit,
//   onDelete,
// }) => {
//   if (!supplier) return null;

//   // Safely handle products data
//   const productsToRender = Array.isArray(supplier.products)
//     ? supplier.products
//     : [];

//   return (
//     <Modal
//       title="Supplier Overview"
//       open={visible}
//       onCancel={onClose}
//       footer={[
//         <Button
//           key="edit"
//           type="default"
//           icon={<EditOutlined />}
//           onClick={onEdit}
//         >
//           Edit
//         </Button>,
//         <Button
//           key="delete"
//           danger
//           icon={<DeleteOutlined />}
//           onClick={onDelete}
//         >
//           Delete
//         </Button>,
//       ]}
//       width={700}
//     >
//       <div className="flex">
//         <div className="flex-grow">
//           <h3 className="text-lg font-medium mb-4">Primary Details</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="font-medium">Supplier ID</div>
//             <div>{supplier.id || "N/A"}</div>

//             <div className="font-medium">Supplier Name</div>
//             <div>{supplier.name || "N/A"}</div>

//             <div className="font-medium">Supplier Type</div>
//             <div
//               className={
//                 supplier.type === "Taking Return"
//                   ? "text-green-500"
//                   : "text-red-500"
//               }
//             >
//               {supplier.type || "N/A"}
//             </div>

//             <div className="font-medium">Contact number</div>
//             <div>{supplier.contactNumber || "N/A"}</div>

//             <div className="font-medium">Email</div>
//             <div>{supplier.email || "N/A"}</div>

//             <div className="font-medium">Products</div>
//             <div className="flex flex-wrap">
//               {productsToRender.map((product, index) => {
//                 const productName =
//                   typeof product === "object"
//                     ? product.name || product.product_name
//                     : product;
//                 return (
//                   <Tag key={index} color="blue" className="mb-1 mr-1">
//                     {productName || "Unnamed Product"}
//                   </Tag>
//                 );
//               })}
//               {productsToRender.length === 0 && <span>No products</span>}
//             </div>

//             <div className="font-medium">Address</div>
//             <div>{supplier.address || "N/A"}</div>
//           </div>
//         </div>
//         <div className="ml-8 flex items-start justify-center">
//           <Avatar
//             size={100}
//             icon={<UserOutlined />}
//             src={supplier.image || supplier.imageUrl}
//           />
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default SupplierViewModal;
// //

import React from "react";
import { Modal, Button, Tag, Avatar } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

const SupplierViewModal = ({
  visible,
  supplier,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!supplier) return null;

  // Safely handle products data
  const productsToRender = Array.isArray(supplier.products)
    ? supplier.products
    : [];

  return (
    <Modal
      title="Supplier Overview"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button
          key="edit"
          type="default"
          icon={<EditOutlined />}
          onClick={onEdit}
        >
          Edit
        </Button>,
        <Button
          key="delete"
          danger
          icon={<DeleteOutlined />}
          onClick={onDelete}
        >
          Delete
        </Button>,
      ]}
      width={700}
    >
      <div className="flex">
        <div className="flex-grow">
          <h3 className="text-lg font-medium mb-4">Primary Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="font-medium">Supplier ID</div>
            <div>{supplier.id || "N/A"}</div>

            <div className="font-medium">Supplier Name</div>
            <div>{supplier.name || "N/A"}</div>

            <div className="font-medium">Supplier Type</div>
            <div
              className={
                supplier.type === "Taking Return"
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {supplier.type || "N/A"}
            </div>

            <div className="font-medium">Contact number</div>
            <div>{supplier.contactNumber || "N/A"}</div>

            <div className="font-medium">Email</div>
            <div>{supplier.email || "N/A"}</div>

            <div className="font-medium">Products</div>
            <div className="font-medium">Products</div>
            <div className="flex flex-wrap">
              {productsToRender.map((product, index) => {
                // Handle both object formats (different property names)
                const productName =
                  typeof product === "object"
                    ? product.name || product.product_name
                    : product;

                return (
                  <Tag key={index} color="blue" className="mb-1 mr-1">
                    {productName || "Unnamed Product"}
                  </Tag>
                );
              })}
              {productsToRender.length === 0 && <span>No products</span>}
            </div>

            <div className="font-medium">Address</div>
            <div>{supplier.address || "N/A"}</div>
          </div>
        </div>
        <div className="ml-8 flex items-start justify-center">
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src={supplier.image || supplier.imageUrl}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SupplierViewModal;
