import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Classify", href: "#classify" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "About", href: "#about" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "navbar-scrolled py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.a href="#hero" className="flex items-center gap-3 group" whileHover={{ scale: 1.02 }}>
          {/* <div className="relative">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center glow-indigo">
              <Brain className="w-5 h-5 text-white" />
            </div>
          </div> */}
          <span className="font-bold text-lg gradient-text hidden sm:block" style={{ fontFamily: "Poppins, sans-serif" }}>
            Semantic Classifier
          </span>
        </motion.a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <motion.a
            href="#classify"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="gradient-bg text-white text-sm font-semibold px-5 py-2.5 rounded-xl glow-indigo transition-all"
          >
            Try Now
          </motion.a>
        </div>

        <button className="md:hidden text-slate-300" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-white/5 px-6 py-4 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
                className="text-slate-300 hover:text-white text-sm font-medium">
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
