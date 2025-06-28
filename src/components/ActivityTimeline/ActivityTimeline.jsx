import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import Loading from "../Loading/Loading";
import EmptyState from "../EmptyState/EmptyState";
import Chart from "../Chart/Chart";
import styles from "./ActivityTimeline.module.scss";

const ActivityTimeline = ({
    userId,
    timeRange = "30d",
    viewType = "timeline",
    showInsights = true,
    showCalendar = true,
    compactMode = false,
    onActivitySelect,
    className,
    ...props
}) => {
    const [activities, setActivities] = useState([]);
    const [groupedActivities, setGroupedActivities] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [insights, setInsights] = useState(null);
    const [activeView, setActiveView] = useState(viewType);

    // Mock activity data generation
    const mockActivities = useMemo(() => {
        const activities = [];
        const now = new Date();
        const days =
            timeRange === "7d"
                ? 7
                : timeRange === "30d"
                ? 30
                : timeRange === "90d"
                ? 90
                : 365;

        const activityTypes = [
            { type: "post_created", weight: 15, icon: "📝", color: "#3B82F6" },
            { type: "post_liked", weight: 35, icon: "❤️", color: "#EF4444" },
            {
                type: "comment_created",
                weight: 25,
                icon: "💬",
                color: "#10B981",
            },
            { type: "user_followed", weight: 12, icon: "👥", color: "#F59E0B" },
            {
                type: "post_bookmarked",
                weight: 20,
                icon: "🔖",
                color: "#06B6D4",
            },
        ];

        for (let i = 0; i < days; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            const dailyActivities = Math.floor(Math.random() * 5) + 1;

            for (let j = 0; j < dailyActivities; j++) {
                const totalWeight = activityTypes.reduce(
                    (sum, type) => sum + type.weight,
                    0
                );
                let random = Math.random() * totalWeight;
                let selectedType = activityTypes[0];

                for (const type of activityTypes) {
                    random -= type.weight;
                    if (random <= 0) {
                        selectedType = type;
                        break;
                    }
                }

                const activityTime = new Date(date);
                activityTime.setHours(
                    Math.floor(Math.random() * 16) + 7,
                    Math.floor(Math.random() * 60)
                );

                activities.push({
                    id: `${i}-${j}-${Date.now()}`,
                    type: selectedType.type,
                    timestamp: activityTime,
                    icon: selectedType.icon,
                    color: selectedType.color,
                    metadata: {
                        title: `Sample ${selectedType.type.replace("_", " ")} ${
                            j + 1
                        }`,
                        description: `Activity description for ${selectedType.type}`,
                    },
                });
            }
        }

        return activities.sort((a, b) => b.timestamp - a.timestamp);
    }, [timeRange]);

    // Group activities by date
    const groupActivitiesByDate = useCallback((activities) => {
        const grouped = {};
        activities.forEach((activity) => {
            const dateKey = activity.timestamp.toDateString();
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(activity);
        });
        return grouped;
    }, []);

    // Calculate insights
    const calculateInsights = useCallback((activities) => {
        const typeDistribution = {};
        activities.forEach((activity) => {
            typeDistribution[activity.type] =
                (typeDistribution[activity.type] || 0) + 1;
        });

        const dailyPattern = [0, 0, 0, 0, 0, 0, 0];
        activities.forEach((activity) => {
            dailyPattern[activity.timestamp.getDay()]++;
        });

        const dates = [
            ...new Set(activities.map((a) => a.timestamp.toDateString())),
        ];

        return {
            totalActivities: activities.length,
            currentStreak: Math.min(dates.length, 7),
            maxStreak: Math.min(dates.length, 15),
            typeDistribution,
            dailyPattern,
            averageDaily: Math.round(
                activities.length / Math.max(dates.length, 1)
            ),
        };
    }, []);

    // Load activities
    useEffect(() => {
        const loadActivities = async () => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 800));
            setActivities(mockActivities);
            setGroupedActivities(groupActivitiesByDate(mockActivities));
            setInsights(calculateInsights(mockActivities));
            setIsLoading(false);
        };
        loadActivities();
    }, [mockActivities, groupActivitiesByDate, calculateInsights]);

    // Render timeline view
    const renderTimelineView = () => {
        if (Object.keys(groupedActivities).length === 0) {
            return (
                <EmptyState
                    icon="📅"
                    title="No activity yet"
                    description="Your timeline will appear here."
                />
            );
        }

        return (
            <div className={styles.timelineView}>
                {Object.entries(groupedActivities)
                    .sort(([a], [b]) => new Date(b) - new Date(a))
                    .slice(0, 10)
                    .map(([dateStr, dayActivities]) => (
                        <div key={dateStr} className={styles.timelineDay}>
                            <div className={styles.dayHeader}>
                                <h3>
                                    {new Date(dateStr).toLocaleDateString()}
                                </h3>
                                <span>{dayActivities.length} activities</span>
                            </div>
                            <div className={styles.dayActivities}>
                                {dayActivities.map((activity, index) => (
                                    <div
                                        key={activity.id}
                                        className={styles.activityItem}
                                        onClick={() =>
                                            onActivitySelect?.(activity)
                                        }
                                    >
                                        <div className={styles.activityTime}>
                                            {activity.timestamp.toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}
                                        </div>
                                        <div
                                            className={styles.activityIcon}
                                            style={{
                                                backgroundColor: activity.color,
                                            }}
                                        >
                                            {activity.icon}
                                        </div>
                                        <div className={styles.activityContent}>
                                            <div
                                                className={
                                                    styles.activityDescription
                                                }
                                            >
                                                {activity.metadata.title}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        );
    };

    // Render calendar view
    const renderCalendarView = () => {
        const calendarData = [];
        const now = new Date();

        for (let i = 0; i < 365; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dayActivities = activities.filter(
                (a) => a.timestamp.toDateString() === date.toDateString()
            );

            calendarData.push({
                date,
                count: dayActivities.length,
                level:
                    dayActivities.length === 0
                        ? 0
                        : dayActivities.length <= 2
                        ? 1
                        : dayActivities.length <= 5
                        ? 2
                        : dayActivities.length <= 10
                        ? 3
                        : 4,
            });
        }

        return (
            <div className={styles.calendarView}>
                <h3>Activity Calendar</h3>
                <div className={styles.calendarGrid}>
                    {calendarData.slice(0, 365).map((dayData, index) => (
                        <div
                            key={index}
                            className={`${styles.calendarDay} ${
                                styles[`level${dayData.level}`]
                            }`}
                            title={`${dayData.date.toDateString()}: ${
                                dayData.count
                            } activities`}
                        />
                    ))}
                </div>
            </div>
        );
    };

    // Render insights view
    const renderInsightsView = () => {
        if (!insights) return null;

        const dailyChartData = {
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            values: insights.dailyPattern,
        };

        return (
            <div className={styles.insightsView}>
                <div className={styles.insightsStats}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>
                            {insights.totalActivities}
                        </div>
                        <div className={styles.statLabel}>Total Activities</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>
                            {insights.currentStreak}
                        </div>
                        <div className={styles.statLabel}>Current Streak</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>
                            {insights.averageDaily}
                        </div>
                        <div className={styles.statLabel}>Daily Average</div>
                    </div>
                </div>

                <div className={styles.chartContainer}>
                    <h4>Activity by Day of Week</h4>
                    <Chart
                        type="bar"
                        data={dailyChartData}
                        width={400}
                        height={200}
                    />
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div
                className={`${styles.activityTimeline} ${className || ""}`}
                {...props}
            >
                <Loading size="large" message="Loading timeline..." />
            </div>
        );
    }

    return (
        <div
            className={`${styles.activityTimeline} ${
                compactMode ? styles.compact : ""
            } ${className || ""}`}
            {...props}
        >
            <div className={styles.timelineHeader}>
                <h2>Activity Timeline</h2>
                <div className={styles.viewControls}>
                    <button
                        onClick={() => setActiveView("timeline")}
                        className={`${styles.viewButton} ${
                            activeView === "timeline" ? styles.active : ""
                        }`}
                    >
                        📅 Timeline
                    </button>
                    {showCalendar && (
                        <button
                            onClick={() => setActiveView("calendar")}
                            className={`${styles.viewButton} ${
                                activeView === "calendar" ? styles.active : ""
                            }`}
                        >
                            🗓️ Calendar
                        </button>
                    )}
                    {showInsights && (
                        <button
                            onClick={() => setActiveView("insights")}
                            className={`${styles.viewButton} ${
                                activeView === "insights" ? styles.active : ""
                            }`}
                        >
                            📊 Insights
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.timelineContent}>
                {activeView === "timeline" && renderTimelineView()}
                {activeView === "calendar" && renderCalendarView()}
                {activeView === "insights" && renderInsightsView()}
            </div>
        </div>
    );
};

ActivityTimeline.propTypes = {
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    timeRange: PropTypes.oneOf(["7d", "30d", "90d", "1y", "all"]),
    viewType: PropTypes.oneOf(["timeline", "calendar", "insights"]),
    showInsights: PropTypes.bool,
    showCalendar: PropTypes.bool,
    compactMode: PropTypes.bool,
    onActivitySelect: PropTypes.func,
    className: PropTypes.string,
};

export default ActivityTimeline;
