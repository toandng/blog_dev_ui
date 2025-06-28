import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import FallbackImage from "../FallbackImage/FallbackImage";
import FollowButton from "../FollowButton/FollowButton";
import Badge from "../Badge/Badge";
import styles from "./UserCard.module.scss";

const UserCard = ({
    user,
    showFollowButton = true,
    showStats = true,
    showBio = true,
    showMutualConnections = false,
    showReason = false,
    variant = "default", // default, compact, detailed
    onFollowChange,
    onFollow,
    className,
    ...props
}) => {
    const {
        id,
        username,
        name,
        avatar,
        bio,
        title,
        location,
        isVerified = false,
        isFollowing = false,
        stats = {},
        badges = [],
        mutualConnections,
        reason,
    } = user;

    const { postsCount = 0, followersCount = 0, followingCount = 0 } = stats;

    return (
        <div
            className={`${styles.userCard} ${styles[variant]} ${
                className || ""
            }`}
            {...props}
        >
            <div className={styles.header}>
                <Link to={`/profile/${username}`} className={styles.avatarLink}>
                    <div className={styles.avatarContainer}>
                        <FallbackImage
                            src={avatar}
                            alt={name}
                            className={styles.avatar}
                        />
                        {isVerified && (
                            <div className={styles.verifiedBadge}>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                </Link>

                {showFollowButton && (
                    <div className={styles.actions}>
                        <FollowButton
                            userId={id}
                            username={username}
                            isFollowing={isFollowing}
                            followerCount={followersCount}
                            variant="secondary"
                            size="sm"
                            onFollowChange={onFollowChange || onFollow}
                        />
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.userInfo}>
                    <Link
                        to={`/profile/${username}`}
                        className={styles.nameLink}
                    >
                        <h3 className={styles.name}>{name}</h3>
                    </Link>
                    <p className={styles.username}>@{username}</p>

                    {title && <p className={styles.title}>{title}</p>}

                    {location && (
                        <p className={styles.location}>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {location}
                        </p>
                    )}
                </div>

                {showBio && bio && variant !== "compact" && (
                    <p className={styles.bio}>{bio}</p>
                )}

                {showReason && reason && (
                    <p className={styles.reason}>💡 {reason}</p>
                )}

                {showMutualConnections &&
                    mutualConnections &&
                    mutualConnections > 0 && (
                        <p className={styles.mutualConnections}>
                            👥 {mutualConnections} mutual connection
                            {mutualConnections > 1 ? "s" : ""}
                        </p>
                    )}

                {badges.length > 0 && (
                    <div className={styles.badges}>
                        {badges.map((badge, index) => (
                            <Badge
                                key={index}
                                variant={badge.variant || "secondary"}
                                size="sm"
                            >
                                {badge.label}
                            </Badge>
                        ))}
                    </div>
                )}

                {showStats && (
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>
                                {postsCount}
                            </span>
                            <span className={styles.statLabel}>Posts</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>
                                {followersCount.toLocaleString()}
                            </span>
                            <span className={styles.statLabel}>Followers</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>
                                {followingCount}
                            </span>
                            <span className={styles.statLabel}>Following</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

UserCard.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        username: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        bio: PropTypes.string,
        title: PropTypes.string,
        location: PropTypes.string,
        isVerified: PropTypes.bool,
        isFollowing: PropTypes.bool,
        stats: PropTypes.shape({
            postsCount: PropTypes.number,
            followersCount: PropTypes.number,
            followingCount: PropTypes.number,
        }),
        badges: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                variant: PropTypes.string,
            })
        ),
        mutualConnections: PropTypes.number,
        reason: PropTypes.string,
    }).isRequired,
    showFollowButton: PropTypes.bool,
    showStats: PropTypes.bool,
    showBio: PropTypes.bool,
    showMutualConnections: PropTypes.bool,
    showReason: PropTypes.bool,
    variant: PropTypes.oneOf(["default", "compact", "detailed"]),
    onFollowChange: PropTypes.func,
    onFollow: PropTypes.func,
    className: PropTypes.string,
};

export default UserCard;
