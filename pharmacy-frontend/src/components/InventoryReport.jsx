




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
  Tag,
} from "antd";
import {
  FilePdfOutlined,
  SearchOutlined,
  ReloadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const InventoryReportPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [reportType, setReportType] = useState("current");
  const [exportingPdf, setExportingPdf] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0,
    expiringSoon: 0,
  });

  useEffect(() => {
    fetchInventoryData();
    fetchCategories();
  }, [reportType, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        message.error("Authentication required");
        return;
      }

      const response = await axios.get("/api/reports/inventory/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        message.error("Authentication required");
        return;
      }

      let endpoint = "/api/reports/inventory";
      const params = { type: reportType, category: categoryFilter };

      if (dateRange[0] && dateRange[1] && reportType === "movement") {
        params.startDate = dateRange[0].format("YYYY-MM-DD");
        params.endDate = dateRange[1].format("YYYY-MM-DD");
      }

      const response = await axios.get(endpoint, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const formattedData = response.data.inventory.map((item, index) => ({
          ...item,
          key: item.product_id || index,
        }));

        setInventoryData(formattedData);
        setSummaryData(response.data.summary || {
          totalProducts: formattedData.length,
          totalValue: formattedData.reduce(
            (sum, item) => sum + (item.total_value || 0),
            0
          ),
          lowStockItems: formattedData.filter(
            (item) => (item.quantity || 0) <= (item.treshold || 10)
          ).length,
          expiringSoon: formattedData.filter((item) => {
            if (!item.exp_date) return false;
            const expDate = new Date(item.exp_date);
            const today = new Date();
            const diffDays = Math.floor(
              (expDate - today) / (1000 * 60 * 60 * 24)
            );
            return diffDays <= 30;
          }).length,
        });
      } else {
        message.error(response.data.message || "Failed to fetch inventory data");
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      message.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleSearch = () => {
    fetchInventoryData();
  };

  const handleReportTypeChange = (value) => {
    setReportType(value);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };

  const handleExportPDF = async () => {
    try {
      setExportingPdf(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        message.error("Authentication required");
        return;
      }

      const params = { type: reportType, category: categoryFilter };
      
      if (reportType === "movement" && (!dateRange[0] || !dateRange[1])) {
        message.error("Please select both start and end dates for movement reports");
        setExportingPdf(false);
        return;
      }

      if (dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].format("YYYY-MM-DD");
        params.endDate = dateRange[1].format("YYYY-MM-DD");
      }

      const response = await axios.get("/api/reports/inventory/export-pdf", {
        params,
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
        `inventory_report_${reportType}_${new Date().toISOString().split("T")[0]}.pdf`
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
  const filteredData = inventoryData.filter((record) => {
    if (!searchValue) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      (record.product_id && record.product_id.toString().includes(searchLower)) ||
      (record.pname && record.pname.toLowerCase().includes(searchLower))
    );
  });

  // Define columns based on report type
  const getColumns = () => {
    const baseColumns = [
      {
        title: "Product ID",
        dataIndex: "product_id",
        key: "product_id",
        sorter: (a, b) => a.product_id - b.product_id,
      },
      {
        title: "Product Name",
        dataIndex: "pname",
        key: "pname",
      },
      {
        title: "Category",
        dataIndex: "category_name",
        key: "category_name",
        filters: categories.map(cat => ({ text: cat.name, value: cat.name })),
        onFilter: (value, record) => record.category_name === value,
      }
    ];

    // Additional columns for current inventory
    if (reportType === "current") {
      return [
        ...baseColumns,
        {
          title: "In Stock",
          dataIndex: "quantity",
          key: "quantity",
          sorter: (a, b) => a.quantity - b.quantity,
          render: (quantity, record) => {
            const threshold = record.treshold || 10;
            const color = quantity <= threshold ? "red" : 
                          quantity <= threshold * 1.5 ? "orange" : "green";
            return <span style={{ color }}>{quantity}</span>;
          },
        },
        {
          title: "Threshold",
          dataIndex: "treshold",
          key: "treshold",
        },
        {
          title: "Unit Price",
          dataIndex: "price",
          key: "price",
          render: (price) => `Rs. ${price?.toLocaleString() || 0}`,
        },
        {
          title: "Total Value",
          key: "total_value",
          render: (_, record) => `Rs. ${((record.quantity || 0) * (record.price || 0)).toLocaleString()}`,
          sorter: (a, b) => 
            (a.quantity || 0) * (a.price || 0) - (b.quantity || 0) * (b.price || 0),
        },
        {
          title: "Expiry Date",
          dataIndex: "exp_date",
          key: "exp_date",
          sorter: (a, b) => new Date(a.exp_date) - new Date(b.exp_date),
          render: (date) => {
            if (!date) return "N/A";
            const expDate = new Date(date);
            const today = new Date();
            const diffDays = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
            const color = diffDays <= 30 ? "red" : 
                          diffDays <= 90 ? "orange" : "green";
            return (
              <span style={{ color }}>
                {expDate.toLocaleDateString()}
                {diffDays <= 30 && (
                  <WarningOutlined 
                    style={{ marginLeft: 8 }} 
                    title={`Expires in ${diffDays} days`} 
                  />
                )}
              </span>
            );
          },
        },
        {
          title: "Status",
          key: "status",
          render: (_, record) => {
            if ((record.quantity || 0) <= 0) {
              return <Tag color="red">Out of Stock</Tag>;
            }
            if ((record.quantity || 0) <= (record.treshold || 10)) {
              return <Tag color="orange">Low Stock</Tag>;
            }
            const expDate = record.exp_date ? new Date(record.exp_date) : null;
            if (expDate) {
              const today = new Date();
              const diffDays = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
              if (diffDays <= 30) {
                return <Tag color="volcano">Expiring Soon</Tag>;
              }
            }
            return <Tag color="green">In Stock</Tag>;
          },
        },
      ];
    }

    // Additional columns for expiring items
    if (reportType === "expiry") {
      return [
        ...baseColumns,
        {
          title: "Quantity",
          dataIndex: "quantity",
          key: "quantity",
        },
        {
          title: "Expiry Date",
          dataIndex: "exp_date",
          key: "exp_date",
          sorter: (a, b) => new Date(a.exp_date) - new Date(b.exp_date),
          render: (date) => {
            if (!date) return "N/A";
            const expDate = new Date(date);
            const today = new Date();
            const diffDays = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
            let color = "green";
            if (diffDays <= 30) color = "red";
            else if (diffDays <= 90) color = "orange";
            
            return (
              <span style={{ color }}>
                {expDate.toLocaleDateString()} 
                {diffDays <= 0 ? " (EXPIRED)" : ` (${diffDays} days left)`}
              </span>
            );
          },
        },
        {
          title: "Total Value",
          key: "total_value",
          render: (_, record) => `Rs. ${((record.quantity || 0) * (record.price || 0)).toLocaleString()}`,
        },
      ];
    }

    // Additional columns for low stock items
    if (reportType === "lowstock") {
      return [
        ...baseColumns,
        {
          title: "In Stock",
          dataIndex: "quantity",
          key: "quantity",
          sorter: (a, b) => a.quantity - b.quantity,
          render: (quantity, record) => {
            const threshold = record.treshold || 10;
            return <span style={{ color: "red" }}>{quantity} / {threshold}</span>;
          },
        },
        {
          title: "Reorder Level",
          dataIndex: "treshold",
          key: "treshold",
        },
        {
          title: "Unit Price",
          dataIndex: "price",
          key: "price",
          render: (price) => `Rs. ${price?.toLocaleString() || 0}`,
        },
        {
          title: "Supplier",
          dataIndex: "supplier_name",
          key: "supplier_name",
        },
      ];
    }

    // Additional columns for movement report
    if (reportType === "movement") {
      return [
        ...baseColumns,
        {
          title: "Opening Stock",
          dataIndex: "opening_stock",
          key: "opening_stock",
        },
        {
          title: "Stock In",
          dataIndex: "stock_in",
          key: "stock_in",
          render: (value) => <span style={{ color: "green" }}>+{value || 0}</span>,
        },
        {
          title: "Stock Out",
          dataIndex: "stock_out",
          key: "stock_out",
          render: (value) => <span style={{ color: "red" }}>-{value || 0}</span>,
        },
        {
          title: "Closing Stock",
          dataIndex: "closing_stock",
          key: "closing_stock",
        },
        {
          title: "Value Change",
          key: "value_change",
          render: (_, record) => {
            const change = ((record.closing_stock || 0) - (record.opening_stock || 0)) * (record.price || 0);
            const color = change >= 0 ? "green" : "red";
            const prefix = change >= 0 ? "+" : "";
            return <span style={{ color }}>{prefix}Rs. {change.toLocaleString()}</span>;
          },
        },
      ];
    }

    return baseColumns;
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <Title level={4}>Inventory Report</Title>
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
                style={{ width: 180 }}
              >
                <Option value="current">Current Inventory</Option>
                <Option value="lowstock">Low Stock Items</Option>
                <Option value="expiry">Expiring Items</Option>
                <Option value="movement">Stock Movement</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Category">
              <Select
                value={categoryFilter}
                onChange={handleCategoryChange}
                style={{ width: 150 }}
              >
                <Option value="all">All Categories</Option>
                {categories.map(cat => (
                  <Option key={cat.product_cato_id} value={cat.name}>{cat.name}</Option>
                ))}
              </Select>
            </Form.Item>

            {reportType === "movement" && (
              <Form.Item label="Date Range">
                <RangePicker onChange={handleDateRangeChange} value={dateRange} />
              </Form.Item>
            )}

            <Form.Item>
              <Input
                placeholder="Search products..."
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <div className="text-center">
              <Text type="secondary">Total Products</Text>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {summaryData.totalProducts}
              </div>
            </div>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <div className="text-center">
              <Text type="secondary">Total Inventory Value</Text>
              <div className="text-2xl font-bold text-green-600 mt-1">
                Rs. {summaryData.totalValue.toLocaleString()}
              </div>
            </div>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <div className="text-center">
              <Text type="secondary">Low Stock Items</Text>
              <div className="text-2xl font-bold text-orange-600 mt-1">
                {summaryData.lowStockItems}
              </div>
            </div>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <div className="text-center">
              <Text type="secondary">Expiring Soon</Text>
              <div className="text-2xl font-bold text-red-600 mt-1">
                {summaryData.expiringSoon}
              </div>
            </div>
          </Card>
        </div>

        <Divider className="my-6" />

        <div className="overflow-x-auto">
          <Table
            columns={getColumns()}
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 10 }}
            bordered
            size="middle"
            summary={(pageData) => {
              if (pageData.length === 0 || reportType === "movement") return null;

              const pageTotal = pageData.reduce(
                (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
                0
              );

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                      index={0}
                      colSpan={getColumns().length - 1}
                      className="text-right font-bold"
                    >
                      Page Total Value:
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} className="font-bold">
                      Rs. {pageTotal.toLocaleString()}
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

export default InventoryReportPage;