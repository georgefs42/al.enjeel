import React, { useState, useEffect } from "react";
import supabase from "../supabase";
import "./Css/AboutSection.css"; // Import the CSS file

const AboutSection = () => {
  const [about, setAbout] = useState({ id: null, title: "", body: "" });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    const { data, error } = await supabase.from("about").select("*").limit(1);
    if (!error && data.length > 0) setAbout(data[0]);
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    if (about.id) {
      await supabase
        .from("about")
        .update({ title: about.title, body: about.body })
        .eq("id", about.id);
    } else {
      await supabase.from("about").insert([{ title: about.title, body: about.body }]);
    }
    fetchAbout();
  };

  return (
    <section id="about-section">
      <h3>Edit About Section</h3>
      <form onSubmit={handleSaveAbout} className="about-form">
        <input
          type="text"
          placeholder="Title"
          value={about.title}
          onChange={(e) => setAbout({ ...about, title: e.target.value })}
        />
        <textarea
          placeholder="Body Text"
          value={about.body}
          onChange={(e) => setAbout({ ...about, body: e.target.value })}
        />
        <button type="submit">{about.id ? "Update About" : "Add About"}</button>
      </form>
    </section>
  );
};

export default AboutSection;
