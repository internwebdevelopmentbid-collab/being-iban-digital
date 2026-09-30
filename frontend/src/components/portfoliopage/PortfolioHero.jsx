import { motion } from "framer-motion";

import PortfolioInteractiveCanvas from "./PortfolioInteractiveCanvas";

const PortfolioHero = ({ media = [] }) => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden border-b border-[#292722]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[15%] h-[420px] w-[420px] rounded-full bg-[#c9a66b]/[0.035] blur-[140px]" />

        <div className="absolute right-[5%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#9a7442]/[0.025] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#f5f3ee 1px, transparent 1px), linear-gradient(90deg, #f5f3ee 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-[1600px] items-center px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-24">
        <div className="relative z-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[#c9a66b]" />

              <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.34em] text-[#c9a66b]">
                Our Works
              </span>
            </div>

            <h1 className="font-sans text-[clamp(4rem,11vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.075em] text-[#f5f3ee]">
              Our
              <br />
              <span className="text-[#c9a66b]">Works</span>
            </h1>

            <p className="mt-10 max-w-xl font-sans text-sm leading-7 text-[#a7a39b] sm:text-base lg:text-lg">
              We build digital identities, experiences, campaigns, and content
              that give brands something worth remembering.
            </p>

            <div className="mt-10 flex items-center gap-5">
              <div className="flex h-10 w-10 items-center justify-center border border-[#292722] text-[#c9a66b]">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.5 2V13" stroke="currentColor" strokeWidth="1" />
                  <path
                    d="M3.5 9L7.5 13L11.5 9"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              <span className="font-sans text-[9px] font-medium uppercase tracking-[0.22em] text-[#77746e]">
                Explore the work
              </span>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-16 min-h-[480px] lg:mt-0 lg:min-h-[680px]">
          <PortfolioInteractiveCanvas media={media} />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-between px-5 pb-5 sm:px-8 lg:px-12">
        <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-[#55534e]">
          BEING IBAN DIGITAL
        </span>

        <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-[#55534e]">
          01 / 03
        </span>
      </div>
    </section>
  );
};

export default PortfolioHero;
