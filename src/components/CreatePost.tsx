"use client";

import { useEffect, useState } from "react";
import { Image, Calendar, FileText } from "lucide-react";
import styles from "../styles/CreatePost.module.css";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

/**
 * CreatePost Component
 * - Shows a simple 'start a post' UI for volunteers
 * - For users with role === 'organization' it shows a form to create volunteer opportunity posts
 */
export function CreatePost() {
  const { user, loading } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  // Org form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load user role from Firestore (users collection) when auth ready
  useEffect(() => {
    let mounted = true;
    const loadRole = async () => {
      if (!user) {
        if (mounted) setRole(null);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as any;
          if (mounted) setRole(data.role ?? null);
        } else {
          if (mounted) setRole(null);
        }
      } catch (err) {
        console.error("Error loading user role:", err);
        if (mounted) setRole(null);
      }
    };

    if (!loading) loadRole();

    return () => {
      mounted = false;
    };
  }, [user, loading]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setDate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be signed in to create a post.");
      return;
    }

    if (role !== "organization") {
      alert("Only organization accounts can create volunteer opportunities.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      alert("Please provide a title and description for the opportunity.");
      return;
    }

    setSubmitting(true);
    setSuccessMessage(null);

    try {
      const postsCol = collection(db, "posts");
      await addDoc(postsCol, {
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || null,
        date: date || null,
        isOpportunity: true,
        authorId: user.uid,
        authorEmail: user.email ?? null,
        createdAt: serverTimestamp(),
      });

      setSuccessMessage("Opportunity posted successfully.");
      resetForm();
    } catch (err) {
      console.error("Error creating opportunity post:", err);
      alert("There was an error creating the post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading placeholder while auth state is loading
  if (loading) {
    return (
      <div className={`card ${styles.card}`}>
        <div className={styles.inputArea}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={`card ${styles.card}`}>
      {/* If user is organization, show opportunity creation form */}
      {role === "organization" ? (
        <form className={styles.orgForm} onSubmit={handleSubmit}>
          <h3>Create a volunteer opportunity</h3>

          <label className={styles.label}>Title</label>
          <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Opportunity title" required />

          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the opportunity" required />

          <div className={styles.row}>
            <div>
              <label className={styles.label}>Location</label>
              <input className={styles.input} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, address, or remote" />
            </div>

            <div>
              <label className={styles.label}>Date</label>
              <input className={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className={styles.actionsRow}>
            <button type="submit" className={styles.postBtn} disabled={submitting}>
              {submitting ? "Posting..." : "Post Opportunity"}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={resetForm} disabled={submitting}>
              Cancel
            </button>
          </div>

          {successMessage && <p className={styles.success}>{successMessage}</p>}
        </form>
      ) : (
        // Volunteer / non-org UI: simplified start-post button
        <>
          <div className={styles.inputArea}>
            <div className={`avatar ${styles.avatar}`}>{(user?.displayName || "").split(" ").map(n=>n[0]).slice(0,2).join("") || "U"}</div>
            <button className={styles.fakeInput} onClick={() => alert("Post creation coming soon for volunteers.")}> 
              <span className={styles.placeholder}>Start a post</span>
            </button>
          </div>

          <div className={styles.postTypeButtons}>
            <button className={`${styles.postTypeButton} ${styles.photo}`}>
              <Image className={styles.icon} />
              <span>Photo</span>
            </button>

            <button className={`${styles.postTypeButton} ${styles.event}`}>
              <Calendar className={styles.icon} />
              <span>Event</span>
            </button>

            <button className={`${styles.postTypeButton} ${styles.article}`}>
              <FileText className={styles.icon} />
              <span>Article</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
