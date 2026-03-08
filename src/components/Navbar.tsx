import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowUp, LogIn, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCases } from "@/data/useCases";
import { supabase } from "@/integrations/supabase/client";

const FONT_SCALES = [1, 1.1, 1.2, 1.3] as const;
const FONT_LABELS = ["1×", "1.1×", "1.2×", "1.3×"];

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Estimator", href: "#estimator" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileUseCasesOpen, setMobileUseCasesOpen] = useState(false);
  const [fontScaleIndex, setFontScaleIndex] = useState(0);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fontMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Apply font scale to <html>
  useEffect(() => {
    const scale = FONT_SCALES[fontScaleIndex];
    document.documentElement.style.fontSize = `${scale * 100}%`;
    return () => { document.documentElement.style.fontSize = ""; };
  }, [fontScaleIndex]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close font menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(e.target as Node)) {
        setShowFontMenu(false);
      }
    };
    if (showFontMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showFontMenu]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (!isHome && href.startsWith("#")) {
      window.location.href = "/" + href;
    }
  };

  const openDropdown = (id: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveDropdown(id);
  };

  const closeDropdown = () => {
    closeTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  return (
    <>
      {/* Top promo bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-primary/10 border-b border-border/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 px-4 py-2 text-center">
          <span className="text-xs sm:text-sm font-body text-muted-foreground">
            📄 Free Download:
          </span>
          <a
            href="https://substack.com/@tuliptechrnd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-body font-semibold text-gradient-chrome-animated hover:opacity-80 transition-opacity"
          >
            2026 Guide to GenAI for Game Content Developers, 3D Artists &amp; Creative Techs
          </a>
          <span className="text-xs font-body text-muted-foreground hidden sm:inline">→ Substack</span>
        </div>
      </div>

      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-[36px] left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-glass" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3 md:ml-[18%]">
            {/* Accessibility font-size toggle */}
            <div ref={fontMenuRef} className="relative">
              <button
                onClick={() => setShowFontMenu(!showFontMenu)}
                aria-label="Adjust text size"
                title="Adjust text size"
                className="flex items-center gap-0.5 px-2 h-9 rounded-full border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all text-muted-foreground hover:text-primary text-xs font-body font-semibold"
              >
                <span className="text-[10px]">a</span><span className="text-xs">A</span><span className="text-sm leading-none">A</span>
                <ArrowUp className="w-3 h-3 ml-0.5" />
              </button>
              <AnimatePresence>
                {showFontMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 bg-card border border-border rounded-xl shadow-xl p-2 min-w-[140px] z-50"
                  >
                    <p className="text-[10px] font-body text-muted-foreground uppercase tracking-widest px-2 pb-1.5">
                      Text Size
                    </p>
                    {FONT_SCALES.map((scale, i) => (
                      <button
                        key={scale}
                        onClick={() => { setFontScaleIndex(i); setShowFontMenu(false); }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-body transition-colors flex items-center justify-between ${
                          fontScaleIndex === i
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground hover:bg-muted/30"
                        }`}
                      >
                        <span>{FONT_LABELS[i]}</span>
                        {fontScaleIndex === i && <span className="text-[10px] text-primary">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/" className="font-display text-2xl font-bold tracking-tight text-foreground">
              TULIP<span className="text-gradient-gold"> TECH</span>
            </Link>
          </div>

          {/* Desktop — Tesla-style centered nav */}
          <div className="hidden md:flex items-center gap-10">
            {/* Use Cases with hover dropdown */}
            <div
              onMouseEnter={() => openDropdown("usecases")}
              onMouseLeave={closeDropdown}
              className="relative"
            >
              <button className="flex items-center gap-1.5 text-base font-body text-gradient-lavender hover:opacity-80 transition-opacity duration-300">
                Use Cases
                <ChevronDown
                  className={`w-4 h-4 text-[hsl(280_30%_75%)] transition-transform duration-200 ${
                    activeDropdown === "usecases" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <Link
              to="/library"
              className="text-base font-body text-gradient-lavender hover:opacity-80 transition-opacity duration-300"
            >
              Library R&D
            </Link>

            {navLinks.map((link) =>
              isHome ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-body text-gradient-lavender hover:opacity-80 transition-opacity duration-300"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={`/${link.href}`}
                  className="text-base font-body text-gradient-lavender hover:opacity-80 transition-opacity duration-300"
                >
                  {link.label}
                </Link>
              )
            )}

            <a
              href={isHome ? "#estimator" : "/#estimator"}
              className="text-base font-body font-semibold bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Get a Quote
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Tesla-style full-width dropdown panel */}
        <AnimatePresence>
          {activeDropdown === "usecases" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseEnter={() => openDropdown("usecases")}
              onMouseLeave={closeDropdown}
              className="absolute left-0 right-0 top-full bg-card/95 backdrop-blur-xl border-b border-border shadow-2xl"
            >
              <div className="max-w-6xl mx-auto py-8 px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {useCases.map((uc) => {
                    const Icon = uc.icon;
                    return (
                      <Link
                        key={uc.slug}
                        to={`/use-cases/${uc.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="group flex items-start gap-3 p-4 rounded-xl hover:bg-secondary transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors mt-0.5">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-body font-semibold text-foreground mb-0.5">
                            {uc.shortTitle}
                          </p>
                          <p className="text-xs font-body text-muted-foreground leading-snug">
                            {uc.tagline}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-glass overflow-hidden"
            >
              <div className="flex flex-col gap-2 px-6 py-6">
                {/* Mobile Use Cases */}
                <button
                  onClick={() => setMobileUseCasesOpen(!mobileUseCasesOpen)}
                  className="flex items-center justify-between text-foreground font-body text-lg py-1"
                >
                  Use Cases
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileUseCasesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileUseCasesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 pl-4 pb-2">
                        {useCases.map((uc) => (
                          <Link
                            key={uc.slug}
                            to={`/use-cases/${uc.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="text-muted-foreground font-body text-base py-1.5 hover:text-primary transition-colors"
                          >
                            {uc.shortTitle}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link
                  to="/library"
                  onClick={() => setMobileOpen(false)}
                  className="text-foreground font-body text-lg py-1"
                >
                  Library R&D
                </Link>

                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={isHome ? link.href : `/${link.href}`}
                    onClick={() => handleNavClick(link.href)}
                    className="text-foreground font-body text-lg py-1"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={isHome ? "#estimator" : "/#estimator"}
                  onClick={() => setMobileOpen(false)}
                  className="bg-primary text-primary-foreground px-5 py-3 rounded-full text-center font-semibold mt-2"
                >
                  Get a Quote
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Backdrop overlay */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
