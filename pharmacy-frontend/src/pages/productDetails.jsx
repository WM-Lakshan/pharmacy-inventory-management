import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch product data
    const fetchProduct = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/products/${productId}`);
        // const data = await response.json();

        // Mock data with image URL - this would come from your database
        const mockProduct = {
          name: "K95",
          id: "456567",
          category: "masks",
          expiryDate: "13/4/23",
          supplierName: "Ronald Martin",
          contactNumber: "98789 86757",
          openingStock: 40,
          remainingStock: 34,
          onTheWay: 15,
          threshold: 10,
          imageUrl: "https://example.com/path-to-product-image.jpg", // Add your image URL here
        };

        setProduct(mockProduct);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Replace with actual API call
        // await fetch(`/api/products/${productId}`, { method: 'DELETE' });
        alert("Product deleted successfully");
        // Redirect to products list or another appropriate page
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-white text-red-500">
        Error: {error}
      </div>
    );
  if (!product)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        Product not found
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            {product.imageUrl && (
              <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="flex border-b mb-6">
          <button className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600">
            Overview
          </button>
          <button className="px-4 py-2 font-medium text-gray-500 hover:text-gray-700">
            History
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Primary Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Product name
                </label>
                <p className="mt-1 text-sm">{product.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Product ID
                </label>
                <p className="mt-1 text-sm">{product.id}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Product category
                </label>
                <p className="mt-1 text-sm">{product.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Expiry Date
                </label>
                <p className="mt-1 text-sm">{product.expiryDate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Supplier Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Supplier name
                </label>
                <p className="mt-1 text-sm">{product.supplierName}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Contact Number
                </label>
                <p className="mt-1 text-sm">{product.contactNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Stock Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-500">
                Opening Stock
              </label>
              <p className="mt-1 text-2xl font-semibold">
                {product.openingStock}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-500">
                Remaining Stock
              </label>
              <p className="mt-1 text-2xl font-semibold">
                {product.remainingStock}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-500">
                On the way
              </label>
              <p className="mt-1 text-2xl font-semibold">{product.onTheWay}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-500">
                Threshold
              </label>
              <p className="mt-1 text-2xl font-semibold">{product.threshold}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
