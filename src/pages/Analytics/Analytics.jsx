import { useState } from "react";
import Dashboard from "../../components/Dashboard/Dashboard";
import styles from "./Analytics.module.scss";

const Analytics = () => {
    const [timeRange, setTimeRange] = useState("30d");

    const handleTimeRangeChange = (newTimeRange) => {
        setTimeRange(newTimeRange);
    };

    const handleRefresh = () => {
        // Refresh will be handled by Dashboard component
    };

    return (
        <div className={styles.analyticsPage}>
            <Dashboard
                title="Analytics Dashboard"
                subtitle="Comprehensive insights into your content performance and user engagement"
                timeRange={timeRange}
                onTimeRangeChange={handleTimeRangeChange}
                onRefresh={handleRefresh}
                refreshInterval={300000} // 5 minutes
            />
        </div>
    );
};

export default Analytics;
