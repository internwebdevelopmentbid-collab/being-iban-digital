import React, { memo, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/* POINTS                                                                     */
/* -------------------------------------------------------------------------- */

const POINTS = [
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
/* ANIMATION CONSTANTS                                                        */
/* -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1];

const TRAIL_ONE_ANIMATION = {
  opacity: [0.05, 0.35, 0.05],
  scaleX: [0.5, 1, 0.5],
};

const TRAIL_TWO_ANIMATION = {
  opacity: [0.04, 0.3, 0.04],
  scaleX: [0.6, 1, 0.6],
};

/* -------------------------------------------------------------------------- */
/* POINT LIST                                                                 */
/* -------------------------------------------------------------------------- */

const PointList = memo(function PointList({ reducedMotion }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="w-full max-w-[720px]">
      <div className="mb-8 flex items-center gap-3">
        <span className="h-px w-8 bg-[#C9A45C]/70" />

        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A45C]/75 sm:text-[11px]">
          What makes us different
        </span>
      </div>

      <div className="divide-y divide-[#C9A45C]/10">
        {POINTS.map((point, index) => {
          const isActive = activeIndex === index;

          return (
            <motion.div
              key={point.number}
              className="group relative cursor-pointer py-5 sm:py-6"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              tabIndex={0}
              initial={
                reducedMotion
                  ? false
                  : {
                      opacity: 0,
                      x: -20,
                    }
              }
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: EASE,
              }}
            >
              {/* Active indicator */}

              <motion.div
                className="absolute left-0 top-0 h-full w-px origin-top bg-[#C9A45C]"
                initial={false}
                animate={{
                  scaleY: isActive ? 1 : 0,
                  opacity: isActive ? 1 : 0,
                }}
                transition={{
                  duration: reducedMotion ? 0 : 0.3,
                }}
              />

              <div className="flex items-start gap-4 pl-4 sm:gap-6 sm:pl-6">
                {/* Number */}

                <span
                  className={`
                    mt-1 shrink-0 text-[10px] font-medium tracking-[0.2em]
                    transition-colors duration-300
                    sm:text-xs
                    ${
                      isActive
                        ? "text-[#C9A45C]"
                        : "text-[#C9A45C]/35 group-hover:text-[#C9A45C]/70"
                    }
                  `}
                >
                  {point.number}
                </span>

                <div className="min-w-0 flex-1">
                  {/* Title */}

                  <div className="flex items-center justify-between gap-4">
                    <motion.h3
                      className={`
                        text-xl font-medium leading-tight tracking-[-0.035em]
                        transition-colors duration-300
                        sm:text-2xl
                        md:text-3xl
                        ${
                          isActive
                            ? "text-[#F5F3EE]"
                            : "text-[#F5F3EE]/45 group-hover:text-[#F5F3EE]/85"
                        }
                      `}
                      animate={{
                        x: isActive ? 6 : 0,
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.35,
                        ease: EASE,
                      }}
                    >
                      {point.title}
                    </motion.h3>
                  </div>

                  {/* Description */}

                  <motion.div
                    initial={false}
                    animate={{
                      height: isActive ? "auto" : 0,
                      opacity: isActive ? 1 : 0,
                      marginTop: isActive ? 12 : 0,
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.3,
                      ease: EASE,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[560px] text-sm leading-6 text-[#C9A45C]/70 sm:text-base sm:leading-7">
                      {point.text}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

const WhyChooseUs = () => {
  const reducedMotion = useReducedMotion();

  const trailOneAnimation = reducedMotion
    ? {
        opacity: 0.1,
        scaleX: 1,
      }
    : TRAIL_ONE_ANIMATION;

  const trailTwoAnimation = reducedMotion
    ? {
        opacity: 0.1,
        scaleX: 1,
      }
    : TRAIL_TWO_ANIMATION;

  return (
    <section className="relative min-h-screen bg-black text-[#F5F3EE]">
      <div className="relative min-h-screen w-full overflow-hidden bg-black">
        {/* ----------------------------------------------------------------
            AMBIENT GOLDEN GLOW
        ---------------------------------------------------------------- */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
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

        {/* ----------------------------------------------------------------
            DECORATIVE TRAILS
        ---------------------------------------------------------------- */}

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
          animate={trailOneAnimation}
          transition={{
            duration: 5,
            repeat: reducedMotion ? 0 : Infinity,
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
          animate={trailTwoAnimation}
          transition={{
            duration: 6,
            delay: 1.5,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ----------------------------------------------------------------
            CONTENT
        ---------------------------------------------------------------- */}

        <div
          className="
            relative
            z-10
            mx-auto
            grid
            min-h-screen
            max-w-[1600px]
            grid-cols-1
            items-center
            gap-16
            px-6
            py-24
            md:px-10
            lg:grid-cols-[1.15fr_0.85fr]
            lg:gap-10
            lg:px-[6vw]
            lg:py-16
          "
        >
          {/* LEFT — INTERACTIVE LIST */}

          <div className="order-2 lg:order-1">
            <PointList reducedMotion={reducedMotion} />
          </div>

          {/* RIGHT — TITLE */}

          <div className="order-1 flex items-center lg:order-2">
            <div className="w-full lg:pl-[3vw]">
              <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#C9A45C]/75">
                Why choose us?
              </p>

              <h2
                className="
                  text-[16vw]
                  font-medium
                  leading-[0.82]
                  tracking-[-0.075em]
                  text-[#F5F3EE]
                  sm:text-[13vw]
                  lg:text-[7vw]
                "
              >
                <span className="text-[#C9A45C]">Why</span>

                <br />

                <span className="whitespace-nowrap">
                  choose us
                  <span className="text-[#C9A45C]"> ?</span>
                </span>
              </h2>

              <p className="mt-8 max-w-[430px] text-sm leading-6 text-[#F5F3EE]/40 sm:text-base sm:leading-7">
                We combine creative thinking, performance marketing, and
                transparent communication to help businesses grow with
                confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
