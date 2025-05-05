import { useState } from "react";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, Form, Alert, Layout, Typography } from "antd";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";

const { Content } = Layout;
const { Title, Text } = Typography;

interface LoginPageProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onForgotPassword,
  onSignUp,
}) => {
  const [form] = Form.useForm();
  const [error, setError] = useState("");

  // Use the auth context
  const { login, isLoading } = useAuth();

  const handleSubmit = async (values: any) => {
    const { email, password } = values;

    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      // Use the login function from the auth context
      await login(email, password);
      // If login is successful, the AuthContext will navigate to the projects page
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "auto",
      }}
    >
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: 0,
        }}
      >
        <div
          className="auth-card"
          style={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "white",
            padding: "40px",
            margin: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <img
              src="/src/logo.png"
              alt="Worklenz Logo"
              style={{ height: "60px", marginBottom: "24px", maxWidth: "100%" }}
            />
            <Title level={3} style={{ margin: 0 }}>
              Login to your account
            </Title>
            <Text type="secondary">
              Enter your credentials to access your workspace
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: "24px" }}
            />
          )}

          <Form
            name="login"
            form={form}
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                size="large"
                placeholder="Email address"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                size="large"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={onForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
                icon={<LoginOutlined />}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Text type="secondary">Don't have an account? </Text>
            <Button type="link" onClick={onSignUp} style={{ padding: "0 4px" }}>
              Sign up
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default LoginPage;
