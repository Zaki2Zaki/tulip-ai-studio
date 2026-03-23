const Footer = () => (
  <footer className="border-t border-border/40 py-6 section-padding">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="font-display text-sm font-bold tracking-tight">
        TULIP<span className="text-gradient-gold"> TECH</span> R&D
      </div>
      <p className="text-[11px] text-white font-body">
        © {new Date().getFullYear()} Tulip Technology B.V. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
