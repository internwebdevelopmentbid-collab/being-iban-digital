import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import api_url from "../config/api";

import PortfolioHero from "../components/portfoliopage/PortfolioHero";
import PortfolioHelp from "../components/portfoliopage/PortfolioHelp";
import PortfolioCarousel from "../components/portfoliopage/PortfolioCarousel";
import ContactCTA from "../components/global/ContactCTA";

const CATEGORY_CONFIG = [
  {
    key: "image",
    label: "Images",
    eyebrow: "01 / Visual Identity",
    description:
      "Selected creative work across campaigns, social content, brand visuals, and digital communication.",
  },
  {
    key: "video",
    label: "Media",
    eyebrow: "02 / Motion & Media",
    description:
      "Moving stories, campaign films, reels, and visual media created to give brands more presence.",
  },
  {
    key: "website",
    label: "Websites",
    eyebrow: "03 / Digital Experiences",
    description:
      "Web experiences designed around clarity, performance, storytelling, and conversion.",
  },
];

const normalizeMedia = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => {
      if (!item?.category) {
        return false;
      }

      if (item.category === "website") {
        return Boolean(
          item.projectUrl?.trim() &&
          (item.thumbnail?.trim() || item.mediaUrl?.trim()),
        );
      }

      if (item.category === "image" || item.category === "video") {
        return Boolean(item.mediaUrl?.trim());
      }

      return false;
    })
    .map((item) => ({
      ...item,
      category: String(item.category).toLowerCase(),
    }));
};

const Portfolio = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchPortfolioMedia = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch(`${api_url}/api/media/portfolio`);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data?.message || "Unable to load portfolio media.");
        }

        const normalizedMedia = normalizeMedia(data.media);

        if (mounted) {
          setMedia(normalizedMedia);
        }
      } catch (error) {
        console.error("Portfolio media fetch error:", error);

        if (mounted) {
          setMedia([]);
          setErrorMessage(error?.message || "Unable to load portfolio media.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPortfolioMedia();

    return () => {
      mounted = false;
    };
  }, []);

  const groupedMedia = useMemo(() => {
    return {
      image: media.filter((item) => item.category === "image"),

      video: media.filter((item) => item.category === "video"),

      website: media.filter((item) => item.category === "website"),
    };
  }, [media]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#080907] text-[#f5f3ee]">
      <PortfolioHero media={media} />

      <PortfolioHelp />

      <section
        id="selected-works"
        className="relative overflow-hidden border-t border-[#292722]"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#c9a66b]/[0.035] blur-[150px]" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(#f5f3ee 1px, transparent 1px), linear-gradient(90deg, #f5f3ee 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-5 pb-8 pt-20 sm:px-8 sm:pb-10 sm:pt-24 lg:px-12 lg:pb-12 lg:pt-32">
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
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
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-16 flex flex-col gap-8 lg:mb-24 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-3xl">
              <p className="mb-5 font-sans text-[9px] font-semibold uppercase tracking-[0.32em] text-[#c9a66b]">
                Selected Work
              </p>

              <h2 className="font-sans text-4xl font-black uppercase leading-[0.92] tracking-[-0.045em] text-[#f5f3ee] sm:text-6xl lg:text-7xl">
                Work that
                <br />
                moves brands.
              </h2>
            </div>

            <p className="max-w-md font-sans text-sm leading-7 text-[#a7a39b] lg:text-right">
              A selection of the digital experiences, visual systems, campaigns,
              and media we create for ambitious brands.
            </p>
          </motion.div>

          {loading ? (
            <PortfolioLoadingState />
          ) : errorMessage ? (
            <PortfolioErrorState message={errorMessage} />
          ) : (
            <div className="space-y-24 lg:space-y-32">
              {CATEGORY_CONFIG.map((category) => (
                <PortfolioCarousel
                  key={category.key}
                  category={category}
                  items={groupedMedia[category.key]}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <ContactCTA />
    </main>
  );
};

const PortfolioLoadingState = () => {
  return (
    <div className="space-y-20 lg:space-y-28">
      {[1, 2, 3].map((row) => (
        <div key={row}>
          <div className="mb-7 flex items-end justify-between border-b border-[#292722] pb-5">
            <div className="h-3 w-24 animate-pulse bg-[#292722]" />

            <div className="h-3 w-16 animate-pulse bg-[#292722]" />
          </div>

          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[360px] min-w-[280px] animate-pulse bg-[#11120f] sm:min-w-[360px] lg:min-w-[420px]"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const PortfolioErrorState = ({ message }) => {
  return (
    <div className="border border-[#292722] bg-[#11120f] px-6 py-12 text-center">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a66b]">
        Portfolio unavailable
      </p>

      <p className="mx-auto mt-4 max-w-lg font-sans text-sm leading-7 text-[#a7a39b]">
        {message}
      </p>
    </div>
  );
};

export default Portfolio;
