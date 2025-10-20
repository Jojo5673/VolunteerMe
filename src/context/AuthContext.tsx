"use client"; // Must be a client component (uses state & hooks)

import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { createContext, useContext, useEffect, useState } from "react";

// Define the shape of our auth context
const AuthContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});

// The provider component wraps the app and manages Firebase auth state
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);   // Firebase user
  const [loading, setLoading] = useState(true);          // Loading state

  useEffect(() => {
    // Listen for changes to Firebase Auth state
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);  // Set the user (null if signed out)
      setLoading(false);      // Done loading
    });

    // Cleanup listener when unmounting
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to auth context
export const useAuth = () => useContext(AuthContext);
