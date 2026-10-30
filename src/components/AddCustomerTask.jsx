import { Card, Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase'; // Ensure this path is correct
import { useAuth } from '@/context/Auth';      // Matches the named export above
import { useNavigate } from 'react-router-dom';

const AddCustomerTask = () => {
    const { user } = useAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        if (!user) {
            message.error("You must be logged in to create a task.");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(firestore, "tasks"), {
                ...values,
                customerId: user.uid,
                customerName: user.fullName || "Anonymous",
                status: 'pending',
                createdAt: serverTimestamp(),
            });

            message.success("Project/Task added successfully!");
            form.resetFields();
            navigate('/dashboard/customer/my-projects');
        } catch (error) {
            console.error("Firestore Error:", error);
            message.error("Failed to add task.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Card title="Register New Project Request" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="title" label="Project Title" rules={[{ required: true }]}>
                        <Input placeholder="e.g., HVAC Installation" />
                    </Form.Item>
                    <Form.Item name="description" label="Project Description" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Submit Request
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddCustomerTask;