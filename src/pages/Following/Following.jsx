import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import UserList from "../../components/UserList/UserList";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import styles from "./Following.module.scss";

// Mock data - different from followers to show variety
const mockFollowing = [
    {
        id: 10,
        username: "jessica-tang",
        name: "Jessica Tang",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        bio: "Tech Lead at Google. Passionate about machine learning and scalable systems.",
        title: "Senior Tech Lead",
        location: "Mountain View, CA",
        isVerified: true,
        isFollowing: true,
        stats: {
            postsCount: 89,
            followersCount: 5200,
            followingCount: 320,
        },
        badges: [
            { label: "Google", variant: "primary" },
            { label: "ML Expert", variant: "info" },
        ],
    },
    {
        id: 11,
        username: "ryan-cooper",
        name: "Ryan Cooper",
        avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
        bio: "Indie game developer and Unity expert. Creating immersive gaming experiences.",
        title: "Game Developer",
        location: "Portland, OR",
        isVerified: false,
        isFollowing: true,
        stats: {
            postsCount: 156,
            followersCount: 3400,
            followingCount: 890,
        },
    },
    {
        id: 12,
        username: "maria-santos",
        name: "Maria Santos",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
        bio: "Blockchain developer and cryptocurrency enthusiast. Building the decentralized future.",
        title: "Blockchain Developer",
        location: "Miami, FL",
        isVerified: true,
        isFollowing: true,
        stats: {
            postsCount: 73,
            followersCount: 2800,
            followingCount: 450,
        },
        badges: [{ label: "Crypto Expert", variant: "warning" }],
    },
    {
        id: 13,
        username: "tom-anderson",
        name: "Tom Anderson",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
        bio: "Data scientist specializing in AI and predictive analytics for healthcare.",
        title: "Principal Data Scientist",
        location: "Boston, MA",
        isVerified: false,
        isFollowing: true,
        stats: {
            postsCount: 67,
            followersCount: 1900,
            followingCount: 280,
        },
    },
    {
        id: 14,
        username: "anna-lee",
        name: "Anna Lee",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        bio: "Cybersecurity expert and ethical hacker. Keeping the digital world safe.",
        title: "Senior Security Engineer",
        location: "Washington, DC",
        isVerified: true,
        isFollowing: true,
        stats: {
            postsCount: 45,
            followersCount: 1500,
            followingCount: 180,
        },
        badges: [{ label: "Security Expert", variant: "error" }],
    },
    {
        id: 15,
        username: "carlos-rivera",
        name: "Carlos Rivera",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        bio: "Technical writer and developer advocate. Making complex tech accessible to everyone.",
        title: "Developer Advocate",
        location: "Barcelona, Spain",
        isVerified: false,
        isFollowing: true,
        stats: {
            postsCount: 234,
            followersCount: 4100,
            followingCount: 650,
        },
    },
];

const Following = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const [following, setFollowing] = useState([]);
    const [filteredFollowing, setFilteredFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [layout, setLayout] = useState("grid");
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [profileInfo, setProfileInfo] = useState({
        username: username,
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        followingCount: 180,
    });

    useEffect(() => {
        loadFollowing();
    }, [username]);

    useEffect(() => {
        // Filter following based on search query
        if (searchQuery.trim() === "") {
            setFilteredFollowing(following);
        } else {
            const filtered = following.filter(
                (user) =>
                    user.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    user.username
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredFollowing(filtered);
        }
    }, [searchQuery, following]);

    const loadFollowing = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setFollowing(mockFollowing);
            setFilteredFollowing(mockFollowing);
        } catch (error) {
            console.error("Failed to load following:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        setLoadingMore(true);
        try {
            // Simulate loading more following
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // In real app, load more data from API
            setHasMore(false); // No more data for demo
        } catch (error) {
            console.error("Failed to load more following:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleFollowChange = (followData) => {
        if (followData.isFollowing) {
            // User followed someone new - don't remove from list
            setFollowing((prev) =>
                prev.map((user) =>
                    user.id === followData.userId
                        ? { ...user, isFollowing: followData.isFollowing }
                        : user
                )
            );
        } else {
            // User unfollowed someone - remove from following list
            setFollowing((prev) =>
                prev.filter((user) => user.id !== followData.userId)
            );
            setFilteredFollowing((prev) =>
                prev.filter((user) => user.id !== followData.userId)
            );

            // Update profile following count
            setProfileInfo((prev) => ({
                ...prev,
                followingCount: Math.max(0, prev.followingCount - 1),
            }));
        }

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
                                {profileInfo.name}&apos;s Following
                            </h1>
                            <p className={styles.subtitle}>
                                {profileInfo.followingCount.toLocaleString()}{" "}
                                following
                                {searchQuery &&
                                    ` • ${filteredFollowing.length} results`}
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
                                    placeholder="Search following..."
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
                        users={filteredFollowing}
                        loading={loading}
                        layout={layout}
                        showFollowButtons={true}
                        showStats={true}
                        showBio={true}
                        emptyStateConfig={{
                            icon: "👤",
                            title: searchQuery
                                ? "No users found"
                                : "Not following anyone",
                            description: searchQuery
                                ? `No users match "${searchQuery}"`
                                : "Start discovering and following interesting people!",
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

export default Following;
