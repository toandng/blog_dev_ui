import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import Badge from "../../components/Badge/Badge";
import LikeButton from "../../components/LikeButton/LikeButton";
import styles from "./LikedPosts.module.scss";

// Mock data for liked posts
const mockLikedPosts = [
    {
        id: 1,
        title: "Advanced React Patterns You Should Know",
        excerpt:
            "Exploring higher-order components, render props, and compound components for better React applications.",
        slug: "advanced-react-patterns-you-should-know",
        coverImage:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
        author: {
            id: 1,
            name: "Alex Rodriguez",
            username: "alex-rodriguez",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        },
        publishedAt: "2024-01-15T10:30:00Z",
        readingTime: "8 min read",
        stats: {
            views: 2847,
            likes: 156,
            comments: 23,
        },
        topics: ["React", "JavaScript", "Frontend"],
        isLiked: true,
        likedAt: "2024-01-20T14:20:00Z",
    },
    {
        id: 2,
        title: "Building Scalable Node.js APIs",
        excerpt:
            "Best practices for creating maintainable and performant backend services with Node.js and Express.",
        slug: "building-scalable-nodejs-apis",
        coverImage:
            "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
        author: {
            id: 2,
            name: "Sarah Chen",
            username: "sarah-chen",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        },
        publishedAt: "2024-01-10T15:45:00Z",
        readingTime: "12 min read",
        stats: {
            views: 1923,
            likes: 89,
            comments: 15,
        },
        topics: ["Node.js", "API", "Backend"],
        isLiked: true,
        likedAt: "2024-01-18T09:15:00Z",
    },
    {
        id: 3,
        title: "CSS Grid vs Flexbox: When to Use What",
        excerpt:
            "A comprehensive guide to choosing between CSS Grid and Flexbox for your layout needs.",
        slug: "css-grid-vs-flexbox-when-to-use-what",
        coverImage:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
        author: {
            id: 3,
            name: "Mike Johnson",
            username: "mike-johnson",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
        publishedAt: "2024-01-08T11:20:00Z",
        readingTime: "6 min read",
        stats: {
            views: 3456,
            likes: 234,
            comments: 45,
        },
        topics: ["CSS", "Layout", "Design"],
        isLiked: true,
        likedAt: "2024-01-16T16:30:00Z",
    },
    {
        id: 4,
        title: "JavaScript ES2024: New Features Overview",
        excerpt:
            "Exploring the latest JavaScript features and improvements introduced in ES2024.",
        slug: "javascript-es2024-new-features-overview",
        coverImage:
            "https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=800&h=400&fit=crop",
        author: {
            id: 4,
            name: "Emma Wilson",
            username: "emma-wilson",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        },
        publishedAt: "2024-01-05T09:00:00Z",
        readingTime: "10 min read",
        stats: {
            views: 5241,
            likes: 387,
            comments: 67,
        },
        topics: ["JavaScript", "ES2024", "Features"],
        isLiked: true,
        likedAt: "2024-01-12T13:45:00Z",
    },
];

const LikedPosts = () => {
    const navigate = useNavigate();

    const [likedPosts, setLikedPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [sortBy, setSortBy] = useState("recent"); // recent, title, author

    useEffect(() => {
        loadLikedPosts();
    }, []);

    useEffect(() => {
        filterAndSortPosts();
    }, [searchQuery, selectedTopic, sortBy, likedPosts]);

    const loadLikedPosts = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setLikedPosts(mockLikedPosts);
        } catch (error) {
            console.error("Failed to load liked posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortPosts = () => {
        let filtered = [...likedPosts];

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(
                (post) =>
                    post.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    post.excerpt
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    post.author.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    post.topics.some((topic) =>
                        topic.toLowerCase().includes(searchQuery.toLowerCase())
                    )
            );
        }

        // Filter by topic
        if (selectedTopic) {
            filtered = filtered.filter((post) =>
                post.topics.includes(selectedTopic)
            );
        }

        // Sort posts
        switch (sortBy) {
            case "title":
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "author":
                filtered.sort((a, b) =>
                    a.author.name.localeCompare(b.author.name)
                );
                break;
            case "likes":
                filtered.sort((a, b) => b.stats.likes - a.stats.likes);
                break;
            case "recent":
            default:
                filtered.sort(
                    (a, b) => new Date(b.likedAt) - new Date(a.likedAt)
                );
                break;
        }

        setFilteredPosts(filtered);
    };

    const handleUnlike = (postId) => {
        setLikedPosts((prev) => prev.filter((post) => post.id !== postId));
    };

    const handleLikeChange = (likeData) => {
        if (!likeData.isLiked) {
            handleUnlike(likeData.postId);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const clearTopic = () => {
        setSelectedTopic("");
    };

    // Get unique topics for filter
    const availableTopics = [
        ...new Set(likedPosts.flatMap((post) => post.topics)),
    ].sort();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className="container">
                    <Loading size="lg" text="Loading your liked posts..." />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className={styles.backButton}
                    >
                        ← Back
                    </Button>

                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Liked Posts</h1>
                        <p className={styles.subtitle}>
                            {likedPosts.length} posts you&apos;ve liked
                            {searchQuery || selectedTopic
                                ? ` • ${filteredPosts.length} results`
                                : ""}
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <Card className={styles.controls}>
                    <div className={styles.controlsContent}>
                        <div className={styles.searchSection}>
                            <div className={styles.searchInput}>
                                <svg
                                    className={styles.searchIcon}
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <Input
                                    placeholder="Search liked posts..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                {searchQuery && (
                                    <button
                                        className={styles.clearButton}
                                        onClick={clearSearch}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            <div className={styles.topicFilter}>
                                <select
                                    value={selectedTopic}
                                    onChange={(e) =>
                                        setSelectedTopic(e.target.value)
                                    }
                                    className={styles.topicSelect}
                                >
                                    <option value="">All Topics</option>
                                    {availableTopics.map((topic) => (
                                        <option key={topic} value={topic}>
                                            {topic}
                                        </option>
                                    ))}
                                </select>
                                {selectedTopic && (
                                    <button
                                        className={styles.clearButton}
                                        onClick={clearTopic}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={styles.sortSection}>
                            <span className={styles.sortLabel}>Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={styles.sortSelect}
                            >
                                <option value="recent">Recently Liked</option>
                                <option value="title">Title</option>
                                <option value="author">Author</option>
                                <option value="likes">Most Liked</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Results */}
                <div className={styles.results}>
                    {filteredPosts.length > 0 ? (
                        <div className={styles.postsGrid}>
                            {filteredPosts.map((post) => (
                                <Card key={post.id} className={styles.postCard}>
                                    <div className={styles.postHeader}>
                                        <div className={styles.likeInfo}>
                                            <span className={styles.likeLabel}>
                                                Liked on
                                            </span>
                                            <span className={styles.likeDate}>
                                                {formatDate(post.likedAt)}
                                            </span>
                                        </div>
                                        <LikeButton
                                            postId={post.id}
                                            isLiked={post.isLiked}
                                            likeCount={post.stats.likes}
                                            size="sm"
                                            onLikeChange={handleLikeChange}
                                        />
                                    </div>

                                    <div className={styles.postContent}>
                                        {post.coverImage && (
                                            <div
                                                className={
                                                    styles.imageContainer
                                                }
                                            >
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    className={
                                                        styles.coverImage
                                                    }
                                                />
                                            </div>
                                        )}

                                        <h3 className={styles.postTitle}>
                                            <a href={`/blog/${post.slug}`}>
                                                {post.title}
                                            </a>
                                        </h3>

                                        <p className={styles.postExcerpt}>
                                            {post.excerpt}
                                        </p>

                                        <div className={styles.postMeta}>
                                            <div className={styles.author}>
                                                <img
                                                    src={post.author.avatar}
                                                    alt={post.author.name}
                                                    className={
                                                        styles.authorAvatar
                                                    }
                                                />
                                                <span
                                                    className={
                                                        styles.authorName
                                                    }
                                                >
                                                    {post.author.name}
                                                </span>
                                            </div>

                                            <div className={styles.postStats}>
                                                <span>{post.readingTime}</span>
                                                <span>•</span>
                                                <span>
                                                    {formatDate(
                                                        post.publishedAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.topics}>
                                            {post.topics.map((topic) => (
                                                <Badge
                                                    key={topic}
                                                    variant="secondary"
                                                    size="sm"
                                                >
                                                    {topic}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon="💔"
                            title={
                                searchQuery || selectedTopic
                                    ? "No posts found"
                                    : "No liked posts yet"
                            }
                            description={
                                searchQuery || selectedTopic
                                    ? "Try adjusting your search or filter criteria"
                                    : "Start exploring and liking posts you find interesting!"
                            }
                            action={
                                <Button
                                    variant="primary"
                                    onClick={() => navigate("/")}
                                >
                                    Explore Posts
                                </Button>
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LikedPosts;
