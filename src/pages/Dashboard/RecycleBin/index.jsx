import { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Popconfirm,
  message,
  Empty,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  UndoOutlined,
  ClearOutlined,
  SearchOutlined,
  DatabaseOutlined,
  FireOutlined,
} from "@ant-design/icons";
import {
  subscribeToBin,
  restoreFromBin,
  permanentlyDeleteFromBin,
  emptyBin,
} from "@/services/recyclebin";

const { Title, Text } = Typography;

const SOURCE_META = {
  customers: { label: "Customer", color: "geekblue" },
  projects: { label: "Project", color: "purple" },
  machines: { label: "Machine", color: "cyan" },
  orders: { label: "Order", color: "volcano" },
};

const metaFor = (binItem) =>
  SOURCE_META[binItem?.sourceCollection] || { label: binItem?.sourceCollection || "Item", color: "default" };

const formatDateTime = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const RecycleBin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [restoringId, setRestoringId] = useState(null);

  useEffect(() => {
    const unsub = subscribeToBin((data) => {
      setItems(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const search = searchText.toLowerCase();
    return items.filter(
      (item) =>
        (item.label || "").toLowerCase().includes(search) ||
        (item.sourceCollection || "").toLowerCase().includes(search) ||
        (item.deletedBy || "").toLowerCase().includes(search)
    );
  }, [items, searchText]);

  const handleRestore = async (item) => {
    setRestoringId(item.id);
    try {
      await restoreFromBin(item);
      message.success(`Restored "${item.label}"`);
    } catch (error) {
      console.error("Restore failed:", error);
      message.error("Failed to restore item");
    } finally {
      setRestoringId(null);
    }
  };

  const handlePermanentDelete = async (item) => {
    try {
      await permanentlyDeleteFromBin(item.id);
      message.success(`Permanently deleted "${item.label}"`);
    } catch (error) {
      console.error("Permanent delete failed:", error);
      message.error("Failed to delete item");
    }
  };

  const handleEmptyBin = async () => {
    try {
      await emptyBin(items);
      message.success("Recycle bin emptied");
    } catch (error) {
      console.error("Empty bin failed:", error);
      message.error("Failed to empty bin");
    }
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "sourceCollection",
      width: 130,
      render: (_, record) => {
        const meta = metaFor(record);
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: "Name",
      dataIndex: "label",
      render: (label) => <Text strong>{label || "Untitled"}</Text>,
    },
    {
      title: "Deleted From",
      dataIndex: "sourceCollection",
      width: 150,
      render: (src) => (
        <Space size={4}>
          {src === "orders" ? <FireOutlined /> : <DatabaseOutlined />}
          <Text type="secondary">{src || "—"}</Text>
        </Space>
      ),
    },
    {
      title: "Deleted At",
      dataIndex: "deletedAt",
      width: 190,
      render: (v) => <Text type="secondary">{formatDateTime(v)}</Text>,
    },
    {
      title: "Deleted By",
      dataIndex: "deletedBy",
      width: 180,
      render: (v) => <Text type="secondary">{v || "—"}</Text>,
    },
    {
      title: "Actions",
      width: 220,
      render: (_, record) => (
        <Space>
          <Tooltip title="Restore">
            <Button
              type="primary"
              icon={<UndoOutlined />}
              loading={restoringId === record.id}
              onClick={() => handleRestore(record)}
            >
              Restore
            </Button>
          </Tooltip>
          <Popconfirm
            title="Permanently delete?"
            description="This cannot be undone."
            okText="Delete"
            okType="danger"
            onConfirm={() => handlePermanentDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>
            Recycle Bin
          </Title>
          <Text type="secondary">
            {items.length} item{items.length === 1 ? "" : "s"} — restore or permanently delete
          </Text>
        </div>
        <Popconfirm
          title="Empty the recycle bin?"
          description="All items will be permanently deleted. This cannot be undone."
          okText="Empty Bin"
          okType="danger"
          onConfirm={handleEmptyBin}
          disabled={items.length === 0}
        >
          <Button danger icon={<ClearOutlined />} disabled={items.length === 0}>
            Empty Bin
          </Button>
        </Popconfirm>
      </div>

      <Card bordered={false}>
        <Input
          placeholder="Search by name, type or user"
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16, width: 320, maxWidth: "100%" }}
        />

        <Table
          rowKey="id"
          loading={loading}
          dataSource={filtered}
          columns={columns}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <Empty description="Recycle bin is empty" style={{ padding: "40px 0" }} />
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default RecycleBin;
