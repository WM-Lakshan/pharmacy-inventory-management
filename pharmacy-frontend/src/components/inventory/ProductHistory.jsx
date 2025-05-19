// // // import React from "react";
// // // import { Card, Table, Tag } from "antd";

// // // const ProductHistory = ({ history, unit = "Units" }) => {
// // //   // Column definitions for the product history table
// // //   const historyColumns = [
// // //     {
// // //       title: "Order ID",
// // //       dataIndex: "orderId",
// // //       key: "orderId",
// // //     },
// // //     {
// // //       title: "Expiry Date",
// // //       dataIndex: "expiryDate",
// // //       key: "expiryDate",
// // //     },
// // //     {
// // //       title: "Quantity",
// // //       dataIndex: "quantity",
// // //       key: "quantity",
// // //       render: (quantity) => `${quantity} ${unit}`,
// // //     },
// // //     {
// // //       title: "Date",
// // //       dataIndex: "date",
// // //       key: "date",
// // //     },
// // //     {
// // //       title: "Type",
// // //       dataIndex: "type",
// // //       key: "type",
// // //       render: (type) => {
// // //         const color = type === "Purchase" ? "blue" : "green";
// // //         return <Tag color={color}>{type}</Tag>;
// // //       },
// // //     },
// // //   ];

// // //   return (
// // //     <Card>
// // //       <Table
// // //         columns={historyColumns}
// // //         dataSource={history}
// // //         rowKey="id"
// // //         pagination={{ pageSize: 5 }}
// // //       />
// // //     </Card>
// // //   );
// // // };

// // // export default ProductHistory;

// // import React from "react";
// // import { Card, Table, Tag } from "antd";

// // const ProductHistory = ({ history, unit = "Units" }) => {
// //   // Column definitions for the product history table
// //   const historyColumns = [
// //     {
// //       title: "Order ID",
// //       dataIndex: "orderId",
// //       key: "orderId",
// //     },
// //     {
// //       title: "Supplier Name",
// //       dataIndex: "supplierName",
// //       key: "supplierName",
// //       render: (supplierName) => supplierName || "N/A",
// //     },
// //     {
// //       title: "Expiry Date",
// //       dataIndex: "expiryDate",
// //       key: "expiryDate",
// //     },
// //     {
// //       title: "Quantity",
// //       dataIndex: "quantity",
// //       key: "quantity",
// //       render: (quantity) => `${quantity} ${unit}`,
// //     },
// //     {
// //       title: "Date",
// //       dataIndex: "date",
// //       key: "date",
// //     },
// //   ];

// //   return (
// //     <Card>
// //       <Table
// //         columns={historyColumns}
// //         dataSource={history}
// //         rowKey="id"
// //         pagination={{ pageSize: 5 }}
// //       />
// //     </Card>
// //   );
// // };

// // export default ProductHistory;

// import React, { useState, useEffect } from "react";
// import { Card, Table, Tag, message } from "antd";
// import api from "../../services/api";

// const ProductHistory = ({ productId, unit = "Units" }) => {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (productId) {
//       fetchHistory();
//     }
//   }, [productId]);

//   const fetchHistory = async () => {
//     try {
//       setLoading(true);
//       const response = await api.products.getHistory(productId);
//       setHistory(response.data);
//     } catch (error) {
//       message.error("Failed to load product history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     {
//       title: "Order ID",
//       dataIndex: "orderId",
//       key: "orderId",
//     },
//     {
//       title: "Supplier",
//       dataIndex: "supplierName",
//       key: "supplierName",
//     },
//     {
//       title: "Quantity",
//       dataIndex: "quantity",
//       key: "quantity",
//       render: (quantity) => `${quantity} ${unit}`,
//     },
//     {
//       title: "Date",
//       dataIndex: "date",
//       key: "date",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <Tag color={status === "completed" ? "green" : "orange"}>{status}</Tag>
//       ),
//     },
//   ];

//   return (
//     <Card>
//       <Table
//         columns={columns}
//         dataSource={history}
//         rowKey="id"
//         loading={loading}
//         pagination={{ pageSize: 5 }}
//       />
//     </Card>
//   );
// };

// export default ProductHistory;


// components/inventory/ProductHistory.jsx
import React from "react";
import { Card, Table, Tag } from "antd";

const ProductHistory = ({ history = [], unit = "Units" }) => {
  // Columns for the product history table
  const historyColumns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Supplier",
      dataIndex: "supplierName",
      key: "supplierName",
      render: (text) => text || "N/A",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => `${quantity} ${unit}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
  ];

  return (
    <Card>
      <Table
        columns={historyColumns}
        dataSource={history}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "No history found for this product" }}
      />
    </Card>
  );
};

export default ProductHistory;