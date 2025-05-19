import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Avatar,
  Card,
  Tabs,
  Statistic,
  Divider,
  Typography,
  Space,
  Tag,
  InputNumber,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

const Inventory = () => {
  // Views state: 'inventory', 'productDetails', 'categories'
  const [currentView, setCurrentView] = useState("inventory");
  // Selected product for details view
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  // Form instances
  const [categoryForm] = Form.useForm();
  const [productForm] = Form.useForm();
  const [editProductForm] = Form.useForm();
  // Other states
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState(null);
  const [productHistory, setProductHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    categoriesCount: 0,
    lowStockCount: 0,
    emptyStockCount: 0,
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchStats();
  }, []);

  // Fetch products data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        // Fallback to sample data if API fails
        setMockProducts();
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to load products. Using sample data.");
      setMockProducts();
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories data
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      } else {
        // Fallback to sample data if API fails
        setMockCategories();
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to load categories. Using sample data.");
      setMockCategories();
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory stats
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/inventory/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.stats) {
        setStats(response.data.stats);
      } else {
        // Calculate stats from products if API fails
        calculateStatsFromProducts();
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Calculate stats from products if API fails
      calculateStatsFromProducts();
    }
  };

  // Calculate stats from products data
  const calculateStatsFromProducts = () => {
    const lowStockCount = products.filter(
      (p) => p.status === "Low stock" || p.quantity < p.threshold
    ).length;

    const emptyStockCount = products.filter(
      (p) =>
        p.status === "Out of stock" || p.quantity === 0 || p.quantity === "0"
    ).length;

    setStats({
      categoriesCount: categories.length,
      lowStockCount,
      emptyStockCount,
    });
  };

  // Fetch product history
  const fetchProductHistory = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`/api/inventory/${productId}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.history) {
        setProductHistory(response.data.history);
      } else {
        // Fallback to sample data if API fails
        setMockProductHistory(productId);
      }
    } catch (error) {
      console.error("Error fetching product history:", error);
      message.error("Failed to load product history. Using sample data.");
      setMockProductHistory(productId);
    } finally {
      setLoading(false);
    }
  };

  // Set mock products data
  const setMockProducts = () => {
    const mockProducts = [
      {
        id: 1,
        name: "Paracetamol",
        price: "Rs.40",
        quantity: "150",
        status: "In-stock",
        type: "No Prescription",
        category: "Tablets",
        productId: "PROD-0001",
        supplier: "ABC Pharmaceuticals",
        contactNumber: "0123456789",
        openingStock: "200",
        remainingStock: "150",
        onTheWay: "0",
        threshold: "50",
        unit: "Tablets",
        unitsPerPackage: "10",
        expiryDate: "2025-12-31",
      },
      {
        id: 2,
        name: "Amoxicillin",
        price: "Rs.120",
        quantity: "30",
        status: "Low stock",
        type: "Prescription Required",
        category: "Tablets",
        productId: "PROD-0002",
        supplier: "XYZ Pharmaceuticals",
        contactNumber: "9876543210",
        openingStock: "100",
        remainingStock: "30",
        onTheWay: "50",
        threshold: "40",
        unit: "Tablets",
        unitsPerPackage: "10",
        expiryDate: "2025-06-30",
      },
      {
        id: 3,
        name: "Ibuprofen",
        price: "Rs.60",
        quantity: "0",
        status: "Out of stock",
        type: "No Prescription",
        category: "Tablets",
        productId: "PROD-0003",
        supplier: "DEF Pharmaceuticals",
        contactNumber: "1234567890",
        openingStock: "75",
        remainingStock: "0",
        onTheWay: "100",
        threshold: "25",
        unit: "Tablets",
        unitsPerPackage: "10",
        expiryDate: "2025-09-15",
      },
      {
        id: 4,
        name: "Cough Syrup",
        price: "Rs.95",
        quantity: "45",
        status: "In-stock",
        type: "No Prescription",
        category: "Syrup",
        productId: "PROD-0004",
        supplier: "GHI Pharmaceuticals",
        contactNumber: "5432167890",
        openingStock: "50",
        remainingStock: "45",
        onTheWay: "0",
        threshold: "10",
        unit: "Bottles",
        unitsPerPackage: "1",
        expiryDate: "2025-08-20",
      },
      {
        id: 5,
        name: "Surgical Mask",
        price: "Rs.25",
        quantity: "500",
        status: "In-stock",
        type: "No Prescription",
        category: "Masks",
        productId: "PROD-0005",
        supplier: "Medical Supplies Inc.",
        contactNumber: "0987654321",
        openingStock: "1000",
        remainingStock: "500",
        onTheWay: "0",
        threshold: "100",
        unit: "Pieces",
        unitsPerPackage: "10",
        expiryDate: "2026-03-15",
      },
    ];

    setProducts(mockProducts);
  };

  // Set mock categories data
  const setMockCategories = () => {
    const mockCategories = [
      { id: 1, name: "Tablets", description: "Medicinal tablets" },
      { id: 2, name: "Syrup", description: "Medicinal syrups" },
      { id: 3, name: "Masks", description: "Protective face masks" },
      { id: 4, name: "First Aid", description: "First aid supplies" },
      { id: 5, name: "Personal Care", description: "Personal care products" },
    ];

    setCategories(mockCategories);
  };

  // Set mock product history
  const setMockProductHistory = (productId) => {
    const mockHistory = [
      {
        id: 1,
        orderId: "ORD-2024-001",
        supplierName: "ABC Pharmaceuticals",
        expiryDate: "2025-12-31",
        quantity: 100,
        date: "2024-03-10",
      },
      {
        id: 2,
        orderId: "ORD-2024-015",
        supplierName: "ABC Pharmaceuticals",
        expiryDate: "2025-12-31",
        quantity: 50,
        date: "2024-04-20",
      },
      {
        id: 3,
        orderId: "ORD-2024-032",
        supplierName: "XYZ Pharmaceuticals",
        expiryDate: "2026-01-15",
        quantity: 75,
        date: "2024-05-05",
      },
    ];

    setProductHistory(mockHistory);
  };

  // Add a new category
  const handleAddCategory = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post("/api/categories", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        setCategories([...categories, response.data.category]);
        message.success("Category added successfully");
        setShowCategoryModal(false);
        categoryForm.resetFields();
        fetchStats();
      }
    } catch (error) {
      console.error("Error adding category:", error);
      message.error("Failed to add category");

      // Fallback if API fails
      const newCategory = {
        id: categories.length + 1,
        ...values,
      };
      setCategories([...categories, newCategory]);
      message.success("Category added successfully (offline mode)");
      setShowCategoryModal(false);
      categoryForm.resetFields();
    } finally {
      setLoading(false);
    }
  };

  // Update an existing category
  const handleUpdateCategory = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `/api/categories/${currentCategory.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setCategories(
          categories.map((cat) =>
            cat.id === currentCategory.id ? response.data.category : cat
          )
        );
        message.success("Category updated successfully");
        setShowCategoryModal(false);
        setCurrentCategory(null);
        categoryForm.resetFields();
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating category:", error);
      message.error("Failed to update category");

      // Fallback if API fails
      const updatedCategory = {
        ...currentCategory,
        ...values,
      };
      setCategories(
        categories.map((cat) =>
          cat.id === currentCategory.id ? updatedCategory : cat
        )
      );
      message.success("Category updated successfully (offline mode)");
      setShowCategoryModal(false);
      setCurrentCategory(null);
      categoryForm.resetFields();
    } finally {
      setLoading(false);
    }
  };

  // Handler for both adding and updating categories
  const handleCategorySubmit = (values) => {
    if (currentCategory) {
      handleUpdateCategory(values);
    } else {
      handleAddCategory(values);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (categoryId) => {
    confirm({
      title: "Are you sure you want to delete this category?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");

          const response = await axios.delete(`/api/categories/${categoryId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data && response.data.success) {
            setCategories(categories.filter((cat) => cat.id !== categoryId));
            message.success("Category deleted successfully");
            fetchStats();
          }
        } catch (error) {
          console.error("Error deleting category:", error);
          message.error("Failed to delete category");

          // Fallback if API fails
          setCategories(categories.filter((cat) => cat.id !== categoryId));
          message.success("Category deleted successfully (offline mode)");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleAddProduct = async (values) => {
    try {
      setLoading(true);

      // Create form data for file upload
      const formData = new FormData();

      // Map form fields
      const productType =
        values.type === "Prescription Required"
          ? "prescription needed"
          : "prescription not needed";

      // Add all form fields to FormData
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("price", values.price);
      formData.append("type", productType); // Match database field 'type'
      formData.append("threshold", values.threshold);

      // Add image if exists
      if (imageUrl) {
        formData.append("image", imageUrl);
      }

      const token = localStorage.getItem("token");

      // Make API call with proper endpoint
      const response = await axios.post("/api/inventory", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.success) {
        fetchProducts();
        message.success("Product added successfully");
        setShowAddModal(false);
        productForm.resetFields();
        setImageUrl(null);
        fetchStats();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      console.error("Error details:", error.response?.data);

      message.error(
        "Failed to add product: " +
          (error.response?.data?.message || error.message)
      );

      // Fallback - add product locally for demo
      const newProduct = {
        // Product details
      };

      setProducts([...products, newProduct]);
      message.success("Product added successfully (offline mode)");
      setShowAddModal(false);
      productForm.resetFields();
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
  };
  const handleEditProduct = async (values) => {
    try {
      setLoading(true);

      // Create form data for file upload
      const formData = new FormData();

      // Map the form values
      const productType =
        values.type === "Prescription Required"
          ? "prescription needed"
          : "prescription no needed";

      // Add all form fields to FormData
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("price", values.price);
      formData.append("type", productType); // Match the database field name
      formData.append("threshold", values.threshold);

      // Add image if exists and is a new file (not a string URL)
      if (editImageUrl && typeof editImageUrl !== "string") {
        formData.append("image", editImageUrl);
      }

      // For debugging
      console.log("Edit Form values:", values);
      console.log("Edit Image URL:", editImageUrl);

      // For FormData logging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const token = localStorage.getItem("token");

      try {
        const response = await axios.put(
          `/api/inventory/${selectedProduct.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Success response:", response.data);

        if (response.data && response.data.success) {
          // Update the products list
          fetchProducts();

          // Update the selected product with new data
          const updatedProduct = {
            ...selectedProduct,
            name: values.name,
            price: `Rs.${values.price}`,
            type: values.type,
            category: values.category,
            threshold: values.threshold,
            image: response.data.imageUrl || selectedProduct.image,
          };
          setSelectedProduct(updatedProduct);

          message.success("Product updated successfully");
          setShowEditModal(false);
          editProductForm.resetFields();
          setEditImageUrl(null);
          fetchStats();
        }
      } catch (error) {
        console.error("API Error Details:", error.response?.data);
        throw error; // Re-throw to be caught by the outer try-catch
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error(
        "Failed to update product: " +
          (error.response?.data?.message || error.message)
      );

      // Fallback for demo mode
      const updatedProduct = {
        ...selectedProduct,
        name: values.name,
        price: `Rs.${values.price}`,
        type: values.type,
        category: values.category,
        threshold: values.threshold,
      };

      setProducts(
        products.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
      );

      setSelectedProduct(updatedProduct);
      message.success("Product updated successfully (offline mode)");
      setShowEditModal(false);
      editProductForm.resetFields();
      setEditImageUrl(null);
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const handleDeleteProduct = async () => {
    confirm({
      title: "Are you sure you want to delete this product?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");

          const response = await axios.delete(
            `/api/inventory/${selectedProduct.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data && response.data.success) {
            setProducts(products.filter((p) => p.id !== selectedProduct.id));
            setCurrentView("inventory");
            message.success("Product deleted successfully");
            fetchStats();
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          message.error("Failed to delete product");

          // Fallback if API fails
          setProducts(products.filter((p) => p.id !== selectedProduct.id));
          setCurrentView("inventory");
          message.success("Product deleted successfully (offline mode)");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Handle image upload for add form
  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      setImageUrl(info.file.originFileObj);
    }
  };

  // Handle image upload for edit form
  const handleEditImageUpload = (info) => {
    if (info.file.status === "done") {
      setEditImageUrl(info.file.originFileObj);
    }
  };

  // Handle row click to see product details
  const handleRowClick = (record) => {
    setSelectedProduct(record);
    setCurrentView("productDetails");
    fetchProductHistory(record.id);
  };

  // Open edit category modal
  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    categoryForm.setFieldsValue({
      name: category.name,
      description: category.description,
    });
    setShowCategoryModal(true);
  };

  // Open edit product modal
  const handleOpenEditModal = () => {
    // Parse price from string (e.g., "Rs.205" -> 205)
    const priceValue = selectedProduct.price
      ? parseFloat(selectedProduct.price.replace("Rs.", ""))
      : 0;

    // Initialize form with current product values
    editProductForm.setFieldsValue({
      name: selectedProduct.name,
      category: selectedProduct.category,
      price: priceValue,
      type: selectedProduct.type,
      threshold: selectedProduct.threshold,
      supplier:
        selectedProduct.supplier !== "Not specified"
          ? selectedProduct.supplier
          : "",
      contactNumber:
        selectedProduct.contactNumber !== "Not specified"
          ? selectedProduct.contactNumber
          : "",
      expiryDate:
        selectedProduct.expiryDate !== "N/A" ? selectedProduct.expiryDate : "",
    });

    // Reset image URL for editing
    setEditImageUrl(selectedProduct.image);

    // Show the edit modal
    setShowEditModal(true);
  };

  // Column definitions for the product table
  const productColumns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price", // Add price column
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => `${quantity} ${record.unit || "Units"}`,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
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

  // Column definitions for the categories table
  const categoryColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditCategory(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCategory(record.id)}
          />
        </Space>
      ),
    },
  ];

  // Column definitions for the product history table
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
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => `${quantity} ${selectedProduct?.unit || "Units"}`,
    },
    // {
    //   title: "Buying Price",
    //   dataIndex: "buying_price",
    //   key: "buying_price",
    // },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  // Render different views based on state
  const renderView = () => {
    switch (currentView) {
      case "productDetails":
        return renderProductDetailsView();
      case "categories":
        return renderCategoriesView();
      default:
        return renderInventoryView();
    }
  };

  // Inventory main view
  const renderInventoryView = () => (
    <>
      {/* Summary Cards */}
      <div className="mb-6">
        <Card>
          <Title level={4}>Inventory Overview</Title>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Card.Grid
              style={{
                width: "33.33%",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => setCurrentView("categories")}
            >
              <Statistic
                title="Categories"
                value={stats.categoriesCount || categories.length}
                valueStyle={{ color: "#1890ff" }}
              />
              <Text type="secondary">Click to view</Text>
            </Card.Grid>

            <Card.Grid
              style={{
                width: "33.33%",
                textAlign: "center",
              }}
            >
              <Statistic
                title="Low Stock"
                value={stats.lowStockCount || 0}
                valueStyle={{ color: "#faad14" }}
              />
              <Text type="secondary">Need reorder</Text>
            </Card.Grid>

            <Card.Grid
              style={{
                width: "33.33%",
                textAlign: "center",
              }}
            >
              <Statistic
                title="Out of Stock"
                value={stats.emptyStockCount || 0}
                valueStyle={{ color: "#ff4d4f" }}
              />
              <Text type="secondary">Not in stock</Text>
            </Card.Grid>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card
        title={<Title level={4}>Products</Title>}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                productForm.resetFields();
                setImageUrl(null);
                setShowAddModal(true);
              }}
            >
              Add Product
            </Button>
            <Button icon={<FilterOutlined />}>Filters</Button>
          </Space>
        }
      >
        <Table
          columns={productColumns}
          dataSource={products}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          className="cursor-pointer"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
    </>
  );

  // Categories view
  const renderCategoriesView = () => (
    <Card
      title={<Title level={4}>Categories</Title>}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setCurrentCategory(null);
            categoryForm.resetFields();
            setShowCategoryModal(true);
          }}
        >
          Add Category
        </Button>
      }
    >
      <Table
        columns={categoryColumns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <div style={{ marginTop: "16px" }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => setCurrentView("inventory")}
        >
          Back to inventory
        </Button>
      </div>
    </Card>
  );

  // Product details view
  const renderProductDetailsView = () => (
    <Card
      title={<Title level={4}>{selectedProduct?.name}</Title>}
      extra={
        <Button icon={<EditOutlined />} onClick={handleOpenEditModal}>
          Edit
        </Button>
      }
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Overview" key="1">
          <div style={{ display: "flex" }}>
            {/* Left side - Details */}
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
                <Text>{selectedProduct?.productId}</Text>

                <Text strong>Product name</Text>
                <Text>{selectedProduct?.name}</Text>

                <Text strong>Product category</Text>
                <Text>{selectedProduct?.category}</Text>

                <Text strong>Price</Text>
                <Text>{selectedProduct?.price}</Text>

                <Text strong>Stock quantity</Text>
                <Text>
                  {selectedProduct?.remainingStock || selectedProduct?.quantity}
                </Text>

                <Text strong>Unit type</Text>
                <Text>{selectedProduct?.unit || "Units"}</Text>

                <Text strong>Units per package</Text>
                <Text>{selectedProduct?.unitsPerPackage || "1"}</Text>

                <Text strong>Threshold</Text>
                <Text>{selectedProduct?.threshold}</Text>

                <Text strong>Expiry Date</Text>
                <Text>
                  {productHistory.length > 0
                    ? productHistory.sort(
                        (a, b) =>
                          new Date(a.expiryDate) - new Date(b.expiryDate)
                      )[0]?.expiryDate
                    : "N/A"}
                </Text>

                <Text strong>Supplier</Text>
                <Text>{selectedProduct?.supplier}</Text>

                {selectedProduct?.contactNumber && (
                  <>
                    <Text strong>Contact Number</Text>
                    <Text>{selectedProduct?.contactNumber}</Text>
                  </>
                )}
              </div>
            </div>

            {/* Right side - Image */}
            <div style={{ width: "34%" }}>
              <div style={{ marginBottom: 24, textAlign: "center" }}>
                <Avatar
                  shape="square"
                  size={150}
                  src={selectedProduct?.image}
                  style={{ border: "1px dashed #d9d9d9", padding: 8 }}
                />
              </div>
            </div>
          </div>

          {/* Delete button */}
          <div style={{ marginTop: 24, textAlign: "right" }}>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeleteProduct}
            >
              Delete
            </Button>
          </div>

          {/* Back button */}
          <div style={{ marginTop: 16 }}>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => setCurrentView("inventory")}
            >
              Back to products
            </Button>
          </div>
        </TabPane>
        <TabPane tab="History" key="2">
          {/* Product History Table */}
          <Card>
            <Table
              columns={historyColumns}
              dataSource={productHistory}
              rowKey={(record) =>
                `history-${
                  record.id ||
                  record.orderId ||
                  Math.random().toString(36).substr(2, 9)
                }`
              }
              pagination={{ pageSize: 5 }}
              loading={loading}
            />
          </Card>
        </TabPane>
      </Tabs>
    </Card>
  );

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      {renderView()}

      {/* Add Product Modal */}
      <Modal
        title="Add New Product"
        open={showAddModal}
        onCancel={() => {
          setShowAddModal(false);
          productForm.resetFields();
          setImageUrl(null);
        }}
        footer={null}
        width={600}
      >
        <Form form={productForm} layout="vertical" onFinish={handleAddProduct}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Upload
              name="image"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              // Remove or update this line:
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              beforeUpload={(file) => {
                // Validate file type
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                  return Upload.LIST_IGNORE;
                }

                // Store file to state instead of uploading immediately
                setImageUrl(file);
                return false; // Prevent upload
              }}
            >
              {imageUrl ? (
                <img
                  src={
                    typeof imageUrl === "string"
                      ? imageUrl
                      : URL.createObjectURL(imageUrl)
                  }
                  alt="Product"
                  style={{ width: "100%" }}
                />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </div>

          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: "Please enter product name" },
              { min: 2, message: "Product name must be at least 2 characters" },
              {
                max: 100,
                message: "Product name cannot exceed 100 characters",
              },
            ]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              placeholder="Select product category"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: "Please enter price" },
              {
                validator: (_, value) => {
                  if (value && (isNaN(value) || value <= 0)) {
                    return Promise.reject(
                      "Please enter a valid positive number"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              addonBefore="Rs."
              style={{ width: "100%" }}
              min={0.01}
              step={0.01}
              precision={2}
              // Prevent typing non-numeric characters
              onKeyPress={(e) => {
                if (e.key === "-" || isNaN(Number(e.key))) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select product type" }]}
          >
            <Select placeholder="Select product type">
              <Option value="Prescription Required">
                Prescription Required
              </Option>
              <Option value="No Prescription">No Prescription</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="threshold"
            label="Stock Threshold"
            help="Minimum stock level before warning"
            rules={[
              { required: true, message: "Please enter threshold" },
              {
                validator: (_, value) => {
                  if (value && (isNaN(value) || value <= 0)) {
                    return Promise.reject(
                      "Please enter a valid positive integer"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder="Threshold quantity"
              style={{ width: "100%" }}
              min={1}
              precision={0}
              // Prevent typing non-numeric characters
              onKeyPress={(e) => {
                if (e.key === "-" || isNaN(Number(e.key))) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button
              onClick={() => {
                setShowAddModal(false);
                productForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add Product
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        title="Edit Product"
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          editProductForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editProductForm}
          layout="vertical"
          onFinish={handleEditProduct}
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              onChange={handleEditImageUpload}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                }
                return isImage;
              }}
            >
              {editImageUrl ? (
                <img
                  src={
                    typeof editImageUrl === "string"
                      ? editImageUrl
                      : URL.createObjectURL(editImageUrl)
                  }
                  alt="Product"
                  style={{ width: "100%" }}
                />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </div>

          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: "Please enter product name" },
              { min: 2, message: "Product name must be at least 2 characters" },
              {
                max: 100,
                message: "Product name cannot exceed 100 characters",
              },
            ]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              placeholder="Select product category"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: "Please enter price" },
              {
                validator: (_, value) => {
                  if (value && (isNaN(value) || value <= 0)) {
                    return Promise.reject(
                      "Please enter a valid positive number"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              addonBefore="Rs."
              style={{ width: "100%" }}
              min={0.01}
              step={0.01}
              precision={2}
              // Prevent typing non-numeric characters
              onKeyPress={(e) => {
                if (e.key === "-" || isNaN(Number(e.key))) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select product type" }]}
          >
            <Select placeholder="Select product type">
              <Option value="Prescription Required">
                Prescription Required
              </Option>
              <Option value="No Prescription">No Prescription</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="threshold"
            label="Stock Threshold"
            help="Minimum stock level before warning"
            rules={[
              { required: true, message: "Please enter threshold" },
              {
                validator: (_, value) => {
                  if (value && (isNaN(value) || value <= 0)) {
                    return Promise.reject(
                      "Please enter a valid positive integer"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder="Threshold quantity"
              style={{ width: "100%" }}
              min={1}
              precision={0}
              // Prevent typing non-numeric characters
              onKeyPress={(e) => {
                if (e.key === "-" || isNaN(Number(e.key))) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button
              onClick={() => {
                setShowEditModal(false);
                editProductForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Update Product
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Category Modal */}
      <Modal
        title={currentCategory ? "Edit Category" : "Add New Category"}
        open={showCategoryModal}
        onCancel={() => {
          setShowCategoryModal(false);
          categoryForm.resetFields();
          setCurrentCategory(null);
        }}
        footer={null}
      >
        <Form
          form={categoryForm}
          layout="vertical"
          onFinish={handleCategorySubmit}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter category name" },
              {
                min: 2,
                message: "Category name must be at least 2 characters",
              },
              { max: 50, message: "Category name cannot exceed 50 characters" },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { max: 200, message: "Description cannot exceed 200 characters" },
            ]}
          >
            <Input.TextArea placeholder="Enter category description" rows={3} />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button
              onClick={() => {
                setShowCategoryModal(false);
                categoryForm.resetFields();
                setCurrentCategory(null);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {currentCategory ? "Update" : "Add"} Category
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Inventory;
