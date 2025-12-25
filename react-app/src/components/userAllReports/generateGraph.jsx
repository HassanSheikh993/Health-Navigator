import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area, ResponsiveContainer } from "recharts";
import "../../Styles/GenerateGraph.css";

export function GenerateGraphs({ selectedReports }) {
  const [chartType, setChartType] = useState("bar");
  const [selectedMetrics, setSelectedMetrics] = useState([]);

 
  const { allMetrics, commonMetrics } = useMemo(() => {
    const metrics = [];
    const metricCounts = {};

  
    selectedReports.forEach((report) => {
      if (report.keyValues && Array.isArray(report.keyValues)) {
        report.keyValues.forEach((kv) => {
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
      }
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

  useState(() => {
    if (selectedMetrics.length === 0 && commonMetrics.length > 0) {
      setSelectedMetrics(commonMetrics);
    }
  });

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
        if (report.keyValues && Array.isArray(report.keyValues)) {
          const keyValueObj = report.keyValues.find(kv => kv.name === metricName);
          const value = keyValueObj ? parseFloat(keyValueObj.value) || 0 : null;
          obj[metricName] = value;
        } else {
          obj[metricName] = null;
        }
      });
      
      return obj;
    });
  }, [selectedReports, selectedMetrics]);

  const colors = {
    metrics: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
  };

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
    setSelectedMetrics(commonMetrics);
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
              {selectedMetrics.map((metric, index) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={colors.metrics[index % colors.metrics.length]}
                  strokeWidth={2.5}
                  dot={{ fill: colors.metrics[index % colors.metrics.length], strokeWidth: 1, r: 4 }}
                  activeDot={{ r: 6, stroke: colors.metrics[index % colors.metrics.length], strokeWidth: 2 }}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={450}>
            <AreaChart {...commonProps}>
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
              {selectedMetrics.map((metric, index) => (
                <Area
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={colors.metrics[index % colors.metrics.length]}
                  fill={colors.metrics[index % colors.metrics.length]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  connectNulls={true}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
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
              {selectedMetrics.map((metric, index) => (
                <Bar
                  key={metric}
                  dataKey={metric}
                  fill={colors.metrics[index % colors.metrics.length]}
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

      {/* Chart Type Selector */}
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
            <button 
              className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
            >
              <span className="btn-icon">📈</span>
              Line Chart
            </button>
            <button 
              className={`chart-type-btn ${chartType === 'area' ? 'active' : ''}`}
              onClick={() => setChartType('area')}
            >
              <span className="btn-icon">🔽</span>
              Area Chart
            </button>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="metric-selector">
        <div className="metric-header">
          <label>Select Metrics:</label>
          <div className="metric-actions">
            <button className="action-btn small" onClick={selectCommonMetrics}>
              Common Only
            </button>
            <button className="action-btn small" onClick={selectAllMetrics}>
              Select All
            </button>
            <button className="action-btn small" onClick={clearAllMetrics}>
              Clear All
            </button>
          </div>
        </div>
        <div className="metric-grid">
          {allMetrics.map((metric, index) => {
            const isCommon = commonMetrics.includes(metric.name);
            const isSelected = selectedMetrics.includes(metric.name);
            
            return (
              <div
                key={metric.name}
                className={`metric-card ${isSelected ? 'active' : ''} ${isCommon ? 'common-metric' : ''}`}
                onClick={() => toggleMetric(metric.name)}
              >
                <div className="metric-color" style={{ backgroundColor: colors.metrics[index % colors.metrics.length] }}></div>
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
      {selectedMetrics.length > 0 && (
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