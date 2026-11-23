import { lazy, Suspense, useEffect, useRef, useState } from "react";

import Hero from "../components/landingpage/hero/Hero";

/* -------------------------------------------------------------------------- */
/* LAZY COMPONENTS                                                            */
/* -------------------------------------------------------------------------- */

const StatsSection = lazy(
  () => import("../components/landingpage/StatsSection"),
);

const About = lazy(() => import("../components/landingpage/About"));

const Services = lazy(() => import("../components/landingpage/Services"));

const Brands = lazy(() => import("../components/landingpage/Brands"));

const WorksCTA = lazy(() => import("../components/global/WorksCTA"));

const TechCapabilities = lazy(
  () => import("../components/landingpage/TechCapabilities"),
);

const ProductsCTA = lazy(() => import("../components/landingpage/ProductsCTA"));

const WhyChooseUs = lazy(() => import("../components/landingpage/WhyChooseUs"));

const ParentCompany = lazy(
  () => import("../components/landingpage/ParentCompany"),
);

const Reviews = lazy(() => import("../components/global/Reviews"));

/* -------------------------------------------------------------------------- */
/* DEFERRED SECTION                                                           */
/* -------------------------------------------------------------------------- */

const DeferredSection = ({
  children,
  rootMargin = "200px 0px",
  className = "",
}) => {
  const containerRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || shouldRender) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setShouldRender(true);
        observer.disconnect();
      },
      {
        rootMargin,
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* LANDING PAGE                                                               */
/* -------------------------------------------------------------------------- */

const LandingPage = () => {
  return (
    <main>
      {/* Keep the hero synchronous for the initial viewport. */}
      <Hero />

      {/* Load the first section earlier to reduce the chance of a visible gap. */}
      <DeferredSection rootMargin="350px 0px">
        <StatsSection />
      </DeferredSection>

      {/* Load later sections closer to the viewport to limit concurrent work. */}
      <DeferredSection rootMargin="200px 0px">
        <About />
      </DeferredSection>

      <DeferredSection rootMargin="200px 0px">
        <Services />
      </DeferredSection>

      <DeferredSection rootMargin="200px 0px">
        <Brands />
      </DeferredSection>

      <DeferredSection rootMargin="200px 0px">
        <WorksCTA />
      </DeferredSection>

      <DeferredSection rootMargin="200px 0px">
        <TechCapabilities />
      </DeferredSection>

      <DeferredSection rootMargin="200px 0px">
        <ProductsCTA />
      </DeferredSection>

      <DeferredSection rootMargin="200px 0px">
        <WhyChooseUs />
      </DeferredSection>

      <DeferredSection rootMargin="200px 0px">
        <ParentCompany />
      </DeferredSection>

      <DeferredSection rootMargin="200px 0px">
        <Reviews />
      </DeferredSection>
    </main>
  );
};

export default LandingPage;
