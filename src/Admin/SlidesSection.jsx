import React, { useState, useEffect } from "react";
import supabase from "../supabase";
import './Css/SlidesSection.css'; // Assuming you have a CSS file for styling

const SlidesSection = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [description, setDescription] = useState("");
  const [slides, setSlides] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from("slides")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setSlides(data);
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    if (!title || !url || !description || !linkUrl) return;

    const slideData = { title, description, image_url: url, link_url: linkUrl };
    if (editId) {
      await supabase.from("slides").update(slideData).eq("id", editId);
    } else {
      await supabase.from("slides").insert([slideData]);
    }
    fetchSlides();
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setLinkUrl("");
    setDescription("");
    setEditId(null);
  };

  const handleEditSlide = (slide) => {
    setTitle(slide.title);
    setDescription(slide.description);
    setUrl(slide.image_url);
    setLinkUrl(slide.link_url);
    setEditId(slide.id);
  };

  const handleDeleteSlide = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this slide?");
    if (confirmDelete) {
      await supabase.from("slides").delete().eq("id", id);
      fetchSlides();
    }
  };

  return (
    <section>
      <h3>{editId ? "Edit Slide" : "Add New Slide"}</h3>
      <form onSubmit={handleSaveSlide}>
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
          placeholder="Image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Link URL"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
        />
        <button type="submit">{editId ? "Update Slide" : "Add Slide"}</button>
      </form>

      <div className="slides-list">
        {slides.map((slide) => (
          <div key={slide.id} className="slide-item">
            <img src={slide.image_url} alt={slide.title} />
            <h3>{slide.title}</h3>
            <p>{slide.description}</p>
            {slide.link_url && (
              <a href={slide.link_url} target="_blank" rel="noopener noreferrer">
                Go to Link
              </a>
            )}
            <button onClick={() => handleEditSlide(slide)}>Edit</button>
            <button onClick={() => handleDeleteSlide(slide.id)}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SlidesSection;