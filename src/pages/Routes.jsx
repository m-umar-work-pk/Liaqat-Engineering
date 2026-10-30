import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth"; // Ensure this path is correct
import PrivateRoute from "../components/PrivateRoute";

// Layout
import DashboardLayout from "./Dashboard/index";
import Auth from "./Auth/index";

// Frontend Pages
import Home from "./Frontend/Home";
import About from "./Frontend/About";
import Contact from "./Frontend/Contact";
import Services from "./Frontend/Services";
import Dashboard from "./Frontend/Dashboard";

// Dashboard Pages
import ProjectsAll from "./Dashboard/Projects/All";
import ProjectsAdd from "./Dashboard/Projects/Add";
import Machines from "./Dashboard/Machines/index";
import UsersAll from "./Dashboard/Users/All";
import UsersAdd from "./Dashboard/Users/Add";
import UsersAttendance from "./Dashboard/Users/Attandance";
import CustomersAll from "./Dashboard/Customers/All";
import CustomersAdd from "./Dashboard/Customers/Add";
import OrdersAll from "./Dashboard/Orders/All";
import OrdersAdd from "./Dashboard/Orders/Add";
import Settings from "./Dashboard/Settings/index";

const AppRoutes = () => {
  const { user } = useAuth(); // Access user state

  return (
    <Routes>
      {/* If user is logged in, redirect away from Auth pages */}
      <Route 
        path="/auth/*" 
        element={user ? <Navigate to="/dashboard/home" replace /> : <Auth />} 
      />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="services" element={<Services />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects/all" element={<ProjectsAll />} />
        <Route path="projects/add" element={<ProjectsAdd />} />
        <Route path="machines" element={<Machines />} />
        <Route path="users/all" element={<UsersAll />} />
        <Route path="users/add" element={<UsersAdd />} />
        <Route path="users/attendance" element={<UsersAttendance />} />
        <Route path="customers/all" element={<CustomersAll />} />
        <Route path="customers/add" element={<CustomersAdd />} />
        <Route path="orders/all" element={<OrdersAll />} />
        <Route path="orders/add" element={<OrdersAdd />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/dashboard/home" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;