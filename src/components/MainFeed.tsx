"use client";

import { CreatePost } from "./CreatePost";
import { FeedPost } from "./FeedPost";
import styles from "../styles/MainFeed.module.css";
import { useEffect, useState } from "react";
import { queryDatabase } from "@/lib/manageDB";
import { Post } from "@/types/Post";


/**
 * MainFeed Component
 * Central content area displaying post creation and feed
 * Shows posts in reverse chronological order
 */
export function MainFeed() {
  // Sample feed data

  const [query,setQuery] = useState('');

  const [posts, setPosts] = useState([
    {
      id: '1', 
      title: 'First Post', 
      post_content: 'This is the content of the first post.'
    },
  ]);

  useEffect(()=>{
    queryDatabase(query,2).then((results)=>{
      setPosts(results as unknown as Post[])
    })

  }) 

  return (
    <div className={styles.container}>
      {/* Create post card */}
      <div className={`card ${styles.card}`}>
        {/* Post input area */}
        <div className={styles.inputArea}>
          <div className={`avatar ${styles.avatar}`}>
            JD
          </div>
          
          {/* Fake input that would open a modal in real implementation */}

          <input type="email" id="email" placeholder="you@example.com" value={query} onChange={(e)=>setQuery(e.target.value)} required />
          
          
        </div>
      </div>

      {/* Feed posts */}
      {posts.map((post) => (
        <FeedPost key={post.id} {...post} />
      ))}
    </div>
  );
}
