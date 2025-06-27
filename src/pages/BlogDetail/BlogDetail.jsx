import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  BlogContent,
  AuthorInfo,
  RelatedPosts,
  CommentSection,
  Loading
} from '../../components';

// Mock data for demonstration
const mockBlogPost = {
  id: 1,
  title: "Understanding React Hooks: A Comprehensive Guide",
  content: `
    <p>React Hooks have revolutionized the way we write React components. They allow us to use state and other React features without writing a class component.</p>
    
    <h2>What are React Hooks?</h2>
    <p>Hooks are functions that let you "hook into" React state and lifecycle features from function components. They don't work inside classes — they let you use React without classes.</p>
    
    <h3>The most commonly used hooks include:</h3>
    <ul>
      <li><strong>useState</strong> - For adding state to functional components</li>
      <li><strong>useEffect</strong> - For performing side effects</li>
      <li><strong>useContext</strong> - For consuming context values</li>
      <li><strong>useReducer</strong> - For complex state management</li>
      <li><strong>useMemo</strong> - For memoizing expensive calculations</li>
      <li><strong>useCallback</strong> - For memoizing functions</li>
    </ul>
    
    <h2>useState Hook</h2>
    <p>The useState hook is the most basic hook. It allows you to add state to functional components:</p>
    
    <pre><code>import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
    
    <h2>useEffect Hook</h2>
    <p>The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined in React classes.</p>
    
    <blockquote>
      <p>Remember: React will run the effects after every render — including the first render.</p>
    </blockquote>
    
    <h2>Best Practices</h2>
    <p>When using React Hooks, keep these best practices in mind:</p>
    <ul>
      <li>Only call hooks at the top level of your React function</li>
      <li>Don't call hooks inside loops, conditions, or nested functions</li>
      <li>Use the ESLint plugin for hooks to catch mistakes</li>
      <li>Extract custom hooks for reusable logic</li>
    </ul>
    
    <p>React Hooks provide a more direct API to the React concepts you already know. They offer a powerful and expressive way to write React components while keeping them simple and easy to understand.</p>
  `,
  author: {
    name: "John Smith",
    title: "Senior Frontend Developer",
    bio: "Passionate about React, JavaScript, and modern web development. I love sharing knowledge and helping developers build amazing user experiences.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    social: {
      twitter: "https://twitter.com/johnsmith",
      github: "https://github.com/johnsmith",
      linkedin: "https://linkedin.com/in/johnsmith",
      website: "https://johnsmith.dev"
    },
    postsCount: 24,
    followers: 1250,
    following: 180
  },
  publishedAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-16T14:20:00Z",
  readTime: 8,
  topic: "React",
  tags: ["React", "JavaScript", "Frontend", "Hooks", "Web Development"],
  featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
};

const mockRelatedPosts = [
  {
    id: 2,
    title: "Advanced React Patterns You Should Know",
    excerpt: "Explore advanced React patterns including render props, higher-order components, and compound components.",
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
    author: {
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    publishedAt: "2024-01-12T09:15:00Z",
    readTime: 12,
    topic: "React"
  },
  {
    id: 3,
    title: "State Management in React: Context vs Redux",
    excerpt: "Compare different state management solutions and learn when to use each approach in your React applications.",
    featuredImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
    author: {
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    publishedAt: "2024-01-10T16:45:00Z",
    readTime: 10,
    topic: "React"
  },
  {
    id: 4,
    title: "Building Responsive Components with CSS-in-JS",
    excerpt: "Learn how to create responsive and maintainable React components using modern CSS-in-JS libraries.",
    featuredImage: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop",
    author: {
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    publishedAt: "2024-01-08T11:20:00Z",
    readTime: 7,
    topic: "CSS"
  }
];

const mockComments = [
  {
    id: 1,
    author: {
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    content: "Great article! I've been using React Hooks for a while now, and this guide really helps clarify some of the more advanced concepts. The useState examples are particularly helpful for beginners.",
    createdAt: "2024-01-15T14:30:00Z",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 2,
        author: {
          name: "John Smith",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        content: "Thank you! I'm glad you found it helpful. I'll be writing more about advanced hook patterns soon.",
        createdAt: "2024-01-15T15:45:00Z",
        likes: 5,
        isLiked: true,
        replies: []
      }
    ]
  },
  {
    id: 3,
    author: {
      name: "Lisa Park",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    content: "Could you write a follow-up article about custom hooks? I'm still struggling with when and how to create them effectively.",
    createdAt: "2024-01-15T16:20:00Z",
    likes: 8,
    isLiked: false,
    replies: []
  },
  {
    id: 4,
    author: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    content: "The useEffect explanation is spot on. I wish I had this guide when I was first learning React Hooks. The best practices section is golden!",
    createdAt: "2024-01-15T18:10:00Z",
    likes: 15,
    isLiked: true,
    replies: []
  }
];

const BlogDetail = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [isAuthenticated] = useState(true); // Mock authentication

  useEffect(() => {
    // Simulate API call
    const loadPost = async () => {
      setLoading(true);
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPost(mockBlogPost);
        setRelatedPosts(mockRelatedPosts);
        setComments(mockComments);
      } catch (error) {
        console.error('Failed to load post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const handleAddComment = async (content) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newComment = {
      id: Date.now(),
      author: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
      },
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    };
    
    setComments(prev => [newComment, ...prev]);
  };

  const handleReplyComment = async (parentId, content) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newReply = {
      id: Date.now(),
      author: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
      },
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    };
    
    setComments(prev => prev.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...comment.replies, newReply] }
        : comment
    ));
  };

  const handleLikeComment = async (commentId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <Loading size="lg" text="Loading article..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1>Article not found</h1>
        <p>The article you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Main Article */}
      <BlogContent {...post} />
      
      {/* Author Info */}
      <div style={{ margin: '4rem 0' }}>
        <AuthorInfo author={post.author} />
      </div>
      
      {/* Related Posts */}
      <RelatedPosts posts={relatedPosts} />
      
      {/* Comments */}
      <CommentSection
        comments={comments}
        onAddComment={handleAddComment}
        onReplyComment={handleReplyComment}
        onLikeComment={handleLikeComment}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default BlogDetail;
