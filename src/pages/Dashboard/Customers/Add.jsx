import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  message,
  Row,
  Col,
} from "antd";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const AddCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const checkCNICExists = async (cnic) => {
    const q = query(
      collection(firestore, "customers"),
      where("cnic", "==", cnic)
    );

    const snap = await getDocs(q);
    return !snap.empty;
  };

  // 🔥 DIGITS ONLY FUNCTION
  const onlyDigits = (e, fieldName, maxLength = 13) => {
    let value = e.target.value.replace(/\D/g, ""); // remove non-digits

    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    form.setFieldsValue({ [fieldName]: value });
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const exists = await checkCNICExists(values.cnic);

      if (exists) {
        message.error("CNIC already exists!");
        setLoading(false);
        return;
      }

      await addDoc(collection(firestore, "customers"), {
        name: values.name,
        cnic: values.cnic,
        phone: values.phone,
        address: values.address,
        type: values.type || "Local",
        email: values.email || "",
        createdAt: new Date().toISOString(),
      });

      message.success("Customer added successfully");
      form.resetFields();
      navigate("/dashboard/customers/all");
    } catch (error) {
      console.error(error);
      message.error("Error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center">
      <Col xs={24} md={14} lg={10}>
        <Card title="Add Customer">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ type: "Local" }}
          >
            {/* NAME */}
            <Form.Item
              name="name"
              label="Customer Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>

            {/* CNIC DIGITS ONLY */}
            <Form.Item
              name="cnic"
              label="CNIC (13 digits only)"
              rules={[
                { required: true },
                { min: 13, message: "CNIC must be 13 digits" },
              ]}
            >
              <Input
                placeholder="Enter CNIC"
                maxLength={13}
                onChange={(e) => onlyDigits(e, "cnic", 13)}
              />
            </Form.Item>

            {/* PHONE DIGITS ONLY */}
            <Form.Item
              name="phone"
              label="Phone No"
              rules={[
                { required: true },
                { min: 11, message: "Phone must be 11 digits" },
              ]}
            >
              <Input
                placeholder="03XXXXXXXXX"
                maxLength={11}
                onChange={(e) => onlyDigits(e, "phone", 11)}
              />
            </Form.Item>

            {/* ADDRESS */}
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            {/* TYPE */}
            <Form.Item name="type" label="Customer Type">
              <Select>
                <Option value="Local">Local</Option>
                <Option value="Regular">Regular</Option>
                <Option value="Official">Official</Option>
              </Select>
            </Form.Item>

            {/* EMAIL */}
            <Form.Item name="email" label="Email (Optional)">
              <Input />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block>
              Save Customer
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default AddCustomer;