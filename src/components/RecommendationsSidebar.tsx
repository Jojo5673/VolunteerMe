import styles from "../styles/RecommendationsSidebar.module.css";

/**
 * RecommendationsSidebar Component
 * Right sidebar showing news and connection suggestions
 * Similar to LinkedIn's "LinkedIn News" and "Add to your feed" sections
 */
export function RecommendationsSidebar() {
  // Sample news items
  const newsItems = [
    { title: "Tech layoffs continue", time: "2h ago", readers: "1,234" },
    { title: "AI trends in 2024", time: "5h ago", readers: "5,678" },
    { title: "Remote work debate", time: "1d ago", readers: "892" },
  ];

  // Sample connection suggestions
  const suggestions = [
    { name: "Sarah Johnson", title: "Product Manager", mutual: 12 },
    { name: "Mike Chen", title: "UX Designer", mutual: 8 },
    { name: "Emily Davis", title: "Data Scientist", mutual: 5 },
  ];

  return (
    <div className={styles.container}>
      {/* News feed card */}
      <div className={`card ${styles.card}`}>
        <h4 className={styles.title}>LinkedIn News</h4>
        <div className={styles.newsList}>
          {newsItems.map((item, index) => (
            <button key={index} className={styles.newsItem}>
              <h5 className={styles.newsTitle}>
                {item.title}
              </h5>
              <p className={styles.newsInfo}>
                {item.time} • {item.readers} readers
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Connection suggestions card */}
      <div className={`card ${styles.card}`}>
        <h4 className={styles.title}>Add to your feed</h4>
        <div className={styles.suggestionsList}>
          {suggestions.map((person, index) => (
            <div key={index} className={styles.suggestionItem}>
              {/* Avatar */}
              <div className={`avatar ${styles.avatar}`}>
                {person.name.split(" ").map(n => n[0]).join("")}
              </div>
              
              {/* Person info */}
              <div className={styles.personInfo}>
                <h5 className={styles.personName}>
                  {person.name}
                </h5>
                <p className={styles.personTitle}>
                  {person.title}
                </p>
                <p className={styles.mutualConnections}>
                  {person.mutual} mutual connections
                </p>
              </div>
              
              {/* Follow button */}
              <button className={styles.followButton}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
