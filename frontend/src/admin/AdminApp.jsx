import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import AdminRoutes from "./routes/AdminRoutes";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import MeetingManager from "./managers/MeetingManager";
import MediaManager from "./managers/MediaManager";
import WebsiteManager from "./managers/WebsiteManager";

import { clearAdminSession } from "./utils/adminAPI";

const AdminSessionWatcher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      clearAdminSession();

      navigate("/admin/login", {
        replace: true,
        state: {
          sessionExpired: true,
        },
      });
    };

    window.addEventListener("admin-session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("admin-session-expired", handleSessionExpired);
    };
  }, [navigate]);

  return null;
};

const AdminApp = () => {
  return (
    <>
      <AdminSessionWatcher />

      <Routes>
        {/* Admin Login */}
        <Route path="login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminRoutes />}>
          <Route index element={<AdminDashboard />} />

          <Route path="meetings" element={<MeetingManager />} />

          <Route path="media" element={<MediaManager />} />

          <Route path="website" element={<WebsiteManager />} />
        </Route>

        {/* Unknown admin route */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );
};

export default AdminApp;
