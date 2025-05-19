import React from "react";
import { Link } from "react-router-dom";

const LowQuantityStockItem = ({ id, name, remainingQuantity }) => {
  return (
    <div className="low-quantity-stock-item">
      <Link to={`/product/${id}`}>
        <p>{name}</p>
        <p>Remaining Quantity: {remainingQuantity} Packet</p>
      </Link>
    </div>
  );
};

export default LowQuantityStockItem;
