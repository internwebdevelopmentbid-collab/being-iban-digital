import Reviews from "../components/global/Reviews";
import About from "../components/landingpage/About";
import Brands from "../components/landingpage/Brands";
import Hero from "../components/landingpage/hero/Hero";
import ParentCompany from "../components/landingpage/ParentCompany";
import ProductsCTA from "../components/landingpage/ProductsCTA";
import Services from "../components/landingpage/Services";
import StatsSection from "../components/landingpage/StatsSection";
import TechCapabilities from "../components/landingpage/TechCapabilities";
import WhyChooseUs from "../components/landingpage/WhyChooseUs";
import WorksCTA from "../components/global/WorksCTA";

const LandingPage = () => {
  return (
    <main className="landing-page">
      <Hero />
      <StatsSection />
      <About />
      <Services />
      <Brands />
      <WorksCTA />
      <TechCapabilities />
      <ProductsCTA />
      <WhyChooseUs />
      <ParentCompany />
      <Reviews />
    </main>
  );
};

export default LandingPage;
