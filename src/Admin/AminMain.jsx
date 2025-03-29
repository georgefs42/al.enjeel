// src/components/AdminMain.jsx

import React, { useRef } from "react";
import AboutSection from "./AboutSection";
import SlidesSection from "./SlidesSection";
import VideosSection from "./VideosSection";
import CommentsAdmin from "./CommentsSection"; // Import the new CommentsAdmin component
import './Css/AdminMain.css'; // Import your CSS file

const AdminMain = ({ onLogout }) => {
  const slidesRef = useRef(null);
  const videosRef = useRef(null);
  const aboutRef = useRef(null);
  const commentsRef = useRef(null);

  // Scroll to section function
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <button className="logout-btn" onClick={onLogout}>Logout</button>

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
        <CommentsAdmin /> {/* Use the CommentsAdmin component here */}
      </section>
    </div>
  );
};

export default AdminMain;
