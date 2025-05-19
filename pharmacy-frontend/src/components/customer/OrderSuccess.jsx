import React from "react";
import { Link } from "react-router-dom";
import { Result, Button, Typography, Divider, Card, Steps } from "antd";
import {
  CheckCircleOutlined,
  ShoppingOutlined,
  CarOutlined,
  GiftOutlined,
} from "@ant-design/icons";

const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;

const OrderSuccess = ({
  orderNumber = "ORD-123456",
  orderDate = new Date().toLocaleDateString(),
  deliveryMethod = "Home Delivery",
  orderItems = [],
  orderTotal = 0,
  estimatedDelivery = "2-3 business days",
  paymentMethod = "Credit Card",
  shippingAddress = "123 Street, Beruwala",
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Result
        status="success"
        icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        title="Order Placed Successfully!"
        subTitle={`Order number: ${orderNumber}`}
        extra={[
          <Button
            type="primary"
            key="orders"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Link to="/orders">View Orders</Link>
          </Button>,
          <Button key="shop" className="ml-4">
            <Link to="/">Continue Shopping</Link>
          </Button>,
        ]}
      />

      <div className="mt-8">
        <Card className="mb-6">
          <Title level={5}>Order Details</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Text type="secondary">Order Date:</Text>
              <div>{orderDate}</div>
            </div>
            <div>
              <Text type="secondary">Delivery Method:</Text>
              <div>{deliveryMethod}</div>
            </div>
            <div>
              <Text type="secondary">Payment Method:</Text>
              <div>{paymentMethod}</div>
            </div>
            <div>
              <Text type="secondary">Estimated Delivery:</Text>
              <div>{estimatedDelivery}</div>
            </div>
          </div>

          {deliveryMethod === "Home Delivery" && (
            <div className="mt-4">
              <Text type="secondary">Shipping Address:</Text>
              <div>{shippingAddress}</div>
            </div>
          )}
        </Card>

        <Card className="mb-6">
          <Title level={5}>Order Summary</Title>
          <div className="mt-4">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b">
                <div>
                  <Text>{item.name}</Text>
                  <div className="text-gray-500 text-sm">
                    Qty: {item.quantity}
                  </div>
                </div>
                <div>Rs.{item.price.toFixed(2)}</div>
              </div>
            ))}

            <div className="flex justify-between mt-4 font-medium">
              <Text>Total</Text>
              <Text>Rs.{orderTotal.toFixed(2)}</Text>
            </div>
          </div>
        </Card>

        <Card>
          <Title level={5}>Order Status</Title>
          <Steps current={0} className="mt-4">
            <Step
              title="Order Placed"
              description="Order has been placed"
              icon={<ShoppingOutlined />}
            />
            <Step
              title="Processing"
              description="Order is being processed"
              icon={<CheckCircleOutlined />}
            />
            <Step
              title="Shipping"
              description="Order is on the way"
              icon={<CarOutlined />}
            />
            <Step
              title="Delivered"
              description="Order has been delivered"
              icon={<GiftOutlined />}
            />
          </Steps>

          <Divider />

          <Paragraph className="text-center text-gray-500">
            A confirmation email has been sent to your email address.
            <br />
            If you have any questions about your order, please contact our
            customer service.
          </Paragraph>

          <div className="flex justify-center mt-4">
            <Button type="link">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderSuccess;
