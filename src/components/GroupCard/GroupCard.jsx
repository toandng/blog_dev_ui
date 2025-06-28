import { useState } from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import Badge from "../Badge/Badge";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./GroupCard.module.scss";

const GroupCard = ({
    group,
    currentUser,
    onJoin,
    onLeave,
    onView,
    showActions = true,
    className,
    ...props
}) => {
    const [isJoining, setIsJoining] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const isOwner = group.ownerId === currentUser?.id;
    const isMember = group.members?.some(
        (member) => member.id === currentUser?.id
    );
    const isPrivate = group.privacy === "private";
    const isPending = group.pendingMembers?.some(
        (member) => member.id === currentUser?.id
    );

    const handleJoinClick = async () => {
        if (!onJoin || isJoining) return;

        setIsJoining(true);
        try {
            await onJoin(group);
        } catch (error) {
            console.error("Failed to join group:", error);
        } finally {
            setIsJoining(false);
        }
    };

    const handleLeaveClick = async () => {
        if (!onLeave || isLeaving) return;

        setIsLeaving(true);
        try {
            await onLeave(group);
        } catch (error) {
            console.error("Failed to leave group:", error);
        } finally {
            setIsLeaving(false);
        }
    };

    const handleViewClick = () => {
        if (onView) {
            onView(group);
        }
    };

    const formatMemberCount = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365)
            return `${Math.floor(diffInDays / 30)} months ago`;
        return `${Math.floor(diffInDays / 365)} years ago`;
    };

    const getPrivacyIcon = () => {
        switch (group.privacy) {
            case "private":
                return "🔒";
            case "public":
                return "🌐";
            default:
                return "👥";
        }
    };

    const getActivityLevel = () => {
        const postsThisWeek = group.recentActivity?.postsThisWeek || 0;
        if (postsThisWeek >= 10)
            return { level: "high", color: "success", text: "Very Active" };
        if (postsThisWeek >= 5)
            return { level: "medium", color: "warning", text: "Active" };
        if (postsThisWeek >= 1)
            return { level: "low", color: "secondary", text: "Moderate" };
        return { level: "none", color: "muted", text: "Quiet" };
    };

    const activity = getActivityLevel();

    return (
        <div className={`${styles.groupCard} ${className || ""}`} {...props}>
            {/* Group Cover/Header */}
            <div className={styles.groupHeader}>
                {group.coverImage && (
                    <div className={styles.coverImage}>
                        <img
                            src={group.coverImage}
                            alt={`${group.name} cover`}
                        />
                    </div>
                )}

                <div className={styles.groupAvatar}>
                    <FallbackImage
                        src={group.avatar}
                        alt={group.name}
                        fallback={group.name.charAt(0)}
                        className={styles.avatar}
                    />
                </div>

                {isPrivate && <div className={styles.privacyBadge}>🔒</div>}
            </div>

            {/* Group Info */}
            <div className={styles.groupInfo}>
                <div className={styles.groupTitle}>
                    <h3 className={styles.groupName} onClick={handleViewClick}>
                        {group.name}
                    </h3>
                    <div className={styles.groupMeta}>
                        <span className={styles.privacy}>
                            {getPrivacyIcon()} {group.privacy}
                        </span>
                        <span className={styles.memberCount}>
                            {formatMemberCount(group.memberCount)} members
                        </span>
                    </div>
                </div>

                {group.description && (
                    <p className={styles.groupDescription}>
                        {group.description}
                    </p>
                )}

                {/* Group Stats */}
                <div className={styles.groupStats}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>
                            {group.recentActivity?.postsThisWeek || 0}
                        </span>
                        <span className={styles.statLabel}>
                            posts this week
                        </span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>
                            {group.recentActivity?.activeMembers || 0}
                        </span>
                        <span className={styles.statLabel}>active members</span>
                    </div>
                </div>

                {/* Activity Level */}
                <div className={styles.activityLevel}>
                    <Badge
                        variant={activity.color}
                        className={styles.activityBadge}
                    >
                        {activity.text}
                    </Badge>
                </div>

                {/* Recent Activity */}
                {group.lastPost && (
                    <div className={styles.recentActivity}>
                        <span className={styles.lastPost}>
                            Last post: {formatDate(group.lastPost.createdAt)}
                        </span>
                    </div>
                )}

                {/* Categories/Tags */}
                {group.categories && group.categories.length > 0 && (
                    <div className={styles.categories}>
                        {group.categories.slice(0, 3).map((category, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className={styles.categoryTag}
                            >
                                {category}
                            </Badge>
                        ))}
                        {group.categories.length > 3 && (
                            <span className={styles.moreCategories}>
                                +{group.categories.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Group Actions */}
            {showActions && (
                <div className={styles.groupActions}>
                    {isOwner ? (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleViewClick}
                            className={styles.actionButton}
                        >
                            Manage Group
                        </Button>
                    ) : isMember ? (
                        <div className={styles.memberActions}>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleViewClick}
                                className={styles.actionButton}
                            >
                                View Group
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLeaveClick}
                                loading={isLeaving}
                                disabled={isLeaving}
                                className={styles.leaveButton}
                            >
                                Leave
                            </Button>
                        </div>
                    ) : isPending ? (
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled
                            className={styles.actionButton}
                        >
                            Request Pending
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleJoinClick}
                            loading={isJoining}
                            disabled={isJoining}
                            className={styles.actionButton}
                        >
                            {isPrivate ? "Request to Join" : "Join Group"}
                        </Button>
                    )}
                </div>
            )}

            {/* Member Preview */}
            {group.members && group.members.length > 0 && (
                <div className={styles.memberPreview}>
                    <div className={styles.memberAvatars}>
                        {group.members.slice(0, 4).map((member, index) => (
                            <div
                                key={member.id}
                                className={styles.memberAvatar}
                                style={{ zIndex: 4 - index }}
                            >
                                <FallbackImage
                                    src={member.avatar}
                                    alt={member.name}
                                    fallback={member.name.charAt(0)}
                                    className={styles.memberAvatarImg}
                                />
                            </div>
                        ))}
                        {group.memberCount > 4 && (
                            <div className={styles.moreMembers}>
                                +{group.memberCount - 4}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

GroupCard.propTypes = {
    group: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        avatar: PropTypes.string,
        coverImage: PropTypes.string,
        privacy: PropTypes.oneOf(["public", "private"]).isRequired,
        memberCount: PropTypes.number.isRequired,
        ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        members: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                    .isRequired,
                name: PropTypes.string.isRequired,
                avatar: PropTypes.string,
            })
        ),
        pendingMembers: PropTypes.array,
        categories: PropTypes.arrayOf(PropTypes.string),
        recentActivity: PropTypes.shape({
            postsThisWeek: PropTypes.number,
            activeMembers: PropTypes.number,
        }),
        lastPost: PropTypes.shape({
            createdAt: PropTypes.string,
        }),
    }).isRequired,
    currentUser: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
    }),
    onJoin: PropTypes.func,
    onLeave: PropTypes.func,
    onView: PropTypes.func,
    showActions: PropTypes.bool,
    className: PropTypes.string,
};

export default GroupCard;
