// import React, { useEffect, useState } from "react";
// import { Form, Input, Button, Select, DatePicker, message, Card } from "antd";
// import dayjs from "dayjs";
// import { collection, addDoc, getDocs } from "firebase/firestore";
// import { firestore } from "@/config/firebase";

// const { Option } = Select;

// const AddProject = () => {
//   const [form] = Form.useForm();

//   const [customers, setCustomers] = useState([]);
//   const [workers, setWorkers] = useState([]);

//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [assignedWorkers, setAssignedWorkers] = useState([]);

//   // ---------------- FETCH CUSTOMERS ----------------
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       const snap = await getDocs(collection(firestore, "customers"));
//       const list = snap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setCustomers(list);
//     };

//     fetchCustomers();
//   }, []);

//   // ---------------- FETCH WORKERS ----------------
//   useEffect(() => {
//     const fetchWorkers = async () => {
//       const snap = await getDocs(collection(firestore, "users"));

//       const list = snap.docs
//         .map((doc) => ({ id: doc.id, ...doc.data() }))
//         .filter((u) => u.role === "Worker");

//       setWorkers(list);
//     };

//     fetchWorkers();
//   }, []);

//   // ---------------- CUSTOMER SELECT ----------------
//   const handleCustomerChange = (id) => {
//     const customer = customers.find((c) => c.id === id);
//     setSelectedCustomer(customer);

//     form.setFieldsValue({
//       customerName: customer?.name,
//       customerPhone: customer?.phone,
//       customerCNIC: customer?.cnic,
//       customerAddress: customer?.address,
//     });
//   };

//   // ---------------- SUBMIT ----------------
//   const onFinish = async (values) => {
//     try {
//       const cost = Number(values.cost || 0);
//       const expense = Number(values.expense || 0);
//       const profit = cost - expense;

//       const payload = {
//         projectName: values.projectName,

//         customerId: selectedCustomer?.id,
//         customerName: values.customerName,
//         customerPhone: values.customerPhone,
//         customerCNIC: values.customerCNIC,
//         customerAddress: values.customerAddress,

//         workers: assignedWorkers,

//         cost,
//         expense,
//         profit,

//         deadline: values.deadline
//           ? dayjs(values.deadline).format("DD-MMM-YYYY")
//           : null,

//         messages: [
//           {
//             text: "This project is added",
//             date: new Date().toISOString(),
//           },
//         ],

//         status: "Pending",
//         createdAt: new Date().toISOString(),
//       };

//       await addDoc(collection(firestore, "projects"), payload);

//       message.success("Project Added Successfully!");

//       form.resetFields();
//       setSelectedCustomer(null);
//       setAssignedWorkers([]);
//     } catch (error) {
//       console.log(error);
//       message.error("Error adding project");
//     }
//   };

//   return (
//     <Card title="Add Project" style={{ maxWidth: 900, margin: "auto" }}>
//       <Form form={form} layout="vertical" onFinish={onFinish}>
        
//         {/* PROJECT NAME */}
//         <Form.Item
//           label="Project Name"
//           name="projectName"
//           rules={[{ required: true }]}
//         >
//           <Input placeholder="Enter project name" />
//         </Form.Item>

//         {/* CUSTOMER */}
//         <Form.Item label="Select Customer" required>
//           <Select
//             placeholder="Select customer"
//             onChange={handleCustomerChange}
//           >
//             {customers.map((c) => (
//               <Option key={c.id} value={c.id}>
//                 {c.name}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         {/* AUTO FILLED CUSTOMER FIELDS */}
//         <Form.Item name="customerPhone" label="Phone">
//           <Input disabled />
//         </Form.Item>

//         <Form.Item name="customerCNIC" label="CNIC">
//           <Input disabled />
//         </Form.Item>

//         <Form.Item name="customerAddress" label="Address">
//           <Input disabled />
//         </Form.Item>

//         {/* WORKERS ASSIGN */}
//         <Form.Item label="Assign Workers">
//           <Select
//             mode="multiple"
//             placeholder="Select workers"
//             value={assignedWorkers}
//             onChange={setAssignedWorkers}
//           >
//             {workers.map((w) => (
//               <Option key={w.id} value={w.id}>
//                 {w.name} ({w.status === "Busy" ? "Busy" : "Available"})
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         {/* COST */}
//         <Form.Item label="Project Cost" name="cost">
//           <Input type="number" />
//         </Form.Item>

//         {/* EXPENSE */}
//         <Form.Item label="Project Expense" name="expense">
//           <Input type="number" />
//         </Form.Item>

//         {/* DEADLINE */}
//         <Form.Item label="Deadline" name="deadline">
//           <DatePicker format="DD-MMM-YYYY" />
//         </Form.Item>

//         {/* SUBMIT */}
//         <Button type="primary" htmlType="submit" block>
//           Add Project
//         </Button>
//       </Form>
//     </Card>
//   );
// };

// export default AddProject;

// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Input,
//   Button,
//   Select,
//   DatePicker,
//   Row,
//   Col,
//   Card,
//   Divider,
//   Typography,
//   Tag,
//   message,
// } from "antd";
// import dayjs from "dayjs";
// import { collection, getDocs, addDoc } from "firebase/firestore";
// import { firestore } from "@/config/firebase";

// const { Option } = Select;
// const { Title, Text } = Typography;

// const AddProject = () => {
//   const [form] = Form.useForm();

//   const [customers, setCustomers] = useState([]);
//   const [workers, setWorkers] = useState([]);

//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   const [cost, setCost] = useState(0);
//   const [expense, setExpense] = useState(0);
//   const [profit, setProfit] = useState(0);

//   const [assignedWorkers, setAssignedWorkers] = useState([]);

//   // ---------------- FETCH CUSTOMERS ----------------
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       const snap = await getDocs(collection(firestore, "customers"));
//       setCustomers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     };
//     fetchCustomers();
//   }, []);

//   // ---------------- FETCH WORKERS ----------------
//   useEffect(() => {
//     const fetchWorkers = async () => {
//       const snap = await getDocs(collection(firestore, "users"));

//       const list = snap.docs
//         .map((d) => ({ id: d.id, ...d.data() }))
//         .filter((u) => u.role === "Worker");

//       setWorkers(list);
//     };
//     fetchWorkers();
//   }, []);

//   // ---------------- CUSTOMER SELECT ----------------
//   const handleCustomer = (id) => {
//     const c = customers.find((x) => x.id === id);
//     setSelectedCustomer(c);

//     form.setFieldsValue({
//       customerName: c?.name,
//       customerPhone: c?.phone,
//       customerCNIC: c?.cnic,
//       customerAddress: c?.address,
//     });
//   };

//   // ---------------- PROFIT CALC ----------------
//   const updateProfit = (c, e) => {
//     setCost(c);
//     setExpense(e);
//     setProfit(Number(c || 0) - Number(e || 0));
//   };

//   // ---------------- SUBMIT ----------------
//   const onFinish = async (values) => {
//     try {
//       await addDoc(collection(firestore, "projects"), {
//         projectName: values.projectName,

//         customerId: selectedCustomer?.id,
//         customerName: values.customerName,
//         customerPhone: values.customerPhone,
//         customerCNIC: values.customerCNIC,
//         customerAddress: values.customerAddress,

//         workers: assignedWorkers,

//         cost,
//         expense,
//         profit,

//         deadline: values.deadline
//           ? dayjs(values.deadline).format("DD-MMM-YYYY")
//           : "",

//         messages: [
//           {
//             text: "This project is added",
//             date: new Date().toISOString(),
//           },
//         ],

//         status: "Pending",
//         createdAt: new Date().toISOString(),
//       });

//       message.success("Project created successfully!");

//       form.resetFields();
//       setSelectedCustomer(null);
//       setAssignedWorkers([]);
//       setCost(0);
//       setExpense(0);
//       setProfit(0);
//     } catch (err) {
//       message.error("Error creating project");
//     }
//   };

//   return (
//     <Row gutter={20}>
//       {/* ================= LEFT FORM ================= */}
//       <Col xs={24} md={16}>
//         <Card title="➕ Add New Project" bordered>
//           <Form form={form} layout="vertical" onFinish={onFinish}>
            
//             <Form.Item label="Project Name" name="projectName" required>
//               <Input placeholder="Enter project name" />
//             </Form.Item>

//             <Form.Item label="Customer" required>
//               <Select onChange={handleCustomer} placeholder="Select customer">
//                 {customers.map((c) => (
//                   <Option key={c.id} value={c.id}>
//                     {c.name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item name="customterPhone">
//               <Input disabled placeholder="Phone" />
//             </Form.Item>

//             <Form.Item name="customerCNIC">
//               <Input disabled placeholder="CNIC" />
//             </Form.Item>

//             <Form.Item name="customerAddress">
//               <Input disabled placeholder="Address" />
//             </Form.Item>

//             <Form.Item label="Assign Workers">
//               <Select
//                 mode="multiple"
//                 onChange={setAssignedWorkers}
//                 placeholder="Select workers"
//               >
//                 {workers.map((w) => (
//                   <Option key={w.id} value={w.id}>
//                     {w.name}{" "}
//                     {w.status === "Busy" ? (
//                       <Tag color="red">Busy</Tag>
//                     ) : (
//                       <Tag color="green">Available</Tag>
//                     )}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item label="Project Cost">
//               <Input
//                 type="number"
//                 onChange={(e) =>
//                   updateProfit(e.target.value, expense)
//                 }
//               />
//             </Form.Item>

//             <Form.Item label="Project Expense">
//               <Input
//                 type="number"
//                 onChange={(e) =>
//                   updateProfit(cost, e.target.value)
//                 }
//               />
//             </Form.Item>

//             <Form.Item label="Deadline" name="deadline">
//               <DatePicker format="DD-MMM-YYYY" />
//             </Form.Item>

//             <Button type="primary" htmlType="submit" block>
//               Save Project
//             </Button>
//           </Form>
//         </Card>
//       </Col>

//       {/* ================= RIGHT PROFIT PANEL ================= */}
//       <Col xs={24} md={8}>
//         <Card
//           style={{
//             position: "sticky",
//             top: 20,
//             borderRadius: 10,
//             boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
//           }}
//         >
//           <Title level={4}>📊 Project Summary</Title>

//           <Divider />

//           <Text>Cost</Text>
//           <Title level={5}>Rs {cost}</Title>

//           <Text>Expense</Text>
//           <Title level={5}>Rs {expense}</Title>

//           <Divider />

//           <Text strong>Profit</Text>
//           <Title
//             level={3}
//             style={{ color: profit >= 0 ? "green" : "red" }}
//           >
//             Rs {profit}
//           </Title>

//           <Divider />

//           <Text type="secondary">
//             Profit = Cost - Expense
//           </Text>
//         </Card>
//       </Col>
//     </Row>
//   );
// };

// export default AddProject;
import React, { useEffect, useState } from "react";
import {
  Form, Input, Button, Select, DatePicker, Row, Col, Card, Divider,
  Typography, Tag, message,
} from "antd";
import dayjs from "dayjs";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";

const { Option } = Select;
const { Title, Text } = Typography;

const AddProject = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [assignedWorkers, setAssignedWorkers] = useState([]);
  const [cost, setCost] = useState(0);
  const [expense, setExpense] = useState(0);
  const [profit, setProfit] = useState(0);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [custSnap, userSnap] = await Promise.all([
          getDocs(collection(firestore, "customers")),
          getDocs(collection(firestore, "users"))
        ]);
        setCustomers(custSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setWorkers(userSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((u) => u.role === "Worker"));
      } catch (err) {
        message.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCustomer = (id) => {
    const c = customers.find((x) => x.id === id);
    setSelectedCustomer(c);
    form.setFieldsValue({
      customerName: c?.name,
      customerPhone: c?.phone,
      customerCNIC: c?.cnic,
      customerAddress: c?.address,
    });
  };

  const updateProfit = (c, e) => {
    const newCost = Number(c || 0);
    const newExpense = Number(e || 0);
    setCost(newCost);
    setExpense(newExpense);
    setProfit(newCost - newExpense);
  };

  const onFinish = async (values) => {
    setLoading(true);
    
    // Denormalization: Map selected IDs to objects containing {id, name}
    const workersData = assignedWorkers.map(id => {
      const worker = workers.find(w => w.id === id);
      return { id: id, name: worker?.name || "Unknown" };
    });

    try {
      await addDoc(collection(firestore, "projects"), {
        projectName: values.projectName,
        customerId: selectedCustomer?.id,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerCNIC: values.customerCNIC,
        customerAddress: values.customerAddress,
        workers: workersData, // Stored as array of objects: [{id, name}, ...]
        cost,
        expense,
        profit,
        deadline: values.deadline ? dayjs(values.deadline).format("DD-MMM-YYYY") : "",
        status: "Pending",
        createdAt: new Date().toISOString(),
      });

      message.success("Project created successfully!");
      form.resetFields();
      setAssignedWorkers([]);
      setCost(0); setExpense(0); setProfit(0);
    } catch (err) {
      message.error("Error creating project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row gutter={20}>
      <Col xs={24} md={16}>
        <Card title="➕ Add New Project" bordered>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Project Name" name="projectName" rules={[{ required: true }]}>
              <Input placeholder="Enter project name" />
            </Form.Item>

            <Form.Item label="Customer" required>
              <Select onChange={handleCustomer} placeholder="Select customer" loading={loading}>
                {customers.map((c) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item name="customerName" label="Name"><Input disabled /></Form.Item>
            <Form.Item name="customerPhone" label="Phone"><Input disabled /></Form.Item>
            <Form.Item name="customerCNIC" label="CNIC"><Input disabled /></Form.Item>
            <Form.Item name="customerAddress" label="Address"><Input disabled /></Form.Item>

            <Form.Item label="Assign Workers">
              <Select
                mode="multiple"
                placeholder="Select workers"
                onChange={setAssignedWorkers}
                optionLabelProp="label"
                loading={loading}
              >
                {workers.map((w) => (
                  <Option key={w.id} value={w.id} label={w.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {w.name}
                      <Tag color={w.status === "Busy" ? "red" : "green"}>
                        {w.status === "Busy" ? "Busy" : "Available"}
                      </Tag>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}><Form.Item label="Project Cost"><Input type="number" onChange={(e) => updateProfit(e.target.value, expense)} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Project Expense"><Input type="number" onChange={(e) => updateProfit(cost, e.target.value)} /></Form.Item></Col>
            </Row>

            <Form.Item label="Deadline" name="deadline">
              <DatePicker format="DD-MMM-YYYY" style={{ width: '100%' }} />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block>Save Project</Button>
          </Form>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card style={{ position: "sticky", top: 20 }}>
          <Title level={4}>📊 Project Summary</Title>
          <Text>Profit: Rs {profit}</Text>
        </Card>
      </Col>
    </Row>
  );
};

export default AddProject;