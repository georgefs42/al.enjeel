import React, { useState, useEffect } from "react";
import supabase from "../supabase";
import "./Css/CommentsSection.css"; // Import CSS

const CommentsSection = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setComments(data);
  };

  const handleDeleteComment = async (id) => {
    await supabase.from("comments").delete().eq("id", id);
    fetchComments(); // Refresh comments
  };

  return (
    <section id="comments-section">
      <h3>All Comments</h3>
      <ul id="comments-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <p className="comment-text">{comment.comment_text}</p>
            <span className="comment-date">
              {new Date(comment.created_at).toLocaleString()}
            </span>
            <button
              className="delete-button"
              onClick={() => handleDeleteComment(comment.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CommentsSection;
