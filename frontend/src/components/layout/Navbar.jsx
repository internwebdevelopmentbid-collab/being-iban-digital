import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Our Works", path: "/portfolio" },
    { label: "Services & Solutions", path: "/services" },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const menuTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

  return (
    <>
      {/* Sticky Navbar */}
      <header
        className="
          sticky top-0 z-[1000]
          h-[82px] min-h-[82px] shrink-0
          w-full
          border-b border-white/[0.10]
          bg-black/[0.78]
          backdrop-blur-[20px]
          backdrop-saturate-[150%]
          supports-[backdrop-filter]:bg-black/[0.62]
          shadow-[0_8px_30px_rgba(0,0,0,0.18)]
        "
      >
        <div
          className="
            mx-auto flex h-full
            w-[calc(100%-40px)]
            max-w-[1400px]
            items-center justify-between
            min-[901px]:w-[calc(100%-80px)]
          "
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="Being IBAN Digital home"
            className="flex shrink-0 items-center"
          >
            <img
              src={logo}
              alt="Being IBAN Digital"
              width="190"
              height="52"
              fetchPriority="high"
              decoding="async"
              className="
                block h-[52px] w-auto max-w-[190px]
                object-contain
                min-[901px]:h-[52px]
                max-[1024px]:h-[48px]
                max-[1024px]:max-w-[175px]
                max-[640px]:h-[44px]
                max-[640px]:max-w-[160px]
              "
              style={{
                aspectRatio: "190 / 52",
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="
              hidden items-center gap-[38px]
              min-[901px]:flex
            "
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `group relative font-sans text-[13px] font-medium
                  tracking-[0.04em] transition-colors duration-300
                  ${
                    isActive ? "text-white" : "text-[#E8E5DE] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}

                    <span
                      className={`
                        absolute -bottom-2 left-0 h-px bg-[#C9A66B]
                        ${
                          reducedMotion ? "" : "transition-[width] duration-300"
                        }
                        ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                      `}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="
              relative flex h-[42px] w-[42px]
              items-center justify-center
              min-[901px]:hidden
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-[#C9A66B]
            "
          >
            <span
              className={`
                absolute h-px w-[22px] bg-white
                ${reducedMotion ? "" : "transition-transform duration-300"}
                ${isMenuOpen ? "rotate-45" : "-translate-y-[4px]"}
              `}
            />

            <span
              className={`
                absolute h-px w-[22px] bg-white
                ${reducedMotion ? "" : "transition-transform duration-300"}
                ${isMenuOpen ? "-rotate-45" : "translate-y-[4px]"}
              `}
            />
          </button>
        </div>
      </header>

      {/* Mobile Overlay and Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.button
              type="button"
              aria-label="Close navigation"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={menuTransition}
              className="
                fixed inset-0 z-[1001]
                bg-black/60 backdrop-blur-[3px]
                min-[901px]:hidden
              "
            />

            {/* Sidebar */}
            <motion.aside
              id="mobile-navigation"
              initial={reducedMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reducedMotion ? undefined : { x: "100%" }}
              transition={menuTransition}
              className="
                fixed right-0 top-0 z-[1002]
                flex h-dvh
                w-[min(420px,88vw)]
                flex-col overflow-y-auto
                border-l border-[#292722]
                bg-[#11120F]
                min-[901px]:hidden
              "
            >
              <div
                className="
                  flex min-h-full flex-col
                  px-7 pb-[30px] pt-[105px]
                  sm:px-[42px] sm:pb-[42px] sm:pt-[120px]
                "
              >
                {/* Sidebar Heading */}
                <div className="mb-12 flex items-center gap-[15px]">
                  <span
                    className="
                      font-sans text-[9px] font-medium
                      uppercase tracking-[0.2em] text-[#C9A66B]
                    "
                  >
                    MENU
                  </span>

                  <span className="h-px flex-1 bg-[#292722]" />
                </div>

                {/* Mobile Links */}
                <nav
                  aria-label="Mobile navigation"
                  className="flex flex-col gap-[5px]"
                >
                  {navItems.map((item, index) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/"}
                      onClick={closeMenu}
                      className="
                        group flex items-center gap-[18px]
                        py-[15px]
                      "
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`
                              font-sans text-[9px] font-medium
                              tracking-[0.1em] transition-colors duration-300
                              ${isActive ? "text-[#C9A66B]" : "text-[#9A7442]"}
                            `}
                          >
                            0{index + 1}
                          </span>

                          <span
                            className={`
                              font-display
                              text-[clamp(27px,6vw,38px)]
                              font-normal leading-tight
                              tracking-[-0.025em]
                              ${
                                reducedMotion
                                  ? ""
                                  : "transition-colors duration-300"
                              }
                              ${
                                isActive
                                  ? "text-[#C9A66B]"
                                  : "text-[#F5F3EE] group-hover:text-[#C9A66B]"
                              }
                            `}
                          >
                            {item.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>

                {/* Decorative Dots */}
                <div className="mt-auto pt-[35px]">
                  <div className="flex gap-[7px]">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#C9A66B]/70" />
                    <span className="h-[5px] w-[5px] rounded-full bg-[#C9A66B]/35" />
                    <span className="h-[5px] w-[5px] rounded-full bg-[#C9A66B]/15" />
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
