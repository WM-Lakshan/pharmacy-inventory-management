import React, { useState, useEffect } from "react";
import {
  Menu,
  Checkbox,
  Slider,
  Divider,
  Tag,
  Typography,
  Button,
  Radio,
} from "antd";
import { FilterOutlined, ClearOutlined } from "@ant-design/icons";
import axios from "axios";

const { SubMenu } = Menu;
const { Title } = Typography;

const CategorySidebar = ({
  onCategoryChange,
  onPriceRangeChange,
  onAvailabilityChange,
  onPrescriptionChange,
  onFilterClear,
  defaultCategory = "all",
  defaultPriceRange = [0, 5000],
  defaultAvailability = true,
  defaultPrescriptionRequired = null,
}) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [priceRange, setPriceRange] = useState(defaultPriceRange);
  const [showOnlyAvailable, setShowOnlyAvailable] =
    useState(defaultAvailability);
  const [prescriptionRequired, setPrescriptionRequired] = useState(
    defaultPrescriptionRequired
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/categories");

      // For demo purposes, if API fails or not available
      if (!response.data || !response.data.categories) {
        setMockCategories();
        return;
      }

      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMockCategories();
    } finally {
      setLoading(false);
    }
  };

  const setMockCategories = () => {
    // Mock data for testing
    const mockCategories = [
      { id: "all", name: "All Categories", count: 120 },
      { id: "pain-relief", name: "Pain Relief", count: 25 },
      { id: "cough-cold", name: "Cough & Cold", count: 18 },
      { id: "vitamins", name: "Vitamins & Supplements", count: 32 },
      { id: "first-aid", name: "First Aid", count: 15 },
      { id: "personal-care", name: "Personal Care", count: 30 },
    ];

    setCategories(mockCategories);
  };

  const handleCategorySelect = ({ key }) => {
    setSelectedCategory(key);
    onCategoryChange(key);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handlePriceAfterChange = (value) => {
    onPriceRangeChange(value);
  };

  const handleAvailabilityChange = (e) => {
    setShowOnlyAvailable(e.target.checked);
    onAvailabilityChange(e.target.checked);
  };

  const handlePrescriptionChange = (value) => {
    setPrescriptionRequired(value);
    onPrescriptionChange(value);
  };

  const handleClearFilters = () => {
    setSelectedCategory(defaultCategory);
    setPriceRange(defaultPriceRange);
    setShowOnlyAvailable(defaultAvailability);
    setPrescriptionRequired(null);
    onFilterClear();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <Title level={5} className="m-0">
          Filters
        </Title>
        <Button
          icon={<ClearOutlined />}
          type="text"
          size="small"
          onClick={handleClearFilters}
        >
          Clear All
        </Button>
      </div>

      <Divider className="my-3" />

      <div className="mb-6">
        <Title level={5}>Categories</Title>
        <Menu
          mode="inline"
          selectedKeys={[selectedCategory]}
          onSelect={handleCategorySelect}
          className="border-r-0"
        >
          {categories.map((category) => (
            <Menu.Item key={category.id}>
              <span>{category.name}</span>
              <Tag className="ml-2">{category.count}</Tag>
            </Menu.Item>
          ))}
        </Menu>
      </div>

      <Divider className="my-3" />

      <div className="mb-6">
        <Title level={5}>Price Range</Title>
        <div className="px-2">
          <Slider
            range
            min={0}
            max={5000}
            value={priceRange}
            onChange={handlePriceChange}
            onAfterChange={handlePriceAfterChange}
            tipFormatter={(value) => `Rs.${value}`}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Rs.{priceRange[0]}</span>
            <span>Rs.{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Divider className="my-3" />

      <div className="mb-6">
        <Title level={5}>Availability</Title>
        <Checkbox
          checked={showOnlyAvailable}
          onChange={handleAvailabilityChange}
        >
          Show in-stock items only
        </Checkbox>
      </div>

      <Divider className="my-3" />

      <div className="mb-4">
        <Title level={5}>Prescription</Title>
        <div className="flex flex-col space-y-2">
          <Radio.Group
            value={prescriptionRequired}
            onChange={(e) => handlePrescriptionChange(e.target.value)}
          >
            <Radio value={null}>All Products</Radio>
            <Radio value={false}>No Prescription Needed</Radio>
            <Radio value={true}>Prescription Required</Radio>
          </Radio.Group>
        </div>
      </div>

      <Divider className="my-3" />

      <Button
        type="primary"
        icon={<FilterOutlined />}
        block
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => {
          // Apply all filters at once, if needed
          onCategoryChange(selectedCategory);
          onPriceRangeChange(priceRange);
          onAvailabilityChange(showOnlyAvailable);
          onPrescriptionChange(prescriptionRequired);
        }}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default CategorySidebar;
