import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Tag,
  Typography,
  message,
  Input,
  Image,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { softDeleteFromFirestore } from "@/services/recyclebin";
import { useAuth } from "@/context/Auth";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const statusColor = (status) => {
  if (status === "Operational") return "green";
  if (status === "Maintenance") return "orange";
  if (status === "Out of Order") return "red";
  return "default";
};

const MachinesList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [machines, setMachines] = useState([]);
  const [role, setRole] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (user?.uid) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) setRole(snap.data().role || "");
        } catch (err) {
          console.error("Error fetching role:", err);
        }
      }
      setLoading(false);
    };
    init();

    const unsub = onSnapshot(
      collection(db, "machines"),
      (snap) => {
        setMachines(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => {
        console.error("Error fetching machines:", err);
        message.error("Failed to load machines");
      }
    );
    return () => unsub();
  }, [user]);

  const isAdmin = role === "Admin";

  const filtered = machines.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      m.category?.toLowerCase().includes(searchText.toLowerCase()) ||
      m.brand?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      const machine = machines.find((m) => m.id === id);
      await softDeleteFromFirestore("machines", id, machine, user?.email || user?.uid);
      message.success("Machine moved to recycle bin");
    } catch {
      message.error("Failed to delete machine");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrls",
      width: 90,
      render: (urls) =>
        Array.isArray(urls) && urls.length > 0 ? (
          <Image width={70} height={52} src={urls[0]} alt="machine" style={{ objectFit: "cover", borderRadius: 6 }} />
        ) : (
          <Text type="secondary">No image</Text>
        ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
    { title: "Brand", dataIndex: "brand", render: (v) => v || "—" },
    { title: "Model", dataIndex: "model", render: (v) => v || "—" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={statusColor(s)}>{s || "Unknown"}</Tag>,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/dashboard/machines/details/${record.id}`)}>
            Details
          </Button>
          {isAdmin && (
            <>
              <Button
                icon={<EditOutlined />}
                type="primary"
                onClick={() => navigate(`/dashboard/machines/edit/${record.id}`)}
              >
                Edit
              </Button>
              <Popconfirm title="Delete this machine?" onConfirm={() => handleDelete(record.id)}>
                <Button danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Title level={3} style={{ marginBottom: 0 }}>
          Machines
        </Title>
        {isAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/dashboard/machines/add")}>
            Add Machine
          </Button>
        )}
      </div>

      <Input
        placeholder="Search by name, category or brand"
        prefix={<SearchOutlined />}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ margin: "20px 0", width: 320, maxWidth: "100%" }}
      />

      <Table rowKey="id" loading={loading} dataSource={filtered} columns={columns} bordered pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default MachinesList;
