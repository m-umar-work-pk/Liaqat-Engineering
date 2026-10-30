import { useState } from "react";
import { Button, Form, Input, Typography, App } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Item } = Form;

const Login = () => {
  const { message } = App.useApp();

  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (values) => {
    const { email, password } = values;

    if (!email || !password) {
      return message.error("Please complete all input fields");
    }

    setIsProcessing(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      message.success("Login successful!");

      navigate("/dashboard/home");
    } catch (error) {
      console.error("Login Error:", error);

      switch (error.code) {
        case "auth/invalid-credential":
          message.error("Invalid email or password");
          break;

        case "auth/user-not-found":
          message.error("User not found");
          break;

        case "auth/wrong-password":
          message.error("Wrong password");
          break;

        default:
          message.error("Login failed");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="auth p-4">
      <div
        className="card p-4 mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <Title level={2} className="text-center">
          Login
        </Title>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
              {
                type: "email",
                message: "Enter a valid email",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter your email"
            />
          </Item>

          <Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Enter your password"
            />
          </Item>

          <div
            className="text-right"
            style={{ marginBottom: 15 }}
          >
            <Link to="/auth/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isProcessing}
          >
            Login
          </Button>

          <div className="text-center mt-4">
            <Text type="secondary">
              Don't have an account?{" "}
            </Text>

            <Link to="/auth/register">
              Register Here
            </Link>
          </div>
        </Form>
      </div>
    </main>
  );
};

export default Login;