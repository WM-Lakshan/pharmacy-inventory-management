import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Divider,
  Avatar,
  List,
  Tag,
  message,
  Spin,
  Upload,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  HistoryOutlined,
  FileTextOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  HeartOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { TabPane } = Tabs;

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login to view your profile");
        return;
      }

      const userData = JSON.parse(localStorage.getItem("user")) || {};

      // Fetch user profile
      const response = await axios.get(`/api/users/${userData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // For demo purposes, if API fails or not available
      if (!response.data) {
        setMockUserData(userData);
        return;
      }

      setUser(response.data);
      setAvatarUrl(response.data.avatar);

      // Populate form
      form.setFieldsValue({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        phone: response.data.phone,
      });

      // Fetch recent orders
      const ordersResponse = await axios.get("/api/orders/recent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (ordersResponse.data && ordersResponse.data.orders) {
        setOrders(ordersResponse.data.orders);
      } else {
        setMockOrders();
      }

      // Fetch prescriptions
      const prescriptionsResponse = await axios.get("/api/prescriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (
        prescriptionsResponse.data &&
        prescriptionsResponse.data.prescriptions
      ) {
        setPrescriptions(prescriptionsResponse.data.prescriptions);
      } else {
        setMockPrescriptions();
      }

      // Fetch saved addresses
      const addressesResponse = await axios.get("/api/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (addressesResponse.data && addressesResponse.data.addresses) {
        setSavedAddresses(addressesResponse.data.addresses);
      } else {
        setMockAddresses();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);

      // For demo purposes, set mock data
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      setMockUserData(userData);
    } finally {
      setLoading(false);
    }
  };

  const setMockUserData = (userData) => {
    // Mock data for testing
    const mockUser = {
      id: userData.id || "12345",
      firstName: userData.firstName || "John",
      lastName: userData.lastName || "Doe",
      email: userData.email || "johndoe@example.com",
      phone: "0771234567",
      avatar: null,
    };

    setUser(mockUser);

    // Populate form
    form.setFieldsValue({
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      phone: mockUser.phone,
    });

    setMockOrders();
    setMockPrescriptions();
    setMockAddresses();
  };

  const setMockOrders = () => {
    // Mock data for testing
    const mockOrders = [
      {
        id: "ORD-123456",
        date: "2023-04-20",
        status: "Delivered",
        total: 1250,
        items: 3,
      },
      {
        id: "ORD-123457",
        date: "2023-04-15",
        status: "Processing",
        total: 850,
        items: 2,
      },
      {
        id: "ORD-123458",
        date: "2023-04-10",
        status: "Delivered",
        total: 2100,
        items: 5,
      },
    ];

    setOrders(mockOrders);
  };

  const setMockPrescriptions = () => {
    // Mock data for testing
    const mockPrescriptions = [
      {
        id: "PRESC-123",
        date: "2023-04-18",
        status: "Approved",
        doctor: "Dr. Smith",
      },
      {
        id: "PRESC-124",
        date: "2023-04-12",
        status: "Expired",
        doctor: "Dr. Johnson",
      },
      {
        id: "PRESC-125",
        date: "2023-04-05",
        status: "Approved",
        doctor: "Dr. Williams",
      },
    ];

    setPrescriptions(mockPrescriptions);
  };

  const setMockAddresses = () => {
    // Mock data for testing
    const mockAddresses = [
      {
        id: 1,
        type: "Home",
        address: "123 Home Street, Colombo 03",
        isDefault: true,
      },
      {
        id: 2,
        type: "Office",
        address: "456 Office Lane, Colombo 04",
        isDefault: false,
      },
    ];

    setSavedAddresses(mockAddresses);
  };

  const handleUpdateProfile = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login to update your profile");
        return;
      }

      await axios.put(`/api/users/${user.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Profile updated successfully");

      // Update local user data
      setUser({
        ...user,
        ...values,
      });

      // Update localStorage user data
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userData,
          ...values,
        })
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile");

      // For demo purposes, pretend it worked
      setUser({
        ...user,
        ...values,
      });

      message.success("Profile updated successfully (Demo)");
    }
  };

  const handleChangePassword = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login to change your password");
        return;
      }

      await axios.post(
        `/api/users/${user.id}/change-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Password changed successfully");
      passwordForm.resetFields();
    } catch (error) {
      console.error("Error changing password:", error);
      message.error("Failed to change password");

      // For demo purposes, pretend it worked
      message.success("Password changed successfully (Demo)");
      passwordForm.resetFields();
    }
  };

  const handleAvatarChange = async (info) => {
    if (info.file.status === "uploading") {
      return;
    }

    if (info.file.status === "done") {
      // Get the uploaded file
      const file = info.file.originFileObj;

      try {
        // Create form data
        const formData = new FormData();
        formData.append("avatar", file);

        const token = localStorage.getItem("token");

        // Upload the avatar
        const response = await axios.post(
          `/api/users/${user.id}/avatar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update the avatar URL
        setAvatarUrl(response.data.avatarUrl);
        message.success("Avatar uploaded successfully");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        message.error("Failed to upload avatar");

        // For demo purposes, show the uploaded image
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setAvatarUrl(reader.result);
        };

        message.success("Avatar uploaded successfully (Demo)");
      }
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* <Header /> */}
        <div className="flex-grow flex justify-center items-center">
          <Spin size="large" />
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card
            title={
              <div className="flex items-center">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  src={avatarUrl}
                  className="mr-4"
                />
                <div>
                  <h1 className="text-2xl font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
            }
            className="mb-8"
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader mb-4"
              showUploadList={false}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              onChange={handleAvatarChange}
            >
              <Button icon={<UploadOutlined />}>Change Profile Picture</Button>
            </Upload>
          </Card>

          <Card>
            <Tabs activeKey={activeTab} onChange={handleTabChange}>
              <TabPane
                tab={
                  <span>
                    <UserOutlined />
                    Profile
                  </span>
                }
                key="1"
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleUpdateProfile}
                  initialValues={{
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    email: user?.email,
                    phone: user?.phone,
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your first name",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your first name" />
                    </Form.Item>

                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your last name",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your last name" />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        {
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your email" disabled />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your phone number",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your phone number" />
                    </Form.Item>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-blue-600"
                    >
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>

                <Divider />

                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handleChangePassword}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      name="currentPassword"
                      label="Current Password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your current password",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Enter your current password" />
                    </Form.Item>

                    <div></div>

                    <Form.Item
                      name="newPassword"
                      label="New Password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your new password",
                        },
                        {
                          min: 8,
                          message: "Password must be at least 8 characters",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Enter your new password" />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      label="Confirm New Password"
                      dependencies={["newPassword"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your new password",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("newPassword") === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("The two passwords do not match")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="Confirm your new password" />
                    </Form.Item>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-blue-600"
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <HistoryOutlined />
                    Orders
                  </span>
                }
                key="2"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={orders}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Link
                          to={`/orders/${item.id}`}
                          className="text-blue-600"
                        >
                          View Details
                        </Link>,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <span className="font-medium">Order #{item.id}</span>
                        }
                        description={
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div className="text-gray-500">
                              <span className="block mb-1">Date:</span>
                              <span>{item.date}</span>
                            </div>
                            <div className="text-gray-500">
                              <span className="block mb-1">Status:</span>
                              <Tag
                                color={
                                  item.status === "Delivered"
                                    ? "green"
                                    : item.status === "Processing"
                                    ? "blue"
                                    : "orange"
                                }
                              >
                                {item.status}
                              </Tag>
                            </div>
                            <div className="text-gray-500">
                              <span className="block mb-1">Items:</span>
                              <span>{item.items}</span>
                            </div>
                          </div>
                        }
                      />
                      <div className="text-lg font-medium">
                        Rs.{item.total.toFixed(2)}
                      </div>
                    </List.Item>
                  )}
                />

                <div className="mt-6">
                  <Link to="/orders">
                    <Button type="primary" className="bg-blue-600">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <FileTextOutlined />
                    Prescriptions
                  </span>
                }
                key="3"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={prescriptions}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Link
                          to={`/prescriptions/${item.id}`}
                          className="text-blue-600"
                        >
                          View Details
                        </Link>,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <span className="font-medium">
                            Prescription #{item.id}
                          </span>
                        }
                        description={
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div className="text-gray-500">
                              <span className="block mb-1">Date:</span>
                              <span>{item.date}</span>
                            </div>
                            <div className="text-gray-500">
                              <span className="block mb-1">Status:</span>
                              <Tag
                                color={
                                  item.status === "Approved"
                                    ? "green"
                                    : item.status === "Pending"
                                    ? "orange"
                                    : "red"
                                }
                              >
                                {item.status}
                              </Tag>
                            </div>
                            <div className="text-gray-500">
                              <span className="block mb-1">Doctor:</span>
                              <span>{item.doctor}</span>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />

                <div className="mt-6">
                  <Link to="/upload-prescription">
                    <Button type="primary" className="bg-blue-600">
                      Upload New Prescription
                    </Button>
                  </Link>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <HomeOutlined />
                    Addresses
                  </span>
                }
                key="4"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={savedAddresses}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button type="link" className="text-blue-600">
                          Edit
                        </Button>,
                        <Button type="link" danger>
                          Delete
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <div className="flex items-center">
                            <span className="font-medium mr-2">
                              {item.type}
                            </span>
                            {item.isDefault && <Tag color="blue">Default</Tag>}
                          </div>
                        }
                        description={
                          <div className="text-sm text-gray-500">
                            <div className="flex items-start">
                              <HomeOutlined className="mt-1 mr-2" />
                              <span>{item.address}</span>
                            </div>
                            {item.phone && (
                              <div className="flex items-start mt-1">
                                <PhoneOutlined className="mt-1 mr-2" />
                                <span>{item.phone}</span>
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />

                <div className="mt-6">
                  <Button type="primary" className="bg-blue-600">
                    Add New Address
                  </Button>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <HeartOutlined />
                    Saved Items
                  </span>
                }
                key="5"
              >
                <div className="text-center py-12">
                  <HeartOutlined
                    style={{ fontSize: 48 }}
                    className="text-gray-300 mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-600">
                    No saved items yet
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Items you save will appear here
                  </p>
                  <Button
                    type="primary"
                    className="mt-4 bg-blue-600"
                    onClick={() => (window.location.href = "/products")}
                  >
                    Browse Products
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default UserProfilePage;
