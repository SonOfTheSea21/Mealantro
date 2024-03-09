import React, { useState, useEffect } from "react";
import "./NewsfeedHero.css"; // Assuming you have a CSS file for styling
import Thread from "./Thread";
import axios from "axios"; // Import Axios for making HTTP requests
import { useParams } from "react-router-dom";
import TextField from "./TextField";

export default function NewsfeedHero() {
  const [thread, setThread] = useState("");
  const [feed, setFeed] = useState([]);
  const { id } = useParams();

  const handleChange = (event) => {
    setThread(event.target.value);
  };

  const fetchFeed = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/newsfeed/${id}`);
      console.log(response);
      const formattedFeed = response.data.data.map(thread => ({
        poster_id: thread.poster_id,
        thread_id: thread.thread_id,
        profilePictureSrc: thread.user_photo != null ? `http://localhost:5000/profile/image/${thread.user_id}` : null,
        profileName: `${thread.firstname} ${thread.lastname}`,
        profileLink: thread.user_id !== id ? `/profile/${thread.user_id}/${id}` : `/profile/${thread.user_id}`,
        mobileInfo: `From Mobile - ${formatTime(thread.timestamp)}`,
        text: thread.description,
        showImage: thread.media_1 !== null || thread.media_2 !== null || thread.media_3 !== null,
        imageSrc: thread.media_1 || thread.media_2 || thread.media_3,
        showLikes: true, // Assuming likes are always shown
        likesCount: thread.likes,
        showThumbsUpButton: true, // Assuming thumbs up button is always shown
        showThumbsDownButton: true, // Assuming thumbs down button is always shown
        showCommentButton: true, // Assuming comment button is always shown
        isLiked: thread.liked_by_user
    }));
    
      console.log(response)
      setFeed(formattedFeed);
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };
  
  useEffect(() => {
    fetchFeed() // Clean up interval on component unmount
  },[]);
  
  const handlePost = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/newsfeed/${id}`, {
        thread: thread
      });
      console.log("Post successful:", response.data);
      // Optionally, you can reset the thread state after successful posting
      setThread("");
      // Fetch feed data after posting a new thread
      fetchFeed();
    } catch (error) {
      console.error("Error posting thread:", error);
    }
  };
  

  // Function to format timestamp into time ago format (e.g., 5 minutes ago)
  const formatTime = (timestamp) => {
    const currentTime = new Date();
    const threadTime = new Date(timestamp);
    const elapsedTime = currentTime - threadTime;
  
    // Convert elapsed time to seconds
    const seconds = Math.floor(elapsedTime / 1000);
  
    // Define time units
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
  
    // Calculate the appropriate time unit and value
    for (let unit in intervals) {
      const value = Math.floor(seconds / intervals[unit]);
      if (value > 0) {
        return `${value} ${unit}${value !== 1 ? 's' : ''} ago`;
      }
    }
  
    return 'Just now';
  };
  

  return (
    <div className="feed">
      <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet"></link>
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"></link>
      <div className="container bootdey">
        <div className="col-md-12 bootstrap snippets">
        <TextField
            handleChange={handleChange}
            handlePost={handlePost}
            thread={thread}
            placeholder = {"What are you thinking today?"}
          />
          <div className="panel">
            <div className="panel-body">
              {/* Newsfeed Content */}
              {/* =================================================== */}
              {feed.map((thread, index) => (
                <Thread
                  key={index}
                  poster_id = {thread.poster_id}
                  thread_id = {thread.thread_id}
                  profilePictureSrc={thread.profilePictureSrc == null ? "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" : thread.profilePictureSrc}
                  profileName={thread.profileName}
                  profileLink={thread.profileLink}
                  mobileInfo={thread.mobileInfo}
                  text={thread.text}
                  showImage={thread.showImage}
                  imageSrc={thread.imageSrc}
                  showLikes={thread.showLikes}
                  likesCount={thread.likesCount}
                  showThumbsUpButton={thread.showThumbsUpButton}
                  showThumbsDownButton={thread.showThumbsDownButton}
                  showCommentButton={thread.showCommentButton}
                  fetchThreads = {fetchFeed}
                  isLiked = {thread.isLiked}
                  id = {id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
