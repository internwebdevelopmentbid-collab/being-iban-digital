import { motion, useAnimationControls, useInView } from "framer-motion";

import { useEffect, useRef, useState } from "react";

import api_url from "../../config/api";

const STATS_ENDPOINT = `${api_url}/api/website/stats`;

const SLOT_CYCLES = 5;
const SLOT_DURATION = 2.4;
const SLOT_DELAY_STEP = 80;

const REEL_ANIMATION = {
  duration: SLOT_DURATION,
  ease: [0.12, 0.82, 0.16, 1],
};

const StatIcon = ({ type = "chart", left, top, size = 42, delay = 0 }) => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: `
      pointer-events-none
      absolute
      z-0
      text-[#C9A66B]
    `,
    style: {
      left,
      top,
    },
    "aria-hidden": true,
  };

  const iconAnimation = {
    opacity: [0.03, 0.15, 0.03],
    scale: [0.94, 1.06, 0.94],
    y: [0, -4, 0],
  };

  const iconTransition = {
    duration: 4.5,
    delay,
    repeat: Infinity,
    ease: "easeInOut",
  };

  if (type === "percent") {
    return (
      <motion.svg
        {...commonProps}
        animate={iconAnimation}
        transition={iconTransition}
      >
        <path
          d="M7 7L17 17"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.4" />

        <circle
          cx="17"
          cy="17"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </motion.svg>
    );
  }

  if (type === "growth") {
    return (
      <motion.svg
        {...commonProps}
        animate={iconAnimation}
        transition={iconTransition}
      >
        <path
          d="M4 17L10 11L14 15L20 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M15 8H20V13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    );
  }

  if (type === "bars") {
    return (
      <motion.svg
        {...commonProps}
        animate={iconAnimation}
        transition={iconTransition}
      >
        <path
          d="M5 19V11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <path
          d="M12 19V6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <path
          d="M19 19V3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </motion.svg>
    );
  }

  if (type === "target") {
    return (
      <motion.svg
        {...commonProps}
        animate={iconAnimation}
        transition={iconTransition}
      >
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.4" />

        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />

        <path
          d="M12 2V5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        <path
          d="M12 19V22"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        <path
          d="M2 12H5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        <path
          d="M19 12H22"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </motion.svg>
    );
  }

  return (
    <motion.svg
      {...commonProps}
      animate={iconAnimation}
      transition={iconTransition}
    >
      <path
        d="M4 19V5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M4 19H20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M7 15L11 11L14 13L19 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
};

const SlotDigit = ({ digit, index }) => {
  const containerRef = useRef(null);

  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.5,
  });

  const controls = useAnimationControls();

  const finalDigit = Number(digit);
  const targetIndex = SLOT_CYCLES * 10 + finalDigit;

  const reelDigits = Array.from(
    {
      length: targetIndex + 10,
    },
    (_, i) => i % 10,
  );

  useEffect(() => {
    if (!isInView) {
      return;
    }

    let cancelled = false;
    let timeoutId = null;

    const animateReel = async () => {
      controls.set({
        y: 0,
      });

      await new Promise((resolve) => {
        timeoutId = window.setTimeout(resolve, index * SLOT_DELAY_STEP);
      });

      if (cancelled) {
        return;
      }

      await controls.start({
        y: `-${targetIndex}em`,
        transition: REEL_ANIMATION,
      });
    };

    animateReel();

    return () => {
      cancelled = true;

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isInView, controls, targetIndex, index]);

  return (
    <span
      ref={containerRef}
      className="
        relative
        inline-block
        h-[1em]
        overflow-hidden
        align-baseline
      "
      style={{
        minWidth: "0.58em",
      }}
    >
      <motion.span
        animate={controls}
        initial={{
          y: 0,
        }}
        className="
          flex
          flex-col
          will-change-transform
        "
      >
        {reelDigits.map((number, reelIndex) => (
          <span
            key={`${reelIndex}-${number}`}
            className="
              flex
              h-[1em]
              shrink-0
              items-center
              justify-center
            "
          >
            {number}
          </span>
        ))}
      </motion.span>
    </span>
  );
};

const SlotNumber = ({ value }) => {
  const characters = String(value ?? "").split("");

  return (
    <span
      className="
        inline-flex
        items-center
        justify-center
        font-display
        text-[clamp(70px,10vw,150px)]
        font-medium
        leading-none
        tracking-[-0.08em]
      "
    >
      {characters.map((character, index) => {
        if (!/\d/.test(character)) {
          return (
            <span key={`${character}-${index}`} className="inline-block">
              {character}
            </span>
          );
        }

        return (
          <SlotDigit
            key={`${character}-${index}`}
            digit={character}
            index={index}
          />
        );
      })}
    </span>
  );
};

const StatCard = ({ stat }) => {
  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      variants={{
        rest: {
          y: 0,
        },
        hover: {
          y: -8,
        },
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        group
        relative
        isolate
        flex
        min-h-[340px]
        w-full
        flex-col
        items-center
        justify-center
        overflow-hidden
        rounded-[28px]
        border
        border-white/[0.12]
        bg-white/[0.045]
        px-6
        py-10
        text-center
        backdrop-blur-[24px]
        backdrop-saturate-[150%]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_20px_70px_rgba(0,0,0,0.22)]
        transition-[border-color,background-color,box-shadow]
        duration-500
        hover:border-[#C9A66B]/45
        hover:bg-white/[0.065]
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_50px_rgba(201,166,107,0.17),0_30px_90px_rgba(0,0,0,0.35)]
        touch-manipulation
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/25
          to-transparent
        "
      />

      <motion.div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          -z-10
          h-40
          w-40
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#C9A66B]/[0.025]
          blur-3xl
        "
        variants={{
          rest: {
            scale: 1,
            opacity: 0.4,
          },
          hover: {
            scale: 1.8,
            opacity: 1,
          },
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <motion.div
        className="
          relative
          z-10
          flex
          origin-center
          items-center
          justify-center
          whitespace-nowrap
        "
        variants={{
          rest: {
            scale: 1,
            rotate: 0,
            color: "#F5F3EE",
          },
          hover: {
            scale: 1.1,
            rotate: -4,
            color: "#C9A66B",
          },
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <SlotNumber value={stat.value} />

        {stat.suffix && (
          <motion.span
            className="
              relative
              -top-[0.65em]
              ml-2
              font-display
              text-[clamp(20px,3vw,38px)]
              font-medium
              leading-none
              tracking-[-0.04em]
            "
            variants={{
              rest: {
                color: "#F5F3EE",
              },
              hover: {
                color: "#C9A66B",
              },
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {stat.suffix}
          </motion.span>
        )}
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="
          relative
          z-10
          mt-9
          h-px
          bg-[#C9A66B]/40
        "
        variants={{
          rest: {
            width: 48,
            opacity: 0.6,
          },
          hover: {
            width: 80,
            opacity: 1,
          },
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <motion.p
        className="
          relative
          z-10
          m-0
          mt-7
          max-w-[520px]
          px-4
          text-center
          text-[11px]
          font-medium
          uppercase
          leading-[1.8]
          tracking-[0.25em]
          sm:text-xs
          lg:text-sm
        "
        variants={{
          rest: {
            color: "#A7A39B",
          },
          hover: {
            color: "#D0CCC4",
          },
        }}
        transition={{
          duration: 0.5,
        }}
      >
        {stat.label}
      </motion.p>

      <motion.div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-px
          -translate-x-1/2
          bg-[#C9A66B]
          shadow-[0_0_18px_rgba(201,166,107,0.8)]
        "
        variants={{
          rest: {
            width: 0,
          },
          hover: {
            width: "50%",
          },
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </motion.article>
  );
};

const StatsSection = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStats = async () => {
      try {
        const response = await fetch(STATS_ENDPOINT, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Unable to load statistics: ${response.status}`);
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

        if (!controller.signal.aborted) {
          setStats(nextStats);
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Stats fetch error:", error);
        }

        if (!controller.signal.aborted) {
          setStats([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#080907]
        px-5
        py-24
        sm:px-8
        sm:py-32
        lg:px-12
        lg:py-40
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <motion.div
          className="
            absolute
            left-1/2
            top-1/2
            h-[420px]
            w-[420px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#C9A66B]/[0.035]
            blur-[120px]
          "
          animate={{
            opacity: [0.5, 0.85, 0.5],
            scale: [0.95, 1.08, 0.95],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <StatIcon type="chart" left="8%" top="25%" size={42} />

        <StatIcon type="growth" left="87%" top="17%" size={48} delay={1} />

        <StatIcon type="bars" left="6%" top="82%" size={44} delay={1.8} />

        <StatIcon type="percent" left="91%" top="73%" size={40} delay={2.4} />

        <StatIcon type="target" left="48%" top="7%" size={34} delay={0.8} />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1400px]
        "
      >
        <div
          className="
            mb-16
            flex
            items-center
            justify-center
            gap-4
            sm:mb-20
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

        {loading ? (
          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
            "
          >
            <motion.div
              animate={{
                scaleX: [0.65, 1, 0.65],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                h-px
                w-20
                origin-center
                bg-[#C9A66B]
                shadow-[0_0_14px_rgba(201,166,107,0.7)]
              "
            />
          </div>
        ) : stats.length > 0 ? (
          <>
            <div
              className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
                sm:gap-6
                lg:grid-cols-3
                lg:gap-7
              "
            >
              {stats.map((stat, index) => (
                <StatCard
                  key={
                    stat?._id || stat?.id || `${stat?.label || "stat"}-${index}`
                  }
                  stat={stat}
                />
              ))}
            </div>

            <div
              className="
                mt-14
                flex
                items-center
                justify-center
                gap-4
                sm:mt-20
                sm:gap-5
              "
            >
              <span
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.24em]
                  text-[#68665F]
                "
              >
                Results that speak
              </span>
            </div>
          </>
        ) : (
          <div
            className="
              flex
              min-h-[300px]
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
      </div>
    </section>
  );
};

export default StatsSection;
