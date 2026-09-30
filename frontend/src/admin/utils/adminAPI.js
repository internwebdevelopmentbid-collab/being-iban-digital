import api_url from "../../config/api";

export const ADMIN_TOKEN_KEY = "adminToken";
export const ADMIN_DATA_KEY = "admin";

export const getAdminToken = () => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const setAdminToken = (token) => {
  if (!token) {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    return;
  }

  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const getStoredAdmin = () => {
  try {
    const admin = localStorage.getItem(ADMIN_DATA_KEY);

    return admin ? JSON.parse(admin) : null;
  } catch {
    return null;
  }
};

export const setStoredAdmin = (admin) => {
  if (!admin) {
    localStorage.removeItem(ADMIN_DATA_KEY);
    return;
  }

  localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(admin));
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_DATA_KEY);
};

export const adminFetch = async (endpoint, options = {}) => {
  const token = getAdminToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${api_url}/api${endpoint}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401) {
    clearAdminSession();

    window.dispatchEvent(new CustomEvent("admin-session-expired"));

    const error = new Error(data?.message || "Your admin session has expired.");

    error.status = 401;
    error.data = data;

    throw error;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Admin request failed.");

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

export const getAdminProfile = async () => {
  return adminFetch("/admin/profile");
};

export default adminFetch;
