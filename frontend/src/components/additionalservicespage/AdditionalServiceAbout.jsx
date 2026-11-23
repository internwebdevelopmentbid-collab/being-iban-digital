import { motion, useReducedMotion } from "framer-motion";

export default function AdditionalServiceAbout({ service }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-[#0b0b0b] px-6 py-20 text-[#F5F3EE] sm:px-10 lg:px-16 lg:py-28">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.28em] text-[#C9A45C]">
            About the service
          </p>

          <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            {service.aboutTitle}
          </h2>
        </div>

        <p className="max-w-3xl self-end text-base leading-8 text-white/65 sm:text-lg">
          {service.about}
        </p>
      </motion.div>
    </section>
  );
}
