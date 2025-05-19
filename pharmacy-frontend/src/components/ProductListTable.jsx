import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductListTable = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'K95',
      buyingPrice: 430,
      quantity: 43,
      expiryDate: '11/12/22',
      availability: 'In-stock'
    },
    {
      id: 2,
      name: 'K95',
      buyingPrice: 257,
      quantity: 22,
      expiryDate: '21/12/22',
      availability: 'Out of stock'
    },
    {
      id: 3,
      name: 'K95',
      buyingPrice: 405,
      quantity: 36,
      expiryDate: '5/12/22',
      availability: 'In-stock'
    },
    {
      id: 4,
      name: 'K95',
      buyingPrice: 502,
      quantity: 14,
      expiryDate: '8/12/22',
      availability: 'Out of stock'
    },
    {
      id: 5,
      name: 'K95',
      buyingPrice: 530,
      quantity: 5,
      expiryDate: '9/1/23',
      availability: 'In-stock'
    },
    {
      id: 6,
      name: 'K95',
      buyingPrice: 605,
      quantity: 10,
      expiryDate: '9/1/23',
      availability: 'In-stock'
    },
    {
      id: 7,
      name: 'K95',
      buyingPrice: 408,
      quantity: 23,
      expiryDate: '15/12/23',
      availability: 'Out of stock'
    },
    {
      id: 8,
      name: 'K95',
      buyingPrice: 359,
      quantity: 43,
      expiryDate: '6/6/23',
      availability: 'In-stock'
    },
    {
      id: 9,
      name: 'K95',
      buyingPrice: 205,
      quantity: 41,
      expiryDate: '11/11/22',
      availability: 'Low stock'
    }
  ]);

  const handleRowClick = (productId) => {
    // Navigate to product details page
    navigate(`/product/${productId}`);
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'In-stock':
        return 'text-green-600';
      case 'Out of stock':
        return 'text-red-600';
      case 'Low stock':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buying Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr 
                key={product.id} 
                onClick={() => handleRowClick(product.id)}
                className="hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
              >
                <td className="px-4 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-4 py-4 whitespace-nowrap">Rs.{product.buyingPrice}</td>
                <td className="px-4 py-4 whitespace-nowrap">{product.quantity} Packets</td>
                <td className="px-4 py-4 whitespace-nowrap">{product.expiryDate}</td>
                <td className={`px-4 py-4 whitespace-nowrap ${getAvailabilityColor(product.availability)}`}>
                  {product.availability}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListTable;