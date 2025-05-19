import React, { useState, useEffect } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import axios from "axios";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   window.location.href = "/login"; // Or useNavigate()
    //   return;
    // }

    fetchCategories(); // Only runs if token exists
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      // Note: You would replace this with your axios call in your implementation
      const response = await axios.get("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // For demo purposes, using the sample data
      // In a real implementation, you would get this data from your API
      setTimeout(() => {
        setCategories(sampleData);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    window.location.href = "/login";
  };

  // Sample data matching your example
  const sampleData = [
    { id: 2, name: "antibiotics", description: "bla bla bla" },
    { id: 1, name: "CategoryNameH", description: "CategoryDescription" },
    { id: 3, name: "syraps", description: "drink" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md flex justify-between items-center px-6 py-3">
        <h1 className="text-xl font-bold text-blue-800">Staff Dashboard</h1>
        <div className="space-x-2 flex">
          <button
            onClick={fetchCategories}
            className="px-3 py-2 border border-blue-500 text-blue-500 rounded-md flex items-center hover:bg-blue-50"
          >
            <RefreshCw size={16} className="mr-2" /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-500 text-white rounded-md flex items-center hover:bg-red-600"
          >
            <LogOut size={16} className="mr-2" /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="bg-white p-6 rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Categories</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-600">Loading categories...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchCategories}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer
      <footer className="text-center bg-gray-100 p-3 text-sm text-gray-600 mt-auto">
        Categories Management System © {new Date().getFullYear()}
      </footer> */}
    </div>
  );
};

export default CategoriesPage;
