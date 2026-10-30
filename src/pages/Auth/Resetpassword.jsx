import { useState } from "react";
import { Button, Form, Input, Typography, Result } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";

const { Title, Text } = Typography;
const { Item } = Form;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleResetRequest = async (values) => {
    const { email } = values;
    setLoading(true);

    try {
      // Initiate secure password reset via Firebase
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setEmailSent(true);
      window.toastify?.("Password reset email sent successfully!", "success");
    } catch (error) {
      console.error("Reset Error:", error);

      // Mapping Firebase error codes for user clarity
      const errorMessages = {
        "auth/user-not-found": "No account found with this email.",
        "auth/invalid-email": "The email address is invalid.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/network-request-failed": "Network error. Please check your connection.",
      };

      const message = errorMessages[error.code] || "Something went wrong. Please try again.";
      window.toastify?.(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth p-4">
      <div
        className="card p-4 shadow"
        style={{
          maxWidth: "450px",
          margin: "50px auto",
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        {!emailSent ? (
          <>
            <Title level={2}>Reset Password</Title>
            <Text type="secondary" className="d-block mb-4">
              Enter your email address and we will send you a secure password reset link.
            </Text>

            <Form form={form} layout="vertical" onFinish={handleResetRequest}>
              <Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input size="large" placeholder="name@example.com" />
              </Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Send Reset Link
              </Button>
            </Form>

            <div className="text-center mt-4">
              <Text type="secondary">Remember your password? </Text>
              <Link to="/auth/login">Login</Link>
            </div>
          </>
        ) : (
          <Result
            status="success"
            title="Check your email!"
            subTitle="We've sent a password reset link to your inbox. Please follow the instructions to set a new password."
            extra={[
              <Button type="primary" key="login" onClick={() => navigate("/auth/login")}>
                Back to Login
              </Button>,
            ]}
          />
        )}
      </div>
    </main>
  );
};

export default ResetPassword;