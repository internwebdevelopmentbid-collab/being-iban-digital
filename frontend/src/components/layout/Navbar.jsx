import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious();

    if (previous === undefined) {
      return;
    }

    const difference = current - previous;

    if (current <= 10) {
      setIsNavbarVisible(true);
      return;
    }

    if (difference > 0) {
      setIsNavbarVisible(false);
      setIsMenuOpen(false);
    } else if (difference < 0) {
      setIsNavbarVisible(true);
    }
  });

  const navItems = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Our Works",
      path: "/portfolio",
    },
    {
      label: "Services & Solutions",
      path: "/services",
    },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{
          y: 0,
        }}
        animate={{
          y: isNavbarVisible ? 0 : "-100%",
        }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          fixed
          left-0
          top-0
          z-[1000]
          h-[82px]
          w-full
          border-b
          border-white/[0.10]
          bg-black/[0.78]
          backdrop-blur-[20px]
          backdrop-saturate-[150%]
          supports-[backdrop-filter]:bg-black/[0.62]
          shadow-[0_8px_30px_rgba(0,0,0,0.18)]
        "
      >
        <div
          className="
            mx-auto
            flex
            h-full
            w-[calc(100%-40px)]
            max-w-[1400px]
            items-center
            justify-between
            min-[901px]:w-[calc(100%-80px)]
          "
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="Being IBAN Digital"
            className="flex shrink-0 items-center"
          >
            <img
              src={logo}
              alt="Being IBAN Digital"
              className="
                block
                h-[52px]
                w-auto
                max-w-[190px]
                object-contain
                min-[901px]:h-[52px]
                max-[1024px]:h-[48px]
                max-[1024px]:max-w-[175px]
                max-[640px]:h-[44px]
                max-[640px]:max-w-[160px]
              "
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            className="
              hidden
              items-center
              gap-[38px]
              min-[901px]:flex
            "
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `group relative font-sans text-[13px] font-medium tracking-[0.04em] transition-all duration-300 ${
                    isActive
                      ? "text-[#FFFFFF]"
                      : "text-[#E8E5DE] hover:text-[#FFFFFF]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}

                    <span
                      className={`absolute -bottom-2 left-0 h-px bg-[#C9A66B] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            className="
              relative
              flex
              h-[42px]
              w-[42px]
              items-center
              justify-center
              min-[901px]:hidden
            "
          >
            <span
              className={`absolute h-px w-[22px] bg-[#FFFFFF] transition-transform duration-300 ${
                isMenuOpen ? "rotate-45" : "-translate-y-[4px]"
              }`}
            />

            <span
              className={`absolute h-px w-[22px] bg-[#FFFFFF] transition-transform duration-300 ${
                isMenuOpen ? "-rotate-45" : "translate-y-[4px]"
              }`}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay + sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Mobile overlay */}
            <motion.button
              type="button"
              aria-label="Close navigation"
              onClick={closeMenu}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                fixed
                inset-0
                z-[1001]
                bg-black/60
                backdrop-blur-[3px]
                min-[901px]:hidden
              "
            />

            {/* Mobile sidebar */}
            <motion.aside
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                fixed
                right-0
                top-0
                z-[1002]
                flex
                h-screen
                w-[min(420px,88vw)]
                flex-col
                border-l
                border-[#292722]
                bg-[#11120F]
                min-[901px]:hidden
              "
            >
              <div
                className="
                  flex
                  h-full
                  flex-col
                  px-7
                  pb-[30px]
                  pt-[105px]
                  sm:px-[42px]
                  sm:pb-[42px]
                  sm:pt-[120px]
                "
              >
                {/* Sidebar heading */}
                <div className="mb-12 flex items-center gap-[15px]">
                  <span
                    className="
                      font-sans
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.2em]
                      text-[#C9A66B]
                    "
                  >
                    MENU
                  </span>

                  <span className="h-px flex-1 bg-[#292722]" />
                </div>

                {/* Mobile links */}
                <nav className="flex flex-col gap-[5px]">
                  {navItems.map((item, index) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/"}
                      onClick={closeMenu}
                      className="
                        group
                        flex
                        items-center
                        gap-[18px]
                        py-[15px]
                      "
                    >
                      {({ isActive }) => (
                        <>
                          {/* Menu number */}
                          <span
                            className={`font-sans text-[9px] font-medium tracking-[0.1em] transition-colors duration-300 ${
                              isActive ? "text-[#C9A66B]" : "text-[#9A7442]"
                            }`}
                          >
                            0{index + 1}
                          </span>

                          {/* Menu label */}
                          <span
                            className={`font-display text-[clamp(27px,6vw,38px)] font-normal leading-none tracking-[-0.025em] transition-all duration-300 ${
                              isActive
                                ? "translate-x-2 text-[#C9A66B]"
                                : "text-[#F5F3EE] group-hover:translate-x-2 group-hover:text-[#C9A66B]"
                            }`}
                          >
                            {item.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>

                {/* Decorative dots */}
                <div className="mt-auto">
                  <div className="mt-[35px] flex gap-[7px]">
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
