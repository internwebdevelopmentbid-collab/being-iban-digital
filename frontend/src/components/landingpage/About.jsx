import { motion, useReducedMotion } from "framer-motion";

const AboutUs = () => {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="
        relative
        overflow-x-clip
        py-30
      "
      aria-labelledby="about-us-heading"
    >
      {/* Ambient background */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
        aria-hidden="true"
      >
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

      {/* Content */}

      <div
        className="
          relative
          flex
          min-h-[650px]
          items-center
          overflow-hidden
          px-6
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
          {/* LEFT */}

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
                    text-[#c9a66b]
                  "
                >
                  ABOUT US
                </p>
              </div>

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
                    text-[#c9a66b]
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

          {/* RIGHT */}

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
                  text-[#c9a66b]
                "
              >
                Digital experiences / 01
              </span>
            </div>

            {/* ORIGINAL STATIC PARAGRAPH */}

            <div
              className="
                max-w-[900px]
                font-serif
                text-[clamp(30px,4.4vw,64px)]
                font-normal
                leading-[1.08]
                tracking-[-0.045em]
                text-[#d8d1c4]
              "
            >
              We build digital experiences that bring brands to life. From
              strategy and identity to design, development, and content, we
              create meaningful digital worlds that connect businesses with
              people and turn attention into lasting relationships.
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

        {/* Editorial grid */}

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
