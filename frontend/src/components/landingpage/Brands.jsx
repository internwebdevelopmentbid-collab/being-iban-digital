import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import api_url from "../../config/api";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const BRANDS_ENDPOINT = `${String(api_url || "http://localhost:4000").replace(
  /\/+$/,
  "",
)}/api/website/brands`;

const ENTRY_HOLD = 0.15;
const BRANDS_START = 0.15;
const BRANDS_END = 0.85;

const DESKTOP_BRAND_HEIGHT = 105;
const TABLET_BRAND_HEIGHT = 82;
const MOBILE_BRAND_HEIGHT = 70;

/* -------------------------------------------------------------------------- */
/* CLOUDINARY                                                                 */
/* -------------------------------------------------------------------------- */

const optimizeCloudinaryUrl = (url, width) => {
  if (!url || typeof url !== "string") {
    return url;
  }

  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  if (!url.includes("/upload/")) {
    return url;
  }

  const transformation = `f_auto,q_auto,dpr_auto,w_${width}`;

  /*
   * Avoid duplicating transformations when a Cloudinary URL has already
   * been optimized elsewhere.
   */
  if (
    url.includes("/f_auto,") ||
    url.includes("/q_auto") ||
    url.includes("/dpr_auto") ||
    /w_\d+/.test(url.split("/upload/")[1]?.split("/")[0] || "")
  ) {
    return url;
  }

  return url.replace("/upload/", `/upload/${transformation}/`);
};

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

const Brands = () => {
  const sectionRef = useRef(null);

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  /* ------------------------------------------------------------------------ */
  /* RESPONSIVE SCREEN DETECTION                                              */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let frameId = null;

    const updateScreenSize = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        setViewportWidth(window.innerWidth);
      });
    };

    window.addEventListener("resize", updateScreenSize, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", updateScreenSize);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const isSmallScreen = viewportWidth <= 850;
  const isMobileScreen = viewportWidth <= 550;

  /* ------------------------------------------------------------------------ */
  /* FETCH BRANDS                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const controller = new AbortController();

    const fetchBrands = async () => {
      try {
        setLoading(true);

        const response = await fetch(BRANDS_ENDPOINT, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || `HTTP ${response.status}`);
        }

        const nextBrands = Array.isArray(data?.data) ? data.data : [];

        if (controller.signal.aborted) {
          return;
        }

        setBrands(nextBrands);
        setActiveIndex(0);
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch brands:", error);

        if (!controller.signal.aborted) {
          setBrands([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBrands();

    return () => {
      controller.abort();
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* SCROLL PROGRESS                                                          */
  /* ------------------------------------------------------------------------ */

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ------------------------------------------------------------------------ */
  /* DESKTOP SPRING                                                           */
  /* ------------------------------------------------------------------------ */

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 32,
    mass: 1.1,
  });

  /* ------------------------------------------------------------------------ */
  /* MOBILE / TABLET SPRING                                                   */
  /* ------------------------------------------------------------------------ */

  const mobileListProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.6,
  });

  /* ------------------------------------------------------------------------ */
  /* TEXT SPRING                                                              */
  /* ------------------------------------------------------------------------ */

  const textProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 30,
    mass: 0.8,
  });

  /* ------------------------------------------------------------------------ */
  /* BRAND LIST PROGRESS                                                      */
  /* ------------------------------------------------------------------------ */

  const listProgress = isSmallScreen ? mobileListProgress : smoothProgress;

  /* ------------------------------------------------------------------------ */
  /* TEXT ANIMATIONS                                                          */
  /* ------------------------------------------------------------------------ */

  const eyebrowX = useTransform(
    textProgress,
    [0, 0.03, 0.08],
    ["-20vw", "-2vw", "0vw"],
  );

  const eyebrowY = useTransform(textProgress, [0, 0.03, 0.08], [8, 2, 0]);

  const eyebrowOpacity = useTransform(
    textProgress,
    [0, 0.02, 0.06, 0.1],
    [0, 0.2, 0.8, 1],
  );

  /* ------------------------------------------------------------------------ */
  /* HEADING                                                                  */
  /* ------------------------------------------------------------------------ */

  const headingX = useTransform(
    textProgress,
    [0, 0.035, 0.105],
    ["-25vw", "-2vw", "0vw"],
  );

  const headingY = useTransform(textProgress, [0, 0.035, 0.105], [14, 3, 0]);

  const headingOpacity = useTransform(
    textProgress,
    [0, 0.03, 0.075, 0.115],
    [0, 0.15, 0.75, 1],
  );

  /* ------------------------------------------------------------------------ */
  /* PARAGRAPH                                                                */
  /* ------------------------------------------------------------------------ */

  const paragraphX = useTransform(
    textProgress,
    [0.02, 0.07, 0.13],
    ["-19vw", "-2vw", "0vw"],
  );

  const paragraphY = useTransform(textProgress, [0.02, 0.07, 0.13], [10, 3, 0]);

  const paragraphOpacity = useTransform(
    textProgress,
    [0.02, 0.065, 0.105, 0.14],
    [0, 0.12, 0.7, 1],
  );

  /* ------------------------------------------------------------------------ */
  /* BRAND PROGRESS                                                           */
  /* ------------------------------------------------------------------------ */

  const brandProgress = useTransform(
    listProgress,
    [0, ENTRY_HOLD, BRANDS_START, BRANDS_END, 1],
    [0, 0, 0, 1, 1],
  );

  /* ------------------------------------------------------------------------ */
  /* ACTIVE BRAND                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!brands.length) {
      setActiveIndex(0);
      return undefined;
    }

    const unsubscribe = brandProgress.on("change", (value) => {
      const nextIndex = Math.round(value * (brands.length - 1));

      const clampedIndex = Math.max(0, Math.min(nextIndex, brands.length - 1));

      setActiveIndex((currentIndex) =>
        currentIndex === clampedIndex ? currentIndex : clampedIndex,
      );
    });

    return () => unsubscribe();
  }, [brandProgress, brands.length]);

  const activeBrand = brands[activeIndex] || null;

  /* ------------------------------------------------------------------------ */
  /* RESPONSIVE BRAND ROW HEIGHT                                              */
  /* ------------------------------------------------------------------------ */

  const brandHeight = isMobileScreen
    ? MOBILE_BRAND_HEIGHT
    : isSmallScreen
      ? TABLET_BRAND_HEIGHT
      : DESKTOP_BRAND_HEIGHT;

  const totalListTravel = Math.max(0, brands.length - 1) * brandHeight;

  /* ------------------------------------------------------------------------ */
  /* BRAND LIST POSITION                                                      */
  /* ------------------------------------------------------------------------ */

  const listY = useTransform(
    brandProgress,
    [0, 1],
    ["0px", `-${totalListTravel}px`],
  );

  /* ------------------------------------------------------------------------ */
  /* LOGO MOTION                                                              */
  /* ------------------------------------------------------------------------ */

  const logoY = useTransform(brandProgress, [0, 0.5, 1], [18, 0, -18]);

  const logoScale = useTransform(brandProgress, [0, 0.5, 1], [0.96, 1, 0.96]);

  /* ------------------------------------------------------------------------ */
  /* ACTIVE LOGO URL                                                          */
  /* ------------------------------------------------------------------------ */

  const activeLogoUrl = activeBrand
    ? optimizeCloudinaryUrl(
        activeBrand.logoUrl,
        isMobileScreen ? 320 : isSmallScreen ? 420 : 560,
      )
    : null;

  const activeWebsiteUrl = activeBrand?.websiteUrl?.trim() || "";

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <section
      ref={sectionRef}
      className="
        relative
        h-[400vh]
        w-full
        bg-[#080907]
        text-[#F5F3EE]

        max-[850px]:h-[350vh]
        max-[550px]:h-[320vh]
      "
    >
      {/* ================================================================
          STICKY VIEWPORT
          ================================================================ */}

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
        {/* ============================================================
            MAIN GRID
            ============================================================ */}

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
          {/* ========================================================
              LEFT SIDE
              ======================================================== */}

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
            {/* ====================================================
                TEXT CONTENT
                ==================================================== */}

            <div className="relative z-10">
              {/* EYEBROW */}

              <motion.div
                style={{
                  x: eyebrowX,
                  y: eyebrowY,
                  opacity: eyebrowOpacity,
                  willChange: "transform, opacity",
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
                Our Clients
              </motion.div>

              {/* HEADING */}

              <motion.h2
                style={{
                  x: headingX,
                  y: headingY,
                  opacity: headingOpacity,
                  willChange: "transform, opacity",
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
                Clients
                <br />
                that matter.
              </motion.h2>

              {/* PARAGRAPH */}

              <motion.p
                style={{
                  x: paragraphX,
                  y: paragraphY,
                  opacity: paragraphOpacity,
                  willChange: "transform, opacity",
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
                We partner with ambitious businesses to build distinctive
                digital experiences, strengthen their presence, and turn ideas
                into meaningful results.
              </motion.p>
            </div>

            {/* ====================================================
                LEFT COUNTER
                ==================================================== */}

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

          {/* ========================================================
              RIGHT SIDE
              ======================================================== */}

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
            {/* ====================================================
                RIGHT ATMOSPHERE
                ==================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-[5]
                overflow-hidden
              "
              aria-hidden="true"
            >
              {/* RADIAL ATMOSPHERE */}

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
            </div>

            {/* ====================================================
                CENTER GUIDE
                ==================================================== */}

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

            {/* ====================================================
                BRAND LIST
                ==================================================== */}

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
                  willChange: "transform",
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
                          h-[82px]

                        max-[550px]:
                          h-[70px]
                      "
                    >
                      {/* BRAND ITEM */}

                      <motion.div
                        animate={{
                          x: isActive ? 24 : 0,
                          opacity: isActive ? 1 : 0.25,
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="
                          flex
                          min-w-0
                          items-center

                          max-[850px]:
                            translate-x-0
                        "
                      >
                        {/* ACTIVE LINE */}

                        <motion.div
                          animate={{
                            width: isActive ? 58 : 20,
                            opacity: 1,
                          }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="
                            mr-5
                            h-px
                            shrink-0
                            bg-[#C9A66B]

                            max-[850px]:
                              mr-3
                              w-[28px]

                            max-[550px]:
                              mr-2
                              w-[22px]
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
                              text-[clamp(23px,5.5vw,40px)]

                            max-[550px]:
                              text-[clamp(20px,6vw,34px)]

                            ${isActive ? "text-[#c9a66b]" : "text-[#F5F3EE]/30"}
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

            {/* ====================================================
                BRAND LOGO
                ==================================================== */}

            {activeBrand && activeLogoUrl && (
              <motion.div
                style={{
                  y: logoY,
                  scale: logoScale,
                  width: "min(260px, 32vw)",
                  height: "min(260px, 32vw)",
                  willChange: "transform",
                }}
                className="
                  pointer-events-auto
                  absolute
                  left-0
                  top-1/2
                  z-50
                  flex
                  -translate-y-1/2
                  items-center
                  justify-center

                  max-[850px]:
                    w-[min(180px,28vw)]
                    h-[min(180px,28vw)]

                  max-[550px]:
                    w-[min(135px,27vw)]
                    h-[min(135px,27vw)]
                "
              >
                <a
                  href={activeWebsiteUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${activeBrand.name} website`}
                  className={`absolute inset-0 z-10 ${
                    activeWebsiteUrl ? "cursor-pointer" : "pointer-events-none"
                  }`}
                >
                  <span className="sr-only">
                    Visit {activeBrand.name} website
                  </span>
                </a>

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

                    max-[550px]:
                      inset-[6px]
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

                    max-[550px]:
                      h-[calc(100%-18px)]
                      w-[calc(100%-18px)]
                  "
                >
                  <motion.img
                    key={activeBrand._id || activeBrand.logoUrl}
                    src={activeLogoUrl}
                    alt={
                      activeBrand.name
                        ? `${activeBrand.name} logo`
                        : "Brand logo"
                    }
                    initial={{
                      opacity: 0,
                      scale: 0.88,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="
                      block
                      max-h-[78%]
                      max-w-[78%]
                      object-contain
                    "
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onError={() => {
                      console.error("Brand logo failed:", activeBrand.logoUrl);
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* ====================================================
                SELECTED BRAND
                ==================================================== */}

            {activeBrand && (
              <motion.div
                key={activeBrand._id || activeBrand.name}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
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
                    uppercase
                    tracking-[0.3em]
                    text-[#C9A66B]
                    text-xl
                  "
                >
                  Featured Client
                </div>

                <div
                  className="
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-white/65
                    text-xl

                    max-[550px]:
                      text-[10px]
                  "
                >
                  {activeBrand.name}
                </div>
              </motion.div>
            )}

            {/* ====================================================
                TOP INDEX
                ==================================================== */}

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

            {/* ====================================================
                LOADING
                ==================================================== */}

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

            {/* ====================================================
                EMPTY STATE
                ==================================================== */}

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
