"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
	const [user] = useAuthState(auth);
	const router = useRouter();
	const [userSession, setUserSession] = useState<string | null>(null);

  //checks session storage on page load
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    setUserSession(storedUser);
  }, []);

  useEffect(() => {
    if (!user && !userSession) {
      router.push("/sign-in");
    } else {
		router.push("/dashboard"); //if we logged in we go dashboard
	}
  }, [user, userSession, router]);

  if (!user && !userSession) {
    return null; // prevents flash before redirect
  } //MAYBE MAKE IT SHOW A LOADING ANIMATION INSTEAD

	// useEffect(() => {
	// 	// When auth status is known, decide where to go
	// 	if (user) {
	// 		// If user is signed in go to dashboard
	// 		router.push("/dashboard");
	// 	} else {
	// 		// If user not signed in go to sign-in page
	// 		router.push("/sign-in");
	// 	}
	// }, [user, loading, router]);


  //boiler plate
	// return (
	// 	<div className={styles.page}>
	// 		<main className={styles.main}>
	// 			<Image className={styles.logo} src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
	// 			<ol>
	// 				<li>
	// 					Get started by editing <code>src/app/page.tsx</code>.
	// 				</li>
	// 				<li>Save and see your changes instantly.</li>
	// 			</ol>
	// 			<button
	// 				onClick={() => {
	// 					signOut(auth);
    //         sessionStorage.removeItem('user')
	// 				}}
	// 			>
	// 				Log out
	// 			</button>
	// 			<div className={styles.ctas}>
	// 				<a
	// 					className={styles.primary}
	// 					href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
	// 					target="_blank"
	// 					rel="noopener noreferrer"
	// 				>
	// 					<Image className={styles.logo} src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
	// 					Deploy now
	// 				</a>
	// 				<a
	// 					href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
	// 					target="_blank"
	// 					rel="noopener noreferrer"
	// 					className={styles.secondary}
	// 				>
	// 					Read our docs
	// 				</a>
	// 			</div>
	// 		</main>
	// 		<footer className={styles.footer}>
	// 			<a href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
	// 				<Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
	// 				Learn
	// 			</a>
	// 			<a
	// 				href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
	// 				target="_blank"
	// 				rel="noopener noreferrer"
	// 			>
	// 				<Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
	// 				Examples
	// 			</a>
	// 			<a href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
	// 				<Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
	// 				Go to nextjs.org →
	// 			</a>
	// 		</footer>
	// 	</div>
	// );
}
