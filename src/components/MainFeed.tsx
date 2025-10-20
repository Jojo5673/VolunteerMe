import { CreatePost } from "./CreatePost";
import { FeedPost } from "./FeedPost";
import styles from "../styles/MainFeed.module.css";

/**
 * MainFeed Component
 * Central content area displaying post creation and feed
 * Shows posts in reverse chronological order
 */
export function MainFeed() {
  // Sample feed data
  const posts = [
    {
      id: 1,
      author: "Sarah Johnson",
      initials: "SJ",
      headline: "Senior Product Manager at Tech Corp",
      timeAgo: "2h ago",
      content: "Excited to share that our team just launched a new feature that will help thousands of users! 🚀\n\nBig thanks to the amazing engineering team for making this possible.",
      likes: 42,
      comments: 8,
    },
    {
      id: 2,
      author: "Mike Chen",
      initials: "MC",
      headline: "UX Designer | Design Systems Advocate",
      timeAgo: "5h ago",
      content: "Just finished an incredible design thinking workshop. The key takeaway: Always start with empathy. Understanding your users deeply is the foundation of great design.\n\nWhat's your favorite design principle?",
      likes: 127,
      comments: 23,
    },
    {
      id: 3,
      author: "Emily Davis",
      initials: "ED",
      headline: "Data Scientist @ AI Innovations",
      timeAgo: "1d ago",
      content: "Machine learning models are only as good as the data you feed them. Here are 3 tips for better data quality:\n\n1. Clean your data thoroughly\n2. Remove biases where possible\n3. Validate your assumptions\n\nWhat other tips would you add?",
      likes: 89,
      comments: 15,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Create post card */}
      <CreatePost />

      {/* Feed posts */}
      {posts.map((post) => (
        <FeedPost key={post.id} {...post} />
      ))}
    </div>
  );
}
