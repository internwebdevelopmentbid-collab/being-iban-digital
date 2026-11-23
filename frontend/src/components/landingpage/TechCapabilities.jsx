import { useEffect, useMemo, useRef, useState } from "react";

import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

import api_url from "../../config/api";

/* ============================================================================
   TECH CAPABILITIES
============================================================================ */

const TECH_CAPABILITIES_ENDPOINT = `${api_url}/api/website/techCapabilities`;

/* ============================================================================
   CLOUDINARY OPTIMIZATION
============================================================================ */

const optimizeCloudinaryUrl = (url, width = 144) => {
  if (!url || typeof url !== "string") {
    return url;
  }

  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const uploadMarker = "/upload/";
  const [base, assetPath] = url.split(uploadMarker);

  if (!assetPath) {
    return url;
  }

  const [existingTransformations, ...rest] = assetPath.split("/");

  const hasTransformation =
    existingTransformations.includes("f_auto") ||
    existingTransformations.includes("q_auto") ||
    existingTransformations.includes("dpr_auto") ||
    /(^|,)w_\d+(,|$)/.test(existingTransformations);

  const transformation = `f_auto,q_auto,dpr_auto,w_${width}`;

  if (hasTransformation) {
    return url;
  }

  return `${base}${uploadMarker}${transformation}/${assetPath}`;
};

/* ============================================================================
   TECH CAPABILITIES
============================================================================ */

const TechCapabilities = () => {
  const [capabilities, setCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------------------------------
     LOAD TECHNOLOGY CAPABILITIES
  -------------------------------------------------------------------------- */

  useEffect(() => {
    const controller = new AbortController();

    const loadCapabilities = async () => {
      try {
        const response = await fetch(TECH_CAPABILITIES_ENDPOINT, {
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message || "Failed to fetch technology capabilities.",
          );
        }

        const data = Array.isArray(result)
          ? result
          : result?.data || result?.techCapabilities || [];

        setCapabilities(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error("Failed to load technology capabilities:", error);
        setCapabilities([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCapabilities();

    return () => {
      controller.abort();
    };
  }, []);

  /* --------------------------------------------------------------------------
     NORMALIZE
  -------------------------------------------------------------------------- */

  const normalizedCapabilities = useMemo(
    () => (Array.isArray(capabilities) ? capabilities : []),
    [capabilities],
  );

  /* --------------------------------------------------------------------------
     LINE ONE
  -------------------------------------------------------------------------- */

  const lineOne = useMemo(
    () =>
      normalizedCapabilities.filter(
        (item) => item.line1 === true || item.line1 === "true",
      ),
    [normalizedCapabilities],
  );

  /* --------------------------------------------------------------------------
     LINE TWO
  -------------------------------------------------------------------------- */

  const lineTwo = useMemo(
    () =>
      normalizedCapabilities.filter(
        (item) => item.line2 === true || item.line2 === "true",
      ),
    [normalizedCapabilities],
  );

  /* --------------------------------------------------------------------------
     UNASSIGNED
  -------------------------------------------------------------------------- */

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

  const secondaryCapabilities = lineTwo;

  /* --------------------------------------------------------------------------
     NO FALLBACK
  -------------------------------------------------------------------------- */

  if (loading || normalizedCapabilities.length === 0) {
    return null;
  }

  return (
    <section
      id="technology"
      className="
        relative
        overflow-hidden
        bg-black
        py-20
        sm:py-24
        lg:py-36
      "
    >
      {/* =====================================================================
          AMBIENT GOLDEN BACKGROUND
      ===================================================================== */}

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
        {/* Central glow */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[400px]
            w-[400px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#C9A66B]/[0.025]
            blur-[100px]
            sm:h-[450px]
            sm:w-[450px]
            lg:h-[500px]
            lg:w-[500px]
            lg:blur-[120px]
          "
        />
      </div>

      {/* =====================================================================
          HEADER
      ===================================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1600px]
          px-5
          sm:px-8
          lg:px-16
        "
      >
        <div
          className="
            mb-14
            max-w-3xl
            sm:mb-18
            lg:mb-24
          "
        >
          {/* Label */}

          <div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4">
            <span
              aria-hidden="true"
              className="
                h-px
                w-7
                bg-[#C9A66B]
                sm:w-10
                lg:w-12
              "
            />

            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-[#A7A39B]
                sm:text-[10px]
                sm:tracking-[0.32em]
                lg:text-[11px]
              "
            >
              Technology
            </span>
          </div>

          {/* Heading */}

          <h2
            className="
              max-w-[850px]
              text-balance
              text-[40px]
              font-medium
              leading-[0.95]
              tracking-[-0.055em]
              text-[#F5F3EE]
              sm:text-[52px]
              md:text-[64px]
              lg:text-[clamp(42px,6vw,92px)]
            "
          >
            Built with the
            <br />
            <span className="text-[#C9A66B]">right technology.</span>
          </h2>

          {/* Description */}

          <p
            className="
              mt-6
              max-w-[580px]
              text-[13px]
              leading-6
              tracking-[-0.01em]
              text-[#A7A39B]
              sm:mt-8
              sm:text-sm
              sm:leading-7
              lg:mt-9
              lg:text-base
              lg:leading-8
            "
          >
            We combine modern technologies, platforms and digital capabilities
            to create fast, scalable and meaningful experiences.
          </p>
        </div>
      </div>

      {/* =====================================================================
          MARQUEE AREA
      ===================================================================== */}

      <div className="relative z-10">
        {/* Left fade */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-20
            w-10
            bg-gradient-to-r
            from-[#080907]
            to-transparent
            sm:w-16
            md:w-24
            lg:w-52
          "
        />

        {/* Right fade */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-20
            w-10
            bg-gradient-to-l
            from-[#080907]
            to-transparent
            sm:w-16
            md:w-24
            lg:w-52
          "
        />

        {/* -------------------------------------------------------------------
            LINE ONE
        ------------------------------------------------------------------- */}

        {primaryCapabilities.length > 0 && (
          <TechnologyMarquee
            items={primaryCapabilities}
            direction="left"
            duration={34}
          />
        )}

        {/* -------------------------------------------------------------------
            LINE TWO
        ------------------------------------------------------------------- */}

        {secondaryCapabilities.length > 0 && (
          <div
            className="
              mt-4
              sm:mt-5
              md:mt-6
              lg:mt-8
            "
          >
            <TechnologyMarquee
              items={secondaryCapabilities}
              direction="right"
              duration={38}
            />
          </div>
        )}
      </div>

      {/* =====================================================================
          LOWER META
      ===================================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          mt-14
          max-w-[1600px]
          px-5
          sm:mt-18
          sm:px-8
          lg:mt-24
          lg:px-16
        "
      >
        <div className="flex items-center gap-3 sm:gap-5">
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
              text-[7px]
              uppercase
              tracking-[0.22em]
              text-[#6F6B63]
              sm:text-[9px]
              sm:tracking-[0.28em]
              lg:text-[10px]
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

/* ============================================================================
   TECHNOLOGY MARQUEE
============================================================================ */

const TechnologyMarquee = ({ items, direction = "left", duration = 35 }) => {
  const [paused, setPaused] = useState(false);

  const x = useMotionValue(0);

  const trackRef = useRef(null);
  const segmentWidthRef = useRef(0);
  const initializedRef = useRef(false);
  const resizeFrameRef = useRef(null);

  const isRight = direction === "right";

  /* --------------------------------------------------------------------------
     MEASURE
  -------------------------------------------------------------------------- */

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      /*
       * The track contains exactly 3 copies:
       *
       * [COPY 1][COPY 2][COPY 3]
       *
       * Therefore:
       *
       * total width / 3 = one complete segment
       */

      const width = track.scrollWidth / 3;

      if (!width || !Number.isFinite(width)) {
        return;
      }

      const previousWidth = segmentWidthRef.current;

      segmentWidthRef.current = width;

      /* Initial position */

      if (!initializedRef.current) {
        x.set(isRight ? -width : 0);
        initializedRef.current = true;
        return;
      }

      /*
       * Preserve the current relative position if the viewport
       * changes from mobile -> tablet -> desktop etc.
       */

      if (previousWidth > 0 && previousWidth !== width) {
        const current = x.get();

        const progress = Math.abs(current) / previousWidth;
        const normalizedProgress = progress % 1;

        if (isRight) {
          x.set(-width + width * normalizedProgress);
        } else {
          x.set(-width * normalizedProgress);
        }
      }
    };

    const scheduleMeasure = () => {
      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current);
      }

      resizeFrameRef.current = requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        measure();
      });
    };

    measure();

    const observer = new ResizeObserver(scheduleMeasure);

    if (trackRef.current) {
      observer.observe(trackRef.current);
    }

    window.addEventListener("resize", scheduleMeasure, {
      passive: true,
    });

    return () => {
      observer.disconnect();

      window.removeEventListener("resize", scheduleMeasure);

      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current);
      }
    };
  }, [isRight, x]);

  /* --------------------------------------------------------------------------
     SMOOTH RESPONSIVE ANIMATION
  -------------------------------------------------------------------------- */

  useAnimationFrame((_, delta) => {
    if (paused) {
      return;
    }

    const segmentWidth = segmentWidthRef.current;

    if (!segmentWidth) {
      return;
    }

    /*
     * Responsive speed:
     *
     * Mobile  < 640px  = 1.8x
     * Tablet  < 1024px = 1.4x
     * Desktop          = 1x
     */

    const viewportWidth = window.innerWidth;

    let speedMultiplier = 1;

    if (viewportWidth < 640) {
      speedMultiplier = 1.8;
    } else if (viewportWidth < 1024) {
      speedMultiplier = 1.4;
    }

    const effectiveDuration = duration / speedMultiplier;
    const pixelsPerMillisecond = segmentWidth / (effectiveDuration * 1000);

    let currentX = x.get();

    if (isRight) {
      currentX += delta * pixelsPerMillisecond;

      /*
       * Seamless wrap.
       */

      if (currentX >= 0) {
        currentX -= segmentWidth;
      }
    } else {
      currentX -= delta * pixelsPerMillisecond;

      /*
       * Seamless wrap.
       */

      if (currentX <= -segmentWidth) {
        currentX += segmentWidth;
      }
    }

    x.set(currentX);
  });

  if (!items.length) {
    return null;
  }

  /*
   * Three copies:
   *
   * [COPY 1][COPY 2][COPY 3]
   */

  const scrollingItems = useMemo(() => [...items, ...items, ...items], [items]);

  return (
    <div className="relative overflow-hidden">
      <motion.div
        ref={trackRef}
        className="
          flex
          w-max
          items-center
          will-change-transform
        "
        style={{
          x,
        }}
      >
        {scrollingItems.map((item, index) => (
          <TechnologyItem
            key={`${item._id || item.title}-${index}`}
            item={item}
            onHoverChange={setPaused}
          />
        ))}
      </motion.div>
    </div>
  );
};

/* ============================================================================
   TECHNOLOGY ITEM
============================================================================ */

const TechnologyItem = ({ item, onHoverChange }) => {
  const [hovered, setHovered] = useState(false);

  const title = typeof item.title === "string" ? item.title.trim() : "";
  const icon = typeof item.icon === "string" ? item.icon.trim() : "";

  const optimizedIcon = useMemo(() => optimizeCloudinaryUrl(icon, 144), [icon]);

  if (!title) {
    return null;
  }

  /* --------------------------------------------------------------------------
     HOVER
  -------------------------------------------------------------------------- */

  const handleMouseEnter = () => {
    setHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    onHoverChange?.(false);
  };

  return (
    <motion.div
      className="
        group
        relative
        flex
        h-[100px]
        w-[190px]
        shrink-0
        items-center
        justify-center
        px-4
        sm:h-[115px]
        sm:w-[235px]
        sm:px-5
        md:h-[125px]
        md:w-[270px]
        lg:h-[158px]
        lg:w-[360px]
        lg:px-10
      "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.025,
      }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* =====================================================================
          TOP LINE
      ===================================================================== */}

      <motion.span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-5
          right-5
          top-0
          h-px
          bg-[#292722]
          sm:left-6
          sm:right-6
          md:left-8
          md:right-8
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

      {/* =====================================================================
          CONTENT
      ===================================================================== */}

      <div
        className="
          flex
          items-center
          gap-3
          sm:gap-4
          md:gap-5
          lg:gap-7
        "
      >
        {/* -------------------------------------------------------------------
            ICON
        ------------------------------------------------------------------- */}

        <motion.div
          className="
            relative
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            sm:h-12
            sm:w-12
            md:h-14
            md:w-14
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
          {/* Outer ring */}

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
              boxShadow: hovered
                ? "0 0 18px rgba(201,166,107,0.22), 0 0 42px rgba(201,166,107,0.08)"
                : "0 0 0 rgba(201,166,107,0)",
            }}
            transition={{
              duration: 0.5,
            }}
          />

          {/* Inner ring */}

          <motion.span
            aria-hidden="true"
            className="
              absolute
              inset-[4px]
              rounded-full
              border
              border-[#292722]/50
              sm:inset-[5px]
              lg:inset-[6px]
            "
            animate={{
              borderColor: hovered
                ? "rgba(201,166,107,0.32)"
                : "rgba(41,39,34,0.5)",
              boxShadow: hovered
                ? "0 0 14px rgba(201,166,107,0.16)"
                : "0 0 0 rgba(201,166,107,0)",
            }}
            transition={{
              duration: 0.5,
            }}
          />

          {/* Icon */}

          {optimizedIcon ? (
            <motion.img
              src={optimizedIcon}
              alt=""
              loading="lazy"
              decoding="async"
              width={144}
              height={144}
              className="
                relative
                z-10
                h-5
                w-5
                object-contain
                sm:h-6
                sm:w-6
                md:h-7
                md:w-7
                lg:h-9
                lg:w-9
              "
              animate={{
                scale: hovered ? 1.08 : 1,
                filter: hovered
                  ? "drop-shadow(0 0 8px rgba(201,166,107,0.55)) drop-shadow(0 0 20px rgba(201,166,107,0.22))"
                  : "drop-shadow(0 0 5px rgba(201,166,107,0.28))",
              }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ) : (
            <motion.span
              aria-hidden="true"
              className="
                relative
                z-10
                h-1.5
                w-1.5
                rounded-full
                bg-[#C9A66B]
                sm:h-2
                sm:w-2
              "
              animate={{
                scale: hovered ? 1.5 : 1,
                boxShadow: hovered
                  ? "0 0 10px rgba(201,166,107,0.8), 0 0 28px rgba(201,166,107,0.35)"
                  : "0 0 8px rgba(201,166,107,0.55)",
              }}
              transition={{
                duration: 0.4,
              }}
            />
          )}
        </motion.div>

        {/* -------------------------------------------------------------------
            TITLE
        ------------------------------------------------------------------- */}

        <div className="min-w-0">
          <motion.p
            className="
              whitespace-nowrap
              text-[13px]
              font-medium
              tracking-[-0.02em]
              text-[#F5F3EE]
              sm:text-base
              md:text-lg
              lg:text-xl
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

          {/* Hover underline */}

          <motion.span
            className="
              mt-1
              block
              h-px
              bg-[#C9A66B]
              sm:mt-1.5
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

      {/* =====================================================================
          BOTTOM LINE
      ===================================================================== */}

      <motion.span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-5
          right-5
          h-px
          bg-[#292722]
          sm:left-6
          sm:right-6
          md:left-8
          md:right-8
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
