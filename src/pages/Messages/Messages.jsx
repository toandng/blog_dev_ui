import { useState, useEffect } from "react";
import ChatSidebar from "../../components/ChatSidebar/ChatSidebar";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import styles from "./Messages.module.scss";

const Messages = () => {
    // Mock current user
    const currentUser = {
        id: 1,
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    };

    // Mock conversations data
    const [conversations, setConversations] = useState([
        {
            id: 2,
            name: "Sarah Wilson",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
            lastMessage: {
                text: "That sounds great! Let's meet tomorrow.",
                timestamp: "2024-01-15T14:30:00Z",
                senderId: 2,
            },
            unreadCount: 2,
            updatedAt: "2024-01-15T14:30:00Z",
        },
        {
            id: 3,
            name: "Mike Chen",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            lastMessage: {
                text: "Thanks for the article! Very insightful.",
                timestamp: "2024-01-15T10:15:00Z",
                senderId: 3,
            },
            unreadCount: 0,
            updatedAt: "2024-01-15T10:15:00Z",
        },
        {
            id: 4,
            name: "Emily Rodriguez",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            lastMessage: {
                text: "Could you review my latest post?",
                timestamp: "2024-01-14T16:45:00Z",
                senderId: 4,
            },
            unreadCount: 1,
            updatedAt: "2024-01-14T16:45:00Z",
        },
        {
            id: 5,
            name: "Alex Thompson",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            lastMessage: {
                text: "Perfect! I'll send the draft later today.",
                timestamp: "2024-01-14T09:20:00Z",
                senderId: 1,
            },
            unreadCount: 0,
            updatedAt: "2024-01-14T09:20:00Z",
        },
        {
            id: 6,
            name: "Lisa Park",
            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
            lastMessage: {
                text: "Love the new design! 🎨",
                timestamp: "2024-01-13T11:30:00Z",
                senderId: 6,
            },
            unreadCount: 0,
            updatedAt: "2024-01-13T11:30:00Z",
        },
    ]);

    // Mock messages for each conversation
    const [messagesData, setMessagesData] = useState({
        2: [
            {
                id: 1,
                text: "Hey! How's the new blog post coming along?",
                senderId: 2,
                timestamp: "2024-01-15T14:00:00Z",
                type: "text",
            },
            {
                id: 2,
                text: "It's going really well! I'm almost done with the draft.",
                senderId: 1,
                timestamp: "2024-01-15T14:05:00Z",
                type: "text",
            },
            {
                id: 3,
                text: "Would love to get your feedback on it before publishing.",
                senderId: 1,
                timestamp: "2024-01-15T14:06:00Z",
                type: "text",
            },
            {
                id: 4,
                text: "That sounds great! Let's meet tomorrow.",
                senderId: 2,
                timestamp: "2024-01-15T14:30:00Z",
                type: "text",
            },
        ],
        3: [
            {
                id: 1,
                text: "Did you see the article about React 18?",
                senderId: 1,
                timestamp: "2024-01-15T10:00:00Z",
                type: "text",
            },
            {
                id: 2,
                text: "Yes! The concurrent features look amazing.",
                senderId: 3,
                timestamp: "2024-01-15T10:10:00Z",
                type: "text",
            },
            {
                id: 3,
                text: "Thanks for the article! Very insightful.",
                senderId: 3,
                timestamp: "2024-01-15T10:15:00Z",
                type: "text",
            },
        ],
        4: [
            {
                id: 1,
                text: "Hi John! Hope you're doing well.",
                senderId: 4,
                timestamp: "2024-01-14T16:30:00Z",
                type: "text",
            },
            {
                id: 2,
                text: "Could you review my latest post?",
                senderId: 4,
                timestamp: "2024-01-14T16:45:00Z",
                type: "text",
            },
        ],
        5: [
            {
                id: 1,
                text: "Can you help me with the user authentication flow?",
                senderId: 5,
                timestamp: "2024-01-14T09:00:00Z",
                type: "text",
            },
            {
                id: 2,
                text: "Sure! I can walk you through it. What specific part are you stuck on?",
                senderId: 1,
                timestamp: "2024-01-14T09:10:00Z",
                type: "text",
            },
            {
                id: 3,
                text: "Perfect! I'll send the draft later today.",
                senderId: 1,
                timestamp: "2024-01-14T09:20:00Z",
                type: "text",
            },
        ],
        6: [
            {
                id: 1,
                text: "Love the new design! 🎨",
                senderId: 6,
                timestamp: "2024-01-13T11:30:00Z",
                type: "text",
            },
        ],
    });

    // Chat state
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [isChatMinimized, setIsChatMinimized] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([2, 3, 6]); // Mock online users
    const [typingUsers, setTypingUsers] = useState([]);

    // Get selected chat data
    const selectedChat = conversations.find(
        (conv) => conv.id === selectedChatId
    );
    const messages = selectedChatId ? messagesData[selectedChatId] || [] : [];

    // Handle chat selection
    const handleChatSelect = (conversation) => {
        setSelectedChatId(conversation.id);
        setIsChatMinimized(false);

        // Mark conversation as read
        setConversations((prev) =>
            prev.map((conv) =>
                conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
            )
        );
    };

    // Handle sending messages
    const handleSendMessage = (message) => {
        // Add message to conversation
        setMessagesData((prev) => ({
            ...prev,
            [selectedChatId]: [...(prev[selectedChatId] || []), message],
        }));

        // Update conversation's last message
        setConversations((prev) =>
            prev.map((conv) =>
                conv.id === selectedChatId
                    ? {
                          ...conv,
                          lastMessage: {
                              text: message.text,
                              timestamp: message.timestamp,
                              senderId: message.senderId,
                          },
                          updatedAt: message.timestamp,
                      }
                    : conv
            )
        );

        // Simulate typing indicator for the other user
        if (selectedChatId) {
            setTypingUsers([selectedChatId]);
            setTimeout(() => {
                setTypingUsers([]);

                // Simulate response after 2-5 seconds
                setTimeout(() => {
                    simulateResponse();
                }, Math.random() * 3000 + 2000);
            }, 1000);
        }
    };

    // Simulate responses from other users
    const simulateResponse = () => {
        if (!selectedChatId) return;

        const responses = [
            "That makes sense!",
            "I agree with you.",
            "Thanks for explaining that.",
            "Interesting perspective!",
            "Let me think about it.",
            "Good point!",
            "I'll check that out.",
            "Sounds good to me.",
            "Great idea!",
            "Thanks for sharing!",
        ];

        const responseMessage = {
            id: Date.now() + Math.random(),
            text: responses[Math.floor(Math.random() * responses.length)],
            senderId: selectedChatId,
            timestamp: new Date().toISOString(),
            type: "text",
        };

        handleSendMessage(responseMessage);
    };

    // Handle new chat creation
    const handleNewChat = () => {
        // This would typically open a user selection modal
        // For now, we'll just show an alert
        alert(
            "New chat feature coming soon! You'll be able to start conversations with any user."
        );
    };

    // Simulate real-time updates
    useEffect(() => {
        // Simulate online status changes
        const onlineInterval = setInterval(() => {
            setOnlineUsers(() => {
                const allUserIds = conversations.map((c) => c.id);
                const randomUsers = allUserIds.filter(
                    () => Math.random() > 0.3
                );
                return randomUsers;
            });
        }, 30000); // Update every 30 seconds

        return () => clearInterval(onlineInterval);
    }, [conversations]);

    return (
        <div className={styles.messagesPage}>
            <div className={styles.messagesContainer}>
                {/* Chat Sidebar */}
                <ChatSidebar
                    currentUser={currentUser}
                    conversations={conversations}
                    selectedChatId={selectedChatId}
                    onChatSelect={handleChatSelect}
                    onNewChat={handleNewChat}
                    onlineUsers={onlineUsers}
                    className={styles.sidebar}
                />

                {/* Chat Window */}
                <ChatWindow
                    currentUser={currentUser}
                    selectedChat={selectedChat}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onClose={() => setSelectedChatId(null)}
                    isMinimized={isChatMinimized}
                    onToggleMinimize={() =>
                        setIsChatMinimized(!isChatMinimized)
                    }
                    typingUsers={typingUsers}
                    onlineUsers={onlineUsers}
                    className={styles.chatWindow}
                />
            </div>
        </div>
    );
};

export default Messages;
