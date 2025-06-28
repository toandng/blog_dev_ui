import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import Input from "../Input/Input";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./ChatWindow.module.scss";

const ChatWindow = ({
    currentUser,
    selectedChat = null,
    messages = [],
    onSendMessage,
    onClose,
    isMinimized = false,
    onToggleMinimize,
    typingUsers = [],
    onlineUsers = [],
    className,
    ...props
}) => {
    const [messageInput, setMessageInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (selectedChat && !isMinimized && inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedChat, isMinimized]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedChat) return;

        const message = {
            id: Date.now(),
            text: messageInput.trim(),
            senderId: currentUser.id,
            chatId: selectedChat.id,
            timestamp: new Date().toISOString(),
            type: "text",
        };

        if (onSendMessage) {
            onSendMessage(message);
        }

        setMessageInput("");
        setIsTyping(false);

        // Clear typing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMessageInput(value);

        // Handle typing indicator
        if (value.trim() && !isTyping) {
            setIsTyping(true);
            // TODO: Emit typing start event
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            // TODO: Emit typing stop event
        }, 2000);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleEmojiSelect = (emoji) => {
        setMessageInput((prev) => prev + emoji);
        setShowEmojiPicker(false);
        inputRef.current?.focus();
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatMessageDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString();
        }
    };

    const isOnline = (userId) => {
        return onlineUsers.includes(userId);
    };

    const renderMessage = (message, index) => {
        const isOwnMessage = message.senderId === currentUser.id;
        const previousMessage = messages[index - 1];
        const nextMessage = messages[index + 1];

        const showDate =
            !previousMessage ||
            formatMessageDate(message.timestamp) !==
                formatMessageDate(previousMessage.timestamp);

        const showAvatar =
            !nextMessage ||
            nextMessage.senderId !== message.senderId ||
            new Date(nextMessage.timestamp) - new Date(message.timestamp) >
                300000; // 5 minutes

        const showTimestamp = showAvatar;

        return (
            <div key={message.id}>
                {showDate && (
                    <div className={styles.dateHeader}>
                        {formatMessageDate(message.timestamp)}
                    </div>
                )}

                <div
                    className={`${styles.messageGroup} ${
                        isOwnMessage ? styles.own : ""
                    }`}
                >
                    {!isOwnMessage && showAvatar && (
                        <div className={styles.messageAvatar}>
                            <FallbackImage
                                src={selectedChat.avatar}
                                alt={selectedChat.name}
                                fallback={selectedChat.name.charAt(0)}
                                className={styles.avatar}
                            />
                        </div>
                    )}

                    <div className={styles.messageContent}>
                        <div
                            className={`${styles.messageBubble} ${
                                isOwnMessage ? styles.own : ""
                            }`}
                        >
                            <span className={styles.messageText}>
                                {message.text}
                            </span>
                        </div>

                        {showTimestamp && (
                            <div
                                className={`${styles.messageTime} ${
                                    isOwnMessage ? styles.own : ""
                                }`}
                            >
                                {formatTime(message.timestamp)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const commonEmojis = [
        "😀",
        "😂",
        "😍",
        "🤔",
        "👍",
        "👎",
        "❤️",
        "🎉",
        "😢",
        "😡",
        "👋",
        "🔥",
    ];

    if (!selectedChat) {
        return (
            <div
                className={`${styles.chatWindow} ${styles.noChat} ${
                    className || ""
                }`}
                {...props}
            >
                <div className={styles.noChatContent}>
                    <div className={styles.noChatIcon}>💬</div>
                    <h3>Select a conversation</h3>
                    <p>Choose a contact from the sidebar to start chatting</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`${styles.chatWindow} ${
                isMinimized ? styles.minimized : ""
            } ${className || ""}`}
            {...props}
        >
            {/* Chat Header */}
            <div className={styles.chatHeader}>
                <div className={styles.chatInfo}>
                    <FallbackImage
                        src={selectedChat.avatar}
                        alt={selectedChat.name}
                        fallback={selectedChat.name.charAt(0)}
                        className={styles.headerAvatar}
                    />
                    <div className={styles.chatDetails}>
                        <h3 className={styles.chatName}>{selectedChat.name}</h3>
                        <span
                            className={`${styles.chatStatus} ${
                                isOnline(selectedChat.id) ? styles.online : ""
                            }`}
                        >
                            {isOnline(selectedChat.id)
                                ? "Online"
                                : "Last seen recently"}
                        </span>
                    </div>
                </div>

                <div className={styles.chatActions}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleMinimize}
                        title={isMinimized ? "Expand" : "Minimize"}
                    >
                        {isMinimized ? "▲" : "▼"}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        title="Close"
                    >
                        ✕
                    </Button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Container */}
                    <div className={styles.messagesContainer}>
                        <div className={styles.messagesList}>
                            {messages.length === 0 ? (
                                <div className={styles.emptyMessages}>
                                    <div className={styles.emptyIcon}>💭</div>
                                    <p>
                                        No messages yet. Start the conversation!
                                    </p>
                                </div>
                            ) : (
                                messages.map((message, index) =>
                                    renderMessage(message, index)
                                )
                            )}

                            {/* Typing Indicator */}
                            {typingUsers.length > 0 && (
                                <div className={styles.typingIndicator}>
                                    <div className={styles.typingAvatar}>
                                        <FallbackImage
                                            src={selectedChat.avatar}
                                            alt={selectedChat.name}
                                            fallback={selectedChat.name.charAt(
                                                0
                                            )}
                                            className={styles.avatar}
                                        />
                                    </div>
                                    <div className={styles.typingBubble}>
                                        <div className={styles.typingDots}>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className={styles.inputContainer}>
                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                            <div className={styles.emojiPicker}>
                                {commonEmojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        className={styles.emojiButton}
                                        onClick={() => handleEmojiSelect(emoji)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className={styles.inputRow}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    setShowEmojiPicker(!showEmojiPicker)
                                }
                                className={styles.emojiToggle}
                            >
                                😀
                            </Button>

                            <Input
                                ref={inputRef}
                                type="text"
                                value={messageInput}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                placeholder="Type a message..."
                                className={styles.messageInput}
                            />

                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim()}
                                className={styles.sendButton}
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

ChatWindow.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
    }).isRequired,
    selectedChat: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
    }),
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            text: PropTypes.string.isRequired,
            senderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            timestamp: PropTypes.string.isRequired,
            type: PropTypes.string,
        })
    ),
    onSendMessage: PropTypes.func,
    onClose: PropTypes.func,
    isMinimized: PropTypes.bool,
    onToggleMinimize: PropTypes.func,
    typingUsers: PropTypes.array,
    onlineUsers: PropTypes.array,
    className: PropTypes.string,
};

export default ChatWindow;
