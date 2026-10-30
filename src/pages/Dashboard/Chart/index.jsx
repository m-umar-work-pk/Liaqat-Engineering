import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Tag, Statistic } from 'antd';
import { useAuth } from '@/context/Auth';
import {
  collection, onSnapshot, query, where
} from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  TeamOutlined, ProjectOutlined, DollarOutlined, CheckCircleOutlined,
  ClockCircleOutlined, RiseOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const COLORS = ['#1d3557', '#457b9d', '#a8dadc', '#e63946', '#f4a261', '#2a9d8f'];

const AdminView = ({ projects, workers }) => {
  const projectStats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'Completed').length,
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    pending: projects.filter(p => p.status === 'Pending').length,
  };

  const statusData = [
    { name: 'Completed', value: projectStats.completed },
    { name: 'In Progress', value: projectStats.inProgress },
    { name: 'Pending', value: projectStats.pending },
  ];

  const revenueData = projects.map((p, i) => ({
    name: p.projectName || `Project ${i + 1}`,
    revenue: Number(p.cost) || 0,
    profit: Number(p.profit) || (Number(p.cost || 0) - Number(p.expense || 0)),
  }));

  const workerStatusData = [
    { name: 'Available', value: workers.filter(w => w.status !== 'Busy').length },
    { name: 'Busy', value: workers.filter(w => w.status === 'Busy').length },
  ];

  const monthlyData = [
    { month: 'Jan', projects: 4, revenue: 150000 },
    { month: 'Feb', projects: 6, revenue: 220000 },
    { month: 'Mar', projects: 8, revenue: 310000 },
    { month: 'Apr', projects: 5, revenue: 180000 },
    { month: 'May', projects: 7, revenue: 260000 },
    { month: 'Jun', projects: 9, revenue: 350000 },
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Total Projects" value={projectStats.total} prefix={<ProjectOutlined />} valueStyle={{ color: '#1d3557' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Completed" value={projectStats.completed} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#2a9d8f' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="In Progress" value={projectStats.inProgress} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#457b9d' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Workers" value={workers.length} prefix={<TeamOutlined />} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Project Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius="60%" dataKey="value" label>
                  {statusData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Revenue & Profit Overview">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={false} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#1d3557" name="Revenue" />
                <Bar dataKey="profit" fill="#2a9d8f" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Worker Availability">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={workerStatusData} cx="50%" cy="50%" outerRadius="60%" dataKey="value" label>
                  {workerStatusData.map((_, index) => <Cell key={index} fill={index === 0 ? '#2a9d8f' : '#e63946'} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Monthly Trends (Sample)">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#1d3557" fill="#457b9d" name="Revenue (PKR)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const ClientView = ({ projects, userData }) => {
  const myProjects = projects.filter(p =>
    p.customerName?.toLowerCase() === userData?.name?.toLowerCase() ||
    p.clientName?.toLowerCase() === userData?.name?.toLowerCase()
  );

  const statusData = [
    { name: 'Completed', value: myProjects.filter(p => p.status === 'Completed').length },
    { name: 'In Progress', value: myProjects.filter(p => p.status === 'In Progress').length },
    { name: 'Pending', value: myProjects.filter(p => p.status === 'Pending').length },
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}><Card><Statistic title="My Projects" value={myProjects.length} prefix={<ProjectOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Completed" value={myProjects.filter(p => p.status === 'Completed').length} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#2a9d8f' }} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="In Progress" value={myProjects.filter(p => p.status === 'In Progress').length} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#457b9d' }} /></Card></Col>
      </Row>
      <Card title="My Project Status">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" outerRadius="60%" dataKey="value" label>
              {statusData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
};

const WorkerView = ({ projects }) => {
  const projectStats = {
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    pending: projects.filter(p => p.status === 'Pending').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    totalRevenue: projects.reduce((sum, p) => sum + (Number(p.cost) || 0), 0),
  };

  const statusData = [
    { name: 'Completed', value: projectStats.completed },
    { name: 'In Progress', value: projectStats.inProgress },
    { name: 'Pending', value: projectStats.pending },
  ];

  const monthlyData = [
    { month: 'Jan', projects: 4, revenue: 150000 },
    { month: 'Feb', projects: 6, revenue: 220000 },
    { month: 'Mar', projects: 8, revenue: 310000 },
    { month: 'Apr', projects: 5, revenue: 180000 },
    { month: 'May', projects: 7, revenue: 260000 },
    { month: 'Jun', projects: 9, revenue: 350000 },
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Active Projects" value={projectStats.inProgress} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#457b9d' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Pending Tasks" value={projectStats.pending} prefix={<ProjectOutlined />} valueStyle={{ color: '#e63946' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Completed Tasks" value={projectStats.completed} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#2a9d8f' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Total Revenue" value={projectStats.totalRevenue} prefix={<DollarOutlined />} formatter={(v) => `Rs. ${Number(v || 0).toLocaleString()}`} /></Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Project Status">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1d3557" name="Projects" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Revenue Growth">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#1d3557" strokeWidth={2} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const ChartPage = () => {
  const { userData } = useAuth();
  const role = userData?.role || 'Customer';

  const [projects, setProjects] = useState([]);
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(firestore, 'projects'), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const workerQuery = query(collection(firestore, 'users'), where('role', '==', 'Worker'));
    const unsubWorkers = onSnapshot(workerQuery, (snap) => {
      setWorkers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubProjects(); unsubWorkers(); };
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: '1400px', width: '100%', margin: '0 auto', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}><RiseOutlined />  Analytics Dashboard</Title>
          <Text type="secondary">
            {role === 'Admin' ? 'Full workshop analytics and overview' :
             role === 'Worker' ? 'Your task and project insights' :
             'Your project progress and status'}
          </Text>
        </Col>
        <Col>
          <Tag color="blue" style={{ padding: '4px 12px', fontSize: 14 }}>{role}</Tag>
        </Col>
      </Row>

      {role === 'Admin' && <AdminView projects={projects} workers={workers} />}
      {role === 'Worker' && <WorkerView projects={projects} />}
      {role === 'Customer' && <ClientView projects={projects} userData={userData} />}
    </div>
  );
};

export default ChartPage;