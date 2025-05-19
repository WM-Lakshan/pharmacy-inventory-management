// import React from "react";
// import { Card, Typography, Statistic } from "antd";

// const { Title, Text } = Typography;

// const InventorySummary = ({
//   categoriesCount,
//   lowStockCount,
//   emptyStockCount,
//   onCategoriesClick,
// }) => {
//   // Summary data for cards
//   const summaryData = [
//     {
//       title: "Categories",
//       value: categoriesCount,
//       subtitle: "Click to view",
//       onClick: onCategoriesClick,
//       color: "#1890ff", // Blue
//     },
//     {
//       title: "Low Stocks",
//       value: lowStockCount,
//       subtitle: "Ordered",
//       color: "#faad14", // Orange
//     },
//     {
//       title: "Empty",
//       value: emptyStockCount,
//       subtitle: "Not in stock",
//       color: "#8c8c8c", // Grey
//     },
//   ];

//   return (
//     <div className="mb-6">
//       <Card>
//         <Title level={4}>Overall Inventory</Title>
//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//           {summaryData.map((item, index) => (
//             <Card.Grid
//               key={index}
//               style={{
//                 width: "33.33%",
//                 textAlign: "center",
//                 cursor: item.onClick ? "pointer" : "default",
//               }}
//               onClick={item.onClick}
//             >
//               <Statistic
//                 title={item.title}
//                 value={item.value}
//                 valueStyle={{ color: item.color }}
//               />
//               <Text type="secondary">{item.subtitle}</Text>
//             </Card.Grid>
//           ))}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default InventorySummary;
import React, { useState, useEffect } from "react";
import { Card, Typography, Statistic, Spin } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const InventorySummary = ({ onCategoriesClick }) => {
  const [stats, setStats] = useState({
    categoriesCount: 0,
    lowStockCount: 0,
    emptyStockCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/products/stats");
      if (response.data.success) {
        setStats({
          categoriesCount: response.data.categoriesCount || 0,
          lowStockCount: response.data.lowStockCount || 0,
          emptyStockCount: response.data.emptyStockCount || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching inventory stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const summaryData = [
    {
      title: "Categories",
      value: stats.categoriesCount,
      subtitle: "Click to view",
      onClick: onCategoriesClick,
      color: "#1890ff", // Blue
    },
    {
      title: "Low Stocks",
      value: stats.lowStockCount,
      subtitle: "Need reorder",
      color: "#faad14", // Orange
    },
    {
      title: "Empty",
      value: stats.emptyStockCount,
      subtitle: "Out of stock",
      color: "#ff4d4f", // Red
    },
  ];

  return (
    <div className="mb-6">
      <Card loading={loading}>
        <Title level={4}>Inventory Summary</Title>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {summaryData.map((item, index) => (
            <Card.Grid
              key={index}
              style={{
                width: "33.33%",
                textAlign: "center",
                cursor: item.onClick ? "pointer" : "default",
              }}
              onClick={item.onClick}
            >
              <Statistic
                title={item.title}
                value={item.value}
                valueStyle={{ color: item.color }}
              />
              <Text type="secondary">{item.subtitle}</Text>
            </Card.Grid>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InventorySummary;
