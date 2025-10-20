"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebaseConfig";



export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

//ensure you cant skip login to go to dashboard
  useEffect(() => {
      if (!loading && !user) router.push("/sign-in");
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // Avoid flicker during redirect

  //handle logout (might move this)
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  return (
      <div>
        <h2>Welcome, {user.email}</h2>
        <button onClick={handleLogout}>Sign Out</button>
      </div>
    );
}

