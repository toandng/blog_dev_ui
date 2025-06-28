import { useState } from "react";
import { Link } from "react-router-dom";
import PostList from "../../components/PostList/PostList";
import SuggestedUsers from "../../components/SuggestedUsers/SuggestedUsers";
import FeaturedPosts from "../../components/FeaturedPosts/FeaturedPosts";
import TopicList from "../../components/TopicList/TopicList";
import RecommendationEngine from "../../components/RecommendationEngine/RecommendationEngine";
import styles from "./Home.module.scss";

const Home = () => {
    const [activeTab, setActiveTab] = useState("following");

    // Mock user data
    const currentUser = {
        id: 1,
        username: "current_user",
        interests: ["React", "JavaScript", "Frontend Development"],
    };

    return (
        <div className={styles.homePage}>
            <div className={styles.container}>
                {/* Main content */}
                <div className={styles.mainContent}>
                    {/* Welcome section */}
                    <div className={styles.welcomeSection}>
                        <h1 className={styles.welcomeTitle}>
                            Welcome back! 👋
                        </h1>
                        <p className={styles.welcomeText}>
                            Discover the latest posts, connect with amazing
                            people, and stay updated with your interests.
                        </p>
                    </div>

                    {/* Featured content */}
                    <FeaturedPosts />

                    {/* AI Recommendations */}
                    <div className={styles.recommendationsSection}>
                        <RecommendationEngine
                            userId={currentUser.id}
                            contentType="mixed"
                            source="personalized"
                            limit={6}
                            showSource={true}
                            showRefresh={true}
                            layout="grid"
                        />
                    </div>

                    {/* Post feed tabs */}
                    <div className={styles.feedSection}>
                        <div className={styles.feedTabs}>
                            <button
                                onClick={() => setActiveTab("following")}
                                className={`${styles.feedTab} ${
                                    activeTab === "following"
                                        ? styles.active
                                        : ""
                                }`}
                            >
                                Following
                            </button>
                            <button
                                onClick={() => setActiveTab("discover")}
                                className={`${styles.feedTab} ${
                                    activeTab === "discover"
                                        ? styles.active
                                        : ""
                                }`}
                            >
                                Discover
                            </button>
                            <button
                                onClick={() => setActiveTab("trending")}
                                className={`${styles.feedTab} ${
                                    activeTab === "trending"
                                        ? styles.active
                                        : ""
                                }`}
                            >
                                Trending
                            </button>
                        </div>

                        {/* Post list based on active tab */}
                        <PostList filter={activeTab} />
                    </div>

                    {/* More recommendations */}
                    <div className={styles.moreRecommendations}>
                        <div className={styles.recommendationRow}>
                            <RecommendationEngine
                                userId={currentUser.id}
                                contentType="users"
                                source="similar"
                                limit={3}
                                showSource={true}
                                showRefresh={false}
                                layout="grid"
                            />
                        </div>

                        <div className={styles.recommendationRow}>
                            <RecommendationEngine
                                userId={currentUser.id}
                                contentType="topics"
                                source="trending"
                                limit={4}
                                showSource={true}
                                showRefresh={false}
                                layout="grid"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className={styles.sidebar}>
                    {/* Quick actions */}
                    <div className={styles.quickActions}>
                        <h3 className={styles.sidebarTitle}>Quick Actions</h3>
                        <div className={styles.actionButtons}>
                            <Link to="/write" className={styles.actionButton}>
                                ✍️ Write Post
                            </Link>
                            <Link to="/search" className={styles.actionButton}>
                                🔍 Explore Content
                            </Link>
                            <Link to="/groups" className={styles.actionButton}>
                                👥 Join Groups
                            </Link>
                        </div>
                    </div>

                    {/* Suggested users */}
                    <SuggestedUsers />

                    {/* Trending topics */}
                    <div className={styles.trendingSection}>
                        <h3 className={styles.sidebarTitle}>Trending Topics</h3>
                        <TopicList layout="compact" limit={8} />
                    </div>

                    {/* AI-powered personal recommendations */}
                    <div className={styles.personalRecs}>
                        <RecommendationEngine
                            userId={currentUser.id}
                            contentType="posts"
                            source="following"
                            limit={3}
                            showSource={false}
                            showRefresh={true}
                            layout="list"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
