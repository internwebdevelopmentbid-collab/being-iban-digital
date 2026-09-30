import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import api_url from "../../config/api";

const CONTENT_START = 0.04;
const CONTENT_END = 0.14;

const SEQUENCE_START = 0.22;
const SEQUENCE_END = 0.64;

/*
 * The camera-out starts earlier and finishes before
 * the sticky section releases, so the next component
 * cannot appear through the white transition.
 */
const EXIT_START = 0.58;
const EXIT_END = 0.86;

/*
 * Fixed camera focal point inside the original number.
 *
 * The number is rendered as SVG so the extreme zoom
 * remains vector-sharp.
 */
const NUMBER_FOCAL_X = 62;
const NUMBER_FOCAL_Y = 50;

/*
 * =========================================
 * SMOOTH SCROLL CONFIGURATION
 * =========================================
 */

const SCROLL_SPRING = {
  stiffness: 100,
  damping: 30,
  mass: 0.35,
};

/*
 * =========================================
 * BACKGROUND GOLD DOT
 * =========================================
 */

const GoldDot = ({
  left,
  top,
  size = 5,
  duration = 3.8,
  delay = 0,
  opacity = [0.12, 0.55, 0.12],
  scale = [0.8, 1.4, 0.8],
}) => {
  return (
    <motion.span
      aria-hidden="true"
      animate={{
        opacity,
        scale,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="
        pointer-events-none
        absolute
        z-0
        rounded-full
        bg-[#C9A66B]
      "
      style={{
        left,
        top,
        width: size,
        height: size,
        boxShadow: `
          0 0 ${size * 2.5}px rgba(201,166,107,0.55),
          0 0 ${size * 6}px rgba(201,166,107,0.18)
        `,
      }}
    />
  );
};

const StatsSection = () => {
  const sectionRef = useRef(null);

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  /*
   * =========================================
   * SCROLL
   * =========================================
   */

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /*
   * =========================================
   * SMOOTH SCROLL PROGRESS
   * =========================================
   */

  const smoothScrollProgress = useSpring(scrollYProgress, SCROLL_SPRING);

  /*
   * =========================================
   * LOAD STATS
   * =========================================
   */

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${api_url}/api/website/stats`);

        if (!response.ok) {
          throw new Error("Unable to load statistics.");
        }

        const data = await response.json();

        let nextStats = [];

        if (Array.isArray(data?.stats)) {
          nextStats = data.stats;
        } else if (Array.isArray(data?.data)) {
          nextStats = data.data;
        } else if (Array.isArray(data)) {
          nextStats = data;
        }

        if (!cancelled) {
          setStats(nextStats);
          setActiveIndex(0);
        }
      } catch (error) {
        console.error("Stats fetch error:", error);

        if (!cancelled) {
          setStats([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =========================================
   * STAT SEQUENCE
   * =========================================
   *
   * The raw scroll position decides which
   * statistic is active.
   *
   * The actual visual transition is handled
   * separately below so the previous number
   * can finish its exit gracefully.
   */

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!stats.length) {
      return;
    }

    if (progress < SEQUENCE_START) {
      if (activeIndex !== 0) {
        setActiveIndex(0);
      }

      return;
    }

    if (progress >= SEQUENCE_END) {
      const lastIndex = stats.length - 1;

      if (activeIndex !== lastIndex) {
        setActiveIndex(lastIndex);
      }

      return;
    }

    if (stats.length === 1) {
      return;
    }

    const sequenceProgress =
      (progress - SEQUENCE_START) / (SEQUENCE_END - SEQUENCE_START);

    const remainingStats = stats.length - 1;

    const nextIndex = Math.min(
      stats.length - 1,
      1 + Math.floor(sequenceProgress * remainingStats),
    );

    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  });

  /*
   * =========================================
   * CONTENT ENTRANCE
   * =========================================
   */

  const contentY = useTransform(
    smoothScrollProgress,
    [CONTENT_START, CONTENT_END],
    [190, 0],
  );

  const contentScale = useTransform(
    smoothScrollProgress,
    [CONTENT_START, CONTENT_END],
    [0.92, 1],
  );

  /*
   * =========================================
   * EXIT PROGRESS
   * =========================================
   *
   * This now finishes at 0.86 rather than 1.
   * Therefore the screen is already white before
   * the sticky section releases.
   */

  const exitProgress = useTransform(
    smoothScrollProgress,
    [EXIT_START, EXIT_END],
    [0, 1],
  );

  /*
   * =========================================
   * NUMBER CAMERA ZOOM
   * =========================================
   */

  const numberScale = useTransform(
    exitProgress,
    [0, 0.035, 0.08, 0.14, 0.22, 0.34, 0.48, 0.62, 0.74, 0.84, 0.92, 1],
    [1, 1.012, 1.035, 1.09, 1.2, 1.46, 2.0, 3.1, 4.9, 7.8, 13, 30],
  );

  /*
   * =========================================
   * NUMBER MICRO MOVEMENT
   * =========================================
   */

  const numberY = useTransform(
    exitProgress,
    [0, 0.35, 0.58, 0.78, 1],
    [0, 0, -0.3, -0.8, -1.2],
  );

  /*
   * =========================================
   * VECTOR VIEWBOX ZOOM
   * =========================================
   */

  const numberViewBox = useTransform(numberScale, (scale) => {
    const safeScale = Math.max(Number(scale) || 1, 1);

    const width = 100 / safeScale;

    const height = 100 / safeScale;

    return `${NUMBER_FOCAL_X - width / 2} ${
      NUMBER_FOCAL_Y - height / 2
    } ${width} ${height}`;
  });

  /*
   * =========================================
   * SUFFIX SCALE
   * =========================================
   */

  const suffixScale = useTransform(
    exitProgress,
    [0, 0.15, 0.3, 0.5, 0.7, 1],
    [1, 1.02, 1.05, 1.12, 1.2, 1.35],
  );

  /*
   * =========================================
   * FINAL WHITE CAMERA OUT
   * =========================================
   *
   * The white layer reaches full opacity
   * before EXIT_END finishes, giving the next
   * component no opportunity to peek through.
   */

  const whiteCameraOpacity = useTransform(
    exitProgress,
    [0.62, 0.72, 0.82, 0.92, 1],
    [0, 0.12, 0.45, 0.82, 1],
  );

  /*
   * =========================================
   * COUNTERS
   * =========================================
   */

  const currentNumber = String(activeIndex + 1).padStart(2, "0");

  const totalNumber = String(stats.length).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      className="
        relative
        min-h-[800vh]
        w-full
        bg-[#080907]
      "
    >
      {/* =====================================
          STICKY 100VH VIEWPORT
      ===================================== */}

      <div
        className="
          sticky
          top-0
          h-[100dvh]
          min-h-[620px]
          w-full
          overflow-hidden
          bg-[#080907]
        "
      >
        {/* =====================================
            GOLDEN BACKGROUND DOTS
        ===================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-0
            overflow-hidden
          "
        >
          <GoldDot
            left="7%"
            top="17%"
            size={5}
            duration={3.6}
            delay={0}
            opacity={[0.12, 0.5, 0.12]}
            scale={[0.75, 1.35, 0.75]}
          />

          <GoldDot
            left="16%"
            top="72%"
            size={4}
            duration={4.2}
            delay={0.8}
            opacity={[0.1, 0.42, 0.1]}
            scale={[0.7, 1.25, 0.7]}
          />

          <GoldDot
            left="27%"
            top="25%"
            size={6}
            duration={3.9}
            delay={1.4}
            opacity={[0.1, 0.48, 0.1]}
            scale={[0.75, 1.4, 0.75]}
          />

          <GoldDot
            left="38%"
            top="82%"
            size={4}
            duration={4.5}
            delay={0.5}
            opacity={[0.08, 0.4, 0.08]}
            scale={[0.7, 1.3, 0.7]}
          />

          <GoldDot
            left="49%"
            top="13%"
            size={5}
            duration={3.5}
            delay={1.8}
            opacity={[0.12, 0.52, 0.12]}
            scale={[0.8, 1.4, 0.8]}
          />

          <GoldDot
            left="61%"
            top="76%"
            size={6}
            duration={4.1}
            delay={0.7}
            opacity={[0.1, 0.46, 0.1]}
            scale={[0.75, 1.35, 0.75]}
          />

          <GoldDot
            left="72%"
            top="23%"
            size={4}
            duration={3.8}
            delay={2}
            opacity={[0.1, 0.45, 0.1]}
            scale={[0.7, 1.3, 0.7]}
          />

          <GoldDot
            left="83%"
            top="65%"
            size={6}
            duration={4.4}
            delay={1.1}
            opacity={[0.1, 0.5, 0.1]}
            scale={[0.75, 1.4, 0.75]}
          />

          <GoldDot
            left="93%"
            top="36%"
            size={4}
            duration={3.7}
            delay={2.4}
            opacity={[0.08, 0.42, 0.08]}
            scale={[0.7, 1.25, 0.7]}
          />

          <GoldDot
            left="11%"
            top="44%"
            size={3}
            duration={4.6}
            delay={1.6}
            opacity={[0.08, 0.38, 0.08]}
            scale={[0.7, 1.2, 0.7]}
          />

          <GoldDot
            left="89%"
            top="86%"
            size={5}
            duration={4}
            delay={0.3}
            opacity={[0.1, 0.45, 0.1]}
            scale={[0.75, 1.35, 0.75]}
          />
        </div>

        {/* =====================================
            CENTER LINE
        ===================================== */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-1/2
            top-0
            z-[1]
            w-px
            -translate-x-1/2
            bg-[#292722]/40
          "
        />

        {/* =====================================
            FINAL WHITE CAMERA OUT
        ===================================== */}

        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-[60]
            bg-white
          "
          style={{
            opacity: whiteCameraOpacity,
          }}
        />

        {/* =====================================
            TOP FRAME
        ===================================== */}

        <div
          className="
            pointer-events-none
            absolute
            left-5
            right-5
            top-6
            z-40
            flex
            items-center
            justify-between
            sm:left-8
            sm:right-8
            lg:left-12
            lg:right-12
          "
        >
          <span
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.26em]
              text-[#68665F]
            "
          >
            Being IBAN Digital
          </span>

          <span
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.26em]
              text-[#68665F]
            "
          >
            Impact / Scale
          </span>
        </div>

        {/* =====================================
            MAIN CONTENT
        ===================================== */}

        <motion.div
          style={{
            y: contentY,
            scale: contentScale,
          }}
          className="
            absolute
            inset-0
            z-10
            flex
            w-full
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          {/* ===================================
              EYEBROW
          =================================== */}

          <div
            className="
              absolute
              left-1/2
              top-[11%]
              flex
              -translate-x-1/2
              items-center
              justify-center
              gap-4
              sm:gap-5
            "
          >
            <span
              className="
                h-px
                w-9
                bg-[#C9A66B]
                sm:w-12
              "
            />

            <span
              className="
                whitespace-nowrap
                text-[10px]
                font-medium
                uppercase
                tracking-[0.32em]
                text-[#C9A66B]
                sm:text-[11px]
              "
            >
              The Numbers
            </span>

            <span
              className="
                h-px
                w-9
                bg-[#C9A66B]
                sm:w-12
              "
            />
          </div>

          {/* ===================================
              STAT AREA
          =================================== */}

          {loading ? (
            <div
              className="
                flex
                h-[100dvh]
                w-full
                items-center
                justify-center
              "
            >
              <div
                className="
                  h-px
                  w-20
                  bg-[#C9A66B]
                "
              />
            </div>
          ) : stats.length > 0 ? (
            <div
              className="
                relative
                h-[100dvh]
                w-full
                overflow-hidden
              "
            >
              {/* =================================
                  STAT CROSSFADE TRACK
              ================================= */}

              <div
                className="
                  absolute
                  inset-0
                "
              >
                {stats.map((stat, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <motion.div
                      key={stat._id || stat.id || index}
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : index < activeIndex ? "-5vh" : "5vh",
                        scale: isActive ? 1 : 0.985,
                      }}
                      transition={{
                        opacity: {
                          duration: 1.25,
                          ease: [0.16, 1, 0.3, 1],
                        },
                        y: {
                          duration: 1.4,
                          ease: [0.16, 1, 0.3, 1],
                        },
                        scale: {
                          duration: 1.4,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      }}
                      className="
                        absolute
                        inset-0
                        flex
                        h-full
                        w-full
                        flex-col
                        items-center
                        justify-center
                      "
                      style={{
                        visibility: isActive ? "visible" : "hidden",
                        pointerEvents: isActive ? "auto" : "none",
                        willChange: "transform, opacity",
                      }}
                    >
                      {/* =========================
                          STAT CONTENT
                      ========================= */}

                      <div
                        className="
                          relative
                          z-10
                          flex
                          flex-col
                          items-center
                          justify-center
                        "
                      >
                        {/* =================================
                              NUMBER + SUFFIX
                        ================================= */}

                        <div
                          className="
                            relative
                            flex
                            items-center
                            justify-center
                            whitespace-nowrap
                          "
                        >
                          {/* =================================
                                ORIGINAL NUMBER
                          ================================= */}

                          <motion.div
                            className="
                              pointer-events-none
                              relative
                              z-50
                              h-[clamp(220px,52vh,520px)]
                              w-[clamp(240px,42vw,560px)]
                              overflow-visible
                              isolate
                            "
                            style={
                              isActive
                                ? {
                                    x: 0,
                                    y: numberY,
                                  }
                                : undefined
                            }
                          >
                            <motion.svg
                              viewBox={numberViewBox}
                              preserveAspectRatio="xMidYMid meet"
                              className="
                                h-full
                                w-full
                                overflow-visible
                              "
                              style={{
                                transform: "none",
                              }}
                              aria-hidden="true"
                            >
                              <text
                                x={NUMBER_FOCAL_X}
                                y={NUMBER_FOCAL_Y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill="#F5F3EE"
                                fontFamily='"Google Sans Flex", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                                fontSize="52"
                                fontWeight="500"
                                letterSpacing="-2"
                                style={{
                                  shapeRendering: "geometricPrecision",
                                  textRendering: "geometricPrecision",
                                }}
                              >
                                {String(stat.value)}
                              </text>
                            </motion.svg>
                          </motion.div>

                          {/* =================================
                                SUFFIX
                          ================================= */}

                          {stat.suffix && (
                            <motion.span
                              style={
                                isActive
                                  ? {
                                      scale: suffixScale,
                                      y: "-50%",
                                      transformOrigin: "left center",
                                    }
                                  : undefined
                              }
                              className="
                                pointer-events-none
                                absolute
                                left-full
                                top-1/2
                                z-20
                                ml-2
                                font-display
                                text-[clamp(48px,8vw,105px)]
                                font-medium
                                leading-none
                                tracking-[-0.06em]
                                text-[#C9A66B]
                                sm:ml-5
                              "
                            >
                              {stat.suffix}
                            </motion.span>
                          )}
                        </div>

                        {/* =================================
                              DESCRIPTION
                        ================================= */}

                        <p
                          className="
                            relative
                            z-20
                            m-0
                            mt-10
                            max-w-[760px]
                            px-5
                            text-center
                            text-[11px]
                            font-medium
                            uppercase
                            leading-[1.8]
                            tracking-[0.28em]
                            text-[#A7A39B]
                            sm:mt-12
                            sm:text-xs
                            lg:text-sm
                          "
                        >
                          {stat.label}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              className="
                flex
                h-[100dvh]
                items-center
                justify-center
              "
            >
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.26em]
                  text-[#68665F]
                "
              >
                No statistics available
              </p>
            </div>
          )}

          {/* ===================================
              BOTTOM COUNTER
          =================================== */}

          {stats.length > 1 && (
            <div
              className="
                absolute
                bottom-[12%]
                left-1/2
                flex
                -translate-x-1/2
                items-center
                gap-4
                sm:gap-5
              "
            >
              <span
                className="
                  font-display
                  text-xl
                  font-medium
                  tracking-[-0.04em]
                  text-[#C9A66B]
                  sm:text-2xl
                "
              >
                {currentNumber}
              </span>

              <span
                className="
                  h-px
                  w-10
                  bg-[#292722]
                  sm:w-14
                "
              />

              <span
                className="
                  font-display
                  text-xl
                  font-medium
                  tracking-[-0.04em]
                  text-[#68665F]
                  sm:text-2xl
                "
              >
                {totalNumber}
              </span>
            </div>
          )}
        </motion.div>

        {/* =====================================
            RIGHT SIDE INDEX
        ===================================== */}

        {stats.length > 1 && (
          <div
            className="
              absolute
              right-8
              top-1/2
              z-40
              hidden
              -translate-y-1/2
              flex-col
              items-end
              gap-5
              md:flex
              lg:right-12
            "
          >
            {stats.map((stat, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={stat._id || stat.id || index}
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      text-[9px]
                      font-medium
                      tracking-[0.2em]
                      text-[#C9A66B]
                    "
                    style={{
                      opacity: isActive ? 1 : 0.25,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className="
                      h-px
                      bg-[#C9A66B]
                      transition-all
                      duration-700
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                    "
                    style={{
                      width: isActive ? 26 : 7,
                      opacity: isActive ? 1 : 0.2,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* =====================================
            BOTTOM FRAME
        ===================================== */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-6
            left-5
            right-5
            z-40
            hidden
            items-center
            justify-between
            sm:flex
            sm:left-8
            sm:right-8
            lg:left-12
            lg:right-12
          "
        >
          <span
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-[#4F4D48]
            "
          >
            Results that speak
          </span>

          <span
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-[#4F4D48]
            "
          >
            Scroll / 01—{totalNumber}
          </span>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
