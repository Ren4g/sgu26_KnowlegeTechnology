import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, Sparkles, BarChart2, CheckCircle2, ArrowRight, Cpu } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Raw Text Input",
    description:
      "User submits a plain-text article or sentence. The system accepts any free-form English text and sanitizes it for processing.",
    detail: "Input layer",
    color: "indigo",
    gradient: "from-indigo-500/20 to-indigo-600/5",
    border: "border-indigo-500/30",
    glow: "shadow-indigo-500/20",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
    numberColor: "text-indigo-500/40",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Semantic Enrichment",
    description:
      "WordNet expands tokens with synonyms and hypernyms. DBpedia resolves named entities to structured concepts, deepening semantic coverage.",
    detail: "WordNet · DBpedia",
    color: "cyan",
    gradient: "from-cyan-500/20 to-cyan-600/5",
    border: "border-cyan-500/30",
    glow: "shadow-cyan-500/20",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    numberColor: "text-cyan-500/40",
  },
  {
    number: "03",
    icon: BarChart2,
    title: "TF-IDF Vectorization",
    description:
      "The enriched text is transformed into a high-dimensional TF-IDF feature vector, weighting terms by their importance relative to the entire corpus.",
    detail: "Feature extraction",
    color: "violet",
    gradient: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/30",
    glow: "shadow-violet-500/20",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
    numberColor: "text-violet-500/40",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Semantic Classification",
    description:
      "A trained ML classifier predicts one of four categories — World, Sports, Business, or Sci/Tech — with confidence scores returned to the UI.",
    detail: "ML model · 4 classes",
    color: "emerald",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    numberColor: "text-emerald-500/40",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" },
  }),
};

const HowItWorksSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="relative py-32 px-6 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0d1829] to-[#0f172a]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-400">Pipeline Overview</span>
          </div>
          <h2
            className="font-bold text-4xl sm:text-5xl text-white mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Four precise steps transform raw text into{" "}
            <span className="text-indigo-400 font-medium">semantic classification</span>.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`relative glass-card rounded-2xl p-6 border ${step.border} bg-gradient-to-br ${step.gradient} shadow-lg ${step.glow} flex flex-col gap-4 cursor-default`}
              >
                {/* Step number watermark */}
                <span
                  className={`absolute top-4 right-5 text-5xl font-black select-none pointer-events-none ${step.numberColor}`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {step.number}
                </span>

                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl ${step.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${step.iconColor}`} />
                </div>

                {/* Title */}
                <h3
                  className="font-bold text-lg text-white leading-snug"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed flex-1">{step.description}</p>

                {/* Tag */}
                <div className={`inline-flex items-center gap-1.5 text-xs font-medium ${step.iconColor} glass px-3 py-1 rounded-full w-fit`}>
                  <span>{step.detail}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Flow connector (desktop only) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="hidden lg:flex items-center justify-center gap-0 mt-10 px-8"
        >
          {steps.map((step, i) => (
            <React.Fragment key={step.number}>
              <div className={`text-xs font-semibold ${step.iconColor} glass px-3 py-1 rounded-full whitespace-nowrap`}>
                {step.title}
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-slate-600 flex-shrink-0 mx-1" />
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
