// import React, { useState, useEffect } from "react";
// import api from "../../services/api";
// import InventorySummary from "../inventory/InventorySummary";
// import ProductTable from "../inventory/ProductTable";
// import ProductDetails from "../inventory/ProductDetails";
// import CategoryTable from "../inventory/CategoryTable";
// import AddEditProduct from "../inventory/AddEditProduct";
// import AddEditCategory from "../inventory/AddEditCategory";
// import { message } from "antd";

// const Inventory = () => {
//   // Views state: 'inventory', 'productDetails', 'categories'
//   const [currentView, setCurrentView] = useState("inventory");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showAddProductModal, setShowAddProductModal] = useState(false);
//   const [showEditProductModal, setShowEditProductModal] = useState(false);
//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [productHistory, setProductHistory] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [stats, setStats] = useState({
//     categoriesCount: 0,
//     lowStockCount: 0,
//     emptyStockCount: 0,
//   });

//   // Fetch all initial data
//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//     fetchStats();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await api.products.getAll();
//       console.log("Products API response:", response);
//       // Access the products array from response.data.products
//       setProducts(response.data.products || []); // Changed this line
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       message.error("Failed to load products");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await api.categories.getAll();
//       // Check if categories are nested under response.data.categories
//       setCategories(response.data.categories || response.data || []);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       message.error("Failed to load categories");
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchStats = async () => {
//     try {
//       const response = await api.products.getStats();
//       setStats({
//         categoriesCount: response.data.categoriesCount,
//         lowStockCount: response.data.lowStockCount,
//         emptyStockCount: response.data.emptyStockCount,
//       });
//     } catch (error) {
//       console.error("Error fetching stats:", error);
//     }
//   };

//   const fetchProductHistory = async (productId) => {
//     try {
//       setLoading(true);
//       const response = await api.products.getHistory(productId);
//       setProductHistory(response.data);
//     } catch (error) {
//       console.error("Error fetching product history:", error);
//       message.error("Failed to load product history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Category handlers
//   const handleCategorySubmit = async (values) => {
//     try {
//       setLoading(true);
//       if (currentCategory) {
//         const response = await api.categories.update(
//           currentCategory.id,
//           values
//         );
//         setCategories(
//           categories.map((cat) =>
//             cat.id === currentCategory.id ? response.data : cat
//           )
//         );
//         message.success("Category updated successfully");
//       } else {
//         const response = await api.categories.create(values);
//         setCategories([...categories, response.data]);
//         message.success("Category added successfully");
//       }
//       setShowCategoryModal(false);
//       setCurrentCategory(null);
//       fetchStats();
//     } catch (error) {
//       console.error("Error saving category:", error);
//       message.error(error.response?.data?.message || "Failed to save category");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     try {
//       setLoading(true);
//       await api.categories.delete(categoryId);
//       setCategories(categories.filter((cat) => cat.id !== categoryId));
//       message.success("Category deleted successfully");
//       fetchStats();
//     } catch (error) {
//       console.error("Error deleting category:", error);
//       message.error(
//         error.response?.data?.message || "Failed to delete category"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Product handlers
//   const handleAddProduct = async (values) => {
//     try {
//       setLoading(true);
//       const response = await api.products.create(values);
//       setProducts([...products, response.data]);
//       setShowAddProductModal(false);
//       message.success("Product added successfully");
//       fetchStats();
//     } catch (error) {
//       console.error("Error adding product:", error);
//       message.error(error.response?.data?.message || "Failed to add product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditProduct = async (values) => {
//     try {
//       setLoading(true);
//       const response = await api.products.update(selectedProduct.id, values);
//       const updatedProduct = response.data;
//       setProducts(
//         products.map((product) =>
//           product.id === selectedProduct.id ? updatedProduct : product
//         )
//       );
//       setSelectedProduct(updatedProduct);
//       setShowEditProductModal(false);
//       message.success("Product updated successfully");
//       fetchStats();
//     } catch (error) {
//       console.error("Error updating product:", error);
//       message.error(
//         error.response?.data?.message || "Failed to update product"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProduct = async () => {
//     try {
//       setLoading(true);
//       await api.products.delete(selectedProduct.id);
//       setProducts(products.filter((p) => p.id !== selectedProduct.id));
//       setCurrentView("inventory");
//       message.success("Product deleted successfully");
//       fetchStats();
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       message.error(
//         error.response?.data?.message || "Failed to delete product"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProductSelect = (product) => {
//     setSelectedProduct(product);
//     setCurrentView("productDetails");
//     fetchProductHistory(product.id);
//   };

//   // Render based on current view
//   const renderContent = () => {
//     switch (currentView) {
//       case "productDetails":
//         return (
//           <ProductDetails
//             product={selectedProduct}
//             history={productHistory}
//             onEdit={() => setShowEditProductModal(true)}
//             onDelete={handleDeleteProduct}
//             onBack={() => setCurrentView("inventory")}
//           />
//         );
//       case "categories":
//         return (
//           <CategoryTable
//             categories={categories}
//             loading={loading}
//             onEdit={handleEditCategory}
//             onDelete={handleDeleteCategory}
//             onAdd={() => {
//               setCurrentCategory(null);
//               setShowCategoryModal(true);
//             }}
//             onBack={() => setCurrentView("inventory")}
//           />
//         );
//       default:
//         return (
//           <>
//             <InventorySummary
//               categoriesCount={stats.categoriesCount}
//               lowStockCount={stats.lowStockCount}
//               emptyStockCount={stats.emptyStockCount}
//               onCategoriesClick={() => setCurrentView("categories")}
//             />
//             <ProductTable
//               products={products}
//               onSelect={handleProductSelect}
//               onAdd={() => setShowAddProductModal(true)}
//               loading={loading}
//             />
//           </>
//         );
//     }
//   };

//   return (
//     <div className="p-6 bg-white shadow rounded-lg">
//       {renderContent()}

//       {/* Modals */}
//       <AddEditProduct
//         visible={showAddProductModal}
//         onCancel={() => setShowAddProductModal(false)}
//         onSubmit={handleAddProduct}
//         categories={categories}
//         isEdit={false}
//       />

//       <AddEditProduct
//         visible={showEditProductModal}
//         onCancel={() => setShowEditProductModal(false)}
//         onSubmit={handleEditProduct}
//         categories={categories}
//         initialValues={selectedProduct}
//         isEdit={true}
//       />

//       <AddEditCategory
//         visible={showCategoryModal}
//         onCancel={() => {
//           setShowCategoryModal(false);
//           setCurrentCategory(null);
//         }}
//         onSubmit={handleCategorySubmit}
//         category={currentCategory}
//         loading={loading}
//       />
//     </div>
//   );
// };

// export default Inventory;

// components/inventory/Inventory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import InventorySummary from "./InventorySummary";
import ProductTable from "./ProductTable";
import ProductDetails from "./ProductDetails";
import CategoryTable from "./CategoryTable";
import AddEditProduct from "./AddEditProduct";
import AddEditCategory from "./AddEditCategory";
import { message } from "antd";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Inventory = () => {
  // Views state: 'inventory', 'productDetails', 'categories'
  const [currentView, setCurrentView] = useState("inventory");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productHistory, setProductHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    categoriesCount: 0,
    lowStockCount: 0,
    emptyStockCount: 0,
  });

  // Fetch all initial data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchStats();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        setProducts(response.data.products || []);
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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        setCategories(response.data.categories || []);
      } else {
        throw new Error(response.data?.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/products/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        setStats(
          response.data.stats || {
            categoriesCount: 0,
            lowStockCount: 0,
            emptyStockCount: 0,
          }
        );
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchProductHistory = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/products/${productId}/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.success) {
        setProductHistory(response.data.history || []);
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch product history"
        );
      }
    } catch (error) {
      console.error("Error fetching product history:", error);
      message.error("Failed to load product history");
    } finally {
      setLoading(false);
    }
  };

  // Category handlers
  const handleCategorySubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (currentCategory) {
        // Update existing category
        const response = await axios.put(
          `${API_URL}/categories/${currentCategory.id}`,
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && response.data.success) {
          setCategories(
            categories.map((cat) =>
              cat.id === currentCategory.id ? response.data.category : cat
            )
          );
          message.success("Category updated successfully");
        } else {
          throw new Error(
            response.data?.message || "Failed to update category"
          );
        }
      } else {
        // Create new category
        const response = await axios.post(`${API_URL}/categories`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.success) {
          setCategories([...categories, response.data.category]);
          message.success("Category added successfully");
        } else {
          throw new Error(response.data?.message || "Failed to add category");
        }
      }

      setShowCategoryModal(false);
      setCurrentCategory(null);
      fetchStats();
    } catch (error) {
      console.error("Error saving category:", error);
      message.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/categories/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.success) {
        setCategories(categories.filter((cat) => cat.id !== categoryId));
        message.success("Category deleted successfully");
        fetchStats();
      } else {
        throw new Error(response.data?.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error(
        error.response?.data?.message || "Failed to delete category"
      );
    } finally {
      setLoading(false);
    }
  };

  // Product handlers
  const handleAddProduct = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formData = new FormData();

      // Add all form values to FormData
      Object.keys(values).forEach((key) => {
        if (key !== "image" || !values[key]) {
          formData.append(key, values[key]);
        }
      });

      // Add image if exists
      if (values.image && values.image instanceof File) {
        formData.append("image", values.image);
      }

      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.success) {
        setProducts([...products, response.data.product]);
        setShowAddProductModal(false);
        message.success("Product added successfully");
        fetchStats();
      } else {
        throw new Error(response.data?.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      message.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formData = new FormData();

      // Add all form values to FormData
      Object.keys(values).forEach((key) => {
        if (key !== "image" || !values[key]) {
          formData.append(key, values[key]);
        }
      });

      // Continuing from handleEditProduct function...
      // Add image if it's a file (not a string URL)
      if (values.image && values.image instanceof File) {
        formData.append("image", values.image);
      }

      const response = await axios.put(
        `${API_URL}/products/${selectedProduct.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.success) {
        const updatedProduct = response.data.product;
        setProducts(
          products.map((product) =>
            product.id === selectedProduct.id ? updatedProduct : product
          )
        );
        setSelectedProduct(updatedProduct);
        setShowEditProductModal(false);
        message.success("Product updated successfully");
        fetchStats();
      } else {
        throw new Error(response.data?.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error(
        error.response?.data?.message || "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/products/${selectedProduct.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.success) {
        setProducts(products.filter((p) => p.id !== selectedProduct.id));
        setCurrentView("inventory");
        message.success("Product deleted successfully");
        fetchStats();
      } else {
        throw new Error(response.data?.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error(
        error.response?.data?.message || "Failed to delete product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setCurrentView("productDetails");
    fetchProductHistory(product.id);
  };

  // Render based on current view
  const renderContent = () => {
    switch (currentView) {
      case "productDetails":
        return (
          <ProductDetails
            product={selectedProduct}
            history={productHistory}
            onEdit={() => setShowEditProductModal(true)}
            onDelete={handleDeleteProduct}
            onBack={() => setCurrentView("inventory")}
          />
        );
      case "categories":
        return (
          <CategoryTable
            categories={categories}
            loading={loading}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onAdd={() => {
              setCurrentCategory(null);
              setShowCategoryModal(true);
            }}
            onBack={() => setCurrentView("inventory")}
          />
        );
      default:
        return (
          <>
            <InventorySummary
              categoriesCount={stats.categoriesCount}
              lowStockCount={stats.lowStockCount}
              emptyStockCount={stats.emptyStockCount}
              onCategoriesClick={() => setCurrentView("categories")}
            />
            <ProductTable
              products={products}
              onSelect={handleProductSelect}
              onAdd={() => setShowAddProductModal(true)}
              loading={loading}
            />
          </>
        );
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      {renderContent()}

      {/* Modals */}
      <AddEditProduct
        visible={showAddProductModal}
        onCancel={() => setShowAddProductModal(false)}
        onSubmit={handleAddProduct}
        categories={categories}
        isEdit={false}
      />

      <AddEditProduct
        visible={showEditProductModal}
        onCancel={() => setShowEditProductModal(false)}
        onSubmit={handleEditProduct}
        categories={categories}
        initialValues={selectedProduct}
        isEdit={true}
      />

      <AddEditCategory
        visible={showCategoryModal}
        onCancel={() => {
          setShowCategoryModal(false);
          setCurrentCategory(null);
        }}
        onSubmit={handleCategorySubmit}
        category={currentCategory}
        loading={loading}
      />
    </div>
  );
};

export default Inventory;
