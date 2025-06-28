import { useState, useMemo } from "react";
import GroupCard from "../../components/GroupCard/GroupCard";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import EmptyState from "../../components/EmptyState/EmptyState";
import styles from "./Groups.module.scss";

const Groups = () => {
    // Mock current user
    const currentUser = {
        id: 1,
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    };

    // Mock groups data
    const [groups] = useState([
        {
            id: 1,
            name: "React Developers",
            description:
                "A community for React developers to share knowledge and grow together.",
            avatar: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop",
            privacy: "public",
            memberCount: 15420,
            ownerId: 5,
            categories: ["JavaScript", "Web Development", "Frontend"],
            recentActivity: { postsThisWeek: 45, activeMembers: 856 },
            lastPost: { createdAt: "2024-01-15T10:30:00Z" },
        },
        {
            id: 2,
            name: "UX/UI Designers",
            description:
                "Where creativity meets functionality. Share your designs, get feedback, and learn from fellow designers.",
            avatar: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=100&h=100&fit=crop",
            coverImage:
                "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=200&fit=crop",
            privacy: "public",
            memberCount: 8340,
            ownerId: 6,
            members: [
                {
                    id: 7,
                    name: "Lisa Park",
                    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face",
                },
                {
                    id: 8,
                    name: "David Kim",
                    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=50&h=50&fit=crop&crop=face",
                },
                {
                    id: 9,
                    name: "Maya Patel",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face",
                },
            ],
            categories: ["Design", "UI/UX", "Creative"],
            recentActivity: {
                postsThisWeek: 28,
                activeMembers: 423,
            },
            lastPost: {
                createdAt: "2024-01-14T16:45:00Z",
            },
        },
        {
            id: 3,
            name: "Startup Founders",
            description:
                "Connect with fellow entrepreneurs, share experiences, and build the future together.",
            avatar: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&h=100&fit=crop",
            privacy: "private",
            memberCount: 2840,
            ownerId: 1,
            members: [
                {
                    id: 1,
                    name: "John Doe",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
                },
                {
                    id: 10,
                    name: "Rachel Green",
                    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=50&h=50&fit=crop&crop=face",
                },
            ],
            categories: ["Business", "Entrepreneurship", "Startups"],
            recentActivity: {
                postsThisWeek: 12,
                activeMembers: 178,
            },
            lastPost: {
                createdAt: "2024-01-13T14:20:00Z",
            },
        },
        {
            id: 4,
            name: "Product Managers Unite",
            description:
                "Best practices, career advice, and product strategy discussions for PMs at all levels.",
            avatar: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop",
            coverImage:
                "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=200&fit=crop",
            privacy: "public",
            memberCount: 12750,
            ownerId: 11,
            members: [
                {
                    id: 11,
                    name: "Tom Wilson",
                    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=50&h=50&fit=crop&crop=face",
                },
                {
                    id: 12,
                    name: "Anna Lee",
                    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=50&h=50&fit=crop&crop=face",
                },
            ],
            categories: ["Product Management", "Strategy", "Business"],
            recentActivity: {
                postsThisWeek: 18,
                activeMembers: 245,
            },
            lastPost: {
                createdAt: "2024-01-12T11:15:00Z",
            },
        },
        {
            id: 5,
            name: "DevOps & Cloud",
            description:
                "Infrastructure, automation, and cloud technologies. Share your DevOps knowledge and learn from experts.",
            avatar: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&h=100&fit=crop",
            privacy: "public",
            memberCount: 9680,
            ownerId: 13,
            members: [
                {
                    id: 13,
                    name: "Chris Martin",
                    avatar: "https://images.unsplash.com/photo-1507919909716-c8262e491cde?w=50&h=50&fit=crop&crop=face",
                },
                {
                    id: 14,
                    name: "Zara Ahmed",
                    avatar: "https://images.unsplash.com/photo-1488508872907-592763824245?w=50&h=50&fit=crop&crop=face",
                },
            ],
            categories: ["DevOps", "Cloud", "Infrastructure"],
            recentActivity: {
                postsThisWeek: 31,
                activeMembers: 387,
            },
            lastPost: {
                createdAt: "2024-01-15T08:30:00Z",
            },
        },
        {
            id: 6,
            name: "Women in Tech",
            description:
                "Empowering women in technology through mentorship, networking, and career development.",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
            coverImage:
                "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop",
            privacy: "public",
            memberCount: 18250,
            ownerId: 15,
            members: [
                {
                    id: 15,
                    name: "Jennifer Liu",
                    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face",
                },
                {
                    id: 16,
                    name: "Sofia Garcia",
                    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop&crop=face",
                },
            ],
            categories: ["Women in Tech", "Career", "Mentorship"],
            recentActivity: {
                postsThisWeek: 52,
                activeMembers: 1234,
            },
            lastPost: {
                createdAt: "2024-01-15T15:20:00Z",
            },
        },
    ]);

    // State for filters and search
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [privacyFilter, setPrivacyFilter] = useState("all");
    const [activityFilter, setActivityFilter] = useState("all");
    const [sortBy, setSortBy] = useState("members"); // members, activity, recent
    const [layout, setLayout] = useState("grid"); // grid, list

    // Extract all unique categories
    const allCategories = useMemo(() => {
        const categories = new Set();
        groups.forEach((group) => {
            group.categories?.forEach((cat) => categories.add(cat));
        });
        return Array.from(categories).sort();
    }, [groups]);

    // Filter and sort groups
    const filteredGroups = useMemo(() => {
        let filtered = groups;

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (group) =>
                    group.name.toLowerCase().includes(query) ||
                    group.description.toLowerCase().includes(query) ||
                    group.categories?.some((cat) =>
                        cat.toLowerCase().includes(query)
                    )
            );
        }

        // Category filter
        if (categoryFilter !== "all") {
            filtered = filtered.filter((group) =>
                group.categories?.includes(categoryFilter)
            );
        }

        // Privacy filter
        if (privacyFilter !== "all") {
            filtered = filtered.filter(
                (group) => group.privacy === privacyFilter
            );
        }

        // Activity filter
        if (activityFilter !== "all") {
            filtered = filtered.filter((group) => {
                const postsThisWeek = group.recentActivity?.postsThisWeek || 0;
                switch (activityFilter) {
                    case "high":
                        return postsThisWeek >= 30;
                    case "medium":
                        return postsThisWeek >= 10 && postsThisWeek < 30;
                    case "low":
                        return postsThisWeek < 10;
                    default:
                        return true;
                }
            });
        }

        // Sort groups
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "members":
                    return b.memberCount - a.memberCount;
                case "activity":
                    return (
                        (b.recentActivity?.postsThisWeek || 0) -
                        (a.recentActivity?.postsThisWeek || 0)
                    );
                case "recent":
                    return (
                        new Date(b.lastPost?.createdAt || 0) -
                        new Date(a.lastPost?.createdAt || 0)
                    );
                default:
                    return 0;
            }
        });
    }, [
        groups,
        searchQuery,
        categoryFilter,
        privacyFilter,
        activityFilter,
        sortBy,
    ]);

    // Handle group actions
    const handleJoinGroup = async (group) => {
        console.log("Joining group:", group.name);
        // Simulate API call
        return new Promise((resolve) => setTimeout(resolve, 1000));
    };

    const handleLeaveGroup = async (group) => {
        console.log("Leaving group:", group.name);
        // Simulate API call
        return new Promise((resolve) => setTimeout(resolve, 1000));
    };

    const handleViewGroup = (group) => {
        console.log("Viewing group:", group.name);
        // Navigate to group detail page
    };

    const handleCreateGroup = () => {
        console.log("Creating new group");
        // Navigate to create group page or open modal
    };

    return (
        <div className={styles.groupsPage}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <h1 className={styles.pageTitle}>Discover Groups</h1>
                    <p className={styles.pageDescription}>
                        Join communities that match your interests and connect
                        with like-minded people.
                    </p>
                    <Button
                        variant="primary"
                        onClick={handleCreateGroup}
                        className={styles.createButton}
                    >
                        Create Group
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className={styles.filtersSection}>
                <div className={styles.searchContainer}>
                    <Input
                        type="text"
                        placeholder="Search groups..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filterTabs}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Category:</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Categories</option>
                            {allCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Privacy:</label>
                        <select
                            value={privacyFilter}
                            onChange={(e) => setPrivacyFilter(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Groups</option>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Activity:</label>
                        <select
                            value={activityFilter}
                            onChange={(e) => setActivityFilter(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Activity</option>
                            <option value="high">
                                Very Active (30+ posts/week)
                            </option>
                            <option value="medium">
                                Active (10-29 posts/week)
                            </option>
                            <option value="low">
                                Quiet (&lt;10 posts/week)
                            </option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="members">Most Members</option>
                            <option value="activity">Most Active</option>
                            <option value="recent">Recent Activity</option>
                        </select>
                    </div>

                    <div className={styles.layoutToggle}>
                        <Button
                            variant={layout === "grid" ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setLayout("grid")}
                            className={styles.layoutButton}
                        >
                            Grid
                        </Button>
                        <Button
                            variant={layout === "list" ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setLayout("list")}
                            className={styles.layoutButton}
                        >
                            List
                        </Button>
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className={styles.resultsSection}>
                <div className={styles.resultsHeader}>
                    <h2 className={styles.resultsTitle}>
                        {filteredGroups.length} Groups Found
                    </h2>
                    {searchQuery && (
                        <Badge
                            variant="secondary"
                            className={styles.searchBadge}
                        >
                            Searching for: "{searchQuery}"
                        </Badge>
                    )}
                </div>

                {/* Applied Filters */}
                <div className={styles.appliedFilters}>
                    {categoryFilter !== "all" && (
                        <Badge
                            variant="primary"
                            className={styles.filterBadge}
                            onClick={() => setCategoryFilter("all")}
                        >
                            {categoryFilter} ✕
                        </Badge>
                    )}
                    {privacyFilter !== "all" && (
                        <Badge
                            variant="primary"
                            className={styles.filterBadge}
                            onClick={() => setPrivacyFilter("all")}
                        >
                            {privacyFilter} ✕
                        </Badge>
                    )}
                    {activityFilter !== "all" && (
                        <Badge
                            variant="primary"
                            className={styles.filterBadge}
                            onClick={() => setActivityFilter("all")}
                        >
                            {activityFilter} activity ✕
                        </Badge>
                    )}
                </div>
            </div>

            {/* Groups Grid/List */}
            {filteredGroups.length === 0 ? (
                <EmptyState
                    icon="🔍"
                    title="No groups found"
                    message={
                        searchQuery
                            ? `No groups match your search for "${searchQuery}". Try different keywords or filters.`
                            : "No groups match your current filters. Try adjusting your search criteria."
                    }
                    action={
                        <Button
                            variant="primary"
                            onClick={() => {
                                setSearchQuery("");
                                setCategoryFilter("all");
                                setPrivacyFilter("all");
                                setActivityFilter("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    }
                />
            ) : (
                <div className={`${styles.groupsGrid} ${styles[layout]}`}>
                    {filteredGroups.map((group) => (
                        <GroupCard
                            key={group.id}
                            group={group}
                            currentUser={currentUser}
                            onJoin={handleJoinGroup}
                            onLeave={handleLeaveGroup}
                            onView={handleViewGroup}
                            className={styles.groupCard}
                            data-layout={layout}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Groups;
