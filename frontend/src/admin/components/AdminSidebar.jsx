import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";

import { clearAdminSession } from "../utils/adminAPI";

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const businessNavigation = [
    {
      label: "Meetings",
      path: "/admin/meetings",
      icon: "○",
    },
  ];

  const contentNavigation = [
    {
      label: "Media",
      path: "/admin/media",
      icon: "▧",
    },
    {
      label: "Website",
      path: "/admin/website",
      icon: "◈",
    },
  ];

  const handleLogout = () => {
    clearAdminSession();

    toast.success("Admin session ended.");

    navigate("/admin/login", {
      replace: true,
    });
  };

  const renderNavigation = (items) =>
    items.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          `group relative flex min-h-[46px] items-center gap-3 px-3 text-[11px] transition ${
            isActive
              ? "bg-[#151611] text-[#F5F3EE]"
              : "text-[#85827A] hover:bg-[#11120F] hover:text-[#F5F3EE]"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute bottom-3 left-0 top-3 w-0.5 bg-[#C9A66B]" />
            )}

            <span
              className={`w-[18px] text-center text-[13px] ${
                isActive ? "text-[#C9A66B]" : "text-[#77746D]"
              }`}
            >
              {item.icon}
            </span>

            <span>{item.label}</span>
          </>
        )}
      </NavLink>
    ));

  return (
    <>
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-[90] bg-black/65 backdrop-blur-[3px] lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[100] flex h-screen w-[260px] flex-col border-r border-[#292722] bg-[#0C0D0B] px-[18px] py-7 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex min-h-[58px] items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}

            <img
              src={logo}
              alt="Being IBAN Digital"
              className="block h-[52px] w-auto max-w-[190px] object-contain min-[901px]:h-[52px] max-[1024px]:h-[48px] max-[1024px]:max-w-[175px] max-[640px]:h-[44px] max-[640px]:max-w-[160px]"
            />

            <div className="flex gap-0.5">
              <span className="text-[7px] tracking-[0.15em] text-[#68665F]">
                ADMIN
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-[#77746D] lg:hidden"
          >
            ×
          </button>
        </div>

        <div className="my-6 h-px bg-[#292722]" />

        <nav className="flex flex-col">
          <span className="mb-3 px-3 text-[8px] tracking-[0.17em] text-[#55534D]">
            OVERVIEW
          </span>

          <NavLink
            to="/admin"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `relative flex min-h-[46px] items-center gap-3 px-3 text-[11px] ${
                isActive
                  ? "bg-[#151611] text-[#F5F3EE]"
                  : "text-[#85827A] hover:bg-[#11120F] hover:text-[#F5F3EE]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute bottom-3 left-0 top-3 w-0.5 bg-[#C9A66B]" />
                )}
                <span
                  className={`w-[18px] text-center ${
                    isActive ? "text-[#C9A66B]" : "text-[#77746D]"
                  }`}
                >
                  ◈
                </span>
                Dashboard
              </>
            )}
          </NavLink>

          <span className="mb-3 mt-7 px-3 text-[8px] tracking-[0.17em] text-[#55534D]">
            BUSINESS
          </span>

          {renderNavigation(businessNavigation)}

          <span className="mb-3 mt-7 px-3 text-[8px] tracking-[0.17em] text-[#55534D]">
            CONTENT
          </span>

          {renderNavigation(contentNavigation)}
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          <NavLink
            to="/"
            onClick={onClose}
            className="flex min-h-[43px] items-center gap-3 px-3 text-[10px] text-[#77746D] hover:bg-[#11120F] hover:text-[#F5F3EE]"
          >
            <span className="w-[18px] text-center text-sm text-[#C9A66B]">
              ↗
            </span>
            View Website
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-[43px] items-center gap-3 px-3 text-left text-[10px] text-[#77746D] hover:bg-[#11120F] hover:text-[#F5F3EE]"
          >
            <span className="w-[18px] text-center text-sm text-[#C9A66B]">
              ↪
            </span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
