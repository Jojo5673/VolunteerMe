"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "../styles/ThemeToggle.module.css";

/**
 * ThemeToggle Component
 * Provides a button to toggle between light and dark mode
 * Updates the document root class and persists preference to localStorage
 */
export function ThemeToggle() {
  // State to track current theme - defaults to 'dark'
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Initialize theme from localStorage or system preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    
    // Apply theme class to document root
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  /**
   * Toggle between light and dark mode
   * Updates DOM and persists choice to localStorage
   */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Update document class for theme
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label="Toggle theme"
    >
      {/* Show sun icon in dark mode, moon in light mode */}
      {theme === "dark" ? (
        <Sun className={styles.icon} />
      ) : (
        <Moon className={styles.icon} />
      )}
    </button>
  );
}
