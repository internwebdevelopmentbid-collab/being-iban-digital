import { motion } from "framer-motion";

import PackageBento from "./PackageBento";

const PackagesSection = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#080907]
        px-[22px]
        py-[120px]
        text-[#f5f3ee]
        sm:px-[40px]
        sm:py-[150px]
        lg:px-[60px]
        lg:py-[180px]
      "
    >
      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1400px]
        "
      >
        {/* ================================================================
            HEADER
        ================================================================ */}

        <div
          className="
            grid
            grid-cols-1
            gap-[45px]
            lg:grid-cols-[0.65fr_1.35fr]
            lg:gap-[80px]
          "
        >
          {/* ============================================================
              LEFT META
          ============================================================ */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              flex
              items-start
              gap-[14px]
            "
          >
            <span className="mt-[6px] h-px w-[38px] bg-[#c9a66b]" />

            <div>
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.32em]
                  text-[#c9a66b]
                "
              >
                Our packages
              </p>

              <p
                className="
                  mt-[13px]
                  text-[8px]
                  uppercase
                  tracking-[0.28em]
                  text-[#4f4b44]
                "
              >
                Being IBAN Digital
              </p>
            </div>
          </motion.div>

          {/* ============================================================
              RIGHT HEADING
          ============================================================ */}

          <div>
            <motion.h2
              initial={{
                opacity: 0,
                y: 85,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                max-w-[950px]
                font-display
                text-[clamp(52px,7vw,105px)]
                font-normal
                leading-[0.84]
                tracking-[-0.065em]
                text-[#f5f3ee]
              "
            >
              Choose the right
              <br />
              <span className="text-[#c9a66b]">direction.</span>
            </motion.h2>

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.75,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                mt-[28px]
                flex
                flex-col
                gap-[8px]
                sm:flex-row
                sm:items-center
                sm:gap-[20px]
              "
            >
              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#77736b]
                "
              >
                Build
              </span>

              <span className="hidden h-px w-[24px] bg-[#292722] sm:block" />

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#77736b]
                "
              >
                Dominate
              </span>

              <span className="hidden h-px w-[24px] bg-[#292722] sm:block" />

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#77736b]
                "
              >
                Improve
              </span>
            </motion.div>
          </div>
        </div>

        {/* ================================================================
            DIVIDER
        ================================================================ */}

        <motion.div
          initial={{
            scaleX: 0,
          }}
          whileInView={{
            scaleX: 1,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 1,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            mt-[75px]
            h-px
            w-full
            origin-left
            bg-[#292722]
            sm:mt-[95px]
          "
        />

        {/* ================================================================
            BENTO
        ================================================================ */}

        <div className="mt-[28px] sm:mt-[35px]">
          <PackageBento />
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
