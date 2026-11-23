import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import WhatsAppSticker from "./components/global/WhatsAppSticker";
import ContactDrawer from "./components/global/ContactDrawer";

import LandingPage from "./pages/LandingPage";

/* -------------------------------------------------------------------------- */
/* LAZY ROUTES                                                                */
/* -------------------------------------------------------------------------- */

const Portfolio = lazy(() => import("./pages/Portfolio"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const ServicePackages = lazy(() => import("./pages/ServicePackages"));
const AdditionalPackages = lazy(() => import("./pages/AdditionalPackages"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminApp = lazy(() => import("./admin/AdminApp"));

/* -------------------------------------------------------------------------- */
/* SCROLL TO TOP                                                              */
/* -------------------------------------------------------------------------- */

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};

/* -------------------------------------------------------------------------- */
/* APP                                                                        */
/* -------------------------------------------------------------------------- */

const App = () => {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/admin");

  return (
    <div className="relative min-h-screen">
      <ScrollToTop />

      <div className="relative z-[2]">
        {!isAdminArea && <Navbar />}

        <Toaster />

        <Suspense fallback={null}>
          <Routes>
            {/* Critical initial route */}
            <Route path="/" element={<LandingPage />} />

            {/* Loaded only when requested */}
            <Route path="/portfolio" element={<Portfolio />} />

            <Route path="/services" element={<ProductPage />} />

            {/* Service package pages */}
            <Route path="/services/:packageId" element={<ServicePackages />} />

            {/* Additional Service package pages */}
            <Route
              path="/additional-services/:serviceId"
              element={<AdditionalPackages />}
            />

            {/* Admin is code-split */}
            <Route path="/admin/*" element={<AdminApp />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        {!isAdminArea && (
          <>
            <Footer />
            <WhatsAppSticker />
            <ContactDrawer />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
