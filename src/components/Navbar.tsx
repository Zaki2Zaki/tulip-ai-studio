import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCases } from "@/data/useCases";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Estimator", href: "#estimator" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [useCasesOpen, setUseCasesOpen] = useState(false);
  const [mobileUseCasesOpen, setMobileUseCasesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUseCasesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (!isHome && href.startsWith("#")) {
      window.location.href = "/" + href;
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-glass" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-foreground">
          TULIP<span className="text-gradient-gold"> TECH</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {/* Use Cases Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setUseCasesOpen(!useCasesOpen)}
              className="flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Use Cases
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  useCasesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {useCasesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[420px] bg-card border border-border rounded-2xl p-3 shadow-2xl"
                >
                  <div className="grid grid-cols-1 gap-1">
                    {useCases.map((uc) => {
                      const Icon = uc.icon;
                      return (
                        <Link
                          key={uc.slug}
                          to={`/use-cases/${uc.slug}`}
                          onClick={() => setUseCasesOpen(false)}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors"
                        >
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-body font-medium text-foreground">
                              {uc.shortTitle}
                            </p>
                            <p className="text-xs font-body text-muted-foreground leading-tight">
                              {uc.tagline}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.map((link) =>
            isHome ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={`/${link.href}`}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </Link>
            )
          )}
          <a
            href={isHome ? "#estimator" : "/#estimator"}
            className="text-sm font-body font-semibold bg-primary text-primary-foreground px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
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
  );
};

export default Navbar;
