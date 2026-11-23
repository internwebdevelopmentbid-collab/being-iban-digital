import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import additionalServices from "../data/additionalServices";

import AdditionalServiceHero from "../components/additionalservicespage/AdditionalServiceHero";
import AdditionalServiceAbout from "../components/additionalservicespage/AdditionalServiceAbout";
import AdditionalServiceOfferings from "../components/additionalservicespage/AdditionalServiceOfferings";
import AdditionalServiceWork from "../components/additionalservicespage/AdditionalServiceWork";
import ContactCTA from "../components/global/ContactCTA";

export default function AdditionalPackages() {
  const { serviceId } = useParams();

  const service = additionalServices.find((item) => item.id === serviceId);

  useEffect(() => {
    if (service) {
      document.title = `${service.name} | Being Iban Digital`;
    }
  }, [service]);

  if (!service) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-black px-6 text-center text-[#F5F3EE]">
        <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#C9A45C]">
          Service not found
        </p>

        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
          We couldn't find that service.
        </h1>

        <p className="mt-4 max-w-lg text-white/60">
          The service link may be incorrect or the page may no longer be
          available.
        </p>

        <Link
          to="/services"
          className="mt-8 inline-flex border border-[#C9A45C] px-6 py-3 text-sm font-semibold text-[#C9A45C] transition hover:bg-[#C9A45C] hover:text-black"
        >
          Explore services
        </Link>
      </main>
    );
  }

  return (
    <main>
      <AdditionalServiceHero service={service} />

      <AdditionalServiceAbout service={service} />

      <AdditionalServiceOfferings service={service} />

      <AdditionalServiceWork service={service} />

      <ContactCTA />
    </main>
  );
}
