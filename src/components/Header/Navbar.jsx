import { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Space, Button } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom'; 
import { useAuth } from '@/context/Auth';
import { 
    LogoutOutlined, 
    DashboardOutlined, 
    SettingOutlined, 
    UserOutlined, 
    LoginOutlined, 
    FormOutlined,
    ProjectOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const Navbar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Define your sidebar items here or import from MenuItems.jsx
    const menuItems = [
        { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard', onClick: () => navigate('/dashboard') },
        { key: '/dashboard/projects', icon: <ProjectOutlined />, label: 'Projects', onClick: () => navigate('/dashboard/projects') },
        { key: '/dashboard/orders', icon: <ShoppingCartOutlined />, label: 'Orders', onClick: () => navigate('/dashboard/orders') },
    ];

    const profileMenuItems = [
        { key: '0', label: <strong>{user?.fullName || 'User'}</strong>, disabled: true },
        { key: '1', label: 'Dashboard', icon: <DashboardOutlined />, onClick: () => navigate("/dashboard") },
        { key: '2', label: 'Settings', icon: <SettingOutlined />, onClick: () => navigate("/dashboard/settings") },
        { type: 'divider' },
        { key: '3', label: 'Logout', icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div className="py-3 text-center">
                    <img 
                        src="/logo.jpg" 
                        alt="logo" 
                        style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} 
                    />
                </div>
                <Menu 
                    theme="dark" 
                    mode="inline" 
                    selectedKeys={[location.pathname]} 
                    items={menuItems} 
                />
            </Sider>

            <Layout>
                <Header className='d-flex align-items-center justify-content-end px-4' style={{ backgroundColor: '#001529' }}>
                    <Space size="middle">
                        {user ? (
                            <>
                                <Text style={{ color: 'white' }}>{user.fullName}</Text>
                                <Dropdown menu={{ items: profileMenuItems }} trigger={['click']}>
                                    <Avatar 
                                        src={user.avatar} 
                                        icon={!user.avatar && <UserOutlined />} 
                                        style={{ cursor: 'pointer', backgroundColor: !user.avatar ? '#87d068' : 'transparent' }} 
                                    />
                                </Dropdown>
                            </>
                        ) : (
                            <>
                                <Button type="text" onClick={() => navigate('/auth/login')} style={{ color: 'white' }} icon={<LoginOutlined />}>Login</Button>
                                <Button type="primary" onClick={() => navigate('/auth/register')} icon={<FormOutlined />}>Register</Button>
                            </>
                        )}
                    </Space>
                </Header>
                <Content className='p-3'>
                    <div className="card p-3 border-0 h-100 shadow-sm" style={{ minHeight: '80vh' }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Navbar;