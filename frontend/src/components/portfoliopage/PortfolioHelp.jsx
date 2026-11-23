import { useEffect, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Check, X, ArrowUpRight } from "lucide-react";

import {
  default as api_url,
  getMediaUrl,
  getOptimizedImageUrl,
} from "../../config/api";

const FALLBACK_STEPS = [
  {
    id: "fallback-1",
    clientName: "Find the signal",
    businessNeeds: [
      "We understand your brand, audience, market, and the opportunity hidden inside the brief.",
    ],
    bidApproach: [],
  },
  {
    id: "fallback-2",
    clientName: "Build the system",
    businessNeeds: [
      "Strategy becomes identity, content, technology, performance, and experiences designed to work together.",
    ],
    bidApproach: [],
  },
  {
    id: "fallback-3",
    clientName: "Create the momentum",
    businessNeeds: [
      "We continuously refine the digital ecosystem so every campaign, interaction, and touchpoint moves the brand forward.",
    ],
    bidApproach: [],
  },
];

const springTransition = {
  type: "spring",
  stiffness: 170,
  damping: 28,
  mass: 0.9,
};

const fadeTransition = {
  duration: 0.22,
  ease: "easeOut",
};

const PortfolioHelp = () => {
  const reducedMotion = useReducedMotion();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Fetch How We Help entries
  useEffect(() => {
    const controller = new AbortController();

    const fetchHowWeHelp = async () => {
      try {
        const response = await fetch(`${api_url}/api/how-we-help`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch How We Help entries.");
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.entries)) {
          setEntries(data.entries);
        } else {
          setEntries([]);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("How We Help API error:", error);
          setEntries([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchHowWeHelp();

    return () => controller.abort();
  }, []);

  // Close modal with Escape
  useEffect(() => {
    if (!selectedEntry) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedEntry(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedEntry]);

  const displayEntries =
    entries.length > 0 ? entries : loading ? [] : FALLBACK_STEPS;

  const getEntryId = (entry, index) =>
    String(entry._id || entry.id || `entry-${index}`);

  const getLogoUrl = (entry) => {
    if (!entry.logoUrl) return "";

    return getOptimizedImageUrl(getMediaUrl(entry.logoUrl), {
      width: 900,
      quality: "auto",
      format: "auto",
    });
  };

  const openEntry = (entry) => {
    setSelectedEntry(entry);
  };

  const closeEntry = () => {
    setSelectedEntry(null);
  };

  // Resolve selected entry by object reference
  const selectedIndex = selectedEntry
    ? displayEntries.findIndex((entry) => entry === selectedEntry)
    : -1;

  const selectedId =
    selectedEntry && selectedIndex >= 0
      ? getEntryId(selectedEntry, selectedIndex)
      : null;

  const selectedTitle = selectedEntry
    ? selectedEntry.clientName ||
      selectedEntry.title ||
      `Project ${selectedIndex + 1}`
    : "";

  const selectedLogo = selectedEntry ? getLogoUrl(selectedEntry) : "";

  const businessNeeds = Array.isArray(selectedEntry?.businessNeeds)
    ? selectedEntry.businessNeeds
    : [];

  const bidApproach = Array.isArray(selectedEntry?.bidApproach)
    ? selectedEntry.bidApproach
    : [];

  return (
    <section
      id="how-we-help"
      className="relative overflow-hidden border-b border-[#292722]"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-[-10%] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#c9a66b]/[0.025] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        {/* Section introduction */}
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: reducedMotion ? 0 : 0.6,
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
            initial={reducedMotion ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: reducedMotion ? 0 : 0.6,
              delay: reducedMotion ? 0 : 0.05,
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

        {/* Loading state */}
        {loading ? (
          <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-28 lg:grid-cols-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="aspect-square animate-pulse border border-[#292722] bg-[#0c0d0b] p-7"
              >
                <div className="h-3 w-10 bg-[#292722]" />
                <div className="mt-[55%] h-10 w-2/3 bg-[#292722]" />
                <div className="mt-5 h-3 w-full bg-[#292722]" />
                <div className="mt-3 h-3 w-4/5 bg-[#292722]" />
              </div>
            ))}
          </div>
        ) : (
          <LayoutGroup id="how-we-help-layout">
            <>
              {/* =========================
                  SQUARE CARD GRID
                  Mobile: 1 column
                  Tablet: 2 columns
                  Desktop: 2 columns
              ========================= */}
              <motion.div className="mx-auto mt-16 grid max-w-[1050px] grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-2">
                {displayEntries.map((entry, index) => {
                  const id = getEntryId(entry, index);

                  const title =
                    entry.clientName || entry.title || `Project ${index + 1}`;

                  const logoUrl = getLogoUrl(entry);

                  const cardBusinessNeeds = Array.isArray(entry.businessNeeds)
                    ? entry.businessNeeds
                    : [];

                  return (
                    <motion.button
                      key={id}
                      type="button"
                      layout={!reducedMotion}
                      layoutId={`how-we-help-${id}`}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { layout: springTransition }
                      }
                      onClick={() => openEntry(entry)}
                      aria-label={`View ${title} case study`}
                      aria-expanded={selectedId === id}
                      className={`group relative flex aspect-square w-full max-w-[500px] flex-col justify-end justify-self-center overflow-hidden border border-[#292722] bg-[#10110f] text-left outline-none transition-colors duration-300 hover:border-[#756044] focus-visible:border-[#c9a66b] ${
                        selectedId === id ? "pointer-events-none" : ""
                      }`}
                    >
                      {/* Full-card background image */}
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt={`${title} visual`}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      )}

                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/60" />

                      {/* Subtle gold hover glow */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(circle at 50% 50%, rgba(201,166,107,0.12), transparent 65%)",
                        }}
                      />

                      {/* Gold top edge */}
                      <span className="absolute left-0 top-0 z-20 h-px w-full origin-left scale-x-0 bg-[#c9a66b] transition-transform duration-500 group-hover:scale-x-100" />

                      {/* Fallback number when no image exists */}
                      {!logoUrl && (
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-sans text-8xl font-black tracking-[-0.08em] text-[#292722]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      )}

                      {/* Text overlay */}
                      <div className="relative z-10 flex w-full items-end justify-between gap-4 p-6 sm:p-7">
                        <div className="min-w-0">
                          <h3 className="break-words font-sans text-xl font-bold uppercase leading-tight tracking-[-0.03em] text-[#f5f3ee] sm:text-2xl">
                            {title}
                          </h3>

                          <p className="mt-3 line-clamp-2 max-w-md font-sans text-xs leading-6 text-white/75">
                            Click to know how we made an impact.
                          </p>
                        </div>

                        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#c9a66b]/60 text-[#c9a66b] transition-colors duration-300 group-hover:border-[#c9a66b] group-hover:bg-[#c9a66b] group-hover:text-[#080907]">
                          <ArrowUpRight size={17} />
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* =========================
                  EXPANDED CARD
              ========================= */}
              <AnimatePresence>
                {selectedEntry && selectedId && (
                  <motion.div
                    key="expanded-overlay"
                    className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-3 pb-6 pt-24 sm:items-center sm:p-6"
                  >
                    {/* Backdrop */}
                    <motion.button
                      type="button"
                      aria-label="Close case study"
                      onClick={closeEntry}
                      className="absolute inset-0 cursor-default bg-black/85"
                      initial={reducedMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={
                        reducedMotion ? { duration: 0 } : fadeTransition
                      }
                    />

                    {/* Shared layout card */}
                    <motion.article
                      key={selectedId}
                      layout={!reducedMotion}
                      layoutId={`how-we-help-${selectedId}`}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { layout: springTransition }
                      }
                      className="relative z-[1] my-auto max-h-[calc(100dvh-7rem)] w-full max-w-[950px] overflow-y-auto border border-[#51483a] bg-[#0c0d0b] shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:max-h-[92vh]"
                      style={{
                        transformOrigin: "center center",
                      }}
                    >
                      <div className="h-px w-full bg-gradient-to-r from-[#c9a66b] via-[#c9a66b]/40 to-transparent" />

                      {/* Expanded header */}
                      <div className="flex flex-col gap-6 border-b border-[#292722] p-6 sm:p-9 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-5">
                          <span className="pt-1 font-sans text-xs font-semibold tracking-[0.2em] text-[#c9a66b]">
                            {String(selectedIndex + 1).padStart(2, "0")}
                          </span>

                          <div>
                            <p className="mb-2 font-sans text-[9px] font-semibold uppercase tracking-[0.22em] text-[#77746e]">
                              Client / Case Study
                            </p>

                            <h3 className="break-words font-sans text-2xl font-black uppercase tracking-[-0.035em] text-[#f5f3ee] sm:text-3xl">
                              {selectedTitle}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-5 md:justify-end">
                          {selectedLogo && (
                            <img
                              src={selectedLogo}
                              alt={`${selectedTitle} logo`}
                              width="210"
                              height="85"
                              loading="eager"
                              decoding="async"
                              className="max-h-[85px] max-w-[190px] object-contain"
                            />
                          )}

                          <button
                            type="button"
                            onClick={closeEntry}
                            aria-label="Close case study"
                            className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#39352d] text-[#a7a39b] transition-colors duration-200 hover:border-[#c9a66b] hover:text-[#c9a66b]"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded content */}
                      <div className="grid gap-9 p-6 sm:p-9 md:grid-cols-2 md:gap-12">
                        {businessNeeds.length > 0 && (
                          <div>
                            <div className="mb-5 flex items-center gap-3">
                              <span className="h-px w-7 bg-[#c9a66b]" />

                              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a66b]">
                                Business Needs
                              </p>
                            </div>

                            <ul className="space-y-4">
                              {businessNeeds.map((need, needIndex) => (
                                <li
                                  key={`${need}-${needIndex}`}
                                  className="flex items-start gap-3 font-sans text-sm leading-7 text-[#a7a39b]"
                                >
                                  <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-[#c9a66b]" />
                                  <span>{need}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {bidApproach.length > 0 && (
                          <div className="md:border-l md:border-[#292722] md:pl-10">
                            <div className="mb-5 flex items-center gap-3">
                              <span className="h-px w-7 bg-[#c9a66b]" />

                              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a66b]">
                                BID Approach
                              </p>
                            </div>

                            <ul className="space-y-4">
                              {bidApproach.map((approach, approachIndex) => (
                                <li
                                  key={`${approach}-${approachIndex}`}
                                  className="flex items-start gap-3 font-sans text-sm leading-7 text-[#a7a39b]"
                                >
                                  <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-[#c9a66b]" />
                                  <span>{approach}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Result */}
                      {selectedEntry.resultMetric && (
                        <div className="mx-6 mb-7 flex items-start gap-4 border-t border-[#292722] pt-6 sm:mx-9 sm:mb-9">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#70b77b]/10">
                            <Check
                              size={16}
                              strokeWidth={2.5}
                              className="text-[#70b77b]"
                            />
                          </div>

                          <p className="font-sans text-sm font-medium leading-7 text-[#f5f3ee]">
                            {selectedEntry.resultMetric}
                          </p>
                        </div>
                      )}
                    </motion.article>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          </LayoutGroup>
        )}
      </div>
    </section>
  );
};

export default PortfolioHelp;
