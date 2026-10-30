// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Space,
//   Popconfirm,
//   Tag,
//   Typography,
//   Card,
//   Row,
//   Col,
// } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   CheckCircleOutlined,
//   ClockCircleOutlined,
//   ExclamationCircleOutlined,
//   DollarOutlined,
//   UserOutlined,
// } from "@ant-design/icons";

// import {
//   collection,
//   onSnapshot,
//   deleteDoc,
//   doc,
//   getDoc,
// } from "firebase/firestore";

// import { firestore } from "@/config/firebase";
// import { useAuth } from "@/context/Auth";

// const { Text, Title } = Typography;

// const AllProjects = () => {
//   const { user } = useAuth();

//   const [projects, setProjects] = useState([]);
//   const [workers, setWorkers] = useState([]);
//   const [role, setRole] = useState("");

//   // ---------------- GET USER ROLE ----------------
//   useEffect(() => {
//     const fetchRole = async () => {
//       if (!user?.uid) return;

//       const snap = await getDoc(doc(firestore, "users", user.uid));
//       if (snap.exists()) setRole(snap.data().role);
//     };

//     fetchRole();
//   }, [user]);

//   // ---------------- GET PROJECTS ----------------
//   useEffect(() => {
//     const unsub = onSnapshot(collection(firestore, "projects"), (snap) => {
//       const list = snap.docs.map((d) => ({
//         id: d.id,
//         ...d.data(),
//       }));
//       setProjects(list);
//     });

//     return () => unsub();
//   }, []);

//   // ---------------- GET WORKERS ----------------
//   useEffect(() => {
//     const unsub = onSnapshot(collection(firestore, "users"), (snap) => {
//       const list = snap.docs
//         .map((d) => d.data())
//         .filter((u) => u.role === "worker");

//       setWorkers(list);
//     });

//     return () => unsub();
//   }, []);

//   // ---------------- DELETE ----------------
//   const handleDelete = async (id) => {
//     await deleteDoc(doc(firestore, "projects", id));
//   };

//   // ---------------- FILTER LAST 5 YEARS ----------------
//   const currentYear = new Date().getFullYear();

//   const filteredProjects = projects.filter((p) => {
//     if (!p.createdAt) return true;
//     const year = new Date(p.createdAt).getFullYear();
//     return year >= currentYear - 5;
//   });

//   // ---------------- PROJECT STATS ----------------
//   const completed = filteredProjects.filter(
//     (p) => p.status === "Completed"
//   );

//   const active = filteredProjects.filter(
//     (p) => p.status === "In Progress"
//   );

//   const pending = filteredProjects.filter(
//     (p) => p.status === "Pending"
//   );

//   const totalProfit = filteredProjects.reduce((acc, p) => {
//     return acc + (Number(p.cost || 0) - Number(p.expense || 0));
//   }, 0);

//   // ---------------- WORKER STATS ----------------
//   const busyWorkers = workers.filter(
//     (w) => w.status === "Busy"
//   ).length;

//   const availableWorkers = workers.filter(
//     (w) => w.status !== "Busy"
//   ).length;

//   // ---------------- TABLE COLUMNS ----------------
//   const columns = [
//     {
//       title: "Project Name",
//       dataIndex: "projectName",
//     },
//     {
//       title: "Customer",
//       dataIndex: "customerName",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status) => {
//         let color = "gold";
//         if (status === "Completed") color = "green";
//         if (status === "In Progress") color = "blue";
//         if (status === "Pending") color = "orange";

//         return <Tag color={color}>{status}</Tag>;
//       },
//     },
//     {
//       title: "Profit",
//       render: (_, r) => {
//         const profit = Number(r.cost || 0) - Number(r.expense || 0);

//         return (
//           <Text strong style={{ color: profit >= 0 ? "green" : "red" }}>
//             Rs {profit.toLocaleString()}
//           </Text>
//         );
//       },
//     },
//     {
//       title: "Actions",
//       render: (_, record) =>
//         role === "admin" ? (
//           <Space>
//             <Button icon={<EditOutlined />} type="primary">
//               Edit
//             </Button>

//             <Popconfirm
//               title="Delete Project?"
//               onConfirm={() => handleDelete(record.id)}
//             >
//               <Button danger icon={<DeleteOutlined />}>
//                 Delete
//               </Button>
//             </Popconfirm>
//           </Space>
//         ) : (
//           <Text type="secondary">No Permission</Text>
//         ),
//     },
//   ];

//   // ---------------- UI ----------------
//   return (
//     <div style={{ padding: 20 }}>

//       <Title level={3}>Project Analytics Dashboard</Title>

//       {/* TOP STATS */}
//       <Row gutter={16} style={{ marginBottom: 20 }}>

//         <Col span={4}>
//           <Card>
//             <CheckCircleOutlined style={{ color: "green" }} />
//             <Title level={5}>Completed</Title>
//             <Text>{completed.length}</Text>
//           </Card>
//         </Col>

//         <Col span={4}>
//           <Card>
//             <ClockCircleOutlined style={{ color: "blue" }} />
//             <Title level={5}>Active</Title>
//             <Text>{active.length}</Text>
//           </Card>
//         </Col>

//         <Col span={4}>
//           <Card>
//             <ExclamationCircleOutlined style={{ color: "orange" }} />
//             <Title level={5}>Pending</Title>
//             <Text>{pending.length}</Text>
//           </Card>
//         </Col>

//         <Col span={4}>
//           <Card>
//             <DollarOutlined style={{ color: "green" }} />
//             <Title level={5}>Profit</Title>
//             <Text>Rs {totalProfit.toLocaleString()}</Text>
//           </Card>
//         </Col>

//         <Col span={4}>
//           <Card>
//             <UserOutlined style={{ color: "red" }} />
//             <Title level={5}>Busy Workers</Title>
//             <Text>{busyWorkers}</Text>
//           </Card>
//         </Col>

//         {/* ✅ NEW AVAILABLE WORKERS */}
//         <Col span={4}>
//           <Card>
//             <UserOutlined style={{ color: "green" }} />
//             <Title level={5}>Available Workers</Title>
//             <Text>{availableWorkers}</Text>
//           </Card>
//         </Col>

//       </Row>

//       {/* TABLE */}
//       <Table
//         rowKey="id"
//         dataSource={filteredProjects}
//         columns={columns}
//         bordered
//       />
//     </div>
//   );
// };

// export default AllProjects;
import React, { useEffect, useState } from "react";
import { 
  Table, Button, Space, Popconfirm, Typography, message, Modal, Form, Input, Select, DatePicker, Row, Col 
} from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { collection, onSnapshot, deleteDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase"; // Ensure this matches your project's import path
import { useAuth } from "@/context/Auth";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { Option } = Select;

const AllProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [role, setRole] = useState("");
  const [searchText, setSearchText] = useState("");
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  // 1. Data Initialization
  useEffect(() => {
    const initData = async () => {
      if (user?.uid) {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) setRole(userSnap.data().role?.toLowerCase() || "");
      }
      const [custSnap, workSnap] = await Promise.all([
        getDocs(collection(db, "customers")),
        getDocs(collection(db, "users"))
      ]);
      setCustomers(custSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setWorkers(workSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(u => u.role === "Worker"));
    };
    initData();

    const unsub = onSnapshot(collection(db, "projects"), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  // 2. Search Logic
  const filteredProjects = projects.filter((p) => 
    p.projectName?.toLowerCase().includes(searchText.toLowerCase()) || 
    p.id?.toLowerCase().includes(searchText.toLowerCase())
  );

  // 3. Edit Handler
  const handleEdit = (record) => {
    setEditingProject(record);
    form.setFieldsValue({
      ...record,
      workers: record.workers || [],
      deadline: record.deadline ? dayjs(record.deadline, "DD-MMM-YYYY") : null,
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      const cost = Number(values.cost || 0);
      const expense = Number(values.expense || 0);
      await updateDoc(doc(db, "projects", editingProject.id), {
        ...values,
        profit: cost - expense,
        deadline: values.deadline ? values.deadline.format("DD-MMM-YYYY") : "",
      });
      message.success("Project updated successfully");
      setIsModalVisible(false);
    } catch (err) {
      message.error("Access Denied: Unable to update.");
    }
  };

  // 4. Table Columns
  const columns = [
    { title: "Project Name", dataIndex: "projectName" },
    { title: "Customer", dataIndex: "customerName" },
    { title: "Deadline", dataIndex: "deadline" },
    { 
        title: "Workers", 
        dataIndex: "workers", 
        render: (ids) => (Array.isArray(ids) ? ids.map(id => workers.find(w => w.id === id)?.name).filter(Boolean).join(", ") : "None") 
    },
    { title: "Profit", render: (_, r) => {
        const p = Number(r.cost || 0) - Number(r.expense || 0);
        return <Text strong style={{ color: p >= 0 ? "green" : "red" }}>Rs {p.toLocaleString()}</Text>;
    }},
    { title: "Actions", render: (_, record) => (
        <Space>
          <Button disabled={role !== "admin"} icon={<EditOutlined />} type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Delete?" onConfirm={() => deleteDoc(doc(db, "projects", record.id))}>
            <Button disabled={role !== "admin"} danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
    )},
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Project Management</Title>
      <Input
        placeholder="Search by Project Name or ID"
        prefix={<SearchOutlined />}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 20, width: 300 }}
      />
      <Table rowKey="id" dataSource={filteredProjects} columns={columns} bordered />

      <Modal title="Edit Project Details" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null} width={800}>
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="projectName" label="Project Name"><Input /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="customerId" label="Customer"><Select>{customers.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}</Select></Form.Item></Col>
            <Col span={12}><Form.Item name="status" label="Status"><Select><Option value="Pending">Pending</Option><Option value="In Progress">In Progress</Option><Option value="Completed">Completed</Option></Select></Form.Item></Col>
          </Row>
          
          <Form.Item name="workers" label="Workers">
            <Select mode="multiple" optionLabelProp="label">
              {workers.map(w => (
                <Option key={w.id} value={w.id} label={w.name}>
                  {w.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}><Form.Item name="cost" label="Cost"><Input type="number" /></Form.Item></Col>
            <Col span={8}><Form.Item name="expense" label="Expense"><Input type="number" /></Form.Item></Col>
            <Col span={8}><Form.Item name="deadline" label="Deadline"><DatePicker format="DD-MMM-YYYY" style={{ width: '100%' }}/></Form.Item></Col>
          </Row>
          <Button type="primary" htmlType="submit" block>Save Changes</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AllProjects;