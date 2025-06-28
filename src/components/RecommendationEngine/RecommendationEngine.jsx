import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import PostCard from "../PostCard/PostCard";
import UserCard from "../UserCard/UserCard";
import Loading from "../Loading/Loading";
import styles from "./RecommendationEngine.module.scss";

const RecommendationEngine = ({
    userId,
    contentType = "mixed", // "posts", "users", "topics", "mixed"
    source = "personalized", // "personalized", "trending", "similar", "following"
    limit = 6,
    showSource = true,
    showRefresh = true,
    layout = "grid", // "grid", "list", "carousel"
    onItemClick,
    onRefresh,
    className,
    ...props
}) => {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Mock user profile for AI recommendations
    const userProfile = useMemo(
        () => ({
            interests: [
                "React",
                "JavaScript",
                "Frontend",
                "UX Design",
                "Node.js",
            ],
            recentlyViewed: ["react-hooks-guide", "css-grid-tutorial"],
            followers: ["john_doe", "sarah_dev"],
            readingHabits: { averageReadTime: 8 },
        }),
        []
    );

    // Mock recommendation data
    const mockData = useMemo(
        () => ({
            posts: [
                {
                    id: 1,
                    type: "posts",
                    title: "Advanced React Patterns",
                    author: {
                        id: 1,
                        username: "react_expert",
                        name: "React Expert",
                        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
                        verified: true,
                    },
                    slug: "advanced-react-patterns",
                    readTime: 12,
                    publishedAt: "2024-01-20T09:00:00Z",
                    likesCount: 342,
                    commentsCount: 45,
                    bookmarksCount: 127,
                    tags: ["React", "JavaScript", "Frontend"],
                    featuredImage:
                        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
                    recommendationReason: "Based on your interest in React",
                    similarityScore: 0.94,
                },
                {
                    id: 2,
                    type: "posts",
                    title: "Modern CSS Techniques",
                    author: {
                        id: 2,
                        username: "css_master",
                        name: "CSS Master",
                        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=40&h=40&fit=crop&crop=face",
                        verified: true,
                    },
                    slug: "modern-css-techniques",
                    readTime: 8,
                    publishedAt: "2024-01-19T14:30:00Z",
                    likesCount: 256,
                    commentsCount: 31,
                    bookmarksCount: 89,
                    tags: ["CSS", "UX", "Frontend"],
                    featuredImage:
                        "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=300&h=200&fit=crop",
                    recommendationReason: "Popular among frontend developers",
                    similarityScore: 0.87,
                },
            ],
            users: [
                {
                    id: 5,
                    type: "users",
                    username: "ui_designer",
                    name: "UI Designer Pro",
                    bio: "Senior UI/UX Designer at Google.",
                    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face",
                    verified: true,
                    followersCount: 12543,
                    followingCount: 892,
                    postsCount: 234,
                    isFollowing: false,
                    badges: ["Design Expert"],
                    location: "Mountain View, CA",
                    recommendationReason: "Popular among designers you follow",
                    mutualConnections: 12,
                },
            ],
            topics: [
                {
                    id: 7,
                    type: "topics",
                    name: "Machine Learning",
                    description: "AI, Deep Learning, and ML algorithms.",
                    postCount: 4567,
                    followerCount: 23456,
                    isFollowing: false,
                    icon: "🤖",
                    trending: true,
                    recommendationReason: "Emerging trend in tech",
                },
            ],
        }),
        []
    );

    // AI recommendation generator
    const generateRecommendations = useMemo(() => {
        return (type, source, userInterests) => {
            let baseData = [];

            switch (type) {
                case "posts":
                    baseData = mockData.posts;
                    break;
                case "users":
                    baseData = mockData.users;
                    break;
                case "topics":
                    baseData = mockData.topics;
                    break;
                case "mixed":
                default:
                    baseData = [
                        ...mockData.posts.slice(0, 2),
                        ...mockData.users.slice(0, 1),
                        ...mockData.topics.slice(0, 1),
                    ];
                    break;
            }

            // Apply AI scoring
            let scoredData = baseData.map((item) => {
                let score = item.similarityScore || Math.random();

                // Boost based on user interests
                if (item.tags) {
                    const matchingInterests = item.tags.filter((tag) =>
                        userInterests.some((interest) =>
                            interest.toLowerCase().includes(tag.toLowerCase())
                        )
                    );
                    score += matchingInterests.length * 0.1;
                }

                return { ...item, score };
            });

            scoredData.sort((a, b) => b.score - a.score);
            return scoredData.slice(0, limit);
        };
    }, [mockData, limit]);

    // Fetch recommendations
    const fetchRecommendations = async () => {
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 600));

        const recs = generateRecommendations(
            contentType,
            source,
            userProfile.interests
        );

        setRecommendations(recs);
        setLastUpdated(new Date());
        setIsLoading(false);
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchRecommendations();
        if (onRefresh) onRefresh();
    };

    // Handle item click
    const handleItemClick = (item) => {
        if (onItemClick) {
            onItemClick(item);
        } else {
            switch (item.type) {
                case "posts":
                    window.location.href = `/blog/${item.slug}`;
                    break;
                case "users":
                    window.location.href = `/profile/${item.username}`;
                    break;
                case "topics":
                    window.location.href = `/topics/${item.name.toLowerCase()}`;
                    break;
                default:
                    break;
            }
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, [contentType, source, userId]);

    // Get section title
    const getSectionTitle = () => {
        const sourceLabels = {
            personalized: "Recommended for You",
            trending: "Trending Now",
            similar: "Similar Content",
            following: "From Your Network",
        };

        const typeLabels = {
            posts: "Posts",
            users: "Users",
            topics: "Topics",
            mixed: "Content",
        };

        return `${sourceLabels[source]} • ${typeLabels[contentType]}`;
    };

    // Render item
    const renderItem = (item) => {
        const itemProps = {
            onClick: () => handleItemClick(item),
            className: styles.recommendationItem,
        };

        switch (item.type) {
            case "users":
                return (
                    <UserCard
                        key={`user-${item.id}`}
                        user={item}
                        showFollowButton={true}
                        showMutualConnections={true}
                        showReason={showSource}
                        {...itemProps}
                    />
                );

            case "topics":
                return (
                    <div
                        key={`topic-${item.id}`}
                        className={`${styles.recommendationItem} ${styles.topicItem}`}
                        onClick={() => handleItemClick(item)}
                    >
                        <div className={styles.topicIcon}>{item.icon}</div>
                        <div className={styles.topicContent}>
                            <h3 className={styles.topicName}>{item.name}</h3>
                            <p className={styles.topicDescription}>
                                {item.description}
                            </p>
                            <div className={styles.topicStats}>
                                <span>{item.postCount} posts</span>
                                <span>{item.followerCount} followers</span>
                                {item.trending && (
                                    <span className={styles.trending}>
                                        🔥 Trending
                                    </span>
                                )}
                            </div>
                            {showSource && item.recommendationReason && (
                                <div className={styles.recommendationReason}>
                                    {item.recommendationReason}
                                </div>
                            )}
                        </div>
                        <button className={styles.followButton}>
                            {item.isFollowing ? "Following" : "Follow"}
                        </button>
                    </div>
                );

            case "posts":
            default:
                return (
                    <div key={`post-${item.id}`} className={styles.postWrapper}>
                        <PostCard post={item} {...itemProps} />
                        {showSource && item.recommendationReason && (
                            <div className={styles.recommendationReason}>
                                🎯 {item.recommendationReason}
                            </div>
                        )}
                    </div>
                );
        }
    };

    if (isLoading && recommendations.length === 0) {
        return (
            <div
                className={`${styles.recommendationEngine} ${className || ""}`}
                {...props}
            >
                <div className={styles.header}>
                    <h2 className={styles.title}>{getSectionTitle()}</h2>
                </div>
                <Loading
                    size="large"
                    message="Finding personalized recommendations..."
                />
            </div>
        );
    }

    return (
        <div
            className={`${styles.recommendationEngine} ${className || ""}`}
            {...props}
        >
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h2 className={styles.title}>{getSectionTitle()}</h2>
                    {lastUpdated && (
                        <p className={styles.lastUpdated}>
                            Updated {lastUpdated.toLocaleTimeString()}
                        </p>
                    )}
                </div>

                {showRefresh && (
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className={styles.refreshButton}
                        title="Refresh recommendations"
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
                )}
            </div>

            <div className={`${styles.recommendationsList} ${styles[layout]}`}>
                {recommendations.map((item, index) => renderItem(item, index))}
            </div>

            <div className={styles.aiInsight}>
                <span className={styles.aiIcon}>🤖</span>
                <span className={styles.aiText}>
                    AI-powered recommendations based on your interests and
                    activity
                </span>
            </div>
        </div>
    );
};

RecommendationEngine.propTypes = {
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    contentType: PropTypes.oneOf(["posts", "users", "topics", "mixed"]),
    source: PropTypes.oneOf([
        "personalized",
        "trending",
        "similar",
        "following",
    ]),
    limit: PropTypes.number,
    showSource: PropTypes.bool,
    showRefresh: PropTypes.bool,
    layout: PropTypes.oneOf(["grid", "list", "carousel"]),
    onItemClick: PropTypes.func,
    onRefresh: PropTypes.func,
    className: PropTypes.string,
};

export default RecommendationEngine;
