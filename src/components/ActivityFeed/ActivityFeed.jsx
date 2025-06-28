import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import Loading from "../Loading/Loading";
import EmptyState from "../EmptyState/EmptyState";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./ActivityFeed.module.scss";

const ActivityFeed = ({
    userId,
    feedType = "all", // "all", "following", "personal", "mentions"
    layout = "timeline", // "timeline", "compact", "detailed"
    limit = 20,
    showFilters = true,
    showLoadMore = true,
    realTimeUpdates = true,
    onActivityClick,
    className,
    ...props
}) => {
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [lastUpdated, setLastUpdated] = useState(null);

    // Activity type filters
    const activityFilters = [
        { key: "all", label: "All Activities", icon: "📋" },
        { key: "posts", label: "Posts", icon: "📝" },
        { key: "likes", label: "Likes", icon: "❤️" },
        { key: "comments", label: "Comments", icon: "💬" },
        { key: "follows", label: "Follows", icon: "👥" },
        { key: "mentions", label: "Mentions", icon: "🏷️" },
        { key: "bookmarks", label: "Bookmarks", icon: "🔖" },
    ];

    // Mock activity data with comprehensive examples
    const mockActivities = useMemo(
        () => [
            {
                id: 1,
                type: "post_created",
                actor: {
                    id: 1,
                    username: "john_doe",
                    name: "John Doe",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
                    verified: true,
                },
                target: {
                    type: "post",
                    id: 123,
                    title: "Advanced React Patterns: Building Scalable Applications",
                    slug: "advanced-react-patterns-scalable",
                },
                timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
                metadata: {
                    postCount: 1,
                    tags: ["React", "JavaScript", "Frontend"],
                },
            },
            {
                id: 2,
                type: "post_liked",
                actor: {
                    id: 2,
                    username: "sarah_dev",
                    name: "Sarah Developer",
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=40&h=40&fit=crop&crop=face",
                    verified: false,
                },
                target: {
                    type: "post",
                    id: 124,
                    title: "CSS Grid vs Flexbox: Complete Comparison",
                    slug: "css-grid-vs-flexbox-comparison",
                    author: {
                        username: "css_master",
                        name: "CSS Master",
                    },
                },
                timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
                metadata: {
                    likeCount: 1,
                },
            },
            {
                id: 3,
                type: "user_followed",
                actor: {
                    id: 3,
                    username: "alex_frontend",
                    name: "Alex Frontend",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
                    verified: true,
                },
                target: {
                    type: "user",
                    id: 4,
                    username: "design_guru",
                    name: "Design Guru",
                    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
                },
                timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
                metadata: {
                    followCount: 1,
                    mutualConnections: 5,
                },
            },
            {
                id: 4,
                type: "comment_created",
                actor: {
                    id: 4,
                    username: "tech_reviewer",
                    name: "Tech Reviewer",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
                    verified: false,
                },
                target: {
                    type: "post",
                    id: 125,
                    title: "Node.js Performance Optimization Guide",
                    slug: "nodejs-performance-optimization",
                },
                timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
                metadata: {
                    commentText:
                        "Great insights on database optimization! The connection pooling section was particularly helpful.",
                    commentCount: 1,
                },
            },
            {
                id: 5,
                type: "post_bookmarked",
                actor: {
                    id: 5,
                    username: "learning_dev",
                    name: "Learning Developer",
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=40&h=40&fit=crop&crop=face",
                    verified: false,
                },
                target: {
                    type: "post",
                    id: 126,
                    title: "TypeScript Best Practices for Large Applications",
                    slug: "typescript-best-practices-large-apps",
                },
                timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
                metadata: {
                    bookmarkCount: 1,
                    folder: "Learning Resources",
                },
            },
            {
                id: 6,
                type: "user_mentioned",
                actor: {
                    id: 6,
                    username: "project_lead",
                    name: "Project Lead",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
                    verified: true,
                },
                target: {
                    type: "comment",
                    id: 789,
                    postTitle: "Team Collaboration Best Practices",
                    mentionedUser: userId, // Current user was mentioned
                },
                timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
                metadata: {
                    mentionText:
                        "Great point about async communication, @current_user!",
                    context: "project discussion",
                },
            },
            {
                id: 7,
                type: "topic_followed",
                actor: {
                    id: 7,
                    username: "curious_learner",
                    name: "Curious Learner",
                    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
                    verified: false,
                },
                target: {
                    type: "topic",
                    id: 20,
                    name: "Machine Learning",
                    icon: "🤖",
                    postCount: 2341,
                },
                timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
                metadata: {
                    followCount: 1,
                    reason: "trending topic",
                },
            },
            {
                id: 8,
                type: "group_joined",
                actor: {
                    id: 8,
                    username: "team_player",
                    name: "Team Player",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
                    verified: false,
                },
                target: {
                    type: "group",
                    id: 15,
                    name: "React Developers Community",
                    memberCount: 5678,
                    privacy: "Public",
                },
                timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                metadata: {
                    joinCount: 1,
                    invitedBy: "john_doe",
                },
            },
        ],
        [userId]
    );

    // Generate activity text based on type
    const getActivityText = useCallback((activity) => {
        const { type, actor, target, metadata } = activity;

        switch (type) {
            case "post_created":
                return `published a new post`;
            case "post_liked":
                return `liked "${target.title}" by ${
                    target.author?.name || "Unknown"
                }`;
            case "post_bookmarked":
                return `bookmarked "${target.title}"${
                    metadata.folder ? ` in ${metadata.folder}` : ""
                }`;
            case "comment_created":
                return `commented on "${target.title}"`;
            case "user_followed":
                return `started following ${target.name}`;
            case "user_mentioned":
                return `mentioned you in a comment`;
            case "topic_followed":
                return `started following ${target.name} topic`;
            case "group_joined":
                return `joined ${target.name}`;
            default:
                return "performed an action";
        }
    }, []);

    // Get activity icon based on type
    const getActivityIcon = useCallback((type) => {
        const icons = {
            post_created: "📝",
            post_liked: "❤️",
            post_bookmarked: "🔖",
            comment_created: "💬",
            user_followed: "👥",
            user_mentioned: "🏷️",
            topic_followed: "🔔",
            group_joined: "👥",
        };
        return icons[type] || "📋";
    }, []);

    // Format timestamp
    const formatTimestamp = useCallback((timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;

        return timestamp.toLocaleDateString();
    }, []);

    // Filter activities based on active filter
    useEffect(() => {
        let filtered = activities;

        if (activeFilter !== "all") {
            const filterMap = {
                posts: ["post_created"],
                likes: ["post_liked"],
                comments: ["comment_created"],
                follows: ["user_followed", "topic_followed"],
                mentions: ["user_mentioned"],
                bookmarks: ["post_bookmarked"],
            };

            filtered = activities.filter((activity) =>
                filterMap[activeFilter]?.includes(activity.type)
            );
        }

        setFilteredActivities(filtered);
    }, [activities, activeFilter]);

    // Simulate real-time updates
    useEffect(() => {
        if (!realTimeUpdates) return;

        const interval = setInterval(() => {
            // Simulate new activity
            const randomActivity =
                mockActivities[
                    Math.floor(Math.random() * mockActivities.length)
                ];
            const newActivity = {
                ...randomActivity,
                id: Date.now(),
                timestamp: new Date(),
            };

            setActivities((prev) => [newActivity, ...prev].slice(0, limit * 2));
            setLastUpdated(new Date());
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, [realTimeUpdates, mockActivities, limit]);

    // Initial load
    useEffect(() => {
        const loadActivities = async () => {
            setIsLoading(true);

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 800));

            setActivities(mockActivities.slice(0, limit));
            setLastUpdated(new Date());
            setIsLoading(false);
        };

        loadActivities();
    }, [mockActivities, limit]);

    // Load more activities
    const handleLoadMore = async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        const newActivities = mockActivities.slice(
            activities.length,
            activities.length + limit
        );

        if (newActivities.length < limit) {
            setHasMore(false);
        }

        setActivities((prev) => [...prev, ...newActivities]);
        setLoadingMore(false);
    };

    // Handle activity click
    const handleActivityClick = (activity) => {
        if (onActivityClick) {
            onActivityClick(activity);
        } else {
            // Default navigation based on target type
            const { target } = activity;
            switch (target.type) {
                case "post":
                    window.location.href = `/blog/${target.slug}`;
                    break;
                case "user":
                    window.location.href = `/profile/${target.username}`;
                    break;
                case "topic":
                    window.location.href = `/topics/${target.name.toLowerCase()}`;
                    break;
                case "group":
                    window.location.href = `/groups/${target.id}`;
                    break;
                default:
                    break;
            }
        }
    };

    // Render activity item
    const renderActivityItem = (activity, index) => {
        const isDetailed = layout === "detailed";
        const isCompact = layout === "compact";

        return (
            <div
                key={activity.id}
                className={`${styles.activityItem} ${styles[layout]} ${
                    isDetailed ? styles.detailed : ""
                }`}
                onClick={() => handleActivityClick(activity)}
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                {/* Activity icon */}
                <div className={styles.activityIcon}>
                    <span className={styles.iconEmoji}>
                        {getActivityIcon(activity.type)}
                    </span>
                </div>

                {/* Activity content */}
                <div className={styles.activityContent}>
                    {/* Actor info */}
                    <div className={styles.actorInfo}>
                        <FallbackImage
                            src={activity.actor.avatar}
                            alt={activity.actor.name}
                            className={styles.actorAvatar}
                            fallback={activity.actor.name.charAt(0)}
                        />

                        <div className={styles.actorDetails}>
                            <span className={styles.actorName}>
                                {activity.actor.name}
                                {activity.actor.verified && (
                                    <span className={styles.verifiedBadge}>
                                        ✓
                                    </span>
                                )}
                            </span>
                            {!isCompact && (
                                <span className={styles.actorUsername}>
                                    @{activity.actor.username}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Activity description */}
                    <div className={styles.activityDescription}>
                        <span className={styles.activityText}>
                            {getActivityText(activity)}
                        </span>

                        {/* Target info for detailed view */}
                        {isDetailed && activity.target && (
                            <div className={styles.targetInfo}>
                                {activity.target.type === "user" && (
                                    <div className={styles.targetUser}>
                                        <FallbackImage
                                            src={activity.target.avatar}
                                            alt={activity.target.name}
                                            className={styles.targetAvatar}
                                            fallback={activity.target.name.charAt(
                                                0
                                            )}
                                        />
                                        <span>{activity.target.name}</span>
                                    </div>
                                )}

                                {activity.target.type === "topic" && (
                                    <div className={styles.targetTopic}>
                                        <span className={styles.topicIcon}>
                                            {activity.target.icon}
                                        </span>
                                        <span>{activity.target.name}</span>
                                        <span className={styles.topicCount}>
                                            {activity.target.postCount} posts
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Comment preview for comment activities */}
                        {activity.type === "comment_created" &&
                            activity.metadata.commentText && (
                                <div className={styles.commentPreview}>
                                    "{activity.metadata.commentText}"
                                </div>
                            )}
                    </div>

                    {/* Timestamp */}
                    <div className={styles.activityTimestamp}>
                        {formatTimestamp(activity.timestamp)}
                    </div>

                    {/* Activity metadata */}
                    {isDetailed && activity.metadata && (
                        <div className={styles.activityMetadata}>
                            {activity.metadata.mutualConnections && (
                                <span className={styles.metadataItem}>
                                    {activity.metadata.mutualConnections} mutual
                                    connections
                                </span>
                            )}
                            {activity.metadata.tags && (
                                <div className={styles.tags}>
                                    {activity.metadata.tags.map((tag) => (
                                        <span key={tag} className={styles.tag}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (isLoading && activities.length === 0) {
        return (
            <div
                className={`${styles.activityFeed} ${className || ""}`}
                {...props}
            >
                <Loading size="large" message="Loading activity feed..." />
            </div>
        );
    }

    if (!isLoading && filteredActivities.length === 0) {
        return (
            <div
                className={`${styles.activityFeed} ${className || ""}`}
                {...props}
            >
                <EmptyState
                    icon="📋"
                    title="No activity yet"
                    description="Activity will appear here when users interact with content."
                    actionText="Explore Content"
                    onActionClick={() => (window.location.href = "/search")}
                />
            </div>
        );
    }

    return (
        <div className={`${styles.activityFeed} ${className || ""}`} {...props}>
            {/* Header */}
            <div className={styles.feedHeader}>
                <div className={styles.feedTitle}>
                    <h2>Activity Feed</h2>
                    {lastUpdated && (
                        <span className={styles.lastUpdated}>
                            Updated {formatTimestamp(lastUpdated)}
                        </span>
                    )}
                </div>

                {realTimeUpdates && (
                    <div className={styles.realTimeIndicator}>
                        <span className={styles.liveIcon}>🔴</span>
                        Live
                    </div>
                )}
            </div>

            {/* Filters */}
            {showFilters && (
                <div className={styles.activityFilters}>
                    {activityFilters.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={`${styles.filterButton} ${
                                activeFilter === filter.key ? styles.active : ""
                            }`}
                        >
                            <span className={styles.filterIcon}>
                                {filter.icon}
                            </span>
                            <span className={styles.filterLabel}>
                                {filter.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Activity list */}
            <div className={styles.activitiesList}>
                {filteredActivities.map((activity, index) =>
                    renderActivityItem(activity, index)
                )}
            </div>

            {/* Load more */}
            {showLoadMore && hasMore && (
                <div className={styles.loadMoreContainer}>
                    <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className={styles.loadMoreButton}
                    >
                        {loadingMore ? "Loading..." : "Load More Activities"}
                    </button>
                </div>
            )}

            {/* Loading more indicator */}
            {loadingMore && (
                <div className={styles.loadingMore}>
                    <Loading
                        size="small"
                        message="Loading more activities..."
                    />
                </div>
            )}
        </div>
    );
};

ActivityFeed.propTypes = {
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    feedType: PropTypes.oneOf(["all", "following", "personal", "mentions"]),
    layout: PropTypes.oneOf(["timeline", "compact", "detailed"]),
    limit: PropTypes.number,
    showFilters: PropTypes.bool,
    showLoadMore: PropTypes.bool,
    realTimeUpdates: PropTypes.bool,
    onActivityClick: PropTypes.func,
    className: PropTypes.string,
};

export default ActivityFeed;
