"use client";
import { FeedPost } from "./FeedPost";
import styles from "../styles/MainFeed.module.css";
import styles2 from "../styles/CreatePost.module.css";
import { useEffect, useState } from "react";
import { Post } from "@/types/Post";



/**
 * MainFeed Component
 * Central content area displaying post creation and feed
 * Shows posts in reverse chronological order
 */
export function MainFeed() {
  // Sample feed data

  const [query,setQuery] = useState('');

  const [posts, setPosts] = useState([] as Post[]);

  useEffect(()=>{
    async function fetchData() {
      const response = await fetch(`/api/pinecone?query="${query}"`); // Relative path to your API route
      const result = (await response.json()).map((item: { _id: any; fields: any; })=>{
        return {
          id:item._id,
          ...item.fields
        }
      });
      setPosts(result);
    }
    fetchData();
  },[query]) 

  return (
    <div className={styles.container}>
      {/* Create post card */}
      <div className={`card ${styles.card}`}>
        {/* Post input area */}
        <div className={styles2.inputArea}>
          {/* search bar input */}
          <input className={styles2.fakeInput} type="email" id="email" placeholder="Find an event" value={query} onChange={(e)=>setQuery(e.target.value)} required />
        </div>
      </div>

      {/* Feed posts */}
      {posts.map((post) => (
        <FeedPost key={post.id} {...post} />
      ))}
    </div>
  );
}
