"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import "../../styles/auth.css";

interface FormData {
    email: string;
    password: string;
}

export default function SignInPage() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const router = useRouter();
    
    // FIXED: Properly destructure all return values including error
    const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
    
    const [loginError, setLoginError] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        // Clear error when user starts typing
        setLoginError("");
    };

    // Form handler
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError(""); // Clear previous errors

        try {
            const res = await signInWithEmailAndPassword(formData.email, formData.password);
            
            console.log("Sign-in response:", res);
            console.log("Error:", error);
            
            // Check if sign-in was successful
            if (res && res.user) {
                console.log("✅ Successfully signed in:", res.user.email);
                sessionStorage.setItem("user", "true");
                
                // Clear form
                setFormData({
                    email: "",
                    password: "",
                });
                
                // Redirect to home
                router.push("/");
            } else {
                // Sign-in failed
                console.error("❌ Sign-in failed");
                setLoginError("Failed to sign in. Please check your credentials.");
            }
        } catch (e: any) {
            console.error("Sign-in error:", e);
            setLoginError(e.message || "An error occurred during sign-in");
        }
    };

    // Actual form
    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1 className="signup-title">Log into VolunteerMe</h1>
                <p className="signup-subtitle">Sign in to continue making an impact</p>

                {/* Show error message if exists */}
                {(loginError || error) && (
                    <div style={{
                        padding: "12px",
                        background: "#fee",
                        border: "1px solid #fcc",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        color: "#c33"
                    }}>
                        <strong>Error:</strong> {loginError || error?.message}
                    </div>
                )}

                <form className="signup-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="you@example.com" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                    />

                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="••••••••" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                    />

                    <button type="submit" className="signup-btn" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="signup-footer">
                    Do not have an account? <a href="/sign-up">Sign Up</a>
                </p>
            </div>
        </div>
    );
}