import { useState, useEffect } from "react";
import TopicList from "../../components/TopicList/TopicList";
import Loading from "../../components/Loading/Loading";
import styles from "./TopicsListing.module.scss";
import topicService from "../../services/topicService";
const TopicsListing = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);

      try {
        const dataTopic = await topicService.getListTopic();
        setTopics(dataTopic.data);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className={styles.topicsListing}>
        <div className="container">
          <Loading size="md" text="Loading topics..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.topicsListing}>
      <div className="container">
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>All Topics</h1>
          <p className={styles.description}>
            Explore all available topics and find content that interests you.
          </p>
        </header>

        {/* Topics Grid */}
        <section className={styles.content}>
          <TopicList topics={topics} loading={loading} />
        </section>
      </div>
    </div>
  );
};

export default TopicsListing;
