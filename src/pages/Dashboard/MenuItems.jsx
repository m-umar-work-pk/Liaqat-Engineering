import {
  HomeOutlined,
  BuildOutlined,
  ContactsOutlined,
  AppstoreOutlined,
  UserAddOutlined,
  UserOutlined,
  TeamOutlined,
  LoginOutlined,
  SettingOutlined,
  ApartmentOutlined,
  AppstoreAddOutlined,
  FundProjectionScreenOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";

/**
 * PURE MENU (NO FIRESTORE, NO ASYNC)
 */
export const getMenuItems = (role = "Customer"||"Admin"||"Workers") => {
  const allItems = [
    {
      key: "1",
      label: <Link to="/dashboard/home">Home</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: "2",
      label: <Link to="/dashboard/about">About</Link>,
      icon: <BuildOutlined />,
    },
    {
      key: "3",
      label: <Link to="/dashboard/contact">Contact</Link>,
      icon: <ContactsOutlined />,
    },
    {
      key: "4",
      label: <Link to="/dashboard/services">Services</Link>,
      icon: <AppstoreOutlined />,
    },

    {
      key: "5",
      label: "Projects",
      icon: <FundProjectionScreenOutlined />,
      children: [
        {
          key: "5.1",
          label: <Link to="/dashboard/projects/all">All Projects</Link>,
          icon: <ApartmentOutlined />,
        },
        ...(role === "Admin"
          ? [
              {
                key: "5.2",
                label: <Link to="/dashboard/projects/add">Add Project</Link>,
                icon: <AppstoreAddOutlined />,
              },
            ]
          : []),
      ],
    },

    {
      key: "6",
      label: "Customers",
      icon: <UserOutlined />,
      children: [
        {
          key: "6.1",
          label: <Link to="/dashboard/customers/all">All Customers</Link>,
          icon: <TeamOutlined />,
        },
        ...(role === "Admin"
          ? [
              {
                key: "6.2",
                label: <Link to="/dashboard/customers/add">Add Customer</Link>,
                icon: <UserAddOutlined />,
              },
            ]
          : []),
      ],
    },
    {
      key: "7",
      label: "Orders",
      icon: <UserOutlined />,
      children: [
        {
          key: "7.1",
          label: <Link to="/dashboard/orders/all">All Orders</Link>,
          icon: <TeamOutlined />,
        },
        ...(role === "Admin"|| "Customer"
          ? [
              {
                key: "7.2",
                label: <Link to="/dashboard/orders/add">Add Order</Link>,
                icon: <UserAddOutlined />,
              },
            ]
          : []),
      ],
    },

    {
      key: "8",
      label: "Users",
      icon: <UserOutlined />,
      children: [
        {
          key: "8.1",
          label: <Link to="/dashboard/users/all">All Users</Link>,
          icon: <TeamOutlined />,
        },
        ...(role === "Admin"
          ? [
              {
                key: "8.2",
                label: <Link to="/dashboard/users/add">Add User</Link>,
                icon: <UserAddOutlined />,
              },
              {
                key: "8.3",
                label: (
                  <Link to="/dashboard/users/attendance">Attendance</Link>
                ),
                icon: <LoginOutlined />,
              },
            ]
          : []),
      ],
    },

    {
      key: "9",
      label: <Link to="/dashboard/machines">Machines</Link>,
      icon: <ShoppingCartOutlined />,
    },

    ...(role === "Admin"
      ? [
          {
            key: "10",
            label: <Link to="/dashboard/dashboard">Overview</Link>,
            icon: <DashboardOutlined />,
          },
          {
            key: "11",
            label: <Link to="/dashboard/settings">Settings</Link>,
            icon: <SettingOutlined />,
          },
        ]
      : []),
  ];

  return allItems;
};