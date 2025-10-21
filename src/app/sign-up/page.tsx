"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "../../lib/firebaseConfig";
import "../../styles/auth.css";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";

interface FormData {
	name: string;
	email: string;
	password: string;
	role: string;
}

export default function SignupPage() {
	const router = useRouter();
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		password: "",
		role: "volunteer",
	});

	// FIXED: Properly destructure all return values including error and loading
	const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
	const [signupError, setSignupError] = useState<string>("");

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
		setSignupError(""); // Clear errors when user types
	};

	// Verifies organization email is a valid one
	const isOrgEmailValid = (email: string) => {
		const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
		const domain = email.split("@")[1]?.toLowerCase();
		return domain && !commonDomains.includes(domain);
	};

	// Form handler
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSignupError("");

		try {
			// Validate organization email
			if (formData.role === "organization" && !isOrgEmailValid(formData.email)) {
				setSignupError("Please use a valid organization email address (not Gmail, Yahoo, etc).");
				return;
			}

			console.log("Creating user with email:", formData.email);

			// Create Firebase Auth account
			const userCredential = await createUserWithEmailAndPassword(formData.email, formData.password);
			
			console.log("User credential:", userCredential);

			if (!userCredential || !userCredential.user) {
				throw new Error("Failed to create user account");
			}

			const newUser = userCredential.user;
			console.log("✅ User created successfully:", newUser.uid);

			// Update Firebase Auth display name
			const { updateProfile } = await import("firebase/auth");
			await updateProfile(newUser, {
				displayName: formData.name
			});
			console.log("✅ Display name updated");

			// Save user profile to Firestore in "users" collection
			await setDoc(doc(db, "users", newUser.uid), {
				name: formData.name,
				email: formData.email,
				role: formData.role,
				createdAt: new Date(),
			});

			console.log("✅ User profile saved to Firestore");

			// If volunteer, also create volunteer profile
			if (formData.role === "volunteer") {
				await setDoc(doc(db, "volunteers", newUser.uid), {
					displayName: formData.name,
					email: formData.email,
					totalHours: 0,
					eventsAttended: [],
					interests: [],
					bio: "",
					joinDate: new Date(),
				});
				console.log("✅ Volunteer profile created");
			}

			sessionStorage.setItem("user", "true");
			
			// Clear form
			setFormData({ name: "", email: "", password: "", role: "volunteer" });
			
			console.log("✅ Redirecting to home...");
			router.push("/");
		} catch (err: any) {
			console.error("❌ Error signing up:", err);
			console.error("Error code:", err.code);
			console.error("Error message:", err.message);
			
			// User-friendly error messages
			let errorMessage = "Error creating account. Please try again.";
			
			if (err.code === "auth/email-already-in-use") {
				errorMessage = "This email is already registered. Please sign in instead.";
			} else if (err.code === "auth/weak-password") {
				errorMessage = "Password should be at least 6 characters.";
			} else if (err.code === "auth/invalid-email") {
				errorMessage = "Please enter a valid email address.";
			} else if (err.message) {
				errorMessage = err.message;
			}
			
			setSignupError(errorMessage);
		}
	};

	// Actual form
	return (
		<div className="signup-container">
			<div className="signup-card">
				<h1 className="signup-title">Join VolunteerMe</h1>
				<p className="signup-subtitle">Create an account to start making an impact</p>

				{/* Show error message if exists */}
				{(signupError || error) && (
					<div style={{
						padding: '12px',
						background: '#fee',
						border: '1px solid #fcc',
						borderRadius: '8px',
						marginBottom: '16px',
						color: '#c33'
					}}>
						<strong>Error:</strong> {signupError || error?.message}
					</div>
				)}

				<form className="signup-form" onSubmit={handleSubmit}>
					<label htmlFor="role">I am a:</label>
					<select 
						id="role" 
						value={formData.role} 
						onChange={handleChange} 
						required
						disabled={loading}
					>
						<option value="volunteer">Volunteer</option>
						<option value="organization">Organization</option>
					</select>

					<label htmlFor="name">Full Name</label>
					<input 
						type="text" 
						id="name" 
						placeholder="John Doe" 
						value={formData.name} 
						onChange={handleChange} 
						required 
						disabled={loading}
					/>

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
						minLength={6}
					/>

					<button type="submit" className="signup-btn" disabled={loading}>
						{loading ? "Creating account..." : "Sign Up"}
					</button>
				</form>

				<p className="signup-footer">
					Already have an account? <a href="/sign-in">Log in</a>
				</p>
			</div>
		</div>
	);
}