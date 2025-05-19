// // // src/services/api.js
// // import axios from "axios";

// // const api = axios.create({
// //   baseURL: "http://localhost:5000", // No /api here since Vite handles it
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// // });

// // // Add request interceptor
// // api.interceptors.request.use(
// //   (config) => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // export default {
// //   // Customer endpoints
// //   getProducts: (params) => api.get("/customers/products", { params }),
// //   getProduct: (id) => api.get(`/customers/products/${id}`),
// //   addToCart: (data) => api.post("/customers/cart/add", data),

// //   // Categories
// //   getCategories: () => api.get("/categories"),
// //   getCategory: (id) => api.get(`/categories/${id}`),
// //   createCategory: (data) => api.post("/categories", data),
// //   updateCategory: (id, data) => api.put(`/categories/${id}`, data),
// //   deleteCategory: (id) => api.delete(`/categories/${id}`),

// // };

// // src/services/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// // API service object
// const apiService = {
//   // Raw axios instance for custom requests
//   raw: api,

//   // // Products endpoints
//   // products: {
//   //   getAll: (params) => api.get("/products", { params }),
//   //   getAllCustomers: (params) => api.get("/customers/products", { params }),
//   //   getById: (id) => api.get(`/products/${id}`),
//   //   create: (data) => api.post("/products", data),
//   //   update: (id, data) => api.put(`/products/${id}`, data),
//   //   delete: (id) => api.delete(`/products/${id}`),
//   //   getHistory: (id) => api.get(`/products/${id}/history`),
//   //   getStats: () => api.get("/products/stats"),
//   // },

//   // Categories endpoints
//   categories: {
//     getAll: () => api.get("/categories"),
//     getById: (id) => api.get(`/categories/${id}`),
//     create: (data) => api.post("/categories", data),
//     update: (id, data) => api.put(`/categories/${id}`, data),
//     delete: (id) => api.delete(`/categories/${id}`),
//   },

//   // Inventory endpoints
//   inventory: {
//     getLowStock: () => api.get("/inventory/low-stock"),
//     getExpiringSoon: () => api.get("/inventory/expiring-soon"),
//   },

//   // Customer endpoints
//   customer: {
//     getFeaturedProducts: () => api.get("/customers/products/featured"),
//     getTopSellingProducts: () => api.get("/customers/products/top-selling"),
//     getProfile: () => api.get("/customers/profile"),
//     updateProfile: (data) => api.put("/customers/profile", data),
//     getCart: () => api.get("/customers/cart"),
//     addToCart: (data) => api.post("/customers/cart/add", data),
//     updateCartItem: (data) => api.put("/customers/cart/update-quantity", data),
//     removeCartItem: (id) => api.delete(`/customers/cart/remove/${id}`),
//   },

//   // Products endpoints
//   cusproducts: {
//     getAll: (params) => api.get("/products", { params }),
//     getById: (id) => api.get(`/products/${id}`),
//     getRelated: (id) => api.get(`/products/related/${id}`),
//     search: (params) => api.get("/products/search", { params }),
//   },

//   // Categories endpoints
//   categories: {
//     getAll: () => api.get("/categories"),
//   },

//   // Orders endpoints
//   orders: {
//     getAll: (params) => api.get("/customers/orders", { params }),
//     getById: (id) => api.get(`/customers/orders/${id}`),
//     checkout: (data) => api.post("/customers/checkout", data),
//     processPayment: (data) =>
//       api.post("/customers/checkout/process-payment", data),
//   },

//   // Prescriptions endpoints
//   prescriptions: {
//     getAll: () => api.get("/customers/prescriptions"),
//     getById: (id) => api.get(`/customers/prescriptions/${id}`),
//     upload: (formData) =>
//       api.post("/customers/prescriptions/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }),
//   },

//   // Addresses endpoints
//   addresses: {
//     getAll: () => api.get("/customers/addresses"),
//     add: (data) => api.post("/customers/addresses", data),
//   },

//   // Utils
//   utils: {
//     createMockData: (count = 10, type = "product") => {
//       const mockData = [];

//       for (let i = 1; i <= count; i++) {
//         if (type === "product") {
//           mockData.push({
//             id: i,
//             name: `Product ${i}`,
//             price: Math.floor(Math.random() * 4800) + 200,
//             image: `/api/placeholder/240/240`,
//             discount: i % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : 0,
//             requiresPrescription: i % 5 === 0,
//             inStock: i % 8 !== 0,
//           });
//         }
//       }

//       return mockData;
//     },
//   },
// };

// export default apiService;

// services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Product API endpoints
const productApi = {
  getAll: (params = {}) => instance.get("/products", { params }),
  getById: (id) => instance.get(`/products/${id}`),
  getHistory: (id) => instance.get(`/products/${id}/history`),
  getStats: () => instance.get("/products/stats"),
  create: (data) => {
    const formData = new FormData();

    // Convert regular data fields to form data
    Object.keys(data).forEach((key) => {
      if (key !== "image" || !data[key]) {
        formData.append(key, data[key]);
      }
    });

    // Add image if exists
    if (data.image && data.image instanceof File) {
      formData.append("image", data.image);
    }

    return instance.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, data) => {
    const formData = new FormData();

    // Convert regular data fields to form data
    Object.keys(data).forEach((key) => {
      if (key !== "image" || !data[key]) {
        formData.append(key, data[key]);
      }
    });

    // Add image if exists and is a file
    if (data.image && data.image instanceof File) {
      formData.append("image", data.image);
    }

    return instance.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id) => instance.delete(`/products/${id}`),
};

// Category API endpoints
const categoryApi = {
  getAll: () => instance.get("/categories"),
  getById: (id) => instance.get(`/categories/${id}`),
  create: (data) => instance.post("/categories", data),
  update: (id, data) => instance.put(`/categories/${id}`, data),
  delete: (id) => instance.delete(`/categories/${id}`),
};

// Export API services
const api = {
  products: productApi,
  categories: categoryApi,
};

export default api;
