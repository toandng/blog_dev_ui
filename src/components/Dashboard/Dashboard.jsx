import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MetricCard from "../MetricCard/MetricCard";
import Chart from "../Chart/Chart";
import styles from "./Dashboard.module.scss";

const Dashboard = ({
    title = "Dashboard",
    subtitle,
    timeRange = "30d",
    refreshInterval = 300000, // 5 minutes
    onTimeRangeChange,
    onRefresh,
    className,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [metrics, setMetrics] = useState(null);
    const [chartData, setChartData] = useState({});

    // Mock data for dashboard metrics
    const mockMetrics = {
        totalUsers: {
            current: 12847,
            previous: 11923,
            target: 15000,
        },
        totalPosts: {
            current: 3421,
            previous: 3187,
            target: 4000,
        },
        engagement: {
            current: 68.5,
            previous: 63.2,
        },
        revenue: {
            current: 45200,
            previous: 42100,
            target: 50000,
        },
        activeUsers: {
            current: 8934,
            previous: 8123,
        },
        conversionRate: {
            current: 3.4,
            previous: 3.1,
            target: 4.0,
        },
    };

    // Mock chart data
    const mockChartData = {
        userGrowth: [
            { label: "Week 1", value: 8500 },
            { label: "Week 2", value: 9200 },
            { label: "Week 3", value: 10100 },
            { label: "Week 4", value: 11400 },
            { label: "Week 5", value: 12847 },
        ],
        engagement: [
            { label: "Mon", value: 65 },
            { label: "Tue", value: 70 },
            { label: "Wed", value: 68 },
            { label: "Thu", value: 72 },
            { label: "Fri", value: 75 },
            { label: "Sat", value: 62 },
            { label: "Sun", value: 59 },
        ],
        revenue: [
            { label: "Q1", value: 35000 },
            { label: "Q2", value: 42000 },
            { label: "Q3", value: 38000 },
            { label: "Q4", value: 45200 },
        ],
        contentTypes: [
            { label: "Articles", value: 45 },
            { label: "Videos", value: 30 },
            { label: "Images", value: 20 },
            { label: "Other", value: 5 },
        ],
    };

    // Simulate data loading
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setMetrics(mockMetrics);
            setChartData(mockChartData);
            setLastUpdated(new Date());
            setIsLoading(false);
        };

        loadData();
    }, [timeRange]);

    // Auto-refresh data
    useEffect(() => {
        if (!refreshInterval) return;

        const interval = setInterval(() => {
            if (onRefresh) {
                onRefresh();
            } else {
                // Simulate slight data changes
                setMetrics((prev) => ({
                    ...prev,
                    activeUsers: {
                        ...prev.activeUsers,
                        current:
                            prev.activeUsers.current +
                            Math.floor(Math.random() * 20 - 10),
                    },
                }));
                setLastUpdated(new Date());
            }
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval, onRefresh]);

    // Time range options
    const timeRangeOptions = [
        { value: "7d", label: "Last 7 days" },
        { value: "30d", label: "Last 30 days" },
        { value: "90d", label: "Last 3 months" },
        { value: "1y", label: "Last year" },
    ];

    const handleTimeRangeChange = (newRange) => {
        if (onTimeRangeChange) {
            onTimeRangeChange(newRange);
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        if (onRefresh) {
            onRefresh();
        } else {
            // Simulate refresh
            setTimeout(() => {
                setLastUpdated(new Date());
                setIsLoading(false);
            }, 1000);
        }
    };

    const formatLastUpdated = () => {
        const now = new Date();
        const diff = now - lastUpdated;
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return "Just now";
        if (minutes === 1) return "1 minute ago";
        return `${minutes} minutes ago`;
    };

    return (
        <div className={`${styles.dashboard} ${className || ""}`} {...props}>
            {/* Dashboard header */}
            <div className={styles.dashboardHeader}>
                <div className={styles.titleSection}>
                    <h1 className={styles.dashboardTitle}>{title}</h1>
                    {subtitle && (
                        <p className={styles.dashboardSubtitle}>{subtitle}</p>
                    )}
                    <div className={styles.lastUpdated}>
                        Last updated: {formatLastUpdated()}
                    </div>
                </div>

                <div className={styles.controls}>
                    {/* Time range selector */}
                    <div className={styles.timeRangeSelector}>
                        <label
                            htmlFor="timeRange"
                            className={styles.selectorLabel}
                        >
                            Time Range:
                        </label>
                        <select
                            id="timeRange"
                            value={timeRange}
                            onChange={(e) =>
                                handleTimeRangeChange(e.target.value)
                            }
                            className={styles.selector}
                        >
                            {timeRangeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Refresh button */}
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className={styles.refreshButton}
                        title="Refresh data"
                    >
                        <span
                            className={`${styles.refreshIcon} ${
                                isLoading ? styles.spinning : ""
                            }`}
                        >
                            🔄
                        </span>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Metrics grid */}
            <div className={styles.metricsGrid}>
                <MetricCard
                    title="Total Users"
                    subtitle="Registered users"
                    value={metrics?.totalUsers.current}
                    previousValue={metrics?.totalUsers.previous}
                    target={metrics?.totalUsers.target}
                    format="number"
                    icon="👥"
                    color="primary"
                    isLoading={isLoading}
                />

                <MetricCard
                    title="Total Posts"
                    subtitle="Published content"
                    value={metrics?.totalPosts.current}
                    previousValue={metrics?.totalPosts.previous}
                    target={metrics?.totalPosts.target}
                    format="number"
                    icon="📝"
                    color="success"
                    isLoading={isLoading}
                />

                <MetricCard
                    title="Engagement Rate"
                    subtitle="User interaction"
                    value={metrics?.engagement.current}
                    previousValue={metrics?.engagement.previous}
                    format="percentage"
                    icon="❤️"
                    color="warning"
                    isLoading={isLoading}
                />

                <MetricCard
                    title="Revenue"
                    subtitle="Monthly earnings"
                    value={metrics?.revenue.current}
                    previousValue={metrics?.revenue.previous}
                    target={metrics?.revenue.target}
                    format="currency"
                    icon="💰"
                    color="success"
                    isLoading={isLoading}
                />

                <MetricCard
                    title="Active Users"
                    subtitle="Last 24 hours"
                    value={metrics?.activeUsers.current}
                    previousValue={metrics?.activeUsers.previous}
                    format="number"
                    icon="🟢"
                    color="info"
                    isLoading={isLoading}
                />

                <MetricCard
                    title="Conversion Rate"
                    subtitle="Visitor to user"
                    value={metrics?.conversionRate.current}
                    previousValue={metrics?.conversionRate.previous}
                    target={metrics?.conversionRate.target}
                    format="percentage"
                    icon="🎯"
                    color="primary"
                    isLoading={isLoading}
                />
            </div>

            {/* Charts section */}
            <div className={styles.chartsSection}>
                <div className={styles.chartRow}>
                    <div className={styles.chartContainer}>
                        <Chart
                            type="area"
                            data={chartData.userGrowth || []}
                            title="User Growth"
                            subtitle="Weekly new registrations"
                            height={300}
                            yAxisLabel="Users"
                            xAxisLabel="Time Period"
                            colors={["#3B82F6"]}
                        />
                    </div>

                    <div className={styles.chartContainer}>
                        <Chart
                            type="bar"
                            data={chartData.engagement || []}
                            title="Daily Engagement"
                            subtitle="Engagement rate by day"
                            height={300}
                            yAxisLabel="Engagement (%)"
                            xAxisLabel="Day of Week"
                            colors={["#10B981"]}
                        />
                    </div>
                </div>

                <div className={styles.chartRow}>
                    <div className={styles.chartContainer}>
                        <Chart
                            type="line"
                            data={chartData.revenue || []}
                            title="Quarterly Revenue"
                            subtitle="Revenue trends over time"
                            height={300}
                            yAxisLabel="Revenue ($)"
                            xAxisLabel="Quarter"
                            colors={["#F59E0B"]}
                        />
                    </div>

                    <div className={styles.chartContainer}>
                        <Chart
                            type="pie"
                            data={chartData.contentTypes || []}
                            title="Content Distribution"
                            subtitle="Content types breakdown"
                            height={300}
                            showLegend={true}
                            colors={[
                                "#3B82F6",
                                "#10B981",
                                "#F59E0B",
                                "#EF4444",
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Quick insights */}
            <div className={styles.insightsSection}>
                <h2 className={styles.sectionTitle}>Quick Insights</h2>
                <div className={styles.insightsList}>
                    <div className={styles.insight}>
                        <span className={styles.insightIcon}>📈</span>
                        <div className={styles.insightContent}>
                            <h4>User Growth</h4>
                            <p>
                                You gained{" "}
                                {(
                                    metrics?.totalUsers.current -
                                        metrics?.totalUsers.previous || 0
                                ).toLocaleString()}{" "}
                                new users this month, a{" "}
                                {(
                                    ((metrics?.totalUsers.current -
                                        metrics?.totalUsers.previous) /
                                        metrics?.totalUsers.previous) *
                                        100 || 0
                                ).toFixed(1)}
                                % increase.
                            </p>
                        </div>
                    </div>

                    <div className={styles.insight}>
                        <span className={styles.insightIcon}>🎯</span>
                        <div className={styles.insightContent}>
                            <h4>Engagement Improvement</h4>
                            <p>
                                Engagement rate increased by{" "}
                                {(
                                    metrics?.engagement.current -
                                        metrics?.engagement.previous || 0
                                ).toFixed(1)}{" "}
                                percentage points this period.
                            </p>
                        </div>
                    </div>

                    <div className={styles.insight}>
                        <span className={styles.insightIcon}>💡</span>
                        <div className={styles.insightContent}>
                            <h4>Revenue Target</h4>
                            <p>
                                You&apos;re{" "}
                                {(
                                    (metrics?.revenue.current /
                                        metrics?.revenue.target) *
                                        100 || 0
                                ).toFixed(1)}
                                % of the way to your monthly revenue target.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Dashboard.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    timeRange: PropTypes.string,
    refreshInterval: PropTypes.number,
    onTimeRangeChange: PropTypes.func,
    onRefresh: PropTypes.func,
    className: PropTypes.string,
};

export default Dashboard;
