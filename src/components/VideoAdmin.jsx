import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import "../styles/VideoAdmin.css";

const VideoAdmin = ({ onLogout }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [videos, setVideos] = useState([]);
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
      }
    } catch (err) {
      console.error('An error occurred:', err);
      setMessage('An error occurred while fetching videos.');
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

  useEffect(() => {
    fetchVideos();
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
          <video width="320" height="240" controls>
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
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
                <video width="320" height="240" controls>
                  <source src={video.url} type="video/mp4" />
                </video>
              </div>
              <p>{video.description}</p>
              <div className="video-actions">
                <button className="edit-btn" onClick={() => handleEditVideo(video)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteVideo(video.id)}>Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default VideoAdmin;
