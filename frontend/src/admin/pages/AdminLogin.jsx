import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getAdminToken,
  setAdminToken,
  setStoredAdmin,
  getAdminProfile,
  clearAdminSession,
} from "../utils/adminAPI";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkExistingSession = async () => {
      const token = getAdminToken();

      if (!token) {
        if (mounted) {
          setIsCheckingSession(false);
        }

        return;
      }

      try {
        const response = await getAdminProfile();

        if (response?.success && response?.admin) {
          setStoredAdmin(response.admin);

          navigate("/admin", {
            replace: true,
          });

          return;
        }

        clearAdminSession();
      } catch {
        clearAdminSession();
      }

      if (mounted) {
        setIsCheckingSession(false);
      }
    };

    checkExistingSession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (location.state?.sessionExpired) {
      toast.error("Your admin session has expired. Please sign in again.");

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = form.username.trim();

    if (!username) {
      toast.error("Enter your admin username.");
      return;
    }

    if (!form.password) {
      toast.error("Enter your admin password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password: form.password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Invalid admin credentials.");
      }

      if (!data?.token) {
        throw new Error("No admin session token was returned.");
      }

      setAdminToken(data.token);

      if (data.admin) {
        setStoredAdmin(data.admin);
      }

      toast.success("Administrator login successful.");

      const requestedPath = location.state?.from;

      if (
        requestedPath &&
        requestedPath.startsWith("/admin") &&
        requestedPath !== "/admin/login"
      ) {
        navigate(requestedPath, {
          replace: true,
        });
      } else {
        navigate("/admin", {
          replace: true,
        });
      }
    } catch (error) {
      toast.error(error.message || "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#080907] text-[#F5F3EE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A66B] animate-pulse" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A66B] animate-pulse [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A66B] animate-pulse [animation-delay:300ms]" />
          </div>

          <p className="text-[10px] uppercase tracking-[0.18em] text-[#A7A39B]">
            Checking administrator session
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080907] text-[#F5F3EE] flex items-center justify-center px-5 py-10">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,166,107,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(201,166,107,0.035) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient circles */}
      <div className="absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full border border-[#C9A66B]/10" />

      <div className="absolute -bottom-64 -left-40 h-[480px] w-[480px] rounded-full border border-[#C9A66B]/10" />

      <section className="relative z-10 w-full max-w-[460px]">
        {/* Brand */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center border border-[#C9A66B] text-[#C9A66B] font-serif text-sm">
            IB
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] tracking-[0.2em] text-[#A7A39B]">
              BEING IBAN
            </span>

            <strong className="text-[13px] font-medium tracking-[0.13em]">
              DIGITAL
            </strong>
          </div>
        </div>

        {/* Card */}
        <div className="border border-[#292722] bg-[#11120F]/95 p-7 shadow-[0_35px_90px_rgba(0,0,0,0.4)] sm:p-10">
          <div className="flex items-center gap-2 text-[9px] tracking-[0.18em] text-[#A7A39B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A66B] shadow-[0_0_12px_rgba(201,166,107,0.6)]" />
            ADMINISTRATOR ACCESS
          </div>

          <h1 className="mt-6 font-serif text-5xl font-normal leading-[0.92] tracking-[-0.04em] sm:text-[68px]">
            Welcome
            <br />
            <em className="text-[#C9A66B]">back.</em>
          </h1>

          <p className="mt-5 max-w-[360px] text-[13px] leading-7 text-[#A7A39B]">
            Sign in to manage your digital studio, products, orders, portfolio
            and website content.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-[0.16em] text-[#A7A39B]">
                Username
              </span>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                autoComplete="username"
                disabled={isSubmitting}
                className="h-[52px] w-full border border-[#292722] bg-[#080907] px-4 text-[13px] text-[#F5F3EE] outline-none transition focus:border-[#C9A66B]/70 disabled:opacity-60"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-[0.16em] text-[#A7A39B]">
                Password
              </span>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={isSubmitting}
                className="h-[52px] w-full border border-[#292722] bg-[#080907] px-4 text-[13px] text-[#F5F3EE] outline-none transition focus:border-[#C9A66B]/70 disabled:opacity-60"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 flex h-[54px] w-full items-center justify-between border border-[#C9A66B] bg-[#C9A66B] px-5 text-[10px] font-bold tracking-[0.15em] text-[#080907] transition hover:bg-[#D6B77F] hover:shadow-[0_10px_35px_rgba(201,166,107,0.15)] disabled:cursor-wait disabled:opacity-60"
            >
              <span>
                {isSubmitting ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
              </span>

              {!isSubmitting && <span className="text-lg font-normal">→</span>}
            </button>
          </form>

          <div className="mt-7 flex flex-col gap-3 border-t border-[#292722] pt-6 text-[8px] tracking-[0.15em] text-[#5F5D57] sm:flex-row sm:items-center sm:justify-between">
            <span>SECURE ADMINISTRATOR AREA</span>

            <span>IBAN DIGITAL</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminLogin;
