import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/lib/i18n";
import { CurrencyProvider } from "@/lib/currency";
import Index from "./pages/Index";
import PropertyDetail from "./pages/PropertyDetail";
import IslandLanding from "./pages/IslandLanding";
import GuideLanding from "./pages/GuideLanding";
import Investment from "./pages/Investment";
import Diaspora from "./pages/Diaspora";
import Sell from "./pages/Sell";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminMigrationNotice from "./pages/admin/AdminMigrationNotice";

// Lazy: pulls in Mapbox GL (~500kb gzip) — only fetch it when /properties is visited.
const Properties = lazy(() => import("./pages/Properties"));

// Lazy + isolated: experimental art-direction prototype (Lenis + heavy scroll-linked motion).
// Not linked from nav, not in the sitemap, blocked in robots.txt — zero footprint on the real site.
const PreviewRadical = lazy(() => import("./pages/PreviewRadical"));

const App = () => (
  <LanguageProvider>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/properties"
              element={
                <Suspense fallback={<div className="min-h-screen bg-background" />}>
                  <Properties />
                </Suspense>
              }
            />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/ilhas/:slug" element={<IslandLanding />} />
            <Route path="/guias/:slug" element={<GuideLanding />} />
            <Route path="/investment" element={<Investment />} />
            <Route path="/diaspora" element={<Diaspora />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/*" element={<AdminMigrationNotice />} />
            <Route
              path="/preview-radical"
              element={
                <Suspense fallback={<div className="min-h-screen bg-black" />}>
                  <PreviewRadical />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </LanguageProvider>
);

export default App;
