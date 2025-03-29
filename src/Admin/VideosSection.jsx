import React, { useState, useEffect } from "react";
import supabase from "../supabase";
import "./Css/VideosSection.css"; // Import CSS

const VideosSection = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch videos on load
  useEffect(() => {
    fetchVideos();
  }, []);

  // Fetch videos from Supabase
  const fetchVideos = async () => {
    const { data, error } = await supabase.from("videos").select("*");
    if (!error) setVideos(data);
  };

  // Add or Edit Video
  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!title || !url || !description) return;

    const videoData = { title, url, description };

    if (editId) {
      // Update existing video
      await supabase.from("videos").update(videoData).eq("id", editId);
    } else {
      // Insert new video
      await supabase.from("videos").insert([videoData]);
    }

    fetchVideos(); // Refresh videos
    resetForm();
  };

  // Delete Video
  const handleDelete = async (id) => {
    await supabase.from("videos").delete().eq("id", id);
    fetchVideos();
  };

  // Reset form after submit
  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setEditId(null);
  };

  // Embed video (YouTube & TikTok support)
  const getVideoEmbed = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          allowFullScreen
        />
      );
    } else if (url.includes("tiktok.com")) {
      return (
        <blockquote className="tiktok-embed" cite={url} data-video-id={url.split("/").pop()}>
          <a href={url}>Watch on TikTok</a>
        </blockquote>
      );
    }
    return <p>Invalid Video URL</p>;
  };

  return (
    <section id="videos-section">
      <h3>{editId ? "Edit Video" : "Add New Video"}</h3>
      <form id="video-form" onSubmit={handleSaveVideo}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">{editId ? "Update Video" : "Add Video"}</button>
      </form>
      
      <div id="video-container">
        {videos.map((video) => (
          <div key={video.id} className="video-item">
            <h4>{video.title}</h4>
            <p>{video.description}</p>
            <div className="video-frame">{getVideoEmbed(video.url)}</div>
            <div className="button-group">
              <button className="edit-button" onClick={() => {
                setEditId(video.id);
                setTitle(video.title);
                setUrl(video.url);
                setDescription(video.description);
              }}>
                Edit
              </button>
              <button className="delete-button" onClick={() => handleDelete(video.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideosSection;
