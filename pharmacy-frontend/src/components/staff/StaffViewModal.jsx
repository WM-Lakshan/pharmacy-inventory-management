import React from "react";
import { Modal, Button, Avatar } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

const StaffViewModal = ({
  visible,
  staffMember,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!staffMember) return null;

  return (
    <Modal
      title="Staff Overview"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button
          key="edit"
          type="default"
          icon={<EditOutlined />}
          onClick={onEdit}
        >
          Edit
        </Button>,
        <Button
          key="delete"
          danger
          icon={<DeleteOutlined />}
          onClick={onDelete}
        >
          Delete
        </Button>,
      ]}
      width={700}
    >
      <div className="flex">
        <div className="flex-grow">
          <h3 className="text-lg font-medium mb-4">Primary Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="font-medium">Staff Name</div>
            <div>{`${staffMember.F_name} ${staffMember.L_name}`}</div>
            <div className="font-medium">Staff Id</div>
            <div>{staffMember.pharmacy_staff_id}</div>
            <div className="font-medium">Address</div>
            <div>{staffMember.address || "N/A"}</div>
            <div className="font-medium">Contact number</div>
            <div>{staffMember.contactNumber}</div>
            <div className="font-medium">Email</div>
            <div>{staffMember.email}</div>
            <div className="font-medium">Role</div>
            <div>{staffMember.role}</div>
            <div className="font-medium">Salary</div>
            <div>Rs.{staffMember.salary?.toLocaleString() || "0"}</div>
          </div>
        </div>
        <div className="ml-8 flex items-start justify-center">
          <Avatar size={100} icon={<UserOutlined />} src={staffMember.image} />
        </div>
      </div>
    </Modal>
  );
};

export default StaffViewModal;
