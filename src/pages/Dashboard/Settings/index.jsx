import { Typography, Row, Col, Card, List, Tag, Button, message, Avatar, Space } from 'antd';
import {
    UserOutlined,
    SafetyCertificateOutlined,
    LogoutOutlined,
    MailOutlined,
    IdcardOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/Auth';

const { Title, Text, Paragraph } = Typography;

const Settings = () => {
    const navigate = useNavigate();
    const { user, userData, handleLogout } = useAuth();

    const displayName = userData?.fullName || userData?.name || user?.displayName || 'N/A';
    const role = userData?.role || 'N/A';
    const email = user?.email || userData?.email || 'N/A';
    const status = userData?.status || 'Active';
    const isAdmin = role === 'Admin';

    const handleSignOut = async () => {
        try {
            await handleLogout();
            message.success('Logged out successfully.');
            navigate('/auth/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
            message.error('Failed to log out. Please try again.');
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Title level={2}>System Settings</Title>
            <Paragraph type="secondary">
                Manage your account preferences and system workspace configuration.
            </Paragraph>

            <Row gutter={[24, 24]}>
                {/* User Profile Section */}
                <Col span={24}>
                    <Card title={<span><UserOutlined /> Personal Profile</span>} bordered={false}>
                        <Space size="large" align="center" style={{ marginBottom: 16 }}>
                            <Avatar size={64} icon={<UserOutlined />} src={userData?.avatarUrl} />
                            <div>
                                <Text strong style={{ fontSize: 16 }}>{displayName}</Text>
                                <div><Tag color="blue" style={{ marginTop: 4 }}>{role}</Tag></div>
                            </div>
                        </Space>
                        <List>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<UserOutlined />}
                                    title="Full Name"
                                    description={displayName}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<MailOutlined />}
                                    title="Email"
                                    description={email}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<IdcardOutlined />}
                                    title="Role"
                                    description={<Tag color="blue">{role}</Tag>}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<SafetyCertificateOutlined />}
                                    title="Account Status"
                                    description={<Tag color={status === 'Active' ? 'green' : 'orange'}>{status}</Tag>}
                                />
                            </List.Item>
                        </List>
                    </Card>
                </Col>

                {/* Admin Only Section */}
                {isAdmin && (
                    <Col span={24}>
                        <Card title={<span><SafetyCertificateOutlined /> Admin Controls</span>} bordered={false}>
                            <Text type="secondary">
                                Access sensitive system configurations and user directory management.
                            </Text>
                            <br /><br />
                            <Space wrap>
                                <Button type="primary" onClick={() => navigate('/dashboard/users/all')}>
                                    Manage User Registry
                                </Button>
                                <Button onClick={() => navigate('/dashboard/dashboard')}>
                                    View Overview
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                )}

                {/* Account Actions */}
                <Col span={24}>
                    <Button
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleSignOut}
                        block
                        size="large"
                    >
                        Sign Out
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default Settings;
