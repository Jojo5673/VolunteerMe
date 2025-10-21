"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import styles from "@/styles/VolunteerProfile.module.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { Navigation } from "@/components/Navigation";

// Define the volunteer profile type
interface VolunteerProfile {
  id: string;
  displayName?: string;
  photoURL?: string;
  email?: string;
  totalHours?: number;
  eventsAttended?: any[];
  interests?: string[];
  bio?: string;
  joinDate?: any;
}

/**
 * Volunteer Profile Page
 * Displays complete volunteer information including hours, events, interests, and bio
 * Allows editing if viewing own profile
 */
export default function VolunteerProfilePage() {
  const params = useParams();
  const volunteerId = params?.id as string;
  const { user } = useAuth();
  
  const [volunteer, setVolunteer] = useState<VolunteerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // Edit form states
  const [editBio, setEditBio] = useState("");
  const [editInterests, setEditInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [editPhotoURL, setEditPhotoURL] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if this is the current user"s profile
  const isOwnProfile = user?.uid === volunteerId;

  useEffect(() => {
    const fetchVolunteerProfile = async () => {
      if (!volunteerId) return;
      
      try {
        const volunteerDoc = await getDoc(doc(db, "volunteers", volunteerId));
        
        if (volunteerDoc.exists()) {
          const data = { id: volunteerDoc.id, ...volunteerDoc.data() };
          
          // Calculate total hours from events
          const calculatedHours = data.eventsAttended?.reduce((total: number, event: any) => {
            return total + (event.hoursContributed || 0);
          }, 0) || 0;
          
          // Update Firestore if calculated hours don"t match stored hours
          if (calculatedHours !== data.totalHours) {
            console.log(`Updating total hours from ${data.totalHours} to ${calculatedHours}`);
            await updateDoc(doc(db, "volunteers", volunteerId), {
              totalHours: calculatedHours
            });
            data.totalHours = calculatedHours;
          }
          
          setVolunteer(data);
          setEditBio(data.bio || "");
          setEditInterests(data.interests || []);
          setEditPhotoURL(data.photoURL || "");
        }
      } catch (error) {
        console.error("Error fetching volunteer profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerProfile();
  }, [volunteerId]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    console.log("=== Photo Upload Started ===");
    console.log("File selected:", file);
    console.log("Volunteer ID:", volunteerId);
    
    if (!file) {
      console.log("No file selected");
      return;
    }
    
    if (!volunteerId) {
      console.log("No volunteer ID");
      alert("Error: No volunteer ID found");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.log("Invalid file type:", file.type);
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 2MB for base64)
    if (file.size > 2 * 1024 * 1024) {
      console.log("File too large:", file.size);
      alert("Image must be less than 2MB");
      return;
    }

    setUploadingPhoto(true);
    console.log("Converting image to base64...");
    
    try {
      // Convert image to base64
      const reader = new FileReader();
      
      reader.onload = (event) => {
        console.log("FileReader onload triggered");
        const base64String = event.target?.result as string;
        console.log("Base64 string length:", base64String?.length);
        
        if (base64String) {
          console.log("✅ Image converted to base64 successfully");
          
          // Update local state
          setEditPhotoURL(base64String);
          setUploadingPhoto(false);
          
          alert("Photo selected! Click Save to apply changes.");
        } else {
          console.error("❌ Base64 string is empty");
          alert("Error: Could not read image file");
          setUploadingPhoto(false);
        }
      };
      
      reader.onerror = (error) => {
        console.error("❌ FileReader error:", error);
        alert("Error reading image file. Please try again.");
        setUploadingPhoto(false);
      };
      
      reader.onabort = () => {
        console.error("❌ FileReader aborted");
        setUploadingPhoto(false);
      };
      
      // Add timeout safeguard
      setTimeout(() => {
        if (uploadingPhoto) {
          console.error("❌ Upload timeout - taking too long");
          setUploadingPhoto(false);
          alert("Upload took too long. Please try a smaller image.");
        }
      }, 10000); // 10 second timeout
      
      // Read file as base64
      console.log("Starting FileReader.readAsDataURL...");
      reader.readAsDataURL(file);
      
    } catch (error: any) {
      console.error("❌ Error processing photo:", error);
      alert(`Error processing photo: ${error.message}`);
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!volunteerId) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, "volunteers", volunteerId), {
        bio: editBio,
        interests: editInterests,
        photoURL: editPhotoURL,
      });
      
      // Update local state
      setVolunteer({
        ...volunteer,
        bio: editBio,
        interests: editInterests,
        photoURL: editPhotoURL,
      });
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditBio(volunteer?.bio || "");
    setEditInterests(volunteer?.interests || []);
    setEditPhotoURL(volunteer?.photoURL || "");
    setIsEditing(false);
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !editInterests.includes(newInterest.trim())) {
      setEditInterests([...editInterests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setEditInterests(editInterests.filter(i => i !== interest));
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  if (!volunteer) {
    return (
      <>
        <Navigation />
        <div className={styles.errorContainer}>
          <h2>Volunteer Not Found</h2>
          <p>The volunteer profile you"re looking for doesn"t exist.</p>
        </div>
      </>
    );
  }

  const {
    displayName = "Unknown Volunteer",
    photoURL,
    email,
    totalHours = 0,
    eventsAttended = [],
    interests = [],
    bio = "",
    joinDate,
  } = volunteer;

  // Generate initials for avatar fallback
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={styles.page}>
      {/* Top navigation bar */}
      <Navigation />

      <div className={styles.pageContainer}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroBanner} />
          
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrapper}>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: "none" }}
              />
              
              <div className={styles.avatarContainer}>
                {(isEditing ? editPhotoURL : photoURL) ? (
                  <img 
                    src={isEditing ? editPhotoURL : photoURL} 
                    alt={displayName} 
                    className={styles.profileAvatar}
                  />
                ) : (
                  <div className={styles.profileAvatarFallback}>
                    {initials}
                  </div>
                )}
                
                {/* Upload button overlay when editing */}
                {isOwnProfile && isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.uploadPhotoButton}
                    disabled={uploadingPhoto}
                    type="button"
                  >
                    {uploadingPhoto ? (
                      <span className={styles.uploadingSpinner}>⏳</span>
                    ) : (
                      <>📷 Change Photo</>
                    )}
                  </button>
                )}
              </div>
            </div>
            
            <div className={styles.headerInfo}>
              <h1 className={styles.profileName}>{displayName}</h1>
              <p className={styles.profileEmail}>{email}</p>
              {joinDate && (
                <p className={styles.joinDate}>
                  Volunteer since {new Date(joinDate.toDate ? joinDate.toDate() : joinDate).toLocaleDateString("en-US", { 
                    month: "long", 
                    year: "numeric" 
                  })}
                </p>
              )}
            </div>

            {/* Edit Button - only show on own profile */}
            {isOwnProfile && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                ✏️ Edit Profile
              </button>
            )}

            {/* Save/Cancel buttons when editing */}
            {isOwnProfile && isEditing && (
              <div className={styles.editActions}>
                <button 
                  onClick={handleSave}
                  className={styles.saveButton}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "💾 Save"}
                </button>
                <button 
                  onClick={handleCancel}
                  className={styles.cancelButton}
                  disabled={saving}
                >
                  ✖️ Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.contentGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Stats Card */}
            <div className={`card ${styles.statsCard}`}>
              <h2 className={styles.sectionTitle}>Volunteer Stats</h2>
              <div className={styles.statsList}>
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>⏱️</div>
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{totalHours}</span>
                    <span className={styles.statLabel}>Total Hours</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>📅</div>
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{eventsAttended.length}</span>
                    <span className={styles.statLabel}>Events Attended</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>💚</div>
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{isEditing ? editInterests.length : interests.length}</span>
                    <span className={styles.statLabel}>Interests</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interests Card */}
            <div className={`card ${styles.interestsCard}`}>
              <h2 className={styles.sectionTitle}>Interests</h2>
              
              {!isEditing ? (
                // View mode
                interests.length > 0 ? (
                  <div className={styles.interestsTags}>
                    {interests.map((interest: string, index: number) => (
                      <span key={index} className={styles.interestTag}>
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyState}>No interests added yet</p>
                )
              ) : (
                // Edit mode
                <div className={styles.editInterestsContainer}>
                  <div className={styles.interestsTags}>
                    {editInterests.map((interest: string, index: number) => (
                      <span key={index} className={styles.interestTagEditable}>
                        {interest}
                        <button 
                          onClick={() => handleRemoveInterest(interest)}
                          className={styles.removeInterestBtn}
                        >
                          ✖
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className={styles.addInterestForm}>
                    <input
                      type="text"
                      placeholder="Add new interest..."
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddInterest()}
                      className={styles.interestInput}
                    />
                    <button 
                      onClick={handleAddInterest}
                      className={styles.addInterestBtn}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* About Section */}
            <div className={`card ${styles.aboutCard}`}>
              <h2 className={styles.sectionTitle}>About</h2>
              
              {!isEditing ? (
                // View mode
                bio ? (
                  <p className={styles.bioText}>{bio}</p>
                ) : (
                  <p className={styles.emptyState}>No bio added yet</p>
                )
              ) : (
                // Edit mode
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className={styles.bioTextarea}
                  rows={6}
                />
              )}
            </div>

            {/* Events Attended */}
            <div className={`card ${styles.eventsCard}`}>
              <h2 className={styles.sectionTitle}>Events Attended</h2>
              {eventsAttended.length > 0 ? (
                <div className={styles.eventsList}>
                  {eventsAttended.map((event: any, index: number) => (
                    <div key={index} className={styles.eventItem}>
                      <div className={styles.eventIcon}>🎯</div>
                      <div className={styles.eventDetails}>
                        <h4 className={styles.eventName}>{event.name}</h4>
                        <p className={styles.eventDate}>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                        {event.hoursContributed && (
                          <span className={styles.eventHours}>
                            {event.hoursContributed} hours
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyState}>No events attended yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}