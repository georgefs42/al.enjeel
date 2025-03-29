import React, { useState, useEffect } from "react";
import supabase from "../supabase";
import './Css/VideosSection.css'; // Import your CSS file

const VideosSection = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase.from("videos").select("*");
    if (!error) setVideos(data);
  };

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

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setEditId(null);
  };

  return (
    <section>
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
              <iframe
                src={`https://www.youtube.com/embed/${video.url.split("v=")[1]}`}
                title="YouTube video"
                allowFullScreen
              />
            </div>
            <button onClick={() => setEditId(video.id)}>Edit</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideosSection;
