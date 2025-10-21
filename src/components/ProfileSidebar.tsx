import styles from "../styles/ProfileSidebar.module.css";

/**
 * ProfileSidebar Component
 * Left sidebar showing user profile summary
 * Displays avatar, name, headline, and profile stats
 */
export function ProfileSidebar() {
  return (
    <div className={styles.container}>
      {/* Main profile card */}
      <div className={`card ${styles.profileCard}`}>
        {/* Profile banner */}
        <div className={styles.banner} />
        
        {/* Profile content */}
        <div className={styles.profileContent}>
          {/* Avatar positioned to overlap banner */}
          <div className={styles.avatarContainer}>
            <div className={`avatar ${styles.avatar}`}>
              JD
            </div>
          </div>

          {/* User info */}
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>John Doe</h3>
            <p className={styles.userHeadline}>
              Software Engineer | React & TypeScript
            </p>
          </div>

          {/* Profile stats */}
          <div className={styles.stats}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Profile viewers</span>
              <span className={styles.statValue}>142</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Post impressions</span>
              <span className={styles.statValue}>1,247</span>
            </div>
          </div>

          {/* Premium CTA */}
          <button className={`button button-outline ${styles.premiumButton}`}>
            Try Premium
          </button>
        </div>
      </div>

      {/* Recent activity card */}
      <div className={`card ${styles.recentCard}`}>
        <h4 className={styles.recentTitle}>Recent</h4>
        <div className={styles.recentList}>
          {["JavaScript Developers", "React Community", "TypeScript Tips"].map((item) => (
            <button key={item} className={styles.recentItem}>
              # {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
