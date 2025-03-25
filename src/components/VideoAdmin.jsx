import React, { useState, useEffect, useRef } from "react";
import supabase from "../supabase";
import "../styles/VideoAdmin.css";

const VideoAdmin = ({ onLogout }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [slides, setSlides] = useState([]);
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [editId, setEditId] = useState(null);

  // Refs for scrolling
  const slidesRef = useRef(null);
  const videosRef = useRef(null);
  const commentsRef = useRef(null);

  useEffect(() => {
    fetchSlides();
    fetchVideos();
    fetchComments();
    
    // Load TikTok Embed Script
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => document.body.removeChild(script);
  }, []);

  // Fetch slides
  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from("slides")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setSlides(data);
  };

  // Fetch videos
  const fetchVideos = async () => {
    const { data, error } = await supabase.from("videos").select("*");
    if (!error) setVideos(data);
  };

  // Fetch comments
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setComments(data);
  };

  // Save Slide
  const handleSaveSlide = async (e) => {
    e.preventDefault();
    if (!title || !url || !description) return;

    const slideData = { title, description, image_url: url };
    if (editId) {
      await supabase.from("slides").update(slideData).eq("id", editId);
    } else {
      await supabase.from("slides").insert([slideData]);
    }

    fetchSlides();
    resetForm();
  };

  // Save Video
  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!title || !url || !description) return;

    const videoData = { title, url, description };
    if (editId) {
      await supabase.from("videos").update(videoData).eq("id", editId);
    } else {
      await supabase.from("videos").insert([videoData]);
    }

    fetchVideos();
    resetForm();
  };

  // Delete Slide
  const handleDeleteSlide = async (id) => {
    await supabase.from("slides").delete().eq("id", id);
    fetchSlides();
  };

  // Delete Video
  const handleDeleteVideo = async (id) => {
    await supabase.from("videos").delete().eq("id", id);
    fetchVideos();
  };

  // Delete Comment
  const handleDeleteComment = async (id) => {
    await supabase.from("comments").delete().eq("id", id);
    fetchComments();
  };

  // Edit Item
  const handleEdit = (item) => {
    setTitle(item.title);
    setUrl(item.url || item.image_url);
    setDescription(item.description);
    setEditId(item.id);
  };

  // Reset Form
  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setEditId(null);
  };

  // Scroll to section
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  // Extract YouTube Video ID
  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>

      {/* Navigation */}
      <div className="admin-nav">
        <button onClick={() => scrollToSection(slidesRef)}>Add Slides</button>
        <button onClick={() => scrollToSection(videosRef)}>Add Video Gallery</button>
        <button onClick={() => scrollToSection(commentsRef)}>Remove Comments</button>
      </div>

      {/* Slides Section */}
      <section ref={slidesRef}>
        <h3>{editId ? "Edit Slide" : "Add New Slide"}</h3>
        <form onSubmit={handleSaveSlide}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="text" placeholder="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="submit">{editId ? "Update Slide" : "Add Slide"}</button>
        </form>
        <div className="slides-list">
          {slides.map((slide) => (
            <div key={slide.id} className="slide-item">
              <img src={slide.image_url} alt={slide.title} />
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
              <button onClick={() => handleEdit(slide)}>Edit</button>
              <button onClick={() => handleDeleteSlide(slide.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>

      {/* Videos Section */}
      <section ref={videosRef}>
        <h3>{editId ? "Edit Video" : "Add New Video"}</h3>
        <form onSubmit={handleSaveVideo}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="text" placeholder="Video URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="submit">{editId ? "Update Video" : "Add Video"}</button>
        </form>
        <div className="videos-list">
          {videos.map((video) => (
            <div key={video.id} className="video-item">
              <h4>{video.title}</h4>
              <p>{video.description}</p>
              <div className="video-frame">
                {video.url.includes("youtube.com") || video.url.includes("youtu.be") ? (
                  <iframe src={getYouTubeEmbedUrl(video.url)} title="YouTube video" allowFullScreen />
                ) : video.url.includes("tiktok.com") ? (
                  <blockquote className="tiktok-embed" cite={video.url} data-video-id={video.url.split("/").pop()}>
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      View on TikTok
                    </a>
                  </blockquote>
                ) : (
                  <video src={video.url} controls />
                )}
              </div>
              <button onClick={() => handleEdit(video)}>Edit</button>
              <button onClick={() => handleDeleteVideo(video.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>

      {/* Comments Section */}
      <section ref={commentsRef}>
        <h3>All Comments</h3>
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.comment_text}</p>
              <span>{new Date(comment.created_at).toLocaleString()}</span>
              <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default VideoAdmin;
