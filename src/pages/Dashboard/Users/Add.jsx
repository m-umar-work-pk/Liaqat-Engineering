import React, { useState } from 'react';
import { Layout, Typography, Card, Form, Input, Select, InputNumber, Button, DatePicker, Row, Col, message, Upload } from 'antd';
import { SaveOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/config/firebase"; // Ensure your firebase config is set up
import { supabase } from "@/config/supabase"; // Ensure your supabase config is set up

const { Content } = Layout;
const { Title } = Typography;

const AddUser = () => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);

    const navigate = useNavigate();

    // 1. Upload to Supabase Storage
    const handleImageUpload = async (file) => {
        setUploading(true);
        const fileName = `avatars/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from('Profile Images').upload(fileName, file);

        if (error) {
            message.error("Upload failed: " + error.message);
        } else {
            const { data } = supabase.storage.from('Profile Images').getPublicUrl(fileName);
            setAvatarUrl(data.publicUrl);
            message.success("Image uploaded!");
        }
        setUploading(false);
    };

    // 2. Submit to Firebase
    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Create Authentication Account
            const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password);

            // Store Metadata in Firestore
            await setDoc(doc(firestore, "users", userCred.user.uid), {
                ...values,
                avatarUrl,
                uid: userCred.user.uid,
                createdAt: new Date().toISOString(),
                // Format dates
                startDate: values.startDate?.format('YYYY-MM-DD') || null,
                endDate: values.endDate?.format('YYYY-MM-DD') || null,
                leaveStart: values.leaveStart?.format('YYYY-MM-DD') || null,
                leaveEnd: values.leaveEnd?.format('YYYY-MM-DD') || null,
            });

            message.success("User registered successfully.");
            navigate('/dashboard/users/all');
        } catch (err) {
            message.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // <></>
        <Layout style={{ padding: '40px', minHeight: '100vh' }}>
            <Content style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Card title="Add New Personnel">
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item label="Profile Picture">
                            <Upload beforeUpload={(file) => { handleImageUpload(file); return false; }} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}><Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item></Col>
                            <Col span={12}><Form.Item name="email" label="Email" rules={[{ required: true }]}><Input /></Form.Item></Col>
                            <Col span={12}><Form.Item name="password" label="Password" rules={[{ required: true }]}><Input.Password /></Form.Item></Col>
                            <Col span={12}><Form.Item name="phone" label="Phone"><Input /></Form.Item></Col>
                        </Row>

                        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                            <Select options={[
                                { value: 'Admin', label: 'Admin' },
                                { value: 'Worker', label: 'Worker (Manager/Engineer/Technician)' },
                                { value: 'Customer', label: 'Customer' }
                            ]} />
                        </Form.Item>

                        <Form.Item noStyle dependencies={['role', 'status']}>
                            {({ getFieldValue }) => {
                                const role = getFieldValue('role');
                                const status = getFieldValue('status');

                                return (
                                    <>
                                        {role === 'Customer' && (
                                            <Form.Item name="custType" label="Type"><Select options={[{ value: 'Regular', label: 'Regular' }, { value: 'Local', label: 'Local' }, { value: 'Official', label: 'Official' }]} /></Form.Item>
                                        )}
                                        {role === 'Worker' && (
                                            <>
                                                <Form.Item name="salary" label="Salary"><InputNumber style={{ width: '100%' }} /></Form.Item>
                                                <Form.Item name="status" label="Status"><Select options={[{ value: 'Active', label: 'Active' }, { value: 'Leave', label: 'Leave' }, { value: 'Resigned', label: 'Resigned' }]} /></Form.Item>
                                                {status === 'Active' && <Form.Item name="startDate" label="Start Date"><DatePicker style={{ width: '100%' }} /></Form.Item>}
                                                {status === 'Leave' && <><Form.Item name="leaveStart" label="Leave Start"><DatePicker style={{ width: '100%' }} /></Form.Item><Form.Item name="leaveEnd" label="Leave End"><DatePicker style={{ width: '100%' }} /></Form.Item></>}
                                                {status === 'Resigned' && <Form.Item name="endDate" label="Last Date"><DatePicker style={{ width: '100%' }} /></Form.Item>}
                                            </>
                                        )}
                                    </>
                                );
                            }}
                        </Form.Item>

                        <Form.Item name="address" label="Address">
                            <Input.TextArea />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block icon={<SaveOutlined />}>Save to Firestore</Button>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};

export default AddUser;