import React from "react";
import { Brain } from "lucide-react";

const Footer = () => (
  <footer className="relative py-10 px-8">
    <div className="footer-divider" />
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center glow-indigo">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <span className="text-slate-400 text-sm font-semibold tracking-wide">Semantic Classifier</span>
      </div>
      <p className="shimmer-text text-sm text-center">
        Built with WordNet · DBpedia · TF-IDF · FastAPI · React
      </p>
      <p className="text-slate-600 text-xs">© 2026 Knowledge Technology</p>
    </div>
  </footer>
);

export default Footer;
