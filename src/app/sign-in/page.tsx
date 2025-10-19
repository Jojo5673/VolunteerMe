"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from 'next/navigation';
import "@/app/auth.css";

interface FormData {
    email: string;
    password: string;
}

export default function SignInPage() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const router = useRouter()
    const [SignInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await SignInWithEmailAndPassword(formData.email, formData.password);
            console.log(res);
            sessionStorage.setItem('user', 'true')
            setFormData({
                email: "",
                password: "",
            });
            router.push("/")
        } catch (e) {
      console.log(e)
    }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1 className="signup-title">Log into VolunteerMe</h1>
                <p className="signup-subtitle">Sign in to continue making an impact</p>

                <form className="signup-form" onSubmit={handleSubmit}>
                   <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />

                    <button type="submit" className="signup-btn">
                        Sign In
                    </button>
                </form>

                <p className="signup-footer">
                    Dont have an account? <a href="/sign-up">Sign Up</a>
                </p>
            </div>
        </div>
    );
}
