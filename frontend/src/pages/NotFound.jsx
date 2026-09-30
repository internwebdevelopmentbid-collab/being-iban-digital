import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const NotFound = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080907] text-[#F5F3EE]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[-10%] top-[18%] h-px w-[120%] rotate-[-12deg] bg-[#C9A66B]/10" />
        <div className="absolute left-[-10%] top-[72%] h-px w-[120%] rotate-[8deg] bg-[#C9A66B]/10" />

        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.18, 0.32, 0.18],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[8%] top-[20%] h-[280px] w-[280px] rounded-full bg-[#C9A66B]/[0.035] blur-[90px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.25, 0.12],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[8%] right-[5%] h-[320px] w-[320px] rounded-full bg-[#8C653C]/[0.04] blur-[100px]"
        />
      </div>

      <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-6 py-7 sm:px-10 lg:px-14">
        <Link
          to="/"
          className="font-display text-[18px] font-normal tracking-[-0.04em] text-[#F5F3EE] transition-colors duration-300 hover:text-[#C9A66B]"
        >
          BEING IBAN DIGITAL
        </Link>
      </header>

      <section className="relative z-10 flex min-h-screen items-center px-6 py-28 sm:px-10 lg:px-14">
        <div className="w-full">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid items-end gap-12 lg:grid-cols-[1fr_auto]">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-7 flex items-center gap-3"
                >
                  <span className="h-px w-8 bg-[#C9A66B]" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C9A66B]">
                    Page not found
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-display text-[clamp(100px,20vw,280px)] font-normal leading-[0.72] tracking-[-0.09em] text-[#F5F3EE]"
                >
                  404
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mt-12 max-w-[570px]"
                >
                  <h2 className="font-display text-[clamp(32px,4vw,58px)] font-normal leading-[0.95] tracking-[-0.06em] text-[#F5F3EE]">
                    Looks like you took
                    <span className="text-[#C9A66B]"> a wrong turn.</span>
                  </h2>

                  <p className="mt-6 max-w-[500px] text-[12px] leading-[1.8] text-[#A7A39B] sm:text-[13px]">
                    The page you're looking for doesn't exist or may have moved.
                    Let's get you back to where the work begins.
                  </p>

                  <Link
                    to="/"
                    className="group relative mt-9 inline-flex min-h-[52px] items-center justify-center gap-4 overflow-hidden border border-[#C9A66B] bg-[#C9A66B] px-7 text-[9px] font-bold uppercase tracking-[0.2em] text-[#080907] transition-all duration-500 hover:-translate-y-[2px] hover:bg-[#D7B982] hover:shadow-[0_0_30px_rgba(201,166,107,0.25)]"
                  >
                    <span className="pointer-events-none absolute inset-y-0 -left-[80%] w-[45%] rotate-[20deg] bg-white/30 blur-xl transition-all duration-700 group-hover:left-[130%]" />

                    <span className="relative z-10">Back to Home</span>

                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.5}
                      className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
                </motion.div>
              </div>
            </div>

            <div className="mt-16 h-px w-full bg-[#F5F3EE]/10" />

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[7px] uppercase tracking-[0.3em] text-[#A7A39B]/40">
                Error 404
              </span>

              <span className="text-[7px] uppercase tracking-[0.3em] text-[#A7A39B]/40">
                Digital experiences
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
