import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Zap } from "lucide-react";
import ParticleBackground from "./ParticleBackground";

const HeroSection = () => {
  const scrollToClassify = () => {
    document.getElementById("classify")?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg">
      {/* Animated Orbs */}
      <div className="orb orb-indigo w-[500px] h-[500px] top-[10%] left-[10%]" />
      <div className="orb orb-cyan w-[400px] h-[400px] bottom-[10%] right-[8%]" />
      <div className="orb orb-violet w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Particles */}
      <ParticleBackground />

      {/* Grid overlay */}
      <div className="absolute inset-0 hero-grid opacity-100" style={{ zIndex: 2 }} />

      {/* Content */}
      <motion.div
        variants={containerVariants} initial="hidden" animate="visible"
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="hero-badge animated-border">
            {/* <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> */}
            {/* <span>Powered by WordNet · DBpedia · TF-IDF</span> */}
            {/* <Zap className="w-3.5 h-3.5 text-indigo-400" /> */}
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div variants={itemVariants}>
          <motion.h1
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <span className="text-white">Semantic Web</span>
            <br />
            <span className="gradient-text">Text Classifier</span>
          </motion.h1>
        </motion.div>

        {/* Subheading */}
        <motion.p variants={itemVariants}
          className="text-slate-400 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          An intelligent system that understands and classifies text based on{" "}
          <span className="text-indigo-400 font-medium">semantic meaning</span> 
          {/* using{" "} */}
          {/* <span className="text-cyan-400 font-medium">Artificial Intelligence</span> and{" "}
          <span className="text-violet-400 font-medium">Semantic Web</span> technologies. */}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <motion.button
            onClick={scrollToClassify}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary text-lg w-full sm:w-auto"
          >
            {/* <Zap className="w-5 h-5" />*/} Try the System 
          </motion.button>
          <motion.a href="#about"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="btn-secondary w-full sm:w-auto"
          >
            Learn More
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[{ value: "4", label: "Categories" }, { value: "AG News", label: "Dataset" }, { value: "NLP + ML", label: "Technology" }].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
        onClick={scrollToClassify}
      >
        <ArrowDown className="w-6 h-6 text-slate-500" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
