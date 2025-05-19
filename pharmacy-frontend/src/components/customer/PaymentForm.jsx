import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { CreditCardOutlined, LockOutlined } from "@ant-design/icons";

const PaymentForm = ({ onPaymentComplete, onBack, totalAmount }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // This would be where you'd integrate with a payment gateway
      // For this example, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1500));

      message.success("Payment processed successfully");
      onPaymentComplete({
        paymentMethod: "creditCard",
        lastFourDigits: values.cardNumber.slice(-4),
        transactionId: "TXN-" + Math.floor(100000 + Math.random() * 900000),
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      message.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <p className="text-gray-500">
          Amount to pay:{" "}
          <span className="font-medium text-blue-600">
            Rs.{totalAmount.toFixed(2)}
          </span>
        </p>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="cardholderName"
          label="Cardholder Name"
          rules={[{ required: true, message: "Please enter cardholder name" }]}
        >
          <Input
            placeholder="Name on card"
            prefix={<CreditCardOutlined className="text-gray-400" />}
          />
        </Form.Item>

        <Form.Item
          name="cardNumber"
          label="Card Number"
          rules={[
            { required: true, message: "Please enter card number" },
            {
              pattern: /^\d{16}$/,
              message: "Please enter a valid 16-digit card number",
            },
          ]}
        >
          <Input
            placeholder="1234 5678 9012 3456"
            maxLength={16}
            prefix={<CreditCardOutlined className="text-gray-400" />}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="expiryDate"
            label="Expiry Date"
            rules={[
              { required: true, message: "Required" },
              {
                pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                message: "Format: MM/YY",
              },
            ]}
          >
            <Input placeholder="MM/YY" maxLength={5} />
          </Form.Item>

          <Form.Item
            name="cvv"
            label="CVV"
            rules={[
              { required: true, message: "Required" },
              { pattern: /^\d{3,4}$/, message: "Invalid CVV" },
            ]}
          >
            <Input
              placeholder="123"
              maxLength={4}
              prefix={<LockOutlined className="text-gray-400" />}
            />
          </Form.Item>
        </div>

        <div className="flex mt-6 space-x-4">
          <Button onClick={onBack} style={{ flex: 1 }}>
            Back
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ flex: 2 }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Pay Rs.{totalAmount.toFixed(2)}
          </Button>
        </div>
      </Form>

      <div className="mt-6 border-t pt-4">
        <div className="text-center text-xs text-gray-500">
          <p>Your payment information is secure and encrypted.</p>
          <div className="flex justify-center mt-2 space-x-2">
            <img src="/visa-icon.png" alt="Visa" className="h-6" />
            <img src="/mastercard-icon.png" alt="Mastercard" className="h-6" />
            <img src="/amex-icon.png" alt="American Express" className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
