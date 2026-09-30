import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroPhone from "./HeroPhone";

const Hero = () => {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  /*
   * =========================================
   * SMOOTH SCROLL DRIVER
   *
   * Used ONLY for scroll-driven animation.
   * The initial phone entrance is independent.
   * =========================================
   */

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.35,
  });

  /*
   * =========================================
   * DESKTOP PHONE — SCROLL EXIT
   * =========================================
   *
   * Original ranges preserved.
   */

  const desktopX = useTransform(
    smoothScrollProgress,
    [0, 0.28, 0.58, 0.86],
    ["0vw", "0vw", "18vw", "110vw"],
  );

  const desktopY = useTransform(
    smoothScrollProgress,
    [0, 0.28, 0.58, 0.86],
    ["0vh", "0vh", "1vh", "8vh"],
  );

  const desktopRotate = useTransform(
    smoothScrollProgress,
    [0, 0.28, 0.58, 0.86],
    [0, 0, -3, 11],
  );

  /*
   * =========================================
   * DESKTOP PHONE — EXIT FADE
   * =========================================
   */

  const desktopOpacity = useTransform(
    smoothScrollProgress,
    [0, 0.08, 0.48, 0.56, 0.64, 0.72, 0.8, 0.86],
    [1, 1, 1, 0.92, 0.72, 0.48, 0.22, 0],
  );

  /*
   * =========================================
   * MOBILE PHONE — SCROLL EXIT
   * =========================================
   *
   * Original ranges preserved.
   */

  const mobileX = useTransform(
    smoothScrollProgress,
    [0, 0.72, 0.84, 0.98],
    ["0vw", "0vw", "10vw", "110vw"],
  );

  const mobileY = useTransform(
    smoothScrollProgress,
    [0, 0.72, 0.84, 0.98],
    ["0vh", "0vh", "2vh", "7vh"],
  );

  const mobileRotate = useTransform(
    smoothScrollProgress,
    [0, 0.72, 0.84, 0.98],
    [0, 0, -2, 8],
  );

  /*
   * =========================================
   * MOBILE PHONE — EXIT FADE
   * =========================================
   */

  const mobileOpacity = useTransform(
    smoothScrollProgress,
    [0, 0.08, 0.68, 0.74, 0.8, 0.86, 0.92, 0.98],
    [1, 1, 1, 0.92, 0.7, 0.46, 0.2, 0],
  );

  /*
   * =========================================
   * HERO — FADE OUT
   * =========================================
   */

  const heroOpacity = useTransform(
    smoothScrollProgress,
    [0, 0.72, 0.84, 0.94, 1],
    [1, 1, 0.98, 0.7, 0],
  );

  /*
   * =========================================
   * HERO — CINEMATIC SCROLL ZOOM
   * =========================================
   */

  const heroScale = useTransform(
    smoothScrollProgress,
    [0, 0.55, 0.72, 0.9, 1],
    [1, 1, 1.025, 1.075, 1.12],
  );

  /*
   * =========================================
   * HERO — VERTICAL CAMERA MOVEMENT
   * =========================================
   */

  const heroY = useTransform(
    smoothScrollProgress,
    [0, 0.72, 0.9, 1],
    ["0vh", "0vh", "-1vh", "-3vh"],
  );

  /*
   * =========================================
   * TRANSITION FADE
   * =========================================
   */

  const transitionFadeOpacity = useTransform(
    smoothScrollProgress,
    [0.72, 0.9, 1],
    [0, 0.25, 0.75],
  );

  return (
    <motion.section
      ref={heroRef}
      style={{
        opacity: heroOpacity,
      }}
      className="
        relative
        flex
        h-[100dvh]
        min-h-[680px]
        w-full
        overflow-hidden
        bg-[#080907]

        max-[850px]:h-auto
        max-[850px]:min-h-0
      "
    >
      {/* =========================================
          HERO BACKGROUND
      ========================================= */}

      <HeroBackground />

      {/* =========================================
          CINEMATIC HERO CAMERA
      ========================================= */}

      <motion.div
        style={{
          scale: heroScale,
          y: heroY,
        }}
        className="
          absolute
          inset-0
          origin-center

          max-[850px]:relative
          max-[850px]:inset-auto
          max-[850px]:h-auto
          max-[850px]:w-full
        "
      >
        {/* =========================================
            MAIN HERO CONTENT
        ========================================= */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            h-full
            w-[calc(100%-80px)]
            max-w-[1400px]
            items-center
            pt-[90px]

            min-[851px]:flex-row

            max-[850px]:h-auto
            max-[850px]:w-[calc(100%-40px)]
            max-[850px]:flex-col
            max-[850px]:items-stretch
            max-[850px]:gap-0
            max-[850px]:pb-0
            max-[850px]:pt-[125px]

            max-[550px]:w-[calc(100%-30px)]
            max-[550px]:pt-[115px]

            max-[390px]:w-[calc(100%-28px)]
            max-[390px]:pt-[110px]
          "
        >
          {/* =========================================
              HERO CONTENT
          ========================================= */}

          <div
            className="
              relative
              z-20
              w-full
              min-w-0
              flex-1

              min-[851px]:max-w-[58%]

              max-[850px]:max-w-[650px]
              max-[850px]:w-full
              max-[850px]:flex-none

              max-[550px]:max-w-full
            "
          >
            <HeroContent />
          </div>

          {/* =========================================
              DESKTOP PHONE
              
              The entrance is intentionally kept
              separate from the scroll animation.

              OUTER:
              lightweight entrance transform

              INNER:
              scroll transform only

              No nested will-change declarations.
          ========================================= */}

          <div
            className="
              relative
              z-10
              h-full
              min-h-[560px]
              w-full
              min-w-0
              flex-1

              min-[851px]:max-w-[48%]

              max-[850px]:hidden
            "
          >
            <motion.div
              initial={{
                x: "-30vw",
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                x: {
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: {
                  duration: 0.45,
                  delay: 0.15,
                  ease: "easeOut",
                },
              }}
              style={{
                transform: "translate3d(0, 0, 0)",
                willChange: "transform, opacity",
              }}
              className="
                h-full
                w-full
              "
            >
              <motion.div
                style={{
                  x: desktopX,
                  y: desktopY,
                  rotateZ: desktopRotate,
                  opacity: desktopOpacity,
                }}
                className="
                  h-full
                  w-full
                "
              >
                <HeroPhone />
              </motion.div>
            </motion.div>
          </div>

          {/* =========================================
              MOBILE PHONE
          ========================================= */}

          <div
            className="
              relative
              z-10
              mt-12
              h-[760px]
              min-h-[760px]
              w-full
              flex-none

              min-[851px]:hidden

              max-[550px]:mt-10
              max-[550px]:h-[740px]
              max-[550px]:min-h-[740px]

              max-[390px]:mt-8
              max-[390px]:h-[720px]
              max-[390px]:min-h-[720px]
            "
          >
            <motion.div
              style={{
                x: mobileX,
                y: mobileY,
                rotateZ: mobileRotate,
                opacity: mobileOpacity,
              }}
              className="
                h-full
                w-full
              "
            >
              <HeroPhone />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* =========================================
          BOTTOM CINEMATIC FADE
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-30
          h-32
          bg-gradient-to-b
          from-transparent
          to-[#080907]

          max-[550px]:h-24
          max-[390px]:h-20
        "
      />

      {/* =========================================
          SCROLL TRANSITION FADE
      ========================================= */}

      <motion.div
        style={{
          opacity: transitionFadeOpacity,
        }}
        className="
          pointer-events-none
          absolute
          inset-0
          z-40
          bg-[#080907]
        "
      />
    </motion.section>
  );
};

export default Hero;
