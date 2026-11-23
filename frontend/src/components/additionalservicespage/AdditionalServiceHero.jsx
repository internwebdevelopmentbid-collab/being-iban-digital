import { motion, useReducedMotion } from "framer-motion";

export default function AdditionalServiceHero({ service }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-black text-[#F5F3EE]">
      <div className="relative mx-auto grid max-w-[1500px] gap-12 px-6 pb-20 pt-20 sm:px-10 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-16 lg:py-28">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.28em] text-[#C9A45C]">
            {service.eyebrow}
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
            {service.heroTitle}
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            {service.heroDescription}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
