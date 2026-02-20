const Footer = () => (
  <footer className="border-t border-border py-8 section-padding">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="font-display text-sm font-bold tracking-tight">
        TULIP<span className="text-gradient-gold"> TECH</span> R&D
      </div>
      <p className="text-xs text-muted-foreground font-body">
        © {new Date().getFullYear()} Tulip Technology B.V. All rights reserved. Private & Confidential.
      </p>
    </div>
  </footer>
);

export default Footer;
