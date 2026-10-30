import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Card, Divider, List, Tag, Button, message } from 'antd';
import { UserOutlined, SettingOutlined, SafetyCertificateOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Settings = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('current_user') || '{}');
        setCurrentUser(user);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('current_user');
        message.success("Logged out successfully.");
        navigate('/login');
    };

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Title level={2}>System Settings</Title>
            <Paragraph type="secondary">Manage your account preferences and system workspace configuration.</Paragraph>

            <Row gutter={[24, 24]}>
                {/* User Profile Section */}
                <Col span={24}>
                    <Card title={<span><UserOutlined /> Personal Profile</span>} bordered={false}>
                        <List>
                            <List.Item>
                                <List.Item.Meta title="Full Name" description={currentUser?.name || 'N/A'} />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta title="Role" description={<Tag color="blue">{currentUser?.role}</Tag>} />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta title="Account Status" description={<Tag color="green">{currentUser?.status || 'Active'}</Tag>} />
                            </List.Item>
                        </List>
                    </Card>
                </Col>

                {/* Admin Only Section */}
                {currentUser?.role === 'Admin' && (
                    <Col span={24}>
                        <Card title={<span><SafetyCertificateOutlined /> Admin Controls</span>} bordered={false}>
                            <Text type="secondary">Access sensitive system configurations and user directory management.</Text>
                            <br /><br />
                            <Button type="primary" danger onClick={() => navigate('/dashboard/users')}>
                                Manage User Registry
                            </Button>
                        </Card>
                    </Col>
                )}

                {/* Account Actions */}
                <Col span={24}>
                    <Button icon={<LogoutOutlined />} onClick={handleLogout} block size="large">
                        Sign Out
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default Settings;