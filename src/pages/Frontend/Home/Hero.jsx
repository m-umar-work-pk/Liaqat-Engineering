// import React, { useEffect, useState } from 'react';
// import { Typography, Button, Card, Row, Col, Space, Statistic, Divider, theme, Spin } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { firestore } from '@/config/firebase'; // Ensure your firebase config is correct
// import { collection, query, where, getCountFromServer } from 'firebase/firestore';
// import { BuildOutlined, SettingOutlined, SafetyCertificateOutlined, ArrowRightOutlined } from '@ant-design/icons';

// const { Title, Paragraph } = Typography;

// export default function Hero() {
//     const [loading, setLoading] = useState(true);
//     const [stats, setStats] = useState({
//         completedProjects: 0,
//         workers: 0,
//         clients: 0
//     });

//     const navigate = useNavigate();
//     const { token } = theme.useToken();

//     // Use server-side year calculation
//     const CURRENT_YEAR = new Date().getFullYear();
//     const YEARS_ACTIVE = CURRENT_YEAR - 1998;

//     useEffect(() => {
//         const fetchStats = async () => {
//             try {
//                 // 1. Count Completed Projects
//                 const projectsQuery = query(collection(firestore, "projects"), where("status", "==", "Completed"));
//                 const projectSnapshot = await getCountFromServer(projectsQuery);

//                 // 2. Count Workers
//                 const workersQuery = query(collection(firestore, "users"), where("role", "==", "Worker"));
//                 const workerSnapshot = await getCountFromServer(workersQuery);

//                 // 3. Count Clients
//                 const clientsQuery = query(collection(firestore, "users"), where("role", "==", "Customer"));
//                 const clientSnapshot = await getCountFromServer(clientsQuery);

//                 setStats({
//                     completedProjects: projectSnapshot.data().count,
//                     workers: workerSnapshot.data().count,
//                     clients: clientSnapshot.data().count
//                 });
//             } catch (error) {
//                 console.error("Error fetching Firestore stats:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStats();
//     }, []);

//     const services = [
//         {
//             icon: <SettingOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
//             title: "Precision Machining",
//             description: "High-tolerance lathe operations, milling, and custom structural component engineering tailored to exact industrial specifications."
//         },
//         {
//             icon: <BuildOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
//             title: "Heavy Fabrication",
//             description: "Robust structural steel welding, metal bending, and machinery assembly designed to withstand high-stress environments."
//         },
//         {
//             icon: <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#faad14' }} />,
//             title: "Maintenance & Repair",
//             description: "Comprehensive diagnostic testing, mechanical overhaul, and reconditioning of old or broken industrial gearboxes and engines."
//         }
//     ];

//     return (
//         <div style={{ backgroundColor: '#fff', borderRadius: "12px", width: '100%' }}>
//             {/* HERO SECTION */}
//             <div style={{ 
//                 background: 'linear-gradient(rgba(0, 21, 41, 0.85), rgba(0, 21, 41, 0.9)), url("https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80") center/cover no-repeat',
//                 minHeight: '60vh', borderRadius: "12px", padding: '60px 0', display: 'flex', alignItems: 'center'
//             }}>
//                 <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', zIndex: 1, padding: '0 16px' }}>
//                     <Row align="middle" gutter={[32, 32]}>
//                         <Col xs={24} lg={20}>
//                             <Space direction="vertical" size="middle">
//                                 <span style={{ backgroundColor: '#1d3557', color: '#fff', padding: '5px 15px', borderRadius: '10px', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '12px' }}>
//                                     Est. 1998
//                                 </span>
//                                 <Title level={1} style={{ color: '#fff', marginBottom: 0, fontSize: 'calc(1.8rem + 1.5vw)', fontWeight: 700 }}>
//                                     Next-Gen Engineering & Workshop Solutions
//                                 </Title>
//                                 <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '16px', marginBottom: '16px' }}>
//                                     Liaqat Engineering Workshop delivers top-tier mechanical fabrication and industrial repairs with absolute pinpoint accuracy.
//                                 </Paragraph>
//                                 <Space size="middle">
//                                     <Button type="primary" size="large" onClick={() => navigate('/auth/register')} icon={<ArrowRightOutlined />}>Get Started</Button>
//                                     <Button ghost size="large" onClick={() => navigate('/dashboard/about')} icon={<BuildOutlined />}>Our Capabilities</Button>
//                                 </Space>
//                             </Space>
//                         </Col>
//                     </Row>
//                 </div>
//             </div>

//             {/* STATS STRIP */}
//             <div style={{ padding: '20px 0', borderRadius: '12px', marginTop: '16px', backgroundColor:'#fff', boxShadow: '0px 2px 16px rgba(14, 30, 37, 0.12)' }}>
//                 {loading ? <div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div> : (
//                     <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
//                         <Row gutter={[32, 32]} justify="center" style={{ textAlign: 'center' }}>
//                             <Col xs={12} md={5}><Statistic title="Years Active" value={YEARS_ACTIVE} suffix="+" valueStyle={{ color: '#001529', fontWeight: 'bold' }} /></Col>
//                             <Col xs={12} md={5}><Statistic title="Completed Projects" value={stats.completedProjects} suffix="+" valueStyle={{ color: '#001529', fontWeight: 'bold' }} /></Col>
//                             <Col xs={12} md={5}><Statistic title="Total Workers" value={stats.workers} suffix="+" valueStyle={{ color: '#001529', fontWeight: 'bold' }} /></Col>
//                             <Col xs={12} md={5}><Statistic title="Total Clients" value={stats.clients} suffix="+" valueStyle={{ color: '#001529', fontWeight: 'bold' }} /></Col>
//                             <Col xs={12} md={4}><Statistic title="Satisfaction" value={98} suffix="%" valueStyle={{ color: '#001529', fontWeight: 'bold' }} /></Col>
//                         </Row>
//                     </div>
//                 )}
//             </div>

//             {/* SERVICES SECTION */}
//             <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
//                 <div style={{ textAlign: 'center', marginBottom: '48px' }}>
//                     <Title level={2}>Our Engineering Expertise</Title>
//                     <Divider style={{ maxWidth: '80px', margin: '24px auto 0', borderWidth: '3px', borderColor: '#1890ff' }} />
//                 </div>
//                 <Row gutter={[24, 24]}>
//                     {services.map((service, idx) => (
//                         <Col xs={24} md={8} key={idx}>
//                             <Card hoverable bordered={true} style={{ height: '100%', borderRadius: '12px' }} styles={{ body: { padding: '32px 24px' } }}>
//                                 <div style={{ marginBottom: '16px' }}>{service.icon}</div>
//                                 <Title level={4}>{service.title}</Title>
//                                 <Paragraph style={{ color: token.colorTextSecondary }}>{service.description}</Paragraph>
//                             </Card>
//                         </Col>
//                     ))}
//                 </Row>
//             </div>
//         </div>
//     );
// }


import React, { useEffect, useState } from 'react';
import { Typography, Button, Card, Row, Col, Space, Statistic, Divider, theme, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { firestore } from '@/config/firebase'; // Ensure your firebase config is correct
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { BuildOutlined, SettingOutlined, SafetyCertificateOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function Hero() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        completedProjects: 0,
        workers: 0,
        clients: 0
    });

    const navigate = useNavigate();
    const { token } = theme.useToken();

    // Use server-side year calculation
    const CURRENT_YEAR = new Date().getFullYear();
    const YEARS_ACTIVE = CURRENT_YEAR - 1998;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Count Completed Projects
                const projectsQuery = query(collection(firestore, "projects"), where("status", "==", "Completed"));
                const projectSnapshot = await getCountFromServer(projectsQuery);

                // 2. Count Workers
                const workersQuery = query(collection(firestore, "users"), where("role", "==", "Worker"));
                const workerSnapshot = await getCountFromServer(workersQuery);

                // 3. Count Clients
                const clientsQuery = query(collection(firestore, "customers"));
                const clientSnapshot = await getCountFromServer(clientsQuery);

                setStats({
                    completedProjects: projectSnapshot.data().count,
                    workers: workerSnapshot.data().count,
                    clients: clientSnapshot.data().count
                });
            } catch (error) {
                console.error("Error fetching Firestore stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const services = [
        {
            icon: <SettingOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
            title: "Precision Machining",
            description: "High-tolerance lathe operations, milling, and custom structural component engineering tailored to exact industrial specifications."
        },
        {
            icon: <BuildOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
            title: "Heavy Fabrication",
            description: "Robust structural steel welding, metal bending, and machinery assembly designed to withstand high-stress environments."
        },
        {
            icon: <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#faad14' }} />,
            title: "Maintenance & Repair",
            description: "Comprehensive diagnostic testing, mechanical overhaul, and reconditioning of old or broken industrial gearboxes and engines."
        }
    ];

    return (
        <div style={{ backgroundColor: '#fff', borderRadius: "12px", width: '100%' }}>
            {/* HERO SECTION */}
            <div style={{ 
                background: 'linear-gradient(rgba(0, 21, 41, 0.85), rgba(0, 21, 41, 0.9)), url("https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80") center/cover no-repeat',
                minHeight: '60vh',margin:'12px 10px 0 10px', borderRadius: "12px", padding: '60px 0', display: 'flex', alignItems: 'center'
            }}>
                <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', zIndex: 1, padding: '0 16px' }}>
                    <Row align="middle" gutter={[32, 32]}>
                        <Col xs={24} lg={20}>
                            <Space direction="vertical" size="middle">
                                <span style={{ backgroundColor: '#1d3557', color: '#fff', padding: '5px 15px', borderRadius: '10px', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '12px' }}>
                                    Est. 1998
                                </span>
                                <Title level={1} style={{ color: '#fff', marginBottom: 0, fontSize: 'calc(1.8rem + 1.5vw)', fontWeight: 700 }}>
                                    Next-Gen Engineering & Workshop Solutions
                                </Title>
                                <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '16px', marginBottom: '16px' }}>
                                    Liaqat Engineering Workshop delivers top-tier mechanical fabrication and industrial repairs with absolute pinpoint accuracy.
                                </Paragraph>
                                <Space size="middle">
                                    <Button type="primary" size="large" onClick={() => navigate('/dashboard/home')} icon={<ArrowRightOutlined />}>Get Started</Button>
                                    <Button ghost size="large" onClick={() => navigate('/dashboard/about')} icon={<BuildOutlined />}>Our Capabilities</Button>
                                </Space>
                            </Space>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* STATS STRIP */}
            <div style={{ padding: '20px 0',margin:'10px 12px', borderRadius: '12px', marginTop: '16px', backgroundColor:'#fff', boxShadow: '0px 2px 16px rgba(14, 30, 37, 0.12)' }}>
                {loading ? <div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div> : (
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                        <Row gutter={[32, 32]} justify="center" style={{ textAlign: 'center' }}>
                            <Col xs={12} md={5}><Statistic title="Years Active" value={YEARS_ACTIVE} suffix="+" valueStyle={{ color: '#001529', fontWeight: 'bold' }} /></Col>
                            <Col xs={12} md={5}><Statistic title="Completed Projects" value={stats.completedProjects} suffix="+" valueStyle={{ color: '#001529', fontWeight: 'bold' }} /></Col>
                            <Col xs={12} md={5}><Statistic title="Total Workers" value={stats.workers} suffix="+" valueStyle={{ color: '#001529', fontWeight: 'bold' }} /></Col>
                            <Col xs={12} md={5}><Statistic title="Total Clients" value={stats.clients} suffix="+" valueStyle={{ color: '#001529', fontWeight: 'bold' }} /></Col>
                            <Col xs={12} md={4}><Statistic title="Satisfaction" value={98} suffix="%" valueStyle={{ color: '#001529', fontWeight: 'bold' }} /></Col>
                        </Row>
                    </div>
                )}
            </div>

            {/* SERVICES SECTION */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <Title level={2}>Our Engineering Expertise</Title>
                    <Divider style={{ maxWidth: '80px', margin: '24px auto 0', borderWidth: '3px', borderColor: '#1890ff' }} />
                </div>
                <Row gutter={[24, 24]}>
                    {services.map((service, idx) => (
                        <Col xs={24} md={8} key={idx}>
                            <Card hoverable bordered={true} style={{ height: '100%', borderRadius: '12px' }} styles={{ body: { padding: '32px 24px' } }}>
                                <div style={{ marginBottom: '16px' }}>{service.icon}</div>
                                <Title level={4}>{service.title}</Title>
                                <Paragraph style={{ color: token.colorTextSecondary }}>{service.description}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}