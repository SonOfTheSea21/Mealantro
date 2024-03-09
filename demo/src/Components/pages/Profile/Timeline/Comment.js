import React, { useState } from "react";
import TextField from "./TextField";
import axios from "axios";

function Comment({ profilePictureSrc, profileName, profileLink, mobileInfo, text, showThumbsUpButton, showThumbsDownButton, showCommentButton, comment_id, thread_id, user_id, replies, fetchComments, likesCount, isLiked, poster_id }) {
  const [reply, setReply] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReply = (e) => {
    e.preventDefault();
    setShowReplyBox((prevReply) => !prevReply);
  };

  const handleReplyPost = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/newsfeed/comment/${thread_id}/${comment_id}/${user_id}`, {
        comment: reply
      });
      console.log("Reply posted successfully:", response.data);
      // Optionally, you can reset the reply state after posting
      setReply("");
      // You might want to fetch updated replies after posting a new reply
      // fetchReplies();
      // Trigger the fetchComments function passed from Thread component
      fetchComments();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleLike = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.put(`http://localhost:5000/newsfeed/comment/${comment_id}/${user_id}`);
      console.log("Like successful:", response.data);
      // Fetch updated comments after liking the comment
      fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDelete = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.delete(`http://localhost:5000/newsfeed/comment/delete/${comment_id}`);
      console.log("Delete successful:", response.data);
      // Optionally, you can update the UI or perform any other action after successful deletion
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
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
            {/* Conditionally render thumbs up or thumbs down button based on isLiked */}
            {isLiked ? (
              <a className="btn btn-sm btn-default btn-hover-success" href="#" onClick={handleLike}><i className="fa fa-thumbs-down"></i></a>
            ) : (
              <a className="btn btn-sm btn-default btn-hover-success" href="#" onClick={handleLike}><i className="fa fa-thumbs-up"></i></a>
            )}
          </div>
          {showThumbsUpButton && <a className="btn btn-sm btn-default btn-hover-primary" href="#">{likesCount}</a>}
          {poster_id === user_id && <a className="btn btn-sm btn-default btn-hover-success" href="#" onClick={handleDelete}><i className="fa fa-trash"></i></a>}
          {showCommentButton && <a className="btn btn-sm btn-default btn-hover-primary" href="#" onClick={handleReply}>Reply</a>}

          {showReplyBox && (
            <TextField
              handleChange={handleReplyChange}
              handlePost={handleReplyPost}
              thread={reply}
              placeholder={"What is your reply?"}
            />
          )}
        </div>
        <hr />
        {replies && replies.length > 0 && (
          <div style={{ marginLeft: "20px" }}>
            {replies.map(reply => (
              <Comment
                key={reply.id}
                profilePictureSrc={reply.profilePictureSrc == null ? "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" : reply.profilePictureSrc}
                profileName={reply.profileName}
                profileLink={reply.profileLink}
                mobileInfo={reply.mobileInfo}
                text={reply.text}
                showThumbsUpButton={reply.showThumbsUpButton}
                showThumbsDownButton={reply.showThumbsDownButton}
                showCommentButton={reply.showCommentButton}
                likesCount={reply.likesCount}
                comment_id={reply.id}
                thread_id={thread_id}
                user_id={user_id}
                replies={reply.replies}
                fetchComments={fetchComments} // Pass the fetchComments function as a prop
                isLiked={reply.isLiked}
                poster_id = {reply.poster_id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
