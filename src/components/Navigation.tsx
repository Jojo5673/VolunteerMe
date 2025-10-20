import { Home, Users, Briefcase, MessageSquare, Bell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import styles from "../styles/Navigation.module.css";

/**
 * Navigation Component
 * Top navigation bar with logo, navigation items, and theme toggle
 * Similar to LinkedIn's main navigation structure
 */
export function Navigation() {
  // Navigation items with icons and labels
  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Users, label: "Network", active: false },
    { icon: Briefcase, label: "Jobs", active: false },
    { icon: MessageSquare, label: "Messaging", active: false },
    { icon: Bell, label: "Notifications", active: false },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navContent}>
          {/* Left section - Logo */}
          <div className={styles.leftSection}>
            <div className={styles.logo}>in</div>
          </div>

          {/* Center section - Navigation items */}
          <div className={styles.centerSection}>
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`${styles.navItem} ${item.active ? styles.active : ""}`}
              >
                <item.icon className={styles.navIcon} />
                <span className={styles.navLabel}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right section - Theme toggle */}
          <div className={styles.rightSection}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
