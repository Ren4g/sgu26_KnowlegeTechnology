import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, Loader2, Brain, Tag, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

const CATEGORY_CONFIG = {
  World:      { emoji: "🌍", gradient: "from-cyan-500 to-blue-600",    bg: "rgba(6,182,212,0.08)",   border: "rgba(6,182,212,0.3)"   },
  Sports:     { emoji: "⚽", gradient: "from-violet-500 to-purple-600", bg: "rgba(139,92,246,0.08)",  border: "rgba(139,92,246,0.3)"  },
  Business:   { emoji: "💼", gradient: "from-indigo-500 to-blue-600",   bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.3)"  },
  "Sci/Tech": { emoji: "🚀", gradient: "from-cyan-400 to-indigo-500",   bg: "rgba(34,211,238,0.08)",  border: "rgba(34,211,238,0.3)"  },
};

const SAMPLE_TEXTS = [
  "NASA announces breakthrough in quantum computing technology that could revolutionize space exploration.",
  "The Federal Reserve raises interest rates amid growing concerns about inflation in global markets.",
  "Manchester United defeats Chelsea 3-1 in a thrilling Premier League match at Old Trafford.",
  "World leaders gather at the UN summit to discuss climate change and international security.",
];

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL.replace(/\/$/, "")
  : "";
const CLASSIFY_ENDPOINT = API_BASE_URL ? `${API_BASE_URL}/classify` : "/api/classify";

const ClassifySection = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const classify = async () => {
    if (!text.trim()) { setError("Please enter some text first."); return; }
    setLoading(true); setError(""); setResult(null); setShowDetails(false);
    try {
      const res = await axios.post(CLASSIFY_ENDPOINT, { text });
      setResult(res.data);
    } catch {
      setError("⚠️ Cannot connect to API server. If running locally, set REACT_APP_API_BASE_URL=http://localhost:8000.");
    } finally {
      setLoading(false);
    }
  };

  const config = result ? (CATEGORY_CONFIG[result.category] || CATEGORY_CONFIG["Sci/Tech"]) : null;

  return (
    <section id="classify" className="relative py-32 px-6 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0d1929] to-[#0f172a]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-slate-400">Semantic Analysis Engine</span>
          </div>
          <h2 className="font-bold text-4xl sm:text-5xl text-white mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Classify Your <span className="gradient-text">Text</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Enter any news article and our AI will identify its category using semantic understanding.
          </p>
        </motion.div>

        {/* Sample Chips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }} className="flex flex-wrap gap-2 mb-4 justify-center">
          {SAMPLE_TEXTS.map((sample, i) => (
            <motion.button key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setText(sample); setResult(null); setError(""); }}
              className="text-xs text-slate-400 hover:text-white glass px-3 py-1.5 rounded-full border border-white/5 hover:border-indigo-500/30 transition-all">
              Sample {i + 1}
            </motion.button>
          ))}
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }} className="glass-dark rounded-3xl p-8 animated-border">
          <div className="relative mb-6">
            <textarea value={text} onChange={(e) => { setText(e.target.value); setError(""); }}
              onKeyDown={(e) => e.ctrlKey && e.key === "Enter" && classify()}
              placeholder="Enter your text here to classify... (Ctrl+Enter to submit)"
              rows={6}
              className="input-glow"
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-600">{text.length} chars</div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button onClick={classify} disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Semantics...</>
            ) : (
              <><Search className="w-5 h-5" /> Classify Text</>
            )}
          </motion.button>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && config && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-6 rounded-3xl p-8 border" style={{ borderColor: config.border, background: config.bg }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                    {config.emoji}
                  </motion.div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1 flex items-center gap-1"><Tag className="w-3 h-3" /> Predicted Category</p>
                    <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>{result.category}</h3>
                  </div>
                </div>
                {result.confidence && (
                  <div className="text-right">
                    <p className="text-slate-400 text-sm mb-1">Confidence</p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                      className={`text-3xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                      {result.confidence}%
                    </motion.p>
                  </div>
                )}
              </div>

              {result.confidence && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Confidence Score</span><span>{result.confidence}%</span>
                  </div>
                  <div className="confidence-bar-track">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                      className={`confidence-bar-fill bg-gradient-to-r ${config.gradient}`} />
                  </div>
                </div>
              )}

              <button onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showDetails ? "Hide" : "Show"} Semantic Analysis Details
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} className="mt-4 space-y-4 overflow-hidden">
                    <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                      <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">🔤 WordNet Features</p>
                      <p className="text-slate-400 text-sm leading-relaxed">{result.wordnet_features || "None found"}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                      <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">🔗 DBpedia Entities</p>
                      <p className="text-slate-400 text-sm leading-relaxed break-all">{result.dbpedia_features || "None found"}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ClassifySection;
