import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Button, Card, message, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title } = Typography;

const AddOrder = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        // SECURITY CHECK: Redirect if not Admin
        const user = JSON.parse(localStorage.getItem('current_user') || '{}');
        if (user.role !== 'Admin') {
            message.error("Unauthorized access. Redirecting...");
            navigate('/dashboard');
        }
    }, [navigate]);

    const onFinish = (values) => {
        const existingOrders = JSON.parse(localStorage.getItem('workshop_orders') || '[]');
        
        const newOrder = {
            ...values,
            key: Date.now().toString(),
            orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            orderDate: values.orderDate ? values.orderDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
            dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
            totalAmount: values.totalAmount || 0,
        };

        localStorage.setItem('workshop_orders', JSON.stringify([...existingOrders, newOrder]));
        message.success("Order successfully commissioned.");
        navigate('/dashboard/orders');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <Card title={<Title level={3}>Commission New Order</Title>} bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
                                <Input size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="clientName" label="Client Name" rules={[{ required: true }]}>
                                <Input size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="totalAmount" label="Total Value (PKR)" rules={[{ required: true }]}>
                                <InputNumber size="large" style={{ width: '100%' }} prefix="Rs." />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="orderDate" label="Booking Date">
                                <DatePicker style={{ width: '100%' }} size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="dueDate" label="Target Deadline">
                                <DatePicker style={{ width: '100%' }} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            Finalize Order Entry
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddOrder;