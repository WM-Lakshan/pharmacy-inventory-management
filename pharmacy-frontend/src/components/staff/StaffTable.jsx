import React from "react";
import { Table, Button, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const StaffTable = ({ staffMembers, loading, onRowClick, onAddMember }) => {
  const columns = [
    {
      title: "Staff ID",
      dataIndex: "pharmacy_staff_id",
      key: "pharmacy_staff_id",
    },
    {
      title: "Name",
      key: "name",
      render: (record) => `${record.F_name} ${record.L_name}`,
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      render: (salary) => `Rs.${salary?.toLocaleString() || "0"}`,
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Staff Members</h2>
        <div className="flex space-x-2 gap-4 ml-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddMember}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Add Staff Member
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={staffMembers}
        rowKey="pharmacy_staff_id"
        loading={loading}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
        className="cursor-pointer"
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default StaffTable;
