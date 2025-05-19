// import React, { useState, useEffect } from "react";
// import { Card, Table, Button, Space, Tag, Typography, message } from "antd";
// import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
// import axios from "axios";

// const { Title } = Typography;

// const ProductTable = ({ onSelect, onAdd, loading: parentLoading }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//     total: 0,
//   });

//   useEffect(() => {
//     fetchProducts();
//   }, [pagination.current]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("/api/products", {
//         headers: { Authorization: `Bearer ${token}` },
//         // Remove page/limit params
//         params: {
//           category: selectedCategory, // if you have category filtering
//         },
//       });

//       if (response.data && response.data.success) {
//         setProducts(response.data.products || []);
//         // Remove pagination-related state if not needed
//       } else {
//         throw new Error(response.data?.message || "Failed to fetch products");
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       message.error("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTableChange = (pagination) => {
//     setPagination(pagination);
//   };

//   // Column definitions for the product table
//   const productColumns = [
//     {
//       title: "Product Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Quantity",
//       dataIndex: "quantity",
//       key: "quantity",
//       render: (quantity, record) => `${quantity} ${record.unit}`,
//     },
//     {
//       title: "Expiry Date",
//       dataIndex: "expiryDate",
//       key: "expiryDate",
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//       key: "type",
//     },
//     {
//       title: "Availability",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => {
//         let color = "green";
//         if (status === "Out of stock") {
//           color = "red";
//         } else if (status === "Low stock") {
//           color = "orange";
//         }
//         return <Tag color={color}>{status}</Tag>;
//       },
//     },
//   ];

//   return (
//     <Card
//       title={<Title level={4}>Products</Title>}
//       extra={
//         <Space>
//           <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
//             Add Product
//           </Button>
//           <Button icon={<FilterOutlined />}>Filters</Button>
//         </Space>
//       }
//     >
//       <Table
//         columns={productColumns}
//         dataSource={products}
//         rowKey="id"
//         onRow={(record) => ({
//           onClick: () => onSelect(record),
//         })}
//         className="cursor-pointer"
//         pagination={pagination}
//         onChange={handleTableChange}
//         loading={loading || parentLoading}
//       />
//     </Card>
//   );
// };

// export default ProductTable;

import React, { useState, useEffect } from "react";
import { Card, Table, Button, Space, Tag, Typography, message } from "antd";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const ProductTable = ({ onSelect, onAdd, loading: parentLoading }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [pagination.current]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pagination.current,
          pageSize: pagination.pageSize,
        },
      });

      if (response.data && response.data.success) {
        setProducts(response.data.products || []);
        setPagination({
          ...pagination,
          total: response.data.total || 0,
        });
      } else {
        throw new Error(response.data?.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Column definitions for the product table
  const productColumns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => `${quantity} ${record.unit || "Units"}`,
    },
    {
      title: "Expiry Date",
      dataIndex: "exp_date",
      key: "exp_date",
      render: (date) => date || "N/A",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) =>
        type === "prescription needed"
          ? "Prescription Required"
          : "No Prescription",
    },
    {
      title: "Availability",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green";
        if (status === "Out of stock") {
          color = "red";
        } else if (status === "Low stock") {
          color = "orange";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <Card
      title={<Title level={4}>Products</Title>}
      extra={
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Add Product
          </Button>
          <Button icon={<FilterOutlined />}>Filters</Button>
        </Space>
      }
    >
      <Table
        columns={productColumns}
        dataSource={products}
        rowKey="product_id"
        onRow={(record) => ({
          onClick: () => onSelect(record),
        })}
        className="cursor-pointer"
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading || parentLoading}
      />
    </Card>
  );
};

export default ProductTable;
