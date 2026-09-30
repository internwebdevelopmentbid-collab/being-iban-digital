import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api_url from "../../config/api";

const fallbackCapabilities = [
  {
    _id: "fallback-1",
    title: "React",
    icon: "",
    line1: true,
    line2: false,
  },
  {
    _id: "fallback-2",
    title: "Node.js",
    icon: "",
    line1: true,
    line2: false,
  },
  {
    _id: "fallback-3",
    title: "MongoDB",
    icon: "",
    line1: true,
    line2: false,
  },
  {
    _id: "fallback-4",
    title: "Three.js",
    icon: "",
    line1: false,
    line2: true,
  },
  {
    _id: "fallback-5",
    title: "Framer Motion",
    icon: "",
    line1: false,
    line2: true,
  },
  {
    _id: "fallback-6",
    title: "Cloudinary",
    icon: "",
    line1: false,
    line2: true,
  },
];

const TechCapabilities = () => {
  const [capabilities, setCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | LOAD TECHNOLOGY CAPABILITIES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const loadCapabilities = async () => {
      try {
        const response = await fetch(`${api_url}/api/website/techCapabilities`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message || "Failed to fetch technology capabilities.",
          );
        }

        const data = Array.isArray(result)
          ? result
          : result?.data || result?.techCapabilities || [];

        if (mounted) {
          setCapabilities(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to load technology capabilities:", error);

        if (mounted) {
          setCapabilities([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCapabilities();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | NORMALIZE CAPABILITIES
  |--------------------------------------------------------------------------
  */

  const normalizedCapabilities = useMemo(() => {
    if (capabilities.length > 0) {
      return capabilities;
    }

    return loading ? [] : fallbackCapabilities;
  }, [capabilities, loading]);

  /*
  |--------------------------------------------------------------------------
  | LINE ONE
  |--------------------------------------------------------------------------
  */

  const lineOne = useMemo(
    () =>
      normalizedCapabilities.filter(
        (item) => item.line1 === true || item.line1 === "true",
      ),
    [normalizedCapabilities],
  );

  /*
  |--------------------------------------------------------------------------
  | LINE TWO
  |--------------------------------------------------------------------------
  */

  const lineTwo = useMemo(
    () =>
      normalizedCapabilities.filter(
        (item) => item.line2 === true || item.line2 === "true",
      ),
    [normalizedCapabilities],
  );

  /*
  |--------------------------------------------------------------------------
  | UNASSIGNED ITEMS
  |--------------------------------------------------------------------------
  |
  | If the database does not explicitly assign an item
  | to either line, keep it visible by placing it into
  | the first line.
  |
  */

  const unassigned = useMemo(
    () =>
      normalizedCapabilities.filter(
        (item) =>
          item.line1 !== true &&
          item.line1 !== "true" &&
          item.line2 !== true &&
          item.line2 !== "true",
      ),
    [normalizedCapabilities],
  );

  const primaryCapabilities = useMemo(
    () => [...lineOne, ...unassigned],
    [lineOne, unassigned],
  );

  const secondaryCapabilities = useMemo(() => lineTwo, [lineTwo]);

  if (!loading && normalizedCapabilities.length === 0) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | PULSING GOLDEN DOTS
  |--------------------------------------------------------------------------
  */

  const goldenDots = [
    {
      top: "9%",
      left: "12%",
      size: 3,
      delay: 0,
      duration: 3.8,
    },
    {
      top: "18%",
      left: "73%",
      size: 4,
      delay: 1.2,
      duration: 4.6,
    },
    {
      top: "31%",
      left: "35%",
      size: 2,
      delay: 0.6,
      duration: 3.4,
    },
    {
      top: "42%",
      left: "89%",
      size: 3,
      delay: 1.8,
      duration: 4.2,
    },
    {
      top: "55%",
      left: "17%",
      size: 4,
      delay: 0.9,
      duration: 4.8,
    },
    {
      top: "67%",
      left: "63%",
      size: 2,
      delay: 2.1,
      duration: 3.7,
    },
    {
      top: "78%",
      left: "31%",
      size: 3,
      delay: 0.3,
      duration: 4.5,
    },
    {
      top: "89%",
      left: "82%",
      size: 4,
      delay: 1.5,
      duration: 4,
    },
  ];

  return (
    <section
      id="technology"
      className="
        relative
        overflow-hidden
        bg-[#080907]
        py-24
        sm:py-28
        lg:py-36
      "
    >
      {/* =========================================================
          AMBIENT GOLDEN BACKGROUND
      ========================================================= */}

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
        {/* Central ambient glow */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[500px]
            w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#C9A66B]/[0.025]
            blur-[120px]
          "
        />

        {/* Golden pulsing particles */}

        {goldenDots.map((dot, index) => (
          <motion.span
            key={`golden-dot-${index}`}
            className="
              absolute
              rounded-full
              bg-[#C9A66B]
            "
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              boxShadow: "0 0 12px 3px rgba(201,166,107,0.55)",
            }}
            animate={{
              opacity: [0.15, 0.85, 0.25, 1, 0.15],
              scale: [0.65, 1.4, 0.75, 1.25, 0.65],
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

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <div className="mb-16 max-w-3xl sm:mb-20 lg:mb-24">
          <div className="mb-6 flex items-center gap-4">
            <span
              aria-hidden="true"
              className="
                h-px
                w-8
                bg-[#C9A66B]
                sm:w-12
              "
            />

            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.32em]
                text-[#A7A39B]
                sm:text-[11px]
              "
            >
              Technology
            </span>
          </div>

          <h2
            className="
              max-w-[850px]
              text-balance
              text-[clamp(42px,6vw,92px)]
              font-medium
              leading-[0.95]
              tracking-[-0.055em]
              text-[#F5F3EE]
            "
          >
            Built with the
            <br />
            <span className="text-[#C9A66B]">right technology.</span>
          </h2>

          <p
            className="
              mt-7
              max-w-[580px]
              text-sm
              leading-7
              tracking-[-0.01em]
              text-[#A7A39B]
              sm:mt-9
              sm:text-base
              sm:leading-8
            "
          >
            We combine modern technologies, platforms and digital capabilities
            to create fast, scalable and meaningful experiences.
          </p>
        </div>
      </div>

      {/* =========================================================
          TECHNOLOGY MARQUEE AREA
      ========================================================= */}

      <div className="relative z-10">
        {/* ---------------------------------------------------------
            LEFT EDGE FADE
        --------------------------------------------------------- */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-20
            w-16
            bg-gradient-to-r
            from-[#080907]
            to-transparent
            sm:w-28
            lg:w-52
          "
        />

        {/* ---------------------------------------------------------
            RIGHT EDGE FADE
        --------------------------------------------------------- */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-20
            w-16
            bg-gradient-to-l
            from-[#080907]
            to-transparent
            sm:w-28
            lg:w-52
          "
        />

        {/* =========================================================
            LINE ONE
        ========================================================= */}

        {primaryCapabilities.length > 0 && (
          <TechnologyMarquee
            items={primaryCapabilities}
            direction="left"
            duration={34}
          />
        )}

        {/* =========================================================
            LINE TWO
        ========================================================= */}

        {secondaryCapabilities.length > 0 && (
          <div className="mt-5 sm:mt-7 lg:mt-8">
            <TechnologyMarquee
              items={secondaryCapabilities}
              direction="right"
              duration={38}
            />
          </div>
        )}
      </div>

      {/* =========================================================
          LOWER META
      ========================================================= */}

      <div className="relative z-10 mx-auto mt-16 max-w-[1600px] px-6 sm:mt-20 sm:px-10 lg:mt-24 lg:px-16">
        <div className="flex items-center gap-5">
          <span
            aria-hidden="true"
            className="
              h-px
              flex-1
              bg-[#292722]
            "
          />

          <span
            className="
              whitespace-nowrap
              text-[9px]
              uppercase
              tracking-[0.28em]
              text-[#6F6B63]
              sm:text-[10px]
            "
          >
            Digital · Technology · Innovation
          </span>

          <span
            aria-hidden="true"
            className="
              h-px
              flex-1
              bg-[#292722]
            "
          />
        </div>
      </div>
    </section>
  );
};

/* ===============================================================
   TECHNOLOGY MARQUEE
================================================================ */

const TechnologyMarquee = ({ items, direction = "left", duration = 35 }) => {
  if (!items.length) {
    return null;
  }

  /*
   * Three copies provide enough physical width for the
   * marquee to remain seamless on very large screens.
   */

  const scrollingItems = [...items, ...items, ...items];

  const isRight = direction === "right";

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex w-max items-center"
        initial={{
          x: isRight ? "-33.333%" : "0%",
        }}
        animate={{
          x: isRight ? ["-33.333%", "0%"] : ["0%", "-33.333%"],
        }}
        transition={{
          x: {
            duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          },
        }}
      >
        {scrollingItems.map((item, index) => (
          <TechnologyItem
            key={`${item._id || item.title}-${index}`}
            item={item}
          />
        ))}
      </motion.div>
    </div>
  );
};

/* ===============================================================
   TECHNOLOGY ITEM
================================================================ */

const TechnologyItem = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  const title = typeof item.title === "string" ? item.title.trim() : "";

  const icon = typeof item.icon === "string" ? item.icon.trim() : "";

  if (!title) {
    return null;
  }

  return (
    <motion.div
      className="
        group
        relative
        flex
        h-[118px]
        w-[245px]
        shrink-0
        items-center
        justify-center
        px-6

        sm:h-[138px]
        sm:w-[300px]
        sm:px-8

        lg:h-[158px]
        lg:w-[360px]
        lg:px-10
      "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{
        scale: 1.025,
      }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* =========================================================
          SUBTLE TOP LINE
      ========================================================= */}

      <motion.span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-8
          right-8
          top-0
          h-px
          bg-[#292722]
          sm:left-10
          sm:right-10
          lg:left-12
          lg:right-12
        "
        animate={{
          opacity: hovered ? 0.9 : 0.45,
        }}
        transition={{
          duration: 0.4,
        }}
      />

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div className="flex items-center gap-5 sm:gap-6 lg:gap-7">
        {/* ICON */}

        <motion.div
          className="
            relative
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center

            sm:h-16
            sm:w-16

            lg:h-[72px]
            lg:w-[72px]
          "
          animate={{
            scale: hovered ? 1.08 : 1,
          }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Outer subtle ring */}

          <motion.span
            aria-hidden="true"
            className="
              absolute
              inset-0
              rounded-full
              border
              border-[#292722]
            "
            animate={{
              borderColor: hovered
                ? "rgba(201,166,107,0.55)"
                : "rgba(41,39,34,1)",
            }}
            transition={{
              duration: 0.5,
            }}
          />

          {/* Inner ring */}

          <span
            aria-hidden="true"
            className="
              absolute
              inset-[6px]
              rounded-full
              border
              border-[#292722]/50
            "
          />

          {icon ? (
            <motion.img
              src={icon}
              alt=""
              loading="lazy"
              className="
                relative
                z-10
                h-7
                w-7
                object-contain
                opacity-55
                grayscale
                sm:h-8
                sm:w-8
                lg:h-9
                lg:w-9
              "
              animate={{
                opacity: hovered ? 1 : 0.55,
                filter: hovered ? "grayscale(0)" : "grayscale(1)",
              }}
              transition={{
                duration: 0.5,
              }}
            />
          ) : (
            <motion.span
              aria-hidden="true"
              className="
                relative
                z-10
                h-2
                w-2
                rounded-full
                bg-[#C9A66B]
              "
              animate={{
                scale: hovered ? 1.5 : 1,
                opacity: hovered ? 1 : 0.55,
              }}
              transition={{
                duration: 0.4,
              }}
            />
          )}
        </motion.div>

        {/* TITLE */}

        <div className="min-w-0">
          <motion.p
            className="
              whitespace-nowrap
              text-lg
              font-medium
              tracking-[-0.025em]
              text-[#F5F3EE]

              sm:text-xl

              lg:text-2xl
            "
            animate={{
              x: hovered ? 5 : 0,
              color: hovered ? "#C9A66B" : "#F5F3EE",
            }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {title}
          </motion.p>

          <motion.span
            className="
              mt-1.5
              block
              h-px
              bg-[#C9A66B]
            "
            initial={{
              width: 0,
              opacity: 0,
            }}
            animate={{
              width: hovered ? "100%" : 0,
              opacity: hovered ? 1 : 0,
            }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>
      </div>

      {/* =========================================================
          BOTTOM LINE
      ========================================================= */}

      <motion.span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-8
          right-8
          h-px
          bg-[#292722]
          sm:left-10
          sm:right-10
          lg:left-12
          lg:right-12
        "
        animate={{
          opacity: hovered ? 0.9 : 0.45,
        }}
        transition={{
          duration: 0.4,
        }}
      />
    </motion.div>
  );
};

export default TechCapabilities;
