"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = links.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActive(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMenuOpen(false);
    const el = document.getElementById(href.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 " +
          (scrolled
            ? "border-b border-white/10 bg-slate-950/60 backdrop-blur-xl shadow-lg"
            : "bg-transparent")
        }
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleClick("#home");
            }}
            className="text-lg font-semibold tracking-tight text-slate-50"
          >
            Swarup<span className="text-slate-400">.</span>
          </a>

          {/* Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(l.href);
                }}
                className={
                  "rounded-full px-3 py-1.5 text-sm transition-colors " +
                  (active === l.href.slice(1)
                    ? "bg-white/10 text-slate-50"
                    : "text-slate-400 hover:text-slate-200")
                }
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="relative z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1">
              <span
                className={
                  "block h-px w-4 bg-slate-200 transition-transform " +
                  (menuOpen ? "translate-y-[3px] rotate-45" : "")
                }
              />
              <span
                className={
                  "block h-px w-4 bg-slate-200 transition-opacity " +
                  (menuOpen ? "opacity-0" : "")
                }
              />
              <span
                className={
                  "block h-px w-4 bg-slate-200 transition-transform " +
                  (menuOpen ? "-translate-y-[3px] -rotate-45" : "")
                }
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center gap-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(l.href);
                  }}
                  className={
                    "rounded-full px-5 py-2 text-lg transition-colors " +
                    (active === l.href.slice(1)
                      ? "bg-white/10 text-slate-50"
                      : "text-slate-400 hover:text-slate-200")
                  }
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
