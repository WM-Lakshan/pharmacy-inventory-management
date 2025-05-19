// // import React from "react";
// // import { Card, Button, Tabs, Typography, Avatar, Table, Tag } from "antd";
// // import {
// //   EditOutlined,
// //   DeleteOutlined,
// //   ArrowLeftOutlined,
// // } from "@ant-design/icons";
// // import ProductHistory from "./ProductHistory";

// // const { Title, Text } = Typography;
// // const { TabPane } = Tabs;

// // const ProductDetails = ({ product, history, onEdit, onDelete, onBack }) => {
// //   if (!product) return null;

// //   return (
// //     <Card
// //       title={<Title level={4}>{product.name}</Title>}
// //       extra={
// //         <Button icon={<EditOutlined />} onClick={onEdit}>
// //           Edit
// //         </Button>
// //       }
// //     >
// //       <Tabs defaultActiveKey="1">
// //         <TabPane tab="Overview" key="1">
// //           <div style={{ display: "flex" }}>
// //             {/* Left side - Details */}
// //             <div style={{ width: "66%", paddingRight: 24 }}>
// //               <Title level={5}>Product Details</Title>
// //               <div
// //                 style={{
// //                   display: "grid",
// //                   gridTemplateColumns: "1fr 2fr",
// //                   rowGap: 8,
// //                 }}
// //               >
// //                 <Text strong>Product ID</Text>
// //                 <Text>{product.productId}</Text>

// //                 <Text strong>Product name</Text>
// //                 <Text>{product.name}</Text>

// //                 <Text strong>Product category</Text>
// //                 <Text>{product.category}</Text>

// //                 <Text strong>Stock quantity</Text>
// //                 <Text>{product.remainingStock}</Text>

// //                 <Text strong>Unit type</Text>
// //                 <Text>{product.unit}</Text>

// //                 <Text strong>Units per package</Text>
// //                 <Text>{product.unitsPerPackage}</Text>

// //                 <Text strong>Threshold</Text>
// //                 <Text>{product.threshold}</Text>
// //               </div>
// //             </div>

// //             {/* Right side - Image */}
// //             <div style={{ width: "34%" }}>
// //               <div style={{ marginBottom: 24, textAlign: "center" }}>
// //                 <Avatar
// //                   shape="square"
// //                   size={150}
// //                   src={product.image}
// //                   style={{ border: "1px dashed #d9d9d9", padding: 8 }}
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Delete button */}
// //           <div style={{ marginTop: 24, textAlign: "right" }}>
// //             <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
// //               Delete
// //             </Button>
// //           </div>

// //           {/* Back button */}
// //           <div style={{ marginTop: 16 }}>
// //             <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack}>
// //               Back to products
// //             </Button>
// //           </div>
// //         </TabPane>
// //         <TabPane tab="History" key="2">
// //           <ProductHistory history={history} unit={product.unit} />
// //         </TabPane>
// //       </Tabs>
// //     </Card>
// //   );
// // };

// // export default ProductDetails;

// import React, { useState, useEffect } from "react";
// import { Card, Button, Tabs, Typography, Avatar, Tag, message } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   ArrowLeftOutlined,
// } from "@ant-design/icons";
// import ProductHistory from "./ProductHistory";
// import api from "../../services/api";

// const { Title, Text } = Typography;
// const { TabPane } = Tabs;

// const ProductDetails = ({ product, history, onEdit, onDelete, onBack }) => {
//   const [stockData, setStockData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         setLoading(true);
//         const response = await api.products.getHistory(product.id);
//         setHistory(response.data);
//       } catch (error) {
//         console.error("Error fetching product history:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [product.id]);

//   useEffect(() => {
//     const fetchStockData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.products.getById(product.id);
//         setStockData(response.data);
//       } catch (error) {
//         console.error("Error fetching product stock data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStockData();
//   }, [product.id]);

//   if (!product) return null;

//   return (
//     <Card
//       title={<Title level={4}>{product.name}</Title>}
//       extra={[
//         <Button key="edit" icon={<EditOutlined />} onClick={onEdit}>
//           Edit
//         </Button>,
//         <Button
//           key="refresh"
//           onClick={fetchStockData}
//           loading={loading}
//           style={{ marginLeft: 8 }}
//         >
//           Refresh
//         </Button>,
//       ]}
//       loading={loading}
//     >
//       <Tabs defaultActiveKey="1">
//         <TabPane tab="Overview" key="1">
//           <div style={{ display: "flex" }}>
//             <div style={{ width: "66%", paddingRight: 24 }}>
//               <Title level={5}>Product Details</Title>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 2fr",
//                   rowGap: 8,
//                 }}
//               >
//                 {/* Product details rendering */}
//                 <Text strong>Status</Text>
//                 <Tag
//                   color={
//                     product.status === "In-stock"
//                       ? "green"
//                       : product.status === "Low stock"
//                       ? "orange"
//                       : "red"
//                   }
//                 >
//                   {product.status}
//                 </Tag>
//                 {/* ... other fields ... */}
//               </div>
//             </div>
//             <div style={{ width: "34%" }}>
//               {product.image && (
//                 <Avatar
//                   shape="square"
//                   size={150}
//                   src={product.image}
//                   style={{ border: "1px dashed #d9d9d9", padding: 8 }}
//                 />
//               )}
//             </div>
//           </div>
//           <div style={{ marginTop: 24, textAlign: "right" }}>
//             <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
//               Delete
//             </Button>
//           </div>
//           <div style={{ marginTop: 16 }}>
//             <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack}>
//               Back to products
//             </Button>
//           </div>
//         </TabPane>
//         <TabPane tab="History" key="2">
//           <ProductHistory history={history} unit={product.unit} />
//         </TabPane>
//       </Tabs>
//     </Card>
//   );
// };

// export default ProductDetails;

// components/inventory/ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { Card, Button, Tabs, Typography, Avatar, Tag, message } from "antd";
import axios from "axios";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import ProductHistory from "./ProductHistory";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProductDetails = ({ product, onEdit, onDelete, onBack }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (product?.id) {
      fetchProductData();
      fetchProductHistory();
    }
  }, [product?.id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${product.id}`);
      if (response.data.success) {
        setStockData(response.data.product);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      message.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${product.id}/history`);
      if (response.data.success) {
        setHistory(response.data.history || []);
      }
    } catch (error) {
      console.error("Error fetching product history:", error);
      message.error("Failed to load product history");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  // Use stockData if available, otherwise fall back to the original product
  const displayProduct = stockData || product;

  return (
    <Card
      title={<Title level={4}>{displayProduct.name}</Title>}
      extra={[
        <Button key="edit" icon={<EditOutlined />} onClick={onEdit}>
          Edit
        </Button>,
        <Button
          key="refresh"
          onClick={fetchProductData}
          loading={loading}
          style={{ marginLeft: 8 }}
        >
          Refresh
        </Button>,
      ]}
      loading={loading}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Overview" key="1">
          <div style={{ display: "flex" }}>
            <div style={{ width: "66%", paddingRight: 24 }}>
              <Title level={5}>Product Details</Title>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  rowGap: 8,
                }}
              >
                <Text strong>Product ID</Text>
                <Text>{displayProduct.id}</Text>

                <Text strong>Name</Text>
                <Text>{displayProduct.name}</Text>

                <Text strong>Category</Text>
                <Text>{displayProduct.category}</Text>

                <Text strong>Status</Text>
                <Tag
                  color={
                    displayProduct.status === "In-stock"
                      ? "green"
                      : displayProduct.status === "Low stock"
                      ? "orange"
                      : "red"
                  }
                >
                  {displayProduct.status}
                </Tag>

                <Text strong>Quantity</Text>
                <Text>
                  {displayProduct.quantity} {displayProduct.unit}
                </Text>

                <Text strong>Type</Text>
                <Text>{displayProduct.type}</Text>

                <Text strong>Threshold</Text>
                <Text>{displayProduct.threshold}</Text>

                <Text strong>Expiry Date</Text>
                <Text>{displayProduct.expiryDate}</Text>
              </div>
            </div>
            <div style={{ width: "34%" }}>
              {displayProduct.image && (
                <Avatar
                  shape="square"
                  size={150}
                  src={displayProduct.image}
                  style={{ border: "1px dashed #d9d9d9", padding: 8 }}
                />
              )}
            </div>
          </div>
          <div style={{ marginTop: 24, textAlign: "right" }}>
            <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
              Delete
            </Button>
          </div>
          <div style={{ marginTop: 16 }}>
            <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack}>
              Back to products
            </Button>
          </div>
        </TabPane>
        <TabPane tab="History" key="2">
          <ProductHistory history={history} unit={displayProduct.unit} />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default ProductDetails;
