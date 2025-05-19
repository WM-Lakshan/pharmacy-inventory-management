// import React from "react";
// import { Link } from "react-router-dom";
// import { Card, Button, Tag, message } from "antd";
// import axios from "axios";

// const { Meta } = Card;

// const ProductCard = ({ product }) => {
//   const handleAddToCart = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (product.requiresPrescription) {
//       message.warning(
//         "This product requires a prescription. Please see more details."
//       );
//       return;
//     }

//     if (!product.inStock) {
//       message.error("This product is out of stock.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         message.error("Please login to add products to cart");
//         return;
//       }

//       await axios.post(
//         "/api/cart/add",
//         {
//           productId: product.id,
//           quantity: 1,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       message.success(`${product.name} added to cart`);
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       message.error("Failed to add product to cart");
//     }
//   };

//   return (
//     <Card
//       hoverable
//       variant="borderless"
//       cover={
//         <img
//           alt={product.name}
//           src={product.image || "/api/placeholder/240/240"}
//           className="p-4 h-64 object-contain"
//         />
//       }
//       actions={
//         product.requiresPrescription
//           ? [
//               <Link to={`/product/${product.id}`} key="see-more">
//                 <Button type="primary" ghost>
//                   See More
//                 </Button>
//               </Link>,
//             ]
//           : [
//               <Button
//                 key="add-to-cart"
//                 type="primary"
//                 ghost
//                 disabled={!product.inStock}
//                 onClick={handleAddToCart}
//               >
//                 Add to Cart
//               </Button>,
//               <Link to={`/product/${product.id}`} key="see-more">
//                 <Button type="link">See More</Button>
//               </Link>,
//             ]
//       }
//     >
//       <Meta
//         title={product.name}
//         description={
//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-lg font-semibold text-blue-600">
//                 Rs.{product.price.toFixed(2)}
//               </span>
//               {product.discount > 0 && (
//                 <Tag color="red">{product.discount}% OFF</Tag>
//               )}
//             </div>

//             <div className="flex flex-wrap mt-2 gap-2">
//               {product.requiresPrescription && (
//                 <Tag color="orange">Requires Prescription</Tag>
//               )}

//               {!product.inStock && <Tag color="red">Out of Stock</Tag>}
//             </div>
//           </div>
//         }
//       />
//     </Card>
//   );
// };

// export default ProductCard;

import { Link } from "react-router-dom";
import { Card, Button, Tag, message } from "antd";
import axios from "axios";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.requiresPrescription) {
      message.warning(
        "This product requires a prescription. Please see more details."
      );
      return;
    }

    if (!product.inStock) {
      message.error("This product is out of stock.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login to add products to cart");
        return;
      }

      const response = await axios.post(
        "/api/cart/add",
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        message.success(`${product.name} added to cart`);
      } else {
        message.error(response.data.message || "Failed to add to cart");
      }

      //message.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Failed to add product to cart");
    }
  };

  return (
    <Card
      hoverable
      // Replace 'bordered={false}' with 'variant="borderless"'
      variant="borderless"
      cover={
        <img
          alt={product.name}
          src={product.image || "https://placehold.co/240x240?text=Product"}
          className="p-4 h-64 object-contain"
        />
      }
      actions={
        product.requiresPrescription
          ? [
              <Link to={`/product/${product.id}`} key="see-more">
                <Button type="primary" ghost>
                  See More
                </Button>
              </Link>,
            ]
          : [
              <Button
                key="add-to-cart"
                type="primary"
                ghost
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>,
              <Link to={`/product/${product.id}`} key="see-more">
                <Button type="link">See More</Button>
              </Link>,
            ]
      }
    >
      <Meta
        title={product.name}
        description={
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-blue-600">
                Rs.{product.price.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <Tag color="red">{product.discount}% OFF</Tag>
              )}
            </div>

            <div className="flex flex-wrap mt-2 gap-2">
              {product.requiresPrescription && (
                <Tag color="orange">Requires Prescription</Tag>
              )}

              {!product.inStock && <Tag color="red">Out of Stock</Tag>}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
