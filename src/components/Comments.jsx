import React, { useState, useEffect, useRef } from 'react';
import supabase from '../supabase';
import '../styles/Comments.css';

const Comments = ({ isAdmin }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    incrementVisitorCount();
    fetchComments();
  }, []);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop += 1;
        if (scrollRef.current.scrollTop + scrollRef.current.clientHeight >= scrollRef.current.scrollHeight) {
          scrollRef.current.scrollTop = 0;
        }
      }
    }, 50);

    return () => clearInterval(scrollInterval);
  }, [comments]);

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
      <h2>شارك بصلاة أو تعليق  </h2>

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <input
          type="text"
          className="name-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="ادخل اسمك..."
        />
        <textarea
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="أكتب تعليقك هنا..."
        />
        <button type="submit" className="submit-btn">انشـر التعـليق</button>
      </form>

      <div className="comments-list" ref={scrollRef} style={{ maxHeight: '300px', overflow: 'hidden' }}>
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet</p>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id}
              className="comment-item"
              style={{
                background: index % 2 === 0 ? '#f0f0f0' : '#e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                margin: '8px 0',
                padding: '10px',
                transition: 'transform 0.2s',
                fontSize: '16px',
                color: '#333',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <p className="comment-text" style={{ fontWeight: 'bold' }}>{comment.comment_text}</p>
              <span
                className="timestamp"
                style={{ fontSize: '12px', color: '#555' }}
              >
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
            </div>
          ))
        )}
      </div>

      <div className="visitor-count" style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>عدد زوار الصفحة: {visitorCount}</p>
      </div>
    </div>
  );
};

export default Comments;
