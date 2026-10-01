import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/* -------------------------------------------------------------------------- */
/* SCREEN SIZE                                                                 */
/* -------------------------------------------------------------------------- */

function useIsSmallScreen(breakpoint = 1024) {
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const update = () => {
      setIsSmallScreen(media.matches);
    };

    update();

    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [breakpoint]);

  return isSmallScreen;
}

/* -------------------------------------------------------------------------- */
/* MOBILE                                                                      */
/* -------------------------------------------------------------------------- */

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const update = () => {
      setIsMobile(media.matches);
    };

    update();

    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

/* -------------------------------------------------------------------------- */
/* POINTS                                                                      */
/* -------------------------------------------------------------------------- */

const points = [
  {
    number: "01",
    title: "Affordable Pricing",
    text: "Affordable pricing designed for startups and growing businesses.",
  },
  {
    number: "02",
    title: "Creative Campaigns",
    text: "Creative and performance-driven digital campaigns.",
  },
  {
    number: "03",
    title: "Dedicated Support",
    text: "Dedicated support with transparent communication and reporting.",
  },
  {
    number: "04",
    title: "Customized Strategies",
    text: "Customized marketing strategies tailored to your goals.",
  },
  {
    number: "05",
    title: "Real Business Growth",
    text: "Focused on real business growth and quality lead generation.",
  },
];

/* -------------------------------------------------------------------------- */
/* GOLDEN BACKGROUND DOTS                                                      */
/* -------------------------------------------------------------------------- */

const goldenDots = [
  {
    top: "10%",
    left: "12%",
    size: 3,
    delay: 0,
    duration: 3.8,
  },
  {
    top: "17%",
    left: "72%",
    size: 4,
    delay: 0.8,
    duration: 4.5,
  },
  {
    top: "29%",
    left: "91%",
    size: 2,
    delay: 1.7,
    duration: 3.5,
  },
  {
    top: "38%",
    left: "20%",
    size: 4,
    delay: 0.4,
    duration: 4.8,
  },
  {
    top: "48%",
    left: "58%",
    size: 3,
    delay: 1.2,
    duration: 4,
  },
  {
    top: "61%",
    left: "87%",
    size: 4,
    delay: 2,
    duration: 4.7,
  },
  {
    top: "70%",
    left: "10%",
    size: 2,
    delay: 0.6,
    duration: 3.6,
  },
  {
    top: "79%",
    left: "68%",
    size: 3,
    delay: 1.5,
    duration: 4.4,
  },
  {
    top: "89%",
    left: "34%",
    size: 4,
    delay: 2.3,
    duration: 4.9,
  },
  {
    top: "93%",
    left: "91%",
    size: 2,
    delay: 0.9,
    duration: 3.9,
  },
];

/* -------------------------------------------------------------------------- */
/* POINT CARD                                                                  */
/* -------------------------------------------------------------------------- */

function PointCard({
  point,
  index,
  progress,
  isMobile,
  isSmallScreen,
  reducedMotion,
}) {
  /*
   * Desktop:
   *   01 -> 0.36
   *   02 -> 0.47
   *   03 -> 0.58
   *   04 -> 0.69
   *   05 -> 0.80
   *
   * Mobile/tablet:
   *   01 -> 0.18
   *   02 -> 0.27
   *   03 -> 0.36
   *   04 -> 0.45
   *   05 -> 0.54
   *
   * This is the main change that makes the section
   * require much less scrolling on smaller screens.
   */

  const cardStart = isSmallScreen ? 0.18 + index * 0.09 : 0.36 + index * 0.11;

  const cardEnterEnd = isSmallScreen ? cardStart + 0.055 : cardStart + 0.065;

  const stackX = index * (isMobile ? 10 : 22);

  const stackY = index * (isMobile ? 12 : 18);

  const entryProgress = useTransform(progress, (value) => {
    if (value <= cardStart) {
      return 0;
    }

    if (value >= cardEnterEnd) {
      return 1;
    }

    const raw = (value - cardStart) / (cardEnterEnd - cardStart);

    return raw * raw * (3 - 2 * raw);
  });

  const rawEntryX = useTransform(entryProgress, [0, 1], ["-150%", "0%"]);

  const entryX = useSpring(
    rawEntryX,
    reducedMotion
      ? {
          stiffness: 1000,
          damping: 100,
          mass: 0.1,
        }
      : isSmallScreen
        ? {
            stiffness: 240,
            damping: 34,
            mass: 0.18,
            restDelta: 0.001,
          }
        : {
            stiffness: 140,
            damping: 28,
            mass: 0.5,
            restDelta: 0.001,
          },
  );

  const rawEntryY = useTransform(entryProgress, [0, 1], ["-5vh", "0vh"]);

  const entryY = useSpring(
    rawEntryY,
    reducedMotion
      ? {
          stiffness: 1000,
          damping: 100,
          mass: 0.1,
        }
      : isSmallScreen
        ? {
            stiffness: 240,
            damping: 34,
            mass: 0.18,
            restDelta: 0.001,
          }
        : {
            stiffness: 140,
            damping: 28,
            mass: 0.5,
            restDelta: 0.001,
          },
  );

  const rawEntryScale = useTransform(entryProgress, [0, 1], [0.94, 1]);

  const entryScale = useSpring(
    rawEntryScale,
    reducedMotion
      ? {
          stiffness: 1000,
          damping: 100,
          mass: 0.1,
        }
      : isSmallScreen
        ? {
            stiffness: 260,
            damping: 36,
            mass: 0.16,
            restDelta: 0.001,
          }
        : {
            stiffness: 150,
            damping: 30,
            mass: 0.45,
            restDelta: 0.001,
          },
  );

  return (
    <motion.div
      className="
        absolute
        left-[4vw]
        top-[42%]
        w-[92vw]
        max-w-[900px]
        -translate-y-1/2
        -translate-x-4

        sm:left-[6vw]
        sm:top-[40%]
        sm:w-[84vw]
      "
      style={{
        x: stackX,
        y: stackY,
        zIndex: 20 + index,
      }}
    >
      <motion.div
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-[#C9A45C]/30
          bg-[#11120f]
          px-5
          py-6
          shadow-[0_24px_70px_rgba(0,0,0,0.65)]

          sm:rounded-[24px]
          sm:px-8
          sm:py-9

          lg:rounded-[28px]
          lg:px-14
          lg:py-14
        "
        style={{
          x: entryX,
          y: entryY,
          scale: entryScale,
          opacity: 1,
          willChange: "transform",
        }}
      >
        <div
          className="
            pointer-events-none
            absolute
            right-4
            top-3
            select-none
            text-[52px]
            font-light
            leading-none
            text-[#C9A45C]/[0.07]

            md:right-8
            md:top-6
            md:text-[100px]
          "
        >
          {point.number}
        </div>

        <div className="relative z-10">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#C9A45C]/70" />

            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A45C]/75 sm:text-[11px]">
              Why choose us
            </span>
          </div>

          <h3
            className="
              max-w-[700px]
              text-2xl
              font-medium
              leading-[1.08]
              tracking-[-0.04em]
              text-[#F5F3EE]

              sm:text-4xl

              md:text-6xl
            "
          >
            {point.title}
          </h3>

          <p
            className="
              mt-4
              max-w-[650px]
              text-sm
              leading-6
              text-[#C9A45C]/80

              sm:mt-6
              sm:text-lg
              sm:leading-8
            "
          >
            {point.text}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-[#C9A45C]/20" />
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                              */
/* -------------------------------------------------------------------------- */

export default function WhyChooseUs() {
  const sectionRef = useRef(null);

  const isMobile = useIsMobile();
  const isSmallScreen = useIsSmallScreen();
  const reducedMotion = useReducedMotion();

  /*
   * ------------------------------------------------------------------------
   * SECTION HEIGHT
   * ------------------------------------------------------------------------
   *
   * Desktop keeps the original long sequence.
   *
   * Phone/tablet get a significantly shorter section.
   * This directly reduces the physical amount of scrolling required.
   */

  const sectionHeight = isSmallScreen
    ? 560 + points.length * 42
    : isMobile
      ? 620 + points.length * 58
      : 700 + points.length * 70;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /*
   * ------------------------------------------------------------------------
   * SCROLL SMOOTHING
   * ------------------------------------------------------------------------
   *
   * The spring is lighter on small screens so it doesn't
   * create the impression that the animation is lagging
   * behind the shorter scroll sequence.
   */

  const smoothScrollProgress = useSpring(
    scrollYProgress,
    reducedMotion
      ? {
          stiffness: 1000,
          damping: 100,
          mass: 0.1,
        }
      : isSmallScreen
        ? {
            stiffness: 220,
            damping: 38,
            mass: 0.18,
            restDelta: 0.001,
          }
        : {
            stiffness: 90,
            damping: 30,
            mass: 0.45,
            restDelta: 0.001,
          },
  );

  /*
   * ------------------------------------------------------------------------
   * TITLE X
   * ------------------------------------------------------------------------
   *
   * Small screens finish the title movement much earlier.
   */

  const titleX = useTransform(
    smoothScrollProgress,
    isSmallScreen
      ? [0, 0.05, 0.11, 0.18, 0.72, 0.82, 1]
      : [0, 0.08, 0.18, 0.27, 0.91, 0.955, 1],
    isSmallScreen
      ? ["-105vw", "-8vw", "18vw", "24vw", "24vw", "75vw", "125vw"]
      : isMobile
        ? ["-105vw", "-8vw", "18vw", "24vw", "24vw", "75vw", "125vw"]
        : ["-105vw", "-12vw", "28vw", "45vw", "45vw", "90vw", "155vw"],
  );

  /*
   * ------------------------------------------------------------------------
   * TITLE Y
   * ------------------------------------------------------------------------
   */

  const titleY = useTransform(
    smoothScrollProgress,
    isSmallScreen
      ? [0, 0.07, 0.18, 0.72, 0.84, 1]
      : [0, 0.12, 0.27, 0.91, 0.96, 1],
    ["6vh", "0vh", "-3vh", "-3vh", "-3vh", "-3vh"],
  );

  /*
   * ------------------------------------------------------------------------
   * TITLE SCALE
   * ------------------------------------------------------------------------
   */

  const titleScale = useTransform(
    smoothScrollProgress,
    isSmallScreen
      ? [0, 0.05, 0.11, 0.18, 0.72, 0.84, 1]
      : [0, 0.08, 0.18, 0.27, 0.91, 0.96, 1],
    isSmallScreen
      ? [0.72, 0.92, 0.68, 0.58, 0.58, 0.58, 0.58]
      : isMobile
        ? [0.72, 0.92, 0.68, 0.58, 0.58, 0.58, 0.58]
        : [0.82, 1, 0.76, 0.62, 0.62, 0.62, 0.62],
  );

  /*
   * ------------------------------------------------------------------------
   * CARD STACK EXIT
   * ------------------------------------------------------------------------
   *
   * Desktop:
   *   exit starts at 0.91
   *
   * Phone/tablet:
   *   exit starts at 0.72
   *
   * This is what prevents the user from needing to
   * scroll through a large dead zone after the cards.
   */

  const stackX = useTransform(
    smoothScrollProgress,
    isSmallScreen ? [0.72, 0.82, 1] : [0.91, 0.955, 1],
    ["0vw", "45vw", "110vw"],
  );

  const stackY = useTransform(
    smoothScrollProgress,
    isSmallScreen ? [0.72, 0.84, 1] : [0.91, 0.96, 1],
    ["0vh", "0vh", "-3vh"],
  );

  const stackOpacity = useTransform(
    smoothScrollProgress,
    isSmallScreen ? [0.72, 0.82, 1] : [0.91, 0.96, 1],
    [1, 0.4, 0],
  );

  /*
   * ------------------------------------------------------------------------
   * FINAL BLACK SCREEN
   * ------------------------------------------------------------------------
   */

  const finalBlackOpacity = useTransform(
    smoothScrollProgress,
    isSmallScreen ? [0.82, 0.91, 1] : [0.95, 0.98, 1],
    [0, 0.7, 1],
  );

  /*
   * ------------------------------------------------------------------------
   * PROGRESS BAR
   * ------------------------------------------------------------------------
   */

  const progressOpacity = useTransform(
    smoothScrollProgress,
    isSmallScreen ? [0.78, 0.9] : [0.91, 0.98],
    [1, 0],
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-[#F5F3EE]"
      style={{
        height: `${sectionHeight}vh`,
      }}
    >
      {/* ================================================================== */}
      {/* STICKY VIEWPORT                                                     */}
      {/* ================================================================== */}

      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#080907]">
        {/* ================================================================ */}
        {/* AMBIENT GOLDEN GLOW                                               */}
        {/* ================================================================ */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            overflow-hidden
          "
        >
          <div
            className="
              absolute
              left-[55%]
              top-1/2
              h-[65vh]
              w-[65vh]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#C9A45C]/[0.025]
              blur-[120px]
            "
          />

          <div
            className="
              absolute
              left-[15%]
              top-[20%]
              h-[30vh]
              w-[30vh]
              rounded-full
              bg-[#C9A45C]/[0.018]
              blur-[100px]
            "
          />
        </div>

        {/* ================================================================ */}
        {/* GOLDEN DOTS                                                       */}
        {/* ================================================================ */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-[2]
            overflow-hidden
          "
        >
          {goldenDots.map((dot, index) => (
            <motion.span
              key={`golden-dot-${index}`}
              className="
                absolute
                rounded-full
                bg-[#C9A45C]
              "
              style={{
                top: dot.top,
                left: dot.left,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                boxShadow: "0 0 10px 2px rgba(201,164,92,0.65)",
                willChange: "transform, opacity",
              }}
              animate={{
                opacity: reducedMotion ? 0.35 : [0.12, 0.75, 0.2, 0.95, 0.12],
                scale: reducedMotion ? 1 : [0.65, 1.45, 0.75, 1.25, 0.65],
              }}
              transition={{
                duration: dot.duration,
                delay: dot.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* ================================================================ */}
        {/* PARTICLE TRAILS                                                   */}
        {/* ================================================================ */}

        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-[28%]
            top-[18%]
            z-[2]
            h-px
            w-[100px]
            bg-gradient-to-r
            from-transparent
            via-[#C9A45C]/25
            to-transparent
          "
          animate={{
            opacity: reducedMotion ? 0.1 : [0.05, 0.35, 0.05],
            scaleX: reducedMotion ? 1 : [0.5, 1, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[22%]
            right-[18%]
            z-[2]
            h-px
            w-[130px]
            bg-gradient-to-r
            from-transparent
            via-[#C9A45C]/20
            to-transparent
          "
          animate={{
            opacity: reducedMotion ? 0.1 : [0.04, 0.3, 0.04],
            scaleX: reducedMotion ? 1 : [0.6, 1, 0.6],
          }}
          transition={{
            duration: 6,
            delay: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ================================================================ */}
        {/* TITLE                                                              */}
        {/* ================================================================ */}

        <motion.div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-10
            flex
            w-full
            items-center
          "
          style={{
            x: titleX,
            y: titleY,
            scale: titleScale,
            willChange: "transform",
          }}
        >
          <div className="ml-[7vw] w-[75vw] max-w-[950px]">
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#C9A45C]/75">
              Why choose us?
            </p>

            <h2
              className="
                text-[17vw]
                font-medium
                leading-[0.82]
                tracking-[-0.075em]
                text-[#F5F3EE]

                sm:text-[12vw]

                md:text-[9vw]
              "
            >
              <span className="text-[#C9A45C]">Why</span>

              <br />

              <span className="whitespace-nowrap">
                choose us
                <span className="text-[#C9A45C]"> ?</span>
              </span>
            </h2>
          </div>
        </motion.div>

        {/* ================================================================ */}
        {/* CARD STACK                                                        */}
        {/* ================================================================ */}

        <motion.div
          className="
            absolute
            inset-0
            z-20
          "
          style={{
            x: stackX,
            y: stackY,
            opacity: stackOpacity,
            willChange: "transform, opacity",
          }}
        >
          {points.map((point, index) => (
            <PointCard
              key={point.number}
              point={point}
              index={index}
              progress={smoothScrollProgress}
              isMobile={isMobile}
              isSmallScreen={isSmallScreen}
              reducedMotion={reducedMotion}
            />
          ))}
        </motion.div>

        {/* ================================================================ */}
        {/* PROGRESS BAR                                                      */}
        {/* ================================================================ */}

        <motion.div
          className="
            absolute
            bottom-7
            left-1/2
            z-50
            h-px
            w-[86vw]
            max-w-[700px]
            -translate-x-1/2
            overflow-hidden
            bg-[#C9A45C]/15

            sm:w-[75vw]
          "
          style={{
            opacity: progressOpacity,
          }}
        >
          <motion.div
            className="
              h-full
              w-full
              origin-left
              bg-[#C9A45C]/70
            "
            style={{
              scaleX: smoothScrollProgress,
              willChange: "transform",
            }}
          />
        </motion.div>

        {/* ================================================================ */}
        {/* FINAL BLACK SCREEN                                                */}
        {/* ================================================================ */}

        <motion.div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[100]
            bg-black
          "
          style={{
            opacity: finalBlackOpacity,
          }}
        />
      </div>
    </section>
  );
}
