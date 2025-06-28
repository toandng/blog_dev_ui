import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import UserCard from "../UserCard/UserCard";
import Button from "../Button/Button";
import Loading from "../Loading/Loading";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./SuggestedUsers.module.scss";

const SuggestedUsers = ({
    title = "People you may know",
    limit = 6,
    source = "general", // general, similar-interests, mutual-connections
    className,
    showRefresh = true,
    showViewAll = true,
    onUserFollow,
    onRefresh,
    ...props
}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Mock suggested users data
    const mockSuggestedUsers = [
        {
            id: 1,
            name: "Sarah Chen",
            username: "sarah-chen",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            bio: "Frontend Developer passionate about React and UI/UX design. Building beautiful web experiences.",
            title: "Senior Frontend Developer",
            location: "San Francisco, CA",
            isVerified: true,
            isFollowing: false,
            stats: {
                posts: 45,
                followers: 1250,
                following: 180,
            },
            badges: ["Top Author", "React Expert"],
            mutualConnections: 5,
            reason: "Similar interests in React and Frontend",
        },
        {
            id: 2,
            name: "Alex Rodriguez",
            username: "alex-rodriguez",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            bio: "Full-stack developer and tech enthusiast. Love sharing knowledge about Node.js and system design.",
            title: "Full Stack Engineer",
            location: "New York, NY",
            isVerified: false,
            isFollowing: false,
            stats: {
                posts: 32,
                followers: 890,
                following: 156,
            },
            badges: ["Node.js Expert"],
            mutualConnections: 3,
            reason: "Followed by people you follow",
        },
        {
            id: 3,
            name: "Emma Wilson",
            username: "emma-wilson",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            bio: "UX Designer with a passion for creating intuitive user experiences. Design systems advocate.",
            title: "Senior UX Designer",
            location: "London, UK",
            isVerified: true,
            isFollowing: false,
            stats: {
                posts: 28,
                followers: 2100,
                following: 240,
            },
            badges: ["Design Expert", "Top Contributor"],
            mutualConnections: 8,
            reason: "Popular in your network",
        },
        {
            id: 4,
            name: "Mike Johnson",
            username: "mike-johnson",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            bio: "DevOps Engineer specializing in cloud infrastructure and automation. AWS certified.",
            title: "DevOps Engineer",
            location: "Seattle, WA",
            isVerified: false,
            isFollowing: false,
            stats: {
                posts: 19,
                followers: 650,
                following: 95,
            },
            badges: ["AWS Expert"],
            mutualConnections: 2,
            reason: "Works at companies you've worked at",
        },
        {
            id: 5,
            name: "Lisa Wang",
            username: "lisa-wang",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
            bio: "Product Manager focused on developer tools and API experiences. Former engineer turned PM.",
            title: "Senior Product Manager",
            location: "Austin, TX",
            isVerified: true,
            isFollowing: false,
            stats: {
                posts: 41,
                followers: 1800,
                following: 320,
            },
            badges: ["Product Expert", "API Specialist"],
            mutualConnections: 6,
            reason: "Similar career background",
        },
        {
            id: 6,
            name: "David Kim",
            username: "david-kim",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            bio: "Mobile developer working with React Native and Flutter. Open source contributor.",
            title: "Mobile Developer",
            location: "Toronto, CA",
            isVerified: false,
            isFollowing: false,
            stats: {
                posts: 36,
                followers: 1100,
                following: 200,
            },
            badges: ["Mobile Expert", "Open Source"],
            mutualConnections: 4,
            reason: "Active in mobile development",
        },
        {
            id: 7,
            name: "Maria Garcia",
            username: "maria-garcia",
            avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
            bio: "Backend engineer passionate about scalable systems and microservices architecture.",
            title: "Backend Engineer",
            location: "Barcelona, Spain",
            isVerified: false,
            isFollowing: false,
            stats: {
                posts: 24,
                followers: 780,
                following: 140,
            },
            badges: ["Backend Expert"],
            mutualConnections: 3,
            reason: "Similar technical interests",
        },
        {
            id: 8,
            name: "James Wilson",
            username: "james-wilson",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
            bio: "Data scientist and ML engineer. Helping businesses make data-driven decisions.",
            title: "Data Scientist",
            location: "Boston, MA",
            isVerified: true,
            isFollowing: false,
            stats: {
                posts: 18,
                followers: 950,
                following: 110,
            },
            badges: ["Data Expert", "ML Specialist"],
            mutualConnections: 7,
            reason: "Popular among data professionals",
        },
    ];

    useEffect(() => {
        loadSuggestedUsers();
    }, [source]);

    const loadSuggestedUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Get random suggestions based on limit
            const shuffled = [...mockSuggestedUsers].sort(
                () => 0.5 - Math.random()
            );
            const selected = shuffled.slice(0, limit);

            setUsers(selected);
        } catch (err) {
            setError("Failed to load suggested users");
            console.error("Error loading suggested users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (refreshing) return;

        setRefreshing(true);
        try {
            if (onRefresh) {
                await onRefresh();
            } else {
                await loadSuggestedUsers();
            }
        } catch (err) {
            setError("Failed to refresh suggestions");
        } finally {
            setRefreshing(false);
        }
    };

    const handleUserFollow = async (userId, isFollowing) => {
        try {
            // Optimistic update
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId
                        ? {
                              ...user,
                              isFollowing,
                              stats: {
                                  ...user.stats,
                                  followers:
                                      user.stats.followers +
                                      (isFollowing ? 1 : -1),
                              },
                          }
                        : user
                )
            );

            if (onUserFollow) {
                await onUserFollow(userId, isFollowing);
            }
        } catch (err) {
            // Revert on error
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId
                        ? {
                              ...user,
                              isFollowing: !isFollowing,
                              stats: {
                                  ...user.stats,
                                  followers:
                                      user.stats.followers +
                                      (isFollowing ? -1 : 1),
                              },
                          }
                        : user
                )
            );
            console.error("Error following user:", err);
        }
    };

    const getSourceDescription = () => {
        switch (source) {
            case "similar-interests":
                return "Based on your interests and activity";
            case "mutual-connections":
                return "People you may know through your network";
            default:
                return "Discover new people to follow";
        }
    };

    if (loading) {
        return (
            <div
                className={`${styles.suggestedUsers} ${className || ""}`}
                {...props}
            >
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>
                        {getSourceDescription()}
                    </p>
                </div>
                <div className={styles.loading}>
                    <Loading size="md" text="Finding people for you..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className={`${styles.suggestedUsers} ${className || ""}`}
                {...props}
            >
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    {showRefresh && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className={styles.refreshButton}
                        >
                            🔄 Try again
                        </Button>
                    )}
                </div>
                <div className={styles.error}>
                    <EmptyState
                        icon="⚠️"
                        title="Failed to load suggestions"
                        description={error}
                        action={
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                loading={refreshing}
                            >
                                Retry
                            </Button>
                        }
                    />
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div
                className={`${styles.suggestedUsers} ${className || ""}`}
                {...props}
            >
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    {showRefresh && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className={styles.refreshButton}
                        >
                            🔄 Refresh
                        </Button>
                    )}
                </div>
                <div className={styles.empty}>
                    <EmptyState
                        icon="👥"
                        title="No suggestions available"
                        description="We couldn't find any suggestions right now. Try again later!"
                        action={
                            showRefresh && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    loading={refreshing}
                                >
                                    Refresh
                                </Button>
                            )
                        }
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            className={`${styles.suggestedUsers} ${className || ""}`}
            {...props}
        >
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>
                        {getSourceDescription()}
                    </p>
                </div>

                <div className={styles.headerActions}>
                    {showRefresh && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            loading={refreshing}
                            disabled={refreshing}
                            className={styles.refreshButton}
                            title="Refresh suggestions"
                        >
                            🔄
                        </Button>
                    )}
                </div>
            </div>

            <div className={styles.usersList}>
                {users.map((user, index) => (
                    <div
                        key={user.id}
                        className={styles.userWrapper}
                        style={{
                            animationDelay: `${index * 0.1}s`,
                        }}
                    >
                        <UserCard
                            user={user}
                            variant="compact"
                            showFollowButton
                            showMutualConnections
                            showReason
                            onFollow={handleUserFollow}
                        />
                    </div>
                ))}
            </div>

            {showViewAll && (
                <div className={styles.footer}>
                    <Link to="/discover/people" className={styles.viewAllLink}>
                        See all suggestions
                    </Link>
                </div>
            )}
        </div>
    );
};

SuggestedUsers.propTypes = {
    title: PropTypes.string,
    limit: PropTypes.number,
    source: PropTypes.oneOf([
        "general",
        "similar-interests",
        "mutual-connections",
    ]),
    className: PropTypes.string,
    showRefresh: PropTypes.bool,
    showViewAll: PropTypes.bool,
    onUserFollow: PropTypes.func,
    onRefresh: PropTypes.func,
};

export default SuggestedUsers;
