import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Badge,
  Card,
  message,
  Tooltip,
  DatePicker,
  Tabs,
  Modal,
  Form,
  Radio,
  Avatar,
  Typography,
  Spin,
} from "antd";
import {
  Bell,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  ArrowLeft,
  User,
  Users,
  Send,
  CheckCheck,
  Calendar,
  X,
} from "lucide-react";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [composeVisible, setComposeVisible] = useState(false);
  const [composeForm] = Form.useForm();
  const [selectedRecipientType, setSelectedRecipientType] =
    useState("specific");
  const [sendingNotification, setSendingNotification] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    setUserRole(userData.role);
    fetchNotifications();
    fetchRecipients();
  }, [pagination.current, searchText, selectedTab, typeFilter, dateRange]);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      const userId =
        userData?.id ||
        userData?.user_id ||
        userData?.pharmacy_staff_id ||
        userData?.customer_id;
      const userType = userData?.role || userData?.user_type;

      if (!userId || !userType) {
        message.error("User information not found");
        return;
      }

      // Build query parameters
      const params = {
        userId,
        userType,
        page: pagination.current,
        pageSize: pagination.pageSize,
        searchTerm: searchText,
        tab: selectedTab,
        type: typeFilter,
      };

      // Add date range if available
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].format("YYYY-MM-DD");
        params.endDate = dateRange[1].format("YYYY-MM-DD");
      }

      const response = await axios.get("/api/notifications", {
        params: {
          userId,
          userType,
          page: pagination.current,
          pageSize: pagination.pageSize,
          searchTerm: searchText,
          tab: selectedTab,
          type: typeFilter,
          ...(dateRange &&
            dateRange[0] &&
            dateRange[1] && {
              startDate: dateRange[0].format("YYYY-MM-DD"),
              endDate: dateRange[1].format("YYYY-MM-DD"),
            }),
        },
        ...getAuthConfig(),
      });

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        setPagination({
          ...pagination,
          total: response.data.total || 0,
        });
      } else {
        message.error(response.data.message || "Failed to load notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Failed to load notifications");
      // For development purposes, load mock data
      setMockNotifications();
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      const userType = userData.role;

      // Only fetch specific recipients if the user is a manager or staff
      if (userType === "manager" || userType === "staff") {
        const response = await axios.get("/api/notifications/recipients", {
          params: { userType },
          ...getAuthConfig(),
        });

        if (response.data.success) {
          setRecipients(response.data.recipients || []);
        }
      }
    } catch (error) {
      console.error("Error fetching recipients:", error);
      // For development purposes, load mock recipients
      setMockRecipients();
    }
  };

  const setMockNotifications = () => {
    const mockData = [];
    const types = ["info", "success", "alert", "message", "warning"];
    const titles = [
      "New order received",
      "Prescription approved",
      "Low stock alert",
      "New message from customer",
      "Order status update",
    ];
    const statuses = [true, false];

    for (let i = 1; i <= 25; i++) {
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      const isRead = statuses[Math.floor(Math.random() * statuses.length)];

      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      mockData.push({
        id: i,
        title: randomTitle,
        message: `This is a sample notification message for ${randomTitle.toLowerCase()}.`,
        type: randomType,
        is_read: isRead,
        created_at: date.toISOString(),
        sender_type: Math.random() > 0.5 ? "staff" : "customer",
        sender_name: `User ${Math.floor(Math.random() * 100)}`,
        recipient_type: Math.random() > 0.5 ? "specific" : "all",
      });
    }

    setNotifications(mockData);
    setPagination({
      ...pagination,
      total: mockData.length,
    });
  };

  const setMockRecipients = () => {
    const mockRecipients = [];

    // Add mock staff recipients if user is manager
    if (userRole === "manager") {
      for (let i = 1; i <= 5; i++) {
        mockRecipients.push({
          id: `staff-${i}`,
          name: `Staff Member ${i}`,
          type: "staff",
        });
      }
    }

    // Add mock customer recipients
    for (let i = 1; i <= 8; i++) {
      mockRecipients.push({
        id: `customer-${i}`,
        name: `Customer ${i}`,
        type: "customer",
      });
    }

    setRecipients(mockRecipients);
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `/api/notifications/${notificationId}/read`,
        {},
        getAuthConfig()
      );

      // Update local notification list
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      message.success("Marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      message.error("Failed to mark as read");
    }
  };

  const markSelectedAsRead = async () => {
    if (selectedRows.length === 0) {
      message.info("No notifications selected");
      return;
    }

    try {
      await axios.post(
        "/api/notifications/mark-selected-read",
        { notificationIds: selectedRows },
        getAuthConfig()
      );
      // Update local notification list
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          selectedRows.includes(notification.id)
            ? { ...notification, is_read: true }
            : notification
        )
      );

      message.success(`${selectedRows.length} notification(s) marked as read`);
      setSelectedRows([]);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      message.error("Failed to mark notifications as read");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(
        `/api/notifications/${notificationId}`,
        getAuthConfig()
      );

      if (response.data.success) {
        message.success(response.data.message);
        // Verify deletion by refreshing the list
        fetchNotifications();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      message.error(
        error.response?.data?.message || "Failed to delete notification"
      );
    }
  };

  const deleteSelectedNotifications = async () => {
    if (selectedRows.length === 0) {
      message.info("No notifications selected");
      return;
    }

    try {
      const response = await axios.post(
        "/api/notifications/delete-selected",
        { notificationIds: selectedRows },
        getAuthConfig()
      );

      if (response.data.success) {
        message.success(response.data.message);
        // Verify by checking if count matches
        if (response.data.affectedRows === selectedRows.length) {
          setNotifications((prev) =>
            prev.filter((n) => !selectedRows.includes(n.id))
          );
          setSelectedRows([]);
        } else {
          // Partial deletion - refresh the list
          fetchNotifications();
        }
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting notifications:", error);
      message.error(
        error.response?.data?.message || "Failed to delete notifications"
      );
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setPagination({ ...pagination, current: 1 });
  };

  const handleTypeFilter = (value) => {
    setTypeFilter(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setPagination({ ...pagination, current: 1 });
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleReply = (notification) => {
    setReplyTo(notification);
    setComposeVisible(true);

    // Pre-fill the form for reply
    composeForm.setFieldsValue({
      recipientType: "specific",
      title: `Re: ${notification.title}`,
      message: "",
    });

    // If the notification is from a specific sender, select them
    if (notification.sender_id) {
      const recipientId =
        notification.sender_type === "staff"
          ? `staff-${notification.sender_id}`
          : `customer-${notification.sender_id}`;

      composeForm.setFieldsValue({
        specificRecipient: recipientId,
      });
    }

    setSelectedRecipientType("specific");
  };

  const sendNotification = async (values) => {
    setSendingNotification(true);

    try {
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      const senderId = userData.id;
      const senderType = userData.role;

      let recipientId = null;
      let recipientType = values.recipientType;

      // Process recipient information
      if (recipientType === "specific" && values.specificRecipient) {
        const parts = values.specificRecipient.split("-");
        recipientType = parts[0]; // 'staff' or 'customer'
        recipientId = parts[1]; // The ID number
      }

      const notificationData = {
        title: values.title,
        message: values.message,
        senderId,
        senderType,
        recipientType: values.recipientType,
        recipientId: values.specificRecipient,
        replyToId: replyTo?.id || null,
      };

      const response = await axios.post(
        "/api/notifications/send",
        notificationData,
        getAuthConfig()
      );
      if (response.data.success) {
        message.success("Notification sent successfully");
        composeForm.resetFields();
        setComposeVisible(false);
        setReplyTo(null);
        fetchNotifications(); // Refresh the list to show sent notification
      } else {
        message.error(response.data.message || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      message.error("Failed to send notification");
    } finally {
      setSendingNotification(false);
    }
  };

  const clearFilters = () => {
    setSearchText("");
    setTypeFilter(null);
    setDateRange(null);
    setPagination({ ...pagination, current: 1 });
    setFilterVisible(false);
  };

  const renderNotificationTypeTag = (type) => {
    switch (type) {
      case "alert":
        return <Tag color="orange">Alert</Tag>;
      case "success":
        return <Tag color="green">Success</Tag>;
      case "message":
        return <Tag color="blue">Message</Tag>;
      case "warning":
        return <Tag color="gold">Warning</Tag>;
      default:
        return <Tag color="default">Info</Tag>;
    }
  };

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleComposeClose = () => {
    setComposeVisible(false);
    setReplyTo(null);
    composeForm.resetFields();
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys) => {
      setSelectedRows(selectedRowKeys);
    },
  };

  const columns = [
    {
      title: "Status",
      dataIndex: "is_read",
      key: "is_read",
      width: 80,
      render: (isRead, record) => (
        <div className="flex justify-center">
          <Badge
            status={isRead ? "default" : "processing"}
            text={isRead ? "" : ""}
          />
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => renderNotificationTypeTag(type),
    },
    {
      title: "Title & Message",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div>
          <div className="font-medium mb-1">{title}</div>
          <div className="text-gray-600 text-sm">{record.message}</div>

          {record.sender_type && (
            <div className="mt-1">
              <Tag
                icon={
                  record.sender_type === "customer" ? (
                    <User className="h-3 w-3 mr-1" />
                  ) : (
                    <User className="h-3 w-3 mr-1" />
                  )
                }
                color="default"
              >
                From: {record.sender_name || record.sender_type}
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space>
          {!record.is_read && (
            <Tooltip title="Mark as read">
              <Button
                type="text"
                size="small"
                icon={<CheckCircle className="h-4 w-4 text-green-500" />}
                onClick={() => markAsRead(record.id)}
              />
            </Tooltip>
          )}

          {/* Reply button - only show for specific notifications (not broadcasts) */}
          {record.sender_id && (
            <Tooltip title="Reply">
              <Button
                type="text"
                size="small"
                icon={<MessageSquare className="h-4 w-4 text-blue-500" />}
                onClick={() => handleReply(record)}
              />
            </Tooltip>
          )}

          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              size="small"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => deleteNotification(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          type="text"
          icon={<ArrowLeft />}
          onClick={() => navigate(-1)}
          className="mr-4"
        />
        <Title level={4} className="m-0">
          Notifications
        </Title>
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative w-64">
              <Input
                placeholder="Search notifications..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<Search className="text-gray-400" size={16} />}
                allowClear
                onPressEnter={(e) => handleSearch(e.target.value)}
              />
            </div>

            <Button
              icon={<Filter size={16} />}
              onClick={() => setFilterVisible(!filterVisible)}
              className={
                filterVisible ? "bg-blue-50 border-blue-200 text-blue-600" : ""
              }
            >
              Filters
            </Button>

            <Button icon={<RefreshCw size={16} />} onClick={fetchNotifications}>
              Refresh
            </Button>
          </div>

          <div>
            <Button
              type="primary"
              icon={<MessageSquare size={16} />}
              onClick={() => {
                setComposeVisible(true);
                setReplyTo(null);
                composeForm.resetFields();
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Compose
            </Button>
          </div>
        </div>

        {filterVisible && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Text className="block mb-2 text-sm font-medium">
                  Filter by Type
                </Text>
                <Select
                  placeholder="Select type"
                  style={{ width: "100%" }}
                  allowClear
                  value={typeFilter}
                  onChange={handleTypeFilter}
                >
                  <Option value="info">Info</Option>
                  <Option value="success">Success</Option>
                  <Option value="alert">Alert</Option>
                  <Option value="message">Message</Option>
                  <Option value="warning">Warning</Option>
                </Select>
              </div>

              <div>
                <Text className="block mb-2 text-sm font-medium">
                  Date Range
                </Text>
                <RangePicker
                  style={{ width: "100%" }}
                  value={dateRange}
                  onChange={handleDateRangeChange}
                />
              </div>

              <div className="flex items-end">
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            </div>
          </div>
        )}

        <Tabs
          activeKey={selectedTab}
          onChange={handleTabChange}
          className="mt-4"
        >
          <TabPane tab="All" key="all" />
          <TabPane tab="Unread" key="unread" />
          <TabPane tab="Read" key="read" />
          {/* Show additional tabs for sent items if user can send notifications */}
          {/* {(userRole === "manager" || userRole === "staff") && (
            <TabPane tab="Sent" key="sent" />
          )} */}
        </Tabs>
      </Card>

      <Card>
        {selectedRows.length > 0 && (
          <div className="bg-blue-50 p-3 mb-4 rounded-md flex justify-between items-center">
            <Text>{selectedRows.length} item(s) selected</Text>
            <Space>
              <Button
                icon={<CheckCheck size={16} />}
                onClick={markSelectedAsRead}
              >
                Mark as Read
              </Button>
              <Button
                danger
                icon={<Trash2 size={16} />}
                onClick={deleteSelectedNotifications}
              >
                Delete
              </Button>
            </Space>
          </div>
        )}

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={notifications}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
          loading={loading}
          rowClassName={(record) => (!record.is_read ? "bg-blue-50" : "")}
        />
      </Card>

      {/* Compose/Reply Modal */}
      <Modal
        title={replyTo ? "Reply to Notification" : "Compose Notification"}
        open={composeVisible}
        onCancel={handleComposeClose}
        footer={null}
        width={600}
      >
        <Form form={composeForm} layout="vertical" onFinish={sendNotification}>
          {/* Only show recipient selection if not replying */}
          {!replyTo && (
            <>
              <Form.Item
                name="recipientType"
                label="Send to"
                initialValue="specific"
                rules={[
                  { required: true, message: "Please select recipient type" },
                ]}
              >
                <Radio.Group
                  onChange={(e) => setSelectedRecipientType(e.target.value)}
                  className="w-full"
                >
                  {/* Show options based on user role */}
                  {userRole === "manager" && (
                    <>
                      <Radio.Button value="specific">
                        Specific User
                      </Radio.Button>
                      <Radio.Button value="allStaff">All Staff</Radio.Button>
                      <Radio.Button value="allCustomers">
                        All Customers
                      </Radio.Button>
                    </>
                  )}

                  {userRole === "staff" && (
                    <>
                      <Radio.Button value="specific">
                        Specific Customer
                      </Radio.Button>
                      <Radio.Button value="allCustomers">
                        All Customers
                      </Radio.Button>
                    </>
                  )}

                  {userRole === "customer" && (
                    <>
                      <Radio.Button value="specific">
                        Specific Staff
                      </Radio.Button>
                      <Radio.Button value="allStaff">All Staff</Radio.Button>
                    </>
                  )}
                </Radio.Group>
              </Form.Item>

              {/* Specific recipient dropdown */}
              {selectedRecipientType === "specific" && (
                <Form.Item
                  name="specificRecipient"
                  label="Select recipient"
                  rules={[
                    { required: true, message: "Please select a recipient" },
                  ]}
                >
                  <Select
                    placeholder="Select recipient"
                    style={{ width: "100%" }}
                    showSearch
                    optionFilterProp="children"
                  >
                    {recipients.map((recipient) => {
                      // Filter recipients based on user role
                      if (
                        userRole === "manager" ||
                        (userRole === "staff" &&
                          recipient.type === "customer") ||
                        (userRole === "customer" && recipient.type === "staff")
                      ) {
                        return (
                          <Option
                            key={`${recipient.type}-${recipient.id}`}
                            value={`${recipient.type}-${recipient.id}`}
                          >
                            {recipient.name} ({recipient.type})
                          </Option>
                        );
                      }
                      return null;
                    })}
                  </Select>
                </Form.Item>
              )}
            </>
          )}

          {/* If replying, show who we're replying to */}
          {replyTo && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <Text className="block text-sm text-gray-500">
                Replying to: {replyTo.sender_name || replyTo.sender_type}
              </Text>
            </div>
          )}

          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: "Please enter notification title" },
            ]}
          >
            <Input placeholder="Enter notification title" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[
              { required: true, message: "Please enter notification message" },
            ]}
          >
            <TextArea rows={5} placeholder="Enter your message here..." />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={handleComposeClose}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={sendingNotification}
                icon={<Send size={16} className="mr-1" />}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Send
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationsPage;
