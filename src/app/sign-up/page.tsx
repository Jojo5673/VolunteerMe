"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import "@/app/auth.css";
import { db } from "@/app/firebase/config";
import {doc,setDoc} from "firebase/firestore"; 
import { useRouter } from "next/navigation";

interface FormData {
	name: string;
	email: string;
	password: string;
	role: string;
}

//default values in field
export default function SignupPage() {
  const router = useRouter();
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		password: "",
		role: "volunteer",
	});

	const [CreateUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	//verifies organization email is a valid one 
	const isOrgEmailValid = (email: string) => {
    	const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
    	const domain = email.split("@")[1]?.toLowerCase();
   		return domain && !commonDomains.includes(domain);
    };

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	

    try {
      if (formData.role === "organization" && !isOrgEmailValid(formData.email)) {
        alert("Please use a valid organization email address (not Gmail, Yahoo, etc).");
        return;
      }

      const userCredential = await CreateUserWithEmailAndPassword(formData.email, formData.password);
      const user = userCredential?.user;

      if (!user) throw new Error("User not created");

      // Save user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date(),
      });

      sessionStorage.setItem("user", "true");
      setFormData({ name: "", email: "", password: "", role: "volunteer" });

      router.push("/");
     } 
	  catch (error) {
      	console.error("Error signing up:", error);
     	alert("Error creating account. Please try again.");
      }
	
	};

	//for the signup container
	return (
		<div className="signup-container">
			<div className="signup-card">
				<h1 className="signup-title">Join VolunteerMe</h1>
				<p className="signup-subtitle">Create an account to start making an impact</p>

				<form className="signup-form" onSubmit={handleSubmit}>

					<label htmlFor="role">I am a:</label>
					<select id="role" value={formData.role} onChange={handleChange} required>
						<option value="volunteer">Volunteer</option>
						<option value="organization">Organization</option>
					</select>	

					<label htmlFor="name">Full Name</label>
					<input type="text" id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />

					<label htmlFor="email">Email</label>
					<input type="email" id="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />

					<label htmlFor="password">Password</label>
					<input type="password" id="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
					
					<button type="submit" className="signup-btn">
						Sign Up
					</button>
				</form>

				<p className="signup-footer">
					Already have an account? <a href="/sign-in">Log in</a>
				</p>
			</div>
		</div>
	);
}
