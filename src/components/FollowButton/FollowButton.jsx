import { useState } from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import styles from "./FollowButton.module.scss";

const FollowButton = ({
    userId,
    username,
    isFollowing: initialIsFollowing = false,
    followerCount: initialFollowerCount = 0,
    variant = "primary",
    size = "md",
    showCount = false,
    onFollowChange,
    className,
    ...props
}) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [followerCount, setFollowerCount] = useState(initialFollowerCount);
    const [loading, setLoading] = useState(false);

    const handleFollowToggle = async () => {
        setLoading(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800));

            const newIsFollowing = !isFollowing;
            const newCount = newIsFollowing
                ? followerCount + 1
                : Math.max(0, followerCount - 1);

            setIsFollowing(newIsFollowing);
            setFollowerCount(newCount);

            // Call parent callback if provided
            if (onFollowChange) {
                onFollowChange({
                    userId,
                    username,
                    isFollowing: newIsFollowing,
                    followerCount: newCount,
                });
            }

            console.log(
                newIsFollowing
                    ? `Following ${username}`
                    : `Unfollowed ${username}`
            );
        } catch (error) {
            console.error("Failed to toggle follow:", error);
        } finally {
            setLoading(false);
        }
    };

    const getButtonVariant = () => {
        if (isFollowing) {
            return variant === "primary" ? "secondary" : "ghost";
        }
        return variant;
    };

    const getButtonText = () => {
        if (loading) {
            return isFollowing ? "Unfollowing..." : "Following...";
        }

        if (isFollowing) {
            return showCount ? `Following (${followerCount})` : "Following";
        }

        return showCount ? `Follow (${followerCount})` : "Follow";
    };

    return (
        <div className={`${styles.followButton} ${className || ""}`} {...props}>
            <Button
                variant={getButtonVariant()}
                size={size}
                loading={loading}
                onClick={handleFollowToggle}
                className={`${styles.button} ${
                    isFollowing ? styles.following : styles.notFollowing
                }`}
            >
                <span className={styles.buttonText}>{getButtonText()}</span>
                {isFollowing && (
                    <span className={styles.hoverText}>Unfollow</span>
                )}
            </Button>
        </div>
    );
};

FollowButton.propTypes = {
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    username: PropTypes.string.isRequired,
    isFollowing: PropTypes.bool,
    followerCount: PropTypes.number,
    variant: PropTypes.oneOf(["primary", "secondary", "ghost"]),
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    showCount: PropTypes.bool,
    onFollowChange: PropTypes.func,
    className: PropTypes.string,
};

export default FollowButton;
