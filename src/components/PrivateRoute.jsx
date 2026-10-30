import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/Auth";
import { Spin, Result } from "antd";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, userData, loading } = useAuth();
  const location = useLocation();

  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    console.log(userData)
    if (userData?.role) {
      setRole(userData.role)
    }
    setRoleLoading(false);
  }, [userData]);

  // Loading Firebase Auth
  if (loading || roleLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Role Protection
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="You are not authorized to access this page."
      />
    );
  }

  return children;
};

export default PrivateRoute;