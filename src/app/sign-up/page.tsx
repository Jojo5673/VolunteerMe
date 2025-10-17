'use client'

import { useState, ChangeEvent, FormEvent } from "react";
import "./page.css";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("User submitted:", formData);
    alert(`Welcome, ${formData.name}!`);
    // Example: send data to your backend or Firebase Auth here
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Join VolunteerMe</h1>
        <p className="signup-subtitle">
          Create an account to start making an impact
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}
