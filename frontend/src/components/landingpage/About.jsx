import { Fragment, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const ABOUT_TEXT =
  "We build digital experiences that bring brands to life. From strategy and identity to design, development, and content, we create meaningful digital worlds that connect businesses with people and turn attention into lasting relationships.";

const START_OPACITY = 0.15;
const SPREAD = 0.8;
const WORD_DURATION = 0.2;

const getWordProgressRange = (index, count) => {
  const start = count <= 1 ? 0 : (index / (count - 1)) * SPREAD;

  return {
    start,
    end: Math.min(1, start + WORD_DURATION),
  };
};

const getWordOpacity = (
  progress,
  { start, end },
  startOpacity = START_OPACITY,
) => {
  if (progress <= start) {
    return startOpacity;
  }

  if (progress >= end) {
    return 1;
  }

  const wordProgress = (progress - start) / (end - start);

  return startOpacity + (1 - startOpacity) * wordProgress;
};

const AboutWord = ({ children, progress, index, count, reducedMotion }) => {
  const range = getWordProgressRange(index, count);

  const opacity = useTransform(progress, (latest) =>
    getWordOpacity(latest, range),
  );

  return (
    <motion.span
      aria-hidden="true"
      style={
        reducedMotion
          ? undefined
          : {
              opacity,
            }
      }
    >
      {children}
    </motion.span>
  );
};

const AboutUs = () => {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const words = ABOUT_TEXT.split(" ");

  return (
    <section
      ref={sectionRef}
      className="
        relative
        min-h-[220vh]
        overflow-x-clip
        bg-white
        text-[#171814]
      "
      aria-labelledby="about-us-heading"
    >
      {/* ================================================================
          AMBIENT GOLDEN DOTS
      ================================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
        aria-hidden="true"
      >
        {/* Top left cluster */}

        <motion.div
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [0.25, 0.7, 0.25],
                  scale: [0.85, 1.15, 0.85],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="
            absolute
            left-[8%]
            top-[16%]
            h-[7px]
            w-[7px]
            rounded-full
            bg-[#c9a66b]
            shadow-[0_0_18px_rgba(201,166,107,0.55)]
          "
        />

        <motion.div
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [0.15, 0.55, 0.15],
                  scale: [0.8, 1.25, 0.8],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 5.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                }
          }
          className="
            absolute
            left-[15%]
            top-[23%]
            h-[4px]
            w-[4px]
            rounded-full
            bg-[#9a7442]
            shadow-[0_0_14px_rgba(154,116,66,0.45)]
          "
        />

        <motion.div
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [0.2, 0.65, 0.2],
                  scale: [0.75, 1.2, 0.75],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }
          }
          className="
            absolute
            left-[22%]
            top-[12%]
            h-[5px]
            w-[5px]
            rounded-full
            bg-[#c9a66b]
            shadow-[0_0_16px_rgba(201,166,107,0.5)]
          "
        />

        {/* Right cluster */}

        <motion.div
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [0.18, 0.65, 0.18],
                  scale: [0.8, 1.2, 0.8],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }
          }
          className="
            absolute
            right-[9%]
            top-[24%]
            h-[6px]
            w-[6px]
            rounded-full
            bg-[#c9a66b]
            shadow-[0_0_18px_rgba(201,166,107,0.55)]
          "
        />

        <motion.div
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [0.15, 0.55, 0.15],
                  scale: [0.75, 1.2, 0.75],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.8,
                }
          }
          className="
            absolute
            right-[17%]
            top-[15%]
            h-[4px]
            w-[4px]
            rounded-full
            bg-[#9a7442]
            shadow-[0_0_13px_rgba(154,116,66,0.45)]
          "
        />

        <motion.div
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [0.2, 0.7, 0.2],
                  scale: [0.8, 1.25, 0.8],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.6,
                }
          }
          className="
            absolute
            right-[24%]
            top-[30%]
            h-[5px]
            w-[5px]
            rounded-full
            bg-[#c9a66b]
            shadow-[0_0_15px_rgba(201,166,107,0.5)]
          "
        />

        {/* Lower dots */}

        <motion.div
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [0.15, 0.6, 0.15],
                  scale: [0.8, 1.2, 0.8],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 4.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }
          }
          className="
            absolute
            bottom-[24%]
            left-[12%]
            h-[5px]
            w-[5px]
            rounded-full
            bg-[#9a7442]
            shadow-[0_0_15px_rgba(154,116,66,0.45)]
          "
        />

        <motion.div
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [0.2, 0.7, 0.2],
                  scale: [0.75, 1.2, 0.75],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 5.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }
          }
          className="
            absolute
            bottom-[18%]
            right-[13%]
            h-[6px]
            w-[6px]
            rounded-full
            bg-[#c9a66b]
            shadow-[0_0_18px_rgba(201,166,107,0.5)]
          "
        />

        <motion.div
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [0.12, 0.5, 0.12],
                  scale: [0.8, 1.15, 0.8],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 4.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.2,
                }
          }
          className="
            absolute
            bottom-[30%]
            right-[28%]
            h-[4px]
            w-[4px]
            rounded-full
            bg-[#9a7442]
            shadow-[0_0_13px_rgba(154,116,66,0.4)]
          "
        />

        {/* Soft ambient glows */}

        <div
          className="
            absolute
            left-[-120px]
            top-[8%]
            h-[360px]
            w-[360px]
            rounded-full
            bg-[#c9a66b]/[0.045]
            blur-[110px]
          "
        />

        <div
          className="
            absolute
            right-[-140px]
            bottom-[8%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#9a7442]/[0.04]
            blur-[120px]
          "
        />
      </div>

      {/* ================================================================
          STICKY CONTENT STAGE
      ================================================================= */}

      <div
        className="
          sticky
          top-0
          flex
          min-h-screen
          items-center
          overflow-hidden
          px-6
          py-20
          sm:px-10
          lg:px-16
        "
      >
        <div
          className="
            relative
            z-10
            mx-auto
            grid
            w-full
            max-w-[1500px]
            grid-cols-1
            gap-14
            lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.8fr)]
            lg:items-center
            lg:gap-20
          "
        >
          {/* ============================================================
              LEFT — TITLE
          ============================================================ */}

          <div>
            <motion.div
              initial={
                reducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 24,
                    }
              }
              animate={
                reducedMotion
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="
                    h-px
                    w-10
                    bg-[#c9a66b]
                    sm:w-14
                  "
                />

                <p
                  className="
                    font-sans
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.32em]
                    text-[#8c653c]
                  "
                >
                  ABOUT US
                </p>
              </div>

              {/* ========================================================
                  TITLE REVEAL
              ======================================================== */}

              <div className="mt-7 overflow-visible">
                <motion.h2
                  id="about-us-heading"
                  initial={
                    reducedMotion
                      ? false
                      : {
                          opacity: 0,
                          y: "110%",
                          scale: 0.92,
                        }
                  }
                  animate={
                    reducedMotion
                      ? undefined
                      : {
                          opacity: 1,
                          y: "0%",
                          scale: 1,
                        }
                  }
                  transition={{
                    duration: 1.15,
                    delay: 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="
                    origin-left
                    font-serif
                    text-[clamp(46px,6vw,88px)]
                    font-normal
                    leading-[0.9]
                    tracking-[-0.055em]
                    text-[#8c653c]
                    will-change-transform
                  "
                >
                  About
                  <br />
                  Being Iban
                  <br />
                  Digital
                </motion.h2>
              </div>
            </motion.div>
          </div>

          {/* ============================================================
              RIGHT — WORD SCROLL REVEAL
          ============================================================ */}

          <div className="relative">
            <div
              className="
                mb-7
                flex
                items-center
                gap-4
              "
            >
              <span
                className="
                  h-px
                  w-8
                  bg-[#c9a66b]
                "
              />

              <span
                className="
                  font-sans
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#9a7442]
                "
              >
                Digital experiences / 01
              </span>
            </div>

            <div
              className="
                max-w-[900px]
                font-serif
                text-[clamp(30px,4.4vw,64px)]
                font-normal
                leading-[1.08]
                tracking-[-0.045em]
                text-[#171814]
              "
              aria-label={ABOUT_TEXT}
            >
              {words.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  <AboutWord
                    progress={scrollYProgress}
                    index={index}
                    count={words.length}
                    reducedMotion={Boolean(reducedMotion)}
                  >
                    {word}
                  </AboutWord>

                  {index < words.length - 1 ? " " : null}
                </Fragment>
              ))}
            </div>

            <div
              className="
                mt-10
                flex
                items-center
                gap-4
              "
            >
              <span
                className="
                  h-px
                  w-16
                  bg-[#c9a66b]/60
                "
              />

              <span
                className="
                  font-sans
                  text-[8px]
                  uppercase
                  tracking-[0.28em]
                  text-[#9a9489]
                "
              >
                Strategy / Identity / Design / Development / Content
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================
            SUBTLE EDITORIAL GRID
        ================================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.035]
          "
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(#8c653c 1px, transparent 1px), linear-gradient(90deg, #8c653c 1px, transparent 1px)",
            backgroundSize: "90px 90px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
          }}
        />
      </div>
    </section>
  );
};

export default AboutUs;
