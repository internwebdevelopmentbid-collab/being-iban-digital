import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
  getAdminToken,
  getAdminProfile,
  clearAdminSession,
  setStoredAdmin,
} from "../utils/adminAPI";

const AdminRoutes = () => {
  const location = useLocation();

  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      const token = getAdminToken();

      if (!token) {
        if (mounted) {
          setStatus("unauthenticated");
        }

        return;
      }

      try {
        const response = await getAdminProfile();

        if (!response?.success) {
          throw new Error(response?.message || "Invalid admin session.");
        }

        if (response.admin) {
          setStoredAdmin(response.admin);
        }

        if (mounted) {
          setStatus("authenticated");
        }
      } catch {
        clearAdminSession();

        if (mounted) {
          setStatus("unauthenticated");
        }
      }
    };

    verifySession();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="admin-session-loader">
        <div className="admin-loader-mark">
          <span />
          <span />
          <span />
        </div>

        <p>Verifying administrator access</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  return <Outlet />;
};

export default AdminRoutes;
