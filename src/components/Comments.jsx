import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import '../styles/Comments.css';

const Comments = ({ isAdmin }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);

  // Fetch comments and increment visitor count
  useEffect(() => {
    incrementVisitorCount();
    fetchComments();
  }, []);

  // Increment visitor count
  const incrementVisitorCount = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('visitor_count, id')
        .order('id', { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;

      const newCount = (data.visitor_count || 0) + 1;
      setVisitorCount(newCount);

      await supabase
        .from('comments')
        .update({ visitor_count: newCount })
        .eq('id', data.id);
    } catch (err) {
      console.error('Error incrementing visitor count:', err);
    }
  };

  // Fetch comments from Supabase
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  // Handle new comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;

    try {
      const commentWithName = `${userName}: ${newComment}`;
      const { error } = await supabase
        .from('comments')
        .insert([{ comment_text: commentWithName }]);

      if (error) throw error;

      setNewComment('');
      setUserName('');
      fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Handle comment deletion (admin only)
  const handleDeleteComment = async (id) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;

      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <div className="comments-container">
      <h2>Comments</h2>

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <input
          type="text"
          className="name-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
        />
        <textarea
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit" className="submit-btn">Post</button>
      </form>

      <ul className="comments-list">
        {comments.length === 0 ? (
          <li className="no-comments">No comments yet</li>
        ) : (
          comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <p className="comment-text">{comment.comment_text}</p>
              <span className="timestamp">
                {new Date(comment.created_at).toLocaleString('sv-SE', {
                  timeZone: 'Europe/Stockholm',
                  hour12: false,
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>

              {isAdmin && !comment.is_deleted && (
                <button className="delete-btn" onClick={() => handleDeleteComment(comment.id)}>
                  Delete
                </button>
              )}

              {comment.is_deleted && <span className="deleted-label">Deleted</span>}
            </li>
          ))
        )}
      </ul>

      <div className="visitor-count" style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>عدد زوار الصفحة: {visitorCount}</p>
      </div>
    </div>
  );
};

export default Comments;
