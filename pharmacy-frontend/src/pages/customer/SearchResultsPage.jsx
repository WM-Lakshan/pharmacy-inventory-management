import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Empty,
  Spin,
  Pagination,
  Breadcrumb,
  Select,
  Button,
  message,
  Result,
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import axios from "axios";
// import Header from "../../components/customer/Header";
// import Footer from "../../components/customer/Footer";
import CategorySidebar from "../../components/customer/CategorySidebar";
import ProductCard from "../../components/customer/ProductCard";

const { Option } = Select;

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";
  const categoryParam = queryParams.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [sortBy, setSortBy] = useState("relevance");
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [availabilityFilter, setAvailabilityFilter] = useState(true);
  const [prescriptionFilter, setPrescriptionFilter] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categoryParam]);

  useEffect(() => {
    applyFilters();
  }, [
    products,
    sortBy,
    categoryFilter,
    priceRange,
    availabilityFilter,
    prescriptionFilter,
  ]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get("/api/products/search", {
        params: {
          query: searchQuery,
          category: categoryParam !== "all" ? categoryParam : undefined,
          page: currentPage,
          pageSize,
        },
      });

      // For demo purposes, if API fails or not available
      if (!response.data) {
        setMockProducts();
        return;
      }

      setProducts(response.data.products);
      setTotalProducts(response.data.total);
    } catch (error) {
      console.error("Error searching products:", error);
      message.error("Failed to load search results. Please try again.");
      setMockProducts();
    } finally {
      setLoading(false);
    }
  };

  const setMockProducts = () => {
    // Mock data for testing
    const mockData = [];

    // Generate 24 mock products
    for (let i = 1; i <= 24; i++) {
      const requiresPrescription = i % 5 === 0; // Every 5th item requires prescription
      const inStock = i % 8 !== 0; // Every 8th item is out of stock

      mockData.push({
        id: i,
        name: `Product ${i} ${searchQuery ? `- ${searchQuery}` : ""}`,
        price: Math.floor(Math.random() * 4800) + 200, // Random price between 200 and 5000
        image: "/api/placeholder/240/240",
        discount: i % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : 0, // Every 3rd item has a discount
        requiresPrescription,
        inStock,
        category:
          i % 6 === 0
            ? "pain-relief"
            : i % 6 === 1
            ? "cough-cold"
            : i % 6 === 2
            ? "vitamins"
            : i % 6 === 3
            ? "first-aid"
            : i % 6 === 4
            ? "personal-care"
            : "other",
      });
    }

    setProducts(mockData);
    setTotalProducts(mockData.length);
  };

  const applyFilters = () => {
    let results = [...products];

    // Apply category filter
    if (categoryFilter !== "all") {
      results = results.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Apply price range filter
    results = results.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply availability filter
    if (availabilityFilter) {
      results = results.filter((product) => product.inStock);
    }

    // Apply prescription filter
    if (prescriptionFilter !== null) {
      results = results.filter(
        (product) => product.requiresPrescription === prescriptionFilter
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Assuming we'd have a date field
        // For mock data, just use the ID as a proxy for newness
        results.sort((a, b) => b.id - a.id);
        break;
      case "relevance":
      default:
        // Default sorting (relevance) - no additional sorting needed
        break;
    }

    setFilteredProducts(results);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  const handleAvailabilityChange = (checked) => {
    setAvailabilityFilter(checked);
  };

  const handlePrescriptionChange = (value) => {
    setPrescriptionFilter(value);
  };

  const handleClearFilters = () => {
    setCategoryFilter("all");
    setPriceRange([0, 5000]);
    setAvailabilityFilter(true);
    setPrescriptionFilter(null);
  };

  // Calculate pagination
  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item>Search Results</Breadcrumb.Item>
          {searchQuery && <Breadcrumb.Item>{searchQuery}</Breadcrumb.Item>}
        </Breadcrumb>

        <h1 className="text-2xl font-bold mb-6">
          {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
        </h1>

        {/* Mobile Filters Button (visible on small screens) */}
        <div className="md:hidden mb-4">
          <Button
            icon={<FilterOutlined />}
            onClick={() => setMobileFiltersVisible(!mobileFiltersVisible)}
            block
          >
            Filters
          </Button>
        </div>

        <Row gutter={[24, 16]}>
          {/* Sidebar */}
          <Col
            xs={mobileFiltersVisible ? 24 : 0}
            md={6}
            className="transition-all duration-300"
          >
            <CategorySidebar
              onCategoryChange={handleCategoryChange}
              onPriceRangeChange={handlePriceRangeChange}
              onAvailabilityChange={handleAvailabilityChange}
              onPrescriptionChange={handlePrescriptionChange}
              onFilterClear={handleClearFilters}
              defaultCategory={categoryFilter}
              defaultPriceRange={priceRange}
              defaultAvailability={availabilityFilter}
              defaultPrescriptionRequired={prescriptionFilter}
            />
          </Col>

          {/* Main Content */}
          <Col xs={24} md={18}>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Spin size="large" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <Result
                icon={<SearchOutlined />}
                title="No products found"
                subTitle="Try adjusting your search or filter criteria"
                extra={
                  <Button
                    type="primary"
                    onClick={handleClearFilters}
                    className="bg-blue-600"
                  >
                    Clear Filters
                  </Button>
                }
              />
            ) : (
              <>
                {/* Sort and Count */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">
                    {filteredProducts.length} products found
                  </span>

                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600">Sort by:</span>
                    <Select
                      value={sortBy}
                      onChange={handleSortChange}
                      style={{ width: 150 }}
                    >
                      <Option value="relevance">Relevance</Option>
                      <Option value="price-low">Price: Low to High</Option>
                      <Option value="price-high">Price: High to Low</Option>
                      <Option value="newest">Newest</Option>
                    </Select>
                  </div>
                </div>

                {/* Products Grid */}
                <Row gutter={[16, 24]}>
                  {currentProducts.map((product) => (
                    <Col xs={24} sm={12} md={8} lg={8} xl={6} key={product.id}>
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredProducts.length}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </Col>
        </Row>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default SearchResultsPage;
