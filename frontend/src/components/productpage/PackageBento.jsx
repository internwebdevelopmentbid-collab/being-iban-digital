import { useState } from "react";
import { motion } from "framer-motion";
import { Hammer, ChessQueen, Rocket } from "lucide-react";

import PackageAmbientField from "./PackageAmbientField";
import PackageBentoCard from "./PackageBentoCard";

const PACKAGES = [
  {
    id: "build",
    number: "01",
    name: "Build",
    icon: Hammer,
    description:
      "Establish a strong digital foundation and create the systems your brand needs to grow.",
    features: [
      "Google Business Profile Setup",
      "Social Media Management — 2 Platforms",
      "8 Creative Posts + 2 Reels",
      "Basic SEO Optimization",
    ],
  },

  {
    id: "dominate",
    number: "02",
    name: "Dominate",
    icon: ChessQueen,
    description:
      "A complete growth system combining creative, performance, analytics, and digital expansion.",
    features: [
      "Creative Designs — Reels + Posts",
      "Social Media Management — 3 Platforms + Shoot 2 Visit",
      "Advanced Analytics + Scaling Strategy",
      "Performance Marketing + CRO",
      "Influencer & YouTube Marketing",
      "Website Maintenance & SEO",
      "GMB Maintain",
    ],
  },

  {
    id: "improve",
    number: "03",
    name: "Improve",
    icon: Rocket,
    description:
      "Strengthen your existing digital presence with focused marketing, lead generation, and SEO.",
    features: [
      "Social Media Management — 2 Platforms",
      "Google & Meta Ads Campaign Management",
      "Lead Generation",
      "GMB Maintain",
      "Advanced SEO + Local SEO",
    ],
  },
];

const PackageBento = () => {
  const [activePackage, setActivePackage] = useState(null);

  const handleHover = (packageId) => {
    setActivePackage(packageId);
  };

  return (
    <div className="relative">
      {/* ================================================================
          AMBIENT PACKAGE FIELD
      ================================================================ */}

      <PackageAmbientField activePackage={activePackage} />

      {/* ================================================================
          PACKAGE GRID
      ================================================================ */}

      <div
        className="
          relative
          z-10
          grid
          grid-cols-1
          gap-[14px]
          md:grid-cols-3
          md:gap-[14px]
          lg:gap-[18px]
        "
      >
        {PACKAGES.map((packageData, index) => (
          <motion.div
            key={packageData.id}
            initial={{
              opacity: 0,
              y: 90,
              scale: 0.96,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: 0.95,
              delay: index * 0.14,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="min-w-0"
          >
            <PackageBentoCard
              packageData={packageData}
              isActive={activePackage === packageData.id}
              onHover={handleHover}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PackageBento;
