"use client";

import { useState, useEffect } from "react";
import NavAvatar from "./NavAvatar";

export default function TopNav() {
  const [activeSection, setActiveSection] = useState("");

  const links = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Journey", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = links.map(link => link.href.substring(1));
      let current = "";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
          }
        }
      }

      if (window.scrollY < 100) {
        current = "";
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-auto border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 py-4 shadow-lg transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a href="#" className="flex items-center gap-3 group cursor-pointer transition-all relative overflow-hidden py-1.5 px-3 -ml-3 rounded-xl hover:bg-white/5">
          {/* Animated Scanning Beam (sweeps from left to right on hover) */}
          <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent -translate-x-16 group-hover:translate-x-[200px] transition-transform duration-1000 ease-in-out skew-x-12 blur-sm z-0"></div>

          {/* Fingerprint Symbol */}
          <div className="relative z-10 flex items-center justify-center text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)] group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.06 6.5a.5.5 0 0 1 .5.5v1.161c0 .464-.028.917-.083 1.353-.082.637-.25 1.25-.49 1.834l-.048.118a.5.5 0 0 1-.926-.376l.049-.12a6.386 6.386 0 0 0 .432-1.611 9.408 9.408 0 0 0 .066-1.196V7a.5.5 0 0 1 .5-.5zm.513 2.658c.277.587.494 1.215.642 1.87.112.502.181 1.02.203 1.547a.5.5 0 1 1-.998.05 6.46 6.46 0 0 0-.171-1.282 8.358 8.358 0 0 0-.54-1.564.5.5 0 0 1 .864-.62zM6.5 4.5a2 2 0 0 1 4 0 .5.5 0 0 1-1 0 1 1 0 0 0-2 0v2.79c0 .736.082 1.46.241 2.167.126.558.307 1.1.536 1.621a.5.5 0 0 1-.914.404c-.26-.59-.465-1.206-.61-1.84a9.585 9.585 0 0 1-.253-2.35V4.5zm2.59-3.486a4.001 4.001 0 0 0-3.084 1.272A3.5 3.5 0 0 0 5.09 5.5v2.993c0 .546.064 1.08.19 1.6.1.41.229.81.385 1.2a.5.5 0 0 1-.914.406c-.183-.414-.337-.84-.458-1.278A8.475 8.475 0 0 1 4.09 8.493V5.5a4.5 4.5 0 0 1 1.185-3.078 5.001 5.001 0 0 1 3.825-1.408.5.5 0 1 1-.01 1zM3 5.5v3.42c0 .484.053.957.158 1.416.14.613.34 1.205.597 1.764a.5.5 0 0 1-.905.418c-.297-.643-.53-1.325-.69-2.029A8.257 8.257 0 0 1 2 8.92V5.5a.5.5 0 1 1 1 0zm8.384 1.14a.5.5 0 0 1 .374.606c-.055.207-.123.41-.202.607a.5.5 0 0 1-.922-.387c.063-.153.119-.31.166-.47a.5.5 0 0 1 .584-.356zm1.145-2.023c.31.282.593.593.843.931a.5.5 0 0 1-.806.59 4.303 4.303 0 0 0-.693-.765.5.5 0 0 1 .656-.756zm-1.879-1.921A6.994 6.994 0 0 1 14 5.5a.5.5 0 0 1-1 0 5.992 5.992 0 0 0-2.825-5.093.5.5 0 0 1 .533-.85z"/>
            </svg>
          </div>
          
          {/* Name */}
          <span className="relative z-10 text-xl font-bold tracking-tight text-white transition-all duration-300 ml-1 group-hover:text-cyan-50">
            Swarup GL
          </span>
        </a>
        <div className="flex items-center gap-4 sm:gap-6">
          {links.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                className={`text-xs sm:text-sm font-medium transition-all duration-300 relative ${
                  isActive 
                    ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" 
                    : "text-slate-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 h-0.5 w-full -translate-x-1/2 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                )}
              </a>
            );
          })}
          
          <div className="ml-2 sm:ml-4 border-l border-white/20 pl-2 sm:pl-4 flex items-center justify-center">
            <NavAvatar />
          </div>
        </div>
      </div>
    </nav>
  );
}
