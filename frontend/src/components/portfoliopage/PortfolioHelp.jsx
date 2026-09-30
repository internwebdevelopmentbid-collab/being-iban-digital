import { motion } from "framer-motion";

const HELP_STEPS = [
  {
    number: "01",
    title: "Find the signal",
    description:
      "We understand your brand, audience, market, and the opportunity hidden inside the brief.",
  },
  {
    number: "02",
    title: "Build the system",
    description:
      "Strategy becomes identity, content, technology, performance, and experiences designed to work together.",
  },
  {
    number: "03",
    title: "Create the momentum",
    description:
      "We continuously refine the digital ecosystem so every campaign, interaction, and touchpoint moves the brand forward.",
  },
];

const PortfolioHelp = () => {
  return (
    <section className="relative overflow-hidden border-b border-[#292722]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#c9a66b]/[0.025] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="mb-6 font-sans text-[9px] font-semibold uppercase tracking-[0.32em] text-[#c9a66b]">
              How We Help
            </p>

            <h2 className="font-sans text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#f5f3ee] sm:text-6xl lg:text-7xl">
              More than
              <br />
              <span className="text-[#77746e]">making things.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-2xl lg:ml-auto"
          >
            <p className="font-sans text-base leading-8 text-[#a7a39b] sm:text-lg">
              Every project starts with a problem worth solving. We combine
              strategy, creativity, technology, and marketing to turn that
              problem into a digital experience people notice and remember.
            </p>

            <p className="mt-7 font-sans text-sm leading-7 text-[#77746e]">
              From the first idea to the systems that keep it moving, our work
              is built around one objective: creating meaningful digital
              momentum for the customer.
            </p>
          </motion.div>
        </div>

        <div className="mt-20 grid border-l border-[#292722] lg:mt-28 lg:grid-cols-3">
          {HELP_STEPS.map((step, index) => (
            <motion.article
              key={step.number}
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
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group border-b border-r border-t border-[#292722] p-7 transition-colors duration-500 hover:bg-[#11120f] sm:p-9 lg:border-b-0 lg:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-[10px] font-semibold tracking-[0.2em] text-[#c9a66b]">
                  {step.number}
                </span>

                <span className="h-2 w-2 rounded-full border border-[#c9a66b] transition-all duration-500 group-hover:bg-[#c9a66b]" />
              </div>

              <h3 className="mt-20 font-sans text-2xl font-black uppercase tracking-[-0.025em] text-[#f5f3ee] sm:text-3xl">
                {step.title}
              </h3>

              <p className="mt-5 font-sans text-sm leading-7 text-[#77746e] transition-colors duration-500 group-hover:text-[#a7a39b]">
                {step.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioHelp;
