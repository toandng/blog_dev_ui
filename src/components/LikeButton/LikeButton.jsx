import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./LikeButton.module.scss";

const LikeButton = ({
    postId,
    isLiked: initialIsLiked = false,
    likeCount: initialLikeCount = 0,
    showCount = true,
    size = "md",
    onLikeChange,
    className,
    disabled = false,
    ...props
}) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [loading, setLoading] = useState(false);
    const [animating, setAnimating] = useState(false);

    const handleLikeToggle = async () => {
        if (loading || disabled) return;

        setLoading(true);
        setAnimating(true);

        try {
            // Optimistic update
            const newIsLiked = !isLiked;
            const newCount = newIsLiked
                ? likeCount + 1
                : Math.max(0, likeCount - 1);

            setIsLiked(newIsLiked);
            setLikeCount(newCount);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Call parent callback if provided
            if (onLikeChange) {
                onLikeChange({
                    postId,
                    isLiked: newIsLiked,
                    likeCount: newCount,
                });
            }

            console.log(
                newIsLiked ? `Liked post ${postId}` : `Unliked post ${postId}`
            );
        } catch (error) {
            console.error("Failed to toggle like:", error);
            // Revert on error
            setIsLiked(!isLiked);
            setLikeCount(likeCount);
        } finally {
            setLoading(false);
            // Reset animation after a delay
            setTimeout(() => setAnimating(false), 600);
        }
    };

    const formatCount = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <button
            className={`
                ${styles.likeButton} 
                ${styles[size]} 
                ${isLiked ? styles.liked : styles.unliked}
                ${animating ? styles.animating : ""}
                ${loading ? styles.loading : ""}
                ${disabled ? styles.disabled : ""}
                ${className || ""}
            `}
            onClick={handleLikeToggle}
            disabled={disabled || loading}
            aria-label={isLiked ? "Unlike this post" : "Like this post"}
            aria-pressed={isLiked}
            {...props}
        >
            <div className={styles.iconContainer}>
                {/* Heart icon */}
                <svg
                    className={styles.heartIcon}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={isLiked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>

                {/* Animation hearts */}
                {animating && isLiked && (
                    <div className={styles.animationHearts}>
                        {[...Array(6)].map((_, i) => (
                            <svg
                                key={i}
                                className={`${styles.animationHeart} ${
                                    styles[`heart${i + 1}`]
                                }`}
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        ))}
                    </div>
                )}
            </div>

            {showCount && (
                <span className={styles.count}>{formatCount(likeCount)}</span>
            )}
        </button>
    );
};

LikeButton.propTypes = {
    postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    isLiked: PropTypes.bool,
    likeCount: PropTypes.number,
    showCount: PropTypes.bool,
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    onLikeChange: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default LikeButton;
