import { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Table, Tag, Space, Button, DatePicker, TimePicker, Form, Popconfirm, Select, message, Modal, Radio, Divider } from 'antd';
import { FileTextOutlined, BarChartOutlined, SyncOutlined, LoginOutlined, LogoutOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const UserAttendance = () => {
    const [attendanceForm] = Form.useForm();
    const [viewMode, setViewMode] = useState('daily'); 
    const [selectedDate, setSelectedDate] = useState(dayjs().format('DD-MMM-YYYY'));
    const [selectedMonth, setSelectedMonth] = useState(dayjs().format('MMM-YYYY'));
    const [employees, setEmployees] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState({});
    const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

    useEffect(() => {
        const storedUsers = localStorage.getItem('workshop_users');
        if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers);
            setEmployees(parsedUsers.filter(u => u.role !== 'Client' && u.status === 'Active'));
        }
        const storedAttendance = localStorage.getItem('workshop_attendance');
        if (storedAttendance) {
            setAttendanceRecords(JSON.parse(storedAttendance));
        }
    }, []);

    const getMinutesWorked = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        const start = dayjs(`2026-01-01 ${checkIn}`, 'YYYY-MM-DD hh:mm A');
        const end = dayjs(`2026-01-01 ${checkOut}`, 'YYYY-MM-DD hh:mm A');
        return end.isBefore(start) ? 0 : end.diff(start, 'minute');
    };

    const formatMinutesToString = (totalMinutes) => {
        if (!totalMinutes || totalMinutes === 0) return '—';
        return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
    };

    const saveAttendanceLog = (userKey, status, checkInTime = '', checkOutTime = '', targetDate = selectedDate) => {
        const updatedRecords = { ...attendanceRecords, [targetDate]: { ...(attendanceRecords[targetDate] || {}), [userKey]: { status, checkIn: checkInTime, checkOut: checkOutTime } } };
        setAttendanceRecords(updatedRecords);
        localStorage.setItem('workshop_attendance', JSON.stringify(updatedRecords));
        message.success('Attendance updated successfully.');
    };

    const handleFormSubmit = (values) => {
        saveAttendanceLog(values.userKey, values.status, values.checkIn?.format('hh:mm A'), values.checkOut?.format('hh:mm A'));
        setIsMarkModalOpen(false);
        attendanceForm.resetFields();
    };

    const dailyDataSource = employees.map((emp) => {
        const log = attendanceRecords[selectedDate]?.[emp.key] || { status: 'Absent', checkIn: '', checkOut: '' };
        return { ...emp, ...log, hoursWorked: formatMinutesToString(getMinutesWorked(log.checkIn, log.checkOut)) };
    });

    const monthlyDataSource = employees.map((emp) => {
        let p = 0, h = 0, a = 0, m = 0;
        Object.keys(attendanceRecords).forEach((d) => {
            if (d.includes(selectedMonth)) {
                const log = attendanceRecords[d][emp.key];
                if (log) {
                    if (log.status === 'Present') p++; else if (log.status === 'Half Day') h++; else a++;
                    m += getMinutesWorked(log.checkIn, log.checkOut);
                } else a++;
            }
        });
        return { ...emp, presentDays: p, halfDays: h, absentDays: a, monthlyTotalHours: formatMinutesToString(m) };
    });

    const dailyColumns = [
        { title: 'ID', dataIndex: 'id', width: 90 },
        { title: 'Name', dataIndex: 'name', width: 220 },
        { title: 'Role', dataIndex: 'role', width: 180 },
        { title: 'Status', dataIndex: 'status', width: 130, render: (s) => <Tag color={s === 'Present' ? 'success' : 'error'}>{s}</Tag> },
        { title: 'In', dataIndex: 'checkIn', width: 140 },
        { title: 'Out', dataIndex: 'checkOut', width: 140 },
        { title: 'Hours', dataIndex: 'hoursWorked', width: 150 },
        { title: 'Action', key: 'action', render: (_, record) => <Button type="link" onClick={() => saveAttendanceLog(record.key, 'Present', dayjs().format('hh:mm A'), '')}>Check In</Button> }
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: '#f4f6f9' }}>
            <Content style={{ padding: '32px', maxWidth: '1400px', margin: 'auto', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div>
                        <Title level={3}>Attendance Management</Title>
                        <Text type="secondary">Track staff shifts and performance.</Text>
                    </div>
                    <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)} buttonStyle="solid">
                        <Radio.Button value="daily"><FileTextOutlined /> Daily</Radio.Button>
                        <Radio.Button value="monthly"><BarChartOutlined /> Monthly</Radio.Button>
                    </Radio.Group>
                </div>
                <Card bordered={false} bodyStyle={{ padding: 0 }}>
                    <Table columns={viewMode === 'daily' ? dailyColumns : []} dataSource={viewMode === 'daily' ? dailyDataSource : monthlyDataSource} pagination={false} scroll={{ x: 1000 }} />
                </Card>
            </Content>
        </Layout>
    );
};

export default UserAttendance;