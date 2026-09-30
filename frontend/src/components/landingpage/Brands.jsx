import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import api_url from "../../config/api";

const Brands = () => {
  const sectionRef = useRef(null);

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | SCROLL SETTINGS
  |--------------------------------------------------------------------------
  */

  const ENTRY_HOLD = 0.15;
  const BRANDS_START = 0.15;
  const BRANDS_END = 0.85;

  /*
  |--------------------------------------------------------------------------
  | FETCH BRANDS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const fetchBrands = async () => {
      try {
        setLoading(true);

        const baseUrl = String(api_url || "http://localhost:4000").replace(
          /\/+$/,
          "",
        );

        const url = `${baseUrl}/api/website/brands`;

        console.log("Fetching brands from:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        console.log("Brands HTTP status:", response.status);

        const data = await response.json();

        console.log("Brands response:", data);

        if (!response.ok) {
          throw new Error(data?.message || `HTTP ${response.status}`);
        }

        const nextBrands = Array.isArray(data?.data) ? data.data : [];

        if (!mounted) {
          return;
        }

        setBrands(nextBrands);
        setActiveIndex(0);
      } catch (error) {
        console.error("Failed to fetch brands:", error);

        if (mounted) {
          setBrands([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBrands();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SECTION SCROLL PROGRESS
  |--------------------------------------------------------------------------
  */

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /*
  |--------------------------------------------------------------------------
  | SMOOTH MASTER SCROLL
  |--------------------------------------------------------------------------
  */

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 32,
    mass: 1.1,
  });

  /*
  |--------------------------------------------------------------------------
  | TEXT REVEAL
  |--------------------------------------------------------------------------
  */

  const eyebrowX = useTransform(
    smoothProgress,
    [0, 0.035, 0.09],
    ["-24vw", "-2vw", "0vw"],
  );

  const eyebrowY = useTransform(smoothProgress, [0, 0.035, 0.09], [10, 2, 0]);

  const eyebrowOpacity = useTransform(
    smoothProgress,
    [0, 0.025, 0.075, 0.11],
    [0, 0.2, 0.8, 1],
  );

  const headingX = useTransform(
    smoothProgress,
    [0, 0.045, 0.115],
    ["-30vw", "-2vw", "0vw"],
  );

  const headingY = useTransform(smoothProgress, [0, 0.045, 0.115], [18, 4, 0]);

  const headingOpacity = useTransform(
    smoothProgress,
    [0, 0.04, 0.085, 0.125],
    [0, 0.12, 0.72, 1],
  );

  const paragraphX = useTransform(
    smoothProgress,
    [0.025, 0.075, 0.145],
    ["-22vw", "-2vw", "0vw"],
  );

  const paragraphY = useTransform(
    smoothProgress,
    [0.025, 0.075, 0.145],
    [12, 3, 0],
  );

  const paragraphOpacity = useTransform(
    smoothProgress,
    [0.025, 0.07, 0.115, 0.15],
    [0, 0.12, 0.7, 1],
  );

  /*
  |--------------------------------------------------------------------------
  | BRAND PROGRESS
  |--------------------------------------------------------------------------
  */

  const brandProgress = useTransform(
    smoothProgress,
    [0, ENTRY_HOLD, BRANDS_START, BRANDS_END, 1],
    [0, 0, 0, 1, 1],
  );

  /*
  |--------------------------------------------------------------------------
  | ACTIVE BRAND
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!brands.length) {
      setActiveIndex(0);
      return undefined;
    }

    const unsubscribe = brandProgress.on("change", (value) => {
      const nextIndex = Math.round(value * (brands.length - 1));

      setActiveIndex(Math.max(0, Math.min(nextIndex, brands.length - 1)));
    });

    return () => unsubscribe();
  }, [brandProgress, brands.length]);

  const activeBrand = brands[activeIndex] || null;

  /*
  |--------------------------------------------------------------------------
  | BRAND LIST MOVEMENT
  |--------------------------------------------------------------------------
  */

  const brandHeight = 105;

  const totalListTravel = Math.max(0, brands.length - 1) * brandHeight;

  const listY = useTransform(
    brandProgress,
    [0, 1],
    ["0px", `-${totalListTravel}px`],
  );

  /*
  |--------------------------------------------------------------------------
  | LOGO MOTION
  |--------------------------------------------------------------------------
  */

  const logoY = useTransform(brandProgress, [0, 0.5, 1], [18, 0, -18]);

  const logoScale = useTransform(brandProgress, [0, 0.5, 1], [0.96, 1, 0.96]);

  /*
  |--------------------------------------------------------------------------
  | BACKGROUND GOLD DOTS
  |--------------------------------------------------------------------------
  */

  const backgroundDots = [
    {
      top: "13%",
      left: "18%",
      size: 4,
      delay: 0,
      duration: 3.2,
    },
    {
      top: "22%",
      left: "61%",
      size: 3,
      delay: 0.8,
      duration: 4.1,
    },
    {
      top: "34%",
      left: "86%",
      size: 5,
      delay: 1.4,
      duration: 3.8,
    },
    {
      top: "48%",
      left: "48%",
      size: 3,
      delay: 0.3,
      duration: 4.6,
    },
    {
      top: "61%",
      left: "76%",
      size: 4,
      delay: 1.7,
      duration: 3.7,
    },
    {
      top: "72%",
      left: "27%",
      size: 3,
      delay: 2.2,
      duration: 4.4,
    },
    {
      top: "82%",
      left: "65%",
      size: 5,
      delay: 0.5,
      duration: 4.9,
    },
    {
      top: "88%",
      left: "91%",
      size: 3,
      delay: 1.2,
      duration: 3.9,
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section
      ref={sectionRef}
      className="
        relative
        h-[400vh]
        w-full
        bg-[#080907]
        text-[#F5F3EE]
      "
    >
      {/* ================================================================
          VISIBLE 90VH BRANDS AREA
      ================================================================= */}

      <div
        className="
          sticky
          top-0
          z-10
          h-[90vh]
          min-h-[600px]
          w-full
          overflow-hidden
          bg-[#080907]
        "
      >
        {/* ==============================================================
            LEFT COLUMN
        ============================================================== */}

        <div
          className="
            grid
            h-full
            w-full
            grid-cols-[34%_66%]

            max-[850px]:
              grid-cols-[43%_57%]
          "
        >
          {/* ============================================================
              LEFT SIDE
          ============================================================= */}

          <div
            className="
              relative
              z-20
              flex
              h-full
              min-w-0
              flex-col
              justify-center
              bg-[#080907]
              pl-[7vw]
              pr-[3vw]

              max-[1100px]:
                pl-[5vw]

              max-[850px]:
                h-full
                px-[24px]
                pb-6
                pt-[70px]

              max-[550px]:
                px-[22px]
                pt-[60px]
            "
          >
            {/* ========================================================
                LEFT SIDE DOTS
            ======================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-0
                overflow-hidden
              "
            >
              {backgroundDots.slice(0, 4).map((dot, index) => (
                <motion.span
                  key={`left-dot-${index}`}
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
                    boxShadow: "0 0 10px 2px rgba(201,166,107,0.45)",
                  }}
                  animate={{
                    opacity: [0.15, 0.9, 0.2, 0.75, 0.15],
                    scale: [0.6, 1.5, 0.8, 1.25, 0.6],
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

            {/* ========================================================
                TEXT CONTENT
            ======================================================== */}

            <div className="relative z-10">
              {/* BRAND EXPERIENCE */}

              <motion.div
                style={{
                  x: eyebrowX,
                  y: eyebrowY,
                  opacity: eyebrowOpacity,
                }}
                className="
                  mb-7
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.35em]
                  text-[#C9A66B]

                  max-[850px]:
                    mb-4
                "
              >
                Brand experience
              </motion.div>

              {/* MAIN HEADING */}

              <motion.h2
                style={{
                  x: headingX,
                  y: headingY,
                  opacity: headingOpacity,
                }}
                className="
                  max-w-[460px]
                  text-[clamp(48px,5vw,84px)]
                  font-light
                  leading-[0.9]
                  tracking-[-0.055em]

                  max-[850px]:
                    max-w-[600px]
                    text-[clamp(42px,10vw,72px)]

                  max-[550px]:
                    text-[clamp(38px,11vw,60px)]
                "
              >
                Brands
                <br />
                that move.
              </motion.h2>

              {/* DESCRIPTION */}

              <motion.p
                style={{
                  x: paragraphX,
                  y: paragraphY,
                  opacity: paragraphOpacity,
                }}
                className="
                  mt-8
                  max-w-[370px]
                  text-[13px]
                  font-light
                  leading-[1.8]
                  text-[#A7A39B]

                  max-[850px]:
                    mt-5
                    max-w-[520px]

                  max-[550px]:
                    mt-4
                    text-[12px]
                "
              >
                A curated ecosystem of brands, each with its own identity,
                story, and visual language.
              </motion.p>
            </div>

            {/* LEFT COUNTER */}

            {!loading && brands.length > 0 && (
              <div
                className="
                  absolute
                  bottom-[10%]
                  left-[7vw]
                  z-10
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-white/30

                  max-[850px]:
                    hidden
                "
              >
                <span className="text-[#C9A66B]">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>

                <span className="mx-2">/</span>

                <span>{String(brands.length).padStart(2, "0")}</span>
              </div>
            )}
          </div>

          {/* ============================================================
              RIGHT COLUMN
          ============================================================= */}

          <div
            className="
              relative
              z-50
              h-full
              min-w-0
              overflow-hidden
              bg-[#080907]

              max-[850px]:
                h-full
            "
          >
            {/* ========================================================
                RIGHT SIDE DOTS
            ======================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-[5]
                overflow-hidden
              "
            >
              {/* Subtle radial atmosphere */}

              <div
                className="
                  absolute
                  left-[45%]
                  top-1/2
                  h-[55%]
                  w-[55%]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#C9A66B]/[0.025]
                  blur-[80px]
                "
              />

              {backgroundDots.slice(4).map((dot, index) => (
                <motion.span
                  key={`right-dot-${index}`}
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
                    boxShadow: "0 0 14px 3px rgba(201,166,107,0.5)",
                  }}
                  animate={{
                    opacity: [0.18, 1, 0.25, 0.85, 0.18],
                    scale: [0.65, 1.6, 0.75, 1.3, 0.65],
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

            {/* ==========================================================
                CENTER GUIDE
            ========================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                left-0
                right-[7%]
                top-1/2
                z-10
                h-px
                -translate-y-1/2
                bg-white/[0.07]
              "
            />

            {/* ==========================================================
                BRAND LIST
            ========================================================== */}

            <div
              className="
                absolute
                inset-0
                z-30
                overflow-hidden
              "
            >
              <motion.div
                style={{
                  y: listY,
                }}
                className="
                  absolute
                  left-[15%]
                  top-[85%]
                  flex
                  w-[80%]
                  -translate-y-1/2
                  flex-col

                  max-[1200px]:
                    left-[13%]
                    w-[82%]

                  max-[850px]:
                    left-[9%]
                    top-[78%]
                    w-[87%]

                  max-[550px]:
                    left-[6%]
                    top-[75%]
                    w-[92%]
                "
              >
                {brands.map((brand, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={brand._id || `${brand.name}-${index}`}
                      className="
                          flex
                          h-[105px]
                          w-full
                          shrink-0
                          items-center

                          max-[850px]:
                            h-[92px]

                          max-[550px]:
                            h-[82px]
                        "
                    >
                      <motion.div
                        animate={{
                          x: isActive ? 24 : 0,
                          opacity: isActive ? 1 : 0.25,
                        }}
                        transition={{
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="
                            flex
                            min-w-0
                            items-center
                          "
                      >
                        {/* ACTIVE LINE */}

                        <motion.div
                          animate={{
                            width: isActive ? 58 : 20,
                          }}
                          transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="
                              mr-5
                              h-px
                              shrink-0
                              bg-[#C9A66B]

                              max-[850px]:
                                mr-4

                              max-[550px]:
                                mr-3
                            "
                        />

                        {/* BRAND NAME */}

                        <span
                          className={`
                              whitespace-nowrap
                              text-[clamp(30px,3.7vw,58px)]
                              font-light
                              leading-none
                              tracking-[-0.045em]

                              max-[1100px]:
                                text-[clamp(28px,4vw,52px)]

                              max-[850px]:
                                text-[clamp(26px,6vw,46px)]

                              max-[550px]:
                                text-[clamp(24px,7vw,40px)]

                              ${
                                isActive
                                  ? "text-[#c9a66b]"
                                  : "text-[#F5F3EE]/30"
                              }
                            `}
                        >
                          {brand.name}
                        </span>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* ==========================================================
                BRAND LOGO
            ========================================================== */}

            {activeBrand && (
              <motion.div
                style={{
                  y: logoY,
                  scale: logoScale,
                  width: "min(260px, 32vw)",
                  height: "min(260px, 32vw)",
                }}
                className="
                  pointer-events-none
                  absolute
                  left-0
                  top-1/2
                  z-50
                  flex
                  -translate-y-1/2
                  items-center
                  justify-center
                "
              >
                {/* OUTER FRAME */}

                <div
                  className="
                    absolute
                    inset-0
                    border
                    border-[#C9A66B]/40
                  "
                />

                {/* INNER FRAME */}

                <div
                  className="
                    absolute
                    inset-[9px]
                    border
                    border-[#C9A66B]/20
                  "
                />

                {/* LOGO PANEL */}

                <div
                  className="
                    relative
                    flex
                    h-[calc(100%-28px)]
                    w-[calc(100%-28px)]
                    items-center
                    justify-center
                    overflow-hidden
                    bg-[#F5F3EE]
                  "
                >
                  <motion.img
                    key={activeBrand._id || activeBrand.logoUrl}
                    src={activeBrand.logoUrl}
                    alt={activeBrand.name || "Brand logo"}
                    initial={{
                      opacity: 0,
                      scale: 0.82,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="
                      block
                      max-h-[78%]
                      max-w-[78%]
                      object-contain
                    "
                    onError={() => {
                      console.error("Brand logo failed:", activeBrand.logoUrl);
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* ==========================================================
                SELECTED BRAND
            ========================================================== */}

            {activeBrand && (
              <motion.div
                key={activeBrand._id || activeBrand.name}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="
                  absolute
                  bottom-[11%]
                  left-0
                  z-[60]

                  max-[850px]:
                    bottom-[7%]
                    left-[3%]

                  max-[550px]:
                    bottom-[5%]
                "
              >
                <div
                  className="
                    mb-2
                    text-[8px]
                    uppercase
                    tracking-[0.3em]
                    text-[#C9A66B]
                  "
                >
                  Selected brand
                </div>

                <div
                  className="
                    text-[12px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-white/65

                    max-[550px]:
                      text-[10px]
                  "
                >
                  {activeBrand.name}
                </div>
              </motion.div>
            )}

            {/* ==========================================================
                TOP DECORATIVE LINE
            ========================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                right-[7%]
                top-[12%]
                z-[60]
                h-px
                w-[90px]
                bg-[#C9A66B]/30

                max-[850px]:
                  right-[5%]
                  top-[8%]
                  w-[60px]
              "
            />

            {/* ==========================================================
                BOTTOM DECORATIVE LINE
            ========================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-[12%]
                right-[7%]
                z-[60]
                h-px
                w-[90px]
                bg-[#C9A66B]/30

                max-[850px]:
                  right-[5%]
                  bottom-[8%]
                  w-[60px]
              "
            />

            {/* ==========================================================
                TOP INDEX
            ========================================================== */}

            {!loading && brands.length > 0 && (
              <div
                className="
                    absolute
                    right-[7%]
                    top-[8%]
                    z-[60]
                    text-[9px]
                    uppercase
                    tracking-[0.28em]
                    text-white/25

                    max-[850px]:
                      hidden
                  "
              >
                {String(activeIndex + 1).padStart(2, "0")}
                {" — "}
                {String(brands.length).padStart(2, "0")}
              </div>
            )}

            {/* ==========================================================
                LOADING
            ========================================================== */}

            {loading && (
              <div
                className="
                  absolute
                  inset-0
                  z-[100]
                  flex
                  items-center
                  justify-center
                  bg-[#080907]
                "
              >
                <div
                  className="
                    h-5
                    w-5
                    animate-pulse
                    rounded-full
                    border
                    border-[#C9A66B]
                  "
                />
              </div>
            )}

            {/* ==========================================================
                EMPTY STATE
            ========================================================== */}

            {!loading && brands.length === 0 && (
              <div
                className="
                    absolute
                    inset-0
                    z-[100]
                    flex
                    items-center
                    justify-center
                  "
              >
                <div
                  className="
                      text-center
                      text-xs
                      uppercase
                      tracking-[0.25em]
                      text-white/40
                    "
                >
                  No brands found
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;
