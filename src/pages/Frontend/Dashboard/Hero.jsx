import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Table,
  Tag,
  List,
  Avatar,
  Spin,
} from "antd";
import {
  BuildOutlined,
  TeamOutlined,
  DollarCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/config/firebase";

const { Title } = Typography;

const Hero = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    profit: 0,
    totalProjects: 0,
    workerCount: 0,
    pendingJobs: 0,
    inProgressJobs: 0,
    completedJobs: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [activeWorkers, setActiveWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Projects listener
    const unsubProjects = onSnapshot(
      collection(firestore, "projects"),
      (snapshot) => {
        let rev = 0,
          prof = 0,
          pend = 0,
          prog = 0,
          comp = 0;

        const projects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        projects.forEach((p) => {
          const cost = Number(p.cost) || 0;
          const exp = Number(p.expenses) || 0;

          rev += cost;
          prof += p.profit ? Number(p.profit) : cost - exp;

          if (p.status === "Pending") pend++;
          else if (p.status === "In Progress") prog++;
          else if (p.status === "Completed") comp++;
        });

        setStats((prev) => ({
          ...prev,
          revenue: rev,
          profit: prof,
          totalProjects: projects.length,
          pendingJobs: pend,
          inProgressJobs: prog,
          completedJobs: comp,
        }));

        setRecentProjects(projects.slice(0, 4));
        setLoading(false);
      }
    );

    // Workers listener
    const workerQuery = query(
      collection(firestore, "users"),
      where("role", "==", "worker")
    );

    const unsubWorkers = onSnapshot(workerQuery, (snapshot) => {
      const workers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStats((prev) => ({
        ...prev,
        workerCount: workers.length,
      }));

      setActiveWorkers(
        workers.filter(
          (w) => w.status === "Active" || w.status === "On Duty"
        )
      );
    });

    return () => {
      unsubProjects();
      unsubWorkers();
    };
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center p-5">
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ padding: 24, backgroundColor: "#f0f2f5" }}>
      <Title level={2}>Workshop Operations Dashboard</Title>

      {/* STATS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Booked Jobs"
              value={stats.totalProjects}
              prefix={<BuildOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Floor Workers"
              value={stats.workerCount}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Gross Turnover"
              value={stats.revenue}
              prefix={<DollarCircleOutlined />}
              formatter={(v) =>
                `Rs. ${Number(v || 0).toLocaleString()}`
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Net Profits"
              value={stats.profit}
              prefix={<RiseOutlined />}
              styles={{
                content: {
                  color:
                    stats.profit >= 0 ? "#52c41a" : "#ff4d4f",
                },
              }}
              formatter={(v) =>
                `Rs. ${Number(v || 0).toLocaleString()}`
              }
            />
          </Card>
        </Col>
      </Row>

      {/* TABLE + WORKERS */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Recently Updated Mechanical Logs">
            <Table
              dataSource={recentProjects}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: "ID",
                  dataIndex: "id",
                  render: (id) => `#${id?.slice(-4)}`,
                },
                { title: "Client", dataIndex: "clientName" },
                {
                  title: "Price",
                  dataIndex: "cost",
                  render: (val) =>
                    `Rs. ${Number(val || 0).toLocaleString()}`,
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (s) => (
                    <Tag
                      color={
                        s === "Completed"
                          ? "green"
                          : s === "In Progress"
                          ? "blue"
                          : "orange"
                      }
                    >
                      {s}
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="🛠️ On-Duty Operators">
            <div>
  {activeWorkers.length === 0 ? (
    <p>No active workers</p>
  ) : (
    activeWorkers.map((w) => (
      <div
        key={w.id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Avatar>{w.name?.[0]}</Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{w.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>
              {w.specialization}
            </div>
          </div>
        </div>

        <Tag color="green">ON DUTY</Tag>
      </div>
    ))
  )}
</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Hero;