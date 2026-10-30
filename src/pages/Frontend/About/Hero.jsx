import React from 'react';
import { Layout, Typography, Row, Col, Card, Timeline, Divider, theme, Space } from 'antd';
import { GoldOutlined, AimOutlined, SafetyOutlined, RocketOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const CORE_VALUES = [
    { icon: <AimOutlined style={{ fontSize: '24px', color: '#1890ff' }} />, title: "Absolute Precision", description: "We work down to micrometers. Our commitment to strict tolerance levels ensures every fabricated gear fits seamlessly." },
    { icon: <SafetyOutlined style={{ fontSize: '24px', color: '#52c41a' }} />, title: "Uncompromising Safety", description: "Heavy machinery demands structural integrity. We perform rigorous stress testing and ultrasonic checks on high-pressure welds." },
    { icon: <GoldOutlined style={{ fontSize: '24px', color: '#faad14' }} />, title: "Premium Materials", description: "From high-tensile carbon steels to industrial alloys, we prioritize quality to survive punishing working conditions." }
];

const MILESTONES = [
    { children: (<><Text strong style={{ display: 'block', fontSize: '16px', color: '#1890ff' }}>1998</Text><Text strong>Workshop Foundation</Text><p>Opened as a localized repair hub focusing on agricultural custom shafts.</p></>) },
    { children: (<><Text strong style={{ display: 'block', fontSize: '16px', color: '#1890ff' }}>2007</Text><Text strong>Heavy Fabrication Expansion</Text><p>Invested in professional industrial MIG/TIG welding and structural metal bending.</p></>) },
    { children: (<><Text strong style={{ display: 'block', fontSize: '16px', color: '#1890ff' }}>2015</Text><Text strong>High-Tolerance Overhaul</Text><p>Launched deep diagnostic testing and planetary gearbox rebuilding branches.</p></>) },
    { children: (<><Text strong style={{ display: 'block', fontSize: '16px', color: '#1890ff' }}>Present</Text><Text strong>Digital System Integration</Text><p>Deploying web interfaces to streamline engineering consultations and production tracking.</p></>) }
];

const Hero = () => {
    const { token } = theme.useToken();

    return (
        <Layout style={{ backgroundColor: '#fff' }}>
            <Content>
                <div style={{ background: 'linear-gradient(rgba(0, 21, 41, 0.85), rgba(0, 21, 41, 0.95))', padding: '80px 0', textAlign: 'center' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
                        <RocketOutlined style={{ fontSize: '36px', color: '#1890ff', marginBottom: '8px' }} />
                        <Title level={1} style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>Our Heritage & Mission</Title>
                        <Paragraph style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px' }}>
                            For over two decades, Liaqat Engineering Workshop has been a trusted benchmark for high-caliber industrial manufacturing.
                        </Paragraph>
                    </div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
                    <Row gutter={[48, 32]} align="middle">
                        <Col xs={24} md={12}>
                            <Title level={2}>Engineered to Last</Title>
                            <Paragraph style={{ fontSize: '16px', lineHeight: '1.7', color: token.colorTextSecondary }}>
                                Founded in 1998, we scaled from manual lathe repairs to integrated automated machinery pipelines. Today, we anchor operational workflows for major manufacturing networks.
                            </Paragraph>
                        </Col>
                        <Col xs={24} md={12}>
                            <img src="https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRe9f8LgkEXW82tLZRNbMHXjDOJtOn1z25BixgZY1y6sMlbc_tqh7aabpNtcbCyIaMZZSJCT8uDDgIVG40" alt="Workshop" style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '12px' }} />
                        </Col>
                    </Row>
                </div>

                <div style={{ backgroundColor: '#f5f5f5', padding: '64px 0' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>The Pillars of Our Operations</Title>
                        <Row gutter={[24, 24]}>
                            {CORE_VALUES.map((val, i) => (
                                <Col xs={24} md={8} key={i}>
                                    <Card bordered={false} style={{ height: '100%', borderRadius: '12px' }}>
                                        {val.icon}<Title level={4} style={{ marginTop: '16px' }}>{val.title}</Title>
                                        <Paragraph style={{ color: token.colorTextSecondary }}>{val.description}</Paragraph>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>

                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>Milestones of Growth</Title>
                    <Timeline mode="alternate" items={MILESTONES} />
                </div>
            </Content>
        </Layout>
    );
};

export default Hero;