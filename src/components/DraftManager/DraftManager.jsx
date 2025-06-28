import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import styles from "./DraftManager.module.scss";

const DraftManager = ({
    content,
    onSave,
    onLoad,
    onDelete,
    autoSaveInterval = 30000, // 30 seconds
    showDrafts = true,
    className,
    ...props
}) => {
    const [drafts, setDrafts] = useState([]);
    const [currentDraftId, setCurrentDraftId] = useState(null);
    const [lastSaved, setLastSaved] = useState(null);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [showDraftsList, setShowDraftsList] = useState(false);

    // Generate a unique draft ID
    const generateDraftId = () => {
        return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // Load drafts from localStorage on mount
    useEffect(() => {
        try {
            const savedDrafts = localStorage.getItem("blog_drafts");
            if (savedDrafts) {
                const parsedDrafts = JSON.parse(savedDrafts);
                setDrafts(parsedDrafts);
            }
        } catch (error) {
            console.error("Failed to load drafts:", error);
        }
    }, []);

    // Auto-save functionality
    useEffect(() => {
        if (!content || content.trim().length < 10) return; // Don't save very short content

        const autoSaveTimer = setTimeout(() => {
            autoSaveDraft();
        }, autoSaveInterval);

        return () => clearTimeout(autoSaveTimer);
    }, [content, autoSaveInterval]);

    const autoSaveDraft = useCallback(async () => {
        if (!content || content.trim().length < 10) return;

        setIsAutoSaving(true);

        try {
            const draftId = currentDraftId || generateDraftId();
            const draft = {
                id: draftId,
                title: extractTitle(content) || "Untitled",
                content,
                createdAt: currentDraftId
                    ? drafts.find((d) => d.id === currentDraftId)?.createdAt ||
                      new Date().toISOString()
                    : new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                wordCount: countWords(content),
                isAutoSaved: true,
            };

            // Update drafts array
            const updatedDrafts = currentDraftId
                ? drafts.map((d) => (d.id === currentDraftId ? draft : d))
                : [...drafts, draft];

            setDrafts(updatedDrafts);
            setCurrentDraftId(draftId);
            setLastSaved(new Date());

            // Save to localStorage
            localStorage.setItem("blog_drafts", JSON.stringify(updatedDrafts));

            if (onSave) {
                onSave(draft);
            }
        } catch (error) {
            console.error("Auto-save failed:", error);
        } finally {
            setIsAutoSaving(false);
        }
    }, [content, currentDraftId, drafts, onSave]);

    const extractTitle = (content) => {
        // Extract title from content (first heading or first line)
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;

        const heading = tempDiv.querySelector("h1, h2, h3");
        if (heading) {
            return heading.textContent.trim();
        }

        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        const firstLine = textContent.split("\n")[0].trim();
        return firstLine.length > 50
            ? `${firstLine.substring(0, 50)}...`
            : firstLine;
    };

    const countWords = (content) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        const text = tempDiv.textContent || tempDiv.innerText || "";
        return text
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0).length;
    };

    const manualSave = () => {
        if (!content || content.trim().length < 10) return;

        const draftId = currentDraftId || generateDraftId();
        const draft = {
            id: draftId,
            title: extractTitle(content) || "Untitled",
            content,
            createdAt: currentDraftId
                ? drafts.find((d) => d.id === currentDraftId)?.createdAt ||
                  new Date().toISOString()
                : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            wordCount: countWords(content),
            isAutoSaved: false,
        };

        const updatedDrafts = currentDraftId
            ? drafts.map((d) => (d.id === currentDraftId ? draft : d))
            : [...drafts, draft];

        setDrafts(updatedDrafts);
        setCurrentDraftId(draftId);
        setLastSaved(new Date());

        localStorage.setItem("blog_drafts", JSON.stringify(updatedDrafts));

        if (onSave) {
            onSave(draft);
        }
    };

    const loadDraft = (draft) => {
        setCurrentDraftId(draft.id);
        setShowDraftsList(false);

        if (onLoad) {
            onLoad(draft);
        }
    };

    const deleteDraft = (draftId) => {
        const updatedDrafts = drafts.filter((d) => d.id !== draftId);
        setDrafts(updatedDrafts);
        localStorage.setItem("blog_drafts", JSON.stringify(updatedDrafts));

        if (currentDraftId === draftId) {
            setCurrentDraftId(null);
        }

        if (onDelete) {
            onDelete(draftId);
        }
    };

    const createNewDraft = () => {
        setCurrentDraftId(null);
        setLastSaved(null);
        setShowDraftsList(false);

        if (onLoad) {
            onLoad({ content: "", title: "" });
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return "just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return (
            date.toLocaleDateString() +
            " " +
            date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
    };

    // Sort drafts by last updated
    const sortedDrafts = [...drafts].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    return (
        <div className={`${styles.draftManager} ${className || ""}`} {...props}>
            {/* Status Bar */}
            <div className={styles.statusBar}>
                <div className={styles.statusInfo}>
                    {isAutoSaving && (
                        <span className={styles.autoSaving}>
                            💾 Auto-saving...
                        </span>
                    )}

                    {lastSaved && !isAutoSaving && (
                        <span className={styles.lastSaved}>
                            ✅ Saved {formatTime(lastSaved)}
                        </span>
                    )}

                    {!lastSaved && !isAutoSaving && (
                        <span className={styles.unsaved}>
                            ⚠️ Unsaved changes
                        </span>
                    )}
                </div>

                <div className={styles.actions}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={manualSave}
                        disabled={!content || content.trim().length < 10}
                    >
                        Save Draft
                    </Button>

                    {showDrafts && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDraftsList(!showDraftsList)}
                        >
                            My Drafts ({drafts.length})
                        </Button>
                    )}
                </div>
            </div>

            {/* Drafts List */}
            {showDraftsList && (
                <div className={styles.draftsOverlay}>
                    <div className={styles.draftsModal}>
                        <div className={styles.draftsHeader}>
                            <h3 className={styles.draftsTitle}>My Drafts</h3>
                            <div className={styles.draftsActions}>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={createNewDraft}
                                >
                                    New Draft
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowDraftsList(false)}
                                >
                                    ✕
                                </Button>
                            </div>
                        </div>

                        <div className={styles.draftsList}>
                            {sortedDrafts.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <p>
                                        No drafts yet. Start writing to create
                                        your first draft!
                                    </p>
                                </div>
                            ) : (
                                sortedDrafts.map((draft) => (
                                    <div
                                        key={draft.id}
                                        className={`${styles.draftItem} ${
                                            currentDraftId === draft.id
                                                ? styles.currentDraft
                                                : ""
                                        }`}
                                    >
                                        <div
                                            className={styles.draftContent}
                                            onClick={() => loadDraft(draft)}
                                        >
                                            <h4 className={styles.draftTitle}>
                                                {draft.title}
                                                {draft.isAutoSaved && (
                                                    <span
                                                        className={
                                                            styles.autoSavedBadge
                                                        }
                                                    >
                                                        Auto-saved
                                                    </span>
                                                )}
                                            </h4>
                                            <div className={styles.draftMeta}>
                                                <span
                                                    className={styles.wordCount}
                                                >
                                                    {draft.wordCount} words
                                                </span>
                                                <span
                                                    className={styles.timestamp}
                                                >
                                                    Updated:{" "}
                                                    {formatDateTime(
                                                        draft.updatedAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteDraft(draft.id);
                                            }}
                                            className={styles.deleteButton}
                                        >
                                            🗑️
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

DraftManager.propTypes = {
    content: PropTypes.string,
    onSave: PropTypes.func,
    onLoad: PropTypes.func,
    onDelete: PropTypes.func,
    autoSaveInterval: PropTypes.number,
    showDrafts: PropTypes.bool,
    className: PropTypes.string,
};

export default DraftManager;
