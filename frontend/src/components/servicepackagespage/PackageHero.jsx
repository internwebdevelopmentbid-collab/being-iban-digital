import { motion, useReducedMotion } from "framer-motion";

const PackageHero = ({ packageData }) => {
  const shouldReduceMotion = useReducedMotion();

  const reveal = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 35,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="relative isolate overflow-hidden bg-black text-[#F5F3EE]">
      {/* Background atmosphere */}

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[8%] top-[18%] h-[400px] w-[400px] rounded-full bg-[#c9a66b]/[0.055] blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,166,107,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,166,107,0.025)_1px,transparent_1px)] bg-[size:90px_90px] opacity-30" />

        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#c9a66b]/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-[1500px] px-6 pb-20 pt-20 sm:px-10 sm:pb-24 sm:pt-24 lg:px-16 lg:pb-32 lg:pt-28">
        {/* Top label */}

        <motion.div
          variants={reveal}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-center gap-4"
        >
          <span className="h-px w-10 bg-[#c9a66b]" />

          <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#c9a66b] sm:text-[10px]">
            Our Digital Growth Packages
          </span>
        </motion.div>

        {/* Main hero */}

        <div className="mt-16 lg:mt-20">
          {/* Package content */}

          <div className="max-w-[1050px]">
            <motion.div
              variants={reveal}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.85,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-8 flex items-center gap-4"
            >
              <span className="text-[11px] tracking-[0.3em] text-[#81796c]">
                PACKAGE {packageData.number}
              </span>

              <span className="h-px w-12 bg-[#39342b]" />

              <span className="text-[10px] uppercase tracking-[0.25em] text-[#81796c]">
                {packageData.objective}
              </span>
            </motion.div>

            <motion.h1
              variants={reveal}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 1,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-display text-[clamp(76px,12vw,160px)] font-normal leading-[0.78] tracking-[-0.085em] text-[#F5F3EE]"
            >
              {packageData.name}
              <span className="text-[#c9a66b]">.</span>
            </motion.h1>

            <motion.p
              variants={reveal}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.85,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-9 max-w-[750px] font-display text-[clamp(21px,2.7vw,34px)] font-light leading-[1.35] tracking-[-0.025em] text-[#c9a66b]"
            >
              {packageData.tagline}
            </motion.p>

            <motion.p
              variants={reveal}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.85,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 max-w-[700px] text-[13px] font-light leading-[2] text-[#969087] sm:text-[14px]"
            >
              {packageData.description}
            </motion.p>
          </div>
        </div>

        {/* Bottom information */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{
            duration: 0.8,
            delay: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-20 grid grid-cols-1 gap-8 border-t border-[#292722] pt-8 sm:grid-cols-2 sm:gap-12 lg:mt-24 lg:grid-cols-[1fr_1fr]"
        >
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8d6d42]">
              Designed for
            </span>

            <p className="mt-4 max-w-[420px] text-[13px] leading-[1.8] text-[#b1aaa0] sm:text-[14px]">
              {packageData.bestFor}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8d6d42]">
              Primary objective
            </span>

            <p className="mt-4 font-display text-[30px] tracking-[-0.04em] text-[#e8d5b5] sm:text-[36px]">
              {packageData.objective}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PackageHero;
