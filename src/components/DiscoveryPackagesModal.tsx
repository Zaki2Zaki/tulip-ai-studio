import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface DiscoveryPackagesModalProps {
  open: boolean;
  onClose: () => void;
}

const packages = [
  {
    fit: "Indie/mid studios testing waters",
    price: "$15k–$25k (~$20k sweet spot)",
    cad: "C$20,400–$34,000 (~C$27,200)",
    duration: "2–3 weeks",
    areas: "4–6 prioritized",
    tools: "5–8 total + top 3–4 shortlist",
    deliverables: [
      "15–25 page report",
      "Pain-point heatmap + basic gap summary",
      "Simple tool matrix (fit/ROI basics)",
      "2-4 weeks quick-win roadmap",
    ],
  },
  {
    fit: "Mid-large studios ready for next steps (benchmarking/blueprint)",
    price: "$30k–$45k",
    cad: "C$40,800–$61,200",
    duration: "3–5 weeks",
    areas: "6–9",
    tools: "8–12 total + top 5 shortlist",
    deliverables: [
      "35–55 page strategic report",
      "Detailed pain/gap analysis per department",
      "Scored tool matrix + licensing/dependency notes",
      "Quantified ROI projections + risks",
      "Phased adoption plan",
    ],
  },
  {
    fit: "AAA/VFX houses wanting comprehensive transformation input",
    price: "$50k–$75k (~$60k)",
    cad: "C$68,000–$102,000 (~C$81,600)",
    duration: "4–8 weeks",
    areas: "8–12+ (full pipeline + adjacents)",
    tools: "12–15+ total + deep dive on top 6–8",
    deliverables: [
      "60–90+ page executive-grade report",
      "Cross-dept immersion findings",
      "Custom scoring framework + competitive landscape",
      "Advanced ROI model (e.g., time/cost savings scenarios)",
      "½–1 day findings workshop/presentation",
    ],
  },
];

const DiscoveryPackagesModal = ({ open, onClose }: DiscoveryPackagesModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-gradient-gold">
            GenAI Workflow Discovery Packages
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-body">
            Compare our discovery packages to find the right fit for your studio.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="min-w-[140px] text-primary font-display">Best Client Fit</TableHead>
                <TableHead className="min-w-[130px] text-primary font-display">Price (USD)</TableHead>
                <TableHead className="min-w-[140px] text-primary font-display">CAD Equivalent</TableHead>
                <TableHead className="min-w-[80px] text-primary font-display">Duration</TableHead>
                <TableHead className="min-w-[100px] text-primary font-display"># Areas Suggested</TableHead>
                <TableHead className="min-w-[120px] text-primary font-display"># Tools Recommended</TableHead>
                <TableHead className="min-w-[250px] text-primary font-display">Key Deliverables</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell className="font-body text-sm font-semibold">{pkg.fit}</TableCell>
                  <TableCell className="font-body text-sm">{pkg.price}</TableCell>
                  <TableCell className="font-body text-sm">{pkg.cad}</TableCell>
                  <TableCell className="font-body text-sm">{pkg.duration}</TableCell>
                  <TableCell className="font-body text-sm">{pkg.areas}</TableCell>
                  <TableCell className="font-body text-sm">{pkg.tools}</TableCell>
                  <TableCell className="font-body text-sm">
                    <ul className="list-disc list-inside space-y-1">
                      {pkg.deliverables.map((d, j) => (
                        <li key={j}>{d}</li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-foreground font-body italic">
          All prices shown are indicative ranges based on typical project scopes and are provided for initial planning purposes only. Final pricing will be confirmed via a tailored quote following detailed scoping discussions, stakeholder inputs, and alignment with your specific workflows, OKRs, and requirements. Prices are in USD (CAD equivalents approximate based on current mid-market rates and subject to final confirmation). It may not represent this table.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default DiscoveryPackagesModal;
