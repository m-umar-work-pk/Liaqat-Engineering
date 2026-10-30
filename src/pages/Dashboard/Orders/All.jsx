// import React, { useState, useEffect } from 'react';
// import { Layout, Typography, Row, Col, Card, Table, Tag, Space, Button, Input, Select, InputNumber, DatePicker, Form, Popconfirm, message } from 'antd';
// import { ShoppingCartOutlined, SearchOutlined, EditOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import dayjs from 'dayjs';
// import Navbar from '../../../components/Header/Navbar';

// const { Content, Footer } = Layout;
// const { Title, Paragraph, Text } = Typography;
// const CURRENT_YEAR = new Date().getFullYear();

// const AllOrders = () => {
//     const navigate = useNavigate();
//     const [form] = Form.useForm();
//     const [orders, setOrders] = useState([]);
//     const [systemUsers, setSystemUsers] = useState([]);
//     const [searchText, setSearchText] = useState('');
//     const [statusFilter, setStatusFilter] = useState('All');
//     const [editingKey, setEditingKey] = useState('');

//     // Load pipeline operational logs directly from window storage layers
//     useEffect(() => {
//         const storedOrders = localStorage.getItem('workshop_orders');
//         const storedUsers = localStorage.getItem('workshop_users');
        
//         if (storedOrders) {
//             try { setOrders(JSON.parse(storedOrders)); } catch (e) { setOrders([]); }
//         }
//         if (storedUsers) {
//             try { setSystemUsers(JSON.parse(storedUsers)); } catch (e) { setSystemUsers([]); }
//         }
//     }, []);

//     const isEditing = (record) => record.key === editingKey;

//     // POPULATE LIVE INLINE EDIT VALUES MATRIX
//     const startEdit = (record) => {
//         form.setFieldsValue({
//             title: record.title || '',
//             clientName: record.clientName || '',
//             assignedEngineer: record.assignedEngineer || '',
//             totalAmount: record.totalAmount || 0,
//             orderStatus: record.orderStatus || 'Pending',
//             orderDate: record.orderDate ? dayjs(record.orderDate) : null,
//             dueDate: record.dueDate ? dayjs(record.dueDate) : null,
//         });
//         setEditingKey(record.key);
//     };

//     const cancelEdit = () => {
//         setEditingKey('');
//         form.resetFields();
//     };

//     // COMMIT LINE ENTRY MUTATIONS BACK DOWN TO PERSISTENCE STORAGE
//     const saveEdit = async (key) => {
//         try {
//             const rowValues = await form.validateFields();
            
//             // Reformat raw dayjs picker timestamps back into flat database strings
//             if (rowValues.orderDate) rowValues.orderDate = rowValues.orderDate.format('YYYY-MM-DD');
//             if (rowValues.dueDate) rowValues.dueDate = rowValues.dueDate.format('YYYY-MM-DD');

//             const newData = [...orders];
//             const index = newData.findIndex((item) => key === item.key);

//             if (index > -1) {
//                 const item = newData[index];
//                 newData.splice(index, 1, { ...item, ...rowValues });
//                 setOrders(newData);
//                 localStorage.setItem('workshop_orders', JSON.stringify(newData));
//                 setEditingKey('');
//                 message.success('Order variables updated and synchronized.');
//             }
//         } catch (errInfo) {
//             console.log('Inline Modification Verification Failure:', errInfo);
//             message.error('Please verify mandatory order parameters.');
//         }
//     };

//     // DESTRUCTION TRANSACTION HANDLER
//     const handleDelete = (key, orderId) => {
//         try {
//             const updatedList = orders.filter((o) => o.key !== key);
//             setOrders(updatedList);
//             localStorage.setItem('workshop_orders', JSON.stringify(updatedList));
//             message.success(`Order manifest ${orderId} successfully dropped from production charts.`);
//         } catch (error) {
//             console.error("Purging lifecycle failure:", error);
//             message.error("Failed to commit deletion requests safely.");
//         }
//     };

//     const columns = [
//         {
//             title: 'Order ID',
//             dataIndex: 'orderId',
//             key: 'orderId',
//             width: 110,
//             render: (id) => <Text code>{id}</Text>
//         },
//         {
//             title: 'Job Assignment Details',
//             dataIndex: 'title',
//             key: 'title',
//             editable: true,
//             width: 220,
//             render: (text) => <Text strong>{text || 'Untitled Project'}</Text>
//         },
//         {
//             title: 'Purchaser Client',
//             dataIndex: 'clientName',
//             key: 'clientName',
//             editable: true,
//             width: 160,
//             render: (text) => <Text>{text}</Text>
//         },
//         {
//             title: 'Assigned Lead',
//             dataIndex: 'assignedEngineer',
//             key: 'assignedEngineer',
//             editable: true,
//             width: 180,
//             render: (text) => <Text type="secondary">{text || 'Unassigned'}</Text>
//         },
//         {
//             title: 'Costing Metric',
//             dataIndex: 'totalAmount',
//             key: 'totalAmount',
//             editable: true,
//             width: 140,
//             render: (val) => <Text strong style={{ color: '#0958d9' }}>Rs. {Number(val || 0).toLocaleString()}</Text>
//         },
//         {
//             title: 'Workflow Status',
//             dataIndex: 'orderStatus',
//             key: 'orderStatus',
//             editable: true,
//             width: 130,
//             render: (status) => {
//                 let color = 'gold';
//                 if (status === 'In Progress') color = 'blue';
//                 if (status === 'Completed') color = 'green';
//                 if (status === 'Cancelled') color = 'red';
//                 return <Tag color={color}>{status || 'Pending'}</Tag>;
//             }
//         },
//         {
//             title: 'Booked Date',
//             dataIndex: 'orderDate',
//             key: 'orderDate',
//             editable: true,
//             width: 130,
//         },
//         {
//             title: 'Target Deadline',
//             dataIndex: 'dueDate',
//             key: 'dueDate',
//             editable: true,
//             width: 130,
//             render: (date) => <Text style={{ fontWeight: 500 }}>{date}</Text>
//         },
//         {
//             title: 'Actions',
//             key: 'actions',
//             width: 120,
//             fixed: 'right', // Lock control columns cleanly to viewport perimeter edges
//             render: (_, record) => {
//                 const editable = isEditing(record);
//                 return editable ? (
//                     <Space size="middle">
//                         <Button type="primary" icon={<CheckOutlined />} onClick={() => saveEdit(record.key)} size="small" />
//                         <Button icon={<CloseOutlined />} onClick={cancelEdit} size="small" danger />
//                     </Space>
//                 ) : (
//                     <Space size="middle">
//                         <Button 
//                             type="text" 
//                             icon={<EditOutlined />} 
//                             disabled={editingKey !== ''} 
//                             onClick={() => startEdit(record)} 
//                         />
//                         <Popconfirm
//                             title="Purge Order Record?"
//                             description={`Erase manifest entry logs for order ${record.orderId}?`}
//                             onConfirm={() => handleDelete(record.key, record.orderId)}
//                             okText="Yes, Delete"
//                             cancelText="Cancel"
//                             okButtonProps={{ danger: true }}
//                             disabled={editingKey !== ''}
//                         >
//                             <Button 
//                                 type="text" 
//                                 danger 
//                                 icon={<DeleteOutlined />} 
//                                 disabled={editingKey !== ''} 
//                             />
//                         </Popconfirm>
//                     </Space>
//                 );
//             }
//         }
//     ];

//     const mergedColumns = columns.map((col) => {
//         if (!col.editable) return col;
//         return {
//             ...col,
//             onCell: (record) => ({
//                 record,
//                 inputType: 
//                     col.dataIndex === 'totalAmount' ? 'number' : 
//                     (col.dataIndex === 'orderStatus' || col.dataIndex === 'clientName' || col.dataIndex === 'assignedEngineer') ? 'select' : 
//                     (col.dataIndex === 'orderDate' || col.dataIndex === 'dueDate') ? 'date' : 'text',
//                 dataIndex: col.dataIndex,
//                 title: col.title,
//                 editing: isEditing(record),
//             }),
//         };
//     });

//     // CUSTOM DINAMIC DROPDOWN GRID RENDER PIPELINES
//     const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
//         let inputNode = <Input size="middle" />;
//         if (inputType === 'number') inputNode = <InputNumber style={{ width: '100%' }} formatter={value => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />;
//         if (inputType === 'date') inputNode = <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />;
//         if (inputType === 'select') {
//             let optionsMap = [];
//             if (dataIndex === 'orderStatus') {
//                 optionsMap = [
//                     { value: 'Pending', label: 'Pending' },
//                     { value: 'In Progress', label: 'In Progress' },
//                     { value: 'Completed', label: 'Completed' },
//                     { value: 'Cancelled', label: 'Cancelled' }
//                 ];
//             } else if (dataIndex === 'clientName') {
//                 optionsMap = systemUsers.filter(u => u.role === 'Client').map(u => ({ value: u.name, label: u.name }));
//             } else if (dataIndex === 'assignedEngineer') {
//                 optionsMap = systemUsers.filter(u => u.role !== 'Client').map(u => ({ value: u.name, label: `${u.name} (${u.role})` }));
//             }
//             inputNode = (
//                 <Select 
//                     options={optionsMap} 
//                     placeholder={`Select ${title}`} 
//                     showSearch
//                     optionFilterProp="label"
//                     filterOption={(input, option) =>
//                         (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
//                     }
//                 />
//             );
//         }

//         return (
//             <td {...restProps}>
//                 {editing ? (
//                     <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[{ required: true, message: `Required parameter` }]}>
//                         {inputNode}
//                     </Form.Item>
//                 ) : (
//                     children
//                 )}
//             </td>
//         );
//     };

//     const filteredOrders = orders.filter(order => {
//         const titleMatch = order?.title ? order.title.toLowerCase() : '';
//         const idMatch = order?.orderId ? order.orderId.toLowerCase() : '';
//         const clientMatch = order?.clientName ? order.clientName.toLowerCase() : '';
//         const engineerMatch = order?.assignedEngineer ? order.assignedEngineer.toLowerCase() : '';
        
//         const matchesSearch = 
//             titleMatch.includes(searchText.toLowerCase()) || 
//             idMatch.includes(searchText.toLowerCase()) ||
//             clientMatch.includes(searchText.toLowerCase()) ||
//             engineerMatch.includes(searchText.toLowerCase());

//         const matchesStatus = statusFilter === 'All' || order?.orderStatus === statusFilter;
//         return matchesSearch && matchesStatus;
//     });

//     return (
//         <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
//             {/* <Navbar /> */}
//             <Content style={{ padding: '40px 24px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
//                 <div style={{ marginBottom: '24px' }}>
//                     <Row align="middle" justify="space-between">
//                         <Col>
//                             <Space align="center" size="middle">
//                                 <div style={{ backgroundColor: '#001529', padding: '12px', borderRadius: '8px', display: 'flex' }}>
//                                     <ShoppingCartOutlined style={{ fontSize: '24px', color: '#fff' }} />
//                                 </div>
//                                 <div>
//                                     <Title level={2} style={{ margin: 0 }}>System Production Order Pipeline</Title>
//                                     <Paragraph type="secondary" style={{ margin: 0 }}>Track job workflows, execute live specification alterations, or drop cancelled requests.</Paragraph>
//                                 </div>
//                             </Space>
//                         </Col>
//                         <Col>
//                             <Button type="primary" size="large" onClick={() => navigate('/dashboard/orders/add')}>+ Create New Order</Button>
//                         </Col>
//                     </Row>
//                 </div>

//                 <Card bordered={false} style={{ marginBottom: '24px', borderRadius: '8px' }}>
//                     <Row gutter={[16, 16]} align="middle" justify="space-between">
//                         <Col xs={24} md={12} lg={8}>
//                             <Input 
//                                 placeholder="Search by Order ID, Job Title, Client or Engineer..." 
//                                 prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
//                                 size="large"
//                                 value={searchText}
//                                 onChange={(e) => setSearchText(e.target.value)}
//                                 allowClear
//                             />
//                         </Col>
//                         <Col xs={24} md={12} lg={6}>
//                             <Select 
//                                 defaultValue="All" 
//                                 style={{ width: '100%' }} 
//                                 size="large"
//                                 onChange={(value) => setStatusFilter(value)}
//                                 options={[
//                                     { value: 'All', label: 'All Operational Pipelines' },
//                                     { value: 'Pending', label: 'Pending Logistics' },
//                                     { value: 'In Progress', label: 'Active Machining (In Progress)' },
//                                     { value: 'Completed', label: 'Completed Jobs' },
//                                     { value: 'Cancelled', label: 'Cancelled / Shelved Orders' }
//                                 ]}
//                             />
//                         </Col>
//                     </Row>
//                 </Card>

//                 <Form form={form} component={false}>
//                     <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ borderRadius: '8px', overflow: 'hidden' }}>
//                         <Table
//                             components={{ body: { cell: EditableCell } }}
//                             columns={mergedColumns}
//                             dataSource={filteredOrders}
//                             rowClassName="editable-row"
//                             pagination={{ defaultPageSize: 10 }}
//                             locale={{ emptyText: 'No orders logged inside the workspace local database.' }}
//                             scroll={{ x: 1300 }}
//                         />
//                     </Card>
//                 </Form>
//             </Content>
//             {/* <Footer style={{ backgroundColor: '#001529', color: 'rgba(255,255,255,0.45)', textAlign: 'center', padding: '24px', marginTop: 'auto' }}>
//                 &copy; {CURRENT_YEAR} Liaqat Engineering Workshop. All Rights Reserved.
//             </Footer> */}
//         </Layout>
//     );
// };

// export default AllOrders;

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Table, Tag, Space, Button, Input, Select, InputNumber, DatePicker, Form, Popconfirm, message, Modal } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

const AllOrders = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    // State for data and role-based access
    const [orders, setOrders] = useState([]);
    const [systemUsers, setSystemUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);

    useEffect(() => {
        // Retrieve data and user session
        const storedOrders = localStorage.getItem('workshop_orders');
        const storedUsers = localStorage.getItem('workshop_users');
        const user = JSON.parse(localStorage.getItem('current_user') || '{}');
        
        setCurrentUser(user);
        if (storedOrders) try { setOrders(JSON.parse(storedOrders)); } catch (e) { setOrders([]); }
        if (storedUsers) try { setSystemUsers(JSON.parse(storedUsers)); } catch (e) { setSystemUsers([]); }
    }, []);

    // Role check helper
    const isAdmin = currentUser?.role === 'Admin';

    const showEditModal = (order) => {
        if (!isAdmin) return; // Prevent non-admins from opening the modal
        setEditingOrder(order);
        setIsEditModalOpen(true);
        form.setFieldsValue({
            ...order,
            orderDate: order.orderDate ? dayjs(order.orderDate) : null,
            dueDate: order.dueDate ? dayjs(order.dueDate) : null,
        });
    };

    const handleEditSave = () => {
        form.validateFields().then((values) => {
            const updatedList = orders.map(ord => ord.key === editingOrder.key ? { ...ord, ...values, orderDate: values.orderDate?.format('YYYY-MM-DD'), dueDate: values.dueDate?.format('YYYY-MM-DD') } : ord);
            setOrders(updatedList);
            localStorage.setItem('workshop_orders', JSON.stringify(updatedList));
            message.success("Order updated.");
            setIsEditModalOpen(false);
        });
    };

    const columns = [
        { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', render: (id) => <Text code>{id}</Text> },
        { title: 'Job', dataIndex: 'title', key: 'title' },
        { title: 'Client', dataIndex: 'clientName', key: 'clientName' },
        { title: 'Cost', dataIndex: 'totalAmount', key: 'totalAmount', render: (val) => `Rs. ${Number(val).toLocaleString()}` },
        { title: 'Status', dataIndex: 'orderStatus', key: 'orderStatus', render: (s) => <Tag color={s === 'Completed' ? 'green' : 'blue'}>{s}</Tag> },
        // Conditionally render Actions only for Admin
        ...(isAdmin ? [{
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => showEditModal(record)} />
                    <Popconfirm title="Delete Order?" onConfirm={() => {
                        const updated = orders.filter(o => o.key !== record.key);
                        setOrders(updated);
                        localStorage.setItem('workshop_orders', JSON.stringify(updated));
                    }}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }] : [])
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col><Title level={2}>Production Pipeline</Title></Col>
                {/* Only Admin can see the Add button */}
                {isAdmin && (
                    <Col>
                        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/dashboard/orders/add')}>
                            Create New Order
                        </Button>
                    </Col>
                )}
            </Row>

            <Table columns={columns} dataSource={orders} rowKey="key" />

            {/* Edit Modal (Admin Only) */}
            <Modal title="Edit Order" open={isEditModalOpen} onOk={handleEditSave} onCancel={() => setIsEditModalOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Job Details"><Input /></Form.Item>
                    <Row gutter={16}>
                        <Col span={12}><Form.Item name="totalAmount" label="Cost"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={12}><Form.Item name="orderStatus" label="Status"><Select options={[{ label: 'Pending', value: 'Pending' }, { label: 'In Progress', value: 'In Progress' }, { label: 'Completed', value: 'Completed' }]} /></Form.Item></Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default AllOrders;