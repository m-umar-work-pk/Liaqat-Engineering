import React from 'react';
import { Layout, Typography, Row, Col, Card, Tag, Button, Divider, theme } from 'antd';
import { 
    SettingOutlined, 
    BuildOutlined, 
    SafetyCertificateOutlined, 
    ToolOutlined,
    DashboardOutlined,
    HeatMapOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

// Moved constant outside to prevent re-instantiation on re-renders
const INDUSTRIAL_SERVICES = [
    {
        icon: <SettingOutlined style={{ fontSize: '28px', color: '#1890ff' }} />,
        title: "Precision Turning & Milling",
        tag: "Machining",
        description: "High-tolerance turning, surface grinding, and multi-axis vertical milling for raw metal stocks. We engineer mechanical gears, crankshafts, and custom bushings.",
        capabilities: ["Tolerance levels down to ±0.01mm", "Internal/External Threading", "Cylinder Re-boring"]
    },
    {
        icon: <BuildOutlined style={{ fontSize: '28px', color: '#52c41a' }} />,
        title: "Heavy Structural Fabrication",
        tag: "Welding",
        description: "Robust structural iron works, steel beam modifications, and structural enclosure assembly for high-load factory setups.",
        capabilities: ["Certified MIG / TIG / Arc welding", "Heavy Sheet Metal Bending", "Custom Bracket Foundations"]
    },
    {
        icon: <SafetyCertificateOutlined style={{ fontSize: '28px', color: '#faad14' }} />,
        title: "Industrial Gearbox Overhaul",
        tag: "Maintenance",
        description: "Complete failure diagnostics, planetary gear tooth restoration, bearing extractions, and casing seal replacements.",
        capabilities: ["Backlash Correction Testing", "Seals & Sealants Replacement", "High-Load Run Inspections"]
    },
    {
        icon: <ToolOutlined style={{ fontSize: '28px', color: '#722ed1' }} />,
        title: "Custom Machinery Blueprinting",
        tag: "Engineering",
        description: "Converting physical component templates or basic hand-drawn design briefs into production-ready physical components.",
        capabilities: ["Reverse Engineering Specs", "Material Stress Assessment", "Prototype Test Runs"]
    },
    {
        icon: <DashboardOutlined style={{ fontSize: '28px', color: '#13c2c2' }} />,
        title: "Pump & Engine Valve Reseating",
        tag: "Reconditioning",
        description: "Restoring maximum compression levels in heavy-duty agricultural hydraulic pumps and combustion engines.",
        capabilities: ["Surface Flatness Trueing", "Pressure Seal Verification", "Manifold Re-sleeving"]
    },
    {
        icon: <HeatMapOutlined style={{ fontSize: '28px', color: '#eb2f96' }} />,
        title: "Shaft Straightening & Hardening",
        tag: "Metals Processing",
        description: "Eliminating structural warping across long industrial conveyor axles and power transmission shafts using controlled physical presses.",
        capabilities: ["Dial-Indicator Alignment", "Thermal Strain Relief", "Keyway Key Channel Cutouts"]
    }
];

const Hero = () => {
    const navigate = useNavigate();
    const { token } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            <Content>
                <div style={{ background: 'linear-gradient(rgba(0, 21, 41, 0.85), rgba(0, 21, 41, 0.95))', padding: '80px 0', textAlign: 'center' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
                        <Title level={1} style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>
                            Industrial Workshop Capabilities
                        </Title>
                        <Paragraph style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '18px' }}>
                            Discover our robust suite of engineering solutions designed for high-tolerance industrial demands.
                        </Paragraph>
                    </div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
                    <Row gutter={[24, 24]}>
                        {INDUSTRIAL_SERVICES.map((item, idx) => (
                            <Col xs={24} md={12} lg={8} key={idx}>
                                <Card hoverable bordered={false} style={{ height: '100%', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>{item.icon}</div>
                                        <Tag color="blue">{item.tag}</Tag>
                                    </div>
                                    <Title level={4}>{item.title}</Title>
                                    <Paragraph style={{ color: token.colorTextSecondary, minHeight: '72px' }}>{item.description}</Paragraph>
                                    <Divider />
                                    <Text strong style={{ fontSize: '12px', textTransform: 'uppercase' }}>Technical Framework:</Text>
                                    <ul style={{ paddingLeft: '16px', marginTop: '8px', color: token.colorTextSecondary }}>
                                        {item.capabilities.map((cap, i) => <li key={i}>{cap}</li>)}
                                    </ul>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                <div style={{ backgroundColor: '#fafafa', padding: '64px 0', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
                    <Title level={3}>Need a Custom Machine Component Fabricated?</Title>
                    <Paragraph style={{ color: token.colorTextSecondary, maxWidth: '600px', margin: '0 auto 24px' }}>
                        Reach out to coordinate with our plant floor manager regarding your blueprints.
                    </Paragraph>
                    <Button type="primary" size="large" icon={<ArrowRightOutlined />} onClick={() => navigate('/contact')}>
                        Request a Consultation
                    </Button>
                </div>
            </Content>
        </Layout>
    );
};

export default Hero;