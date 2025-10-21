"use client";

import { Home, Users, Briefcase, MessageSquare, Bell } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import styles from "../styles/Navigation.module.css";

/**
 * Navigation Component
 * Top navigation bar with navigation items and theme toggle
 * Provides navigation across the application
 */
export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  // Navigation items with icons, labels, and routes
  const navItems = [
    { icon: Home, label: "Home", route: "/dashboard" },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navContent}>
          {/* Center section - Navigation items */}
          <div className={styles.centerSection}>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.route)}
                className={`${styles.navItem} ${pathname === item.route ? styles.active : ""}`}
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