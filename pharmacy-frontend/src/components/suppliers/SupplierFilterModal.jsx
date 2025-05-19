import React from "react";
import { Modal, Button, Select } from "antd";

const { Option } = Select;

const SupplierFilterModal = ({
  visible,
  filterType,
  filterProduct,
  availableProducts,
  onCancel,
  onApply,
  onReset,
  onFilterTypeChange,
  onFilterProductChange,
}) => {
  return (
    <Modal
      title="Filter Suppliers"
      open={visible}
      onCancel={onCancel}
      onOk={onApply}
      footer={[
        <Button key="reset" onClick={onReset}>
          Reset Filters
        </Button>,
        <Button key="apply" type="primary" onClick={onApply}>
          Apply
        </Button>,
      ]}
    >
      <div className="space-y-4">
        <div className="mb-4">
          <div className="font-medium mb-2">Filter by Type:</div>
          <Select
            style={{ width: "100%" }}
            value={filterType}
            onChange={onFilterTypeChange}
          >
            <Option value="All">All Types</Option>
            <Option value="Taking Return">Taking Return</Option>
            <Option value="Not Taking Return">Not Taking Return</Option>
          </Select>
        </div>

        <div>
          <div className="font-medium mb-2">Filter by Product:</div>
          <Select
            style={{ width: "100%" }}
            value={filterProduct}
            onChange={onFilterProductChange}
          >
            <Option value="All">All Products</Option>
            {availableProducts.map((product) => (
              <Option key={product} value={product}>
                {product}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default SupplierFilterModal;
