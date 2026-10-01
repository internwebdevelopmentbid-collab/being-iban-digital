import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import bieLogo from "../../assets/bie-logo.png";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");

    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
};

const ParentCompany = () => {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /*
   * ============================================================
   * SMOOTH CARD MOTION
   * ============================================================
   *
   * The card has a longer, softer travel path.
   * Only the Y movement uses a spring so the card feels physical
   * without making opacity and scale lag behind.
   */

  const cardY = useTransform(
    scrollYProgress,
    [0, 0.08, 0.2, 0.34, 0.66, 0.8, 0.92, 1],
    isMobile
      ? ["72vh", "52vh", "12vh", "0vh", "0vh", "-12vh", "-52vh", "-72vh"]
      : ["82vh", "58vh", "14vh", "0vh", "0vh", "-14vh", "-58vh", "-82vh"],
  );

  const cardOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.18, 0.28, 0.72, 0.82, 0.92, 1],
    [0, 0.25, 0.7, 1, 1, 0.7, 0.25, 0],
  );

  const cardScale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.28, 0.72, 0.85, 1],
    [0.975, 0.99, 1, 1, 0.99, 0.975],
  );

  /*
   * Smooth physical movement.
   *
   * Lower stiffness:
   * smoother acceleration
   *
   * Higher damping:
   * prevents bounce/jitter
   *
   * Higher mass:
   * adds subtle inertia
   */

  const smoothCardY = useSpring(cardY, {
    stiffness: 55,
    damping: 30,
    mass: 1.1,
  });

  const handleVisit = () => {
    window.open(
      "https://beingibanentertainments.com",
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[260vh] bg-black text-[#F5F3EE] sm:h-[300vh] lg:h-[320vh]"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-3 py-6 sm:px-8 sm:py-28 lg:px-12 lg:py-36 xl:px-16">
        {/* =====================================================
            BACKGROUND RED GLOWING DOTS
            ===================================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          {/* LARGE SOFT RED GLOWS */}

          <motion.span
            animate={{
              opacity: [0.08, 0.22, 0.08],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[4%] top-[12%] h-20 w-20 rounded-full bg-[#FF0000]/20 blur-3xl"
          />

          <motion.span
            animate={{
              opacity: [0.06, 0.18, 0.06],
              scale: [0.8, 1.15, 0.8],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute right-[3%] top-[22%] h-24 w-24 rounded-full bg-[#FF0000]/20 blur-3xl"
          />

          <motion.span
            animate={{
              opacity: [0.05, 0.16, 0.05],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-[12%] left-[10%] h-24 w-24 rounded-full bg-[#FF0000]/20 blur-3xl"
          />

          <motion.span
            animate={{
              opacity: [0.06, 0.18, 0.06],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 5.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
            className="absolute bottom-[15%] right-[10%] h-20 w-20 rounded-full bg-[#FF0000]/20 blur-3xl"
          />

          {/* TOP / LEFT DOTS */}

          <motion.span
            animate={{
              opacity: [0.15, 0.7, 0.15],
              scale: [0.7, 1.25, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[5%] top-[18%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          <motion.span
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.7,
            }}
            className="absolute left-[12%] top-[32%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          <motion.span
            animate={{
              opacity: [0.12, 0.75, 0.12],
              scale: [0.7, 1.25, 0.7],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
            className="absolute left-[18%] top-[14%] h-1.5 w-1.5 rounded-full bg-[#FF0000] shadow-[0_0_14px_rgba(255,0,0,0.9)]"
          />

          <motion.span
            animate={{
              opacity: [0.12, 0.65, 0.12],
              scale: [0.7, 1.25, 0.7],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.8,
            }}
            className="absolute left-[7%] top-[52%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          <motion.span
            animate={{
              opacity: [0.1, 0.7, 0.1],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="absolute left-[15%] top-[68%] h-1.5 w-1.5 rounded-full bg-[#FF0000] shadow-[0_0_14px_rgba(255,0,0,0.9)]"
          />

          <motion.span
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [0.7, 1.2, 0.7],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute left-[25%] top-[82%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          {/* RIGHT DOTS */}

          <motion.span
            animate={{
              opacity: [0.12, 0.7, 0.12],
              scale: [0.7, 1.25, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute right-[6%] top-[14%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          <motion.span
            animate={{
              opacity: [0.1, 0.65, 0.1],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.4,
            }}
            className="absolute right-[14%] top-[30%] h-1.5 w-1.5 rounded-full bg-[#FF0000] shadow-[0_0_14px_rgba(255,0,0,0.9)]"
          />

          <motion.span
            animate={{
              opacity: [0.1, 0.7, 0.1],
              scale: [0.7, 1.25, 0.7],
            }}
            transition={{
              duration: 4.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.2,
            }}
            className="absolute right-[8%] top-[48%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          <motion.span
            animate={{
              opacity: [0.12, 0.7, 0.12],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
            className="absolute right-[18%] top-[65%] h-1.5 w-1.5 rounded-full bg-[#FF0000] shadow-[0_0_14px_rgba(255,0,0,0.9)]"
          />

          <motion.span
            animate={{
              opacity: [0.1, 0.65, 0.1],
              scale: [0.7, 1.2, 0.7],
            }}
            transition={{
              duration: 4.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.6,
            }}
            className="absolute right-[7%] top-[78%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          <motion.span
            animate={{
              opacity: [0.1, 0.65, 0.1],
              scale: [0.7, 1.25, 0.7],
            }}
            transition={{
              duration: 3.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5,
            }}
            className="absolute right-[25%] top-[88%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          {/* TOP CENTER DOTS */}

          <motion.span
            animate={{
              opacity: [0.1, 0.65, 0.1],
              scale: [0.7, 1.25, 0.7],
            }}
            transition={{
              duration: 4.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute left-[32%] top-[8%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          <motion.span
            animate={{
              opacity: [0.12, 0.7, 0.12],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 3.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute left-[42%] top-[5%] h-1.5 w-1.5 rounded-full bg-[#FF0000] shadow-[0_0_14px_rgba(255,0,0,0.9)]"
          />

          <motion.span
            animate={{
              opacity: [0.1, 0.7, 0.1],
              scale: [0.7, 1.25, 0.7],
            }}
            transition={{
              duration: 4.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
            className="absolute right-[38%] top-[7%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          <motion.span
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [0.7, 1.25, 0.7],
            }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
            className="absolute right-[28%] top-[12%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          {/* BOTTOM DOTS */}

          <motion.span
            animate={{
              opacity: [0.1, 0.7, 0.1],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.3,
            }}
            className="absolute bottom-[7%] left-[30%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          <motion.span
            animate={{
              opacity: [0.12, 0.7, 0.12],
              scale: [0.7, 1.25, 0.7],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.1,
            }}
            className="absolute bottom-[10%] left-[42%] h-1.5 w-1.5 rounded-full bg-[#FF0000] shadow-[0_0_14px_rgba(255,0,0,0.9)]"
          />

          <motion.span
            animate={{
              opacity: [0.1, 0.65, 0.1],
              scale: [0.7, 1.2, 0.7],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.9,
            }}
            className="absolute bottom-[8%] right-[35%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />

          <motion.span
            animate={{
              opacity: [0.1, 0.7, 0.1],
              scale: [0.7, 1.25, 0.7],
            }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.7,
            }}
            className="absolute bottom-[5%] right-[45%] h-1 w-1 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          />
        </div>

        {/* =====================================================
            MAIN CONTENT
            ===================================================== */}

        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          {/* ===================================================
              MAIN CARD
              =================================================== */}

          <motion.div
            style={{
              y: smoothCardY,
              opacity: cardOpacity,
              scale: cardScale,
            }}
            className="relative w-full overflow-hidden rounded-[22px] border border-[#302E28] bg-[#10110F] shadow-[0_25px_70px_rgba(0,0,0,0.35)] will-change-transform sm:rounded-[30px] lg:rounded-[38px]"
          >
            {/* =================================================
                SUBTLE INTERNAL RED ACCENT
                ================================================= */}

            <motion.div
              aria-hidden="true"
              initial={{
                opacity: 0,
                scaleX: 0.5,
              }}
              whileInView={{
                opacity: [0.25, 0.65, 0.25],
                scaleX: [0.75, 1, 0.75],
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                opacity: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                scaleX: {
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="absolute left-[8%] right-[8%] top-0 h-px origin-center bg-[#FF0000]/60"
            />

            {/* =================================================
                CONTENT GRID
                ================================================= */}

            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
              {/* =================================================
                  LOGO PANEL
                  ================================================= */}

              <div className="relative flex min-h-[235px] items-center justify-center overflow-hidden border-b border-[#292722] p-5 sm:min-h-[390px] sm:p-14 lg:min-h-[540px] lg:border-b-0 lg:border-r lg:p-16">
                {/* Red logo rings */}

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 1.45,
                    delay: 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  aria-hidden="true"
                  className="absolute h-[210px] w-[210px] rounded-full border border-[#FF0000]/[0.08] sm:h-[390px] sm:w-[390px]"
                />

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 1.45,
                    delay: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  aria-hidden="true"
                  className="absolute h-[165px] w-[165px] rounded-full border border-[#FF0000]/[0.06] sm:h-[315px] sm:w-[315px]"
                />

                {/* Small pulsing red point */}

                <motion.span
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: [0.35, 1, 0.35],
                    y: 0,
                    scale: [0.8, 1, 0.8],
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    opacity: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    },
                    scale: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    },
                    y: {
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  className="absolute left-1/2 top-[calc(50%-105px)] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#FF0000] sm:top-[calc(50%-195px)]"
                />

                {/* Large logo container */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 70,
                    scale: 0.8,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.04,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 1.3,
                    delay: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative z-10 flex h-[125px] w-[125px] cursor-pointer items-center justify-center rounded-full bg-black p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] will-change-transform sm:h-[220px] sm:w-[220px] sm:p-8"
                >
                  <img
                    src={bieLogo}
                    alt="Being Iban Entertainment Pvt. Ltd. logo"
                    className="h-full w-full object-contain"
                  />
                </motion.div>

                {/* Panel label */}

                <motion.span
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute left-4 top-4 text-[7px] uppercase tracking-[0.25em] text-[#77746D] sm:left-8 sm:top-8 sm:text-[8px]"
                >
                  Parent company
                </motion.span>

                <motion.span
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute bottom-4 right-4 font-mono text-[8px] tracking-[0.2em] text-[#77746D] sm:bottom-8 sm:right-8 sm:text-[9px]"
                >
                  01
                </motion.span>
              </div>

              {/* =================================================
                  CONTENT
                  ================================================= */}

              <div className="flex flex-col justify-center p-5 sm:p-12 lg:p-16 xl:p-20">
                {/* Eyebrow */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mb-4 flex items-center gap-3 sm:mb-7 sm:gap-4"
                >
                  <span className="h-px w-7 bg-[#FF0000] sm:w-14" />

                  <span className="text-[8px] uppercase tracking-[0.28em] text-[#FF0000] sm:text-[10px] sm:tracking-[0.35em]">
                    Parent Company
                  </span>
                </motion.div>

                {/* Heading */}

                <motion.h2
                  initial={{
                    opacity: 0,
                    y: 70,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="max-w-[850px] text-[clamp(30px,8.5vw,76px)] font-medium leading-[0.96] tracking-[-0.05em] sm:text-[clamp(38px,5vw,76px)] sm:leading-[0.94]"
                >
                  Powered by{" "}
                  <span className="text-[#FF0000]">
                    Being Iban Entertainments
                  </span>{" "}
                  Pvt. Ltd.
                </motion.h2>

                {/* Description */}

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 45,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mt-5 max-w-[720px] text-[13px] leading-6 text-[#A7A39B] sm:mt-8 sm:text-base sm:leading-8"
                >
                  Being Iban Digital proudly operates under the vision of{" "}
                  <span className="text-[#D8D4CB]">
                    Being Iban Entertainment Pvt. Ltd.
                  </span>
                  , blending entertainment-grade creativity with modern
                  technology, digital strategy, branding, and performance
                  marketing to build extraordinary experiences for businesses
                  worldwide.
                </motion.p>

                {/* Divider */}

                <motion.div
                  initial={{
                    opacity: 0,
                    scaleX: 0,
                    transformOrigin: "left",
                  }}
                  whileInView={{
                    opacity: 1,
                    scaleX: 1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mt-6 h-px w-full origin-left bg-[#292722] sm:mt-10"
                />

                {/* Button */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.75,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mt-5 sm:mt-8"
                >
                  <button
                    type="button"
                    onClick={handleVisit}
                    className="group flex w-full items-center justify-center gap-3 rounded-full border border-[#FF0000]/60 bg-[#FF0000] px-4 py-3.5 text-center text-[9px] font-medium uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-white hover:text-black hover:shadow-[0_0_40px_rgba(255,0,0,0.18)] sm:inline-flex sm:w-auto sm:gap-5 sm:px-7 sm:py-4 sm:text-[10px] sm:tracking-[0.25em]"
                  >
                    <span className="whitespace-nowrap">
                      Visit Being Iban Entertainments
                    </span>

                    <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden">
                      <span className="absolute transition-transform duration-300 group-hover:translate-x-5">
                        →
                      </span>

                      <span className="absolute -translate-x-5 transition-transform duration-300 group-hover:translate-x-0">
                        →
                      </span>
                    </span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ParentCompany;
