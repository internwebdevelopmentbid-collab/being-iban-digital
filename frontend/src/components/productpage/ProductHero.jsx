import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";

import HeroAmbientIcons from "./HeroAmbientIcons";

const ProductHero = () => {
  const graphRef = useRef(null);

  const [isGraphHovered, setIsGraphHovered] = useState(false);

  const [graphPoint, setGraphPoint] = useState({
    x: 0,
    y: 73 * 2.25,
    value: 72,
    change: 8.4,
    direction: "up",
  });

  const cursorX = useMotionValue(0);

  const cursorXSpring = useSpring(cursorX, {
    stiffness: 220,
    damping: 28,
    mass: 0.5,
  });

  const graphData = useMemo(
    () => [
      {
        x: 0,
        y: 73,
        value: 61,
        change: -2.4,
      },
      {
        x: 12,
        y: 65,
        value: 64,
        change: 3.1,
      },
      {
        x: 24,
        y: 69,
        value: 68,
        change: 5.2,
      },
      {
        x: 36,
        y: 52,
        value: 73,
        change: 8.4,
      },
      {
        x: 48,
        y: 58,
        value: 70,
        change: -3.8,
      },
      {
        x: 60,
        y: 43,
        value: 78,
        change: 11.2,
      },
      {
        x: 72,
        y: 48,
        value: 81,
        change: 6.7,
      },
      {
        x: 84,
        y: 31,
        value: 89,
        change: 14.8,
      },
      {
        x: 100,
        y: 21,
        value: 96,
        change: 18.6,
      },
    ],
    [],
  );

  const svgWidth = 560;
  const svgHeight = 280;

  const points = useMemo(() => {
    return graphData.map((point) => ({
      ...point,
      px: (point.x / 100) * svgWidth,
      py: point.y * 2.25,
    }));
  }, [graphData]);

  const linePath = useMemo(() => {
    return points
      .map(
        (point, index) => `${index === 0 ? "M" : "L"} ${point.px} ${point.py}`,
      )
      .join(" ");
  }, [points]);

  const areaPath = useMemo(() => {
    if (!points.length) return "";

    const first = points[0];
    const last = points[points.length - 1];

    return `
      ${linePath}
      L ${last.px} ${svgHeight}
      L ${first.px} ${svgHeight}
      Z
    `;
  }, [linePath, points]);

  const updateGraphFromClientX = (clientX) => {
    if (!graphRef.current) return;

    const rect = graphRef.current.getBoundingClientRect();

    if (!rect.width) return;

    const relativeX = clientX - rect.left;

    const percentage = Math.max(0, Math.min(1, relativeX / rect.width));

    cursorX.set(percentage);

    const graphPosition = percentage * 100;

    let closestPoint = graphData[0];

    graphData.forEach((point) => {
      if (
        Math.abs(point.x - graphPosition) <
        Math.abs(closestPoint.x - graphPosition)
      ) {
        closestPoint = point;
      }
    });

    const closestIndex = graphData.indexOf(closestPoint);

    const nextPoint =
      graphData[Math.min(closestIndex + 1, graphData.length - 1)];

    const interpolationRange = nextPoint.x - closestPoint.x;

    const localProgress =
      interpolationRange === 0
        ? 0
        : Math.max(
            0,
            Math.min(1, (graphPosition - closestPoint.x) / interpolationRange),
          );

    const interpolatedY =
      closestPoint.y + (nextPoint.y - closestPoint.y) * localProgress;

    const interpolatedValue =
      closestPoint.value +
      (nextPoint.value - closestPoint.value) * localProgress;

    const interpolatedChange =
      closestPoint.change +
      (nextPoint.change - closestPoint.change) * localProgress;

    const graphX = (graphPosition / 100) * svgWidth;

    setGraphPoint({
      x: graphX,
      y: interpolatedY * 2.25,
      value: Math.round(interpolatedValue),
      change: Math.round(interpolatedChange * 10) / 10,
      direction: interpolatedChange >= 0 ? "up" : "down",
    });
  };

  const handleGraphMove = (event) => {
    updateGraphFromClientX(event.clientX);
  };

  const handleGraphPointerDown = (event) => {
    setIsGraphHovered(true);

    updateGraphFromClientX(event.clientX);

    if (event.currentTarget?.setPointerCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Ignore pointer-capture errors.
      }
    }
  };

  const handleGraphPointerMove = (event) => {
    if (event.pointerType === "touch") {
      updateGraphFromClientX(event.clientX);
      return;
    }

    updateGraphFromClientX(event.clientX);
  };

  const handleGraphEnter = () => {
    setIsGraphHovered(true);
  };

  const handleGraphLeave = () => {
    setIsGraphHovered(false);

    cursorX.set(0);

    setGraphPoint({
      x: 0,
      y: 73 * 2.25,
      value: 72,
      change: 8.4,
      direction: "up",
    });
  };

  const handleGraphPointerUp = (event) => {
    if (event.pointerType === "touch") {
      try {
        if (event.currentTarget?.hasPointerCapture?.(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      } catch {
        // Ignore pointer-capture errors.
      }
    }
  };

  const isPositive = graphPoint.direction === "up";

  return (
    <section
      className="
        relative
        flex
        min-h-screen
        items-center
        overflow-hidden
        bg-[#080907]
        text-[#f5f3ee]

        max-[1023px]:min-h-[1050px]
        max-[650px]:min-h-[980px]
      "
    >
      {/* ================================================================
          SECTION-SPECIFIC AMBIENT ICONS
      ================================================================ */}

      <HeroAmbientIcons />

      {/* ================================================================
          AMBIENT BACKGROUND
      ================================================================ */}

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
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[620px]
            w-[620px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#c9a66b]/[0.025]
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            left-[13%]
            top-0
            h-full
            w-px
            bg-[#c9a66b]/[0.035]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-0
            h-full
            w-px
            bg-[#c9a66b]/[0.025]
          "
        />

        <div
          className="
            absolute
            right-[13%]
            top-0
            h-full
            w-px
            bg-[#c9a66b]/[0.035]
          "
        />
      </div>

      {/* ================================================================
          MAIN HERO CONTAINER
      ================================================================ */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-[calc(100%-44px)]
          max-w-[1400px]
          flex-col
          justify-center
          py-[90px]

          sm:w-[calc(100%-80px)]
          sm:py-[110px]

          lg:py-[150px]
        "
      >
        {/* ==============================================================
            EYEBROW
        ============================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            flex
            items-center
            gap-[13px]
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.32em]
            text-[#c9a66b]
          "
        >
          <span className="h-px w-[34px] bg-[#c9a66b]" />

          <span>Services &amp; Solutions</span>
        </motion.div>

        {/* ==============================================================
            TITLE
        ============================================================== */}

        <div
          className="
            mt-[32px]
            max-w-[1180px]
          "
        >
          <motion.h1
            initial={{
              opacity: 0,
              y: 45,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1.05,
              delay: 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              font-display
              text-[clamp(58px,9vw,138px)]
              font-normal
              leading-[0.84]
              tracking-[-0.07em]
              text-[#f5f3ee]

              max-[650px]:text-[clamp(52px,14vw,82px)]
            "
          >
            Digital systems
            <br />
            <span className="text-[#c9a66b]">built to move.</span>
          </motion.h1>
        </div>

        {/* ==============================================================
            DESCRIPTION + META
        ============================================================== */}

        <div
          className="
            mt-[55px]
            grid
            grid-cols-1
            gap-[30px]

            lg:grid-cols-[1fr_0.7fr]
            lg:items-end
            lg:gap-[100px]
          "
        >
          <motion.p
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              max-w-[620px]
              text-[13px]
              font-light
              leading-[1.85]
              text-[#8e8a82]

              sm:text-[14px]
            "
          >
            From building your digital foundation to scaling an established
            presence, we create focused systems across strategy, creative,
            technology and growth.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.42,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              flex
              items-end
              justify-between
              border-t
              border-[#292722]
              pt-[17px]

              lg:justify-end
              lg:gap-[50px]
            "
          >
            <span
              className="
                text-[7px]
                uppercase
                tracking-[0.28em]
                text-[#555149]
              "
            >
              Strategy
            </span>

            <span
              className="
                text-[7px]
                uppercase
                tracking-[0.28em]
                text-[#555149]
              "
            >
              Design
            </span>

            <span
              className="
                text-[7px]
                uppercase
                tracking-[0.28em]
                text-[#555149]
              "
            >
              Growth
            </span>
          </motion.div>
        </div>

        {/* ================================================================
            INTERACTIVE GRAPH
        ================================================================ */}

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.48,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            pointer-events-auto
            relative
            z-20
            mt-[55px]
            w-full
            max-w-[560px]
            self-center

            lg:absolute
            lg:right-[2%]
            lg:top-[50%]
            lg:mt-0
            lg:w-[360px]
            lg:max-w-none
            lg:-translate-y-[40%]

            xl:right-[1%]
            xl:w-[430px]
            xl:-translate-y-[42%]

            2xl:right-0
            2xl:w-[470px]
          "
        >
          {/* ============================================================
              GRAPH AMBIENT GLOW
          ============================================================ */}

          <motion.div
            animate={{
              backgroundColor: !isGraphHovered
                ? "rgba(201,166,107,0.08)"
                : isPositive
                  ? "rgba(80,190,115,0.10)"
                  : "rgba(210,75,75,0.10)",
              scale: isGraphHovered ? 1.12 : 1,
            }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[320px]
              w-[320px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              blur-[100px]
            "
          />

          {/* ============================================================
              GRAPH HEADER
          ============================================================ */}

          <div
            className="
              relative
              z-20
              mb-[18px]
              flex
              items-end
              justify-between
            "
          >
            <div>
              <div
                className="
                  text-[7px]
                  uppercase
                  tracking-[0.28em]
                  text-[#555149]
                "
              >
                Digital performance
              </div>

              <div
                className="
                  mt-[7px]
                  flex
                  items-baseline
                  gap-[8px]
                "
              >
                <motion.span
                  key={graphPoint.value}
                  initial={{
                    opacity: 0,
                    y: 7,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.22,
                  }}
                  className="
                    font-display
                    text-[32px]
                    leading-none
                    tracking-[-0.055em]
                    text-[#f5f3ee]

                    sm:text-[36px]
                    lg:text-[38px]
                  "
                >
                  {graphPoint.value}
                </motion.span>

                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.16em]
                    text-[#555149]
                  "
                >
                  index
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${graphPoint.direction}-${graphPoint.change}`}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.22,
                }}
                className={`
                  flex
                  items-center
                  gap-[7px]
                  text-[8px]
                  font-semibold
                  tracking-[0.12em]

                  ${
                    !isGraphHovered
                      ? "text-[#c9a66b]"
                      : isPositive
                        ? "text-[#62c786]"
                        : "text-[#d96d6d]"
                  }
                `}
              >
                <motion.span
                  animate={{
                    rotate: isPositive ? 0 : 180,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                >
                  ↗
                </motion.span>
                {isPositive ? "+" : ""}
                {graphPoint.change}%
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ============================================================
              GRAPH AREA
          ============================================================ */}

          <div
            ref={graphRef}
            onMouseEnter={handleGraphEnter}
            onMouseMove={handleGraphMove}
            onMouseLeave={handleGraphLeave}
            onPointerDown={handleGraphPointerDown}
            onPointerMove={handleGraphPointerMove}
            onPointerUp={handleGraphPointerUp}
            onPointerCancel={handleGraphPointerUp}
            className="
              group
              relative
              h-[185px]
              w-full
              cursor-crosshair
              select-none
              touch-none

              sm:h-[205px]
              lg:h-[220px]
            "
          >
            {/* ==========================================================
                GRID
            ========================================================== */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-40
              "
            >
              <span
                className="
                  absolute
                  left-0
                  right-0
                  top-[20%]
                  h-px
                  bg-[#292722]
                "
              />

              <span
                className="
                  absolute
                  left-0
                  right-0
                  top-[40%]
                  h-px
                  bg-[#292722]
                "
              />

              <span
                className="
                  absolute
                  left-0
                  right-0
                  top-[60%]
                  h-px
                  bg-[#292722]
                "
              />

              <span
                className="
                  absolute
                  left-0
                  right-0
                  top-[80%]
                  h-px
                  bg-[#292722]
                "
              />

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  top-0
                  w-px
                  bg-[#292722]/60
                "
              />

              <span
                className="
                  absolute
                  bottom-0
                  right-0
                  top-0
                  w-px
                  bg-[#292722]/60
                "
              />
            </div>

            {/* ==========================================================
                SVG GRAPH
            ========================================================== */}

            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              className="
                relative
                z-10
                h-full
                w-full
                overflow-visible
              "
            >
              <defs>
                <linearGradient id="heroGraphArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a66b" stopOpacity="0.16" />

                  <stop offset="100%" stopColor="#c9a66b" stopOpacity="0" />
                </linearGradient>

                <filter
                  id="heroGraphGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="5" result="blur" />

                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* ========================================================
                  AREA
              ======================================================== */}

              <motion.path
                d={areaPath}
                fill="url(#heroGraphArea)"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 1.4,
                  delay: 0.8,
                }}
              />

              {/* ========================================================
                  MAIN LINE
              ======================================================== */}

              <motion.path
                d={linePath}
                fill="none"
                stroke={
                  !isGraphHovered
                    ? "#c9a66b"
                    : isPositive
                      ? "#62c786"
                      : "#d96d6d"
                }
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#heroGraphGlow)"
                initial={{
                  pathLength: 0,
                  opacity: 0,
                }}
                animate={{
                  pathLength: 1,
                  opacity: 1,
                }}
                transition={{
                  pathLength: {
                    duration: 1.7,
                    delay: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  opacity: {
                    duration: 0.5,
                    delay: 0.5,
                  },
                }}
              />

              {/* ========================================================
                  DATA POINTS
              ======================================================== */}

              {points.map((point, index) => (
                <motion.circle
                  key={index}
                  cx={point.px}
                  cy={point.py}
                  r="2.2"
                  fill="#c9a66b"
                  initial={{
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: 0.65,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.65 + index * 0.08,
                    duration: 0.4,
                  }}
                />
              ))}

              {/* ========================================================
                  CURSOR VERTICAL LINE
              ======================================================== */}

              <motion.line
                x1={graphPoint.x}
                x2={graphPoint.x}
                y1="0"
                y2={svgHeight}
                stroke={
                  !isGraphHovered
                    ? "#c9a66b"
                    : isPositive
                      ? "#62c786"
                      : "#d96d6d"
                }
                strokeWidth="1"
                strokeDasharray="3 6"
                vectorEffect="non-scaling-stroke"
                animate={{
                  opacity: isGraphHovered ? 0.55 : 0,
                }}
                transition={{
                  duration: 0.25,
                }}
              />

              {/* ========================================================
                  ACTIVE POINT
              ======================================================== */}

              <motion.circle
                cx={graphPoint.x}
                cy={graphPoint.y}
                fill={
                  !isGraphHovered
                    ? "#c9a66b"
                    : isPositive
                      ? "#62c786"
                      : "#d96d6d"
                }
                stroke="#080907"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                animate={{
                  r: isGraphHovered ? 5 : 0,
                }}
                transition={{
                  duration: 0.25,
                }}
              />

              {/* ========================================================
                  ACTIVE POINT PULSE
              ======================================================== */}

              <motion.circle
                cx={graphPoint.x}
                cy={graphPoint.y}
                fill="none"
                stroke={isPositive ? "#62c786" : "#d96d6d"}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                animate={{
                  r: isGraphHovered ? [7, 14, 7] : 0,
                  opacity: isGraphHovered ? [0.7, 0, 0.7] : 0,
                }}
                transition={{
                  duration: 1.7,
                  repeat: isGraphHovered ? Infinity : 0,
                  ease: "easeOut",
                }}
              />
            </svg>

            {/* ==========================================================
                CURSOR ANNOTATION
            ========================================================== */}

            <AnimatePresence>
              {isGraphHovered && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.92,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.92,
                    y: 8,
                  }}
                  transition={{
                    duration: 0.22,
                  }}
                  style={{
                    left: `${Math.max(
                      7,
                      Math.min(78, (graphPoint.x / svgWidth) * 100),
                    )}%`,
                    top: `${Math.max(
                      2,
                      Math.min(58, (graphPoint.y / svgHeight) * 100 - 18),
                    )}%`,
                  }}
                  className="
                    pointer-events-none
                    absolute
                    z-30
                    min-w-[105px]
                    -translate-x-1/2
                    rounded-[2px]
                    border
                    border-[#292722]
                    bg-[#080907]/95
                    px-[12px]
                    py-[10px]
                    shadow-[0_15px_50px_rgba(0,0,0,0.4)]

                    max-[550px]:min-w-[92px]
                    max-[550px]:px-[9px]
                    max-[550px]:py-[8px]
                  "
                >
                  <div
                    className="
                      text-[6px]
                      uppercase
                      tracking-[0.25em]
                      text-[#555149]
                    "
                  >
                    Current
                  </div>

                  <div
                    className="
                      mt-[4px]
                      flex
                      items-baseline
                      gap-[5px]
                    "
                  >
                    <motion.span
                      key={graphPoint.value}
                      initial={{
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="
                        font-display
                        text-[22px]
                        leading-none
                        tracking-[-0.04em]
                        text-[#f5f3ee]
                      "
                    >
                      {graphPoint.value}
                    </motion.span>

                    <span
                      className={`
                        text-[8px]
                        ${isPositive ? "text-[#62c786]" : "text-[#d96d6d]"}
                      `}
                    >
                      {isPositive ? "+" : ""}
                      {graphPoint.change}%
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ============================================================
              GRAPH FOOTER
          ============================================================ */}

          <div
            className="
              relative
              z-20
              mt-[15px]
              flex
              items-center
              justify-between
              border-t
              border-[#292722]
              pt-[13px]
            "
          >
            <span
              className="
                text-[6px]
                uppercase
                tracking-[0.28em]
                text-[#4f4b44]
              "
            >
              <span className="hidden sm:inline">Hover to explore</span>

              <span className="sm:hidden">Drag to explore</span>
            </span>

            <motion.span
              animate={{
                rotate: isGraphHovered ? 360 : 0,
                color: !isGraphHovered
                  ? "#c9a66b"
                  : isPositive
                    ? "#62c786"
                    : "#d96d6d",
              }}
              transition={{
                rotate: {
                  duration: 2.4,
                  repeat: isGraphHovered ? Infinity : 0,
                  ease: "linear",
                },
                color: {
                  duration: 0.5,
                },
              }}
              className="
                text-[17px]
                leading-none
              "
            >
              ↗
            </motion.span>
          </div>
        </motion.div>

        {/* ================================================================
            EXPLORE LABEL
        ================================================================ */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 1,
            delay: 0.8,
          }}
          className="
            mt-[65px]
            flex
            items-center
            gap-[13px]
            text-[7px]
            uppercase
            tracking-[0.3em]
            text-[#4f4b44]

            lg:mt-[85px]
          "
        >
          <span
            className="
              h-[34px]
              w-px
              bg-[#c9a66b]/40
            "
          />

          <span>Explore our solutions</span>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductHero;
