import { useState } from "react";
import PropTypes from "prop-types";
import UserCard from "../UserCard/UserCard";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import Button from "../Button/Button";
import styles from "./UserList.module.scss";

const UserList = ({
    users = [],
    loading = false,
    layout = "grid", // grid, list, compact
    showFollowButtons = true,
    showStats = true,
    showBio = true,
    emptyStateConfig = {},
    onFollowChange,
    onLoadMore,
    hasMore = false,
    loadingMore = false,
    className,
    ...props
}) => {
    const [loadingItems, setLoadingItems] = useState(new Set());

    const handleFollowChange = (followData) => {
        // Update local loading state
        setLoadingItems((prev) => {
            const newSet = new Set(prev);
            newSet.add(followData.userId);
            setTimeout(() => {
                setLoadingItems((current) => {
                    const updated = new Set(current);
                    updated.delete(followData.userId);
                    return updated;
                });
            }, 500);
            return newSet;
        });

        // Call parent callback
        if (onFollowChange) {
            onFollowChange(followData);
        }
    };

    const getCardVariant = () => {
        switch (layout) {
            case "compact":
                return "compact";
            case "list":
                return "default";
            case "grid":
            default:
                return "default";
        }
    };

    const defaultEmptyState = {
        icon: "👥",
        title: "No users found",
        description: "There are no users to display at the moment.",
        ...emptyStateConfig,
    };

    if (loading && users.length === 0) {
        return (
            <div className={`${styles.userList} ${className || ""}`} {...props}>
                <div className={`${styles.container} ${styles[layout]}`}>
                    <Loading size="lg" text="Loading users..." />
                </div>
            </div>
        );
    }

    if (!loading && users.length === 0) {
        return (
            <div className={`${styles.userList} ${className || ""}`} {...props}>
                <EmptyState
                    icon={defaultEmptyState.icon}
                    title={defaultEmptyState.title}
                    description={defaultEmptyState.description}
                    action={defaultEmptyState.action}
                />
            </div>
        );
    }

    return (
        <div className={`${styles.userList} ${className || ""}`} {...props}>
            <div className={`${styles.container} ${styles[layout]}`}>
                {users.map((user) => (
                    <UserCard
                        key={user.id}
                        user={{
                            ...user,
                            // Add loading state for this specific user
                            isLoading: loadingItems.has(user.id),
                        }}
                        variant={getCardVariant()}
                        showFollowButton={showFollowButtons}
                        showStats={showStats}
                        showBio={showBio}
                        onFollowChange={handleFollowChange}
                        className={styles.userCard}
                    />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className={styles.loadMore}>
                    <Button
                        variant="ghost"
                        size="lg"
                        loading={loadingMore}
                        onClick={onLoadMore}
                        disabled={loadingMore}
                    >
                        {loadingMore ? "Loading..." : "Load More Users"}
                    </Button>
                </div>
            )}

            {/* Loading More Indicator */}
            {loadingMore && (
                <div className={styles.loadingMore}>
                    <Loading size="md" text="Loading more users..." />
                </div>
            )}
        </div>
    );
};

UserList.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
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
            stats: PropTypes.object,
        })
    ),
    loading: PropTypes.bool,
    layout: PropTypes.oneOf(["grid", "list", "compact"]),
    showFollowButtons: PropTypes.bool,
    showStats: PropTypes.bool,
    showBio: PropTypes.bool,
    emptyStateConfig: PropTypes.shape({
        icon: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        action: PropTypes.node,
    }),
    onFollowChange: PropTypes.func,
    onLoadMore: PropTypes.func,
    hasMore: PropTypes.bool,
    loadingMore: PropTypes.bool,
    className: PropTypes.string,
};

export default UserList;
