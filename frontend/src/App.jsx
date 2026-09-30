import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import LandingPage from "./pages/LandingPage";
import Portfolio from "./pages/Portfolio";
import ProductPage from "./pages/ProductPage";

import AdminApp from "./admin/AdminApp";
import WhatsAppSticker from "./components/global/WhatsAppSticker";
import Toaster from "./components/global/Toaster";
import ContactDrawer from "./components/global/ContactDrawer";

/*
 * =========================================================
 * SCROLL TO TOP
 * =========================================================
 *
 * Runs whenever the URL changes.
 *
 * This keeps every new route at the top instead of restoring
 * the previous scroll position.
 */

const ScrollToTop = () => {
  const { pathname } = useLocation();

  /*
   * Disable browser's automatic scroll restoration.
   */
  window.history.scrollRestoration = "manual";

  /*
   * Scroll immediately when the route changes.
   */
  window.scrollTo(0, 0);

  return null;
};

const App = () => {
  const location = useLocation();

  const isAdminArea =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (
    <>
      <ScrollToTop />

      {!isAdminArea && (
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      )}

      <Toaster />

      <Routes>
        {/* =================================================
            PUBLIC WEBSITE
            ================================================= */}

        <Route path="/" element={<LandingPage />} />

        <Route path="/portfolio" element={<Portfolio />} />

        <Route path="/services" element={<ProductPage />} />
        {/* =================================================
            ADMIN APPLICATION
            ================================================= */}

        <Route path="/admin/*" element={<AdminApp />} />

        {/* =================================================
            PUBLIC FALLBACK
            ================================================= */}

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminArea && (
        <>
          <Footer />
          <WhatsAppSticker />
          <ContactDrawer />
        </>
      )}
    </>
  );
};

export default App;
