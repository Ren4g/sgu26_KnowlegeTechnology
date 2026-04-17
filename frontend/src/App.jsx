import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ClassifySection from "./components/ClassifySection";
import HowItWorksSection from "./components/HowItWorksSection";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0f172a] overflow-x-hidden">
        <Navbar />
        <main>
          <HeroSection />
          <ClassifySection />
          <HowItWorksSection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
