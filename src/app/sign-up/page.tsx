"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";
import "@/app/auth.css";
import { useRouter } from "next/navigation";

interface FormData {
	name: string;
	email: string;
	password: string;
}

export default function SignupPage() {
  const router = useRouter();
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		password: "",
	});

	const [CreateUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	//form handler
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			//attempt to sign in
			const res = await CreateUserWithEmailAndPassword(formData.email, formData.password);
			console.log(res);
      sessionStorage.setItem('user', 'true')
			setFormData({
				name: "",
				email: "",
				password: "",
			});
      router.push("/");
		} catch (e) {
      console.log(e)
    }
	};

	//actual form
	return (
		<div className="signup-container">
			<div className="signup-card">
				<h1 className="signup-title">Join VolunteerMe</h1>
				<p className="signup-subtitle">Create an account to start making an impact</p>

				<form className="signup-form" onSubmit={handleSubmit}>
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
