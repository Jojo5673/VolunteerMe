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
