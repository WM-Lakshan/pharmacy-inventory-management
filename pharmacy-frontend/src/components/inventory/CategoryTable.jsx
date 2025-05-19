import React from "react";
import { Card, Table, Button, Space, Typography, Modal } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { confirm } = Modal;

const CategoryTable = ({
  categories,
  loading,
  onEdit,
  onDelete,
  onAdd,
  onBack,
}) => {
  // Confirmation dialog for delete
  const showDeleteConfirm = (categoryId) => {
    confirm({
      title: "Are you sure you want to delete this category?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        onDelete(categoryId);
      },
    });
  };

  // Column definitions for the categories table
  const categoryColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<Title level={4}>Categories</Title>}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Add Category
        </Button>
      }
    >
      <Table
        columns={categoryColumns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <div style={{ marginTop: "16px" }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack}>
          Back to inventory
        </Button>
      </div>
    </Card>
  );
};

export default CategoryTable;
