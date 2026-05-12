import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PipelineDiagnosisFlow from "@/components/BranchB/PipelineDiagnosisPage";

export default function PipelineDiagnosisPage() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <PipelineDiagnosisFlow onBack={() => navigate("/strategic-briefing")} />
      </div>
    </main>
  );
}
