import Image from "next/image";
import TypingEffect from "@/components/TypingEffect";
import TiltCard from "@/components/TiltCard";
import HardwareModelPlaceholder from "@/components/HardwareModelPlaceholder";
import ImageCompareSlider from "@/components/ImageCompareSlider";
import Reveal from "@/components/Reveal";
import RotatingBanner from "@/components/RotatingBanner";
import TopNav from "@/components/TopNav";

/**
 * ==========================================
 * DATA CONSTANTS
 * ==========================================
 * We define our data outside the React component so it isn't recreated
 * on every render. This improves performance.
 */

const skills = [
  "TensorFlow",
  "PyTorch",
  "Python",
  "C++",
  "JavaScript",
  "React",
  "Node.js",
  "OpenCV",
  "TypeScript",
  "IPFS",
  "ESP8266",
  "MATLAB"
];

type Project = {
  name: string;
  description: string;
  techStack: string[];
  keyInnovation: string;
  imageSrc: string;
  hasCompare?: boolean;
  repoUrl?: string;
};

const projects: Project[] = [
  {
    name: "Ghost-Eye",
    description: "A multi-modal object detection system combining thermal, radar, and camera data for navigation in low-visibility/foggy conditions.",
    techStack: ["TensorFlow", "Three.js", "React"],
    keyInnovation: "Integrated 6G ISAC for sensing and communication",
    imageSrc: "/images/ghost-eye.svg",
  },

  {
    name: "Chrono-Aware Embryo Classification",
    description: "Hybrid CNN+LSTM model achieving 89.42% accuracy in embryo viability prediction.",
    techStack: ["PyTorch", "CNN", "LSTM"],
    keyInnovation: "Time-series image analysis",
    imageSrc: "/images/thermal-segmented.svg",
  },
  {
    name: "Breast Ultrasound Tumor Classification",
    description: "Custom 48K-parameter CNN for tumor classification achieving 83.33% accuracy.",
    techStack: ["TensorFlow", "CNN", "Medical Imaging"],
    keyInnovation: "Highly optimized edge-friendly CNN",
    imageSrc: "/images/ghost-eye.svg",
  },
  {
    name: "Thermal Foot Ulcer Detection",
    description: "Comparative study between DIP and CNN for diabetic foot ulcer detection, 80.4% precision.",
    techStack: ["OpenCV", "Python", "Deep Learning"],
    keyInnovation: "Thermal imaging analysis",
    imageSrc: "/images/thermal-segmented.svg",
  },
  {
    name: "Bluetooth Biometric Attendance",
    description: "Smart attendance system using ESP8266 and fingerprint scanner over Bluetooth.",
    techStack: ["ESP8266", "C++", "Hardware"],
    keyInnovation: "Wireless biometric authentication",
    imageSrc: "/images/drone-fc.svg",
  },
  {
    name: "Dormant Device Detection",
    description: "GPS telemetry system that optimizes power by switching to a 10% duty cycle when dormant.",
    techStack: ["GPS", "IoT", "C++"],
    keyInnovation: "Ultra-low power optimization",
    imageSrc: "/images/drone-fc.svg",
  },
  {
    name: "GPS Turn Alert System",
    description: "Real-time curve detection and speed suggestion system using GPS data.",
    techStack: ["Python", "GPS", "Algorithms"],
    keyInnovation: "Predictive speed adjustment",
    imageSrc: "/images/drone-fc.svg",
  },
  {
    name: "Verdict Vault",
    description: "A secure decentralized legal document storage system using Blockchain and IPFS.",
    techStack: ["Blockchain", "IPFS", "Node.js"],
    keyInnovation: "Immutable audit trails",
    imageSrc: "/images/verdict-vault.svg",
  },
];

const experience = [
  {
    title: "Bachelor of Technology",
    org: "Indian Institute of Information Technology, Raichur",
    period: "2023 - 2027",
    highlight: true,
    bullets: [
      "Major in Artificial Intelligence and Data Science",
    ],
    certificateUrl: "#"
  },
  {
    title: "ElectroGeeks Club Coordinator",
    org: "IIIT Raichur",
    period: "Jan 2025 - Feb 2026",
    highlight: true,
    bullets: [
      "Technical workshops on embedded systems, drones, telemetry",
      "Hardware deployment & procurement management"
    ],
    certificateUrl: "#"
  },
  {
    title: "AUTOwn'24 Competition",
    org: "BITS Pilani, Hyderabad",
    period: "Nov 2024",
    highlight: false,
    bullets: [
      "National ADAS project competition",
    ],
    certificateUrl: "#"
  },
  {
    title: "Bosch Competition",
    org: "Bosch",
    period: "2024",
    highlight: false,
    bullets: [
      "Participated and presented innovative IoT and AI solutions in the competitive technology showcase."
    ],
    certificateUrl: "#"
  },
];

/**
 * ==========================================
 * REUSABLE COMPONENTS
 * ==========================================
 */

/**
 * GlassPanel Component
 * Creates a structured, premium container using "glassmorphism".
 * 
 * Tailwind Classes Used:
 * - relative: Positions child elements relative to this container.
 * - overflow-hidden: Ensures the subtle gradient borders don't spill out.
 * - bg-white/5: A very subtle 5% white background.
 * - backdrop-blur-md: Blurs the interactive canvas behind the panel for a frosted glass effect.
 * - border border-white/10: A subtle 10% white border to define the shape.
 */
function GlassPanel({ children, className = "" }: { children: React.ReactNode; className?: string; }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10 ${className}`}>
      {/* Subtle top inner shadow for depth */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * SectionHeading Component
 * Standardizes the titles across all sections for a structured look.
 */
function SectionHeading({ title, highlight }: { title: string, highlight: string }) {
  return (
    <Reveal className="mb-16 text-center md:text-left flex flex-col items-center md:items-start" amount={0.6}>
      <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
        {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{highlight}</span>
      </h2>
      {/* Decorative structured underline */}
      <div className="mt-4 h-1 w-16 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
    </Reveal>
  );
}



/**
 * ==========================================
 * MAIN PAGE COMPONENT
 * ==========================================
 * This is the default export that Next.js uses as the entry point for the '/' route.
 */
export default function Home() {
  return (
    // overflow-x-hidden prevents horizontal scrolling bugs on mobile devices
    <div className="relative min-h-screen overflow-x-hidden selection:bg-cyan-500/30">

      <TopNav />

      {/* Decorative dotted pattern at top right */}
      <div className="absolute top-0 right-0 z-0 h-[600px] w-[600px] opacity-30 pointer-events-none">
        <svg
          className="absolute right-0 top-0 h-full w-full"
          style={{ maskImage: "radial-gradient(ellipse at top right, black, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at top right, black, transparent 70%)" }}
        >
          <defs>
            <pattern id="dotted-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <animate attributeName="x" from="0" to="24" dur="5s" repeatCount="indefinite" />
              <animate attributeName="y" from="0" to="24" dur="10s" repeatCount="indefinite" />
              <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-cyan-400">
                <animate attributeName="r" values="1.5;2;1.5" dur="3s" repeatCount="indefinite" />
              </circle>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotted-pattern)" />
        </svg>
      </div>

      <main className="relative">

        {/* =========================================
            SECTION 1: HERO
            ========================================= */}
        <section className="relative w-full">
          {/* min-h-[100vh] ensures the hero section always takes up at least 100% of the viewport height */}
          <div className="mx-auto flex min-h-[100vh] max-w-6xl flex-col justify-center px-6 py-20">
            <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-12 mt-16 z-10">

              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6 w-full md:w-3/5">
                <Reveal className="w-full flex flex-col items-center md:items-start" amount={0.6}>
                  {/* Structured pill badge / Rotating Banner */}
                  <RotatingBanner />

                  <h1 className="text-balance text-5xl font-extrabold tracking-tight text-white sm:text-7xl drop-shadow-lg">
                    Swarup G L
                  </h1>

                  <div className="mt-4 text-xl sm:text-2xl font-light text-slate-300 h-10">
                    <TypingEffect text="Building solutions at the intersection of AI, Computer Vision, and Embedded Systems." />
                  </div>

                  <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
                    I architect and deploy end-to-end prototypes—from complex deep learning models to robust edge hardware—solving real-world problems with highly structured, performance-driven solutions.
                  </p>

                  <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
                    {/* Primary Call to Action Button */}
                    <a
                      href="#projects"
                      className="inline-flex h-12 items-center justify-center rounded-lg bg-cyan-600 px-8 text-sm font-medium text-white transition-all hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] gap-2"
                    >
                      View Projects
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                      </svg>
                    </a>
                  </div>

                  {/* Social Links */}
                  <div className="mt-12 flex gap-6">
                    <a href="https://www.linkedin.com/in/swarup-g-l/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" /></svg>
                    </a>
                    <a href="https://github.com/Swarupgl" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>
                    </a>
                  </div>
                </Reveal>
              </div>

              <Reveal className="flex justify-center md:justify-end w-full md:w-2/5" amount={0.8}>
                <TiltCard maxTilt={15}>
                  <div className="relative h-64 w-64 md:h-80 md:w-80 lg:h-[400px] lg:w-[400px] rounded-full p-2 border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm shadow-[0_0_30px_rgba(6,182,212,0.15)] flex-shrink-0">
                    <div className="absolute inset-3 rounded-full overflow-hidden border border-white/10 bg-slate-900/50">
                      <Image
                        src="/images/swarup_g_l.jpg"
                        alt="Swarup G L"
                        fill
                        className="object-cover object-top"
                        priority
                        sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 400px"
                      />
                    </div>
                    {/* Decorative orbital rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-[spin_10s_linear_infinite] border-t-cyan-400/80" />
                    <div className="absolute inset-[-12px] rounded-full border border-dashed border-cyan-400/20 animate-[spin_25s_linear_infinite_reverse]" />
                  </div>
                </TiltCard>
              </Reveal>

            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 2: ABOUT ME
            ========================================= */}
        <section id="about" className="mx-auto max-w-5xl px-6 pb-24 relative z-10">
          <SectionHeading title="About" highlight="Me" />

          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {/* Text Content */}
            <Reveal amount={0.4} className="w-full">
              <GlassPanel className="p-8 sm:p-12 border-t-4 border-t-cyan-500">
                <h3 className="text-2xl font-bold text-white mb-2">B.Tech Student @ IIIT Raichur</h3>
                <p className="text-cyan-400 font-medium mb-6">AI & Data Science</p>

                <div className="space-y-4 text-slate-300 leading-relaxed text-base sm:text-lg">
                  <p>
                    I am an AI Researcher and Full-Stack Developer specializing in building systems that blend Deep Learning with edge hardware constraints. My expertise lies in Python, TensorFlow, and Embedded Systems.
                  </p>
                  <p>
                    I bridge the gap between complex theoretical models and real-world hardware deployment. Whether I'm building custom 6G ISAC frameworks or decentralized storage (Verdict Vault), my focus is always on rigorous architecture and measurable performance.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Location</h4>
                    <p className="text-slate-200 text-sm">Raichur, Karnataka</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Email</h4>
                    <p className="text-slate-200 text-sm">swarupthippyswamy@gmail.com</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Phone</h4>
                    <p className="text-slate-200 text-sm">+91 7676603557</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <a
                    href="/Swarup_CV_1.pdf"
                    target="_blank"
                    download="Swarup_GL_CV.pdf"
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm px-6 text-sm font-medium text-cyan-300 transition-all hover:bg-cyan-500/20 hover:border-cyan-500/50 gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                    </svg>
                    Download CV
                  </a>
                </div>
              </GlassPanel>
            </Reveal>
          </div>
        </section>

        {/* =========================================
            SECTION 3: SKILLS
            ========================================= */}
        <section id="skills" className="mx-auto max-w-5xl px-6 pb-24 relative z-10">
          <SectionHeading title="Technical" highlight="Toolkit" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {skills.map((skillName) => {
              // Calculate how many projects use this skill (implicit connection)
              const count = projects.filter(p =>
                p.techStack.some(t => t.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(t.toLowerCase()))
              ).length;

              return (
                <Reveal key={skillName} amount={0.4}>
                  <div className="flex flex-col items-center justify-center p-6 bg-[#0a0f1c] rounded-2xl border border-white/5 shadow-lg hover:border-cyan-500/50 hover:bg-slate-800/40 hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden group">
                    <div className="absolute left-0 top-0 w-full h-1 bg-cyan-500/30 group-hover:bg-cyan-400 transition-colors"></div>
                    <span className="font-bold text-slate-200 text-lg sm:text-xl">{skillName}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* =========================================
            SECTION 4: EXPERIENCE
            ========================================= */}
        <section id="experience" className="mx-auto max-w-4xl px-6 pb-24 relative z-10">
          <SectionHeading title="Professional" highlight="Journey" />

          <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-6 md:ml-12 space-y-12 pb-8">
            {experience.map((e, idx) => (
              <div key={e.title} className="relative pl-8 sm:pl-12">
                <Reveal amount={0.4}>
                  {/* Timeline dot */}
                  <div className="absolute -left-[21px] sm:-left-[29px] top-1 h-10 w-10 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                    <div className={`h-3 w-3 rounded-full ${e.highlight ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]" : "bg-slate-600"}`}></div>
                  </div>

                  <div className="flex flex-col gap-1 mb-4">
                    <h3 className="text-xl font-bold text-white">{e.title}</h3>
                    <div className="text-lg font-medium text-cyan-400">{e.org}</div>
                    <div className="text-sm font-semibold text-slate-500 tracking-wide uppercase mt-1">{e.period}</div>
                  </div>
                  <ul className="space-y-3 text-base text-slate-300 list-none mb-4">
                    {e.bullets.map((b) => (
                      <li key={b} className="relative pl-5 leading-relaxed">
                        {/* Custom bullet point */}
                        <svg className="absolute left-0 top-1.5 h-3 w-3 text-cyan-500/70" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                        </svg>
                        {b}
                      </li>
                    ))}
                  </ul>

                  {e.certificateUrl && (
                    <a href={e.certificateUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors border border-cyan-500/20 w-fit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                      </svg>
                      View Certificate
                    </a>
                  )}
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            SECTION 5: PROJECTS
            ========================================= */}
        <section id="projects" className="mx-auto max-w-6xl px-6 pb-24 relative z-10">
          <SectionHeading title="Featured" highlight="Projects" />

          {/* grid-cols-1, 2, or 3 based on screen size. This provides a highly structured card layout. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Reveal key={p.name} amount={0.4}>
                {/* group class allows child elements to react when this parent card is hovered */}
                <div className="group flex flex-col h-full rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">

                  {/* Decorative Project Icon Placeholder */}
                  <div className="mb-6 h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
                      <path d="M6 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5z" />
                    </svg>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{p.name}</h3>
                  <p className="text-sm text-cyan-400 font-medium mb-4 pb-4 border-b border-white/10">
                    Innovation: {p.keyInnovation}
                  </p>
                  <p className="text-base text-slate-400 flex-grow mb-6 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {p.techStack.map((t) => (
                      <span key={t} className="text-xs font-semibold text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                  <a href={p.repoUrl || "https://github.com/Swarupgl"} target="_blank" rel="noreferrer" className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors border border-white/10 group-hover:border-cyan-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>
                    Repository
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* =========================================
            SECTION 6: CONTACT
            ========================================= */}
        <section id="contact" className="mx-auto max-w-4xl px-6 pb-24 relative z-10">
          <Reveal className="mb-12 text-center" amount={0.6}>
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Connect</span>
            </h2>
            <div className="mt-4 h-1 w-16 bg-gradient-to-r from-cyan-500 to-transparent mx-auto rounded-full" />
            <p className="mt-6 text-slate-300 leading-relaxed max-w-lg mx-auto text-lg">
              I'm actively exploring new roles and complex engineering challenges. If you're building something exciting, my inbox is open!
            </p>
          </Reveal>

          <Reveal amount={0.4}>
            <GlassPanel className="p-8 sm:p-12 text-center border-t-4 border-t-cyan-500">
              <a href="mailto:swarupthippyswamy@gmail.com" className="inline-flex items-center justify-center rounded-lg bg-cyan-600 px-10 py-4 text-base font-bold text-white hover:bg-cyan-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] gap-3">
                Send an Email
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" /></svg>
              </a>
              <div className="mt-8">
                <a href="https://wa.me/919108174815" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" /></svg>
                  Connect via WhatsApp
                </a>
              </div>
            </GlassPanel>
          </Reveal>
        </section>

        {/* =========================================
            SECTION 7: FOOTER
            ========================================= */}
        <footer className="bg-[#020617] border-t border-white/10 pt-16 pb-6 relative z-10 mt-12">
          <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Swarup's Portfolio</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Thank you for visiting my personal portfolio website. Connect with me over socials for promotion.
              </p>
              <p className="text-slate-400 text-sm">Keep Rising 🚀. Connect with me over live chat!</p>
            </div>

            <div className="md:px-12">
              <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {["Home", "About", "Skills", "Experience", "Projects", "Contact"].map(link => (
                  <li key={link}>
                    <a href={link === "Home" ? "#" : `#${link.toLowerCase()}`} className="text-slate-400 hover:text-cyan-400 flex items-center gap-2 text-sm transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" /></svg>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6">Contact Info</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-4 text-slate-400 text-sm">
                  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" /></svg>
                  +91 7676603557
                </li>
                <li className="flex items-center gap-4 text-slate-400 text-sm">
                  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 16 16"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" /></svg>
                  swarupthippyswamy@gmail.com
                </li>
                <li className="flex items-center gap-4 text-slate-400 text-sm">
                  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" /></svg>
                  Raichur, Karnataka, India - 584135
                </li>
              </ul>

              <div className="flex gap-3">
                <a href="https://www.linkedin.com/in/swarup-g-l/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 hover:bg-cyan-500 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" /></svg>
                </a>
                <a href="https://github.com/Swarupgl" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 hover:bg-cyan-500 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex justify-center items-center">
            <p className="text-sm text-slate-300 font-medium">Designed With <span className="text-red-500">❤️</span> By <span className="text-amber-500">Swarup G L</span></p>
          </div>
        </footer>
      </main>
    </div>
  );
}
