import { Image, Calendar, FileText } from "lucide-react";
import styles from "../styles/CreatePost.module.css";

/**
 * CreatePost Component
 * Card for creating new posts
 * Provides quick access to post creation features
 */
export function CreatePost() {
  return (
    <div className={`card ${styles.card}`}>
      {/* Post input area */}
      <div className={styles.inputArea}>
        <div className={`avatar ${styles.avatar}`}>
          JD
        </div>
        
        {/* Fake input that would open a modal in real implementation */}
        <button className={styles.fakeInput}>
          <span className={styles.placeholder}>Start a post</span>
        </button>
      </div>
      

      {/* Post type buttons
      <div className={styles.postTypeButtons}>
        <button className={`${styles.postTypeButton} ${styles.photo}`}>
          <Image className={styles.icon} />
          <span>Photo</span>
        </button>
        
        <button className={`${styles.postTypeButton} ${styles.event}`}>
          <Calendar className={styles.icon} />
          <span>Event</span>
        </button>
        
        <button className={`${styles.postTypeButton} ${styles.article}`}>
          <FileText className={styles.icon} />
          <span>Article</span>
        </button>
      </div> */}
    </div>
  );
}
