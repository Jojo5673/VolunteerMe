import { ThumbsUp, MessageCircle, Repeat2, Send, MoreHorizontal } from "lucide-react";
import styles from "../styles/FeedPost.module.css";
import Link from "next/link";

/**
 * FeedPost Component
 * Individual post card in the main feed
 * Shows author info, content, and engagement actions
 */
interface FeedPostProps {
  id: string;
  title: string;
  post_content: string;
}

export function FeedPost({
  id,
  title,
  post_content
}: FeedPostProps) {
  return (
    <Link href={`/event/${id}`} className={`card ${styles.card} cursor-pointer transition-transform hover:scale-[1.02]`}>
      {/* Post header - Author info */}
      <div className={styles.header}>
        <div className={styles.authorSection}>
          <div className={`avatar ${styles.avatar}`}>
            {} {/*  initials */}
          </div>
          
          <div className={styles.authorInfo}>
            <h4 className={styles.authorName}>
              {title}
            </h4>
            {/* <p className={styles.headline}>{headline}</p>
            <p className={styles.timeAgo}>{timeAgo}</p> */}
          </div>
        </div>

        {/* More options button */}
        <button className={styles.moreButton}>
          <MoreHorizontal className={styles.icon} />
        </button>
      </div>

      {/* Post content */}
      <div className={styles.content}>
        <p>{post_content}</p>
      </div>

      {/* Engagement stats
      <div className={styles.stats}>
        <span className={styles.stat}>
          {likes} likes
        </span>
        <span className={styles.stat}>
          {comments} comments
        </span>
      </div>

      {/* Action buttons 
      <div className={styles.actions}>
        <button className={styles.actionButton}>
          <ThumbsUp className={styles.icon} />
          <span>Like</span>
        </button>
        
        <button className={styles.actionButton}>
          <MessageCircle className={styles.icon} />
          <span>Comment</span>
        </button>
        
        <button className={styles.actionButton}>
          <Repeat2 className={styles.icon} />
          <span>Repost</span>
        </button>
        
        <button className={styles.actionButton}>
          <Send className={styles.icon} />
          <span>Send</span>
        </button>
      </div> */}

    </Link>
  );
}
