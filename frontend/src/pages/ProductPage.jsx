import ProductHero from "../components/productpage/ProductHero";
import PackagesSection from "../components/productpage/PackagesSection";
import WorksCTA from "../components/global/WorksCTA";
import AdditionalServices from "../components/productpage/AdditionalServices";
import ContactCTA from "../components/global/ContactCTA";

const ProductPage = () => {
  return (
    <main className="relative overflow-hidden bg-[#080907]">
      <ProductHero />

      <PackagesSection />

      <WorksCTA />

      <AdditionalServices />

      <ContactCTA />
    </main>
  );
};

export default ProductPage;
