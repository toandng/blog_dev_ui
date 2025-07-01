import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./CommentItem.module.scss";

const CommentItem = ({
    comment,
    level = 0,
    maxLevel = 2,
    onReply,
    onLike,
    onEdit,
    onDelete,
    showActions = true,
    className,
    ...props
}) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState("");

    const {
        id,
        author,
        content,
        createdAt,
        likes = 0,
        isLiked = false,
        replies = [],
        isEdited = false,
    } = comment;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "just now";
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000)
            return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (replyText.trim() && onReply) {
            onReply(id, replyText.trim());
            setReplyText("");
            setShowReplyForm(false);
        }
    };

    const handleLike = () => {
        if (onLike) {
            onLike(id);
        }
    };

    return (
        <div
            className={`${styles.commentItem} ${className || ""}`}
            style={{ "--comment-indent": level > 0 ? `${level * 24}px` : "0" }}
            {...props}
        >
            <div className={styles.comment}>
                {/* Avatar */}
                <div className={styles.avatar}>
                    <FallbackImage src={author.avatar} alt={author.name} />
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.info}>
                            <Link
                                to={`/profile/${
                                    author?.username ||
                                    author?.name
                                        ?.toLowerCase()
                                        .replace(/\s+/g, "-")
                                }`}
                                className={styles.authorName}
                            >
                                {author.name}
                            </Link>
                            <time className={styles.date} dateTime={createdAt}>
                                {formatDate(createdAt)}
                            </time>
                            {isEdited && (
                                <span className={styles.edited}>(edited)</span>
                            )}
                        </div>
                    </div>

                    {/* Comment text */}
                    <div className={styles.text}>
                        <p>{content}</p>
                    </div>

                    {/* Actions */}
                    {showActions && (
                        <div className={styles.actions}>
                            <button
                                className={`${styles.likeButton} ${
                                    isLiked ? styles.liked : ""
                                }`}
                                onClick={handleLike}
                                type="button"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                {likes > 0 && <span>{likes}</span>}
                            </button>

                            {level < maxLevel && (
                                <button
                                    className={styles.replyButton}
                                    onClick={() =>
                                        setShowReplyForm(!showReplyForm)
                                    }
                                    type="button"
                                >
                                    Reply
                                </button>
                            )}

                            {onEdit && (
                                <button
                                    className={styles.editButton}
                                    onClick={() => onEdit(id)}
                                    type="button"
                                >
                                    Edit
                                </button>
                            )}

                            {onDelete && (
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => onDelete(id)}
                                    type="button"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    )}

                    {/* Reply form */}
                    {showReplyForm && (
                        <form
                            className={styles.replyForm}
                            onSubmit={handleReplySubmit}
                        >
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className={styles.replyInput}
                                rows="3"
                            />
                            <div className={styles.replyActions}>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyText("");
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    disabled={!replyText.trim()}
                                >
                                    Reply
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Replies */}
            {replies.length > 0 && (
                <div className={styles.replies}>
                    {replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            level={level + 1}
                            maxLevel={maxLevel}
                            onReply={onReply}
                            onLike={onLike}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            showActions={showActions}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

CommentItem.propTypes = {
    comment: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        author: PropTypes.shape({
            name: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
            username: PropTypes.string,
        }).isRequired,
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        likes: PropTypes.number,
        isLiked: PropTypes.bool,
        replies: PropTypes.array,
        isEdited: PropTypes.bool,
    }).isRequired,
    level: PropTypes.number,
    maxLevel: PropTypes.number,
    onReply: PropTypes.func,
    onLike: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    showActions: PropTypes.bool,
    className: PropTypes.string,
};

export default CommentItem;
