import { motion, useReducedMotion } from "framer-motion";
import OutlineButton from "../global/OutlineButton";

const EASE_STANDARD = [0.22, 1, 0.36, 1];

const PackageWhatWeOffer = ({ packageData }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#080907] px-6 py-24 text-[#F5F3EE] sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        {/* SECTION HEADING */}

        <div className="mb-16 grid grid-cols-1 gap-8 lg:mb-24 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EASE_STANDARD }}
          >
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#c9a66b]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#c9a66b]">
                The Package Breakdown
              </span>
            </div>

            <h2 className="mt-8 font-display text-[clamp(48px,7vw,88px)] font-normal leading-[0.9] tracking-[-0.07em]">
              What We
              <span className="text-[#c9a66b]"> Offer.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              delay: 0.12,
              ease: EASE_STANDARD,
            }}
            className="max-w-[460px] text-[13px] font-light leading-[2] text-[#858078] lg:justify-self-end"
          >
            Every element of the {packageData.name} package is designed to
            support your business objectives. Explore the capabilities,
            strategies, and creative work included in this package.
          </motion.p>
        </div>

        {/* OFFERINGS */}

        <div className="space-y-8 lg:space-y-12">
          {packageData.offerings.map((offering, index) => {
            const isImageLeft = index % 2 === 0;

            return (
              <motion.article
                key={`${packageData.id}-${index}`}
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 45,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.12,
                }}
                transition={{
                  duration: 0.85,
                  delay: 0.05,
                  ease: EASE_STANDARD,
                }}
                className="group relative grid grid-cols-1 overflow-hidden border border-[#292722] bg-[#0b0c09] lg:min-h-[370px] lg:grid-cols-2"
              >
                {/* IMAGE PLACEHOLDER */}

                <div
                  className={`relative min-h-[260px] overflow-hidden bg-[#11120f] sm:min-h-[340px] lg:min-h-full ${
                    isImageLeft ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,166,107,0.12),transparent_65%)]" />

                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,166,107,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,166,107,0.06)_1px,transparent_1px)] bg-[size:55px_55px]" />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080907]/70 via-transparent to-transparent" />

                  <div className="absolute inset-6 border border-[#c9a66b]/15 transition-all duration-700 group-hover:inset-4 group-hover:border-[#c9a66b]/35 sm:inset-8 sm:group-hover:inset-6" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#c9a66b]/25 bg-[#080907]/30 backdrop-blur-sm transition-all duration-700 group-hover:scale-110 group-hover:border-[#c9a66b]/50">
                      <span className="font-display text-3xl text-[#c9a66b]/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  <span className="absolute bottom-10 left-10 text-[9px] uppercase tracking-[0.3em] text-[#c9a66b]/70">
                    Visual Direction / {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* TEXT CONTENT */}

                <div
                  className={`relative flex flex-col justify-center p-8 sm:p-12 lg:p-14 xl:p-16 ${
                    isImageLeft ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.3em] text-[#8c7049]">
                      OFFERING / {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="max-w-[550px] font-display text-[clamp(30px,3.5vw,45px)] font-normal leading-[1.05] tracking-[-0.045em] text-[#e7e2d9] transition-colors duration-500 group-hover:text-[#c9a66b]">
                    {offering.name}
                  </h3>

                  <p className="mt-7 max-w-[530px] text-[13px] font-light leading-[2] text-[#858078] sm:text-[14px]">
                    {offering.description}
                  </p>

                  <div className="mt-10 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#c9a66b]/60 transition-all duration-500 group-hover:w-14" />

                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#76684f]">
                      Included in {packageData.name}
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* CLOSING STATEMENT */}

        <motion.div
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_STANDARD }}
          className="mt-20 border-t border-[#292722] pt-10 sm:mt-28 sm:pt-14"
        >
          <p className="max-w-[850px] font-display text-[clamp(28px,4vw,48px)] font-light leading-[1.2] tracking-[-0.04em] text-[#c5bfb3]">
            A focused approach to help your business{" "}
            <span className="text-[#c9a66b]">
              {packageData.objective.toLowerCase()}.
            </span>
          </p>
        </motion.div>

        {/* FINAL CTA */}

        <motion.div
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: EASE_STANDARD,
          }}
          className="relative mt-[45px] overflow-hidden border border-[#292722] bg-[#0b0c0a] px-[24px] py-[28px] sm:px-[32px] sm:py-[34px] lg:px-[42px] lg:py-[38px]"
        >
          {/* CTA glow */}

          <div
            aria-hidden="true"
            className="absolute right-[-100px] top-1/2 h-[260px] w-[260px] -translate-y-1/2 rounded-full bg-[#c9a66b]/[0.045] blur-[80px]"
          />

          {/* Gold top line */}

          <div
            aria-hidden="true"
            className="absolute left-0 top-0 h-px w-full bg-[#c9a66b]"
          />

          <div className="relative z-10 flex flex-col gap-[28px] lg:flex-row lg:items-end lg:justify-between lg:gap-[50px]">
            <div className="max-w-[700px]">
              <h3 className="font-display text-[clamp(32px,4.5vw,58px)] font-normal leading-[0.92] tracking-[-0.055em] text-[#f5f3ee]">
                Strategy shaped around your goals
              </h3>

              <p className="mt-[17px] max-w-[600px] text-[10px] leading-[1.75] text-[#77736b] sm:text-[11px]">
                Explore our packages for complete growth solutions. Didn&apos;t
                find what you need? Explore our additional services.
              </p>
            </div>

            <OutlineButton
              to="/services"
              className="group min-h-[58px] min-w-[205px] shrink-0 justify-between border-[#c9a66b]/55 px-[20px] hover:border-[#c9a66b] max-[550px]:w-full"
            >
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#f5f3ee]">
                Explore Our Services
              </span>
            </OutlineButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PackageWhatWeOffer;
