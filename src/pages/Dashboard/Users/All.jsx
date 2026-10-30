// import React, { useState, useEffect } from 'react';
// import { Layout, Typography, Row, Col, Card, Table, Tag, Space, Button, Input, Select, InputNumber, DatePicker, Form, Popconfirm, message, Modal, Empty } from 'antd';
// import { UserOutlined, SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import dayjs from 'dayjs'; 
// import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
// import { firestore } from '@/config/firebase'; 

// const { Content } = Layout;
// const { Title, Paragraph, Text } = Typography;
// const { TextArea } = Input;

// const AllUsers = () => {
//     const navigate = useNavigate();
//     const [form] = Form.useForm();
    
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchText, setSearchText] = useState('');
//     const [roleFilter, setRoleFilter] = useState('All');
//     const [visiblePasswords, setVisiblePasswords] = useState({});
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);

//     const currentLiveStatus = Form.useWatch('status', form);
//     const currentLiveRole = Form.useWatch('role', form);

//     // Fetch user dataset from Firestore in real-time
//     useEffect(() => {
//         const unsub = onSnapshot(collection(firestore, "users"), (snapshot) => {
//             const usersList = snapshot.docs.map(doc => ({
//                 key: doc.id,
//                 ...doc.data()
//             }));
//             setUsers(usersList);
//             setLoading(false);
//         }, (error) => {
//             console.error("Firestore error:", error);
//             message.error("Failed to sync database.");
//             setLoading(false);
//         });
//         return () => unsub();
//     }, []);

//     const togglePasswordVisibility = (key) => {
//         setVisiblePasswords(prev => ({ ...prev, [key]: !prev[key] }));
//     };

//     const handleCnicChange = (e) => {
//         let value = e.target.value.replace(/\D/g, ''); 
//         if (value.length > 5 && value.length <= 12) {
//             value = `${value.slice(0, 5)}-${value.slice(5)}`;
//         } else if (value.length > 12) {
//             value = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12, 13)}`;
//         }
//         form.setFieldsValue({ cnic: value });
//     };

//     const showEditModal = (record) => {
//         setEditingUser(record);
//         setIsEditModalOpen(true);
//         form.setFieldsValue({
//             ...record,
//             startDate: record.startDate ? dayjs(record.startDate, 'DD-MMM-YYYY') : null,
//             endDate: record.endDate ? dayjs(record.endDate, 'DD-MMM-YYYY') : null,
//         });
//     };

//     const handleEditSave = async () => {
//         try {
//             const values = await form.validateFields();
//             const userRef = doc(firestore, "users", editingUser.key);
            
//             await updateDoc(userRef, {
//                 ...values,
//                 startDate: values.startDate?.format('DD-MMM-YYYY'),
//                 endDate: values.endDate?.format('DD-MMM-YYYY') || null,
//                 salary: values.role === 'Client' || values.role === 'Admin' ? 0 : (parseFloat(values.salary) || 0),
//             });

//             message.success('User profile registry configurations successfully updated.');
//             setIsEditModalOpen(false);
//             setEditingUser(null);
//         } catch (error) {
//             console.error("Update failed:", error);
//             message.error("Update failed.");
//         }
//     };

//     const handleDelete = async (key, name) => {
//         try {
//             await deleteDoc(doc(firestore, "users", key));
//             message.success(`Profile for "${name}" successfully dropped from records.`);
//         } catch (error) {
//             console.error("Deletion failure:", error);
//             message.error("Failed to execute row data erasure.");
//         }
//     };

//     const columns = [
//         {
//             title: 'User ID',
//             dataIndex: 'key',
//             key: 'id',
//             width: 120,
//             render: (id) => <Tag color="blue" style={{ fontWeight: 'bold' }}>{id.slice(-6).toUpperCase()}</Tag>
//         },
//         {
//             title: 'Personal Identity',
//             key: 'identity',
//             width: 240,
//             render: (_, record) => {
//                 const isPasswordRevealed = visiblePasswords[record.key];
//                 return (
//                     <Space direction="vertical" size={2}>
//                         <Text strong>{record.fullName || 'N/A'}</Text>
//                         <Text type="secondary" style={{ fontSize: '12px' }}>
//                             <strong>CNIC:</strong> {record.cnic || '—'}
//                         </Text>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
//                             <Text type="warning" style={{ fontSize: '12px' }}>
//                                 <strong>Password:</strong> {isPasswordRevealed ? <code>{record.password}</code> : '••••••'}
//                             </Text>
//                             <Button 
//                                 type="text" size="small" style={{ padding: 0 }}
//                                 icon={isPasswordRevealed ? <EyeInvisibleOutlined /> : <EyeOutlined />} 
//                                 onClick={() => togglePasswordVisibility(record.key)}
//                             />
//                         </div>
//                     </Space>
//                 );
//             }
//         },
//         { title: 'Phone Number', dataIndex: 'phone', key: 'phone', width: 140 },
//         {
//             title: 'Role / Designation',
//             dataIndex: 'role',
//             key: 'role',
//             width: 165,
//             render: (role) => {
//                 const colors = { 'Plant Manager': 'cyan', 'Mechanical Engineer': 'geekblue', 'Client': 'green', 'Admin': 'red' };
//                 return <Tag color={colors[role] || 'default'}>{role || 'Client'}</Tag>;
//             }
//         },
//         {
//             title: 'Job Status',
//             dataIndex: 'status',
//             key: 'status',
//             width: 130,
//             render: (status) => {
//                 const colors = { 'Active': 'green', 'On Leave': 'orange', 'Resigned': 'volcano', 'Fired': 'red' };
//                 return <Tag color={colors[status] || 'green'} style={{ borderRadius: '12px' }}>{status || 'Active'}</Tag>;
//             }
//         },
//         {
//             title: 'Start / Leave Start',
//             dataIndex: 'startDate',
//             key: 'startDate',
//             width: 155,
//             render: (text, record) => {
//                 const prefix = record.status === 'On Leave' ? 'Leave: ' : 'Joined: ';
//                 return text ? <Text size="small"><span style={{ opacity: 0.5 }}>{prefix}</span>{text}</Text> : <Text type="secondary">—</Text>;
//             }
//         },
//         {
//             title: 'End / Return / Exit',
//             dataIndex: 'endDate',
//             key: 'endDate',
//             width: 155,
//             render: (text, record) => {
//                 if (record.status === 'Active' || !text) return <Text type="secondary">—</Text>;
//                 const prefix = record.status === 'On Leave' ? 'Return: ' : 'Exit: ';
//                 return <Text type="danger"><span style={{ opacity: 0.6 }}>{prefix}</span>{text}</Text>;
//             }
//         },
//         {
//             title: 'Salary Structure',
//             dataIndex: 'salary',
//             key: 'salary',
//             width: 140,
//             render: (val, record) => record.role === 'Client' || record.role === 'Admin' ? <Text type="secondary">N/A</Text> : <Text code>Rs. {Number(val || 0).toLocaleString()}</Text>
//         },
//         {
//             title: 'Address',
//             dataIndex: 'address',
//             key: 'address',
//             width: 200,
//             ellipsis: true,
//             render: (text) => text ? <Text title={text}>{text}</Text> : <Text type="secondary">—</Text>
//         },
//         {
//             title: 'Actions',
//             key: 'actions',
//             width: 120,
//             fixed: 'right', 
//             align: 'center',
//             render: (_, record) => (
//                 <Space size="middle">
//                     <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => showEditModal(record)} />
//                     <Popconfirm
//                         title="Delete User Record?"
//                         description={`Are you sure you want to erase ${record.name}?`}
//                         onConfirm={() => handleDelete(record.key, record.name)}
//                         okButtonProps={{ danger: true }}
//                     >
//                         <Button type="text" danger icon={<DeleteOutlined />} />
//                     </Popconfirm>
//                 </Space>
//             )
//         }
//     ];

//     const filteredUsers = users.filter(user => {
//         const query = searchText.toLowerCase();
//         return (
//             (user.name?.toLowerCase().includes(query) || user.cnic?.includes(query) || user.phone?.includes(query)) &&
//             (roleFilter === 'All' || user.role === roleFilter)
//         );
//     });

//     return (
//         <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
//             <Content style={{ padding: '40px 24px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
//                 <div style={{ marginBottom: '24px' }}>
//                     <Row align="middle" justify="space-between" gutter={[16, 16]}>
//                         <Col xs={24} sm={16}>
//                             <Space align="center" size="middle">
//                                 <div style={{ backgroundColor: '#001529', padding: '12px', borderRadius: '8px', display: 'flex' }}>
//                                     <UserOutlined style={{ fontSize: '24px', color: '#fff' }} />
//                                 </div>
//                                 <div>
//                                     <Title level={2} style={{ margin: 0 }}>System User Directory</Title>
//                                     <Paragraph type="secondary" style={{ margin: 0 }}>Review personnel setups, execute live parameter updates, or safely erase access data profiles.</Paragraph>
//                                 </div>
//                             </Space>
//                         </Col>
//                         <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
//                             <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/dashboard/users/add')} block>
//                                 Add New User
//                             </Button>
//                         </Col>
//                     </Row>
//                 </div>

//                 <Card bordered={false} style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
//                     <Row gutter={[16, 16]} align="middle" justify="space-between">
//                         <Col xs={24} md={12} lg={8}>
//                             <Input 
//                                 placeholder="Search by name, CNIC, phone, or address..." 
//                                 prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
//                                 size="large"
//                                 value={searchText}
//                                 onChange={(e) => setSearchText(e.target.value)}
//                                 allowClear
//                             />
//                         </Col>
//                         <Col xs={24} md={12} lg={6}>
//                             <Select 
//                                 value={roleFilter}
//                                 style={{ width: '100%' }} 
//                                 size="large"
//                                 onChange={(value) => setRoleFilter(value)}
//                                 options={[
//                                     { value: 'All', label: 'All Operations Roles' },
//                                     { value: 'Admin', label: 'Administrators' },
//                                     // { value: 'Client', label: 'Clients' },
//                                     { value: 'Plant Manager', label: 'Plant Floor Managers' },
//                                     { value: 'Mechanical Engineer', label: 'Workshop Mechanical Engineers' }
//                                 ]}
//                             />
//                         </Col>
//                     </Row>
//                 </Card>

//                 <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
//                     <Table
//                         columns={columns}
//                         dataSource={filteredUsers}
//                         loading={loading}
//                         pagination={{ defaultPageSize: 10, showSizeChanger: true }}
//                         scroll={{ x: 1450 }}
//                     />
//                 </Card>
//             </Content>

//             <Modal
//                 title={`Modify User Parameters — ${editingUser?.key?.slice(-6).toUpperCase() || ''}`}
//                 open={isEditModalOpen}
//                 onOk={handleEditSave}
//                 onCancel={() => { setIsEditModalOpen(false); setEditingUser(null); }}
//                 width={650}
//                 centered
//             >
//                 <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
//                                 <Input size="large" />
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item label="CNIC Number" name="cnic" rules={[{ required: true }]}>
//                                 <Input size="large" onChange={handleCnicChange} maxLength={15} />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
//                                 <Input size="large" />
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item label="Role" name="role" rules={[{ required: true }]}>
//                                 <Select size="large" options={[{ value: 'Admin', label: 'Administrator' }, { value: 'Client', label: 'Client' }, { value: 'Plant Manager', label: 'Plant Manager' }, { value: 'Mechanical Engineer', label: 'Mechanical Engineer' }]} />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={24}>
//                             <Form.Item label="Security Password" name="password" rules={[{ required: true, min: 5 }]}>
//                                 <Input.Password size="large" />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item label="Status" name="status" rules={[{ required: true }]}>
//                                 <Select size="large" options={[{ value: 'Active', label: 'Active' }, { value: 'On Leave', label: 'On Leave' }, { value: 'Resigned', label: 'Resigned' }, { value: 'Fired', label: 'Fired' }]} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item label="Start Date" name="startDate" rules={[{ required: true }]}>
//                                 <DatePicker size="large" style={{ width: '100%' }} format="DD-MMM-YYYY" />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     {currentLiveStatus !== 'Active' && (
//                         <Row gutter={16}>
//                             <Col span={24}>
//                                 <Form.Item label={currentLiveStatus === 'On Leave' ? "Return Date" : "Exit Date"} name="endDate" rules={[{ required: true }]}>
//                                     <DatePicker size="large" style={{ width: '100%' }} format="DD-MMM-YYYY" />
//                                 </Form.Item>
//                             </Col>
//                         </Row>
//                     )}
//                     {currentLiveRole !== 'Client' && currentLiveRole !== 'Admin' && (
//                         <Row gutter={16}>
//                             <Col span={24}>
//                                 <Form.Item label="Salary (PKR)" name="salary" rules={[{ required: true }]}>
//                                     <InputNumber size="large" style={{ width: '100%' }} min={0} formatter={v => `Rs. ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v.replace(/Rs\.\s?|(,*)/g, '')} />
//                                 </Form.Item>
//                             </Col>
//                         </Row>
//                     )}
//                     <Row gutter={16}>
//                         <Col span={24}>
//                             <Form.Item label="Address" name="address">
//                                 <TextArea rows={3} />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                 </Form>
//             </Modal>
//         </Layout>
//     );
// };

// export default AllUsers;
import React, { useEffect, useState } from 'react';
import { Layout, Table, Card, Avatar, Typography, message, Space } from 'antd';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/config/firebase";

const { Content } = Layout;
const { Title } = Typography;

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "users"));
        const usersList = querySnapshot.docs.map(doc => ({
          key: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (error) {
        message.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'Profile',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      render: (url) => <Avatar size={50} src={url} />
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Status', dataIndex: 'status', key: 'status' }
  ];

  return (
    <Layout style={{ padding: '24px', background: '#f0f2f5' }}>
      <Content style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Title level={2}>User Directory</Title>
        {/* Using variant="borderless" to fix the deprecated bordered warning */}
        <Card variant="borderless" style={{ borderRadius: '12px' }}>
          <Table 
            columns={columns} 
            dataSource={users} 
            loading={loading} 
            pagination={{ pageSize: 10 }} 
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default AllUsers;