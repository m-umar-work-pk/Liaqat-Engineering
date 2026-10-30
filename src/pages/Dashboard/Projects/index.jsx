import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/config/firebase";

import All from "./All";
import Add from "./Add";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setLoading(false);
          return;
        }

        const userRef = doc(firestore, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setRole(userSnap.data().role || "");
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Only Admin can access Add Project page
  if (role !== "Admin") {
    return <Navigate to="/dashboard/projects/all" replace />;
  }

  return children;
};

const Projects = () => {
  return (
    <Routes>
      {/* All users can view projects */}
      <Route path="all" element={<All />} />

      {/* Admin only */}
      <Route
        path="add"
        element={
          <AdminRoute>
            <Add />
          </AdminRoute>
        }
      />

      {/* Redirect default route */}
      <Route path="" element={<Navigate to="all" replace />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div
            style={{
              textAlign: "center",
              padding: "50px",
            }}
          >
            <h1>404 - Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
};

export default Projects;