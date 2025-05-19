import React from "react";
import { Button, Spin, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const OrdersTable = ({ orders, loading, onView, onAdd }) => {
  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "Order Value",
      dataIndex: "total_value",
      key: "total_value",
    },
    {
      title: "Manager ID",
      dataIndex: "manager_id",
      key: "manager_id",
    },
    // {
    //   title: "Supplier ID",
    //   dataIndex: "supplier_id",
    //   key: "supplier_id",
    // },
    {
      title: "Created Date",
      dataIndex: "order_date",
      key: "order_date",
    },
    // {
    //   title: "Expected Delivery",
    //   dataIndex: "expected_date",
    //   key: "expected_date",
    // },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
          className="bg-blue-500"
        >
          Add Order
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <Spin />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="order_id"
          onRow={(record) => ({
            onClick: () => onView(record),
            style: { cursor: "pointer" }, // Makes the row appear clickable
          })}
          // Customize row className for hover effect
          rowClassName={() => "clickable-table-row"}
        />
      )}
    </div>
  );
};

export default OrdersTable;
