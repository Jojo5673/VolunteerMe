"use client";

import styles from "@/styles/ProfileSidebar.module.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";

/**
 * ProfileSidebar Component
 * Left sidebar showing user profile summary with volunteer stats
 */
export function ProfileSidebar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [volunteerData, setVolunteerData] = useState<any>(null);

  useEffect(() => {
    const fetchVolunteerData = async () => {
      if (!user?.uid) return;
      try {
        const volunteerDoc = await getDoc(doc(db, "volunteers", user.uid));
        if (volunteerDoc.exists()) {
          setVolunteerData(volunteerDoc.data());
        }
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
      }
    };

    fetchVolunteerData();
  }, [user?.uid]);

  const profilePath = user ? `/profile/${user.uid}` : undefined;
  const totalHours = volunteerData?.totalHours || 0;
  const eventsCount = volunteerData?.eventsAttended?.length || 0;

  const handleViewProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !user.uid) {
      alert("Please log in to view your profile");
      return;
    }
    if (profilePath) router.push(profilePath);
  };

  const ProfileCard = (
    <div className={`card ${styles.profileCard}`}>
      {/* Profile banner */}
      <div className={styles.banner} />

      {/* Profile content */}
      <div className={styles.profileContent}>
        {/* Avatar */}
        <div className={styles.avatarContainer}>
          {volunteerData?.photoURL ? (
            <img
              src={volunteerData.photoURL}
              alt={user?.displayName || "Profile"}
              className={`avatar ${styles.avatar} ${styles.avatarImage}`}
            />
          ) : (
            <div className={`avatar ${styles.avatar}`}>
              {user?.displayName
                ? user.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                : "JD"}
            </div>
          )}
        </div>

        {/* User info */}
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{user?.displayName ?? "John Doe"}</h3>
          <p className={styles.userHeadline}>{user?.email ?? ""}</p>
        </div>

        {/* Volunteer stats */}
        <div className={styles.stats}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Total volunteer hours</span>
            <span className={styles.statValue}>{totalHours}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Events attended</span>
            <span className={styles.statValue}>{eventsCount}</span>
          </div>
        </div>

        {/* View Profile Button or Login Prompt */}
        {user ? (
          <button
            onClick={handleViewProfile}
            className={`button button-outline ${styles.viewProfileButton}`}
          >
            View Full Profile
          </button>
        ) : (
          <div className={styles.loginPrompt}>
            <p className={styles.loginText}>Log in to view your profile</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {profilePath ? (
        <Link href={profilePath} className={styles.profileLink}>
          {ProfileCard}
        </Link>
      ) : (
        ProfileCard
      )}

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
