import { useState } from "react";
import { getMediaUrl } from "../../config/api";

// ============================================================
// Portfolio Work Card
// ============================================================

const PortfolioWorkCard = ({ item }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // ============================================================
  // Category Checks
  // ============================================================

  const isWebsite = item?.category === "website";

  const isImage = item?.category === "image";

  const isVideo = item?.category === "video";

  // ============================================================
  // Media Source
  // ============================================================

  const visualSource = isWebsite
    ? item?.thumbnail || item?.mediaUrl
    : item?.mediaUrl;

  const mediaUrl = getMediaUrl(visualSource);

  // ============================================================
  // Card Content
  // ============================================================

  const cardContent = (
    <>
      {/* ======================================================
          Media Container
          ====================================================== */}

      <div className="relative h-[340px] overflow-hidden bg-[#11120f] sm:h-[390px] lg:h-[430px]">
        {/* ====================================================
            Loading Placeholder
            ==================================================== */}

        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-[#171813]" />
        )}

        {/* ====================================================
            Video / Image Media
            ==================================================== */}

        {isVideo && mediaUrl ? (
          <video
            src={mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => {
              setImageLoaded(true);
            }}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : mediaUrl ? (
          <img
            src={mediaUrl}
            alt={item?.title || item?.clientName || "Portfolio work"}
            onLoad={() => {
              setImageLoaded(true);
            }}
            draggable="false"
            className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04] ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#171813]">
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#55534e]">
              Media unavailable
            </span>
          </div>
        )}

        {/* ====================================================
            Hover Border / Glow
            ==================================================== */}

        <div className="pointer-events-none absolute inset-0 border border-transparent transition-all duration-500 group-hover:border-[#c9a66b]/50 group-hover:shadow-[inset_0_0_45px_rgba(201,166,107,0.12),0_0_45px_rgba(201,166,107,0.12)]" />

        {/* ====================================================
            Category / Custom Tags
            ==================================================== */}

        <div className="absolute left-5 top-5 flex items-center gap-2">
          <span className="border border-[#f5f3ee]/20 bg-[#080907]/70 px-2.5 py-1.5 font-sans text-[8px] font-semibold uppercase tracking-[0.18em] text-[#f5f3ee] backdrop-blur-sm">
            {isWebsite ? "Website" : isVideo ? "Media" : "Image"}
          </span>

          {item?.customTag?.trim() && (
            <span className="border border-[#9a7442]/50 bg-[#6e4d2f]/80 px-2.5 py-1.5 font-sans text-[8px] font-semibold uppercase tracking-[0.14em] text-[#e1c08a] backdrop-blur-sm">
              {item.customTag}
            </span>
          )}
        </div>

        {/* ====================================================
            Website External Link Icon
            ==================================================== */}

        {isWebsite && (
          <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-[#f5f3ee]/20 bg-[#080907]/70 text-[#f5f3ee] backdrop-blur-sm transition-all duration-500 group-hover:border-[#c9a66b] group-hover:bg-[#c9a66b] group-hover:text-[#080907]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12L12 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />

              <path
                d="M5 3H12V10"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* ====================================================
            Card Information
            ==================================================== */}

        <div className="absolute bottom-5 left-5 right-5">
          {item?.clientName?.trim() && (
            <p className="mb-2 font-sans text-[8px] font-semibold uppercase tracking-[0.25em] text-[#c9a66b]">
              {item.clientName}
            </p>
          )}

          <h4 className="max-w-[90%] font-sans text-xl font-black uppercase leading-[0.95] tracking-[-0.025em] text-[#f5f3ee] sm:text-2xl">
            {item?.title || "Untitled Project"}
          </h4>
        </div>
      </div>
    </>
  );

  // ============================================================
  // Website Card
  // ============================================================

  if (isWebsite && item?.projectUrl) {
    return (
      <a
        href={item.projectUrl}
        target="_blank"
        rel="noreferrer"
        className="group block w-[280px] shrink-0 border border-[#292722] bg-[#11120f] transition-all duration-500 hover:-translate-y-2 hover:border-[#c9a66b]/40 hover:shadow-[0_18px_60px_rgba(201,166,107,0.1)] sm:w-[360px] lg:w-[420px]"
      >
        {cardContent}
      </a>
    );
  }

  // ============================================================
  // Standard Card
  // ============================================================

  return (
    <article className="group block w-[280px] shrink-0 border border-[#292722] bg-[#11120f] transition-all duration-500 hover:-translate-y-2 hover:border-[#c9a66b]/40 hover:shadow-[0_18px_60px_rgba(201,166,107,0.1)] sm:w-[360px] lg:w-[420px]">
      {cardContent}
    </article>
  );
};

// ============================================================
// Export
// ============================================================

export default PortfolioWorkCard;
