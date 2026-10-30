import { useState, useEffect } from 'react';
import { Button, Input, Layout, Card, Form, Select, Row, Col, message, Upload, Tooltip, Grid, Spin } from 'antd';
import { SaveOutlined, UploadOutlined, LoadingOutlined, CloseCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { supabase, supabaseUrl } from '@/config/supabase';
import { useNavigate, useParams } from 'react-router-dom';

const { Content } = Layout;

const AddMachine = () => {
  const { machineId } = useParams();
  const isEdit = !!machineId;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const thumbSize = screens.xs ? 80 : 120;

  useEffect(() => {
    if (!machineId) return;
    const fetchMachine = async () => {
      try {
        const snap = await getDoc(doc(firestore, 'machines', machineId));
        if (snap.exists()) {
          const data = snap.data();
          form.setFieldsValue(data);
          setImageUrls(data.imageUrls || []);
        } else {
          message.error('Machine not found');
          navigate('/dashboard/machines');
        }
      } catch {
        message.error('Failed to load machine data');
      } finally {
        setFetching(false);
      }
    };
    fetchMachine();
  }, [machineId]);

  const handleUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('Only image files are allowed');
      return false;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `machines/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

    try {
      const { error } = await supabase.storage
        .from('Profile Images')
        .upload(fileName, file, { upsert: true, contentType: file.type });

      if (error) throw error;

      const publicUrl = `${supabaseUrl}/storage/v1/object/public/Profile%20Images/${fileName}`;
      setImageUrls(prev => [...prev, publicUrl]);
    } catch (error) {
      message.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
    return false;
  };

  const removeImage = async (index) => {
    const url = imageUrls[index];
    const path = url.split('/object/public/Profile%20Images/')[1] || url.split('/object/public/Profile Images/')[1];
    if (path) {
      const { error } = await supabase.storage.from('Profile Images').remove([path]);
      if (error) console.warn('Failed to remove image from storage:', error);
    }
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= imageUrls.length) return;
    setImageUrls(prev => {
      const arr = [...prev];
      const temp = arr[index];
      arr[index] = arr[newIndex];
      arr[newIndex] = temp;
      return arr;
    });
  };

  const onFinish = async (values) => {
    if (imageUrls.length === 0) {
      message.error('Please upload at least one image');
      return;
    }
    try {
      setLoading(true);
      const cleanValues = Object.fromEntries(Object.entries(values).filter(([, v]) => v !== undefined));
      if (isEdit) {
        await updateDoc(doc(firestore, 'machines', machineId), {
          ...cleanValues,
          imageUrls,
          updatedAt: new Date().toISOString(),
        });
        message.success('Machine updated successfully');
      } else {
        await addDoc(collection(firestore, 'machines'), {
          ...cleanValues,
          imageUrls,
          createdAt: new Date().toISOString(),
        });
        message.success('Machine added successfully');
      }
      form.resetFields();
      setImageUrls([]);
      navigate('/dashboard/machines');
    } catch (error) {
      message.error('Error ' + (isEdit ? 'updating' : 'adding') + ' machine: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="d-flex justify-content-center p-5"><Spin size="large" /></div>;

  return (
    <Layout style={{ padding: screens.xs ? 12 : 24, minHeight: '100vh', maxWidth: '100%' }}>
      <Content style={{ maxWidth: 800, width: '100%', margin: '0 auto', minHeight: '100vh' }}>
        <Card title={isEdit ? 'Edit Machine' : 'Add New Machine'}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Machine Images" style={{ textAlign: 'center' }}>
              <Upload multiple beforeUpload={handleUpload} showUploadList={false} accept="image/*">
                <Button icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}>
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </Button>
              </Upload>
              {imageUrls.length > 0 && (
                <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                  {imageUrls.map((url, i) => (
                    <Col key={i}>
                      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <img src={url} style={{ width: thumbSize, height: Math.round(thumbSize * 0.75), objectFit: 'cover', borderRadius: 8, border: '2px solid #1890ff' }} alt="" />
                          <CloseCircleOutlined
                            style={{ position: 'absolute', top: -6, right: -6, fontSize: 16, color: 'red', cursor: 'pointer', background: 'white', borderRadius: '50%' }}
                            onClick={() => removeImage(i)}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <Tooltip title="Move left">
                            <Button size="small" icon={<LeftOutlined />} disabled={i === 0} onClick={() => moveImage(i, -1)} />
                          </Tooltip>
                          <span style={{ fontSize: 12, lineHeight: '24px' }}>{i + 1}</span>
                          <Tooltip title="Move right">
                            <Button size="small" icon={<RightOutlined />} disabled={i === imageUrls.length - 1} onClick={() => moveImage(i, 1)} />
                          </Tooltip>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </Form.Item>

            <Form.Item name="name" label="Machine Name" rules={[{ required: true }]}>
              <Input placeholder="Enter machine name" />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                  <Select placeholder="Select category" options={[
                    { value: 'Turning', label: 'Turning' },
                    { value: 'Drilling', label: 'Drilling' },
                    { value: 'Grinding', label: 'Grinding' },
                    { value: 'Milling', label: 'Milling' },
                    { value: 'Welding', label: 'Welding' },
                    { value: 'Testing', label: 'Testing' },
                    { value: 'Shaping', label: 'Shaping' },
                    { value: 'Forming', label: 'Forming' }
                  ]} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                  <Select placeholder="Select status" options={[
                    { value: 'Operational', label: 'Operational' },
                    { value: 'Maintenance', label: 'Maintenance' },
                    { value: 'Out of Order', label: 'Out of Order' }
                  ]} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="brand" label="Brand">
                  <Input placeholder="e.g. HMT, Bharat" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="model" label="Model">
                  <Input placeholder="e.g. NH-26" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item name="power" label="Power">
                  <Input placeholder="e.g. 7.5 HP" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="speed" label="Speed">
                  <Input placeholder="e.g. 1000 RPM" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="weight" label="Weight">
                  <Input placeholder="e.g. 1500 kg" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="year" label="Year">
              <Input placeholder="e.g. 2024" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} placeholder="Machine description" />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block icon={<SaveOutlined />}>
              {isEdit ? 'Update Machine' : 'Save Machine'}
            </Button>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default AddMachine;
