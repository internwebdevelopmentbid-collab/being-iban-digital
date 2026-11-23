import { useEffect, useState } from "react";

import api_url from "../../../config/api";

const BRANDS_ENDPOINT = `${String(api_url || "").replace(/\/+$/, "")}/api/website/brands`;

const CLOUDINARY_UPLOAD_MARKER = "/image/upload/";

const CLOUDINARY_TRANSFORMATION_REGEX =
  /^(?:f_|q_|w_|h_|c_|dpr_|g_|ar_|e_|b_|bo_|r_|t_|fl_|dl_|pg_|x_|y_|z_|so_|fps_|vc_)/;

const MAX_HERO_BRANDS = 4;

const optimizeCloudinaryUrl = (url, width = 80) => {
  if (typeof url !== "string" || !url) {
    return url;
  }

  try {
    const parsedUrl = new URL(url);

    if (
      !parsedUrl.hostname.includes("cloudinary.com") ||
      !parsedUrl.pathname.includes(CLOUDINARY_UPLOAD_MARKER)
    ) {
      return url;
    }

    const uploadIndex = parsedUrl.pathname.indexOf(CLOUDINARY_UPLOAD_MARKER);

    const transformationStart = uploadIndex + CLOUDINARY_UPLOAD_MARKER.length;

    const remainder = parsedUrl.pathname.slice(transformationStart);

    const firstSlash = remainder.indexOf("/");

    const firstSegment =
      firstSlash === -1 ? remainder : remainder.slice(0, firstSlash);

    // Preserve URLs that already have transformations.
    if (
      firstSegment.includes(",") ||
      CLOUDINARY_TRANSFORMATION_REGEX.test(firstSegment)
    ) {
      return url;
    }

    parsedUrl.pathname =
      parsedUrl.pathname.slice(0, transformationStart) +
      `f_auto,q_auto,w_${width},c_limit/` +
      remainder;

    return parsedUrl.toString();
  } catch {
    return url;
  }
};

const HeroBrandLogos = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadBrands = async () => {
      try {
        const response = await fetch(BRANDS_ENDPOINT, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Unable to load hero brands: ${response.status}`);
        }

        const responseData = await response.json();
        const data = responseData?.data;

        if (!Array.isArray(data) || controller.signal.aborted) {
          return;
        }

        const featuredBrands = data
          .filter(
            (brand) =>
              brand?.isFeatured === true &&
              typeof brand?.logoUrl === "string" &&
              brand.logoUrl.length > 0,
          )
          .slice(0, MAX_HERO_BRANDS);

        if (!controller.signal.aborted) {
          setBrands(featuredBrands);
        }
      } catch (error) {
        if (error?.name !== "AbortError" && !controller.signal.aborted) {
          console.error("Unable to load hero brands:", error);
        }
      }
    };

    loadBrands();

    return () => {
      controller.abort();
    };
  }, []);

  if (brands.length === 0) {
    return null;
  }

  return (
    <div
      className="
        hero-brand-logos
        mt-10
        flex
        items-center
        gap-5

        sm:mt-12
        sm:gap-6

        max-[550px]:mt-7
        max-[550px]:gap-4
      "
    >
      <div className="flex -space-x-2">
        {brands.map((brand, index) => (
          <div
            key={
              brand._id || brand.logoUrl || `${brand.name || "brand"}-${index}`
            }
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-[#c9a66b]/25
              bg-white
              p-1.5
              shadow-[0_8px_25px_rgba(0,0,0,0.25)]

              sm:h-10
              sm:w-10

              max-[550px]:h-8
              max-[550px]:w-8

              hero-brand-logo
            "
            title={brand.name || ""}
            style={{ "--logo-index": index }}
          >
            <img
              src={optimizeCloudinaryUrl(brand.logoUrl, 80)}
              alt={brand.name || "Brand logo"}
              width={40}
              height={40}
              decoding="async"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              className="h-full w-full object-contain"
              draggable="false"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <span
          className="
            font-sans
            text-[9px]
            font-medium
            uppercase
            tracking-[0.28em]
            text-[#c9a66b]
          "
        >
          Trusted By
        </span>

        <span
          className="
            font-sans
            text-xs
            leading-relaxed
            text-[#a7a39b]

            sm:text-sm

            max-[550px]:text-[11px]
          "
        >
          Global Brands
        </span>
      </div>
    </div>
  );
};

export default HeroBrandLogos;
