import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AdvancedSearch from "../../components/AdvancedSearch/AdvancedSearch";
import SearchResults from "../../components/SearchResults/SearchResults";
import styles from "./Search.module.scss";

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [currentQuery, setCurrentQuery] = useState(
        searchParams.get("q") || ""
    );
    const [currentFilters, setCurrentFilters] = useState({
        contentType: searchParams.get("type") || "all",
        dateRange: searchParams.get("date") || "all",
        sortBy: searchParams.get("sort") || "relevance",
        author: searchParams.get("author") || "",
        tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
        minReadTime: searchParams.get("min_time") || "",
        maxReadTime: searchParams.get("max_time") || "",
        hasImages: searchParams.get("images") === "true",
        hasVideos: searchParams.get("videos") === "true",
        verified: searchParams.get("verified") === "true",
    });

    // Mock search results data
    const mockSearchResults = [
        // Posts
        {
            id: 1,
            type: "posts",
            title: "React Hooks: Complete Guide to State Management",
            content:
                "Learn how to effectively use React hooks for state management in modern applications...",
            author: {
                id: 1,
                username: "john_doe",
                name: "John Doe",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
                verified: true,
            },
            slug: "react-hooks-complete-guide",
            readTime: 8,
            publishedAt: "2024-01-15T10:00:00Z",
            likesCount: 245,
            commentsCount: 32,
            bookmarksCount: 89,
            tags: ["React", "JavaScript", "Frontend"],
            featuredImage:
                "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
            excerpt:
                "A comprehensive guide to using React hooks effectively...",
        },
        {
            id: 2,
            type: "posts",
            title: "CSS Grid vs Flexbox: When to Use Which",
            content:
                "Understanding the differences between CSS Grid and Flexbox and when to use each...",
            author: {
                id: 2,
                username: "sarah_dev",
                name: "Sarah Developer",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=40&h=40&fit=crop&crop=face",
                verified: false,
            },
            slug: "css-grid-vs-flexbox",
            readTime: 6,
            publishedAt: "2024-01-14T15:30:00Z",
            likesCount: 189,
            commentsCount: 25,
            bookmarksCount: 67,
            tags: ["CSS", "Layout", "Frontend"],
            featuredImage:
                "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=300&h=200&fit=crop",
            excerpt:
                "Learn when to use CSS Grid vs Flexbox for different layout scenarios...",
        },

        // Users
        {
            id: 3,
            type: "users",
            username: "alex_frontend",
            name: "Alex Frontend",
            bio: "Frontend developer passionate about React and Vue.js. Love creating beautiful user interfaces.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
            verified: true,
            followersCount: 1234,
            followingCount: 567,
            postsCount: 89,
            isFollowing: false,
            badges: ["Top Contributor", "React Expert"],
            location: "San Francisco, CA",
            website: "https://alexfrontend.dev",
            joinedAt: "2023-03-15T00:00:00Z",
        },
        {
            id: 4,
            type: "users",
            username: "design_guru",
            name: "Design Guru",
            bio: "UX/UI Designer with 10+ years of experience. Helping developers create better user experiences.",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
            verified: false,
            followersCount: 892,
            followingCount: 234,
            postsCount: 156,
            isFollowing: true,
            badges: ["Design Expert"],
            location: "New York, NY",
            website: "https://designguru.co",
            joinedAt: "2022-08-20T00:00:00Z",
        },

        // Topics
        {
            id: 5,
            type: "topics",
            name: "JavaScript",
            description:
                "Everything about JavaScript programming language, from basics to advanced concepts.",
            postCount: 2341,
            followerCount: 15678,
            isFollowing: true,
            icon: "🟨",
            trending: true,
        },
        {
            id: 6,
            type: "topics",
            name: "React",
            description:
                "React.js library discussions, tutorials, and best practices.",
            postCount: 1567,
            followerCount: 12345,
            isFollowing: false,
            icon: "⚛️",
            trending: true,
        },

        // Groups
        {
            id: 7,
            type: "groups",
            name: "Frontend Developers",
            description:
                "A community for frontend developers to share knowledge and discuss latest trends.",
            memberCount: 5678,
            privacy: "Public",
            avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=80&h=80&fit=crop",
            isMember: false,
            category: "Technology",
            activityLevel: "Very Active",
            recentActivity: "2 hours ago",
        },
        {
            id: 8,
            type: "groups",
            name: "React Developers",
            description:
                "Dedicated community for React developers of all skill levels.",
            memberCount: 3456,
            privacy: "Public",
            avatar: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=80&h=80&fit=crop",
            isMember: true,
            category: "Technology",
            activityLevel: "Active",
            recentActivity: "1 hour ago",
        },
    ];

    // Simulate search API call
    const performSearch = async (query, filters) => {
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Filter results based on query and filters
        let filteredResults = mockSearchResults;

        if (query.trim()) {
            filteredResults = filteredResults.filter((item) => {
                const searchText = `${item.title || item.name || ""} ${
                    item.content || item.description || item.bio || ""
                }`.toLowerCase();
                return searchText.includes(query.toLowerCase());
            });
        }

        if (filters.contentType !== "all") {
            filteredResults = filteredResults.filter(
                (item) => item.type === filters.contentType
            );
        }

        if (filters.author) {
            filteredResults = filteredResults.filter((item) =>
                item.author?.username
                    ?.toLowerCase()
                    .includes(filters.author.toLowerCase())
            );
        }

        if (filters.tags.length > 0) {
            filteredResults = filteredResults.filter((item) =>
                item.tags?.some((tag) =>
                    filters.tags.some((filterTag) =>
                        tag.toLowerCase().includes(filterTag.toLowerCase())
                    )
                )
            );
        }

        if (filters.verified) {
            filteredResults = filteredResults.filter(
                (item) =>
                    (item.type === "users" && item.verified) ||
                    (item.type === "posts" && item.author?.verified)
            );
        }

        // Sort results
        switch (filters.sortBy) {
            case "date":
                filteredResults.sort(
                    (a, b) =>
                        new Date(b.publishedAt || b.joinedAt || 0) -
                        new Date(a.publishedAt || a.joinedAt || 0)
                );
                break;
            case "popularity":
                filteredResults.sort(
                    (a, b) =>
                        (b.likesCount ||
                            b.followersCount ||
                            b.memberCount ||
                            0) -
                        (a.likesCount || a.followersCount || a.memberCount || 0)
                );
                break;
            case "alphabetical":
                filteredResults.sort((a, b) =>
                    (a.title || a.name || "").localeCompare(
                        b.title || b.name || ""
                    )
                );
                break;
            default: // relevance
                break;
        }

        setSearchResults(filteredResults);
        setTotalCount(filteredResults.length);
        setHasMore(false); // For demo purposes
        setIsLoading(false);
    };

    // Handle search
    const handleSearch = (query, filters) => {
        setCurrentQuery(query);
        setCurrentFilters(filters);

        // Update URL params
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (filters.contentType !== "all")
            params.set("type", filters.contentType);
        if (filters.dateRange !== "all") params.set("date", filters.dateRange);
        if (filters.sortBy !== "relevance") params.set("sort", filters.sortBy);
        if (filters.author) params.set("author", filters.author);
        if (filters.tags.length > 0) params.set("tags", filters.tags.join(","));
        if (filters.minReadTime) params.set("min_time", filters.minReadTime);
        if (filters.maxReadTime) params.set("max_time", filters.maxReadTime);
        if (filters.hasImages) params.set("images", "true");
        if (filters.hasVideos) params.set("videos", "true");
        if (filters.verified) params.set("verified", "true");

        setSearchParams(params);
        performSearch(query, filters);
    };

    // Handle filter change
    const handleFilterChange = (filters) => {
        setCurrentFilters(filters);
        if (currentQuery) {
            handleSearch(currentQuery, filters);
        }
    };

    // Handle result click
    const handleResultClick = (result) => {
        switch (result.type) {
            case "posts":
                window.location.href = `/blog/${result.slug}`;
                break;
            case "users":
                window.location.href = `/profile/${result.username}`;
                break;
            case "topics":
                window.location.href = `/topics/${result.name.toLowerCase()}`;
                break;
            case "groups":
                window.location.href = `/groups/${result.id}`;
                break;
            default:
                break;
        }
    };

    // Handle load more
    const handleLoadMore = () => {
        // Simulate loading more results
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setHasMore(false);
        }, 1000);
    };

    // Initial search if query exists in URL
    useEffect(() => {
        if (currentQuery) {
            performSearch(currentQuery, currentFilters);
        }
    }, []); // Only run on mount

    return (
        <div className={styles.searchPage}>
            <div className={styles.searchContainer}>
                {/* Search header */}
                <div className={styles.searchHeader}>
                    <h1 className={styles.pageTitle}>Search</h1>
                    <p className={styles.pageSubtitle}>
                        Find posts, users, topics, and groups across the
                        platform
                    </p>
                </div>

                {/* Advanced search component */}
                <div className={styles.searchSection}>
                    <AdvancedSearch
                        placeholder="Search posts, users, topics, groups..."
                        onSearch={handleSearch}
                        onFilterChange={handleFilterChange}
                        showFilters={true}
                        showSuggestions={true}
                        showHistory={true}
                        initialFilters={currentFilters}
                    />
                </div>

                {/* Search results */}
                <div className={styles.resultsSection}>
                    <SearchResults
                        query={currentQuery}
                        results={searchResults}
                        filters={currentFilters}
                        isLoading={isLoading}
                        totalCount={totalCount}
                        hasMore={hasMore}
                        onLoadMore={handleLoadMore}
                        onResultClick={handleResultClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default Search;
