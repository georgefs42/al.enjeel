import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import "../styles/VideoAdmin.css";

const VideoAdmin = ({ onLogout }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState({}); // Store comments for each video by video id
  const [allComments, setAllComments] = useState([]); // Store all comments here
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null); // Track if editing an existing video

  // Fetch videos from Supabase
  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase.from('videos').select('*');
      if (error) {
        console.error('Error fetching videos:', error);
        setMessage('Error fetching videos.');
      } else {
        setVideos(data);
        // Fetch comments for each video after loading videos
        data.forEach((video) => fetchComments(video.id));
      }
    } catch (err) {
      console.error('An error occurred:', err);
      setMessage('An error occurred while fetching videos.');
    }
  };

  // Fetch comments for a specific video (you can keep this function for specific video comments)
  const fetchComments = async (videoId) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('video_id', videoId);

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments((prevComments) => ({
          ...prevComments,
          [videoId]: data,
        }));
      }
    } catch (err) {
      console.error('An error occurred while fetching comments:', err);
    }
  };

  // Fetch all comments from Supabase (this is where we get all comments)
  const fetchAllComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false }); // Optionally order comments by creation time

      if (error) {
        console.error('Error fetching all comments:', error);
      } else {
        setAllComments(data); // Set all comments here
      }
    } catch (err) {
      console.error('An error occurred while fetching all comments:', err);
    }
  };

  // Handle delete comment for all comments
  const handleDeleteComment = async (commentId) => {
    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);
      if (error) throw error;
      // Refetch all comments after deletion
      fetchAllComments(); 
      setMessage('Comment deleted successfully!');
    } catch (err) {
      console.error('Error deleting comment:', err);
      setMessage('An error occurred while deleting the comment.');
    }
  };

  // Add or update a video
  const handleSaveVideo = async () => {
    if (!title || !url || !description) {
      setMessage('Please fill out all fields.');
      return;
    }

    try {
      if (editId) {
        // Update existing video
        const { error } = await supabase
          .from('videos')
          .update({ title, url, description })
          .eq('id', editId);

        if (error) throw error;
        setMessage('Video updated successfully!');
      } else {
        // Insert new video
        const { error } = await supabase.from('videos').insert([{ title, url, description }]);
        if (error) throw error;
        setMessage('Video added successfully!');
      }

      fetchVideos(); // Refresh list
      setTitle('');
      setUrl('');
      setDescription('');
      setEditId(null);
    } catch (err) {
      console.error('Error saving video:', err);
      setMessage('An error occurred while saving.');
    }
  };

  // Delete a video
  const handleDeleteVideo = async (id) => {
    try {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
      fetchVideos(); // Refresh list
    } catch (err) {
      console.error('Error deleting video:', err);
      setMessage('An error occurred while deleting.');
    }
  };

  // Edit an existing video
  const handleEditVideo = (video) => {
    setTitle(video.title);
    setUrl(video.url);
    setDescription(video.description);
    setEditId(video.id);
  };

  // Function to render videos based on the URL (YouTube, TikTok, or local)
  const renderVideoPlayer = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S+\/?\S*?\/))([^&?=\/\n]*)/);
      return (
        <iframe
          width="320"
          height="240"
          src={`https://www.youtube.com/embed/${videoId ? videoId[1] : ''}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    } else if (url.includes('tiktok.com')) {
      const videoId = url.match(/(?:https?:\/\/(?:www\.)?tiktok\.com\/(?:@[^\/]+\/video\/))(\d+)/);
      return (
        <iframe
          width="320"
          height="240"
          src={`https://www.tiktok.com/embed/${videoId ? videoId[1] : ''}`}
          title="TikTok video player"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      );
    } else {
      return (
        <video width="320" height="240" controls>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchAllComments(); // Fetch all comments when the component mounts
  }, []);

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <button className="logout-btn" onClick={onLogout}>Logout</button>

      <h3>{editId ? 'Edit Video' : 'Add New Video'}</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Video URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Live video preview */}
      {url && (
        <div className="video-preview">
          <h4>Video Preview</h4>
          {renderVideoPlayer(url)}
        </div>
      )}

      <button onClick={handleSaveVideo}>
        {editId ? 'Update Video' : 'Add Video'}
      </button>

      {message && <p className="message">{message}</p>}

      <h3>Existing Videos</h3>
      <ul className="video-list">
        {videos.length === 0 ? (
          <li>No videos found</li>
        ) : (
          videos.map((video) => (
            <li key={video.id} className="video-item">
              <h4>{video.title}</h4>
              <div className="video-frame">
                {renderVideoPlayer(video.url)}
              </div>
              <p>{video.description}</p>
              <div className="video-actions">
                <button className="edit-btn" onClick={() => handleEditVideo(video)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteVideo(video.id)}>Delete</button>
              </div>

              {/* Display Comments for the Video */}
              {comments[video.id] && comments[video.id].length > 0 && (
                <div className="comments-section">
                  <h5>Comments</h5>
                  <ul>
                    {comments[video.id].map((comment) => (
                      <li key={comment.id}>
                        <p>{comment.content}</p>
                        <button onClick={() => handleDeleteComment(comment.id)}>
                          Delete Comment
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))
        )}
      </ul>

      {/* Show all comments */}
      <h2>All Comments</h2>
      <ul className="all-comments-list">
        {allComments.length === 0 ? (
          <li>No comments available</li>
        ) : (
          allComments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.comment_text}</p>
              <span>{new Date(comment.created_at).toLocaleString()}</span>
              {/* Admin delete functionality */}
              <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              {comment.is_deleted && <span>(Deleted)</span>}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default VideoAdmin;
