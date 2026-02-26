import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, Mail, Code2, Brain, Globe } from "lucide-react";

const skills = [
  { icon: Brain,  label: "Machine Learning & NLP",                color: "text-indigo-400" },
  { icon: Globe,  label: "Semantic Web & Knowledge Graphs",       color: "text-cyan-400"   },
  { icon: Code2,  label: "Web Development",                 color: "text-violet-400" },
];

const socials = [
  { icon: Github,   label: "GitHub",   href: "https://github.com/ThinhPT-d",   color: "hover:text-white hover:border-white/40"          },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", color: "hover:text-blue-400 hover:border-blue-400/40"     },
  { icon: Mail,     label: "Email",    href: "mailto:phanthanhthinh117@gmail.com", color: "hover:text-cyan-400 hover:border-cyan-400/40"     },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-32 px-6 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#12102a] to-[#0f172a]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Code2 className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-slate-400">Meet the Developer</span>
          </div>
          <h2 className="font-bold text-4xl sm:text-5xl text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
            About the <span className="gradient-text">Developer</span>
          </h2>
        </motion.div>

        {/* Split Layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — Avatar */}
          <motion.div initial={{ opacity: 0, x: -60 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-center">
            <div className="relative">
              {/* Rotating conic gradient ring */}
              <div className="avatar-ring rounded-3xl p-[3px] inline-block">
              <motion.div whileHover={{ scale: 1.03, rotate: 1 }}
                className="relative w-72 h-72 rounded-3xl overflow-hidden glass-card">
                <div className="w-full h-full bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-28 h-28 rounded-full gradient-bg mx-auto mb-4 flex items-center justify-center glow-indigo">
                      <span className="text-5xl">👨‍💻</span>
                    </div>
                    <p className="text-slate-400 text-sm">Developer</p>
                  </div>
                </div>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-4 right-4">
                  <div className="status-badge">
                    <div className="status-dot" />
                    <span>Available</span>
                  </div>
                </motion.div>
              </motion.div>
              </div>{/* end avatar-ring */}
            </div>
          </motion.div>

          {/* Right — Info */}
          <motion.div initial={{ opacity: 0, x: 60 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }} className="space-y-8">
            <div>
              <h3 className="font-bold text-3xl text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                Phan Thanh Thịnh
              </h3>
              <p className="gradient-text font-semibold text-lg"> </p>
            </div>

            <p className="text-slate-400 leading-relaxed text-base">
              Passionate about building intelligent systems that bridge the gap between human language and machine understanding.
              {/* Specialized in <span className="text-indigo-400">Natural Language Processing</span>,{" "}
              <span className="text-cyan-400">Semantic Web Technologies</span>, and{" "}
              <span className="text-violet-400">Knowledge Graphs</span>. */}
            </p>

            <div className="space-y-3">
              {skills.map((skill, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="feature-card flex items-center gap-3 group">
                  <skill.icon className={`w-5 h-5 ${skill.color} group-hover:scale-110 transition-transform flex-shrink-0`} />
                  <span className="text-slate-300 text-sm font-medium">{skill.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              {socials.map((s, i) => (
                <motion.a key={i} href={s.href} target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
                  className="social-btn">
                  <s.icon className="w-4 h-4" />
                  <span className="hidden sm:block">{s.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
