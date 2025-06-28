import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./Chart.module.scss";

const Chart = ({
    type = "line",
    data = [],
    height = 300,
    title,
    subtitle,
    xAxisLabel,
    yAxisLabel,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"],
    className,
    ...props
}) => {
    const chartRef = useRef(null);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [chartDimensions, setChartDimensions] = useState({
        width: 800,
        height: 300,
    });

    // Calculate chart dimensions
    useEffect(() => {
        const updateDimensions = () => {
            if (chartRef.current) {
                const rect = chartRef.current.getBoundingClientRect();
                setChartDimensions({
                    width: rect.width || 800,
                    height: height,
                });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [height]);

    // Chart configuration
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const chartWidth = chartDimensions.width - margin.left - margin.right;
    const chartHeight = chartDimensions.height - margin.top - margin.bottom;

    // Process data based on chart type
    const processedData = Array.isArray(data) ? data : [];

    // Calculate scales
    const getYScale = () => {
        if (processedData.length === 0) return { min: 0, max: 100 };

        if (type === "pie") return null;

        const values = processedData.map((d) => d.y || d.value || 0);
        const min = Math.min(0, Math.min(...values));
        const max = Math.max(...values);
        const padding = (max - min) * 0.1;

        return {
            min: min - padding,
            max: max + padding,
            step: chartHeight / 5,
        };
    };

    const yScale = getYScale();

    // Helper functions
    const getXPosition = (index) => {
        if (type === "pie") return 0;
        return (index / (processedData.length - 1 || 1)) * chartWidth;
    };

    const getYPosition = (value) => {
        if (type === "pie" || !yScale) return 0;
        const normalized = (value - yScale.min) / (yScale.max - yScale.min);
        return chartHeight - normalized * chartHeight;
    };

    // Generate grid lines
    const generateGridLines = () => {
        if (!showGrid || type === "pie") return null;

        const horizontalLines = [];
        const verticalLines = [];

        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = (i / 5) * chartHeight;
            horizontalLines.push(
                <line
                    key={`h-${i}`}
                    x1={0}
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="#E5E7EB"
                    strokeWidth={1}
                    opacity={0.5}
                />
            );
        }

        // Vertical grid lines
        for (let i = 0; i < processedData.length; i++) {
            const x = getXPosition(i);
            verticalLines.push(
                <line
                    key={`v-${i}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={chartHeight}
                    stroke="#E5E7EB"
                    strokeWidth={1}
                    opacity={0.3}
                />
            );
        }

        return [...horizontalLines, ...verticalLines];
    };

    // Generate axis labels
    const generateAxisLabels = () => {
        if (type === "pie") return null;

        const xLabels = [];
        const yLabels = [];

        // X-axis labels
        processedData.forEach((point, index) => {
            const x = getXPosition(index);
            const label = point.label || point.x || index;

            xLabels.push(
                <text
                    key={`x-label-${index}`}
                    x={x}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6B7280"
                    className={styles.axisLabel}
                >
                    {label}
                </text>
            );
        });

        // Y-axis labels
        if (yScale) {
            for (let i = 0; i <= 5; i++) {
                const value = yScale.min + ((yScale.max - yScale.min) * i) / 5;
                const y = chartHeight - (i / 5) * chartHeight;

                yLabels.push(
                    <text
                        key={`y-label-${i}`}
                        x={-10}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="12"
                        fill="#6B7280"
                        className={styles.axisLabel}
                    >
                        {Math.round(value)}
                    </text>
                );
            }
        }

        return [...xLabels, ...yLabels];
    };

    // Line chart path
    const generateLinePath = () => {
        if (type !== "line" && type !== "area") return "";

        return processedData
            .map((point, index) => {
                const x = getXPosition(index, point.x);
                const y = getYPosition(point.y || point.value || 0);
                return `${index === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");
    };

    // Area chart path
    const generateAreaPath = () => {
        if (type !== "area") return "";

        const linePath = generateLinePath();
        const firstPoint = processedData[0];
        const lastPoint = processedData[processedData.length - 1];

        if (!firstPoint || !lastPoint) return "";

        const firstX = getXPosition(0);
        const lastX = getXPosition(processedData.length - 1);

        return `${linePath} L ${lastX} ${chartHeight} L ${firstX} ${chartHeight} Z`;
    };

    // Bar chart rectangles
    const generateBars = () => {
        if (type !== "bar") return null;

        const barWidth = (chartWidth / processedData.length) * 0.8;

        return processedData.map((point, index) => {
            const x = getXPosition(index) - barWidth / 2;
            const y = getYPosition(point.y || point.value || 0);
            const height = chartHeight - y;
            const color = colors[index % colors.length];

            return (
                <rect
                    key={`bar-${index}`}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={height}
                    fill={color}
                    className={styles.bar}
                    onMouseEnter={() => setHoveredPoint({ ...point, index })}
                    onMouseLeave={() => setHoveredPoint(null)}
                />
            );
        });
    };

    // Pie chart segments
    const generatePieSegments = () => {
        if (type !== "pie") return null;

        const total = processedData.reduce(
            (sum, point) => sum + (point.value || 0),
            0
        );
        const centerX = chartWidth / 2;
        const centerY = chartHeight / 2;
        const radius = Math.min(chartWidth, chartHeight) / 2 - 20;

        let currentAngle = 0;

        return processedData.map((point, index) => {
            const value = point.value || 0;
            const percentage = value / total;
            const angle = percentage * 2 * Math.PI;

            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            const largeArcFlag = angle > Math.PI ? 1 : 0;

            const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                "Z",
            ].join(" ");

            currentAngle += angle;

            const color = colors[index % colors.length];

            return (
                <path
                    key={`pie-${index}`}
                    d={pathData}
                    fill={color}
                    className={styles.pieSegment}
                    onMouseEnter={() =>
                        setHoveredPoint({ ...point, index, percentage })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                />
            );
        });
    };

    // Data points for line/area charts
    const generateDataPoints = () => {
        if (type !== "line" && type !== "area") return null;

        return processedData.map((point, index) => {
            const x = getXPosition(index);
            const y = getYPosition(point.y || point.value || 0);
            const color = colors[0];

            return (
                <circle
                    key={`point-${index}`}
                    cx={x}
                    cy={y}
                    r={4}
                    fill={color}
                    className={styles.dataPoint}
                    onMouseEnter={() => setHoveredPoint({ ...point, index })}
                    onMouseLeave={() => setHoveredPoint(null)}
                />
            );
        });
    };

    // Tooltip
    const renderTooltip = () => {
        if (!showTooltip || !hoveredPoint) return null;

        return (
            <div className={styles.tooltip}>
                <div className={styles.tooltipContent}>
                    {hoveredPoint.label && (
                        <div className={styles.tooltipLabel}>
                            {hoveredPoint.label}
                        </div>
                    )}
                    <div className={styles.tooltipValue}>
                        {type === "pie"
                            ? `${(hoveredPoint.percentage * 100).toFixed(1)}%`
                            : hoveredPoint.y || hoveredPoint.value || 0}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className={`${styles.chartContainer} ${className || ""}`}
            {...props}
        >
            {title && (
                <div className={styles.chartHeader}>
                    <h3 className={styles.chartTitle}>{title}</h3>
                    {subtitle && (
                        <p className={styles.chartSubtitle}>{subtitle}</p>
                    )}
                </div>
            )}

            <div
                className={styles.chartWrapper}
                ref={chartRef}
                style={{ height }}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
                    className={styles.chart}
                >
                    <g transform={`translate(${margin.left}, ${margin.top})`}>
                        {/* Grid lines */}
                        {generateGridLines()}

                        {/* Chart content */}
                        {type === "area" && (
                            <path
                                d={generateAreaPath()}
                                fill={colors[0]}
                                fillOpacity={0.3}
                                className={styles.area}
                            />
                        )}

                        {(type === "line" || type === "area") && (
                            <path
                                d={generateLinePath()}
                                fill="none"
                                stroke={colors[0]}
                                strokeWidth={2}
                                className={styles.line}
                            />
                        )}

                        {generateBars()}
                        {generatePieSegments()}
                        {generateDataPoints()}

                        {/* Axis labels */}
                        {generateAxisLabels()}
                    </g>

                    {/* Axis titles */}
                    {xAxisLabel && type !== "pie" && (
                        <text
                            x={chartDimensions.width / 2}
                            y={chartDimensions.height - 10}
                            textAnchor="middle"
                            fontSize="14"
                            fill="#374151"
                            className={styles.axisTitle}
                        >
                            {xAxisLabel}
                        </text>
                    )}

                    {yAxisLabel && type !== "pie" && (
                        <text
                            x={15}
                            y={chartDimensions.height / 2}
                            textAnchor="middle"
                            fontSize="14"
                            fill="#374151"
                            transform={`rotate(-90, 15, ${
                                chartDimensions.height / 2
                            })`}
                            className={styles.axisTitle}
                        >
                            {yAxisLabel}
                        </text>
                    )}
                </svg>

                {renderTooltip()}
            </div>

            {/* Legend */}
            {showLegend && type === "pie" && (
                <div className={styles.legend}>
                    {processedData.map((point, index) => (
                        <div
                            key={`legend-${index}`}
                            className={styles.legendItem}
                        >
                            <div
                                className={styles.legendColor}
                                style={{
                                    backgroundColor:
                                        colors[index % colors.length],
                                }}
                            />
                            <span className={styles.legendLabel}>
                                {point.label || `Series ${index + 1}`}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

Chart.propTypes = {
    type: PropTypes.oneOf(["line", "bar", "pie", "area"]),
    data: PropTypes.arrayOf(
        PropTypes.shape({
            x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            y: PropTypes.number,
            value: PropTypes.number,
            label: PropTypes.string,
        })
    ),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.number,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    xAxisLabel: PropTypes.string,
    yAxisLabel: PropTypes.string,
    showGrid: PropTypes.bool,
    showTooltip: PropTypes.bool,
    showLegend: PropTypes.bool,
    colors: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
};

export default Chart;
