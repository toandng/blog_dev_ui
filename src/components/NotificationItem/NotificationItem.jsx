import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import FallbackImage from "../FallbackImage/FallbackImage";
import Button from "../Button/Button";
import styles from "./NotificationItem.module.scss";

const NotificationItem = ({
    notification,
    onMarkAsRead,
    onMarkAsUnread,
    onDelete,
    className,
    ...props
}) => {
    const [loading, setLoading] = useState(false);

    const {
        id,
        type,
        title,
        message,
        isRead,
        createdAt,
        actor,
        target,
        metadata = {},
    } = notification;

    const handleMarkAsRead = async () => {
        if (loading || isRead) return;

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            if (onMarkAsRead) {
                onMarkAsRead(id);
            }
        } catch (error) {
            console.error("Failed to mark as read:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsUnread = async () => {
        if (loading || !isRead) return;

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            if (onMarkAsUnread) {
                onMarkAsUnread(id);
            }
        } catch (error) {
            console.error("Failed to mark as unread:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (loading) return;

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            if (onDelete) {
                onDelete(id);
            }
        } catch (error) {
            console.error("Failed to delete notification:", error);
        } finally {
            setLoading(false);
        }
    };

    const getNotificationIcon = () => {
        switch (type) {
            case "like":
                return "❤️";
            case "comment":
                return "💬";
            case "follow":
                return "👤";
            case "mention":
                return "📢";
            case "post":
                return "📝";
            case "system":
                return "🔔";
            default:
                return "📌";
        }
    };

    const getNotificationColor = () => {
        switch (type) {
            case "like":
                return "error";
            case "comment":
                return "info";
            case "follow":
                return "primary";
            case "mention":
                return "warning";
            case "post":
                return "success";
            case "system":
                return "secondary";
            default:
                return "secondary";
        }
    };

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return "just now";
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const getTargetLink = () => {
        if (!target) return null;

        switch (type) {
            case "like":
            case "comment":
            case "post":
                return `/blog/${target.slug || target.id}`;
            case "follow":
                return `/profile/${target.username || target.id}`;
            case "mention":
                return target.url || `/blog/${target.slug || target.id}`;
            default:
                return target.url || null;
        }
    };

    const targetLink = getTargetLink();

    return (
        <div
            className={`
                ${styles.notificationItem} 
                ${isRead ? styles.read : styles.unread}
                ${loading ? styles.loading : ""}
                ${className || ""}
            `}
            {...props}
        >
            <div className={styles.content}>
                {/* Icon */}
                <div
                    className={`${styles.icon} ${
                        styles[getNotificationColor()]
                    }`}
                >
                    <span className={styles.emoji}>
                        {getNotificationIcon()}
                    </span>
                    {!isRead && <div className={styles.unreadDot} />}
                </div>

                {/* Actor Avatar */}
                {actor && (
                    <div className={styles.avatar}>
                        <Link to={`/profile/${actor.username}`}>
                            <FallbackImage
                                src={actor.avatar}
                                alt={actor.name}
                                className={styles.avatarImage}
                            />
                        </Link>
                    </div>
                )}

                {/* Text Content */}
                <div className={styles.text}>
                    <div className={styles.message}>
                        {targetLink ? (
                            <Link to={targetLink} onClick={handleMarkAsRead}>
                                <span className={styles.title}>{title}</span>
                                <p className={styles.description}>{message}</p>
                            </Link>
                        ) : (
                            <>
                                <span className={styles.title}>{title}</span>
                                <p className={styles.description}>{message}</p>
                            </>
                        )}
                    </div>

                    <div className={styles.metadata}>
                        <span className={styles.time}>
                            {formatTimeAgo(createdAt)}
                        </span>

                        {metadata.postTitle && (
                            <>
                                <span className={styles.separator}>•</span>
                                <span className={styles.postTitle}>
                                    {metadata.postTitle}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <div className={styles.primaryActions}>
                        {!isRead ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleMarkAsRead}
                                disabled={loading}
                                className={styles.actionButton}
                                title="Mark as read"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleMarkAsUnread}
                                disabled={loading}
                                className={styles.actionButton}
                                title="Mark as unread"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Button>
                        )}
                    </div>

                    <div className={styles.secondaryActions}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            disabled={loading}
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            title="Delete notification"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

NotificationItem.propTypes = {
    notification: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        type: PropTypes.oneOf([
            "like",
            "comment",
            "follow",
            "mention",
            "post",
            "system",
        ]).isRequired,
        title: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        isRead: PropTypes.bool,
        createdAt: PropTypes.string.isRequired,
        actor: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            username: PropTypes.string,
            avatar: PropTypes.string,
        }),
        target: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            slug: PropTypes.string,
            username: PropTypes.string,
            url: PropTypes.string,
        }),
        metadata: PropTypes.object,
    }).isRequired,
    onMarkAsRead: PropTypes.func,
    onMarkAsUnread: PropTypes.func,
    onDelete: PropTypes.func,
    className: PropTypes.string,
};

export default NotificationItem;
