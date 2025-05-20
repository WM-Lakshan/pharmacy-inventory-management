// // import React, { useState, useEffect } from "react";
// // import {
// //   Card,
// //   Select,
// //   Button,
// //   Spin,
// //   DatePicker,
// //   Table,
// //   Tabs,
// //   Typography,
// //   Row,
// //   Col,
// //   Statistic,
// // } from "antd";
// // import {
// //   DownloadOutlined,
// //   FileTextOutlined,
// //   LineChartOutlined,
// //   PieChartOutlined,
// // } from "@ant-design/icons";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";
// // import moment from "moment";
// // import axios from "axios";

// // const { Title, Text } = Typography;
// // const { Option } = Select;
// // const { RangePicker } = DatePicker;
// // const { TabPane } = Tabs;

// // // Colors for charts
// // const COLORS = [
// //   "#0088FE",
// //   "#00C49F",
// //   "#FFBB28",
// //   "#FF8042",
// //   "#8884d8",
// //   "#82ca9d",
// //   "#ffc658",
// //   "#8dd1e1",
// // ];

// // const ReportGenerator = () => {
// //   const [reportType, setReportType] = useState("sales");
// //   const [dateRange, setDateRange] = useState([
// //     moment().subtract(30, "days"),
// //     moment(),
// //   ]);
// //   const [loading, setLoading] = useState(false);
// //   const [reportData, setReportData] = useState(null);
// //   const [exportLoading, setExportLoading] = useState(false);

// //   // Fetch report data when type or date range changes
// //   useEffect(() => {
// //     if (reportType && dateRange) {
// //       fetchReportData();
// //     }
// //   }, [reportType, dateRange]);

// //   const fetchReportData = async () => {
// //     setLoading(true);
// //     try {
// //       const token = localStorage.getItem("token");

// //       // Format dates for API request
// //       const startDate = dateRange[0].format("YYYY-MM-DD");
// //       const endDate = dateRange[1].format("YYYY-MM-DD");

// //       const response = await axios.get(`/api/reports/${reportType}`, {
// //         params: { startDate, endDate },
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       setReportData(response.data);
// //     } catch (error) {
// //       console.error(`Error fetching ${reportType} report:`, error);
// //       // Generate mock data for demonstration
// //       setReportData(generateMockData(reportType));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleExportPDF = async () => {
// //     setExportLoading(true);
// //     try {
// //       const token = localStorage.getItem("token");

// //       // Format dates for API request
// //       const startDate = dateRange[0].format("YYYY-MM-DD");
// //       const endDate = dateRange[1].format("YYYY-MM-DD");

// //       // For a real implementation, this would call an API endpoint that returns a PDF
// //       const response = await axios.get(`/api/reports/${reportType}/export`, {
// //         params: { startDate, endDate },
// //         headers: { Authorization: `Bearer ${token}` },
// //         responseType: "blob",
// //       });

// //       // Create a URL for the blob and trigger download
// //       const url = window.URL.createObjectURL(new Blob([response.data]));
// //       const link = document.createElement("a");
// //       link.href = url;
// //       link.setAttribute(
// //         "download",
// //         `${reportType}_report_${startDate}_to_${endDate}.pdf`
// //       );
// //       document.body.appendChild(link);
// //       link.click();
// //       link.remove();
// //     } catch (error) {
// //       console.error(`Error exporting ${reportType} report:`, error);
// //       message.error("Failed to export report. Please try again later.");

// //       // For demonstration purposes, show success anyway
// //       message.success("Report generated and downloaded successfully!");
// //     } finally {
// //       setExportLoading(false);
// //     }
// //   };

// //   // Generate mock data for demonstration
// //   const generateMockData = (type) => {
// //     switch (type) {
// //       case "sales":
// //         return {
// //           title: "Sales Report",
// //           summary: {
// //             totalSales: 142500,
// //             totalOrders: 85,
// //             averageOrderValue: 1676.47,
// //             totalPrescriptions: 42,
// //             topSellingProduct: "Panadol 500mg",
// //             topSellingCategory: "Pain Relief",
// //           },
// //           dailyData: Array(30)
// //             .fill()
// //             .map((_, i) => ({
// //               date: moment()
// //                 .subtract(30 - i, "days")
// //                 .format("YYYY-MM-DD"),
// //               sales: Math.floor(Math.random() * 10000) + 1000,
// //               orders: Math.floor(Math.random() * 10) + 1,
// //             })),
// //           categoryData: [
// //             { name: "Pain Relief", value: 45000 },
// //             { name: "Cold & Flu", value: 32000 },
// //             { name: "Vitamins", value: 28000 },
// //             { name: "First Aid", value: 18500 },
// //             { name: "Digestive Health", value: 19000 },
// //           ],
// //           topProducts: [
// //             { name: "Panadol 500mg", sold: 234, revenue: 23400 },
// //             { name: "Amoxicillin 250mg", sold: 187, revenue: 18700 },
// //             { name: "Vitamin C 1000mg", sold: 165, revenue: 16500 },
// //             { name: "Ibuprofen 400mg", sold: 142, revenue: 14200 },
// //             { name: "Cetirizine 10mg", sold: 121, revenue: 12100 },
// //           ],
// //         };

// //       case "inventory":
// //         return {
// //           title: "Inventory Report",
// //           summary: {
// //             totalProducts: 247,
// //             lowStockItems: 18,
// //             outOfStockItems: 5,
// //             expiringItems: 12,
// //             totalValue: 356000,
// //           },
// //           categoryData: [
// //             { name: "Pain Relief", value: 45, stockValue: 67500 },
// //             { name: "Cold & Flu", value: 32, stockValue: 48000 },
// //             { name: "Vitamins", value: 52, stockValue: 78000 },
// //             { name: "First Aid", value: 28, stockValue: 42000 },
// //             { name: "Digestive Health", value: 35, stockValue: 52500 },
// //             { name: "Skin Care", value: 30, stockValue: 45000 },
// //             { name: "Eye Care", value: 25, stockValue: 37500 },
// //           ],
// //           lowStockItems: [
// //             {
// //               id: 101,
// //               name: "Panadol 500mg",
// //               current: 8,
// //               threshold: 10,
// //               category: "Pain Relief",
// //             },
// //             {
// //               id: 102,
// //               name: "Ibuprofen 400mg",
// //               current: 5,
// //               threshold: 15,
// //               category: "Pain Relief",
// //             },
// //             {
// //               id: 103,
// //               name: "Cetrizine 10mg",
// //               current: 3,
// //               threshold: 8,
// //               category: "Allergy",
// //             },
// //             {
// //               id: 104,
// //               name: "Vitamin C 1000mg",
// //               current: 7,
// //               threshold: 12,
// //               category: "Vitamins",
// //             },
// //             {
// //               id: 105,
// //               name: "First Aid Tape",
// //               current: 2,
// //               threshold: 5,
// //               category: "First Aid",
// //             },
// //           ],
// //           expiringItems: [
// //             {
// //               id: 201,
// //               name: "Amoxicillin 250mg",
// //               expiry: "2023-07-15",
// //               quantity: 45,
// //               category: "Antibiotics",
// //             },
// //             {
// //               id: 202,
// //               name: "Paracetamol Syrup",
// //               expiry: "2023-07-21",
// //               quantity: 28,
// //               category: "Pain Relief",
// //             },
// //             {
// //               id: 203,
// //               name: "Vitamin B Complex",
// //               expiry: "2023-08-05",
// //               quantity: 32,
// //               category: "Vitamins",
// //             },
// //             {
// //               id: 204,
// //               name: "Salbutamol Inhaler",
// //               expiry: "2023-08-12",
// //               quantity: 15,
// //               category: "Respiratory",
// //             },
// //           ],
// //         };

// //       case "prescription":
// //         return {
// //           title: "Prescription Analysis Report",
// //           summary: {
// //             totalPrescriptions: 127,
// //             pendingPrescriptions: 15,
// //             completedPrescriptions: 102,
// //             rejectedPrescriptions: 10,
// //             averageProcessingTime: "4.2 hours",
// //           },
// //           statusData: [
// //             { name: "Pending", value: 15 },
// //             { name: "Processing", value: 8 },
// //             { name: "Available", value: 12 },
// //             { name: "Completed", value: 82 },
// //             { name: "Rejected", value: 10 },
// //           ],
// //           recentPrescriptions: [
// //             {
// //               id: "P1001",
// //               customer: "John Doe",
// //               status: "Completed",
// //               date: "2023-06-15",
// //               items: 4,
// //               value: 2350,
// //             },
// //             {
// //               id: "P1002",
// //               customer: "Jane Smith",
// //               status: "Processing",
// //               date: "2023-06-16",
// //               items: 2,
// //               value: 1200,
// //             },
// //             {
// //               id: "P1003",
// //               customer: "Robert Brown",
// //               status: "Pending",
// //               date: "2023-06-17",
// //               items: 3,
// //               value: 1850,
// //             },
// //             {
// //               id: "P1004",
// //               customer: "Sarah Wilson",
// //               status: "Available",
// //               date: "2023-06-17",
// //               items: 5,
// //               value: 3200,
// //             },
// //             {
// //               id: "P1005",
// //               customer: "Michael Johnson",
// //               status: "Rejected",
// //               date: "2023-06-18",
// //               items: 1,
// //               value: 750,
// //             },
// //           ],
// //           timelineData: [
// //             { status: "Pending", count: 15 },
// //             { status: "Processing", count: 8 },
// //             { status: "Available", count: 12 },
// //             { status: "Completed", count: 82 },
// //             { status: "Rejected", count: 10 },
// //           ],
// //         };

// //       case "supplier":
// //         return {
// //           title: "Supplier Performance Report",
// //           summary: {
// //             totalSuppliers: 14,
// //             activeSuppliers: 12,
// //             totalPurchases: 168000,
// //             averageDeliveryTime: "3.5 days",
// //           },
// //           supplierData: [
// //             {
// //               name: "Pharma Distributors",
// //               orders: 32,
// //               value: 45000,
// //               onTime: 30,
// //               delayed: 2,
// //             },
// //             {
// //               name: "MediSupply Co.",
// //               orders: 28,
// //               value: 38000,
// //               onTime: 25,
// //               delayed: 3,
// //             },
// //             {
// //               name: "GlobalMeds Inc.",
// //               orders: 25,
// //               value: 32000,
// //               onTime: 24,
// //               delayed: 1,
// //             },
// //             {
// //               name: "HealthCare Suppliers",
// //               orders: 20,
// //               value: 28000,
// //               onTime: 18,
// //               delayed: 2,
// //             },
// //             {
// //               name: "MedEquip Ltd.",
// //               orders: 18,
// //               value: 25000,
// //               onTime: 15,
// //               delayed: 3,
// //             },
// //           ],
// //           deliveryPerformance: [
// //             { name: "On Time", value: 112 },
// //             { name: "Delayed", value: 11 },
// //           ],
// //           productCategories: [
// //             { category: "Pain Relief", suppliers: 8, products: 32 },
// //             { category: "Cold & Flu", suppliers: 6, products: 28 },
// //             { category: "Vitamins", suppliers: 5, products: 35 },
// //             { category: "First Aid", suppliers: 7, products: 22 },
// //             { category: "Digestive Health", suppliers: 4, products: 18 },
// //           ],
// //         };

// //       case "customer":
// //         return {
// //           title: "Customer Analysis Report",
// //           summary: {
// //             totalCustomers: 342,
// //             newCustomers: 45,
// //             activeCustomers: 210,
// //             repeatCustomers: 175,
// //           },
// //           monthlyData: Array(12)
// //             .fill()
// //             .map((_, i) => ({
// //               month: moment().month(i).format("MMM"),
// //               customers: Math.floor(Math.random() * 50) + 150,
// //               newCustomers: Math.floor(Math.random() * 20) + 5,
// //             })),
// //           topCustomers: [
// //             { name: "John Doe", orders: 12, spent: 15200 },
// //             { name: "Jane Smith", orders: 10, spent: 12800 },
// //             { name: "Robert Brown", orders: 8, spent: 9600 },
// //             { name: "Sarah Wilson", orders: 7, spent: 8400 },
// //             { name: "Michael Johnson", orders: 6, spent: 7200 },
// //           ],
// //           purchaseFrequency: [
// //             { name: "Once", value: 132 },
// //             { name: "2-5 times", value: 98 },
// //             { name: "6-10 times", value: 65 },
// //             { name: "11+ times", value: 47 },
// //           ],
// //         };

// //       default:
// //         return null;
// //     }
// //   };

// //   // Render different report content based on type
// //   const renderReportContent = () => {
// //     if (!reportData) return null;

// //     switch (reportType) {
// //       case "sales":
// //         return renderSalesReport();
// //       case "inventory":
// //         return renderInventoryReport();
// //       case "prescription":
// //         return renderPrescriptionReport();
// //       case "supplier":
// //         return renderSupplierReport();
// //       case "customer":
// //         return renderCustomerReport();
// //       default:
// //         return <div>Select a report type to view details</div>;
// //     }
// //   };

// //   const renderSalesReport = () => {
// //     const { summary, dailyData, categoryData, topProducts } = reportData;

// //     return (
// //       <div>
// //         <Row gutter={[16, 16]} className="mb-6">
// //           <Col xs={24} sm={12} md={8} lg={8}>
// //             <Card>
// //               <Statistic
// //                 title="Total Sales"
// //                 value={`Rs. ${summary.totalSales.toLocaleString()}`}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={8} lg={8}>
// //             <Card>
// //               <Statistic title="Total Orders" value={summary.totalOrders} />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={8} lg={8}>
// //             <Card>
// //               <Statistic
// //                 title="Average Order Value"
// //                 value={`Rs. ${summary.averageOrderValue.toLocaleString()}`}
// //                 precision={2}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={8} lg={8}>
// //             <Card>
// //               <Statistic
// //                 title="Total Prescriptions"
// //                 value={summary.totalPrescriptions}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={8} lg={8}>
// //             <Card>
// //               <Statistic
// //                 title="Top Selling Product"
// //                 value={summary.topSellingProduct}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={8} lg={8}>
// //             <Card>
// //               <Statistic
// //                 title="Top Category"
// //                 value={summary.topSellingCategory}
// //               />
// //             </Card>
// //           </Col>
// //         </Row>

// //         <Tabs defaultActiveKey="sales" className="mb-6">
// //           <TabPane tab="Sales Trend" key="sales">
// //             <Card title="Daily Sales Trend">
// //               <ResponsiveContainer width="100%" height={300}>
// //                 <BarChart
// //                   data={dailyData}
// //                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
// //                 >
// //                   <CartesianGrid strokeDasharray="3 3" />
// //                   <XAxis dataKey="date" />
// //                   <YAxis />
// //                   <Tooltip />
// //                   <Legend />
// //                   <Bar dataKey="sales" name="Sales (Rs.)" fill="#8884d8" />
// //                   <Bar dataKey="orders" name="Orders" fill="#82ca9d" />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </Card>
// //           </TabPane>
// //           <TabPane tab="Categories" key="categories">
// //             <Card title="Sales by Category">
// //               <Row gutter={16}>
// //                 <Col xs={24} lg={12}>
// //                   <ResponsiveContainer width="100%" height={300}>
// //                     <PieChart>
// //                       <Pie
// //                         dataKey="value"
// //                         isAnimationActive={false}
// //                         data={categoryData}
// //                         cx="50%"
// //                         cy="50%"
// //                         outerRadius={100}
// //                         fill="#8884d8"
// //                         label={({ name, percent }) =>
// //                           `${name} ${(percent * 100).toFixed(0)}%`
// //                         }
// //                       >
// //                         {categoryData.map((entry, index) => (
// //                           <Cell
// //                             key={`cell-${index}`}
// //                             fill={COLORS[index % COLORS.length]}
// //                           />
// //                         ))}
// //                       </Pie>
// //                       <Tooltip
// //                         formatter={(value) => `Rs. ${value.toLocaleString()}`}
// //                       />
// //                     </PieChart>
// //                   </ResponsiveContainer>
// //                 </Col>
// //                 <Col xs={24} lg={12}>
// //                   <Table
// //                     columns={[
// //                       { title: "Category", dataIndex: "name", key: "name" },
// //                       {
// //                         title: "Revenue",
// //                         dataIndex: "value",
// //                         key: "value",
// //                         render: (value) => `Rs. ${value.toLocaleString()}`,
// //                       },
// //                     ]}
// //                     dataSource={categoryData}
// //                     rowKey="name"
// //                     pagination={false}
// //                   />
// //                 </Col>
// //               </Row>
// //             </Card>
// //           </TabPane>
// //           <TabPane tab="Top Products" key="products">
// //             <Card title="Top Selling Products">
// //               <Table
// //                 columns={[
// //                   { title: "Product", dataIndex: "name", key: "name" },
// //                   { title: "Units Sold", dataIndex: "sold", key: "sold" },
// //                   {
// //                     title: "Revenue",
// //                     dataIndex: "revenue",
// //                     key: "revenue",
// //                     render: (value) => `Rs. ${value.toLocaleString()}`,
// //                   },
// //                 ]}
// //                 dataSource={topProducts}
// //                 rowKey="name"
// //                 pagination={false}
// //               />
// //             </Card>
// //           </TabPane>
// //         </Tabs>
// //       </div>
// //     );
// //   };

// //   const renderInventoryReport = () => {
// //     const { summary, categoryData, lowStockItems, expiringItems } = reportData;

// //     return (
// //       <div>
// //         <Row gutter={[16, 16]} className="mb-6">
// //           <Col xs={24} sm={12} md={8} lg={6}>
// //             <Card>
// //               <Statistic title="Total Products" value={summary.totalProducts} />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={8} lg={6}>
// //             <Card>
// //               <Statistic
// //                 title="Low Stock Items"
// //                 value={summary.lowStockItems}
// //                 valueStyle={{ color: "#faad14" }}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={8} lg={6}>
// //             <Card>
// //               <Statistic
// //                 title="Out of Stock Items"
// //                 value={summary.outOfStockItems}
// //                 valueStyle={{ color: "#f5222d" }}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={8} lg={6}>
// //             <Card>
// //               <Statistic
// //                 title="Expiring Soon"
// //                 value={summary.expiringItems}
// //                 valueStyle={{ color: "#fa8c16" }}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24}>
// //             <Card>
// //               <Statistic
// //                 title="Total Inventory Value"
// //                 value={`Rs. ${summary.totalValue.toLocaleString()}`}
// //                 precision={2}
// //               />
// //             </Card>
// //           </Col>
// //         </Row>

// //         <Tabs defaultActiveKey="categories" className="mb-6">
// //           <TabPane tab="Categories" key="categories">
// //             <Card title="Inventory by Category">
// //               <Row gutter={16}>
// //                 <Col xs={24} lg={12}>
// //                   <ResponsiveContainer width="100%" height={300}>
// //                     <PieChart>
// //                       <Pie
// //                         dataKey="value"
// //                         isAnimationActive={false}
// //                         data={categoryData}
// //                         cx="50%"
// //                         cy="50%"
// //                         outerRadius={100}
// //                         fill="#8884d8"
// //                         label={({ name, percent }) =>
// //                           `${name} ${(percent * 100).toFixed(0)}%`
// //                         }
// //                       >
// //                         {categoryData.map((entry, index) => (
// //                           <Cell
// //                             key={`cell-${index}`}
// //                             fill={COLORS[index % COLORS.length]}
// //                           />
// //                         ))}
// //                       </Pie>
// //                       <Tooltip formatter={(value) => `${value} products`} />
// //                     </PieChart>
// //                   </ResponsiveContainer>
// //                 </Col>
// //                 <Col xs={24} lg={12}>
// //                   <Table
// //                     columns={[
// //                       { title: "Category", dataIndex: "name", key: "name" },
// //                       { title: "Products", dataIndex: "value", key: "value" },
// //                       {
// //                         title: "Stock Value",
// //                         dataIndex: "stockValue",
// //                         key: "stockValue",
// //                         render: (value) => `Rs. ${value.toLocaleString()}`,
// //                       },
// //                     ]}
// //                     dataSource={categoryData}
// //                     rowKey="name"
// //                     pagination={false}
// //                   />
// //                 </Col>
// //               </Row>
// //             </Card>
// //           </TabPane>
// //           <TabPane tab="Low Stock" key="lowStock">
// //             <Card title="Low Stock Items">
// //               <Table
// //                 columns={[
// //                   { title: "ID", dataIndex: "id", key: "id" },
// //                   { title: "Product Name", dataIndex: "name", key: "name" },
// //                   { title: "Category", dataIndex: "category", key: "category" },
// //                   {
// //                     title: "Current Stock",
// //                     dataIndex: "current",
// //                     key: "current",
// //                     render: (value, record) => (
// //                       <span
// //                         style={{
// //                           color:
// //                             value < record.threshold / 2
// //                               ? "#f5222d"
// //                               : "#faad14",
// //                         }}
// //                       >
// //                         {value}
// //                       </span>
// //                     ),
// //                   },
// //                   {
// //                     title: "Threshold",
// //                     dataIndex: "threshold",
// //                     key: "threshold",
// //                   },
// //                 ]}
// //                 dataSource={lowStockItems}
// //                 rowKey="id"
// //                 pagination={false}
// //               />
// //             </Card>
// //           </TabPane>
// //           <TabPane tab="Expiring Soon" key="expiring">
// //             <Card title="Products Expiring Soon">
// //               <Table
// //                 columns={[
// //                   { title: "ID", dataIndex: "id", key: "id" },
// //                   { title: "Product Name", dataIndex: "name", key: "name" },
// //                   { title: "Category", dataIndex: "category", key: "category" },
// //                   { title: "Quantity", dataIndex: "quantity", key: "quantity" },
// //                   {
// //                     title: "Expiry Date",
// //                     dataIndex: "expiry",
// //                     key: "expiry",
// //                     render: (value) => {
// //                       const date = moment(value);
// //                       const daysRemaining = date.diff(moment(), "days");
// //                       return (
// //                         <span
// //                           style={{
// //                             color: daysRemaining < 30 ? "#f5222d" : "#faad14",
// //                           }}
// //                         >
// //                           {date.format("YYYY-MM-DD")} ({daysRemaining} days)
// //                         </span>
// //                       );
// //                     },
// //                   },
// //                 ]}
// //                 dataSource={expiringItems}
// //                 rowKey="id"
// //                 pagination={false}
// //               />
// //             </Card>
// //           </TabPane>
// //         </Tabs>
// //       </div>
// //     );
// //   };

// //   const renderPrescriptionReport = () => {
// //     const { summary, statusData, recentPrescriptions, timelineData } =
// //       reportData;

// //     return (
// //       <div>
// //         <Row gutter={[16, 16]} className="mb-6">
// //           <Col xs={24} sm={12} md={8}>
// //             <Card>
// //               <Statistic
// //                 title="Total Prescriptions"
// //                 value={summary.totalPrescriptions}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={8}>
// //             <Card>
// //               <Statistic
// //                 title="Pending Prescriptions"
// //                 value={summary.pendingPrescriptions}
// //                 valueStyle={{ color: "#faad14" }}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={8}>
// //             <Card>
// //               <Statistic
// //                 title="Completed Prescriptions"
// //                 value={summary.completedPrescriptions}
// //                 valueStyle={{ color: "#52c41a" }}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={12}>
// //             <Card>
// //               <Statistic
// //                 title="Rejected Prescriptions"
// //                 value={summary.rejectedPrescriptions}
// //                 valueStyle={{ color: "#f5222d" }}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={12}>
// //             <Card>
// //               <Statistic
// //                 title="Average Processing Time"
// //                 value={summary.averageProcessingTime}
// //               />
// //             </Card>
// //           </Col>
// //         </Row>

// //         <Tabs defaultActiveKey="status" className="mb-6">
// //           <TabPane tab="Status Overview" key="status">
// //             <Card title="Prescription Status Distribution">
// //               <Row gutter={16}>
// //                 <Col xs={24} lg={12}>
// //                   <ResponsiveContainer width="100%" height={300}>
// //                     <PieChart>
// //                       <Pie
// //                         dataKey="value"
// //                         isAnimationActive={false}
// //                         data={statusData}
// //                         cx="50%"
// //                         cy="50%"
// //                         outerRadius={100}
// //                         fill="#8884d8"
// //                         label={({ name, percent }) =>
// //                           `${name} ${(percent * 100).toFixed(0)}%`
// //                         }
// //                       >
// //                         {statusData.map((entry, index) => (
// //                           <Cell
// //                             key={`cell-${index}`}
// //                             fill={COLORS[index % COLORS.length]}
// //                           />
// //                         ))}
// //                       </Pie>
// //                       <Tooltip />
// //                     </PieChart>
// //                   </ResponsiveContainer>
// //                 </Col>
// //                 <Col xs={24} lg={12}>
// //                   <Table
// //                     columns={[
// //                       { title: "Status", dataIndex: "name", key: "name" },
// //                       { title: "Count", dataIndex: "value", key: "value" },
// //                       {
// //                         title: "Percentage",
// //                         key: "percentage",
// //                         render: (_, record) => {
// //                           const total = statusData.reduce(
// //                             (sum, item) => sum + item.value,
// //                             0
// //                           );
// //                           return `${((record.value / total) * 100).toFixed(
// //                             1
// //                           )}%`;
// //                         },
// //                       },
// //                     ]}
// //                     dataSource={statusData}
// //                     rowKey="name"
// //                     pagination={false}
// //                   />
// //                 </Col>
// //               </Row>
// //             </Card>
// //           </TabPane>
// //           <TabPane tab="Recent Prescriptions" key="recent">
// //             <Card title="Recent Prescription Orders">
// //               <Table
// //                 columns={[
// //                   { title: "ID", dataIndex: "id", key: "id" },
// //                   { title: "Customer", dataIndex: "customer", key: "customer" },
// //                   {
// //                     title: "Status",
// //                     dataIndex: "status",
// //                     key: "status",
// //                     render: (status) => {
// //                       let color = "blue";
// //                       if (status === "Completed") color = "green";
// //                       if (status === "Rejected") color = "red";
// //                       if (status === "Pending") color = "orange";
// //                       return <Tag color={color}>{status}</Tag>;
// //                     },
// //                   },
// //                   {
// //                     title: "Date",
// //                     dataIndex: "date",
// //                     key: "date",
// //                     sorter: (a, b) =>
// //                       moment(a.date).unix() - moment(b.date).unix(),
// //                   },
// //                   { title: "Items", dataIndex: "items", key: "items" },
// //                   {
// //                     title: "Value",
// //                     dataIndex: "value",
// //                     key: "value",
// //                     render: (value) => `Rs. ${value.toLocaleString()}`,
// //                   },
// //                 ]}
// //                 dataSource={recentPrescriptions}
// //                 rowKey="id"
// //                 pagination={{ pageSize: 5 }}
// //               />
// //             </Card>
// //           </TabPane>
// //           <TabPane tab="Processing Timeline" key="timeline">
// //             <Card title="Prescription Processing Timeline">
// //               <ResponsiveContainer width="100%" height={300}>
// //                 <BarChart
// //                   data={timelineData}
// //                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
// //                 >
// //                   <CartesianGrid strokeDasharray="3 3" />
// //                   <XAxis dataKey="status" />
// //                   <YAxis />
// //                   <Tooltip />
// //                   <Legend />
// //                   <Bar
// //                     dataKey="count"
// //                     name="Number of Prescriptions"
// //                     fill="#8884d8"
// //                   />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </Card>
// //           </TabPane>
// //         </Tabs>
// //       </div>
// //     );
// //   };

// //   const renderSupplierReport = () => {
// //     const { summary, supplierData, deliveryPerformance, productCategories } =
// //       reportData;

// //     return (
// //       <div>
// //         <Row gutter={[16, 16]} className="mb-6">
// //           <Col xs={24} sm={12} md={6}>
// //             <Card>
// //               <Statistic
// //                 title="Total Suppliers"
// //                 value={summary.totalSuppliers}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={6}>
// //             <Card>
// //               <Statistic
// //                 title="Active Suppliers"
// //                 value={summary.activeSuppliers}
// //                 valueStyle={{ color: "#52c41a" }}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={6}>
// //             <Card>
// //               <Statistic
// //                 title="Total Purchases"
// //                 value={`Rs. ${summary.totalPurchases.toLocaleString()}`}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={6}>
// //             <Card>
// //               <Statistic
// //                 title="Avg. Delivery Time"
// //                 value={summary.averageDeliveryTime}
// //               />
// //             </Card>
// //           </Col>
// //         </Row>

// //         <Tabs defaultActiveKey="performance" className="mb-6">
// //           <TabPane tab="Supplier Performance" key="performance">
// //             <Card title="Top Suppliers by Order Value">
// //               <Table
// //                 columns={[
// //                   { title: "Supplier", dataIndex: "name", key: "name" },
// //                   { title: "Orders", dataIndex: "orders", key: "orders" },
// //                   {
// //                     title: "Purchase Value",
// //                     dataIndex: "value",
// //                     key: "value",
// //                     render: (value) => `Rs. ${value.toLocaleString()}`,
// //                   },
// //                   {
// //                     title: "On-Time Delivery",
// //                     key: "onTimePercent",
// //                     render: (_, record) => {
// //                       const percent = (record.onTime / record.orders) * 100;
// //                       return (
// //                         <span
// //                           style={{
// //                             color:
// //                               percent >= 90
// //                                 ? "#52c41a"
// //                                 : percent >= 75
// //                                 ? "#faad14"
// //                                 : "#f5222d",
// //                           }}
// //                         >
// //                           {percent.toFixed(1)}% ({record.onTime}/{record.orders}
// //                           )
// //                         </span>
// //                       );
// //                     },
// //                   },
// //                   {
// //                     title: "Delayed",
// //                     dataIndex: "delayed",
// //                     key: "delayed",
// //                     render: (value, record) => (
// //                       <span
// //                         style={{ color: value > 0 ? "#f5222d" : "#52c41a" }}
// //                       >
// //                         {value}
// //                       </span>
// //                     ),
// //                   },
// //                 ]}
// //                 dataSource={supplierData}
// //                 rowKey="name"
// //                 pagination={false}
// //               />
// //             </Card>
// //           </TabPane>
// //           <TabPane tab="Delivery Performance" key="delivery">
// //             <Card title="Supplier Delivery Performance">
// //               <Row gutter={16}>
// //                 <Col xs={24} lg={12}>
// //                   <ResponsiveContainer width="100%" height={300}>
// //                     <PieChart>
// //                       <Pie
// //                         dataKey="value"
// //                         isAnimationActive={false}
// //                         data={deliveryPerformance}
// //                         cx="50%"
// //                         cy="50%"
// //                         outerRadius={100}
// //                         fill="#8884d8"
// //                         label={({ name, percent }) =>
// //                           `${name} ${(percent * 100).toFixed(0)}%`
// //                         }
// //                       >
// //                         <Cell fill="#52c41a" />
// //                         <Cell fill="#f5222d" />
// //                       </Pie>
// //                       <Tooltip />
// //                     </PieChart>
// //                   </ResponsiveContainer>
// //                 </Col>
// //                 <Col xs={24} lg={12}>
// //                   <div className="flex flex-col justify-center h-full">
// //                     <div className="mb-4">
// //                       <Title level={4}>Delivery Performance Summary</Title>
// //                       <Text>
// //                         Total Deliveries:{" "}
// //                         {deliveryPerformance.reduce(
// //                           (sum, item) => sum + item.value,
// //                           0
// //                         )}
// //                       </Text>
// //                     </div>
// //                     <div className="mb-2">
// //                       <Text strong style={{ color: "#52c41a" }}>
// //                         On Time: {deliveryPerformance[0].value} (
// //                         {(
// //                           (deliveryPerformance[0].value /
// //                             (deliveryPerformance[0].value +
// //                               deliveryPerformance[1].value)) *
// //                           100
// //                         ).toFixed(1)}
// //                         %)
// //                       </Text>
// //                     </div>
// //                     <div>
// //                       <Text strong style={{ color: "#f5222d" }}>
// //                         Delayed: {deliveryPerformance[1].value} (
// //                         {(
// //                           (deliveryPerformance[1].value /
// //                             (deliveryPerformance[0].value +
// //                               deliveryPerformance[1].value)) *
// //                           100
// //                         ).toFixed(1)}
// //                         %)
// //                       </Text>
// //                     </div>
// //                   </div>
// //                 </Col>
// //               </Row>
// //             </Card>
// //           </TabPane>
// //           <TabPane tab="Categories" key="categories">
// //             <Card title="Suppliers by Product Category">
// //               <Table
// //                 columns={[
// //                   { title: "Category", dataIndex: "category", key: "category" },
// //                   {
// //                     title: "Suppliers",
// //                     dataIndex: "suppliers",
// //                     key: "suppliers",
// //                   },
// //                   { title: "Products", dataIndex: "products", key: "products" },
// //                   {
// //                     title: "Supplier to Product Ratio",
// //                     key: "ratio",
// //                     render: (_, record) =>
// //                       (record.products / record.suppliers).toFixed(2),
// //                   },
// //                 ]}
// //                 dataSource={productCategories}
// //                 rowKey="category"
// //                 pagination={false}
// //               />
// //             </Card>
// //           </TabPane>
// //         </Tabs>
// //       </div>
// //     );
// //   };

// //   const renderCustomerReport = () => {
// //     const { summary, monthlyData, topCustomers, purchaseFrequency } =
// //       reportData;

// //     return (
// //       <div>
// //         <Row gutter={[16, 16]} className="mb-6">
// //           <Col xs={24} sm={12} md={6}>
// //             <Card>
// //               <Statistic
// //                 title="Total Customers"
// //                 value={summary.totalCustomers}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={6}>
// //             <Card>
// //               <Statistic
// //                 title="New Customers"
// //                 value={summary.newCustomers}
// //                 valueStyle={{ color: "#1890ff" }}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={6}>
// //             <Card>
// //               <Statistic
// //                 title="Active Customers"
// //                 value={summary.activeCustomers}
// //                 valueStyle={{ color: "#52c41a" }}
// //               />
// //             </Card>
// //           </Col>
// //           <Col xs={24} sm={12} md={6}>
// //             <Card>
// //               <Statistic
// //                 title="Repeat Customers"
// //                 value={summary.repeatCustomers}
// //                 valueStyle={{ color: "#722ed1" }}
// //               />
// //             </Card>
// //           </Col>
// //         </Row>

// //         <Tabs defaultActiveKey="trend" className="mb-6">
// //           <TabPane tab="Customer Trend" key="trend">
// //             <Card title="Monthly Customer Activity">
// //               <ResponsiveContainer width="100%" height={300}>
// //                 <BarChart
// //                   data={monthlyData}
// //                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
// //                 >
// //                   <CartesianGrid strokeDasharray="3 3" />
// //                   <XAxis dataKey="month" />
// //                   <YAxis />
// //                   <Tooltip />
// //                   <Legend />
// //                   <Bar
// //                     dataKey="customers"
// //                     name="Active Customers"
// //                     fill="#8884d8"
// //                   />
// //                   <Bar
// //                     dataKey="newCustomers"
// //                     name="New Customers"
// //                     fill="#82ca9d"
// //                   />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </Card>
// //           </TabPane>
// //           <TabPane tab="Top Customers" key="topCustomers">
// //             <Card title="Top Customers by Revenue">
// //               <Table
// //                 columns={[
// //                   { title: "Customer", dataIndex: "name", key: "name" },
// //                   { title: "Orders", dataIndex: "orders", key: "orders" },
// //                   {
// //                     title: "Total Spent",
// //                     dataIndex: "spent",
// //                     key: "spent",
// //                     render: (value) => `Rs. ${value.toLocaleString()}`,
// //                   },
// //                   {
// //                     title: "Average Order Value",
// //                     key: "average",
// //                     render: (_, record) =>
// //                       `Rs. ${(record.spent / record.orders).toLocaleString()}`,
// //                   },
// //                 ]}
// //                 dataSource={topCustomers}
// //                 rowKey="name"
// //                 pagination={false}
// //               />
// //             </Card>
// //           </TabPane>
// //           <TabPane tab="Purchase Frequency" key="frequency">
// //             <Card title="Customer Purchase Frequency">
// //               <Row gutter={16}>
// //                 <Col xs={24} lg={12}>
// //                   <ResponsiveContainer width="100%" height={300}>
// //                     <PieChart>
// //                       <Pie
// //                         dataKey="value"
// //                         isAnimationActive={false}
// //                         data={purchaseFrequency}
// //                         cx="50%"
// //                         cy="50%"
// //                         outerRadius={100}
// //                         fill="#8884d8"
// //                         label={({ name, percent }) =>
// //                           `${name} ${(percent * 100).toFixed(0)}%`
// //                         }
// //                       >
// //                         {purchaseFrequency.map((entry, index) => (
// //                           <Cell
// //                             key={`cell-${index}`}
// //                             fill={COLORS[index % COLORS.length]}
// //                           />
// //                         ))}
// //                       </Pie>
// //                       <Tooltip />
// //                     </PieChart>
// //                   </ResponsiveContainer>
// //                 </Col>
// //                 <Col xs={24} lg={12}>
// //                   <Table
// //                     columns={[
// //                       {
// //                         title: "Purchase Frequency",
// //                         dataIndex: "name",
// //                         key: "name",
// //                       },
// //                       {
// //                         title: "Customer Count",
// //                         dataIndex: "value",
// //                         key: "value",
// //                       },
// //                       {
// //                         title: "Percentage",
// //                         key: "percentage",
// //                         render: (_, record) => {
// //                           const total = purchaseFrequency.reduce(
// //                             (sum, item) => sum + item.value,
// //                             0
// //                           );
// //                           return `${((record.value / total) * 100).toFixed(
// //                             1
// //                           )}%`;
// //                         },
// //                       },
// //                     ]}
// //                     dataSource={purchaseFrequency}
// //                     rowKey="name"
// //                     pagination={false}
// //                   />
// //                 </Col>
// //               </Row>
// //             </Card>
// //           </TabPane>
// //         </Tabs>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="p-6">
// //       <Card className="mb-6">
// //         <div className="flex flex-wrap justify-between items-center">
// //           <Title level={3} className="mb-0">
// //             <FileTextOutlined className="mr-2" /> Pharmacy Reports
// //           </Title>
// //           <div className="flex flex-wrap space-x-4 mt-4 sm:mt-0">
// //             <Select
// //               placeholder="Select report type"
// //               value={reportType}
// //               onChange={setReportType}
// //               style={{ width: 200 }}
// //               className="mb-4 sm:mb-0"
// //             >
// //               <Option value="sales">Sales Report</Option>
// //               <Option value="inventory">Inventory Report</Option>
// //               <Option value="prescription">Prescription Analysis</Option>
// //               <Option value="supplier">Supplier Performance</Option>
// //               <Option value="customer">Customer Analysis</Option>
// //             </Select>

// //             <RangePicker
// //               value={dateRange}
// //               onChange={setDateRange}
// //               className="mb-4 sm:mb-0"
// //             />

// //             <Button
// //               type="primary"
// //               icon={<DownloadOutlined />}
// //               onClick={handleExportPDF}
// //               loading={exportLoading}
// //             >
// //               Export PDF
// //             </Button>
// //           </div>
// //         </div>
// //       </Card>

// //       {loading ? (
// //         <div className="flex justify-center items-center py-20">
// //           <Spin size="large" />
// //           <span className="ml-2">Loading report data...</span>
// //         </div>
// //       ) : (
// //         <Card>
// //           <Title level={4}>{reportData?.title}</Title>
// //           <div className="mt-4">{renderReportContent()}</div>
// //         </Card>
// //       )}
// //     </div>
// //   );
// // };

// // export default ReportGenerator;

// import React, { useState } from "react";
// import { Card, Tabs, Typography, Divider, Space } from "antd";
// import {
//   LineChartOutlined,
//   DropboxOutlined,
//   FileTextOutlined,
//   DollarOutlined,
//   ShoppingOutlined,
//   TagsOutlined,
// } from "@ant-design/icons";
// import SalesReportPage from "../components/SalesReport";
// import InventoryReportPage from "../components/InventoryReport";

// const { Title, Text } = Typography;
// const { TabPane } = Tabs;

// const ReportsPage = () => {
//   const [activeTab, setActiveTab] = useState("1");

//   const handleTabChange = (key) => {
//     setActiveTab(key);
//   };

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <Title level={3}>Reports Dashboard</Title>
//         {/* <Text className="text-gray-500">
//           View and generate reports for sales and inventory management
//         </Text> */}
//       </div>

//       <Tabs
//         defaultActiveKey="1"
//         onChange={handleTabChange}
//         tabPosition="top"
//         className="reports-tabs"
//         type="card"
//       >
//         <TabPane
//           tab={
//             <span>
//               <DollarOutlined />
//               Sales Reports
//             </span>
//           }
//           key="1"
//         >
//           <SalesReportPage />
//         </TabPane>

//         <TabPane
//           tab={
//             <span>
//               <DropboxOutlined />
//               Inventory Reports
//             </span>
//           }
//           key="2"
//         >
//           <InventoryReportPage />
//         </TabPane>
//       </Tabs>

//       {/* Information Cards Section */}
//       {/* <div className="mt-8">
//         <Divider>
//           <span className="text-gray-500">
//             <FileTextOutlined /> Report Guide
//           </span>
//         </Divider>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//           <Card
//             title={
//               <>
//                 <DollarOutlined /> Sales Reports
//               </>
//             }
//             className="h-full shadow-sm"
//           >
//             <p className="text-gray-600 mb-3">
//               Track your pharmacy's financial performance with comprehensive
//               sales reports. View sales data by day, week, month, or year.
//             </p>
//             <ul className="list-disc pl-5 text-gray-600">
//               <li>Order history and payment methods</li>
//               <li>Sales trends over time</li>
//               <li>Revenue by product categories</li>
//               <li>Export reports as PDF</li>
//             </ul>
//           </Card>

//           <Card
//             title={
//               <>
//                 <DropboxOutlined /> Inventory Reports
//               </>
//             }
//             className="h-full shadow-sm"
//           >
//             <p className="text-gray-600 mb-3">
//               Monitor your pharmacy's stock levels, expiring products, and
//               inventory value with detailed inventory reports.
//             </p>
//             <ul className="list-disc pl-5 text-gray-600">
//               <li>Low stock alerts and reorder lists</li>
//               <li>Expiry tracking and management</li>
//               <li>Inventory valuation</li>
//               <li>Export reports as PDF</li>
//             </ul>
//           </Card>

//           <Card
//             title={
//               <>
//                 <ShoppingOutlined /> Usage Tips
//               </>
//             }
//             className="h-full shadow-sm"
//           >
//             <p className="text-gray-600 mb-3">
//               Make the most of your reports with these helpful tips:
//             </p>
//             <ul className="list-disc pl-5 text-gray-600">
//               <li>Use filters to narrow down results</li>
//               <li>Export reports for meetings and record-keeping</li>
//               <li>Schedule regular inventory checks based on reports</li>
//               <li>Use date ranges to compare performance</li>
//             </ul>
//           </Card>
//         </div>
//       </div>  */}

//       {/* Print Tips Section */}
//       {/* <div className="mt-8 bg-blue-50 p-4 rounded-md">
//         <div className="flex items-start">
//           <FileTextOutlined className="text-blue-500 text-lg mr-3 mt-1" />
//           <div>
//             <Title level={5} className="text-blue-700 m-0">
//               Printing Tips
//             </Title>
//             <p className="text-blue-700 mb-2">
//               When printing reports, follow these guidelines for best results:
//             </p>
//             <ul className="list-disc pl-5 text-blue-700">
//               <li>
//                 Set page orientation to Landscape for tables with many columns
//               </li>
//               <li>
//                 Enable "Background Graphics" in your browser's print settings to
//                 include colors and icons
//               </li>
//               <li>
//                 For detailed reports, consider using the "Export PDF" option for
//                 better formatting
//               </li>
//               <li>
//                 Check "Print headers" in your browser to include page numbers
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default ReportsPage;

import React, { useState } from "react";
import { Card, Tabs, Typography } from "antd";
import { LineChartOutlined, DropboxOutlined } from "@ant-design/icons";
import SalesReportPage from "../components/SalesReport";
import InventoryReportPage from "../components/InventoryReport";

const { Title } = Typography;
const { TabPane } = Tabs;

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={3}>Reports Dashboard</Title>
      </div>

      <Tabs
        defaultActiveKey="1"
        onChange={handleTabChange}
        tabPosition="top"
        className="reports-tabs"
        type="card"
      >
        <TabPane
          tab={
            <span>
              <LineChartOutlined />
              Sales Reports
            </span>
          }
          key="1"
        >
          <SalesReportPage />
        </TabPane>

        {/* <TabPane
          tab={
            <span>
              <DropboxOutlined />
              Inventory Reports
            </span>
          }
          key="2"
        >
          <InventoryReportPage />
        </TabPane> */}
      </Tabs>
    </div>
  );
};

export default ReportsPage;
