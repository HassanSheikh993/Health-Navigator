import { ResponsiveBar } from "@nivo/bar";
import "../../Styles/GenerateGraph.css";

export function GenerateGraphs({ selectedReports }) {
  const allKeys = new Set();

  selectedReports.forEach((r) => {
    Object.keys(r.keyValues).forEach((k) => allKeys.add(k));
  });

  const chartData = selectedReports.map((report, idx) => {
    const obj = { report: `Report ${idx + 1}` };
    allKeys.forEach((k) => {
      obj[k] = report.keyValues[k] || 0;
    });
    return obj;
  });

  return (
    <div className="chart-container">
      <ResponsiveBar
        data={chartData}
        keys={[...allKeys]} // ALT, AST, ALP etc.
        indexBy="report" // Report 1, Report 2, ...
        margin={{ top: 40, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "set2" }}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisBottom={{
          legend: "Reports",
          legendPosition: "middle",
          legendOffset: 36,
        }}
        axisLeft={{
          legend: "Values",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            itemsSpacing: 4,
            symbolSize: 12,
          },
        ]}
      />
    </div>
  );
}
