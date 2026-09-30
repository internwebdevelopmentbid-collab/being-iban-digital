import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import {
  adminFetch,
  getAdminProfile,
  getStoredAdmin,
  setStoredAdmin,
} from "../utils/adminAPI";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(() => getStoredAdmin());

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    users: 0,
    meetings: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  // =====================================================
  // LOAD ADMIN PROFILE
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const response = await getAdminProfile();

        if (response?.success && response?.admin) {
          setStoredAdmin(response.admin);

          if (mounted) {
            setAdmin(response.admin);
          }
        }
      } catch {
        // adminAPI handles expired sessions
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // LOAD DASHBOARD STATS
  // =====================================================

  const loadDashboardStats = useCallback(async () => {
    try {
      setStatsLoading(true);

      const [ordersResult, productsResult, usersResult, meetingsResult] =
        await Promise.all([
          adminFetch("/orders/all"),
          adminFetch("/products/list"),
          adminFetch("/user/admin/all"),
          adminFetch("/meeting/admin/all"),
        ]);

      const orders = Array.isArray(ordersResult?.orders)
        ? ordersResult.orders
        : [];

      const products = Array.isArray(productsResult?.products)
        ? productsResult.products
        : [];

      const users = Array.isArray(usersResult?.users) ? usersResult.users : [];

      const meetings = Array.isArray(meetingsResult?.meetings)
        ? meetingsResult.meetings
        : [];

      setStats({
        orders: orders.length,
        products: products.length,
        users: users.length,
        meetings: meetings.length,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);

      if (error?.status !== 401) {
        setStats({
          orders: 0,
          products: 0,
          users: 0,
          meetings: 0,
        });
      }
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080907] text-[#F5F3EE]">
        <div className="flex flex-col items-center gap-5">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A66B]" />

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A66B] [animation-delay:150ms]" />

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A66B] [animation-delay:300ms]" />
          </div>

          <p className="text-[10px] uppercase tracking-[0.18em] text-[#A7A39B]">
            Loading dashboard
          </p>
        </div>
      </div>
    );
  }

  const displayName = admin?.name || admin?.username || "Administrator";

  return (
    <div className="min-h-screen bg-[#080907] text-[#F5F3EE]">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:ml-[260px]">
        <AdminTopbar admin={admin} onMenuClick={() => setSidebarOpen(true)} />

        <main className="mx-auto max-w-[1700px] px-5 py-10 sm:px-8 lg:px-[50px] lg:py-[58px]">
          {/* =====================================================
              HEADING
          ===================================================== */}

          <section className="mb-11 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <span className="text-[9px] tracking-[0.2em] text-[#C9A66B]">
                CONTROL CENTRE
              </span>

              <h1 className="mt-4 font-serif text-[48px] font-normal leading-[0.95] tracking-[-0.045em] sm:text-[58px] lg:text-[68px]">
                Welcome,
                <br />
                <em className="text-[#C9A66B]">{displayName}.</em>
              </h1>

              <p className="mt-3 text-[13px] text-[#77746D]">
                Manage your digital studio from one place.
              </p>
            </div>
          </section>

          {/* =====================================================
              LIVE STATS
          ===================================================== */}

          <section className="grid grid-cols-1 border-l border-t border-[#292722] sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "ORDERS",
                number: "01",
                value: stats.orders,
                description: "Total customer orders",
                route: "/admin/orders",
              },
              {
                label: "PRODUCTS",
                number: "02",
                value: stats.products,
                description: "Active digital services",
                route: "/admin/products",
              },
              {
                label: "USERS",
                number: "03",
                value: stats.users,
                description: "Registered customers",
                route: "/admin/users",
              },
              {
                label: "MEETINGS",
                number: "04",
                value: stats.meetings,
                description: "Upcoming consultations",
                route: "/admin/meetings",
              },
            ].map((stat, index) => (
              <button
                key={stat.label}
                type="button"
                onClick={() => navigate(stat.route)}
                className={`group min-h-[180px] border-b border-r border-[#292722] bg-[#0D0E0C] p-6 text-left transition hover:-translate-y-0.5 hover:bg-[#11120F] ${
                  index === 3
                    ? "bg-[radial-gradient(circle_at_100%_0,rgba(201,166,107,0.08),transparent_45%),#0D0E0C]"
                    : ""
                }`}
              >
                <div className="flex justify-between text-[8px] tracking-[0.14em] text-[#68665F]">
                  <span>{stat.label}</span>

                  <span>{stat.number}</span>
                </div>

                <strong className="mt-8 block font-serif text-[44px] font-normal tracking-[-0.04em] text-[#F5F3EE] transition-colors group-hover:text-[#C9A66B]">
                  {statsLoading ? (
                    <span className="inline-block animate-pulse text-[#68665F]">
                      —
                    </span>
                  ) : (
                    stat.value
                  )}
                </strong>

                <p className="mt-3 text-[10px] text-[#77746D]">
                  {stat.description}
                </p>
              </button>
            ))}
          </section>

          {/* =====================================================
              LOWER PANELS
          ===================================================== */}

          <section className="mt-11 grid gap-px border border-[#292722] bg-[#292722] lg:grid-cols-[1.7fr_0.8fr]">
            {/* ===================================================
                ACTIVITY
            =================================================== */}

            <article className="min-h-[380px] bg-[#0D0E0C] p-7">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <span className="text-[8px] tracking-[0.17em] text-[#68665F]">
                    RECENT ACTIVITY
                  </span>

                  <h2 className="mt-2 font-serif text-[26px] font-normal">
                    Activity overview
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/admin/orders")}
                  className="text-[8px] tracking-[0.13em] text-[#C9A66B] transition-colors hover:text-[#F5F3EE]"
                >
                  VIEW ORDERS →
                </button>
              </div>

              <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-11 w-11 items-center justify-center border border-[#292722] text-[#C9A66B]">
                  ◈
                </div>

                <h3 className="font-serif text-xl font-normal">
                  Activity data will appear here
                </h3>

                <p className="mt-2 max-w-[330px] text-[10px] leading-7 text-[#68665F]">
                  Order, customer and website activity will be connected as the
                  management modules are built.
                </p>
              </div>
            </article>

            {/* ===================================================
                QUICK ACTIONS
            =================================================== */}

            <article className="min-h-[380px] bg-[#0D0E0C] p-7">
              <span className="text-[8px] tracking-[0.17em] text-[#68665F]">
                QUICK ACTIONS
              </span>

              <h2 className="mt-2 font-serif text-[26px] font-normal">
                Manage
              </h2>

              <div className="mt-6 border-t border-[#292722]">
                {[
                  ["Manage Products", "/admin/products"],
                  ["Manage Users", "/admin/users"],
                  ["Manage Media", "/admin/media"],
                  ["View Meetings", "/admin/meetings"],
                  ["Website Content", "/admin/website"],
                ].map((action) => (
                  <button
                    key={action[0]}
                    type="button"
                    onClick={() => navigate(action[1])}
                    className="flex min-h-[58px] w-full items-center justify-between border-b border-[#292722] text-left text-[10px] text-[#A7A39B] transition-colors hover:text-[#F5F3EE]"
                  >
                    <span>{action[0]}</span>

                    <strong className="text-lg font-light text-[#C9A66B]">
                      +
                    </strong>
                  </button>
                ))}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
