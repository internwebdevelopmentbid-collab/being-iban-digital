import { motion } from "framer-motion";

const PackageBentoCard = ({ packageData, isActive, onHover }) => {
  const Icon = packageData.icon;

  const smoothTransition = {
    duration: 0.75,
    ease: [0.22, 1, 0.36, 1],
  };

  const softTransition = {
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <motion.article
      onMouseEnter={() => onHover(packageData.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(packageData.id)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      animate={{
        y: isActive ? -7 : 0,
      }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        group
        relative
        h-full
        min-h-[700px]
        overflow-hidden
        border
        outline-none
        transition-[border-color,box-shadow,background-color]
        duration-700
        ease-[cubic-bezier(0.22,1,0.36,1)]

        ${
          isActive
            ? `
              border-[#c9a66b]/75
              bg-[#090a08]/[0.38]
              shadow-[0_0_50px_rgba(201,166,107,0.12),inset_0_0_90px_rgba(201,166,107,0.025)]
            `
            : `
              border-[#292722]
              bg-[#090a08]/[0.22]
              hover:border-[#c9a66b]/45
            `
        }

        backdrop-blur-[1px]

        max-[1100px]:min-h-[680px]
        max-[900px]:min-h-[650px]
        max-[767px]:min-h-[700px]
        max-[600px]:min-h-[680px]
        max-[480px]:min-h-[650px]
      `}
    >
      {/* ================================================================
          ACTIVE AMBIENT GLOW
      ================================================================ */}

      <motion.div
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.88,
        }}
        transition={softTransition}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[30%]
          h-[380px]
          w-[380px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#c9a66b]/[0.045]
          blur-[110px]
        "
      />

      {/* ================================================================
          SECONDARY AMBIENT GLOW
      ================================================================ */}

      <motion.div
        animate={{
          opacity: isActive ? 0.55 : 0,
          scale: isActive ? 1 : 0.8,
        }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[42%]
          h-[260px]
          w-[260px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#c9a66b]/[0.035]
          blur-[90px]
        "
      />

      {/* ================================================================
          ACTIVE TOP LINE
      ================================================================ */}

      <motion.div
        animate={{
          scaleX: isActive ? 1 : 0,
          opacity: isActive ? 1 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute
          left-0
          right-0
          top-0
          z-20
          h-px
          origin-center
          bg-[#c9a66b]
        "
      />

      {/* ================================================================
          CONTENT
      ================================================================ */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          flex-col
          p-[38px]
          sm:p-[42px]
          lg:p-[46px]
          xl:p-[50px]
        "
      >
        {/* ================================================================
            HEADER
        ================================================================ */}

        <div className="flex items-center justify-between">
          <motion.span
            animate={{
              color: isActive ? "#c9a66b" : "#87683f",
            }}
            transition={smoothTransition}
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.34em]
            "
          >
            Package
          </motion.span>

          <span
            className="
              font-sans
              text-[11px]
              tracking-[0.28em]
              text-[#57534c]
            "
          >
            {packageData.number}
          </span>
        </div>

        {/* ================================================================
            ICON
        ================================================================ */}

        <div
          className="
            relative
            mt-[58px]
            flex
            items-center
            justify-center
            sm:mt-[64px]
            lg:mt-[70px]
          "
        >
          <motion.div
            animate={{
              scale: isActive ? 1.08 : 1,
              y: isActive ? -5 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20,
              mass: 0.8,
            }}
            className="
              relative
              flex
              h-[155px]
              w-[155px]
              items-center
              justify-center
              sm:h-[165px]
              sm:w-[165px]
              lg:h-[180px]
              lg:w-[180px]
            "
          >
            {/* ---------------------------------------------
                PULSING ICON GLOW
            --------------------------------------------- */}

            <motion.span
              animate={{
                opacity: isActive ? [0.12, 0.38, 0.12] : 0,
                scale: isActive ? [0.76, 1.12, 0.76] : 0.76,
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute
                inset-[15px]
                rounded-full
                bg-[#c9a66b]/[0.10]
                blur-[30px]
              "
            />

            {/* ---------------------------------------------
                ICON RING
            --------------------------------------------- */}

            <motion.div
              animate={{
                opacity: isActive ? 0.58 : 0.18,
                scale: isActive ? 1.025 : 1,
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                absolute
                inset-[19px]
                rounded-full
                border
                border-[#c9a66b]/30
              "
            />

            {/* ---------------------------------------------
                ICON
            --------------------------------------------- */}

            <motion.div
              animate={{
                scale: isActive ? 1.04 : 1,
                rotate: isActive ? 0 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 22,
                mass: 0.7,
              }}
              className="relative z-10"
            >
              <Icon
                size={92}
                strokeWidth={0.85}
                className={`
                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.22,1,0.36,1)]

                  ${
                    isActive
                      ? `
                        text-[#f0d39a]
                        drop-shadow-[0_0_10px_rgba(201,166,107,0.9)]
                        drop-shadow-[0_0_32px_rgba(201,166,107,0.48)]
                      `
                      : `
                        text-[#a27c49]
                      `
                  }
                `}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ================================================================
            TITLE / DESCRIPTION
        ================================================================ */}

        <div className="mt-auto">
          <motion.h3
            animate={{
              x: isActive ? 7 : 0,
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`
              font-display
              text-[clamp(58px,6vw,90px)]
              font-normal
              leading-[0.8]
              tracking-[-0.07em]
              transition-colors
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]

              ${isActive ? "text-[#f5f3ee]" : "text-[#d6d2ca]"}
            `}
          >
            {packageData.name}
          </motion.h3>

          <p
            className="
              mt-[24px]
              max-w-[450px]
              text-[14px]
              font-light
              leading-[1.75]
              text-[#77736b]
              sm:text-[15px]
            "
          >
            {packageData.description}
          </p>
        </div>

        {/* ================================================================
            FEATURES
        ================================================================ */}

        <div
          className="
            mt-[30px]
            border-t
            border-[#292722]
            pt-[25px]
          "
        >
          <div className="space-y-[15px]">
            {packageData.features.map((feature, index) => (
              <motion.div
                key={`${feature}-${index}`}
                animate={{
                  x: isActive ? 5 : 0,
                }}
                transition={{
                  duration: 0.65,
                  delay: isActive ? index * 0.035 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  flex
                  items-start
                  gap-[13px]
                "
              >
                <motion.span
                  animate={{
                    scale: isActive ? 1 : 0.9,
                    opacity: isActive ? 1 : 0.75,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: isActive ? index * 0.035 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`
                    mt-[8px]
                    h-[7px]
                    w-[7px]
                    shrink-0
                    rounded-full
                    transition-colors
                    duration-700

                    ${
                      isActive
                        ? `
                          bg-[#c9a66b]
                          shadow-[0_0_10px_rgba(201,166,107,0.85)]
                        `
                        : `
                          bg-[#7b674a]
                        `
                    }
                  `}
                />

                <motion.span
                  animate={{
                    color: isActive ? "#d9d4ca" : "#99938a",
                  }}
                  transition={{
                    duration: 0.65,
                    delay: isActive ? index * 0.035 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    text-[13px]
                    font-light
                    leading-[1.55]
                    sm:text-[14px]
                    lg:text-[14px]
                    xl:text-[15px]
                  "
                >
                  {feature}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================================================================
            FOOTER
        ================================================================ */}

        <div
          className="
            mt-[27px]
            flex
            items-center
            justify-between
          "
        >
          <motion.span
            animate={{
              color: isActive ? "#9a7442" : "#4e4b45",
            }}
            transition={smoothTransition}
            className="
              text-[9px]
              uppercase
              tracking-[0.3em]
            "
          >
            Tailored strategy
          </motion.span>

          <motion.span
            animate={{
              x: isActive ? 6 : 0,
              color: isActive ? "#c9a66b" : "#5d5951",
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              text-[24px]
              leading-none
            "
          >
            →
          </motion.span>
        </div>
      </div>

      {/* ================================================================
          ACTIVE CORNER DOT
      ================================================================ */}

      <motion.span
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute
          bottom-[22px]
          right-[22px]
          z-20
          h-[7px]
          w-[7px]
          rounded-full
          bg-[#c9a66b]
          shadow-[0_0_14px_rgba(201,166,107,0.85)]
        "
      />
    </motion.article>
  );
};

export default PackageBentoCard;
