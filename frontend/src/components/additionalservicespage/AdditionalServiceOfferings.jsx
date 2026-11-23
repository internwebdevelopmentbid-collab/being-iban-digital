import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import OutlineButton from "../global/OutlineButton";

const EASE_STANDARD = [0.22, 1, 0.36, 1];

export default function AdditionalServiceOfferings({ service }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-black px-6 py-20 text-[#F5F3EE] sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1500px]">
        {/* SECTION HEADING */}

        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[.28em] text-[#C9A45C]">
            What we offer
          </p>

          <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Practical expertise. Clear value.
          </h2>

          <p className="mt-5 leading-7 text-white/60">
            A focused set of services designed to support your business goals
            and make your next step clearer.
          </p>
        </div>

        {/* OFFERINGS LIST */}

        <div className="max-w-5xl">
          {service.offerings.map((item, index) => (
            <motion.div
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.05,
                ease: EASE_STANDARD,
              }}
              className="flex items-start gap-5 border-b border-white/10 py-7 sm:gap-7"
            >
              {/* GREEN TICK */}

              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                <Check size={15} strokeWidth={2.5} className="text-green-500" />
              </div>

              {/* OFFERING CONTENT */}

              <div>
                <h3 className="text-lg font-semibold text-[#F5F3EE] sm:text-xl">
                  {item.title}
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FINAL CTA */}

        <motion.div
          initial={{
            opacity: 0,
            y: reduceMotion ? 0 : 30,
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
}
