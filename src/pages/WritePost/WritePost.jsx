import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import FallbackImage from "../../components/FallbackImage/FallbackImage";
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";
import styles from "./WritePost.module.scss";

const WritePost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(slug);

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        coverImage: "",
        topics: [],
        status: "draft",
        visibility: "public",
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [topicInput, setTopicInput] = useState("");

    const availableTopics = [
        "React",
        "JavaScript",
        "TypeScript",
        "Node.js",
        "CSS",
        "HTML",
        "Python",
        "Vue.js",
        "Angular",
        "Backend",
        "Frontend",
        "DevOps",
    ];

    // Visibility options
    const visibilityOptions = [
        {
            value: "public",
            label: "Public",
            description: "Anyone can view this post",
            icon: "🌍",
        },
        {
            value: "followers",
            label: "Followers Only",
            description: "Only your followers can view this post",
            icon: "👥",
        },
        {
            value: "private",
            label: "Private",
            description: "Only you can view this post",
            icon: "🔒",
        },
    ];

    useEffect(() => {
        if (isEditing) {
            // Mock existing post data
            const mockPost = {
                title: "Getting Started with React Hooks",
                excerpt:
                    "Learn the fundamentals of React Hooks and how they can simplify your component logic.",
                content:
                    "# Getting Started with React Hooks\n\nReact Hooks revolutionized how we write components...",
                coverImage:
                    "https://via.placeholder.com/800x400?text=React+Hooks",
                topics: ["React", "JavaScript"],
                status: "draft",
                visibility: "public",
            };
            setFormData(mockPost);
            setSelectedTopics(mockPost.topics);
        }
    }, [isEditing]);

    const handleInputChange = (field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));

        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const handleVisibilityChange = (visibility) => {
        setFormData((prev) => ({
            ...prev,
            visibility,
        }));
    };

    const handleAddTopic = (topic) => {
        if (topic && !selectedTopics.includes(topic)) {
            const newTopics = [...selectedTopics, topic];
            setSelectedTopics(newTopics);
            setFormData((prev) => ({
                ...prev,
                topics: newTopics,
            }));
            setTopicInput("");
        }
    };

    const handleRemoveTopic = (topicToRemove) => {
        const newTopics = selectedTopics.filter(
            (topic) => topic !== topicToRemove
        );
        setSelectedTopics(newTopics);
        setFormData((prev) => ({
            ...prev,
            topics: newTopics,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!formData.excerpt.trim()) {
            newErrors.excerpt = "Excerpt is required";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Content is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (status = "draft") => {
        if (!validateForm()) return;

        setSaving(true);
        try {
            const postData = {
                ...formData,
                status,
                updatedAt: new Date().toISOString(),
            };

            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log("Saving post:", postData);
            navigate("/my-posts");
        } catch (error) {
            console.error("Error saving post:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const mockImageUrl = `https://via.placeholder.com/800x400?text=${encodeURIComponent(
                file.name
            )}`;
            setFormData((prev) => ({
                ...prev,
                coverImage: mockImageUrl,
            }));
        }
    };

    const wordCount = formData.content
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>
                            {isEditing ? "Edit Post" : "Write New Post"}
                        </h1>
                        <div className={styles.stats}>
                            <span>{wordCount} words</span>
                            <span>~{readingTime} min read</span>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.toggleButton} ${
                                    !previewMode ? styles.active : ""
                                }`}
                                onClick={() => setPreviewMode(false)}
                            >
                                Write
                            </button>
                            <button
                                className={`${styles.toggleButton} ${
                                    previewMode ? styles.active : ""
                                }`}
                                onClick={() => setPreviewMode(true)}
                            >
                                Preview
                            </button>
                        </div>

                        <div className={styles.saveActions}>
                            <Button
                                variant="secondary"
                                onClick={() => handleSave("draft")}
                                loading={saving}
                                disabled={saving}
                            >
                                Save Draft
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => handleSave("published")}
                                loading={saving}
                                disabled={saving}
                            >
                                {isEditing ? "Update" : "Publish"}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    {!previewMode ? (
                        <div className={styles.editor}>
                            <div className={styles.form}>
                                <Input
                                    label="Title"
                                    placeholder="Enter your post title..."
                                    value={formData.title}
                                    onChange={handleInputChange("title")}
                                    error={errors.title}
                                    required
                                    fullWidth
                                    size="lg"
                                />

                                <Input
                                    label="Excerpt"
                                    placeholder="Write a brief description..."
                                    value={formData.excerpt}
                                    onChange={handleInputChange("excerpt")}
                                    error={errors.excerpt}
                                    required
                                    fullWidth
                                />

                                <div className={styles.imageSection}>
                                    <label className={styles.label}>
                                        Cover Image
                                    </label>

                                    {formData.coverImage ? (
                                        <div className={styles.imagePreview}>
                                            <FallbackImage
                                                src={formData.coverImage}
                                                alt="Cover preview"
                                                className={styles.coverImage}
                                            />
                                            <div
                                                className={styles.imageActions}
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className={styles.fileInput}
                                                    id="cover-upload"
                                                />
                                                <label
                                                    htmlFor="cover-upload"
                                                    className={
                                                        styles.changeImageButton
                                                    }
                                                >
                                                    Change
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            coverImage: "",
                                                        }))
                                                    }
                                                    className={
                                                        styles.removeImageButton
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles.uploadArea}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className={styles.fileInput}
                                                id="cover-upload"
                                            />
                                            <label
                                                htmlFor="cover-upload"
                                                className={styles.uploadButton}
                                            >
                                                Upload Cover Image
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.topicsSection}>
                                    <label className={styles.label}>
                                        Topics
                                    </label>

                                    <div className={styles.topicsInput}>
                                        <input
                                            type="text"
                                            placeholder="Add topics..."
                                            value={topicInput}
                                            onChange={(e) =>
                                                setTopicInput(e.target.value)
                                            }
                                            onKeyPress={(e) => {
                                                if (
                                                    e.key === "Enter" &&
                                                    topicInput.trim()
                                                ) {
                                                    e.preventDefault();
                                                    handleAddTopic(
                                                        topicInput.trim()
                                                    );
                                                }
                                            }}
                                            className={styles.topicInput}
                                        />

                                        <div
                                            className={styles.topicSuggestions}
                                        >
                                            {topicInput &&
                                                availableTopics
                                                    .filter(
                                                        (topic) =>
                                                            topic
                                                                .toLowerCase()
                                                                .includes(
                                                                    topicInput.toLowerCase()
                                                                ) &&
                                                            !selectedTopics.includes(
                                                                topic
                                                            )
                                                    )
                                                    .slice(0, 5)
                                                    .map((topic) => (
                                                        <button
                                                            key={topic}
                                                            type="button"
                                                            className={
                                                                styles.suggestionItem
                                                            }
                                                            onClick={() =>
                                                                handleAddTopic(
                                                                    topic
                                                                )
                                                            }
                                                        >
                                                            {topic}
                                                        </button>
                                                    ))}
                                        </div>
                                    </div>

                                    <div className={styles.selectedTopics}>
                                        {selectedTopics.map((topic) => (
                                            <Badge
                                                key={topic}
                                                variant="secondary"
                                                className={styles.topicBadge}
                                            >
                                                {topic}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveTopic(topic)
                                                    }
                                                    className={
                                                        styles.removeTopic
                                                    }
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.visibilitySection}>
                                    <label className={styles.label}>
                                        Post Visibility
                                    </label>
                                    <div className={styles.visibilityOptions}>
                                        {visibilityOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                className={`${
                                                    styles.visibilityOption
                                                } ${
                                                    formData.visibility ===
                                                    option.value
                                                        ? styles.selected
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleVisibilityChange(
                                                        option.value
                                                    )
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.optionHeader
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.optionIcon
                                                        }
                                                    >
                                                        {option.icon}
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.optionLabel
                                                        }
                                                    >
                                                        {option.label}
                                                    </span>
                                                    <input
                                                        type="radio"
                                                        name="visibility"
                                                        value={option.value}
                                                        checked={
                                                            formData.visibility ===
                                                            option.value
                                                        }
                                                        onChange={() =>
                                                            handleVisibilityChange(
                                                                option.value
                                                            )
                                                        }
                                                        className={
                                                            styles.visibilityRadio
                                                        }
                                                    />
                                                </div>
                                                <p
                                                    className={
                                                        styles.optionDescription
                                                    }
                                                >
                                                    {option.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.contentSection}>
                                    <label
                                        className={styles.label}
                                        htmlFor="content"
                                    >
                                        Content *
                                    </label>
                                    <RichTextEditor
                                        value={formData.content}
                                        onChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                content: value,
                                            }))
                                        }
                                        placeholder="Start writing your post content..."
                                        error={errors.content}
                                        className={styles.richTextEditor}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.preview}>
                            <div className={styles.previewContent}>
                                <div className={styles.previewHeader}>
                                    {formData.coverImage && (
                                        <FallbackImage
                                            src={formData.coverImage}
                                            alt={formData.title}
                                            className={styles.previewCoverImage}
                                        />
                                    )}
                                    <h1 className={styles.previewTitle}>
                                        {formData.title || "Your Post Title"}
                                    </h1>
                                    <p className={styles.previewExcerpt}>
                                        {formData.excerpt ||
                                            "Your post excerpt..."}
                                    </p>
                                    <div className={styles.previewTopics}>
                                        {selectedTopics.map((topic) => (
                                            <Badge
                                                key={topic}
                                                variant="primary"
                                            >
                                                {topic}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.previewBody}>
                                    <div
                                        className={styles.previewText}
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                formData.content ||
                                                "<p>Your post content...</p>",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WritePost;
