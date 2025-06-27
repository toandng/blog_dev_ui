import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Card from "../Card/Card";
import Badge from "../Badge/Badge";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./PostCard.module.scss";

const PostCard = ({
    title,
    excerpt,
    author,
    publishedAt,
    readTime,
    topic,
    slug,
    featuredImage,
    loading = false,
    compact = false,
    className,
    ...props
}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <Card
                className={`${styles.postCard} ${styles.loading} ${
                    className || ""
                }`}
                variant="default"
                padding="none"
                {...props}
            >
                <div className={styles.skeletonImage} />
                <div className={styles.content}>
                    <div className={styles.skeletonBadge} />
                    <div className={styles.skeletonTitle} />
                    <div className={styles.skeletonExcerpt} />
                    <div className={styles.skeletonMeta} />
                </div>
            </Card>
        );
    }

    return (
        <Card
            className={`${styles.postCard} ${compact ? styles.compact : ""} ${
                className || ""
            }`}
            variant="default"
            hoverable
            padding="none"
            {...props}
        >
            {/* Featured Image */}
            <div className={styles.imageContainer}>
                <Link to={`/blog/${slug}`}>
                    <FallbackImage
                        src={featuredImage}
                        alt={title}
                        className={styles.image}
                    />
                </Link>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {/* Topic Badge */}
                {topic && (
                    <div className={styles.topicBadge}>
                        <Badge variant="primary" size="sm">
                            {topic}
                        </Badge>
                    </div>
                )}

                {/* Title */}
                <h3 className={styles.title}>
                    <Link to={`/blog/${slug}`} className={styles.titleLink}>
                        {title}
                    </Link>
                </h3>

                {/* Excerpt */}
                {excerpt && <p className={styles.excerpt}>{excerpt}</p>}

                {/* Meta Information */}
                <div className={styles.meta}>
                    <div className={styles.author}>
                        {author?.avatar && (
                            <FallbackImage
                                src={author.avatar}
                                alt={author.name}
                                className={styles.authorAvatar}
                            />
                        )}
                        <span className={styles.authorName}>
                            {author?.name}
                        </span>
                    </div>

                    <div className={styles.metaInfo}>
                        <span className={styles.date}>
                            {formatDate(publishedAt)}
                        </span>
                        {readTime && (
                            <>
                                <span className={styles.separator}>•</span>
                                <span className={styles.readTime}>
                                    {readTime} min read
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

PostCard.propTypes = {
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
    }).isRequired,
    publishedAt: PropTypes.string.isRequired,
    readTime: PropTypes.number,
    topic: PropTypes.string,
    slug: PropTypes.string,
    featuredImage: PropTypes.string,
    loading: PropTypes.bool,
    compact: PropTypes.bool,
    className: PropTypes.string,
};

export default PostCard;
