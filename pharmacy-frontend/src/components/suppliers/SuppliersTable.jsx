// import React from "react";
// import { Table, Button, Tag } from "antd";
// import { PlusOutlined, FilterOutlined } from "@ant-design/icons";

// const SuppliersTable = ({
//   suppliers,
//   loading,
//   onRowClick,
//   onAddSupplier,
//   onFilterClick,
//   filterSummary,
// }) => {
//   const columns = [
//     {
//       title: "Supplier ID",
//       dataIndex: "id",
//       key: "id",
//     },
//     {
//       title: "Supplier Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Products",
//       dataIndex: "products",
//       key: "products",
//       render: (products) => (
//         <div>
//           {products.map((product) => {
//             const productId = product.id || product;
//             const productName =
//               typeof product === "object" ? product.name : product;
//             return (
//               <Tag key={productId} color="blue" className="mb-1">
//                 {productName}
//               </Tag>
//             );
//           })}
//         </div>
//       ),
//     },
//     {
//       title: "Contact Number",
//       dataIndex: "contactNumber",
//       key: "contactNumber",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//       key: "type",
//       render: (type) => (
//         <span
//           className={
//             type === "Taking Return" ? "text-green-500" : "text-red-500"
//           }
//         >
//           {type}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">Suppliers</h2>
//         <div className="flex space-x-2 gap-4 ml-4">
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={onAddSupplier}
//             className="bg-blue-500 hover:bg-blue-600"
//           >
//             Add Supplier
//           </Button>
//           <Button icon={<FilterOutlined />} onClick={onFilterClick}>
//             Filter: {filterSummary}
//           </Button>
//         </div>
//       </div>

//       <Table
//         columns={columns}
//         dataSource={suppliers}
//         rowKey="id"
//         loading={loading}
//         onRow={(record) => ({
//           onClick: () => onRowClick(record),
//         })}
//         className="cursor-pointer"
//         pagination={{ pageSize: 10 }}
//       />
//     </>
//   );
// };

// export default SuppliersTable;

import React from "react";
import { Table, Button, Tag } from "antd";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";

const SuppliersTable = ({
  suppliers,
  loading,
  onRowClick,
  onAddSupplier,
  onFilterClick,
  filterSummary,
}) => {
  const columns = [
    {
      title: "Supplier ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Supplier Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <div>
          {Array.isArray(products) &&
            products.map((product) => {
              // Handle both object format and string format
              const productId =
                typeof product === "object" ? product.id : product;
              const productName =
                typeof product === "object" ? product.name : product;

              return (
                <Tag key={productId} color="blue" className="mb-1">
                  {productName}
                </Tag>
              );
            })}
        </div>
      ),
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span
          className={
            type === "Taking Return" ? "text-green-500" : "text-red-500"
          }
        >
          {type}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Suppliers</h2>
        <div className="flex space-x-2 gap-4 ml-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddSupplier}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Add Supplier
          </Button>
          <Button icon={<FilterOutlined />} onClick={onFilterClick}>
            Filter: {filterSummary}
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey="id"
        loading={loading}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
        className="cursor-pointer"
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default SuppliersTable;
