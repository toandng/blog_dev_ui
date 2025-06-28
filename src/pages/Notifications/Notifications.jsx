import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import NotificationItem from "../../components/NotificationItem/NotificationItem";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import styles from "./Notifications.module.scss";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, unread, read
    const [sortBy, setSortBy] = useState("recent"); // recent, oldest
    const [searchQuery, setSearchQuery] = useState("");
    const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    // For future pagination
    // const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 20;

    // Extended mock data
    const mockNotifications = [
        {
            id: 1,
            type: "like",
            title: "Sarah Chen liked your post",
            message:
                "Sarah liked your article about React patterns and modern development practices",
            isRead: false,
            createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            actor: {
                id: 2,
                name: "Sarah Chen",
                username: "sarah-chen",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            },
            target: {
                id: 1,
                slug: "advanced-react-patterns-you-should-know",
            },
            metadata: {
                postTitle: "Advanced React Patterns You Should Know",
            },
        },
        {
            id: 2,
            type: "comment",
            title: "Mike Johnson commented on your post",
            message:
                "Great article! I've been looking for something like this. Really helpful insights.",
            isRead: false,
            createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            actor: {
                id: 3,
                name: "Mike Johnson",
                username: "mike-johnson",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            },
            target: {
                id: 1,
                slug: "advanced-react-patterns-you-should-know",
            },
            metadata: {
                postTitle: "Advanced React Patterns You Should Know",
            },
        },
        {
            id: 3,
            type: "follow",
            title: "Emma Wilson started following you",
            message:
                "Emma is now following your posts and will receive updates",
            isRead: true,
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            actor: {
                id: 4,
                name: "Emma Wilson",
                username: "emma-wilson",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            },
            target: {
                id: 4,
                username: "emma-wilson",
            },
        },
        {
            id: 4,
            type: "mention",
            title: "Alex Rodriguez mentioned you",
            message:
                "Alex mentioned you in a comment: @john great insights on this topic!",
            isRead: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            actor: {
                id: 1,
                name: "Alex Rodriguez",
                username: "alex-rodriguez",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            },
            target: {
                id: 2,
                slug: "building-scalable-nodejs-apis",
                url: "/blog/building-scalable-nodejs-apis#comment-123",
            },
            metadata: {
                postTitle: "Building Scalable Node.js APIs",
            },
        },
        {
            id: 5,
            type: "like",
            title: "David Kim liked your comment",
            message:
                "David liked your thoughtful comment on JavaScript performance",
            isRead: true,
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            actor: {
                id: 5,
                name: "David Kim",
                username: "david-kim",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            },
            target: {
                id: 3,
                slug: "javascript-performance-optimization",
            },
            metadata: {
                postTitle: "JavaScript Performance Optimization",
            },
        },
        {
            id: 6,
            type: "comment",
            title: "Lisa Wang replied to your comment",
            message:
                "Lisa replied: I totally agree with your approach on state management",
            isRead: false,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            actor: {
                id: 6,
                name: "Lisa Wang",
                username: "lisa-wang",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
            },
            target: {
                id: 4,
                slug: "state-management-in-react",
            },
            metadata: {
                postTitle: "State Management in React",
            },
        },
        {
            id: 7,
            type: "follow",
            title: "James Wilson started following you",
            message: "James is now following your posts",
            isRead: true,
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            actor: {
                id: 7,
                name: "James Wilson",
                username: "james-wilson",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            },
            target: {
                id: 7,
                username: "james-wilson",
            },
        },
        {
            id: 8,
            type: "post",
            title: "Someone shared your post",
            message:
                "Your post about React hooks has been shared by Maria Garcia",
            isRead: true,
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            actor: {
                id: 8,
                name: "Maria Garcia",
                username: "maria-garcia",
                avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
            },
            target: {
                id: 5,
                slug: "mastering-react-hooks",
            },
            metadata: {
                postTitle: "Mastering React Hooks",
            },
        },
        {
            id: 9,
            type: "system",
            title: "Welcome to BlogUI!",
            message:
                "Thanks for joining our community. Explore and share your knowledge!",
            isRead: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            target: {
                url: "/welcome",
            },
        },
        {
            id: 10,
            type: "system",
            title: "Your post is trending",
            message:
                "Your article 'Advanced React Patterns' is trending today with 150+ likes!",
            isRead: false,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            target: {
                id: 1,
                slug: "advanced-react-patterns-you-should-know",
            },
            metadata: {
                postTitle: "Advanced React Patterns You Should Know",
            },
        },
    ];

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800));
            setNotifications(mockNotifications);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        try {
            // Simulate loading more notifications
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // For demo, we'll just mark as no more after first load
            setHasMore(false);
        } catch (error) {
            console.error("Failed to load more notifications:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleMarkAsRead = (notificationId) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const handleMarkAsUnread = (notificationId) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, isRead: false }
                    : notification
            )
        );
    };

    const handleDelete = (notificationId) => {
        setNotifications((prev) =>
            prev.filter((notification) => notification.id !== notificationId)
        );
    };

    const handleMarkAllAsRead = async () => {
        setMarkingAllAsRead(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        } finally {
            setMarkingAllAsRead(false);
        }
    };

    const getFilteredAndSortedNotifications = () => {
        let filtered = notifications;

        // Apply filter
        switch (filter) {
            case "unread":
                filtered = filtered.filter((n) => !n.isRead);
                break;
            case "read":
                filtered = filtered.filter((n) => n.isRead);
                break;
            default:
                break;
        }

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (n) =>
                    n.title.toLowerCase().includes(query) ||
                    n.message.toLowerCase().includes(query) ||
                    n.actor?.name.toLowerCase().includes(query) ||
                    n.metadata?.postTitle?.toLowerCase().includes(query)
            );
        }

        // Apply sort
        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortBy === "recent" ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    };

    const filteredNotifications = getFilteredAndSortedNotifications();
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <>
            <Helmet>
                <title>Notifications - BlogUI</title>
                <meta
                    name="description"
                    content="View and manage your notifications"
                />
            </Helmet>

            <div className={styles.notificationsPage}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.title}>
                                Notifications
                                {unreadCount > 0 && (
                                    <span className={styles.unreadBadge}>
                                        {unreadCount}
                                    </span>
                                )}
                            </h1>
                            <p className={styles.subtitle}>
                                Stay updated with your latest activities
                            </p>
                        </div>

                        <div className={styles.headerActions}>
                            {unreadCount > 0 && (
                                <Button
                                    onClick={handleMarkAllAsRead}
                                    loading={markingAllAsRead}
                                    disabled={markingAllAsRead}
                                    className={styles.markAllButton}
                                >
                                    Mark all as read
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className={styles.controls}>
                        <div className={styles.filtersAndSearch}>
                            {/* Search */}
                            <div className={styles.searchContainer}>
                                <Input
                                    type="text"
                                    placeholder="Search notifications..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className={styles.searchInput}
                                />
                            </div>

                            {/* Filters */}
                            <div className={styles.filters}>
                                <button
                                    className={`${styles.filterTab} ${
                                        filter === "all" ? styles.active : ""
                                    }`}
                                    onClick={() => setFilter("all")}
                                >
                                    All ({notifications.length})
                                </button>
                                <button
                                    className={`${styles.filterTab} ${
                                        filter === "unread" ? styles.active : ""
                                    }`}
                                    onClick={() => setFilter("unread")}
                                >
                                    Unread ({unreadCount})
                                </button>
                                <button
                                    className={`${styles.filterTab} ${
                                        filter === "read" ? styles.active : ""
                                    }`}
                                    onClick={() => setFilter("read")}
                                >
                                    Read ({notifications.length - unreadCount})
                                </button>
                            </div>
                        </div>

                        {/* Sort */}
                        <div className={styles.sortContainer}>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={styles.sortSelect}
                            >
                                <option value="recent">Newest first</option>
                                <option value="oldest">Oldest first</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loading}>
                            <Loading
                                size="lg"
                                text="Loading notifications..."
                            />
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        <>
                            <div className={styles.notificationsList}>
                                {filteredNotifications.map(
                                    (notification, index) => (
                                        <div
                                            key={notification.id}
                                            className={
                                                styles.notificationWrapper
                                            }
                                            style={{
                                                animationDelay: `${
                                                    index * 0.05
                                                }s`,
                                            }}
                                        >
                                            <NotificationItem
                                                notification={notification}
                                                onMarkAsRead={handleMarkAsRead}
                                                onMarkAsUnread={
                                                    handleMarkAsUnread
                                                }
                                                onDelete={handleDelete}
                                            />
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Load More */}
                            {hasMore && (
                                <div className={styles.loadMore}>
                                    <Button
                                        variant="outline"
                                        onClick={loadMore}
                                        loading={loadingMore}
                                        disabled={loadingMore}
                                        className={styles.loadMoreButton}
                                    >
                                        Load more notifications
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            <EmptyState
                                icon="🔔"
                                title={
                                    searchQuery
                                        ? "No matching notifications"
                                        : filter === "unread"
                                        ? "No unread notifications"
                                        : filter === "read"
                                        ? "No read notifications"
                                        : "No notifications yet"
                                }
                                description={
                                    searchQuery
                                        ? `No notifications found matching "${searchQuery}"`
                                        : filter === "unread"
                                        ? "You're all caught up! 🎉"
                                        : filter === "read"
                                        ? "No notifications have been read yet"
                                        : "We'll notify you when something interesting happens"
                                }
                                action={
                                    searchQuery && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setSearchQuery("")}
                                        >
                                            Clear search
                                        </Button>
                                    )
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Notifications;
