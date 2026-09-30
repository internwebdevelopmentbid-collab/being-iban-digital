import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

import api_url from "../../../config/api";

const HeroBrandLogos = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadBrands = async () => {
      try {
        const response = await axios.get(`${api_url}/api/website/brands`);

        const data = response?.data?.data;

        if (!mounted || !Array.isArray(data)) {
          return;
        }

        setBrands(data.filter((brand) => brand?.isFeatured === true));
      } catch (error) {
        console.error("Unable to load hero brands:", error);
      }
    };

    loadBrands();

    return () => {
      mounted = false;
    };
  }, []);

  if (!brands.length) {
    return null;
  }

  return (
    <motion.div
      className="
        mt-10
        flex
        items-center
        gap-5
        sm:mt-12
        sm:gap-6
      "
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
        delay: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Featured Brand Logos */}

      <div className="flex -space-x-2">
        {brands.map((brand, index) => (
          <motion.div
            key={brand._id}
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
              sm:p-1.5
            "
            title={brand.name}
            initial={{
              opacity: 0,
              scale: 0.7,
              x: -10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.8 + index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* Text */}

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
          "
        >
          Global Brands
        </span>
      </div>
    </motion.div>
  );
};

export default HeroBrandLogos;
