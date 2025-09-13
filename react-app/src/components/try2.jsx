import { ResponsiveLine } from '@nivo/line'

const reports = [
  { report: "Report 1", ALT: 30, AST: 25, ALP: 100 },
  { report: "Report 2", ALT: 45, AST: 35, ALP: 120 },
  { report: "Report 3", ALT: 50, AST: 40, ALP: 110 }
];

// Convert reports to nivo format
const chartData = [
  {
    id: "ALT",
    data: reports.map(r => ({ x: r.report, y: r.ALT }))
  },
  {
    id: "AST",
    data: reports.map(r => ({ x: r.report, y: r.AST }))
  },
  {
    id: "ALP",
    data: reports.map(r => ({ x: r.report, y: r.ALP }))
  }
];

export function LiverReportsLineChart() {
  return (
    <div style={{ height: 400 }}>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
        axisBottom={{ legend: "Reports", legendOffset: 36, legendPosition: "middle" }}
        axisLeft={{ legend: "Values", legendOffset: -40, legendPosition: "middle" }}
        colors={{ scheme: "set2" }}
        pointSize={10}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: "circle"
          }
        ]}
      />
    </div>
  );
}
