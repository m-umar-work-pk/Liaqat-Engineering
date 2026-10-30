import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Image, Spin, Button, Tag, Typography, Row, Col, Empty } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const { Title } = Typography;

const statusColor = (status) => {
  if (status === "Operational") return "green";
  if (status === "Maintenance") return "orange";
  if (status === "Out of Order") return "red";
  return "default";
};

const MachineDetails = () => {
  const { machineId } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const snap = await getDoc(doc(db, "machines", machineId));
        if (snap.exists()) {
          setMachine({ id: snap.id, ...snap.data() });
        } else {
          setMachine(null);
        }
      } catch (err) {
        console.error("Error loading machine:", err);
        setMachine(null);
      } finally {
        setLoading(false);
      }
    };
    if (machineId) fetchMachine();
  }, [machineId]);

  if (loading) {
    return (
      <div style={{ height: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!machine) {
    return (
      <div style={{ padding: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/dashboard/machines")} style={{ marginBottom: 16 }}>
          Back to Machines
        </Button>
        <Empty description="Machine not found" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/dashboard/machines")} style={{ marginBottom: 16 }}>
        Back to Machines
      </Button>

      <Card>
        <Title level={3}>{machine.name}</Title>

        {Array.isArray(machine.imageUrls) && machine.imageUrls.length > 0 && (
          <Image.PreviewGroup>
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
              {machine.imageUrls.map((url, i) => (
                <Col key={i}>
                  <Image width={160} height={120} src={url} alt={`${machine.name}-${i}`} style={{ objectFit: "cover", borderRadius: 8 }} />
                </Col>
              ))}
            </Row>
          </Image.PreviewGroup>
        )}

        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }} size="small">
          <Descriptions.Item label="Status">
            <Tag color={statusColor(machine.status)}>{machine.status || "Unknown"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Category">{machine.category || "—"}</Descriptions.Item>
          <Descriptions.Item label="Brand">{machine.brand || "—"}</Descriptions.Item>
          <Descriptions.Item label="Model">{machine.model || "—"}</Descriptions.Item>
          <Descriptions.Item label="Power">{machine.power || "—"}</Descriptions.Item>
          <Descriptions.Item label="Speed">{machine.speed || "—"}</Descriptions.Item>
          <Descriptions.Item label="Weight">{machine.weight || "—"}</Descriptions.Item>
          <Descriptions.Item label="Year">{machine.year || "—"}</Descriptions.Item>
        </Descriptions>

        {machine.description && (
          <Card type="inner" title="Description" style={{ marginTop: 16 }}>
            {machine.description}
          </Card>
        )}
      </Card>
    </div>
  );
};

export default MachineDetails;
