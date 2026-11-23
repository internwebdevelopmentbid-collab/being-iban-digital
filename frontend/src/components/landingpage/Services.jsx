import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  Megaphone,
  PenLine,
  Search,
  Share2,
  Target,
} from "lucide-react";

import api_url from "../../config/api";

const SERVICES_ENDPOINT = `${api_url}/api/website/services`;

const AMBIENT_ICONS = [
  {
    Icon: Share2,
    left: "7%",
    top: "32%",
    size: 68,
    delay: "0.4s",
    duration: "5.2s",
    rotate: "-8deg",
  },
  {
    Icon: Target,
    left: "21%",
    top: "10%",
    size: 82,
    delay: "1.8s",
    duration: "5.8s",
    rotate: "7deg",
  },
  {
    Icon: PenLine,
    left: "37%",
    top: "65%",
    size: 64,
    delay: "2.5s",
    duration: "6.1s",
    rotate: "-12deg",
  },
  {
    Icon: Megaphone,
    left: "55%",
    top: "29%",
    size: 78,
    delay: "0.9s",
    duration: "5.5s",
    rotate: "8deg",
  },
  {
    Icon: Search,
    left: "71%",
    top: "74%",
    size: 68,
    delay: "2.1s",
    duration: "6.3s",
    rotate: "-6deg",
  },
  {
    Icon: Code2,
    left: "88%",
    top: "16%",
    size: 80,
    delay: "1.2s",
    duration: "5.9s",
    rotate: "10deg",
  },
  {
    Icon: Share2,
    left: "92%",
    top: "56%",
    size: 58,
    delay: "3s",
    duration: "6.5s",
    rotate: "-10deg",
  },
  {
    Icon: Target,
    left: "13%",
    top: "85%",
    size: 58,
    delay: "1.5s",
    duration: "6.2s",
    rotate: "5deg",
  },
];

const optimizeCloudinaryUrl = (url, width) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const transformation = `f_auto,q_auto,dpr_auto,w_${width}`;

  if (url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/${transformation}/`);
  }

  return url;
};

function ServicesBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,166,107,0.45) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,166,107,0.45) 1px, transparent 1px)
          `,
          backgroundSize: "90px 90px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      />

      <div className="absolute left-[10%] top-[10%] h-[420px] w-[420px] rounded-full bg-[#c9a66b]/[0.025] blur-[110px]" />

      <div className="absolute bottom-[5%] right-[5%] h-[400px] w-[400px] rounded-full bg-[#9a7442]/[0.02] blur-[120px]" />

      {AMBIENT_ICONS.map(
        ({ Icon, left, top, size, delay, duration, rotate }, index) => (
          <div
            key={`ambient-icon-${index}`}
            className="services-ambient-icon absolute flex items-center justify-center text-[#c9a66b] opacity-[0.08] drop-shadow-[0_0_16px_rgba(201,166,107,0.14)]"
            style={{
              left,
              top,
              animationDelay: delay,
              animationDuration: duration,
              transform: `rotate(${rotate})`,
            }}
          >
            <Icon size={size} strokeWidth={1.15} />
          </div>
        ),
      )}

      <style>{`
        @keyframes servicesAmbientIconPulse {
          0%, 100% {
            opacity: 0.055;
            transform: translate3d(0, 0, 0) scale(0.92) rotate(0deg);
            filter: drop-shadow(0 0 0 rgba(201,166,107,0));
          }

          50% {
            opacity: 0.22;
            transform: translate3d(0, -7px, 0) scale(1) rotate(2deg);
            filter: drop-shadow(0 0 18px rgba(201,166,107,0.24));
          }
        }

        .services-ambient-icon {
          animation: servicesAmbientIconPulse 5.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .services-ambient-icon {
            animation: none;
            opacity: 0.09;
            transform: none;
            filter: none;
          }
        }

        @media (max-width: 640px) {
          .services-ambient-icon {
            opacity: 0.045;
          }
        }
      `}</style>
    </div>
  );
}

function TabIcon({ icon, title, active }) {
  if (!icon) return null;

  const optimizedIcon = optimizeCloudinaryUrl(icon, 120);

  return (
    <div
      className={`
        relative flex h-[48px] w-[48px] shrink-0 items-center justify-center
        overflow-hidden rounded-[14px] border p-2.5 transition-all duration-300
        sm:h-[52px] sm:w-[52px] sm:rounded-[15px]
        ${
          active
            ? "border-[#c9a66b]/40 bg-transparent shadow-[0_0_20px_rgba(201,166,107,0.13)]"
            : "border-white/[0.09] bg-transparent group-hover:border-[#c9a66b]/25"
        }
      `}
    >
      <img
        src={optimizedIcon}
        alt={title || ""}
        loading="lazy"
        decoding="async"
        width="120"
        height="120"
        className="relative z-10 block h-full w-full object-contain object-center"
      />
    </div>
  );
}

function ServiceTab({ service, index, active, onClick, idPrefix = "service" }) {
  const tabId = `${idPrefix}-tab-${index}`;
  const panelId = `${idPrefix}-panel-${index}`;

  return (
    <button
      id={tabId}
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={panelId}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className={`
        group relative flex min-h-[78px] min-w-[205px] shrink-0 items-center
        gap-3 rounded-[16px] border px-4 py-3 text-left transition-all duration-300
        md:min-w-[230px] md:min-h-[84px] md:px-5
        lg:min-h-[104px] lg:min-w-0 lg:w-full lg:rounded-none lg:border-0
        lg:border-b lg:px-7 lg:py-4
        ${
          active
            ? "border-[#c9a66b]/55 bg-[#c9a66b]/[0.075] shadow-[0_0_24px_rgba(201,166,107,0.10)] lg:border-white/[0.07] lg:bg-white/[0.035]"
            : "border-white/[0.08] bg-white/[0.012] hover:border-[#c9a66b]/30 hover:bg-white/[0.025] lg:border-white/[0.07] lg:bg-transparent"
        }
      `}
    >
      <span
        className={`
          absolute bottom-0 left-5 right-5 h-[2px] rounded-full bg-[#c9a66b]
          shadow-[0_0_10px_rgba(201,166,107,0.75)] transition-all duration-300
          lg:hidden ${active ? "opacity-100" : "opacity-0"}
        `}
      />

      <span
        className={`
          absolute left-0 top-0 hidden h-full w-[2px] bg-[#c9a66b]
          shadow-[0_0_12px_rgba(201,166,107,0.7)] transition-opacity duration-300
          lg:block ${active ? "opacity-100" : "opacity-0"}
        `}
      />

      <TabIcon icon={service.icon} title={service.title} active={active} />

      <div className="min-w-0 flex-1">
        <div
          className={`
            mb-1 text-[8px] font-semibold uppercase tracking-[0.28em]
            transition-colors duration-300 md:text-[9px]
            ${
              active
                ? "text-[#c9a66b]"
                : "text-[#66635d] group-hover:text-[#8d806c]"
            }
          `}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <span
          className={`
            block truncate font-serif text-[16px] leading-[1.1] tracking-[-0.025em]
            transition-colors duration-300 md:text-[18px] lg:text-[21px]
            ${
              active
                ? "text-[#f1e8d8]"
                : "text-[#858078] group-hover:text-[#c6baa7]"
            }
          `}
        >
          {service.title}
        </span>

        <span
          className={`
            mt-1.5 block text-[7px] font-semibold uppercase tracking-[0.22em]
            text-[#c9a66b] transition-opacity duration-300 lg:hidden
            ${active ? "opacity-100" : "opacity-0"}
          `}
        >
          Selected
        </span>
      </div>

      <span
        className={`
          hidden shrink-0 text-lg transition-all duration-300 lg:block
          ${
            active
              ? "translate-x-0 text-[#c9a66b] opacity-100"
              : "-translate-x-2 text-[#c9a66b] opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
          }
        `}
      >
        →
      </span>
    </button>
  );
}

function BackgroundServiceIcon({ icon }) {
  if (!icon) return null;

  const optimizedIcon = optimizeCloudinaryUrl(icon, 640);

  return (
    <div
      className="pointer-events-none absolute -right-[90px] -top-[70px] z-0 h-[420px] w-[420px] opacity-[0.055] blur-[0.5px] sm:-right-[120px] sm:-top-[90px] sm:h-[520px] sm:w-[520px] lg:-right-[150px] lg:-top-[120px] lg:h-[620px] lg:w-[620px]"
      aria-hidden="true"
    >
      <img
        src={optimizedIcon}
        alt=""
        loading="lazy"
        decoding="async"
        width="640"
        height="640"
        className="h-full w-full object-contain object-center"
      />
    </div>
  );
}

function ServiceDescription({ service, index, idPrefix = "service" }) {
  const panelId = `${idPrefix}-panel-${index}`;
  const tabId = `${idPrefix}-tab-${index}`;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      className="services-panel-enter relative flex min-h-[560px] flex-col overflow-hidden rounded-[26px] border border-[#c9a66b]/30 bg-white/[0.025] px-7 py-8 shadow-[0_0_35px_rgba(201,166,107,0.08)] backdrop-blur-[6px] sm:px-10 sm:py-10 lg:min-h-[620px] lg:px-14 lg:py-12"
    >
      <BackgroundServiceIcon icon={service.icon} />

      <div className="services-panel-glow pointer-events-none absolute inset-[-1px] z-[1] rounded-[27px] border border-[#c9a66b]/20" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />

      <div className="pointer-events-none absolute right-0 top-0 z-[3] h-px w-[55%] bg-gradient-to-l from-[#c9a66b]/50 to-transparent shadow-[0_0_12px_rgba(201,166,107,0.3)]" />

      <div className="relative z-10 flex h-full min-h-[504px] flex-col">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#c9a66b] sm:text-[10px]">
              Service / {String(index + 1).padStart(2, "0")}
            </p>
            <div className="mt-4 h-px w-12 bg-[#c9a66b] shadow-[0_0_8px_rgba(201,166,107,0.45)]" />
          </div>

          <span className="font-serif text-4xl leading-none text-[#c9a66b]/12 sm:text-5xl">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-12 max-w-[760px] lg:mt-16">
          <h3 className="max-w-[720px] font-serif text-[40px] font-normal leading-[0.98] tracking-[-0.045em] text-[#f1e8d8] sm:text-[52px] lg:text-[64px]">
            {service.title}
          </h3>

          {service.shortDescription && (
            <p className="mt-7 max-w-[620px] text-[14px] leading-7 text-[#aaa49a] sm:mt-8 sm:text-[15px] sm:leading-7">
              {service.shortDescription}
            </p>
          )}
        </div>

        {Array.isArray(service.features) && service.features.length > 0 && (
          <div className="mt-auto pt-12">
            <div className="mb-5 flex items-center gap-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#c9a66b]/80">
                What we deliver
              </p>
              <span className="h-px w-10 bg-[#c9a66b]/30 shadow-[0_0_6px_rgba(201,166,107,0.2)]" />
            </div>

            <div className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
              {service.features.map((feature, featureIndex) => (
                <div
                  key={`${feature}-${featureIndex}`}
                  className="flex items-center gap-3 text-[12px] leading-5 text-[#c2bdb3] sm:text-[13px]"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#c9a66b]/50 text-[8px] text-[#c9a66b] shadow-[0_0_7px_rgba(201,166,107,0.15)]">
                    ✓
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-white/[0.07] pt-5">
          <span className="text-[8px] uppercase tracking-[0.28em] text-[#77736a]">
            Strategy / Creation / Growth
          </span>
          <span className="text-[8px] uppercase tracking-[0.28em] text-[#77736a]">
            Being IBAN Digital
          </span>
        </div>
      </div>

      <style>{`
        @keyframes servicesPanelEnter {
          from { opacity: 0; transform: translateY(7px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes servicesPanelGlow {
          0%, 100% {
            opacity: 0.30;
            box-shadow: 0 0 18px rgba(201,166,107,0.04);
          }
          50% {
            opacity: 0.75;
            box-shadow: 0 0 32px rgba(201,166,107,0.10);
          }
        }

        .services-panel-enter {
          animation: servicesPanelEnter 220ms ease-out;
        }

        .services-panel-glow {
          animation: servicesPanelGlow 4.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .services-panel-enter,
          .services-panel-glow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function ServicesInterface({ services }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const desktopTabListRef = useRef(null);
  const activeService = services[activeIndex];

  useEffect(() => {
    if (activeIndex === 0) return;

    const container = desktopTabListRef.current;
    if (!container) return;

    const activeTab = container.querySelector('[aria-selected="true"]');
    if (!activeTab) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    const delta =
      tabRect.left +
      tabRect.width / 2 -
      (containerRect.left + containerRect.width / 2);

    if (Math.abs(delta) >= 1) {
      container.scrollBy({ left: delta, behavior: "smooth" });
    }
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex >= services.length) {
      setActiveIndex(0);
    }
  }, [services.length, activeIndex]);

  if (!services.length || !activeService) return null;

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? services.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === services.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080907] text-[#f1e8d8]">
      <ServicesBackground />

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
        <div className="max-w-[850px]">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#c9a66b]">
              Our Services
            </span>
            <span className="h-px w-14 bg-[#c9a66b]/50 shadow-[0_0_8px_rgba(201,166,107,0.25)]" />
          </div>

          <h2 className="mt-7 max-w-[850px] font-serif text-[52px] font-normal leading-[0.9] tracking-[-0.055em] text-[#f1e8d8] sm:text-[72px] lg:text-[100px]">
            Solutions for
            <br />a Digital World
          </h2>

          <p className="mt-8 max-w-[620px] text-[13px] leading-6 text-[#858179] sm:text-[14px] sm:leading-7">
            From strategy to execution, we offer end-to-end digital services to
            help your brand grow, engage, and stand out in a competitive
            landscape.
          </p>
        </div>

        {/* The extra mobile service-tab row has been removed. */}

        <div className="mt-24 hidden lg:grid lg:grid-cols-[minmax(280px,0.32fr)_minmax(0,0.68fr)] lg:gap-10">
          <div
            ref={desktopTabListRef}
            role="tablist"
            aria-label="Services"
            className="self-start overflow-hidden rounded-[22px] border border-[#c9a66b]/20 bg-white/[0.025] shadow-[0_0_28px_rgba(201,166,107,0.035)] backdrop-blur-[6px] lg:sticky lg:top-10"
          >
            {services.map((service, index) => (
              <ServiceTab
                key={service._id || `${service.title}-${index}`}
                service={service}
                index={index}
                active={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                idPrefix="desktop-service"
              />
            ))}
          </div>

          <div className="min-w-0">
            <ServiceDescription
              key={activeService._id || activeService.title}
              service={activeService}
              index={activeIndex}
              idPrefix="desktop-service"
            />
          </div>
        </div>

        {/* Mobile previous/next controls are retained. */}
        <div className="mt-6 flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous service"
            className="flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2.5 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#77736a] transition-all duration-300 hover:border-[#c9a66b]/35 hover:text-[#c9a66b] active:scale-95"
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
            Previous
          </button>

          <div className="h-px flex-1 bg-gradient-to-r from-[#c9a66b]/10 via-[#c9a66b]/30 to-[#c9a66b]/10" />

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next service"
            className="flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2.5 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#77736a] transition-all duration-300 hover:border-[#c9a66b]/35 hover:text-[#c9a66b] active:scale-95"
          >
            Next
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile service description */}
        <div className="mt-6 lg:hidden">
          <ServiceDescription
            key={activeService._id || activeService.title}
            service={activeService}
            index={activeIndex}
            idPrefix="mobile-service"
          />
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadServices = async () => {
      try {
        const response = await fetch(SERVICES_ENDPOINT, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Services request failed: ${response.status}`);
        }

        const data = await response.json();

        const nextServices = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.services)
              ? data.services
              : [];

        setServices(nextServices);
      } catch (error) {
        if (error?.name === "AbortError") return;

        console.error("Services loading error:", error);
        setServices([]);
      }
    };

    loadServices();

    return () => controller.abort();
  }, []);

  if (!services.length) return null;

  return (
    <section className="relative">
      <ServicesInterface services={services} />
    </section>
  );
}
