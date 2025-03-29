import React, { useState, useEffect, useRef } from "react";
import supabase from "../supabase";
import AboutSection from "./AboutSection";
import SlidesSection from "./SlidesSection";
import VideosSection from "./VideosSection";
import './Css/AdminMain.css'; // Import your CSS file

const AdminMain = ({ onLogout }) => {
  const [comments, setComments] = useState([]);
  const commentsRef = useRef(null);
  const slidesRef = useRef(null);
  const videosRef = useRef(null);
  const aboutRef = useRef(null);

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
    fetchComments();
  };

  // Scroll to section function
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
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
        <button onClick={() => scrollToSection(aboutRef)}>Edit About</button>
      </div>

      {/* Sections */}
      <section ref={aboutRef}>
        <AboutSection />
      </section>

      <section ref={slidesRef}>
        <SlidesSection />
      </section>

      <section ref={videosRef}>
        <VideosSection />
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

export default AdminMain;
