

/**
 * Index Page
 * Main application page with LinkedIn-style layout
 * Features three-column layout: profile sidebar, main feed, and recommendations
 */
import styles from "../styles/Index.module.css";
import { Navigation } from "@/components/Navigation";
import { ProfileSidebar } from "@/components/ProfileSidebar";
import { MainFeed } from "@/components/MainFeed";
import { RecommendationsSidebar } from "@/components/RecommendationsSidebar";

const Index = () => {
  return (
    <div className={styles.page}>
      {/* Top navigation bar */}
      <Navigation />

      {/* Main content area - Three column layout */}
      <div className={styles.mainContent}>
        <div className={styles.grid}>
          {/* Left sidebar - Profile */}
          <aside className={styles.leftSidebar}>
            <ProfileSidebar />
          </aside>

          {/* Main feed - Center */}
          <main className={styles.mainFeed}>
            <MainFeed />
          </main>

          {/* Right sidebar - Recommendations */}
          <aside className={styles.rightSidebar}>
            <RecommendationsSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Index;
