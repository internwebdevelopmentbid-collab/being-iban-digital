import { useEffect } from "react";
import { useParams } from "react-router-dom";

import servicePackages from "../data/servicePackage";

import PackageHero from "../components/servicepackagespage/PackageHero";
import PackageWhatWeOffer from "../components/servicepackagespage/PackageWhatWeOffer";
import WorksCTA from "../components/global/WorksCTA";

const ServicePackages = () => {
  const { packageId } = useParams();

  const packageData = servicePackages.find(
    (item) => item.id.toLowerCase() === packageId?.toLowerCase(),
  );

  useEffect(() => {
    if (packageData) {
      document.title = `${packageData.name} | Being Iban Digital`;
    }
  }, [packageData]);

  if (!packageData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080907] px-6 text-center text-[#F5F3EE]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#c9a66b]">
            404 / Package Not Found
          </span>

          <h1 className="mt-6 font-display text-5xl tracking-tight sm:text-7xl">
            Page not found<span className="text-[#c9a66b]">.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#858078]">
            The package you're looking for does not exist or may have been
            moved.
          </p>

          <a
            href="/"
            className="mt-9 inline-flex border border-[#c9a66b]/40 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c9a66b] transition-all duration-300 hover:bg-[#c9a66b] hover:text-[#080907]"
          >
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080907]">
      <PackageHero packageData={packageData} />

      <PackageWhatWeOffer packageData={packageData} />

      <WorksCTA />
    </main>
  );
};

export default ServicePackages;
