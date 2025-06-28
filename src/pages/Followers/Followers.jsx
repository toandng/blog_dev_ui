import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import UserList from "../../components/UserList/UserList";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import styles from "./Followers.module.scss";

// Mock data
const mockFollowers = [
    {
        id: 1,
        username: "alex-rodriguez",
        name: "Alex Rodriguez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        bio: "Full-stack developer passionate about React and Node.js. Building the future one component at a time.",
        title: "Senior Frontend Developer",
        location: "San Francisco, CA",
        isVerified: true,
        isFollowing: false,
        stats: {
            postsCount: 42,
            followersCount: 1200,
            followingCount: 180,
        },
        badges: [
            { label: "Early Adopter", variant: "primary" },
            { label: "Top Contributor", variant: "success" },
        ],
    },
    {
        id: 2,
        username: "sarah-chen",
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        bio: "UX Designer & Frontend Developer. Love creating beautiful and functional interfaces.",
        title: "UX/UI Designer",
        location: "New York, NY",
        isVerified: false,
        isFollowing: true,
        stats: {
            postsCount: 28,
            followersCount: 850,
            followingCount: 95,
        },
    },
    {
        id: 3,
        username: "mike-johnson",
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        bio: "DevOps Engineer specializing in cloud infrastructure and automation.",
        title: "DevOps Engineer",
        location: "Seattle, WA",
        isVerified: true,
        isFollowing: false,
        stats: {
            postsCount: 35,
            followersCount: 650,
            followingCount: 120,
        },
        badges: [{ label: "Cloud Expert", variant: "info" }],
    },
    {
        id: 4,
        username: "emma-wilson",
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        bio: "Product Manager with a passion for user-centered design and agile methodologies.",
        title: "Senior Product Manager",
        location: "Austin, TX",
        isVerified: false,
        isFollowing: true,
        stats: {
            postsCount: 18,
            followersCount: 420,
            followingCount: 78,
        },
    },
    {
        id: 5,
        username: "david-kim",
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        bio: "Mobile app developer focused on React Native and cross-platform solutions.",
        title: "Mobile Developer",
        location: "Los Angeles, CA",
        isVerified: true,
        isFollowing: false,
        stats: {
            postsCount: 51,
            followersCount: 980,
            followingCount: 145,
        },
    },
];

const Followers = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const [followers, setFollowers] = useState([]);
    const [filteredFollowers, setFilteredFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [layout, setLayout] = useState("grid");
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [profileInfo] = useState({
        username: username,
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        followersCount: 1250,
    });

    useEffect(() => {
        loadFollowers();
    }, [username]);

    useEffect(() => {
        // Filter followers based on search query
        if (searchQuery.trim() === "") {
            setFilteredFollowers(followers);
        } else {
            const filtered = followers.filter(
                (follower) =>
                    follower.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    follower.username
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    follower.bio
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
            setFilteredFollowers(filtered);
        }
    }, [searchQuery, followers]);

    const loadFollowers = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setFollowers(mockFollowers);
            setFilteredFollowers(mockFollowers);
        } catch (error) {
            console.error("Failed to load followers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        setLoadingMore(true);
        try {
            // Simulate loading more followers
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // In real app, load more data from API
            setHasMore(false); // No more data for demo
        } catch (error) {
            console.error("Failed to load more followers:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleFollowChange = (followData) => {
        // Update follower's following status
        setFollowers((prev) =>
            prev.map((follower) =>
                follower.id === followData.userId
                    ? { ...follower, isFollowing: followData.isFollowing }
                    : follower
            )
        );

        console.log("Follow status changed:", followData);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className={styles.container}>
            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <Button
                        variant="ghost"
                        onClick={() => navigate(`/profile/${username}`)}
                        className={styles.backButton}
                    >
                        ← Back to Profile
                    </Button>

                    <div className={styles.profileInfo}>
                        <div className={styles.avatarContainer}>
                            <img
                                src={profileInfo.avatar}
                                alt={profileInfo.name}
                                className={styles.avatar}
                            />
                        </div>
                        <div className={styles.info}>
                            <h1 className={styles.title}>
                                {profileInfo.name}&apos;s Followers
                            </h1>
                            <p className={styles.subtitle}>
                                {profileInfo.followersCount.toLocaleString()}{" "}
                                followers
                                {searchQuery &&
                                    ` • ${filteredFollowers.length} results`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <Card className={styles.controls}>
                    <div className={styles.controlsContent}>
                        <div className={styles.searchContainer}>
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
                                    placeholder="Search followers..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                {searchQuery && (
                                    <button
                                        className={styles.clearSearch}
                                        onClick={clearSearch}
                                        aria-label="Clear search"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={styles.layoutControls}>
                            <span className={styles.layoutLabel}>View:</span>
                            <div className={styles.layoutButtons}>
                                <button
                                    className={`${styles.layoutButton} ${
                                        layout === "grid" ? styles.active : ""
                                    }`}
                                    onClick={() => setLayout("grid")}
                                    aria-label="Grid view"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                    >
                                        <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3A1.5 1.5 0 0115 10.5v3A1.5 1.5 0 0113.5 15h-3A1.5 1.5 0 019 13.5v-3z" />
                                    </svg>
                                </button>
                                <button
                                    className={`${styles.layoutButton} ${
                                        layout === "list" ? styles.active : ""
                                    }`}
                                    onClick={() => setLayout("list")}
                                    aria-label="List view"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className={`${styles.layoutButton} ${
                                        layout === "compact"
                                            ? styles.active
                                            : ""
                                    }`}
                                    onClick={() => setLayout("compact")}
                                    aria-label="Compact view"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                    >
                                        <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Results */}
                <div className={styles.results}>
                    <UserList
                        users={filteredFollowers}
                        loading={loading}
                        layout={layout}
                        showFollowButtons={true}
                        showStats={true}
                        showBio={true}
                        emptyStateConfig={{
                            icon: "👥",
                            title: searchQuery
                                ? "No followers found"
                                : "No followers yet",
                            description: searchQuery
                                ? `No followers match "${searchQuery}"`
                                : "This user doesn't have any followers yet.",
                        }}
                        onFollowChange={handleFollowChange}
                        onLoadMore={handleLoadMore}
                        hasMore={hasMore}
                        loadingMore={loadingMore}
                    />
                </div>
            </div>
        </div>
    );
};

export default Followers;
