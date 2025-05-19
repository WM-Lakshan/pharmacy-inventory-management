// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Card,
// // //   Table,
// // //   DatePicker,
// // //   Button,
// // //   Select,
// // //   Typography,
// // //   Space,
// // //   Divider,
// // //   Spin,
// // //   message,
// // //   Form,
// // //   Input,
// // // } from "antd";
// // // import {
// // //   FilePdfOutlined,
// // //   PrinterOutlined,
// // //   DownloadOutlined,
// // //   SearchOutlined,
// // //   ReloadOutlined,
// // // } from "@ant-design/icons";
// // // import axios from "axios";
// // // //import { getUserId } from "../auth";

// // // const { Title, Text } = Typography;
// // // const { RangePicker } = DatePicker;
// // // const { Option } = Select;

// // // const SalesReportPage = () => {
// // //   const [salesData, setSalesData] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [dateRange, setDateRange] = useState([null, null]);
// // //   const [reportType, setReportType] = useState("daily");
// // //   const [exportingPdf, setExportingPdf] = useState(false);
// // //   const [searchValue, setSearchValue] = useState("");
// // //   const [totals, setTotals] = useState({
// // //     totalSales: 0,
// // //     totalOrders: 0,
// // //     averageOrderValue: 0,
// // //   });

// // //   useEffect(() => {
// // //     fetchSalesData();
// // //   }, [reportType]);

// // //   const fetchSalesData = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const token = localStorage.getItem("token");
// // //       const managerId = getUserId();

// // //       if (!token || !managerId) {
// // //         message.error("Authentication required");
// // //         return;
// // //       }

// // //       let endpoint = "/api/reports/sales";

// // //       // Add query parameters
// // //       const params = {
// // //         type: reportType,
// // //         managerId,
// // //       };

// // //       // Add date range if selected
// // //       if (dateRange[0] && dateRange[1]) {
// // //         params.startDate = dateRange[0].format("YYYY-MM-DD");
// // //         params.endDate = dateRange[1].format("YYYY-MM-DD");
// // //       }

// // //       const response = await axios.get(endpoint, {
// // //         params,
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });

// // //       if (response.data.success) {
// // //         const formattedData = response.data.sales.map((sale, index) => ({
// // //           ...sale,
// // //           key: sale.cus_oder_id || index,
// // //         }));

// // //         setSalesData(formattedData);

// // //         // Calculate totals
// // //         const totalSales = formattedData.reduce(
// // //           (sum, item) => sum + (item.value || 0),
// // //           0
// // //         );
// // //         const totalOrders = formattedData.length;
// // //         const averageOrderValue =
// // //           totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

// // //         setTotals({
// // //           totalSales,
// // //           totalOrders,
// // //           averageOrderValue,
// // //         });
// // //       } else {
// // //         message.error(response.data.message || "Failed to fetch sales data");
// // //         setMockData(); // For development
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching sales data:", error);
// // //       message.error("Failed to load sales data");
// // //       setMockData(); // For development
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Mock data for development
// // //   const setMockData = () => {
// // //     const mockData = Array.from({ length: 20 }, (_, i) => ({
// // //       key: i,
// // //       cus_oder_id: 10000 + i,
// // //       date: new Date(
// // //         Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
// // //       )
// // //         .toISOString()
// // //         .split("T")[0],
// // //       customer_name: `Customer ${i + 1}`,
// // //       value: Math.floor(Math.random() * 5000) + 500,
// // //       status: ["Completed", "Processing", "Delivered"][
// // //         Math.floor(Math.random() * 3)
// // //       ],
// // //       payment_method: ["Cash", "Credit Card", "Online"][
// // //         Math.floor(Math.random() * 3)
// // //       ],
// // //       items_count: Math.floor(Math.random() * 10) + 1,
// // //     }));

// // //     setSalesData(mockData);

// // //     // Calculate mock totals
// // //     const totalSales = mockData.reduce((sum, item) => sum + item.value, 0);
// // //     const totalOrders = mockData.length;
// // //     const averageOrderValue = (totalSales / totalOrders).toFixed(2);

// // //     setTotals({
// // //       totalSales,
// // //       totalOrders,
// // //       averageOrderValue,
// // //     });
// // //   };

// // //   const handleDateRangeChange = (dates) => {
// // //     setDateRange(dates);
// // //   };

// // //   const handleSearch = () => {
// // //     fetchSalesData();
// // //   };

// // //   const handleReportTypeChange = (value) => {
// // //     setReportType(value);
// // //   };

// // //   const handleExportPDF = async () => {
// // //     setExportingPdf(true);
// // //     try {
// // //       const token = localStorage.getItem("token");
// // //       const managerId = getUserId();

// // //       if (!token || !managerId) {
// // //         message.error("Authentication required");
// // //         return;
// // //       }

// // //       let endpoint = "/api/reports/sales/export-pdf";

// // //       // Add query parameters
// // //       const params = {
// // //         type: reportType,
// // //         managerId,
// // //         format: "pdf",
// // //       };

// // //       // Add date range if selected
// // //       if (dateRange[0] && dateRange[1]) {
// // //         params.startDate = dateRange[0].format("YYYY-MM-DD");
// // //         params.endDate = dateRange[1].format("YYYY-MM-DD");
// // //       }

// // //       const response = await axios.get(endpoint, {
// // //         params,
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           "Content-Type": "application/json",
// // //         },
// // //         responseType: "blob",
// // //       });

// // //       // Create a blob from the PDF data
// // //       const blob = new Blob([response.data], { type: "application/pdf" });

// // //       // Create a link element, set the download attribute and click it
// // //       const link = document.createElement("a");
// // //       link.href = URL.createObjectURL(blob);
// // //       link.download = `sales_report_${reportType}_${
// // //         new Date().toISOString().split("T")[0]
// // //       }.pdf`;
// // //       document.body.appendChild(link);
// // //       link.click();
// // //       document.body.removeChild(link);

// // //       message.success("PDF exported successfully");
// // //     } catch (error) {
// // //       console.error("Error exporting PDF:", error);
// // //       message.error("Failed to export PDF");
// // //     } finally {
// // //       setExportingPdf(false);
// // //     }
// // //   };

// // //   const handlePrint = () => {
// // //     window.print();
// // //   };

// // //   // Filter data based on search input
// // //   const filteredData = salesData.filter((record) => {
// // //     if (!searchValue) return true;

// // //     const searchLower = searchValue.toLowerCase();
// // //     return (
// // //       (record.cus_oder_id &&
// // //         record.cus_oder_id.toString().includes(searchLower)) ||
// // //       (record.customer_name &&
// // //         record.customer_name.toLowerCase().includes(searchLower)) ||
// // //       (record.status && record.status.toLowerCase().includes(searchLower))
// // //     );
// // //   });

// // //   const columns = [
// // //     {
// // //       title: "Order ID",
// // //       dataIndex: "cus_oder_id",
// // //       key: "cus_oder_id",
// // //       sorter: (a, b) => a.cus_oder_id - b.cus_oder_id,
// // //     },
// // //     {
// // //       title: "Date",
// // //       dataIndex: "date",
// // //       key: "date",
// // //       sorter: (a, b) => new Date(a.date) - new Date(b.date),
// // //     },
// // //     {
// // //       title: "Customer",
// // //       dataIndex: "customer_name",
// // //       key: "customer_name",
// // //     },
// // //     {
// // //       title: "Items",
// // //       dataIndex: "items_count",
// // //       key: "items_count",
// // //       sorter: (a, b) => a.items_count - b.items_count,
// // //     },
// // //     {
// // //       title: "Payment Method",
// // //       dataIndex: "payment_method",
// // //       key: "payment_method",
// // //     },
// // //     {
// // //       title: "Status",
// // //       dataIndex: "status",
// // //       key: "status",
// // //       render: (status) => {
// // //         let color = "blue";
// // //         if (status === "Completed" || status === "Delivered") color = "green";
// // //         if (status === "Cancelled") color = "red";
// // //         if (status === "Processing") color = "gold";

// // //         return <span style={{ color }}>{status}</span>;
// // //       },
// // //     },
// // //     {
// // //       title: "Amount (Rs.)",
// // //       dataIndex: "value",
// // //       key: "value",
// // //       sorter: (a, b) => a.value - b.value,
// // //       render: (value) => `Rs. ${value?.toLocaleString() || 0}`,
// // //     },
// // //   ];

// // //   return (
// // //     <div className="p-6">
// // //       <Card className="shadow-sm">
// // //         <div className="flex justify-between items-center mb-6">
// // //           <Title level={4}>Sales Report</Title>
// // //           <Space>
// // //             <Button
// // //               type="primary"
// // //               icon={<FilePdfOutlined />}
// // //               onClick={handleExportPDF}
// // //               loading={exportingPdf}
// // //               className="bg-blue-500 hover:bg-blue-600"
// // //             >
// // //               Export PDF
// // //             </Button>
// // //             <Button icon={<PrinterOutlined />} onClick={handlePrint}>
// // //               Print
// // //             </Button>
// // //           </Space>
// // //         </div>

// // //         <div className="flex flex-wrap gap-4 mb-6">
// // //           <Form layout="inline">
// // //             <Form.Item label="Report Type">
// // //               <Select
// // //                 value={reportType}
// // //                 onChange={handleReportTypeChange}
// // //                 style={{ width: 150 }}
// // //               >
// // //                 <Option value="daily">Daily</Option>
// // //                 <Option value="weekly">Weekly</Option>
// // //                 <Option value="monthly">Monthly</Option>
// // //                 <Option value="yearly">Yearly</Option>
// // //               </Select>
// // //             </Form.Item>

// // //             <Form.Item label="Date Range">
// // //               <RangePicker onChange={handleDateRangeChange} value={dateRange} />
// // //             </Form.Item>

// // //             <Form.Item>
// // //               <Input
// // //                 placeholder="Search orders..."
// // //                 value={searchValue}
// // //                 onChange={(e) => setSearchValue(e.target.value)}
// // //                 prefix={<SearchOutlined className="text-gray-400" />}
// // //                 allowClear
// // //               />
// // //             </Form.Item>

// // //             <Form.Item>
// // //               <Button
// // //                 type="primary"
// // //                 onClick={handleSearch}
// // //                 icon={<ReloadOutlined />}
// // //                 className="bg-blue-500 hover:bg-blue-600"
// // //               >
// // //                 Refresh
// // //               </Button>
// // //             </Form.Item>
// // //           </Form>
// // //         </div>

// // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
// // //           <Card className="bg-blue-50 border-blue-200">
// // //             <div className="text-center">
// // //               <Text type="secondary">Total Sales</Text>
// // //               <div className="text-2xl font-bold text-blue-600 mt-1">
// // //                 Rs. {totals.totalSales.toLocaleString()}
// // //               </div>
// // //             </div>
// // //           </Card>

// // //           <Card className="bg-green-50 border-green-200">
// // //             <div className="text-center">
// // //               <Text type="secondary">Total Orders</Text>
// // //               <div className="text-2xl font-bold text-green-600 mt-1">
// // //                 {totals.totalOrders}
// // //               </div>
// // //             </div>
// // //           </Card>

// // //           <Card className="bg-purple-50 border-purple-200">
// // //             <div className="text-center">
// // //               <Text type="secondary">Average Order Value</Text>
// // //               <div className="text-2xl font-bold text-purple-600 mt-1">
// // //                 Rs. {totals.averageOrderValue}
// // //               </div>
// // //             </div>
// // //           </Card>
// // //         </div>

// // //         <Divider className="my-6" />

// // //         <div className="overflow-x-auto">
// // //           <Table
// // //             columns={columns}
// // //             dataSource={filteredData}
// // //             loading={loading}
// // //             pagination={{ pageSize: 10 }}
// // //             bordered
// // //             size="middle"
// // //             className="print-table"
// // //             summary={(pageData) => {
// // //               if (pageData.length === 0) return null;

// // //               const pageTotal = pageData.reduce(
// // //                 (sum, item) => sum + (item.value || 0),
// // //                 0
// // //               );

// // //               return (
// // //                 <>
// // //                   <Table.Summary.Row>
// // //                     <Table.Summary.Cell
// // //                       index={0}
// // //                       colSpan={6}
// // //                       className="text-right font-bold"
// // //                     >
// // //                       Page Total:
// // //                     </Table.Summary.Cell>
// // //                     <Table.Summary.Cell index={1} className="font-bold">
// // //                       Rs. {pageTotal.toLocaleString()}
// // //                     </Table.Summary.Cell>
// // //                   </Table.Summary.Row>
// // //                   <Table.Summary.Row>
// // //                     <Table.Summary.Cell
// // //                       index={0}
// // //                       colSpan={6}
// // //                       className="text-right font-bold"
// // //                     >
// // //                       Grand Total:
// // //                     </Table.Summary.Cell>
// // //                     <Table.Summary.Cell index={1} className="font-bold">
// // //                       Rs. {totals.totalSales.toLocaleString()}
// // //                     </Table.Summary.Cell>
// // //                   </Table.Summary.Row>
// // //                 </>
// // //               );
// // //             }}
// // //           />
// // //         </div>
// // //       </Card>
// // //     </div>
// // //   );
// // // };

// // // export default SalesReportPage;

// // import React, { useState, useEffect } from "react";
// // import {
// //   Card,
// //   Table,
// //   DatePicker,
// //   Button,
// //   Select,
// //   Typography,
// //   Space,
// //   Divider,
// //   message,
// //   Form,
// //   Input,
// // } from "antd";
// // import {
// //   FilePdfOutlined,
// //   //   PrinterOutlined,
// //   SearchOutlined,
// //   ReloadOutlined,
// // } from "@ant-design/icons";
// // import axios from "axios";

// // const { Title, Text } = Typography;
// // const { RangePicker } = DatePicker;
// // const { Option } = Select;

// // const SalesReportPage = () => {
// //   const [formState, setFormState] = useState({
// //     startDate: null,
// //     endDate: null,
// //     reportType: "daily",
// //   });
// //   const [salesData, setSalesData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [dateRange, setDateRange] = useState([null, null]);
// //   const [reportType, setReportType] = useState("daily");
// //   const [exportingPdf, setExportingPdf] = useState(false);
// //   const [searchValue, setSearchValue] = useState("");
// //   const [totals, setTotals] = useState({
// //     totalSales: 0,
// //     totalOrders: 0,
// //     averageOrderValue: 0,
// //   });

// //   useEffect(() => {
// //     fetchSalesData();
// //   }, [reportType]);

// //   const fetchSalesData = async () => {
// //     setLoading(true);
// //     try {
// //       const token = localStorage.getItem("token");

// //       if (!token) {
// //         message.error("Authentication required");
// //         return;
// //       }

// //       let endpoint = "/api/reports/sales";
// //       const params = { type: reportType };

// //       if (dateRange[0] && dateRange[1]) {
// //         params.startDate = dateRange[0].format("YYYY-MM-DD");
// //         params.endDate = dateRange[1].format("YYYY-MM-DD");
// //       }

// //       const response = await axios.get(endpoint, {
// //         params,
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (response.data.success) {
// //         const formattedData = response.data.sales.map((sale, index) => ({
// //           ...sale,
// //           key: sale.cus_oder_id || index,
// //         }));

// //         setSalesData(formattedData);

// //         const totalSales = formattedData.reduce(
// //           (sum, item) => sum + (item.value || 0),
// //           0
// //         );
// //         const totalOrders = formattedData.length;
// //         const averageOrderValue =
// //           totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

// //         setTotals({
// //           totalSales,
// //           totalOrders,
// //           averageOrderValue,
// //         });
// //       } else {
// //         message.error(response.data.message || "Failed to fetch sales data");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching sales data:", error);
// //       message.error(
// //         error.response?.data?.message || "Failed to load sales data"
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDateRangeChange = (dates) => {
// //     setDateRange(dates);
// //   };

// //   const handleSearch = () => {
// //     fetchSalesData();
// //   };

// //   // const handleReportTypeChange = (value) => {
// //   //   setReportType(value);
// //   // };

// //   const handleDateChange = (dates) => {
// //     setFormState({
// //       ...formState,
// //       startDate: dates ? dates[0] : null,
// //       endDate: dates ? dates[1] : null,
// //     });
// //   };

// //   const handleReportTypeChange = (value) => {
// //     setFormState({
// //       ...formState,
// //       reportType: value,
// //     });
// //   };

// //   const handleExportPDF = async () => {
// //     try {
// //       setLoading(true);

// //       // Destructure from formState
// //       const { startDate, endDate, reportType } = formState;

// //       if (!startDate || !endDate) {
// //         message.error("Please select both start and end dates");
// //         return;
// //       }

// //       const response = await axios.get("/api/reports/sales/export-pdf", {
// //         params: {
// //           type: reportType,
// //           startDate: startDate.format("YYYY-MM-DD"),
// //           endDate: endDate.format("YYYY-MM-DD"),
// //           format: "pdf",
// //         },
// //         responseType: "blob",
// //       });

// //       const url = window.URL.createObjectURL(new Blob([response.data]));
// //       const link = document.createElement("a");
// //       link.href = url;
// //       link.setAttribute(
// //         "download",
// //         `sales_report_${reportType}_${startDate.format(
// //           "YYYY-MM-DD"
// //         )}_to_${endDate.format("YYYY-MM-DD")}.pdf`
// //       );
// //       document.body.appendChild(link);
// //       link.click();

// //       setTimeout(() => {
// //         document.body.removeChild(link);
// //         window.URL.revokeObjectURL(url);
// //         message.success("PDF exported successfully");
// //       }, 100);
// //     } catch (error) {
// //       console.error("Error exporting PDF:", error);
// //       if (error.response?.status === 400) {
// //         message.error(
// //           error.response.data?.message || "Invalid request parameters"
// //         );
// //       } else {
// //         message.error("Failed to export PDF. Please try again.");
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   //   const handlePrint = () => {
// //   //     window.print();
// //   //   };
// //     try {
// //       // Get your date range values from state/form
// //       const { startDate, endDate, reportType } = formState;

// //       if (!startDate || !endDate) {
// //         message.error("Please select both start and end dates");
// //         return;
// //       }

// //       // Make the request with proper params
// //       const response = await axios.get("/api/reports/sales/export-pdf", {
// //         params: {
// //           type: reportType,
// //           startDate: startDate.format("YYYY-MM-DD"),
// //           endDate: endDate.format("YYYY-MM-DD"),
// //           format: "pdf",
// //         },
// //         responseType: "blob", // Important for file downloads
// //       });

// //       // Create download link
// //       const url = window.URL.createObjectURL(new Blob([response.data]));
// //       const link = document.createElement("a");
// //       link.href = url;
// //       link.setAttribute(
// //         "download",
// //         `sales_report_${reportType}_${startDate.format(
// //           "YYYY-MM-DD"
// //         )}_to_${endDate.format("YYYY-MM-DD")}.pdf`
// //       );
// //       document.body.appendChild(link);
// //       link.click();

// //       // Cleanup
// //       setTimeout(() => {
// //         document.body.removeChild(link);
// //         window.URL.revokeObjectURL(url);
// //         message.success("PDF exported successfully");
// //       }, 100);
// //     } catch (error) {
// //       console.error("Error exporting PDF:", error);

// //       // Handle 400 Bad Request specifically
// //       if (error.response?.status === 400) {
// //         message.error(
// //           error.response.data?.message || "Invalid request parameters"
// //         );
// //       } else {
// //         message.error("Failed to export PDF. Please try again.");
// //       }
// //     }
// //   };

// //   const filteredData = salesData.filter((record) => {
// //     if (!searchValue) return true;
// //     const searchLower = searchValue.toLowerCase();
// //     return (
// //       (record.cus_oder_id &&
// //         record.cus_oder_id.toString().includes(searchLower)) ||
// //       (record.customer_name &&
// //         record.customer_name.toLowerCase().includes(searchLower)) ||
// //       (record.status && record.status.toLowerCase().includes(searchLower))
// //     );
// //   });

// //   const columns = [
// //     {
// //       title: "Order ID",
// //       dataIndex: "cus_oder_id",
// //       key: "cus_oder_id",
// //       sorter: (a, b) => a.cus_oder_id - b.cus_oder_id,
// //     },
// //     {
// //       title: "Date",
// //       dataIndex: "date",
// //       key: "date",
// //       sorter: (a, b) => new Date(a.date) - new Date(b.date),
// //     },
// //     {
// //       title: "Customer",
// //       dataIndex: "customer_name",
// //       key: "customer_name",
// //     },
// //     {
// //       title: "Items",
// //       dataIndex: "items_count",
// //       key: "items_count",
// //       sorter: (a, b) => a.items_count - b.items_count,
// //     },
// //     {
// //       title: "Payment Method",
// //       dataIndex: "payment_method",
// //       key: "payment_method",
// //     },
// //     {
// //       title: "Status",
// //       dataIndex: "status",
// //       key: "status",
// //       render: (status) => {
// //         let color = "blue";
// //         if (status === "Completed" || status === "Delivered") color = "green";
// //         if (status === "Cancelled") color = "red";
// //         if (status === "Processing") color = "gold";
// //         return <span style={{ color }}>{status}</span>;
// //       },
// //     },
// //     {
// //       title: "Amount (Rs.)",
// //       dataIndex: "value",
// //       key: "value",
// //       sorter: (a, b) => a.value - b.value,
// //       render: (value) => `Rs. ${value?.toLocaleString() || 0}`,
// //     },
// //   ];

// //   return (
// //     <div className="p-6">
// //       <Card className="shadow-sm">
// //         <div className="flex justify-between items-center mb-6">
// //           <Title level={4}>Sales Report</Title>
// //           <Space>
// //            <Button
// //         type="primary"
// //         icon={<FilePdfOutlined />}
// //         onClick={handleExportPDF}
// //         loading={loading}
// //       >
// //         Export PDF
// //       </Button>
// //             {/* <Button icon={<PrinterOutlined />} onClick={handlePrint}>
// //               Print
// //             </Button> */}
// //           </Space>
// //         </div>

// //         <div className="flex flex-wrap gap-4 mb-6">
// //           <Form layout="inline">
// //             <Form.Item label="Report Type">
// //               <Select
// //                 value={reportType}
// //                 onChange={handleReportTypeChange}
// //                 style={{ width: 150 }}
// //               >
// //                 <Option value="daily">Daily</Option>
// //                 <Option value="weekly">Weekly</Option>
// //                 <Option value="monthly">Monthly</Option>
// //                 <Option value="yearly">Yearly</Option>
// //               </Select>
// //             </Form.Item>

// //             <Form.Item label="Date Range">
// //               <RangePicker onChange={handleDateRangeChange} value={dateRange} />
// //             </Form.Item>

// //             <Form.Item>
// //               <Input
// //                 placeholder="Search orders..."
// //                 value={searchValue}
// //                 onChange={(e) => setSearchValue(e.target.value)}
// //                 prefix={<SearchOutlined className="text-gray-400" />}
// //                 allowClear
// //               />
// //             </Form.Item>

// //             <Form.Item>
// //               <Button
// //                 type="primary"
// //                 onClick={handleSearch}
// //                 icon={<ReloadOutlined />}
// //                 className="bg-blue-500 hover:bg-blue-600"
// //               >
// //                 Refresh
// //               </Button>
// //             </Form.Item>
// //           </Form>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
// //           <Card className="bg-blue-50 border-blue-200">
// //             <div className="text-center">
// //               <Text type="secondary">Total Sales</Text>
// //               <div className="text-2xl font-bold text-blue-600 mt-1">
// //                 Rs. {totals.totalSales.toLocaleString()}
// //               </div>
// //             </div>
// //           </Card>

// //           <Card className="bg-green-50 border-green-200">
// //             <div className="text-center">
// //               <Text type="secondary">Total Orders</Text>
// //               <div className="text-2xl font-bold text-green-600 mt-1">
// //                 {totals.totalOrders}
// //               </div>
// //             </div>
// //           </Card>

// //           <Card className="bg-purple-50 border-purple-200">
// //             <div className="text-center">
// //               <Text type="secondary">Average Order Value</Text>
// //               <div className="text-2xl font-bold text-purple-600 mt-1">
// //                 Rs. {totals.averageOrderValue}
// //               </div>
// //             </div>
// //           </Card>
// //         </div>

// //         <Divider className="my-6" />

// //         <div className="overflow-x-auto">
// //           <Table
// //             columns={columns}
// //             dataSource={filteredData}
// //             loading={loading}
// //             pagination={{ pageSize: 10 }}
// //             bordered
// //             size="middle"
// //             className="print-table"
// //             summary={(pageData) => {
// //               if (pageData.length === 0) return null;

// //               const pageTotal = pageData.reduce(
// //                 (sum, item) => sum + (item.value || 0),
// //                 0
// //               );

// //               return (
// //                 <>
// //                   <Table.Summary.Row>
// //                     <Table.Summary.Cell
// //                       index={0}
// //                       colSpan={6}
// //                       className="text-right font-bold"
// //                     >
// //                       Page Total:
// //                     </Table.Summary.Cell>
// //                     <Table.Summary.Cell index={1} className="font-bold">
// //                       Rs. {pageTotal.toLocaleString()}
// //                     </Table.Summary.Cell>
// //                   </Table.Summary.Row>
// //                   <Table.Summary.Row>
// //                     <Table.Summary.Cell
// //                       index={0}
// //                       colSpan={6}
// //                       className="text-right font-bold"
// //                     >
// //                       Grand Total:
// //                     </Table.Summary.Cell>
// //                     <Table.Summary.Cell index={1} className="font-bold">
// //                       Rs. {totals.totalSales.toLocaleString()}
// //                     </Table.Summary.Cell>
// //                   </Table.Summary.Row>
// //                 </>
// //               );
// //             }}
// //           />
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default SalesReportPage;

// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   Table,
//   DatePicker,
//   Button,
//   Select,
//   Typography,
//   Space,
//   Divider,
//   message,
//   Form,
//   Input,
// } from "antd";
// import {
//   FilePdfOutlined,
//   SearchOutlined,
//   ReloadOutlined,
// } from "@ant-design/icons";
// import axios from "axios";

// const { Title, Text } = Typography;
// const { RangePicker } = DatePicker;
// const { Option } = Select;

// const SalesReportPage = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [reportType, setReportType] = useState("daily");
//   const [exportingPdf, setExportingPdf] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [totals, setTotals] = useState({
//     totalSales: 0,
//     totalOrders: 0,
//     averageOrderValue: 0,
//   });

//   useEffect(() => {
//     fetchSalesData();
//   }, [reportType, dateRange]);

//   const fetchSalesData = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         message.error("Authentication required");
//         return;
//       }

//       let endpoint = "/api/reports/sales";
//       const params = { type: reportType };

//       if (dateRange[0] && dateRange[1]) {
//         params.startDate = dateRange[0].format("YYYY-MM-DD");
//         params.endDate = dateRange[1].format("YYYY-MM-DD");
//       }

//       const response = await axios.get(endpoint, {
//         params,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         const formattedData = response.data.sales.map((sale, index) => ({
//           ...sale,
//           key: sale.cus_oder_id || index,
//         }));

//         setSalesData(formattedData);

//         const totalSales = formattedData.reduce(
//           (sum, item) => sum + (item.value || 0),
//           0
//         );
//         const totalOrders = formattedData.length;
//         const averageOrderValue =
//           totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

//         setTotals({
//           totalSales,
//           totalOrders,
//           averageOrderValue,
//         });
//       } else {
//         message.error(response.data.message || "Failed to fetch sales data");
//       }
//     } catch (error) {
//       console.error("Error fetching sales data:", error);
//       message.error(
//         error.response?.data?.message || "Failed to load sales data"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateRangeChange = (dates) => {
//     setDateRange(dates);
//   };

//   const handleSearch = () => {
//     fetchSalesData();
//   };

//   const handleReportTypeChange = (value) => {
//     setReportType(value);
//   };

//   // const handleExportPDF = async () => {
//   //   try {
//   //     setExportingPdf(true);
//   //     const token = localStorage.getItem("token");

//   //     if (!token) {
//   //       message.error("Authentication required");
//   //       return;
//   //     }

//   //     if (!dateRange[0] || !dateRange[1]) {
//   //       message.error("Please select both start and end dates");
//   //       return;
//   //     }

//   //     const response = await axios.get("/api/reports/sales/export-pdf", {
//   //       params: {
//   //         type: reportType,
//   //         startDate: dateRange[0].format("YYYY-MM-DD"),
//   //         endDate: dateRange[1].format("YYYY-MM-DD"),
//   //         format: "pdf",
//   //       },
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //       responseType: "blob",
//   //     });

//   //     const url = window.URL.createObjectURL(new Blob([response.data]));
//   //     const link = document.createElement("a");
//   //     link.href = url;
//   //     link.setAttribute(
//   //       "download",
//   //       `sales_report_${reportType}_${dateRange[0].format(
//   //         "YYYY-MM-DD"
//   //       )}_to_${dateRange[1].format("YYYY-MM-DD")}.pdf`
//   //     );
//   //     document.body.appendChild(link);
//   //     link.click();

//   //     setTimeout(() => {
//   //       document.body.removeChild(link);
//   //       window.URL.revokeObjectURL(url);
//   //       message.success("PDF exported successfully");
//   //     }, 100);
//   //   } catch (error) {
//   //     console.error("Error exporting PDF:", error);
//   //     if (error.response?.status === 400) {
//   //       message.error(
//   //         error.response.data?.message || "Invalid request parameters"
//   //       );
//   //     } else {
//   //       message.error("Failed to export PDF. Please try again.");
//   //     }
//   //   } finally {
//   //     setExportingPdf(false);
//   //   }
//   // };

//   const handleExportPDF = async () => {
//     try {
//       setExportingPdf(true);
//       const token = localStorage.getItem("token");

//       if (!token) {
//         message.error("Authentication required");
//         return;
//       }

//       if (!dateRange[0] || !dateRange[1]) {
//         message.error("Please select both start and end dates");
//         return;
//       }

//       // Log the request parameters for debugging
//       console.log("Requesting PDF with params:", {
//         type: reportType,
//         startDate: dateRange[0].format("YYYY-MM-DD"),
//         endDate: dateRange[1].format("YYYY-MM-DD"),
//       });

//       // Make the request
//       const response = await axios({
//         method: "get",
//         url: "/api/reports/sales/export-pdf",
//         params: {
//           type: reportType,
//           startDate: dateRange[0].format("YYYY-MM-DD"),
//           endDate: dateRange[1].format("YYYY-MM-DD"),
//         },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         responseType: "arraybuffer", // Use arraybuffer instead of blob
//       });

//       // Log response details
//       console.log("Response headers:", response.headers);
//       console.log("Response status:", response.status);
//       console.log("Response size:", response.data.byteLength);

//       // Check content type to ensure we got a PDF
//       const contentType = response.headers["content-type"];
//       console.log("Content type:", contentType);

//       if (contentType !== "application/pdf") {
//         // If not a PDF, try to interpret the response
//         const textDecoder = new TextDecoder();
//         const responseText = textDecoder.decode(response.data);
//         console.error("Unexpected response type:", contentType);
//         console.error("Response text:", responseText);

//         try {
//           // Try to parse as JSON if possible
//           const errorData = JSON.parse(responseText);
//           message.error(errorData.message || "Server returned an error");
//         } catch (e) {
//           message.error("Server returned invalid content");
//         }

//         setExportingPdf(false);
//         return;
//       }

//       // Create a blob and download the PDF
//       const blob = new Blob([response.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         `sales_report_${reportType}_${dateRange[0].format(
//           "YYYY-MM-DD"
//         )}_to_${dateRange[1].format("YYYY-MM-DD")}.pdf`
//       );
//       document.body.appendChild(link);
//       link.click();

//       // Cleanup
//       setTimeout(() => {
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       }, 100);

//       message.success("PDF exported successfully");
//     } catch (error) {
//       console.error("Export PDF error:", error);

//       // Better error handling
//       if (error.response) {
//         console.error("Response status:", error.response.status);
//         console.error("Response headers:", error.response.headers);

//         // Try to decode the response if it's an arraybuffer
//         if (error.response.data instanceof ArrayBuffer) {
//           const textDecoder = new TextDecoder();
//           const responseText = textDecoder.decode(error.response.data);
//           console.error("Response text:", responseText);

//           try {
//             const errorData = JSON.parse(responseText);
//             message.error(errorData.message || "Server returned an error");
//           } catch (e) {
//             message.error(`Error ${error.response.status}: ${error.message}`);
//           }
//         } else {
//           message.error(`Error ${error.response.status}: ${error.message}`);
//         }
//       } else if (error.request) {
//         message.error("No response received from server");
//       } else {
//         message.error(`Error: ${error.message}`);
//       }
//     } finally {
//       setExportingPdf(false);
//     }
//   };

//   const filteredData = salesData.filter((record) => {
//     if (!searchValue) return true;
//     const searchLower = searchValue.toLowerCase();
//     return (
//       (record.cus_oder_id &&
//         record.cus_oder_id.toString().includes(searchLower)) ||
//       (record.customer_name &&
//         record.customer_name.toLowerCase().includes(searchLower)) ||
//       (record.status && record.status.toLowerCase().includes(searchLower))
//     );
//   });

//   const columns = [
//     {
//       title: "Order ID",
//       dataIndex: "cus_oder_id",
//       key: "cus_oder_id",
//       sorter: (a, b) => a.cus_oder_id - b.cus_oder_id,
//     },
//     {
//       title: "Date",
//       dataIndex: "date",
//       key: "date",
//       sorter: (a, b) => new Date(a.date) - new Date(b.date),
//     },
//     {
//       title: "Customer",
//       dataIndex: "customer_name",
//       key: "customer_name",
//     },
//     {
//       title: "Items",
//       dataIndex: "items_count",
//       key: "items_count",
//       sorter: (a, b) => a.items_count - b.items_count,
//     },
//     {
//       title: "Payment Method",
//       dataIndex: "payment_method",
//       key: "payment_method",
//     },
//     // {
//     //   title: "Status",
//     //   dataIndex: "status",
//     //   key: "status",
//     //   render: (status) => {
//     //     let color = "blue";
//     //     if (status === "Completed" || status === "Delivered") color = "green";
//     //     if (status === "Cancelled") color = "red";
//     //     if (status === "Processing") color = "gold";
//     //     return <span style={{ color }}>{status}</span>;
//     //   },
//     // },
//     {
//       title: "Amount (Rs.)",
//       dataIndex: "value",
//       key: "value",
//       sorter: (a, b) => a.value - b.value,
//       render: (value) => `Rs. ${value?.toLocaleString() || 0}`,
//     },
//   ];

//   return (
//     <div className="p-6">
//       <Card className="shadow-sm">
//         <div className="flex justify-between items-center mb-6">
//           <Title level={4}>Sales Report</Title>
//           <Space>
//             <Button
//               type="primary"
//               icon={<FilePdfOutlined />}
//               onClick={handleExportPDF}
//               loading={exportingPdf}
//             >
//               Export PDF
//             </Button>
//           </Space>
//         </div>

//         <div className="flex flex-wrap gap-4 mb-6">
//           <Form layout="inline">
//             <Form.Item label="Report Type">
//               <Select
//                 value={reportType}
//                 onChange={handleReportTypeChange}
//                 style={{ width: 150 }}
//               >
//                 <Option value="daily">Daily</Option>
//                 <Option value="weekly">Weekly</Option>
//                 <Option value="monthly">Monthly</Option>
//                 <Option value="yearly">Yearly</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item label="Date Range">
//               <RangePicker onChange={handleDateRangeChange} value={dateRange} />
//             </Form.Item>

//             <Form.Item>
//               <Input
//                 placeholder="Search orders..."
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 prefix={<SearchOutlined className="text-gray-400" />}
//                 allowClear
//               />
//             </Form.Item>

//             <Form.Item>
//               <Button
//                 type="primary"
//                 onClick={handleSearch}
//                 icon={<ReloadOutlined />}
//               >
//                 Refresh
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <Card className="bg-blue-50 border-blue-200">
//             <div className="text-center">
//               <Text type="secondary">Total Sales</Text>
//               <div className="text-2xl font-bold text-blue-600 mt-1">
//                 Rs. {totals.totalSales.toLocaleString()}
//               </div>
//             </div>
//           </Card>

//           <Card className="bg-green-50 border-green-200">
//             <div className="text-center">
//               <Text type="secondary">Total Orders</Text>
//               <div className="text-2xl font-bold text-green-600 mt-1">
//                 {totals.totalOrders}
//               </div>
//             </div>
//           </Card>

//           <Card className="bg-purple-50 border-purple-200">
//             <div className="text-center">
//               <Text type="secondary">Average Order Value</Text>
//               <div className="text-2xl font-bold text-purple-600 mt-1">
//                 Rs. {totals.averageOrderValue}
//               </div>
//             </div>
//           </Card>
//         </div>

//         <Divider className="my-6" />

//         <div className="overflow-x-auto">
//           <Table
//             columns={columns}
//             dataSource={filteredData}
//             loading={loading}
//             pagination={{ pageSize: 10 }}
//             bordered
//             size="middle"
//             className="print-table"
//             summary={(pageData) => {
//               if (pageData.length === 0) return null;

//               const pageTotal = pageData.reduce(
//                 (sum, item) => sum + (item.value || 0),
//                 0
//               );

//               return (
//                 <>
//                   <Table.Summary.Row>
//                     <Table.Summary.Cell
//                       index={0}
//                       colSpan={6}
//                       className="text-right font-bold"
//                     >
//                       Page Total:
//                     </Table.Summary.Cell>
//                     <Table.Summary.Cell index={1} className="font-bold">
//                       Rs. {pageTotal.toLocaleString()}
//                     </Table.Summary.Cell>
//                   </Table.Summary.Row>
//                   <Table.Summary.Row>
//                     <Table.Summary.Cell
//                       index={0}
//                       colSpan={6}
//                       className="text-right font-bold"
//                     >
//                       Grand Total:
//                     </Table.Summary.Cell>
//                     <Table.Summary.Cell index={1} className="font-bold">
//                       Rs. {totals.totalSales.toLocaleString()}
//                     </Table.Summary.Cell>
//                   </Table.Summary.Row>
//                 </>
//               );
//             }}
//           />
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default SalesReportPage;

import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  DatePicker,
  Button,
  Select,
  Typography,
  Space,
  Divider,
  message,
  Form,
  Input,
} from "antd";
import {
  FilePdfOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const SalesReportPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [reportType, setReportType] = useState("daily");
  const [exportingPdf, setExportingPdf] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [totals, setTotals] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
  });

  useEffect(() => {
    fetchSalesData();
  }, [reportType]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication required");
        return;
      }

      let endpoint = "/api/reports/sales";
      const params = { type: reportType };

      if (dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].format("YYYY-MM-DD");
        params.endDate = dateRange[1].format("YYYY-MM-DD");
      }

      const response = await axios.get(endpoint, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const formattedData = response.data.sales.map((sale, index) => ({
          ...sale,
          key: sale.cus_oder_id || index,
        }));

        setSalesData(formattedData);

        // Calculate totals
        const totalSales = formattedData.reduce(
          (sum, item) => sum + (item.value || 0),
          0
        );
        const totalOrders = formattedData.length;
        const averageOrderValue =
          totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

        setTotals({
          totalSales,
          totalOrders,
          averageOrderValue,
        });
      } else {
        message.error(response.data.message || "Failed to fetch sales data");
        // You might want to set mock data here during development
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
      message.error("Failed to load sales data");
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleSearch = () => {
    fetchSalesData();
  };

  const handleReportTypeChange = (value) => {
    setReportType(value);
  };

  const handleExportPDF = async () => {
    try {
      setExportingPdf(true);
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication required");
        return;
      }

      if (!dateRange[0] || !dateRange[1]) {
        message.error("Please select both start and end dates");
        return;
      }

      const response = await axios.get("/api/reports/sales/export-pdf", {
        params: {
          type: reportType,
          startDate: dateRange[0].format("YYYY-MM-DD"),
          endDate: dateRange[1].format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `sales_report_${reportType}_${dateRange[0].format(
          "YYYY-MM-DD"
        )}_to_${dateRange[1].format("YYYY-MM-DD")}.pdf`
      );
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        message.success("PDF exported successfully");
      }, 100);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      message.error("Failed to export PDF. Please try again.");
    } finally {
      setExportingPdf(false);
    }
  };

  // Filter data based on search input
  const filteredData = salesData.filter((record) => {
    if (!searchValue) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      (record.cus_oder_id &&
        record.cus_oder_id.toString().includes(searchLower)) ||
      (record.customer_name &&
        record.customer_name.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "cus_oder_id",
      key: "cus_oder_id",
      sorter: (a, b) => a.cus_oder_id - b.cus_oder_id,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Items",
      dataIndex: "items_count",
      key: "items_count",
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        if (status === "Completed" || status === "Delivered") color = "green";
        if (status === "Cancelled") color = "red";
        if (status === "Processing") color = "gold";
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: "Amount (Rs.)",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => a.value - b.value,
      render: (value) => `Rs. ${value?.toLocaleString() || 0}`,
    },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <Title level={4}>Sales Report</Title>
          <Space>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={handleExportPDF}
              loading={exportingPdf}
            >
              Export PDF
            </Button>
          </Space>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <Form layout="inline">
            <Form.Item label="Report Type">
              <Select
                value={reportType}
                onChange={handleReportTypeChange}
                style={{ width: 150 }}
              >
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
                <Option value="yearly">Yearly</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Date Range">
              <RangePicker onChange={handleDateRangeChange} value={dateRange} />
            </Form.Item>

            <Form.Item>
              <Input
                placeholder="Search orders..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                prefix={<SearchOutlined className="text-gray-400" />}
                allowClear
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                onClick={handleSearch}
                icon={<ReloadOutlined />}
              >
                Refresh
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <div className="text-center">
              <Text type="secondary">Total Sales</Text>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                Rs. {totals.totalSales.toLocaleString()}
              </div>
            </div>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <div className="text-center">
              <Text type="secondary">Total Orders</Text>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {totals.totalOrders}
              </div>
            </div>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <div className="text-center">
              <Text type="secondary">Average Order Value</Text>
              <div className="text-2xl font-bold text-purple-600 mt-1">
                Rs. {totals.averageOrderValue}
              </div>
            </div>
          </Card>
        </div>

        <Divider className="my-6" />

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 10 }}
            bordered
            size="middle"
            summary={(pageData) => {
              if (pageData.length === 0) return null;

              const pageTotal = pageData.reduce(
                (sum, item) => sum + (item.value || 0),
                0
              );

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                      index={0}
                      colSpan={6}
                      className="text-right font-bold"
                    >
                      Page Total:
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} className="font-bold">
                      Rs. {pageTotal.toLocaleString()}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                      index={0}
                      colSpan={6}
                      className="text-right font-bold"
                    >
                      Grand Total:
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} className="font-bold">
                      Rs. {totals.totalSales.toLocaleString()}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default SalesReportPage;
