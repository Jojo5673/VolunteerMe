'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Post } from '@/types/Post';
import feedStyles from '@/styles/FeedPost.module.css';
import styles from '@/styles/EventPage.module.css';
import { MoreHorizontal } from "lucide-react";
import Link from 'next/link';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EventPage({ params }: EventPageProps) {
  const [id, setId] = useState<string>('');
  const [event, setEvent] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    getParams();
  }, [params]);
  //gets the id from the route (next.js 13 needs this async)

  useEffect(() => {
    if (!id) return; // Don't fetch if we don't have an id yet

    async function fetchEventData() {
      try {
        // Using the same search API but with the event ID to find the specific event
        const response = await fetch(`/api/pinecone?query="${id}"`);
        if (!response.ok) {
          throw new Error('Failed to fetch event data');
        }
        
        const results = await response.json();
        const eventData = results.find((item: { _id: string; fields: Record<string, string>; }) => 
          item._id === id
        );

        if (!eventData) {
          throw new Error('Event not found');
        }

        // Parse the stringified arrays and objects
        const fields = eventData.fields;
        console.log(fields)
        setEvent({
          id: eventData._id,
          title: fields.title,
          post_content: fields.post_content,
          eventDate: fields.eventDate,
          eventTime: fields.eventTime,
          location: fields.location,
          volunteersNeeded: parseInt(fields.volunteersNeeded) || 0,
          requiredSkills: JSON.parse(fields.requiredSkills || '[]'),
          volunteers: JSON.parse(fields.volunteers || '[]'),
          comments: JSON.parse(fields.comments || '[]')
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventData();
  }, [id]);

  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingBar}></div>
          <div className={styles.loadingContent}>
            <div className={styles.loadingLine}></div>
            <div className={styles.loadingLine}></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Error</h2>
          <p className={styles.errorMessage}>{error || 'Event not found'}</p>
          <Link href="/" className={styles.homeLink}>
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={`card ${feedStyles.card}`}>
        {/* Event header */}
        <div className={feedStyles.header}>
          <div className={feedStyles.authorSection}>
            <div className={`avatar ${feedStyles.avatar}`}>
              {/* Event organizer initials or icon could go here */}
            </div>
            
            <div className={feedStyles.authorInfo}>
              <h1 className={styles.pageTitle}>
                {event.title}
              </h1>
            </div>
          </div>

          <button className={feedStyles.moreButton}>
            <MoreHorizontal className={feedStyles.icon} />
          </button>
        </div>

        {/* Event content */}
        <div className={feedStyles.content}>
          <div className={styles.eventContent}>
            <p>{event.post_content}</p>
          </div>

          {/* Event details */}
          <div className={styles.eventDetails}>
            <div className={styles.detailSection}>
              <h3>Date & Time</h3>
              <p>{new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}</p>
            </div>
            <div className={styles.detailSection}>
              <h3>Location</h3>
              <p>{event.location}</p>
            </div>
            <div className={styles.detailSection}>
              <h3>Volunteers Needed</h3>
              <p>{event.volunteersNeeded - event.volunteers.length} spots remaining</p>
            </div>
            <div className={styles.detailSection}>
              <h3>Required Skills</h3>
              <div className={styles.skillsList}>
                {event.requiredSkills.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Volunteer section */}
          <div className={styles.volunteerSection}>
            <h3 className={styles.volunteerTitle}>
              Current Volunteers ({event.volunteers.length})
            </h3>
            <div className={styles.volunteerList}>
              {event.volunteers.map((volunteer, index) => (
                <span key={index} className={styles.volunteerTag}>
                  {volunteer.userName}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action button */}
        <div>
          <button 
            className={styles.actionButton}
            disabled={event.volunteers.length >= event.volunteersNeeded}
            onClick={async () => {
              try {
                // In a real app, get these from your auth system
                const userId = "user123";
                const userName = "John Doe";

                const response = await fetch('/api/events', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    eventId: id,
                    action: 'volunteer',
                    data: { userId, userName }
                  })
                });

                if (!response.ok) throw new Error('Failed to sign up');
                
                const updatedEvent = await response.json();
                setEvent(updatedEvent);
              } catch (err) {
                setError('Failed to sign up for the event');
              }
            }}
          >
            {event.volunteers.length >= event.volunteersNeeded 
              ? 'Event Full' 
              : 'Sign Up to Volunteer'}
          </button>
        </div>

        {/* Comments section */}
        <div className={styles.commentsSection}>
          <h3 className={styles.commentsTitle}>Comments & Questions</h3>
          
          {/* Comment form */}
          <div className={styles.commentForm}>
            <textarea 
              className={styles.commentInput}
              placeholder="Add a comment or question..."
              rows={3}
              onChange={(e) => {
                // You can add state for the comment text if needed
              }}
            />
            <button 
              className={styles.commentButton}
              onClick={async () => {
                try {
                  // In a real app, get these from your auth system
                  const userId = "user123";
                  const userName = "John Doe";
                  const content = "Sample comment"; // Get this from state in real app

                  const response = await fetch('/api/events', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      eventId: id,
                      action: 'comment',
                      data: { userId, userName, content }
                    })
                  });

                  if (!response.ok) throw new Error('Failed to add comment');
                  
                  const updatedEvent = await response.json();
                  setEvent(updatedEvent);
                } catch (err) {
                  setError('Failed to add comment');
                }
              }}
            >
              Post Comment
            </button>
          </div>

          {/* Comments list */}
          <div className={styles.commentsList}>
            {event.comments.map((comment) => (
              <div key={comment.id} className={styles.commentCard}>
                <div className={styles.commentHeader}>
                  <h4 className={styles.commentAuthor}>{comment.userName}</h4>
                  <span className={styles.commentTime}>
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className={styles.commentContent}>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}