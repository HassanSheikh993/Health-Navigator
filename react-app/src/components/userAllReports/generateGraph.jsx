import { useState, useMemo, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, AreaChart, Area, ResponsiveContainer,
  ComposedChart, Scatter 
} from "recharts";
import "../../Styles/GenerateGraph.css";

export function GenerateGraphs({ selectedReports }) {
  const [chartType, setChartType] = useState("bar");
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const colors = {
    metrics: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
  };

  // Create a map of metric names to their colors
  const getMetricColor = (metricName) => {
    // Find the index of this metric in allMetrics
    const metricIndex = allMetrics.findIndex(m => m.name === metricName);
    if (metricIndex >= 0) {
      return colors.metrics[metricIndex % colors.metrics.length];
    }
    return colors.metrics[0]; // fallback
  };

  const { allMetrics, commonMetrics } = useMemo(() => {
    const metricCounts = {};

    selectedReports.forEach((report) => {
      const testArray = report.keyValues?.tests || [];
      testArray.forEach((kv) => {
        if (kv && kv.name) {
          if (!metricCounts[kv.name]) {
            metricCounts[kv.name] = {
              name: kv.name,
              unit: kv.unit || '',
              range: kv.range || '',
              count: 0
            };
          }
          metricCounts[kv.name].count++;
        }
      });
    });

    const allMetricsArray = Object.values(metricCounts);
    const commonMetricsArray = allMetricsArray.filter(metric => 
      metric.count === selectedReports.length
    ).map(metric => metric.name);

    return {
      allMetrics: allMetricsArray,
      commonMetrics: commonMetricsArray
    };
  }, [selectedReports]);

  // Use useEffect for initialization
  useEffect(() => {
    // Only initialize once when component mounts and we have common metrics
    if (!isInitialized && commonMetrics.length > 0 && selectedMetrics.length === 0) {
      setSelectedMetrics(commonMetrics);
      setIsInitialized(true);
    }
  }, [commonMetrics, selectedMetrics.length, isInitialized]);

  const chartData = useMemo(() => {
    return selectedReports.map((report, idx) => {
      const obj = { 
        name: `Report ${idx + 1}`,
        fullName: `Report ${idx + 1}`,
        date: new Date(report.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        timestamp: new Date(report.createdAt).getTime()
      };
      
      selectedMetrics.forEach((metricName) => {
        const testArray = report.keyValues?.tests || [];
        const keyValueObj = testArray.find(kv => kv.name === metricName);
        // Handle special cases like "<10"
        let value = null;
        if (keyValueObj && keyValueObj.value) {
          const numValue = parseFloat(keyValueObj.value);
          value = isNaN(numValue) ? 0 : numValue;
        }
        obj[metricName] = value;
      });
      
      return obj;
    });
  }, [selectedReports, selectedMetrics]);

  const toggleMetric = (metricName) => {
    setSelectedMetrics(prev => 
      prev.includes(metricName)
        ? prev.filter(m => m !== metricName)
        : [...prev, metricName]
    );
  };

  const selectAllMetrics = () => {
    setSelectedMetrics(allMetrics.map(m => m.name));
  };

  const clearAllMetrics = () => {
    setSelectedMetrics([]);
  };

  const selectCommonMetrics = () => {
    setSelectedMetrics([...commonMetrics]); // Create a new array
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="tooltip-header">
            <strong>{data.fullName}</strong>
            <div className="tooltip-date">{data.date}</div>
          </div>
          <div className="tooltip-content">
            {payload.map((entry, index) => (
              <div key={index} className="tooltip-item">
                <div className="tooltip-metric">
                  <span 
                    className="color-indicator" 
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  {entry.dataKey}:
                </div>
                <div className="tooltip-value">
                  <strong>{entry.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 80 },
    };

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={450}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={40}
                wrapperStyle={{ fontSize: '11px' }}
                iconSize={10}
              />
              {selectedMetrics.map((metric) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={getMetricColor(metric)}
                  strokeWidth={2.5}
                  dot={{ fill: getMetricColor(metric), strokeWidth: 1, r: 4 }}
                  activeDot={{ r: 6, stroke: getMetricColor(metric), strokeWidth: 2 }}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      // case "area":
      //   return (
      //     <ResponsiveContainer width="100%" height={450}>
      //       <AreaChart {...commonProps}>
      //         <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
      //         <XAxis 
      //           dataKey="name" 
      //           angle={-45}
      //           textAnchor="end"
      //           height={60}
      //           tick={{ fontSize: 11 }}
      //           interval={0}
      //         />
      //         <YAxis 
      //           tick={{ fontSize: 11 }}
      //           width={60}
      //         />
      //         <Tooltip content={<CustomTooltip />} />
      //         <Legend 
      //           verticalAlign="top" 
      //           height={40}
      //           wrapperStyle={{ fontSize: '11px' }}
      //           iconSize={10}
      //         />
      //         {selectedMetrics.map((metric) => (
      //           <Area
      //             key={metric}
      //             type="monotone"
      //             dataKey={metric}
      //             stroke={getMetricColor(metric)}
      //             fill={getMetricColor(metric)}
      //             fillOpacity={0.2}
      //             strokeWidth={2}
      //             connectNulls={true}
      //           />
      //         ))}
      //       </AreaChart>
      //     </ResponsiveContainer>
      //   );

      case "report-line":
        // NEW: Individual report line charts
        return (
          <div className="report-charts-container">
            {selectedReports.map((report, reportIndex) => {
              // Prepare data for this specific report
              const reportData = selectedMetrics.map(metricName => {
                const testArray = report.keyValues?.tests || [];
                const keyValueObj = testArray.find(kv => kv.name === metricName);
                
                // Handle special cases like "<10"
                let value = null;
                if (keyValueObj && keyValueObj.value) {
                  const numValue = parseFloat(keyValueObj.value);
                  value = isNaN(numValue) ? 0 : numValue;
                }
                
                return {
                  metric: metricName,
                  value: value,
                  unit: keyValueObj?.unit || '',
                  range: keyValueObj?.range || '',
                  reportName: `Report ${reportIndex + 1}`,
                  reportDate: new Date(report.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                };
              }).filter(item => item.value !== null); // Remove metrics without values

              if (reportData.length === 0) {
                return (
                  <div key={reportIndex} className="individual-report-chart">
                    <h3 className="report-chart-title">
                      {`Report ${reportIndex + 1}`}
                      <span className="report-chart-date">
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </h3>
                    <div className="no-data-in-report">
                      <p>No selected metrics found in this report.</p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={reportIndex} className="individual-report-chart">
                  <h3 className="report-chart-title">
                    {`Report ${reportIndex + 1}`}
                    <span className="report-chart-date">{reportData[0].reportDate}</span>
                  </h3>
                  <div className="chart-description">
                    <p>Line chart showing test values for individual metrics</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart
                      data={reportData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="#f5f5f5" 
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="metric" 
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 11 }}
                        interval={0}
                        label={{ 
                          value: 'Test Metrics', 
                          position: 'insideBottom', 
                          offset: -40,
                          style: { fontSize: 12, fontWeight: 'bold' }
                        }}
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }}
                        width={60}
                        label={{ 
                          value: 'Value', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { fontSize: 12, fontWeight: 'bold' }
                        }}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="custom-tooltip">
                                <div className="tooltip-header">
                                  <strong>{data.metric}</strong>
                                  <div className="tooltip-date">{data.reportName}</div>
                                </div>
                                <div className="tooltip-content">
                                  <div className="tooltip-item">
                                    <div className="tooltip-metric">Value:</div>
                                    <div className="tooltip-value">
                                      <strong>{data.value}</strong>
                                    </div>
                                  </div>
                                  {data.unit && (
                                    <div className="tooltip-item">
                                      <div className="tooltip-metric">Unit:</div>
                                      <div className="tooltip-value">{data.unit}</div>
                                    </div>
                                  )}
                                  {data.range && (
                                    <div className="tooltip-item">
                                      <div className="tooltip-metric">Reference Range:</div>
                                      <div className="tooltip-value">{data.range}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <defs>
                        <linearGradient id={`colorGradient${reportIndex}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={`url(#colorGradient${reportIndex})`}
                        strokeWidth={3}
                        dot={{ 
                          fill: `url(#colorGradient${reportIndex})`, 
                          strokeWidth: 2, 
                          r: 6,
                          stroke: '#fff'
                        }}
                        activeDot={{ 
                          r: 8, 
                          stroke: `url(#colorGradient${reportIndex})`, 
                          strokeWidth: 2,
                          fill: '#fff'
                        }}
                        connectNulls={true}
                        name="Test Value"
                      />
                      <Scatter
                        data={reportData}
                        fill="#8884d8"
                        shape="circle"
                        name="Data Points"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                  <div className="report-summary">
                    <div className="summary-item">
                      <span className="summary-label">Metrics Displayed:</span>
                      <span className="summary-value">{reportData.length}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Report Date:</span>
                      <span className="summary-value">{reportData[0].reportDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      default: // bar chart
        return (
          <ResponsiveContainer width="100%" height={450}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={40}
                wrapperStyle={{ fontSize: '11px' }}
                iconSize={10}
              />
              {selectedMetrics.map((metric) => (
                <Bar
                  key={metric}
                  dataKey={metric}
                  fill={getMetricColor(metric)}
                  fillOpacity={0.8}
                  radius={[3, 3, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  if (selectedReports.length === 0) {
    return (
      <div className="chart-container professional-chart">
        <div className="no-data">
          <h3>No Reports Selected</h3>
          <p>Please select reports to generate comparison graphs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container professional-chart">
      {/* Header */}
      <div className="chart-header">
        <div className="header-left">
          <h2>Medical Reports Comparison</h2>
          <p>Comparing {selectedReports.length} reports across {selectedMetrics.length} metrics</p>
          {commonMetrics.length > 0 && (
            <div className="common-metrics-info">
              <span className="info-badge">
                {commonMetrics.length} common metrics available in all reports
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart Type Selector - UPDATED with new button */}
      <div className="chart-controls">
        <div className="control-group">
          <label>Chart Type:</label>
          <div className="chart-type-selector">
            <button 
              className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
            >
              <span className="btn-icon">📊</span>
              Bar Chart
            </button>
            {/* <button 
              className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
            >
              <span className="btn-icon">📈</span>
              Line Chart
            </button> */}
            {/* <button 
              className={`chart-type-btn ${chartType === 'area' ? 'active' : ''}`}
              onClick={() => setChartType('area')}
            >
              <span className="btn-icon">🔽</span>
              Area Chart
            </button> */}
            {/* NEW: Report Line Chart Button */}
            <button 
              className={`chart-type-btn ${chartType === 'report-line' ? 'active' : ''}`}
              onClick={() => setChartType('report-line')}
            >
              <span className="btn-icon">📋</span>
              Report Line Chart
            </button>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="metric-selector">
        <div className="metric-header">
          <label>Select Metrics:</label>
          <div className="metric-actions">
            <button 
              className="action-btn small" 
              onClick={selectCommonMetrics}
              disabled={commonMetrics.length === 0}
            >
              Common Only
            </button>
            <button 
              className="action-btn small" 
              onClick={selectAllMetrics}
              disabled={allMetrics.length === 0}
            >
              Select All
            </button>
            <button 
              className="action-btn small" 
              onClick={clearAllMetrics}
              disabled={selectedMetrics.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>
        <div className="metric-grid">
          {allMetrics.map((metric, index) => {
            const isCommon = commonMetrics.includes(metric.name);
            const isSelected = selectedMetrics.includes(metric.name);
            const metricColor = colors.metrics[index % colors.metrics.length];
            
            return (
              <div
                key={metric.name}
                className={`metric-card ${isSelected ? 'active' : ''} ${isCommon ? 'common-metric' : ''}`}
                onClick={() => toggleMetric(metric.name)}
              >
                <div className="metric-color" style={{ backgroundColor: metricColor }}></div>
                <div className="metric-info">
                  <div className="metric-name">
                    {metric.name}
                    {isCommon && <span className="common-badge">Common</span>}
                  </div>
                  <div className="metric-details">
                    {metric.unit && <span className="metric-unit">{metric.unit}</span>}
                    {metric.range && <span className="metric-range">{metric.range}</span>}
                    <span className="metric-count">In {metric.count} reports</span>
                  </div>
                </div>
                <div className="metric-checkbox">
                  {isSelected && (
                    <div className="checkmark">✓</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="chart-wrapper">
        {selectedMetrics.length > 0 ? (
          renderChart()
        ) : (
          <div className="no-metrics">
            <h4>No Metrics Selected</h4>
            <p>Please select at least one metric to display the chart.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {selectedMetrics.length > 0 && chartType !== "report-line" && (
        <div className="chart-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Reports:</span>
              <span className="stat-value">{selectedReports.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Metrics:</span>
              <span className="stat-value">{selectedMetrics.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Common Metrics:</span>
              <span className="stat-value">{commonMetrics.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Chart Type:</span>
              <span className="stat-value">{chartType.charAt(0).toUpperCase() + chartType.slice(1)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}