import { useLocation } from "react-router-dom";
import { AnalyzeReport } from "./analysisReport";

export function AnalyzeReportWrapper() {
  const location = useLocation();
  const report = location.state?.report || "";

  return <AnalyzeReport report={report} />;
}
