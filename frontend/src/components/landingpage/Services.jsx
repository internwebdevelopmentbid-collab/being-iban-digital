import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import api_url from "../../config/api";

const FALLBACK_SERVICES = [
  {
    title: "Development & Creation",
    shortDescription:
      "Beautiful, fast and responsive digital experiences built to turn attention into action.",
    icon: "",
    features: [
      "Website Development",
      "Web App Development",
      "Mobile App Development",
      "E-Commerce Solution",
      "Photography & Videography",
      "Graphics Designing",
      "Branding & Designing",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* SERVICES BACKGROUND                                                        */
/* -------------------------------------------------------------------------- */

function ServicesBackground() {
  const sectionRef = useRef(null);

  const cursorX = useMotionValue(-500);
  const cursorY = useMotionValue(-500);

  const smoothX = useSpring(cursorX, {
    stiffness: 80,
    damping: 25,
    mass: 0.6,
  });

  const smoothY = useSpring(cursorY, {
    stiffness: 80,
    damping: 25,
    mass: 0.6,
  });

  useEffect(() => {
    const handlePointerMove = (event) => {
      const rect = sectionRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      cursorX.set(event.clientX - rect.left);
      cursorY.set(event.clientY - rect.top);
    };

    const element = sectionRef.current;

    if (!element) {
      return undefined;
    }

    element.addEventListener("pointermove", handlePointerMove);

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
    };
  }, [cursorX, cursorY]);

  return (
    <div
      ref={sectionRef}
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        overflow-hidden
      "
      aria-hidden="true"
    >
      <motion.div
        className="
          absolute
          h-[100px]
          w-[100px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[#c9a66b]/20
          blur-[1px]
        "
        style={{
          left: smoothX,
          top: smoothY,
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.12, 0.25, 0.12],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -left-24
          top-[12%]
          h-[280px]
          w-[280px]
          rounded-full
          bg-[#c9a66b]/10
          blur-[90px]
        "
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.2, 0.08],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="
          absolute
          -right-24
          top-[42%]
          h-[340px]
          w-[340px]
          rounded-full
          bg-[#9a7442]/10
          blur-[100px]
        "
      />

      <div
        className="
          absolute
          inset-0
          opacity-[0.13]
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(154,116,66,0.22) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(154,116,66,0.22) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "90px 90px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
      />

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          left-[8%]
          top-[18%]
          h-[260px]
          w-[260px]
          rounded-full
          border
          border-[#c9a66b]/15
        "
      >
        <span
          className="
            absolute
            left-1/2
            top-[-3px]
            h-[6px]
            w-[6px]
            -translate-x-1/2
            rounded-full
            bg-[#c9a66b]
            shadow-[0_0_18px_rgba(201,166,107,0.75)]
          "
        />
      </motion.div>

      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 55,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          right-[8%]
          bottom-[15%]
          h-[340px]
          w-[340px]
          rounded-full
          border
          border-[#9a7442]/10
        "
      >
        <span
          className="
            absolute
            right-[8%]
            top-1/2
            h-[5px]
            w-[5px]
            rounded-full
            bg-[#9a7442]
            shadow-[0_0_15px_rgba(154,116,66,0.7)]
          "
        />
      </motion.div>

      {[
        {
          left: "12%",
          top: "52%",
          delay: 0,
        },
        {
          left: "83%",
          top: "21%",
          delay: 1.2,
        },
        {
          left: "76%",
          top: "76%",
          delay: 2.1,
        },
        {
          left: "23%",
          top: "82%",
          delay: 0.8,
        },
      ].map((mark, index) => (
        <motion.div
          key={`cross-${index}`}
          className="absolute"
          style={{
            left: mark.left,
            top: mark.top,
          }}
          animate={{
            opacity: [0.25, 0.8, 0.25],
            scale: [0.85, 1.15, 0.85],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: mark.delay,
          }}
        >
          <span
            className="
              absolute
              left-1/2
              top-0
              h-8
              w-px
              -translate-x-1/2
              bg-[#c9a66b]
            "
          />

          <span
            className="
              absolute
              left-0
              top-1/2
              h-px
              w-8
              -translate-y-1/2
              bg-[#c9a66b]
            "
          />

          <span className="block h-8 w-8" />
        </motion.div>
      ))}

      <div
        className="
          absolute
          left-[4%]
          top-[35%]
          hidden
          rotate-90
          text-[7px]
          font-semibold
          uppercase
          tracking-[0.4em]
          text-[#9a7442]/35
          lg:block
        "
      >
        Strategy / Design / Technology
      </div>

      <div
        className="
          absolute
          right-[4%]
          top-[60%]
          hidden
          -rotate-90
          text-[7px]
          font-semibold
          uppercase
          tracking-[0.4em]
          text-[#9a7442]/35
          lg:block
        "
      >
        Create / Build / Scale
      </div>

      <svg
        className="
          absolute
          inset-0
          h-full
          w-full
          opacity-[0.18]
        "
        viewBox="0 0 1440 1000"
        preserveAspectRatio="none"
      >
        <path
          d="M0 280 C240 180 320 430 560 330 S950 80 1440 240"
          fill="none"
          stroke="#9a7442"
          strokeWidth="1"
        />

        <path
          d="M0 760 C280 650 390 840 650 700 S1090 530 1440 680"
          fill="none"
          stroke="#c9a66b"
          strokeWidth="1"
        />

        <path
          d="M120 0 C210 230 160 430 300 600 S510 850 690 1000"
          fill="none"
          stroke="#9a7442"
          strokeWidth="0.7"
        />

        <path
          d="M1310 0 C1200 220 1280 390 1130 570 S940 820 850 1000"
          fill="none"
          stroke="#c9a66b"
          strokeWidth="0.7"
        />
      </svg>

      {[
        ["18%", "27%", 0],
        ["72%", "30%", 0.7],
        ["38%", "68%", 1.4],
        ["88%", "62%", 2.2],
        ["58%", "84%", 1.1],
      ].map(([left, top, delay], index) => (
        <motion.div
          key={`point-${index}`}
          style={{
            left,
            top,
          }}
          animate={{
            scale: [0.7, 1.4, 0.7],
            opacity: [0.25, 0.8, 0.25],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
          className="
            absolute
            h-[5px]
            w-[5px]
            rounded-full
            bg-[#c9a66b]
            shadow-[0_0_14px_rgba(201,166,107,0.6)]
          "
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HEADING                                                                    */
/* -------------------------------------------------------------------------- */

function HeadingReveal() {
  const words = ["Services", "that", "move", "the", "brand", "forward."];

  return (
    <div
      className="
        relative
        z-10
        mx-auto
        w-full
        max-w-[1500px]
        px-6
        sm:px-10
        lg:px-16
      "
    >
      <div className="overflow-hidden">
        <motion.h2
          initial={{
            y: "110%",
          }}
          animate={{
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            flex
            flex-wrap
            gap-x-[0.2em]
            font-serif
            text-[clamp(48px,8vw,128px)]
            leading-[0.86]
            tracking-[-0.055em]
            text-[#171814]
          "
        >
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="
                inline-block
                overflow-visible
                pb-[0.08em]
              "
            >
              <motion.span
                initial={{
                  y: "110%",
                }}
                animate={{
                  y: 0,
                }}
                transition={{
                  duration: 0.75,
                  delay: 0.395 + index * 0.045,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>
      </div>

      <div className="mt-8 flex max-w-2xl items-start gap-5">
        <span
          className="
            mt-[9px]
            h-px
            w-10
            shrink-0
            bg-[#c9a66b]
          "
        />

        <p
          className="
            text-[12px]
            leading-6
            text-[#77736a]
            sm:text-[13px]
          "
        >
          Strategy, creativity and technology brought together to create work
          people notice — and businesses can measure.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FEATURE ITEM                                                               */
/* -------------------------------------------------------------------------- */

function FeatureItem({ feature, featureProgress }) {
  const y = useTransform(featureProgress, [0, 1], [18, 0]);

  return (
    <motion.div
      style={{
        y,
      }}
      className="
        flex
        items-start
        gap-2
        text-[11px]
        leading-5
        text-[#39362f]
      "
    >
      <span
        className="
          mt-[8px]
          h-[4px]
          w-[4px]
          shrink-0
          rounded-full
          bg-[#9a7442]
        "
      />

      <span>{feature}</span>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* SERVICE FOLDER                                                             */
/* -------------------------------------------------------------------------- */

function ServiceFolder({ service, index, total, progress }) {
  const segmentStart = index / total;
  const segmentEnd = (index + 1) / total;

  const segmentLength = segmentEnd - segmentStart;

  const entranceEnd = segmentStart + segmentLength * 0.12;

  const pageStart = segmentStart + segmentLength * 0.18;

  const contentStart = segmentStart + segmentLength * 0.34;

  const contentEnd = segmentStart + segmentLength * 0.48;

  const holdStart = segmentStart + segmentLength * 0.48;

  const holdEnd = segmentStart + segmentLength * 0.82;

  const exitStart = segmentStart + segmentLength * 0.82;

  const enteringFrom = "115vw";
  const exitingTo = "-115vw";

  /* ---------------------------------------------------------------------- */
  /* FOLDER POSITION                                                        */
  /* ---------------------------------------------------------------------- */

  const folderXRaw = useTransform(
    progress,
    [segmentStart, entranceEnd, holdStart, holdEnd, exitStart, segmentEnd],
    [enteringFrom, "0vw", "0vw", "0vw", "0vw", exitingTo],
  );

  const folderX = useSpring(folderXRaw, {
    stiffness: 95,
    damping: 24,
    mass: 0.9,
  });

  const folderRotateRaw = useTransform(
    progress,
    [segmentStart, entranceEnd, holdStart, holdEnd, segmentEnd],
    [3, 0, 0, 0, -3],
  );

  const folderRotate = useSpring(folderRotateRaw, {
    stiffness: 90,
    damping: 25,
    mass: 0.8,
  });

  /* ---------------------------------------------------------------------- */
  /* PAGE                                                                    */
  /* ---------------------------------------------------------------------- */

  const pageYRaw = useTransform(
    progress,
    [segmentStart, pageStart, contentStart, holdStart, holdEnd, segmentEnd],
    ["70%", "30%", "0%", "0%", "0%", "70%"],
  );

  const pageY = useSpring(pageYRaw, {
    stiffness: 85,
    damping: 26,
    mass: 0.9,
  });

  const pageScaleRaw = useTransform(
    progress,
    [segmentStart, pageStart, contentStart, holdStart, holdEnd, segmentEnd],
    [0.88, 0.96, 1, 1, 1, 0.88],
  );

  const pageScale = useSpring(pageScaleRaw, {
    stiffness: 85,
    damping: 26,
    mass: 0.9,
  });

  const pageRotateRaw = useTransform(
    progress,
    [segmentStart, pageStart, contentStart, holdStart, holdEnd, segmentEnd],
    [3, 1, 0, 0, 0, -2.5],
  );

  const pageRotate = useSpring(pageRotateRaw, {
    stiffness: 80,
    damping: 25,
    mass: 0.85,
  });

  /* ---------------------------------------------------------------------- */
  /* CONTENT                                                                 */
  /* ---------------------------------------------------------------------- */

  const contentY = useTransform(
    progress,
    [contentStart, contentEnd, holdStart, holdEnd, segmentEnd],
    [35, 0, 0, 0, 35],
  );

  const featureProgress = useTransform(
    progress,
    [contentEnd, holdStart],
    [0, 1],
  );

  return (
    <motion.article
      style={{
        x: folderX,
        rotate: folderRotate,
      }}
      className="
        pointer-events-none
        absolute
        left-1/2
        top-1/2
        h-[700px]
        w-[min(94vw,900px)]
        -translate-x-1/2
        -translate-y-1/2
        sm:h-[760px]
        lg:h-[820px]
      "
    >
      {/* FOLDER */}

      <div
        className="
          absolute
          bottom-[1%]
          left-1/2
          h-[65%]
          w-[98%]
          -translate-x-1/2
        "
      >
        <div
          className="
            absolute
            left-[7%]
            top-0
            z-0
            h-[92px]
            w-[38%]
            rounded-t-[30px]
            bg-[#b3ac9f]
            sm:h-[108px]
          "
        />

        <div
          className="
            absolute
            inset-0
            overflow-hidden
            rounded-[32px]
            bg-[#aaa397]
            shadow-[0_40px_100px_rgba(55,43,28,0.22)]
          "
        >
          <div
            className="
              absolute
              inset-x-0
              top-0
              h-[105px]
              bg-[#bbb3a6]
            "
          />

          <div
            className="
              absolute
              inset-x-[7%]
              top-[101px]
              h-px
              bg-[#8f693c]/55
            "
          />

          <div
            className="
              absolute
              right-8
              top-8
              h-6
              w-6
              rounded-full
              border
              border-[#9a7442]/35
              sm:right-11
            "
          />

          <div
            className="
              absolute
              bottom-9
              left-9
              flex
              items-center
              gap-3
              sm:left-12
            "
          >
            <span
              className="
                h-[6px]
                w-[6px]
                rounded-full
                bg-[#9a7442]
                shadow-[0_0_12px_rgba(154,116,66,0.5)]
              "
            />

            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#4f493f]
              "
            >
              Being IBAN Digital
            </span>
          </div>

          <div
            className="
              absolute
              bottom-7
              right-9
              font-serif
              text-5xl
              leading-none
              text-[#806039]/55
              sm:right-12
              sm:text-6xl
            "
          >
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* PAGE */}

      <motion.div
        style={{
          y: pageY,
          scale: pageScale,
          rotate: pageRotate,
        }}
        className="
          absolute
          left-1/2
          top-[3%]
          z-20
          h-[91%]
          w-[88%]
          -translate-x-1/2
          overflow-hidden
          rounded-[9px]
          bg-[#f5f2eb]
          shadow-[0_40px_100px_rgba(35,28,18,0.22)]
          sm:w-[80%]
          lg:w-[72%]
        "
      >
        <div
          className="
            absolute
            inset-y-0
            left-0
            w-[5px]
            bg-[#c9a66b]
          "
        />

        <div
          className="
            absolute
            left-8
            right-8
            top-9
            h-px
            bg-[#8d6c42]/20
            sm:left-11
            sm:right-11
            sm:top-10
          "
        />

        <motion.div
          style={{
            y: contentY,
          }}
          className="
            relative
            flex
            h-full
            flex-col
            px-9
            pb-9
            pt-14
            sm:px-12
            sm:pt-16
            lg:px-16
            lg:pt-18
          "
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.32em]
                  text-[#8a7355]
                "
              >
                Service / {String(index + 1).padStart(2, "0")}
              </p>

              <div
                className="
                  mt-3
                  h-px
                  w-14
                  bg-[#c9a66b]
                "
              />
            </div>

            <span
              className="
                font-serif
                text-4xl
                leading-none
                text-[#9a7442]/55
                sm:text-5xl
              "
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Static logo — no pop-out animation */}

          <div
            className="
              mt-9
              flex
              h-[82px]
              w-[82px]
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-[20px]
              border
              border-[#9a7442]/25
              bg-[#e8e2d7]
              shadow-[0_14px_35px_rgba(80,60,35,0.12)]
              sm:mt-11
              sm:h-[92px]
              sm:w-[92px]
            "
          >
            {service.icon ? (
              <img
                src={service.icon}
                alt=""
                className="
                  h-full
                  w-full
                  object-cover
                "
                loading="lazy"
              />
            ) : (
              <span
                className="
                  font-serif
                  text-4xl
                  text-[#8d6b3e]
                  sm:text-5xl
                "
              >
                {service.title?.charAt(0) || "S"}
              </span>
            )}
          </div>

          <h3
            className="
              mt-8
              max-w-[680px]
              font-serif
              text-[42px]
              font-normal
              leading-[0.94]
              tracking-[-0.045em]
              text-[#201f1b]
              sm:mt-9
              sm:text-[56px]
              lg:text-[66px]
            "
          >
            {service.title}
          </h3>

          <p
            className="
              mt-6
              max-w-[570px]
              text-[13px]
              leading-6
              text-[#69645b]
              sm:mt-7
              sm:text-[14px]
              lg:text-[15px]
            "
          >
            {service.shortDescription}
          </p>

          <div
            className="
              mt-auto
              border-t
              border-[#8f693c]/20
              pt-6
              sm:pt-7
            "
          >
            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#8a7355]
                "
              >
                What we deliver
              </p>

              <span
                className="
                  h-px
                  w-10
                  bg-[#c9a66b]
                "
              />
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-x-10
                gap-y-2.5
                sm:grid-cols-2
              "
            >
              {(service.features || []).map((feature, featureIndex) => (
                <FeatureItem
                  key={`${feature}-${featureIndex}`}
                  feature={feature}
                  featureProgress={featureProgress}
                />
              ))}
            </div>
          </div>

          <div
            className="
              mt-6
              flex
              items-center
              justify-between
              border-t
              border-[#8f693c]/10
              pt-4
            "
          >
            <span
              className="
                text-[8px]
                uppercase
                tracking-[0.24em]
                text-[#9a9489]
              "
            >
              Strategy / Creation / Growth
            </span>

            <span
              className="
                text-[8px]
                uppercase
                tracking-[0.24em]
                text-[#9a9489]
              "
            >
              Being IBAN Digital
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/* SERVICES TRACK                                                             */
/* -------------------------------------------------------------------------- */

function ServicesTrack({ services }) {
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  /*
   * The service cards finish their animation
   * before the black transition begins.
   */

  const serviceProgress = useTransform(scrollYProgress, [0, 0.86], [0, 1]);

  /*
   * Smooth black transition.
   *
   * It starts before the very end, giving the
   * final card enough time to disappear naturally
   * beneath the darkening layer.
   *
   * The final portion stays black so the next
   * section does not flash through.
   */

  const endBlackOpacity = useTransform(
    scrollYProgress,
    [0.82, 0.87, 0.92, 0.96, 1],
    [0, 0.08, 0.28, 0.68, 1],
  );

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{
        minHeight: `${Math.max(320, services.length * 300)}vh`,
      }}
    >
      <div
        className="
          sticky
          top-0
          flex
          h-screen
          items-center
          overflow-hidden
          bg-white
        "
      >
        <ServicesBackground />

        {/* Top labels */}

        <div
          className="
            pointer-events-none
            absolute
            left-6
            right-6
            top-7
            z-50
            flex
            items-center
            justify-between
            sm:left-10
            sm:right-10
            lg:left-16
            lg:right-16
          "
        >
          <span
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.3em]
              text-[#8a7355]
            "
          >
            Our services
          </span>

          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.24em]
              text-[#aaa49a]
            "
          >
            Scroll to explore
          </span>
        </div>

        {/* Service stage */}

        <div
          className="
            relative
            z-10
            h-full
            w-full
          "
        >
          {services.map((service, index) => (
            <ServiceFolder
              key={service._id || `${service.title}-${index}`}
              service={service}
              index={index}
              total={services.length}
              progress={serviceProgress}
            />
          ))}
        </div>

        {/* ================================================================
            SMOOTH BLACK END TRANSITION
        ================================================================= */}

        <motion.div
          aria-hidden="true"
          style={{
            opacity: endBlackOpacity,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            z-[100]
            bg-[#080907]
            will-change-[opacity]
          "
        />

        {/* Bottom labels */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-7
            left-6
            right-6
            z-[110]
            flex
            items-center
            justify-between
            sm:left-10
            sm:right-10
            lg:left-16
            lg:right-16
          "
        >
          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.24em]
              text-[#aaa49a]
            "
          >
            Being IBAN Digital
          </span>

          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.24em]
              text-[#aaa49a]
            "
          >
            {String(services.length).padStart(2, "0")} Services
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      try {
        const response = await fetch(`${api_url}/api/website/services`);

        if (!response.ok) {
          throw new Error(`Services request failed: ${response.status}`);
        }

        const data = await response.json();

        const nextServices = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.services)
              ? data.services
              : [];

        if (!cancelled) {
          setServices(nextServices);
        }
      } catch (error) {
        console.error("Services loading error:", error);

        if (!cancelled) {
          setServices(FALLBACK_SERVICES);
        }
      }
    };

    loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayServices = services.length > 0 ? services : FALLBACK_SERVICES;

  return (
    <section
      className="
        relative
        bg-white
        text-[#171814]
      "
    >
      {/* HEADING */}

      <div
        className="
          relative
          flex
          min-h-[72vh]
          items-center
          bg-white
          pt-40
          pb-28
          sm:min-h-[78vh]
          sm:pt-52
          sm:pb-36
          lg:pt-[200px]
        "
      >
        <HeadingReveal />
      </div>

      {/* SERVICES */}

      <ServicesTrack services={displayServices} />

      {/* FINAL BLACK AREA */}

      <div
        className="
          min-h-[34vh]
          bg-[#080907]
        "
        aria-hidden="true"
      />
    </section>
  );
}
