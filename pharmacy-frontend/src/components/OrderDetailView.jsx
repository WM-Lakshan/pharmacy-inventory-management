import React from "react";
import { Button, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { UNIT_TYPES, INVALID_NESTING } from "../constants/units";

const OrderDetailView = ({ order, onEdit, onDelete, onBack }) => {
  const productColumns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Unit Type",
      dataIndex: "unit_type",
      key: "unit_type",
      render: (value) => {
        // Find the unit type or default to 'unit' if undefined
        const unitType = value || "unit";
        return UNIT_TYPES.find((u) => u.value === unitType)?.label || unitType;
      },
    },
    {
      title: "Units/Package",
      dataIndex: "units_per_package",
      key: "units_per_package",
      render: (value, record) => {
        // Use provided unit_type or default to 'unit'
        const unitType = record.unit_type || "unit";
        // Check if the unit type is singular
        return UNIT_TYPES.find((u) => u.value === unitType)?.singular
          ? "N/A"
          : value || 1; // Default to 1 if value is missing
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Expired Date",
      dataIndex: "expired_date",
      key: "expired_date",
      render: (value) => value || "Not specified",
    },
    {
      title: "Buying Price",
      dataIndex: "buying_price",
      key: "buying_price",
      render: (price) => `Rs.${price}`,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => `Rs.${value}`,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">View Order</h2>
        <div className="flex gap-2">
          <Button icon={<EditOutlined />} onClick={onEdit}>
            Edit
          </Button>
          <Button danger onClick={() => onDelete(order.order_id)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-gray-500 mb-1">Order ID</p>
          <p className="font-medium">{order.order_id}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Supplier Id</p>
          <p className="font-medium">{order.supplier_id}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Supplier Name</p>
          <p className="font-medium">
            {order.supplier_name || "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Manager ID</p>
          <p className="font-medium">{order.manager_id}</p>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4">Products</h3>
      <Table
        columns={productColumns}
        dataSource={order.products.map((product) => ({
          ...product,
          unit_type: product.unit_type || "unit",
          units_per_package: product.units_per_package || 1,
        }))}
        rowKey={(record) => record.product_id.toString()}
        pagination={false}
      />

      <div className="mt-6 text-right">
        <p className="text-lg font-medium">
          Total value: Rs.{order.total_value || 0}
        </p>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={onBack}>Back to List</Button>
      </div>
    </div>
  );
};

export default OrderDetailView;
