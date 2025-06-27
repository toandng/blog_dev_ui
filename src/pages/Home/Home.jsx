import { TopicList, FeaturedPosts } from "../../components";
import styles from "./Home.module.scss";

const Home = () => {
    // Mock data - will be replaced with API calls later
    const mockTopics = [
        {
            id: 1,
            name: "React",
            slug: "react",
            description: "Learn React development and best practices",
            icon: "⚛️",
            postCount: 24,
        },
        {
            id: 2,
            name: "JavaScript",
            slug: "javascript",
            description: "Modern JavaScript techniques and tutorials",
            icon: "🟨",
            postCount: 32,
        },
        {
            id: 3,
            name: "CSS",
            slug: "css",
            description: "CSS styling tips and advanced techniques",
            icon: "🎨",
            postCount: 18,
        },
    ];

    const mockFeaturedPosts = [
        {
            id: 1,
            title: "Getting Started with React Hooks",
            excerpt:
                "Learn how to use React Hooks to manage state and side effects in your React applications.",
            author: {
                name: "John Doe",
                avatar: "https://via.placeholder.com/32",
            },
            publishedAt: "2024-01-15",
            readTime: 5,
            topic: "React",
            slug: "getting-started-with-react-hooks",
            featuredImage: "https://via.placeholder.com/400x200",
        },
        {
            id: 2,
            title: "Advanced CSS Grid Techniques",
            excerpt:
                "Explore advanced CSS Grid features and learn how to create complex layouts with ease.",
            author: {
                name: "Jane Smith",
                avatar: "https://via.placeholder.com/32",
            },
            publishedAt: "2024-01-12",
            readTime: 8,
            topic: "CSS",
            slug: "advanced-css-grid-techniques",
            featuredImage: "https://via.placeholder.com/400x200",
        },
    ];

    return (
        <div className={styles.home}>
            <div className="container">
                {/* Hero Section */}
                <section className={styles.hero}>
                    <h1 className={styles.heroTitle}>Welcome to BlogUI</h1>
                    <p className={styles.heroDescription}>
                        Discover the latest in web development, design patterns,
                        and programming best practices.
                    </p>
                </section>

                {/* Featured Posts */}
                <section className={styles.section}>
                    <FeaturedPosts posts={mockFeaturedPosts} />
                </section>

                {/* Popular Topics */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Popular Topics</h2>
                    <TopicList topics={mockTopics} />
                </section>
            </div>
        </div>
    );
};

export default Home;
