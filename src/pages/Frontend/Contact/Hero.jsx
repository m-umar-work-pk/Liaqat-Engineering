import React from 'react';
import { Layout, Typography, Row, Col, Space, Card, Form, Input, Button, theme } from 'antd';
import { PhoneOutlined, EnvironmentOutlined, MailOutlined, ClockCircleOutlined, SendOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const CONTACT_INFO = [
    { icon: <PhoneOutlined style={{ fontSize: '20px', color: '#1890ff' }} />, title: "Administrator", info: "+92 (321) 6649545" },
    { icon: <PhoneOutlined style={{ fontSize: '20px', color: '#1890ff' }} />, title: "Engineer", info: "+92 (315) 6649545" },
    { icon: <PhoneOutlined style={{ fontSize: '20px', color: '#1890ff' }} />, title: "CEO", info: "+92 (300) 6649545" },
    { icon: <MailOutlined style={{ fontSize: '20px', color: '#52c41a' }} />, title: "Email", info: "Liaqat_Engineering.Works@gmail.com" },
    { icon: <EnvironmentOutlined style={{ fontSize: '20px', color: '#faad14' }} />, title: "Location", info: "Industrial Area, Nashatabad, Faisalabad" },
    { icon: <ClockCircleOutlined style={{ fontSize: '20px', color: '#13c2c2' }} />, title: "Hours", info: "Mon-Sat: 09:00 AM - 10:00 PM" }
];

const Hero = () => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        // TODO: Integrate Firebase addDoc(collection(db, "inquiries"), values)
        console.log('Submission:', values);
        form.resetFields();
    };

    return (
        <Layout style={{ backgroundColor: '#fff' }}>
            <Content>
                <div style={{ background: '#001529', padding: '60px 0', textAlign: 'center' }}>
                    <Title level={1} style={{ color: '#fff' }}>Connect With Our Engineers</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px' }}>
                        Have a complex machinery blueprint? Send us a brief or visit us directly.
                    </Paragraph>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
                    <Row gutter={[48, 48]}>
                        <Col xs={24} lg={10}>
                            <Title level={2}>Get In Touch</Title>
                            <Row gutter={[16, 16]}>
                                {CONTACT_INFO.map((item, idx) => (
                                    <Col xs={24} sm={12} lg={24} key={idx}>
                                        <Card bordered={false} style={{ backgroundColor: '#fafafa' }}>
                                            <Space align="start">
                                                {item.icon}
                                                <div>
                                                    <Text type="secondary" style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase' }}>{item.title}</Text>
                                                    <Text strong style={{ display: 'block' }}>{item.info}</Text>
                                                </div>
                                            </Space>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Col>

                        <Col xs={24} lg={14}>
                            <Card style={{ borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
                                <Title level={3}>Project Inquiry</Title>
                                <Form form={form} layout="vertical" onFinish={onFinish}>
                                    <Row gutter={16}>
                                        <Col xs={24} sm={12}><Form.Item label="Name" name="name" rules={[{ required: true }]}><Input size="large" /></Form.Item></Col>
                                        <Col xs={24} sm={12}><Form.Item label="Company" name="company"><Input size="large" /></Form.Item></Col>
                                    </Row>
                                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}><Input size="large" /></Form.Item>
                                    <Form.Item label="Subject" name="subject" rules={[{ required: true }]}><Input size="large" /></Form.Item>
                                    <Form.Item label="Message" name="message" rules={[{ required: true }]}><TextArea rows={5} /></Form.Item>
                                    <Button type="primary" htmlType="submit" size="large" icon={<SendOutlined />} block>Send Message</Button>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    );
};

export default Hero;