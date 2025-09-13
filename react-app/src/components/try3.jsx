import { ResponsiveBar } from '@nivo/bar'

const reports = [
  { report: "Report 1", ALT: 30, AST: 25, ALP: 100 },
  { report: "Report 2", ALT: 45, AST: 35, ALP: 120 },
  { report: "Report 3", ALT: 50, AST: 40, ALP: 110 }
];

export function LiverReportsBarChart() {
  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={reports}
        keys={['ALT', 'AST', 'ALP']}
        indexBy="report"
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'set2' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{ legend: 'Reports', legendOffset: 36, legendPosition: 'middle' }}
        axisLeft={{ legend: 'Values', legendOffset: -40, legendPosition: 'middle' }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12
          }
        ]}
      />
    </div>
  )
}
