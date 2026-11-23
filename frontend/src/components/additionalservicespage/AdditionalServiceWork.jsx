import { motion, useReducedMotion } from "framer-motion";

export default function AdditionalServiceWork({ service }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-[#0b0b0b] px-6 py-20 text-[#F5F3EE] sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[.28em] text-[#C9A45C]">
            Selected work
          </p>

          <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            The work behind the results.
          </h2>

          <p className="mt-5 leading-7 text-white/60">
            A look at how we put {service.name.toLowerCase()} into practice for
            our clients.
          </p>
        </div>

        {service.caseStudies?.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {service.caseStudies.map((project, index) => (
              <motion.article
                key={`${project.title}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-black"
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.imageAlt || project.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                )}

                <div className="p-7 sm:p-9">
                  {project.client && (
                    <p className="text-xs uppercase tracking-[.2em] text-[#C9A45C]">
                      {project.client}
                    </p>
                  )}

                  <h3 className="mt-3 text-2xl font-semibold">
                    {project.title}
                  </h3>

                  <p className="mt-4 leading-7 text-white/60">
                    {project.description}
                  </p>

                  {project.outcome && (
                    <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-6 text-[#C9A45C]">
                      {project.outcome}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#C9A45C]/30 bg-black/40 px-6 py-12 text-center sm:px-10">
            <p className="text-lg font-medium">Client projects coming soon</p>

            {/* <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/55">
              Add approved project images and case-study details to this
              service's <code className="text-[#C9A45C]">caseStudies</code>{" "}
              array in{" "}
              <code className="text-[#C9A45C]">additionalServices.js</code>.
            </p> */}
          </div>
        )}
      </div>
    </section>
  );
}
