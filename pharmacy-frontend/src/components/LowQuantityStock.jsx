import React from "react";
import LowQuantityStockItem from "./LowQuantityStockItem";

const LowQuantityStock = ({ items }) => {
  return (
    <div className="low-quantity-stock">
      <h3>Low Quantity Stock</h3>
      {items.map((item, index) => (
        <LowQuantityStockItem
          key={index}
          id={item.id}
          name={item.name}
          remainingQuantity={item.remainingQuantity}
        />
      ))}
    </div>
  );
};

export default LowQuantityStock;
