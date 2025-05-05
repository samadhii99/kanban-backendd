import React, { useEffect } from "react";
import { Layout, Button, Dropdown, Menu } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthContainer from "./components/auth/AuthContainer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./components/common/NotFound";
import "antd/dist/reset.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeToggleButton from "./components/ThemeToggleButton";
import "./App.css";
import "./components/DarkModeToggle.css";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  UsergroupAddOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BookOutlined,
} from "@ant-design/icons";

// Import your components directly instead of lazy loading
// This will resolve the TypeScript errors
import ProjectsList from "./components/ProjectsList/ProjectsList";
import ProjectDetails from "./components/ProjectsList/ProjectDetails";

const { Header, Content } = Layout;

// Declare the custom property on the window object
declare global {
  interface Window {
    __react_beautiful_dnd_disable_dev_warnings: boolean;
  }
}

// Fix for react-beautiful-dnd in React 18
const useMount = (fn: () => void) => useEffect(fn, []);

// AppLayout component to handle the authenticated UI
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Apply the fix before rendering
  useMount(() => {
    window.__react_beautiful_dnd_disable_dev_warnings = true;
  });

  // User dropdown menu
  const userDropdownMenu = (
    <Menu>
      <Menu.Item key="account" style={{ padding: '10px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: '10px', fontSize: '16px' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{user?.email?.split('@')[0] || "User"}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{user?.email || "user@example.com"}</div>
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="admin" icon={<SettingOutlined />}>
        Admin Center
      </Menu.Item>
      <Menu.Item key="outline" icon={<BookOutlined />}>
        Outline
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="app">
      <Layout
        className="app-layout"
        style={{ width: "100vw", height: "100vh" }}
      >
        <Header
          className="app-header"
          style={{
            textAlign: "center",
            fontSize: "16px",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            backgroundColor: "white",
            color: "black",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            className="header-left"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              className="logo"
              style={{
                marginRight: "30px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="/src/logo.png"
                alt="Worklenz Logo"
                style={{
                  height: "50px", // Adjust this size as needed
                  width: "auto",
                }}
              />
            </div>
            <nav style={{ display: "flex", gap: "30px" }}>
              <Link to="/dashboard" style={{ color: "black" }}>
                Home
              </Link>
              <Link
                to="/projects"
                style={{
                  color: location.pathname.includes('/project') ? "#1890ff" : "black",
                  borderBottom: location.pathname.includes('/project') ? "2px solid #1890ff" : "none",
                  paddingBottom: "4px",
                }}
              >
                Projects
              </Link>
              <Link to="/schedule" style={{ color: "black" }}>
                Schedule
              </Link>
              <Link to="/reporting" style={{ color: "black" }}>
                Reporting
              </Link>
              <Link to="/client-portal" style={{ color: "black" }}>
                Client Portal
              </Link>
            </nav>
          </div>

          <div
            className="header-right"
            style={{ display: "flex", alignItems: "center", gap: "16px" }}
          >
            <Button
              style={{
                backgroundColor: "#f9d270",
                color: "black",
                border: "none",
              }}
            >
              Upgrade Plan
            </Button>
            <Button
              style={{
                border: "1px dashed #1890ff",
                color: "#1890ff",
                backgroundColor: "transparent",
              }}
            >
              <UsergroupAddOutlined style={{ marginRight: "5px" }} /> Invite
            </Button>
            <div
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <span>{user?.email?.split('@')[0] || "User"}</span>
              <BellOutlined style={{ fontSize: "18px" }} />
              <QuestionCircleOutlined style={{ fontSize: "18px" }} />
              <Dropdown overlay={userDropdownMenu} trigger={['click']}>
                <UserOutlined 
                  style={{ fontSize: "18px", cursor: "pointer" }} 
                />
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          className="app-content"
          style={{
            padding: "20px",
            height: "calc(100vh - 104px)", // Updated to match the header height
            overflow: "hidden", // Keep this to prevent vertical scrolling of the content area itself
          }}
        >
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Content>
      </Layout>
      <ThemeToggleButton />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<AuthContainer />} />

            {/* Protected routes with layout */}
            <Route 
              path="/" 
              element={<Navigate to="/projects" replace />} 
            />
            
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProjectsList />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/project/:projectId" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProjectDetails />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Dashboard and other routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Dashboard Content</div>
                  </AppLayout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/schedule" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Schedule Content</div>
                  </AppLayout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/reporting" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Reporting Content</div>
                  </AppLayout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/client-portal" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Client Portal Content</div>
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;