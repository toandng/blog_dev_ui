import { useState, useEffect } from "react";
import ActivityFeed from "../../components/ActivityFeed/ActivityFeed";
import ActivityTimeline from "../../components/ActivityTimeline/ActivityTimeline";
import Loading from "../../components/Loading/Loading";
import styles from "./Activity.module.scss";

const Activity = () => {
    const [selectedTab, setSelectedTab] = useState("feed");
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Mock user data
    useEffect(() => {
        const loadUserData = async () => {
            setIsLoading(true);

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 600));

            setUser({
                id: 1,
                username: "current_user",
                name: "Current User",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                stats: {
                    postsCreated: 42,
                    commentsWritten: 128,
                    likesGiven: 356,
                    followersGained: 89,
                },
            });

            setIsLoading(false);
        };

        loadUserData();
    }, []);

    // Tab configuration
    const tabs = [
        {
            key: "feed",
            label: "Activity Feed",
            icon: "📋",
            description: "Real-time activity from your network",
        },
        {
            key: "timeline",
            label: "My Timeline",
            icon: "📅",
            description: "Your personal activity history",
        },
    ];

    // Handle activity selection
    const handleActivitySelect = (activity) => {
        console.log("Selected activity:", activity);
        // Could navigate to specific content or show details modal
    };

    if (isLoading) {
        return (
            <div className={styles.activityPage}>
                <Loading size="large" message="Loading activity data..." />
            </div>
        );
    }

    return (
        <div className={styles.activityPage}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.headerText}>
                        <h1>Activity Center</h1>
                        <p>
                            Stay updated with your activity and network
                            interactions
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className={styles.quickStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>
                                {user.stats.postsCreated}
                            </span>
                            <span className={styles.statLabel}>Posts</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>
                                {user.stats.commentsWritten}
                            </span>
                            <span className={styles.statLabel}>Comments</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>
                                {user.stats.likesGiven}
                            </span>
                            <span className={styles.statLabel}>Likes</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>
                                {user.stats.followersGained}
                            </span>
                            <span className={styles.statLabel}>Followers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className={styles.tabNavigation}>
                <div className={styles.tabList}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedTab(tab.key)}
                            className={`${styles.tabButton} ${
                                selectedTab === tab.key ? styles.active : ""
                            }`}
                        >
                            <span className={styles.tabIcon}>{tab.icon}</span>
                            <div className={styles.tabContent}>
                                <span className={styles.tabLabel}>
                                    {tab.label}
                                </span>
                                <span className={styles.tabDescription}>
                                    {tab.description}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
                {selectedTab === "feed" && (
                    <div className={styles.feedSection}>
                        <div className={styles.sectionHeader}>
                            <h2>Activity Feed</h2>
                            <p>
                                Recent activities from people and topics you
                                follow
                            </p>
                        </div>

                        <ActivityFeed
                            userId={user.id}
                            feedType="all"
                            layout="timeline"
                            limit={20}
                            showFilters={true}
                            showLoadMore={true}
                            realTimeUpdates={true}
                            onActivityClick={handleActivitySelect}
                            className={styles.activityFeedComponent}
                        />
                    </div>
                )}

                {selectedTab === "timeline" && (
                    <div className={styles.timelineSection}>
                        <div className={styles.sectionHeader}>
                            <h2>My Activity Timeline</h2>
                            <p>
                                Track your personal activity history and
                                insights
                            </p>
                        </div>

                        <ActivityTimeline
                            userId={user.id}
                            timeRange="30d"
                            viewType="timeline"
                            showInsights={true}
                            showCalendar={true}
                            compactMode={false}
                            onActivitySelect={handleActivitySelect}
                            className={styles.activityTimelineComponent}
                        />
                    </div>
                )}
            </div>

            {/* Activity Insights Summary */}
            {selectedTab === "timeline" && (
                <div className={styles.insightsSummary}>
                    <div className={styles.summaryCard}>
                        <h3>🔥 Activity Streak</h3>
                        <p>
                            You&apos;ve been active for{" "}
                            <strong>7 consecutive days</strong>! Keep it up!
                        </p>
                    </div>

                    <div className={styles.summaryCard}>
                        <h3>📊 Most Active Day</h3>
                        <p>
                            You&apos;re most active on{" "}
                            <strong>Wednesdays</strong> with an average of 8
                            activities.
                        </p>
                    </div>

                    <div className={styles.summaryCard}>
                        <h3>⏰ Peak Hours</h3>
                        <p>
                            Your most productive time is{" "}
                            <strong>2:00 PM - 4:00 PM</strong>.
                        </p>
                    </div>
                </div>
            )}

            {/* Help Section */}
            <div className={styles.helpSection}>
                <div className={styles.helpCard}>
                    <h3>💡 Tips for Better Activity Tracking</h3>
                    <ul>
                        <li>
                            Enable real-time updates to stay current with your
                            network
                        </li>
                        <li>
                            Use the calendar view to spot patterns in your
                            activity
                        </li>
                        <li>
                            Check insights regularly to understand your
                            engagement habits
                        </li>
                        <li>
                            Filter activities by type to focus on specific
                            interactions
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Activity;
