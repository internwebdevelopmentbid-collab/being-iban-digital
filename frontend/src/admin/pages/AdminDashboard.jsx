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
  const [statsLoading, setStatsLoading] = useState(true);

  const [stats, setStats] = useState({
    meetings: 0,
    media: 0,
    reviews: 0,
  });

  const [recentMeetings, setRecentMeetings] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  // ============================================================
  // LOAD ADMIN PROFILE
  // ============================================================

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

  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  const loadDashboardData = useCallback(async () => {
    try {
      setStatsLoading(true);

      const [meetingsResult, mediaResult, reviewsResult] = await Promise.all([
        adminFetch("/meeting/admin/all"),
        adminFetch("/media/admin"),
        adminFetch("/review/admin/all"),
      ]);

      const meetings = Array.isArray(meetingsResult?.meetings)
        ? meetingsResult.meetings
        : [];

      const media = Array.isArray(mediaResult?.media)
        ? mediaResult.media
        : Array.isArray(mediaResult?.items)
          ? mediaResult.items
          : [];

      const reviews = Array.isArray(reviewsResult?.reviews)
        ? reviewsResult.reviews
        : [];

      setStats({
        meetings: meetings.length,
        media: media.length,
        reviews: reviews.length,
      });

      setRecentMeetings(
        [...meetings]
          .sort(
            (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0),
          )
          .slice(0, 5),
      );

      setRecentReviews(
        [...reviews]
          .sort(
            (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0),
          )
          .slice(0, 4),
      );
    } catch (error) {
      console.error("Dashboard data error:", error);

      if (error?.status !== 401) {
        setStats({
          meetings: 0,
          media: 0,
          reviews: 0,
        });

        setRecentMeetings([]);
        setRecentReviews([]);
      }
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ============================================================
  // HELPERS
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getMeetingStatusClass = (status) => {
    switch (status) {
      case "new":
        return "border-[#C9A66B]/40 text-[#C9A66B]";

      case "contacted":
        return "border-[#77746D]/40 text-[#A7A39B]";

      case "scheduled":
        return "border-[#C9A66B]/40 text-[#D9C49D]";

      case "in-progress":
        return "border-[#8C653C]/60 text-[#C9A66B]";

      case "completed":
        return "border-[#68665F]/50 text-[#A7A39B]";

      case "cancelled":
      case "spam":
        return "border-[#4E4D48] text-[#68665F]";

      default:
        return "border-[#292722] text-[#77746D]";
    }
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

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

  // ============================================================
  // PRIMARY STATS
  // ============================================================

  const dashboardStats = [
    {
      label: "MEETINGS",
      number: "01",
      value: stats.meetings,
      description: "Project enquiries & consultations",
      route: "/admin/meetings",
    },
    {
      label: "MEDIA",
      number: "02",
      value: stats.media,
      description: "Portfolio images, videos & websites",
      route: "/admin/media",
    },
    {
      label: "REVIEWS",
      number: "03",
      value: stats.reviews,
      description: "Client reviews & testimonials",
      route: "/admin/reviews",
    },
  ];

  // ============================================================
  // QUICK ACTIONS
  // ============================================================

  const quickActions = [
    {
      label: "Meeting Manager",
      description: "View and manage enquiries",
      route: "/admin/meetings",
    },
    {
      label: "Media Manager",
      description: "Manage portfolio media",
      route: "/admin/media",
    },
    {
      label: "Reviews Manager",
      description: "Manage client reviews",
      route: "/admin/reviews",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080907] text-[#F5F3EE]">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:ml-[260px]">
        <AdminTopbar admin={admin} onMenuClick={() => setSidebarOpen(true)} />

        <main className="mx-auto max-w-[1700px] px-5 py-10 sm:px-8 lg:px-[50px] lg:py-[58px]">
          {/* ======================================================
              HEADER
          ====================================================== */}

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

              <p className="mt-3 max-w-[560px] text-[13px] leading-6 text-[#77746D]">
                Manage your meetings, portfolio media and client reviews from
                one place.
              </p>
            </div>

            <div className="flex items-center gap-3 border border-[#292722] bg-[#0D0E0C] px-4 py-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A66B] opacity-40" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A66B]" />
              </span>

              <span className="text-[8px] uppercase tracking-[0.18em] text-[#A7A39B]">
                Studio system online
              </span>
            </div>
          </section>

          {/* ======================================================
              PRIMARY STATS
          ====================================================== */}

          <section className="grid grid-cols-1 border-l border-t border-[#292722] md:grid-cols-3">
            {dashboardStats.map((stat, index) => (
              <button
                key={stat.label}
                type="button"
                onClick={() => navigate(stat.route)}
                className={`
                    group
                    min-h-[220px]
                    border-b
                    border-r
                    border-[#292722]
                    bg-[#0D0E0C]
                    p-7
                    text-left
                    transition
                    duration-500
                    hover:bg-[#11120F]
                    ${
                      index === 2
                        ? "bg-[radial-gradient(circle_at_100%_0,rgba(201,166,107,0.08),transparent_45%),#0D0E0C]"
                        : ""
                    }
                  `}
              >
                <div className="flex justify-between text-[8px] tracking-[0.14em] text-[#68665F]">
                  <span>{stat.label}</span>

                  <span>{stat.number}</span>
                </div>

                <strong className="mt-10 block font-serif text-[54px] font-normal tracking-[-0.04em] text-[#F5F3EE] transition-colors duration-500 group-hover:text-[#C9A66B]">
                  {statsLoading ? (
                    <span className="animate-pulse text-[#68665F]">—</span>
                  ) : (
                    stat.value
                  )}
                </strong>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <p className="max-w-[230px] text-[10px] leading-5 text-[#77746D]">
                    {stat.description}
                  </p>

                  <span className="text-sm font-light text-[#C9A66B] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </button>
            ))}
          </section>

          {/* ======================================================
              RECENT ACTIVITY + QUICK ACTIONS
          ====================================================== */}

          <section className="mt-11 grid gap-px border border-[#292722] bg-[#292722] lg:grid-cols-[1.55fr_0.9fr]">
            {/* ====================================================
                RECENT MEETINGS
            ==================================================== */}

            <article className="min-h-[430px] bg-[#0D0E0C] p-7 sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <span className="text-[8px] tracking-[0.17em] text-[#68665F]">
                    RECENT ACTIVITY
                  </span>

                  <h2 className="mt-2 font-serif text-[28px] font-normal">
                    Recent meetings
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/admin/meetings")}
                  className="text-[8px] uppercase tracking-[0.14em] text-[#C9A66B] transition-colors hover:text-[#F5F3EE]"
                >
                  View all →
                </button>
              </div>

              <div className="mt-8 border-t border-[#292722]">
                {statsLoading ? (
                  <div className="flex min-h-[280px] items-center justify-center">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#55534E]">
                      Loading activity
                    </span>
                  </div>
                ) : recentMeetings.length === 0 ? (
                  <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center border border-[#292722] text-[#C9A66B]">
                      ◈
                    </div>

                    <h3 className="font-serif text-xl font-normal">
                      No meetings yet
                    </h3>

                    <p className="mt-2 max-w-[330px] text-[10px] leading-6 text-[#68665F]">
                      New project enquiries and consultations will appear here.
                    </p>
                  </div>
                ) : (
                  recentMeetings.map((meeting) => (
                    <button
                      key={meeting._id}
                      type="button"
                      onClick={() => navigate(`/admin/meetings/${meeting._id}`)}
                      className="group flex min-h-[72px] w-full items-center justify-between gap-5 border-b border-[#292722] text-left transition-colors hover:bg-[#11120F]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[10px] text-[#F5F3EE] transition-colors group-hover:text-[#C9A66B]">
                          {meeting.name || "Unnamed enquiry"}
                        </p>

                        <p className="mt-1 truncate text-[8px] text-[#55534E]">
                          {meeting.email || "No email"}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-4">
                        <span
                          className={`
                              border
                              px-2
                              py-1
                              text-[7px]
                              uppercase
                              tracking-[0.12em]
                              ${getMeetingStatusClass(meeting.status)}
                            `}
                        >
                          {meeting.status || "new"}
                        </span>

                        <span className="hidden text-[8px] text-[#55534E] sm:block">
                          {formatDate(meeting.createdAt)}
                        </span>

                        <span className="text-[#C9A66B]">→</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </article>

            {/* ====================================================
                QUICK ACTIONS
            ==================================================== */}

            <article className="min-h-[430px] bg-[#0D0E0C] p-7 sm:p-8">
              <span className="text-[8px] tracking-[0.17em] text-[#68665F]">
                QUICK ACTIONS
              </span>

              <h2 className="mt-2 font-serif text-[28px] font-normal">
                Manage
              </h2>

              <div className="mt-7 border-t border-[#292722]">
                {quickActions.map((action, index) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => navigate(action.route)}
                    className="group flex min-h-[78px] w-full items-center justify-between border-b border-[#292722] text-left transition-colors duration-300 hover:bg-[#11120F]"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-sans text-[8px] tracking-[0.12em] text-[#4E4D48]">
                        0{index + 1}
                      </span>

                      <div>
                        <span className="block text-[10px] text-[#A7A39B] transition-colors duration-300 group-hover:text-[#F5F3EE]">
                          {action.label}
                        </span>

                        <span className="mt-1 block text-[8px] text-[#55534E]">
                          {action.description}
                        </span>
                      </div>
                    </div>

                    <strong className="mr-1 text-lg font-light text-[#C9A66B] transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </strong>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/meetings")}
                className="mt-7 flex min-h-[56px] w-full items-center justify-between border border-[#8C653C] bg-[#8C653C] px-5 text-left transition-colors duration-300 hover:bg-[#A87948]"
              >
                <span className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#080907]">
                  Create meeting
                </span>

                <span className="text-lg text-[#080907]">+</span>
              </button>
            </article>
          </section>

          {/* ======================================================
              RECENT REVIEWS
          ====================================================== */}

          <section className="mt-11 border border-[#292722] bg-[#0D0E0C] p-7 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="text-[8px] tracking-[0.17em] text-[#68665F]">
                  CLIENT FEEDBACK
                </span>

                <h2 className="mt-2 font-serif text-[28px] font-normal">
                  Recent reviews
                </h2>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/reviews")}
                className="text-left text-[8px] uppercase tracking-[0.14em] text-[#C9A66B] transition-colors hover:text-[#F5F3EE]"
              >
                Manage reviews →
              </button>
            </div>

            <div className="mt-8 grid gap-px border border-[#292722] bg-[#292722] sm:grid-cols-2 lg:grid-cols-4">
              {statsLoading ? (
                <div className="col-span-full flex min-h-[180px] items-center justify-center bg-[#0B0C0A]">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#55534E]">
                    Loading reviews
                  </span>
                </div>
              ) : recentReviews.length === 0 ? (
                <div className="col-span-full flex min-h-[180px] flex-col items-center justify-center bg-[#0B0C0A] px-6 text-center">
                  <span className="text-2xl text-[#C9A66B]">★</span>

                  <h3 className="mt-4 font-serif text-lg font-normal">
                    No reviews yet
                  </h3>

                  <p className="mt-2 text-[9px] text-[#68665F]">
                    Client reviews will appear here once added.
                  </p>
                </div>
              ) : (
                recentReviews.map((review) => (
                  <button
                    key={review._id}
                    type="button"
                    onClick={() => navigate("/admin/reviews")}
                    className="group min-h-[180px] bg-[#0B0C0A] p-6 text-left transition-colors duration-300 hover:bg-[#11120F]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] tracking-[0.08em] text-[#C9A66B]">
                        {"★".repeat(
                          Math.min(5, Math.max(0, Number(review.rating || 0))),
                        )}
                      </span>

                      <span className="text-[8px] text-[#4E4D48]">↗</span>
                    </div>

                    <p className="mt-6 line-clamp-3 text-[10px] leading-5 text-[#A7A39B]">
                      {review.review || "No review text."}
                    </p>

                    <p className="mt-5 truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-[#F5F3EE] transition-colors group-hover:text-[#C9A66B]">
                      {review.name || "Anonymous client"}
                    </p>

                    {review.company && (
                      <p className="mt-1 truncate text-[8px] text-[#55534E]">
                        {review.company}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </section>

          {/* ======================================================
              FOOTER
          ====================================================== */}

          <section className="mt-7 flex flex-col justify-between gap-3 border-t border-[#292722] pt-5 sm:flex-row sm:items-center">
            <p className="text-[8px] uppercase tracking-[0.18em] text-[#4E4D48]">
              Being IBAN Digital / Admin
            </p>

            <p className="text-[8px] uppercase tracking-[0.18em] text-[#4E4D48]">
              Secure administration environment
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
