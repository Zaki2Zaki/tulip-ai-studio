import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogIn, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCases } from "@/data/useCases";
import { supabase } from "@/integrations/supabase/client";
import TextScaleControl from "./TextScaleControl";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Estimator", href: "#estimator" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileUseCasesOpen, setMobileUseCasesOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      {/* Top promo bar — slim, Apple-style */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-card/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 px-4 py-1.5 text-center">
          <span className="text-[11px] font-body text-muted-foreground">📄</span>
          <a
            href="https://substack.com/@tuliptechrnd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-body font-medium text-gradient-chrome-animated hover:opacity-80 transition-opacity"
          >
            2026 Guide to GenAI for Game Content Developers, 3D Artists & Creative Techs
          </a>
          <span className="text-[11px] font-body text-muted-foreground hidden sm:inline">→</span>
        </div>
      </div>

      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-[32px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-glass" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-12">
          {/* Logo — left aligned */}
          <Link to="/" className="font-display text-lg font-bold tracking-tight text-foreground shrink-0 ml-[192px]">
            TULIP<span className="text-gradient-gold"> TECH</span>
          </Link>

          {/* Desktop nav — right aligned, Apple-style minimal */}
          <div className="hidden md:flex items-center gap-8">
            <TextScaleControl />

            <div
              onMouseEnter={() => openDropdown("usecases")}
              onMouseLeave={closeDropdown}
              className="relative"
            >
              <Link
                to="/case-studies"
                className="flex items-center gap-1 text-[13px] font-body font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Case Studies
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === "usecases" ? "rotate-180" : ""}`} />
              </Link>
            </div>

            <Link
              to="/library"
              className="text-[13px] font-body font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              R&D Library
            </Link>

            {navLinks.map((link) =>
              isHome ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-body font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={`/${link.href}`}
                  className="text-[13px] font-body font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}

            <a
              href={isHome ? "#estimator" : "/#estimator"}
              className="text-[13px] font-body font-semibold bg-primary text-primary-foreground px-5 py-2 rounded-full hover:opacity-90 transition-all min-h-[36px] flex items-center"
            >
              Get a Quote
            </a>

            {user ? (
              <button
                onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
                className="flex items-center gap-1.5 text-[12px] font-body text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] justify-center"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 text-[12px] font-body text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] justify-center"
              >
                <LogIn className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Mobile toggle — 44×44 touch target */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Case Studies dropdown panel */}
        <AnimatePresence>
          {activeDropdown === "usecases" && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={() => openDropdown("usecases")}
              onMouseLeave={closeDropdown}
              className="absolute left-0 right-0 top-full bg-card/95 backdrop-blur-2xl border-b border-border/30 shadow-xl"
            >
              <div className="max-w-5xl mx-auto py-8 px-6 lg:px-8">
                <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-body mb-4 font-medium">Case Studies</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
                  {[
                    { label: "Pre-Production", to: "/case-studies/pre-production", desc: "AI storyboard automation & previz" },
                    { label: "Production Pipeline", to: "/case-studies/production", desc: "Unity tools for zero-G visuals" },
                    { label: "Post-Production", to: "/case-studies/post-production", desc: "AI render polish & compositing" },
                    { label: "Steam Game Delays", to: "/case-studies/steam-delays", desc: "48% of 23k titles delayed" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setActiveDropdown(null)}
                      className="iridescent-hover group p-4 rounded-xl transition-colors min-h-[44px]"
                    >
                      <p className="text-sm font-body font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">{item.label}</p>
                      <p className="text-xs font-body text-muted-foreground leading-snug">{item.desc}</p>
                    </Link>
                  ))}
                </div>

                <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-body mb-4 font-medium">Use Cases</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {useCases.map((uc) => {
                    const Icon = uc.icon;
                    return (
                      <Link
                        key={uc.slug}
                        to={`/use-cases/${uc.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="iridescent-hover group flex items-start gap-3 p-4 rounded-xl transition-colors min-h-[44px]"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors mt-0.5">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-body font-semibold text-foreground mb-0.5">{uc.shortTitle}</p>
                          <p className="text-xs font-body text-muted-foreground leading-snug">{uc.tagline}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu — Apple-style full-bleed */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-glass overflow-hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-6">
                <button
                  onClick={() => setMobileUseCasesOpen(!mobileUseCasesOpen)}
                  className="flex items-center justify-between text-foreground font-body text-base py-3 min-h-[44px]"
                >
                  Case Studies
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileUseCasesOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileUseCasesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-0.5 pl-4 pb-2">
                        <Link to="/case-studies" onClick={() => setMobileOpen(false)} className="text-muted-foreground font-body text-sm py-3 hover:text-primary transition-colors font-semibold min-h-[44px] flex items-center">All Case Studies</Link>
                        {[
                          { label: "Pre-Production", to: "/case-studies/pre-production" },
                          { label: "Production", to: "/case-studies/production" },
                          { label: "Post-Production", to: "/case-studies/post-production" },
                          { label: "Steam Game Delays", to: "/case-studies/steam-delays" },
                        ].map((item) => (
                          <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="text-muted-foreground font-body text-sm py-3 hover:text-primary transition-colors min-h-[44px] flex items-center">{item.label}</Link>
                        ))}
                        <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/60 font-body mt-2 mb-1">Use Cases</p>
                        {useCases.map((uc) => (
                          <Link key={uc.slug} to={`/use-cases/${uc.slug}`} onClick={() => setMobileOpen(false)} className="text-muted-foreground font-body text-sm py-3 hover:text-primary transition-colors min-h-[44px] flex items-center">{uc.shortTitle}</Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link to="/library" onClick={() => setMobileOpen(false)} className="text-foreground font-body text-base py-3 min-h-[44px] flex items-center">R&D Library</Link>

                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={isHome ? link.href : `/${link.href}`}
                    onClick={() => handleNavClick(link.href)}
                    className="text-foreground font-body text-base py-3 min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={isHome ? "#estimator" : "/#estimator"}
                  onClick={() => setMobileOpen(false)}
                  className="bg-primary text-primary-foreground px-5 py-3 rounded-full text-center font-semibold mt-3 text-sm min-h-[44px] flex items-center justify-center"
                >
                  Get a Quote
                </a>
                {user ? (
                  <button
                    onClick={async () => { await supabase.auth.signOut(); setMobileOpen(false); navigate("/"); }}
                    className="flex items-center justify-center gap-2 text-muted-foreground font-body text-sm py-3 hover:text-primary transition-colors min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 text-muted-foreground font-body text-sm py-3 hover:text-primary transition-colors min-h-[44px]"
                  >
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                )}
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
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
