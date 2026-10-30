// import React, { useState, useEffect } from "react";
// import { Layout, Menu, Typography, Avatar, Dropdown, Space, Spin } from "antd";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/Auth";
// import { LogoutOutlined, DashboardOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
// import { doc, getDoc } from "firebase/firestore";
// import { firestore } from "@/config/firebase";

// import { getMenuItems } from "./MenuItems";
// import Routes from "./Routes";
// import logo from "../../../public/logo.jpg";

// const { Header, Content, Footer, Sider } = Layout;
// const { Title, Text } = Typography;

// const Dashboard = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const { user, handleLogout } = useAuth();
//   const navigate = useNavigate();

//   // Fetch User Data from Firestore
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!user?.uid) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const docRef = doc(firestore, "users", user.uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) setUserData(docSnap.data());
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, [user]);

//   const profileMenuItems = [
//     { key: "0", label: <strong>{userData?.fullName || "User"}</strong>, disabled: true },
//     { key: "1", label: "Dashboard", icon: <DashboardOutlined />, onClick: () => navigate("/dashboard") },
//     { key: "3", label: "Logout", icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
//   ];

//   if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><Spin size="large" /></div>;

//   return (
//     <Layout className="min-vh-100">
//       <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} >
//         {/* LOGO SECTION: Shows name only when open */}
//         <div className="d-flex align-items-center py-3 px-2" style={{ gap: "10px", height: "64px" }}>
//           <img src={logo} alt="logo" style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
//           {!collapsed && (
//             <Title level={5} className="mb-0 text-white" style={{ fontSize: "16px", whiteSpace: "nowrap" }}>
//               Liaqat Engineering
//             </Title>
//           )}
//         </div>
//         <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={getMenuItems(userData?.role)} />
//       </Sider>

//       <Layout>
//         {/* HEADER SECTION: User name next to Avatar */}
//         <Header className="d-flex align-items-center justify-content-end px-4" style={{ backgroundColor: "#001529" }}>
//   <Space size="middle">
//     <Text style={{ color: "whitesmoke" }}>{userData?.fullName || "User"}</Text>
//     <Dropdown menu={{ items: profileMenuItems }} trigger={["click"]} placement="bottomRight">
//       <Avatar 
//         size={40} 
//         src={userData?.avatarUrl} // Ensure this matches the key in Firestore
//         icon={<UserOutlined />} 
//         style={{ 
//             cursor: "pointer", 
//             backgroundColor: "#75797e",
//             objectFit: "cover" 
//         }}
//         onError={(e) => {
//           e.target.style.display = 'none'; // Fallback: hides broken image
//           return true;
//         }}
//       />
//     </Dropdown>
//   </Space>
// </Header>

//         <Content className="p-3" >
//           <div className="card p-3 border-0 h-100"><Routes /></div>
//         </Content>

//         <Footer className="text-center">© {new Date().getFullYear()} Liaqat Engineering Workshop.</Footer>
//       </Layout>
//     </Layout>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Avatar, Dropdown, Space, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/Auth";
import { LogoutOutlined, DashboardOutlined, UserOutlined } from "@ant-design/icons";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { getMenuItems } from "./MenuItems";
import Routes from "./Routes";
import logo from "../../../public/logo.jpg";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const profileMenuItems = [
    { key: "0", label: <strong>{userData?.fullName || "User"}</strong>, disabled: true },
    { key: "1", label: "Dashboard", icon: <DashboardOutlined />, onClick: () => navigate("/dashboard") },
    { key: "3", label: "Logout", icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
  ];

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><Spin size="large" /></div>;

  return (
    <Layout className="min-vh-100">
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="d-flex align-items-center py-3 px-2" style={{ gap: "10px", height: "64px" }}>
          <img src={logo} alt="logo" style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover",marginLeft:"15px" }} />
          {!collapsed && (
            <Title level={5} className="mb-0 text-white" style={{ fontSize: "16px", whiteSpace: "nowrap" }}>
              Liaqat Engineering
            </Title>
          )}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={getMenuItems(userData?.role)} />
      </Sider>

      <Layout>
        <Header className="d-flex align-items-center justify-content-end px-4" style={{ backgroundColor: "#001529" }}>
          <Space size="middle">
            <Text style={{ color: "whitesmoke" }}>{userData?.fullName || "User"}</Text>
            <Dropdown menu={{ items: profileMenuItems }} trigger={["click"]} placement="bottomRight">
              <Avatar 
                size={40} 
                src={userData?.avatarUrl} 
                icon={<UserOutlined />} 
                style={{ cursor: "pointer", backgroundColor: "#75797e", objectFit: "cover" }}
                onError={(e) => {
                  e.target.style.display = 'none'; // Fallback: hides broken image
                  return true;
                }}
              />
            </Dropdown>
          </Space>
        </Header>

        <Content className="p-3">
          <div className="card p-3 border-0 h-100"><Routes /></div>
        </Content>

        <Footer className="text-center">© {new Date().getFullYear()} Liaqat Engineering Workshop.</Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;