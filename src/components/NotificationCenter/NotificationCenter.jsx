import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import NotificationItem from "../NotificationItem/NotificationItem";
import Button from "../Button/Button";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import styles from "./NotificationCenter.module.scss";

const NotificationCenter = ({ isOpen, onClose, className, ...props }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, unread, read
    const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

    const centerRef = useRef(null);
    const maxDisplayCount = 10;

    // Mock data
    const mockNotifications = [
        {
            id: 1,
            type: "like",
            title: "Sarah Chen liked your post",
            message: "Sarah liked your article about React patterns",
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
                "Great article! I've been looking for something like this.",
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
            message: "Emma is now following your posts",
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
            message: "Alex mentioned you in a comment: @john great insights!",
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
    ];

    useEffect(() => {
        if (isOpen) {
            loadNotifications();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                centerRef.current &&
                !centerRef.current.contains(event.target)
            ) {
                onClose();
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscapeKey);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [isOpen, onClose]);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 600));
            setNotifications(mockNotifications);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setLoading(false);
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
            await new Promise((resolve) => setTimeout(resolve, 800));
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

    const getFilteredNotifications = () => {
        switch (filter) {
            case "unread":
                return notifications.filter((n) => !n.isRead);
            case "read":
                return notifications.filter((n) => n.isRead);
            default:
                return notifications;
        }
    };

    const filteredNotifications = getFilteredNotifications();
    const displayNotifications = filteredNotifications.slice(
        0,
        maxDisplayCount
    );
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const hasMore = filteredNotifications.length > maxDisplayCount;

    if (!isOpen) return null;

    return (
        <div className={`${styles.overlay} ${className || ""}`} {...props}>
            <div ref={centerRef} className={styles.notificationCenter}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h3 className={styles.title}>
                            Notifications
                            {unreadCount > 0 && (
                                <span className={styles.unreadBadge}>
                                    {unreadCount}
                                </span>
                            )}
                        </h3>

                        <div className={styles.headerActions}>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleMarkAllAsRead}
                                    loading={markingAllAsRead}
                                    disabled={markingAllAsRead}
                                    className={styles.markAllButton}
                                >
                                    Mark all read
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className={styles.closeButton}
                                aria-label="Close notifications"
                            >
                                ×
                            </Button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
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

                {/* Content */}
                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loading}>
                            <Loading
                                size="md"
                                text="Loading notifications..."
                            />
                        </div>
                    ) : displayNotifications.length > 0 ? (
                        <>
                            <div className={styles.notificationsList}>
                                {displayNotifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                        onMarkAsUnread={handleMarkAsUnread}
                                        onDelete={handleDelete}
                                        className={styles.notificationItem}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div className={styles.showMore}>
                                    <p className={styles.moreText}>
                                        {filteredNotifications.length -
                                            maxDisplayCount}{" "}
                                        more notifications
                                    </p>
                                    <Link
                                        to="/notifications"
                                        className={styles.viewAllLink}
                                        onClick={onClose}
                                    >
                                        View all notifications
                                    </Link>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            <EmptyState
                                icon="🔔"
                                title={
                                    filter === "unread"
                                        ? "No unread notifications"
                                        : filter === "read"
                                        ? "No read notifications"
                                        : "No notifications yet"
                                }
                                description={
                                    filter === "unread"
                                        ? "You're all caught up!"
                                        : filter === "read"
                                        ? "No notifications have been read yet"
                                        : "We'll notify you when something interesting happens"
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && notifications.length > 0 && (
                    <div className={styles.footer}>
                        <Link
                            to="/notifications"
                            className={styles.viewAllButton}
                            onClick={onClose}
                        >
                            View All Notifications
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

NotificationCenter.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default NotificationCenter;
