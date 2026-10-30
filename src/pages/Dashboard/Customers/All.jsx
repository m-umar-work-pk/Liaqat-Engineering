import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Card,
  Tag,
  Typography,
  Row,
  Col,
  Input,
  Statistic,
  Button,
  Space,
  message,
  Modal,
} from "antd";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useAuth } from "@/context/Auth";

const { Text, Title } = Typography;
const { Search } = Input;
const { confirm } = Modal;

const AllCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();
  const { userData, loading } = useAuth();

  const isAdmin = userData?.role === "Admin";

  useEffect(() => {
    const unsub = onSnapshot(collection(firestore, "customers"), (snapshot) => {
      const customerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customerList);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) {
      return message.error("Only Admins can delete customers.");
    }

    confirm({
      title: "Are you sure you want to delete this customer?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      cancelText: "No",
      okType: "danger",

      onOk: async () => {
        try {
          await deleteDoc(doc(firestore, "customers", id));
          message.success("Customer deleted successfully");
        } catch (error) {
          console.error(error);
          message.error("Failed to delete customer");
        }
      },
    });
  };

  const stats = useMemo(() => {
    return {
      total: customers.length,
      regular: customers.filter((c) => c.type === "Regular").length,
      local: customers.filter((c) => c.type === "Local").length,
      official: customers.filter((c) => c.type === "Official").length,
    };
  }, [customers]);

  const filteredCustomers = customers.filter((customer) => {
    const search = searchText.toLowerCase();

    return (
      customer?.name?.toLowerCase()?.includes(search) ||
      customer?.cnic?.includes(search)
    );
  });

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text || "N/A"}</Text>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || "N/A",
    },
    {
      title: "CNIC",
      dataIndex: "cnic",
      key: "cnic",
      render: (text) => text || "N/A",
    },
    {
      title: "Customer Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={
            type === "Regular"
              ? "green"
              : type === "Local"
              ? "gold"
              : "red"
          }
        >
          {type || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date
          ? new Date(date)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, "-")
          : "N/A",
    },
    ...(isAdmin
      ? [
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Space>
                <Button
                  type="link"
                  onClick={() =>
                    navigate(`/edit-customer/${record.id}`)
                  }
                >
                  Edit
                </Button>

                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(record.id)}
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]
      : []),
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "16px" }}>
      {/* Header */}
      <Row
        justify="space-between"
        align="middle"
        gutter={[12, 12]}
        style={{ marginBottom: 20 }}
      >
        <Col xs={24} sm={12}>
          <Title level={4} style={{ margin: 0 }}>
            Customers
          </Title>
        </Col>

        {isAdmin && (
          <Col xs={24} sm={12} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              onClick={() => navigate("/add-customer")}
            >
              + Add Customer
            </Button>
          </Col>
        )}
      </Row>

      {/* Statistics */}
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={stats.total}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Regular"
              value={stats.regular}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Local"
              value={stats.local}
              valueStyle={{ color: "#d48806" }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Official"
              value={stats.official}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row justify="end" style={{ marginBottom: 20 }}>
        <Col xs={24} sm={18} md={12} lg={8} xl={6}>
          <Search
            placeholder="Search by Name or CNIC"
            allowClear
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {/* Table */}
      <Card bodyStyle={{ padding: 0 }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredCustomers}
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            responsive: true,
          }}
        />
      </Card>
    </div>
  );
};

export default AllCustomer;