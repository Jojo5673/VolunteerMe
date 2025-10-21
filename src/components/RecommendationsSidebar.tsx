import styles from "../styles/RecommendationsSidebar.module.css";

/**
 * RecommendationsSidebar Component
 * Right sidebar showing news and connection suggestions
 * Similar to LinkedIn's "LinkedIn News" and "Add to your feed" sections
 */
export function RecommendationsSidebar() {
  // Sample news items

  // Sample connection suggestions
  const suggestions = [
    { name: "Grace Kennedy", title: "Foundation", mutual: 1200},
    { name: "The UWI", title: "University", mutual: 800 },
    { name: "Sagicor", title: "Bank", mutual: 500 },
  ];

  return (
    <div className={styles.container}>

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
                  {person.mutual} followers
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
