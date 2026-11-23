import { useState } from "react";

import { getMediaUrl, getOptimizedImageUrl } from "../../config/api";

// ============================================================
// Portfolio Work Card
// ============================================================

const PortfolioWorkCard = ({ item }) => {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [videoRequested, setVideoRequested] = useState(false);

  // ============================================================
  // Category Checks
  // ============================================================

  const isWebsite = item?.category === "website";
  const isVideo = item?.category === "video";

  // ============================================================
  // Media Source
  // ============================================================

  const visualSource = isWebsite
    ? item?.thumbnail || item?.mediaUrl
    : item?.mediaUrl;

  const mediaUrl = getMediaUrl(visualSource);

  const imageUrl =
    mediaUrl && !isVideo
      ? getOptimizedImageUrl(mediaUrl, {
          width: 840,
          quality: "auto",
          format: "auto",
        })
      : "";

  const handleMediaLoaded = () => {
    setMediaLoaded(true);
    setMediaError(false);
  };

  const handleMediaError = () => {
    setMediaLoaded(true);
    setMediaError(true);
  };

  // ============================================================
  // Card Content
  // ============================================================

  const cardContent = (
    <div className="relative h-[340px] overflow-hidden bg-[#11120f] sm:h-[390px] lg:h-[430px]">
      {/* Loading Placeholder */}

      {!mediaLoaded && (
        <div
          className="pointer-events-none absolute inset-0 animate-pulse bg-[#171813]"
          aria-hidden="true"
        />
      )}

      {/* Video / Image Media */}

      {mediaUrl && !mediaError ? (
        isVideo ? (
          videoRequested ? (
            <video
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              onLoadedData={handleMediaLoaded}
              onError={handleMediaError}
              className="h-full w-full object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setVideoRequested(true);
              }}
              className="absolute inset-0 flex h-full w-full items-center justify-center bg-[#171813] text-[#c9a66b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a66b]"
              aria-label={`Play ${item?.title || "portfolio video"}`}
            >
              <span className="flex h-12 w-12 items-center justify-center border border-[#c9a66b]/60 bg-[#080907]/70 transition-colors hover:bg-[#c9a66b] hover:text-[#080907]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M5 3.5L12 8L5 12.5V3.5Z" fill="currentColor" />
                </svg>
              </span>
            </button>
          )
        ) : (
          <img
            src={imageUrl}
            alt={item?.title || item?.clientName || "Portfolio work"}
            width="840"
            height="630"
            loading="lazy"
            decoding="async"
            onLoad={handleMediaLoaded}
            onError={handleMediaError}
            draggable="false"
            className={`h-full w-full object-cover transition-[opacity,transform] duration-500 group-hover:scale-[1.03] ${
              mediaLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#171813]">
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#55534e]">
            {mediaError ? "Media unavailable" : "Portfolio"}
          </span>
        </div>
      )}

      {/* Video overlay */}

      {isVideo && videoRequested && !mediaError && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080907]/50 via-transparent to-transparent" />
      )}

      {/* Hover Border / Glow */}

      <div className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-[#c9a66b]/50" />

      {/* Category / Custom Tags */}

      <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
        <span className="border border-[#f5f3ee]/20 bg-[#080907]/80 px-2.5 py-1.5 font-sans text-[8px] font-semibold uppercase tracking-[0.18em] text-[#f5f3ee]">
          {isWebsite ? "Website" : isVideo ? "Media" : "Image"}
        </span>

        {item?.customTag?.trim() && (
          <span className="border border-[#9a7442]/50 bg-[#6e4d2f]/90 px-2.5 py-1.5 font-sans text-[8px] font-semibold uppercase tracking-[0.14em] text-[#e1c08a]">
            {item.customTag}
          </span>
        )}
      </div>

      {/* Website External Link Icon */}

      {isWebsite && (
        <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-[#f5f3ee]/20 bg-[#080907]/80 text-[#f5f3ee] transition-colors duration-300 group-hover:border-[#c9a66b] group-hover:bg-[#c9a66b] group-hover:text-[#080907]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
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

      {/* Card Information */}

      <div className="absolute bottom-5 left-5 right-5">
        {item?.clientName?.trim() && (
          <p className="mb-2 font-sans text-[8px] font-semibold uppercase tracking-[0.25em] text-[#c9a66b]">
            {item.clientName}
          </p>
        )}

        <h4 className="max-w-[90%] break-words font-sans text-xl font-black uppercase leading-[0.95] tracking-[-0.025em] text-[#f5f3ee] sm:text-2xl">
          {item?.title || "Untitled Project"}
        </h4>
      </div>
    </div>
  );

  // ============================================================
  // Website Card
  // ============================================================

  if (isWebsite && item?.projectUrl) {
    return (
      <a
        href={item.projectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-[280px] shrink-0 border border-[#292722] bg-[#11120f] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#c9a66b]/40 hover:shadow-[0_18px_45px_rgba(201,166,107,0.08)] sm:w-[360px] lg:w-[420px]"
      >
        {cardContent}
      </a>
    );
  }

  // ============================================================
  // Standard Card
  // ============================================================

  return (
    <article className="group block w-[280px] shrink-0 border border-[#292722] bg-[#11120f] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#c9a66b]/40 hover:shadow-[0_18px_45px_rgba(201,166,107,0.08)] sm:w-[360px] lg:w-[420px]">
      {cardContent}
    </article>
  );
};

export default PortfolioWorkCard;
