import React, { useState, useEffect } from "react";
import { Card, Table, Typography, Badge, Tabs, Button, Spin } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BarChartOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Dashboard = () => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    sales: 0,
    purchases: 0,
    cancellations: 0,
    totalAmount: 0,
  });
  const [inventory, setInventory] = useState({
    quantityInHand: 0,
    toBeReceived: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [expiredProducts, setExpiredProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [timeRange, setTimeRange] = useState("weekly");

  // Fetch data from the server
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // We'll request all necessary data in parallel
        const [
          overviewResponse,
          inventoryResponse,
          salesDataResponse,
          topSellingResponse,
          expiredResponse,
          lowStockResponse,
        ] = await Promise.all([
          axios.get("/api/dashboard/overview"),
          axios.get("/api/dashboard/inventory"),
          axios.get(`/api/dashboard/sales-data?timeRange=${timeRange}`),
          axios.get("/api/dashboard/top-selling"),
          axios.get("/api/dashboard/expired-products"),
          axios.get("/api/dashboard/low-stock"),
        ]);

        // Update state with received data
        setOverview(overviewResponse.data);
        setInventory(inventoryResponse.data);
        setSalesData(salesDataResponse.data);
        setTopSellingProducts(topSellingResponse.data);
        setExpiredProducts(expiredResponse.data);
        setLowStockProducts(lowStockResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // If there's an error, we'll use mock data for demonstration
        setMockData();
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  // Mock data for demonstration and development purposes
  const setMockData = () => {
    setOverview({
      sales: 832,
      purchases: 82,
      cancellations: 5,
      totalAmount: 832,
    });

    setInventory({
      quantityInHand: 868,
      toBeReceived: 200,
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const mockSalesData = months.map((month) => ({
      month,
      purchase: Math.floor(Math.random() * 30000) + 20000,
      sales: Math.floor(Math.random() * 20000) + 20000,
    }));
    setSalesData(mockSalesData);

    setTopSellingProducts([
      {
        id: 1,
        name: "panadol",
        soldQuantity: 30,
        remainingQuantity: 12,
        price: 100,
      },
      {
        id: 2,
        name: "samahan",
        soldQuantity: 21,
        remainingQuantity: 15,
        price: 207,
      },
      {
        id: 3,
        name: "K95",
        soldQuantity: 18,
        remainingQuantity: 15,
        price: 150,
      },
    ]);

    setExpiredProducts([
      {
        id: 1,
        name: "masks",
        remainingQuantity: 15,
        unit: "Packet",
        status: "Low",
      },
      {
        id: 2,
        name: "K95",
        remainingQuantity: 15,
        unit: "Packet",
        status: "Low",
      },
    ]);

    setLowStockProducts([
      {
        id: 1,
        name: "masks",
        remainingQuantity: 15,
        unit: "Packet",
        status: "Low",
      },
      {
        id: 2,
        name: "K95",
        remainingQuantity: 15,
        unit: "Packet",
        status: "Low",
      },
    ]);
  };

  // Table columns configuration
  const topSellingColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sold Quantity",
      dataIndex: "soldQuantity",
      key: "soldQuantity",
    },
    {
      title: "Remaining Quantity",
      dataIndex: "remainingQuantity",
      key: "remainingQuantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `Rs. ${price}`,
    },
  ];

  // Function to handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Overview" className="shadow-md">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-2">
                <BarChartOutlined className="text-blue-500 text-xl" />
              </div>
              <Text className="text-lg font-semibold">
                Rs.{overview.totalAmount}
              </Text>
              <Text className="text-gray-500">Sales</Text>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-2">
                <ShoppingCartOutlined className="text-green-500 text-xl" />
              </div>
              <Text className="text-lg font-semibold">
                {overview.purchases}
              </Text>
              <Text className="text-gray-500">Purchase</Text>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-red-100 p-3 rounded-full mb-2">
                <ClockCircleOutlined className="text-red-500 text-xl" />
              </div>
              <Text className="text-lg font-semibold">
                {overview.cancellations}
              </Text>
              <Text className="text-gray-500">Cancel</Text>
            </div>
          </div>
        </Card>

        <Card title="Inventory Summary" className="shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-yellow-100 p-3 rounded-full mb-2">
                <InboxOutlined className="text-yellow-500 text-xl" />
              </div>
              <Text className="text-lg font-semibold">
                {inventory.quantityInHand}
              </Text>
              <Text className="text-gray-500">Quantity in Hand</Text>
            </div>

            {/* <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-3 rounded-full mb-2">
                <CheckCircleOutlined className="text-purple-500 text-xl" />
              </div>
              <Text className="text-lg font-semibold">
                {inventory.toBeReceived}
              </Text>
              <Text className="text-gray-500">To be received</Text>
            </div> */}
          </div>
        </Card>
      </div>

      {/* Sales & Purchase Chart */}
      {/* <Card
        title="Sales & Purchase"
        className="mb-6 shadow-md"
        extra={
          <div className="flex space-x-2">
            <Button
              type={timeRange === "weekly" ? "primary" : "default"}
              onClick={() => handleTimeRangeChange("weekly")}
              className={timeRange === "weekly" ? "bg-blue-500" : ""}
            >
              Weekly
            </Button>
            <Button
              type={timeRange === "monthly" ? "primary" : "default"}
              onClick={() => handleTimeRangeChange("monthly")}
              className={timeRange === "monthly" ? "bg-blue-500" : ""}
            >
              Monthly
            </Button>
            <Button
              type={timeRange === "yearly" ? "primary" : "default"}
              onClick={() => handleTimeRangeChange("yearly")}
              className={timeRange === "yearly" ? "bg-blue-500" : ""}
            >
              Yearly
            </Button>
          </div>
        }
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `Rs. ${value}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="purchase"
                stroke="#4F46E5"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#22C55E"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card> */}

      {/* Top Products and Status sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Selling Products */}
        <Card
          title="Top Selling Stock"
          className="shadow-md"
          extra={
            <a href="/products" className="text-blue-500">
              See All
            </a>
          }
        >
          <Table
            columns={topSellingColumns}
            dataSource={topSellingProducts}
            pagination={false}
            rowKey="id"
          />
        </Card>

        {/* Products Status Tabs */}
        <div className="shadow-md rounded-lg bg-white">
          <Tabs defaultActiveKey="expired" className="p-4">
            <TabPane tab="Expired near products" key="expired">
              {expiredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border-b"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <InboxOutlined className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <Text className="font-medium">{product.name}</Text>
                      <div className="text-sm text-gray-500">
                        Remaining Quantity: {product.remainingQuantity}{" "}
                        {product.unit}
                      </div>
                    </div>
                  </div>
                  <Badge
                    count={product.status}
                    style={{
                      backgroundColor:
                        product.status === "Low" ? "#f5222d" : "#faad14",
                    }}
                  />
                </div>
              ))}
            </TabPane>

            <TabPane tab="Low Quantity Stock" key="low-stock">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border-b"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <InboxOutlined className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <Text className="font-medium">{product.name}</Text>
                      <div className="text-sm text-gray-500">
                        Remaining Quantity: {product.remainingQuantity}{" "}
                        {product.unit}
                      </div>
                    </div>
                  </div>
                  <Badge
                    count={product.status}
                    style={{
                      backgroundColor:
                        product.status === "Low" ? "#f5222d" : "#faad14",
                    }}
                  />
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No low stock products found
                </div>
              )}
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
