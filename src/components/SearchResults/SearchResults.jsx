import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PostCard from "../PostCard/PostCard";
import UserCard from "../UserCard/UserCard";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import styles from "./SearchResults.module.scss";

const SearchResults = ({
    query = "",
    results = [],
    filters = {},
    isLoading = false,
    totalCount = 0,
    hasMore = false,
    onLoadMore,
    onResultClick,
    className,
    ...props
}) => {
    const [groupedResults, setGroupedResults] = useState({});
    const [activeTab, setActiveTab] = useState("all");

    // Group results by type
    useEffect(() => {
        const grouped = results.reduce((acc, result) => {
            const type = result.type || "posts";
            if (!acc[type]) acc[type] = [];
            acc[type].push(result);
            return acc;
        }, {});

        setGroupedResults(grouped);
    }, [results]);

    // Available tabs based on results
    const availableTabs = [
        { key: "all", label: "All", count: totalCount },
        {
            key: "posts",
            label: "Posts",
            count: groupedResults.posts?.length || 0,
        },
        {
            key: "users",
            label: "Users",
            count: groupedResults.users?.length || 0,
        },
        {
            key: "topics",
            label: "Topics",
            count: groupedResults.topics?.length || 0,
        },
        {
            key: "groups",
            label: "Groups",
            count: groupedResults.groups?.length || 0,
        },
    ].filter((tab) => tab.key === "all" || tab.count > 0);

    // Get filtered results based on active tab
    const getFilteredResults = () => {
        if (activeTab === "all") return results;
        return groupedResults[activeTab] || [];
    };

    // Handle result click
    const handleResultClick = (result) => {
        if (onResultClick) {
            onResultClick(result);
        }
    };

    // Render result item based on type
    const renderResultItem = (result, index) => {
        switch (result.type) {
            case "users":
                return (
                    <div
                        key={`user-${result.id}`}
                        className={styles.resultItem}
                    >
                        <UserCard
                            user={result}
                            showFollowButton={true}
                            onClick={() => handleResultClick(result)}
                        />
                    </div>
                );

            case "topics":
                return (
                    <div
                        key={`topic-${result.id}`}
                        className={`${styles.resultItem} ${styles.topicItem}`}
                        onClick={() => handleResultClick(result)}
                    >
                        <div className={styles.topicIcon}>#</div>
                        <div className={styles.topicContent}>
                            <h3 className={styles.topicName}>{result.name}</h3>
                            <p className={styles.topicDescription}>
                                {result.description}
                            </p>
                            <div className={styles.topicStats}>
                                <span className={styles.topicStat}>
                                    {result.postCount} posts
                                </span>
                                <span className={styles.topicStat}>
                                    {result.followerCount} followers
                                </span>
                            </div>
                        </div>
                        <button className={styles.followTopicButton}>
                            {result.isFollowing ? "Following" : "Follow"}
                        </button>
                    </div>
                );

            case "groups":
                return (
                    <div
                        key={`group-${result.id}`}
                        className={`${styles.resultItem} ${styles.groupItem}`}
                        onClick={() => handleResultClick(result)}
                    >
                        <img
                            src={result.avatar}
                            alt={result.name}
                            className={styles.groupAvatar}
                        />
                        <div className={styles.groupContent}>
                            <h3 className={styles.groupName}>{result.name}</h3>
                            <p className={styles.groupDescription}>
                                {result.description}
                            </p>
                            <div className={styles.groupStats}>
                                <span className={styles.groupStat}>
                                    {result.memberCount} members
                                </span>
                                <span className={styles.groupStat}>
                                    {result.privacy}
                                </span>
                            </div>
                        </div>
                        <button className={styles.joinGroupButton}>
                            {result.isMember ? "Leave" : "Join"}
                        </button>
                    </div>
                );

            case "posts":
            default:
                return (
                    <div
                        key={`post-${result.id}`}
                        className={styles.resultItem}
                    >
                        <PostCard
                            post={result}
                            onClick={() => handleResultClick(result)}
                        />
                    </div>
                );
        }
    };

    if (isLoading && results.length === 0) {
        return (
            <div
                className={`${styles.searchResults} ${className || ""}`}
                {...props}
            >
                <Loading size="large" message="Searching..." />
            </div>
        );
    }

    if (!isLoading && results.length === 0 && query) {
        return (
            <div
                className={`${styles.searchResults} ${className || ""}`}
                {...props}
            >
                <EmptyState
                    icon="🔍"
                    title="No results found"
                    description={`We couldn't find any results for "${query}". Try adjusting your search terms or filters.`}
                    actionText="Clear filters"
                    onActionClick={() => window.location.reload()}
                />
            </div>
        );
    }

    const filteredResults = getFilteredResults();

    return (
        <div
            className={`${styles.searchResults} ${className || ""}`}
            {...props}
        >
            {/* Search summary */}
            <div className={styles.searchSummary}>
                <h2 className={styles.summaryTitle}>
                    Search results for "{query}"
                </h2>
                <p className={styles.summaryText}>
                    Found {totalCount.toLocaleString()} results
                    {filters.contentType !== "all" &&
                        ` in ${filters.contentType}`}
                    {filters.dateRange !== "all" &&
                        ` from ${filters.dateRange}`}
                </p>
            </div>

            {/* Result tabs */}
            <div className={styles.resultTabs}>
                {availableTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`${styles.resultTab} ${
                            activeTab === tab.key ? styles.active : ""
                        }`}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={styles.tabCount}>{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Results list */}
            <div className={styles.resultsList}>
                {filteredResults.map((result, index) =>
                    renderResultItem(result, index)
                )}
            </div>

            {/* Load more */}
            {hasMore && (
                <div className={styles.loadMoreContainer}>
                    <button
                        onClick={onLoadMore}
                        disabled={isLoading}
                        className={styles.loadMoreButton}
                    >
                        {isLoading ? "Loading..." : "Load More Results"}
                    </button>
                </div>
            )}

            {/* Loading indicator for additional results */}
            {isLoading && results.length > 0 && (
                <div className={styles.loadingMore}>
                    <Loading size="small" message="Loading more results..." />
                </div>
            )}
        </div>
    );
};

SearchResults.propTypes = {
    query: PropTypes.string,
    results: PropTypes.arrayOf(PropTypes.object),
    filters: PropTypes.object,
    isLoading: PropTypes.bool,
    totalCount: PropTypes.number,
    hasMore: PropTypes.bool,
    onLoadMore: PropTypes.func,
    onResultClick: PropTypes.func,
    className: PropTypes.string,
};

export default SearchResults;
