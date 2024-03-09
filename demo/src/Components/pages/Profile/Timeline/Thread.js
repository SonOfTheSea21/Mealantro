import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import TextField from "./TextField";
import axios from "axios";
import { color } from "framer-motion";

function Thread({ profilePictureSrc, profileName, profileLink, mobileInfo, text, showThumbsUpButton, showThumbsDownButton, showCommentButton, likesCount, thread_id, id, fetchThreads, isLiked, poster_id }) {
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, [fetchThreads]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/newsfeed/comment/${thread_id}/${id}`);
      console.log("Comments fetched successfully:", response.data);
      
      const formattedComments = response.data.data.map(comment => ({
        parent_id: comment.parent_id !== null ? comment.parent_id : null,
        id: comment.comment_id, // Assuming comment_id is the unique identifier
        profilePictureSrc: comment.user_photo !=null ? `http://localhost:5000/profile/image/${comment.user_id}`: null,
        profileName: `${comment.firstname} ${comment.lastname}`, // Assuming firstname and lastname are available
        profileLink: comment.poster_id !== id ? `/profile/${comment.poster_id}/${id}` : `/profile/${comment.poster_id}`, // Assuming user_id is available
        mobileInfo: `From Mobile - ${formatTime(comment.timestamp)}`, // Assuming timestamp is available
        text: comment.description, // Assuming description is available
        likesCount: comment.likes,
        showThumbsUpButton: true, // Assuming thumbs up button is always shown
        showThumbsDownButton: true, // Assuming thumbs down button is always shown
        showCommentButton: true, // Assuming comment button is always shown
        replies: [], // Array to hold nested comments
        isLiked: comment.liked_by_user,
        poster_id: comment.poster_id
      }));
      
      
      const nestedComments = constructNestedComments(formattedComments);
      console.log("Nested Comments")
      console.log(nestedComments);
      setComments(nestedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const constructNestedComments = (comments) => {
    const commentMap = new Map();

    comments.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    const nestedComments = [];
    comments.forEach(comment => {
      if (comment.parent_id) {
        const parentComment = commentMap.get(comment.parent_id);
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      } else {
        nestedComments.push(comment);
      }
    });

    return nestedComments;
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleComment = (e) => {
    e.preventDefault();
    setShowCommentBox(prevComment => !prevComment);
  };

  const handleCommentPost = async () => {
    console.log(comment);
    try {
      const response = await axios.post(`http://localhost:5000/newsfeed/comment/${thread_id}/${id}`, {
        comment: comment
      });
      console.log("Post successful:", response.data);
      setComment("");
      setShowCommentBox(false);
      fetchThreads()
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleLike = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.put(`http://localhost:5000/newsfeed/${thread_id}/${id}`);
      console.log("Like successful:", response.data);
      fetchThreads();
    } catch (error) {
      console.error("Error liking thread:", error);
    }
  };

  const handleDelete = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.delete(`http://localhost:5000/newsfeed/delete/${thread_id}`);
      console.log("Delete successful:", response.data);
      // Optionally, you can update the UI or perform any other action after successful deletion
      fetchThreads();
      fetchComments()
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };

  const formatTime = (timestamp) => {
    const currentTime = new Date();
    const threadTime = new Date(timestamp);
    const elapsedTime = currentTime - threadTime;

    const seconds = Math.floor(elapsedTime / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (let unit in intervals) {
      const value = Math.floor(seconds / intervals[unit]);
      if (value > 0) {
        return `${value} ${unit}${value !== 1 ? 's' : ''} ago`;
      }
    }

    return 'Just now';
  };

  return (
    <div className="media-block">
      <a className="media-left" href={profileLink}><img className="img-circle img-sm" alt="Profile Picture" src={profilePictureSrc} /></a>
      <div className="media-body">
        <div className="mar-btm">
          <a href={profileLink} className="btn-link text-semibold media-heading box-inline">{profileName}</a>
          <p className="text-muted text-sm"><i className="fa fa-mobile fa-lg"></i> - {mobileInfo}</p>
        </div>
        <p>{text}</p>
        <div className="pad-ver">
          <div className="btn-group">
            {isLiked ? (
              <a className="btn btn-sm btn-default btn-hover-success" href="#" onClick={handleLike}><i className="fa fa-thumbs-down"></i></a>
            ) : (
              <a className="btn btn-sm btn-default btn-hover-success" href="#" onClick={handleLike}><i className="fa fa-thumbs-up"></i></a>
            )}
            <a className="btn btn-sm btn-default btn-hover-primary" href="#">{likesCount}</a>
            {poster_id == id && <a className="btn btn-sm btn-default btn-hover-success" href="#" onClick={handleDelete}><i className="fa fa-trash"></i></a>}
          </div>
          {showCommentButton && <a className="btn btn-sm btn-default btn-hover-primary" href="#" onClick={handleComment} >Comment</a>}
          {showCommentBox && <TextField
            handleChange={handleCommentChange}
            thread={comment}
            handlePost={handleCommentPost}
            placeholder={"What is your comment?"}
          />}
        </div>
        <hr />
        
        {comments.map((comment) => (
   
          <Comment
            key={comment.id}
            profilePictureSrc={comment.profilePictureSrc == null ? "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" : comment.profilePictureSrc}
            profileName={comment.profileName}
            profileLink={comment.profileLink}
            mobileInfo={comment.mobileInfo}
            text={comment.text}
            likesCount={comment.likesCount}
            showThumbsUpButton={comment.showThumbsUpButton}
            showThumbsDownButton={comment.showThumbsDownButton}
            showCommentButton={comment.showCommentButton}
            replies={comment.replies}
            comment_id={comment.id}
            thread_id={thread_id}
            user_id={id}
            isLiked={comment.isLiked}
            fetchComments={fetchComments}
            poster_id={comment.poster_id}
          />

        ))}
       
      </div>
    </div>
  );
}

export default Thread;
