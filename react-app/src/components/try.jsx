import { ResponsiveBar } from '@nivo/bar'

export function LiverReportsChart() {
  const reports = [
    { report: "Report 1", ALT: 30, AST: 25, ALP: 100 },
    { report: "Report 2", ALT: 45, AST: 35, ALP: 120 },
    { report: "Report 3", ALT: 50, AST: 40, ALP: 110 }
  ];

  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={reports}
        keys={["ALT", "AST", "ALP"]}   // yeh wo keys hain jo bar banayengi
        indexBy="report"              // x-axis per report names
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}   // color theme
        axisBottom={{ legend: "Reports", legendPosition: "middle", legendOffset: 40 }}
        axisLeft={{ legend: "Values", legendPosition: "middle", legendOffset: -50 }}
      />
    </div>
  );
}
