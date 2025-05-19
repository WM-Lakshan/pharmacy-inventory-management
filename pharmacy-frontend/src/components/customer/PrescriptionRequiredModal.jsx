import React from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Typography, Space, Divider, Input } from "antd";
import {
  FileTextOutlined,
  UploadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PrescriptionRequiredModal = ({
  visible,
  onClose,
  productName,
  productId,
}) => {
  const [note, setNote] = useState("");

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={550}
      centered
    >
      <div className="p-2">
        <div className="text-center mb-4">
          <FileTextOutlined className="text-5xl text-blue-500" />
          <Title level={4} className="mt-3 mb-1">
            Prescription Required
          </Title>
          <Text type="secondary">
            {productName} requires a valid prescription from a licensed medical
            professional.
          </Text>
        </div>

        <Divider />

        <div className="my-4">
          <Title level={5}>Why do I need a prescription?</Title>
          <Paragraph>
            This medication requires a prescription to ensure it's appropriate
            for your condition and safe for you to use. This is a legal and
            safety requirement for certain medications.
          </Paragraph>

          <div className="mt-4 mb-6">
            <Text strong>Additional Note (Optional):</Text>
            <TextArea
              rows={3}
              placeholder="Add any special instructions or notes for the pharmacist..."
              value={note}
              onChange={handleNoteChange}
              className="mt-2"
            />
          </div>

          <Space direction="vertical" className="w-full mt-6">
            <Button
              type="primary"
              icon={<UploadOutlined />}
              size="large"
              block
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Link to="/upload-prescription">Upload Prescription</Link>
            </Button>

            <Button icon={<FileTextOutlined />} size="large" block>
              <Link to={`/product/${productId}`}>View Product Details</Link>
            </Button>
          </Space>
        </div>

        <Divider />

        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <div className="flex">
            <InfoCircleOutlined className="text-blue-500 text-lg mr-2 mt-1" />
            <div>
              <Text strong>Need help?</Text>
              <Paragraph className="text-sm text-gray-600 mt-1">
                Our pharmacists are available to answer any questions about
                prescriptions and medications.
                <br />
                <Link to="/contact" className="text-blue-500">
                  Contact us
                </Link>{" "}
                for assistance.
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PrescriptionRequiredModal;
