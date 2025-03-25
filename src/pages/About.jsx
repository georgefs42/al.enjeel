import React, { useState, useEffect } from "react";
import supabase from "../supabase"; // Make sure supabase client is correctly initialized
import "../styles/about.css"; // Make sure the CSS file exists

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch existing About page content from Supabase
  const fetchAboutData = async () => {
    const { data, error } = await supabase.from("about").select("*").single();
    if (error) {
      setMessage(`Error fetching about data: ${error.message}`);
    } else {
      setAboutData(data);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  return (
    <div className="about-container">
      <div className="card">
        <h1>{aboutData ? aboutData.title : "جاري التحميل..."}</h1>
        <div>
          {aboutData ? (
            <p>{aboutData.body}</p>
          ) : (
            <p>جاري تحميل المحتوى...</p>
          )}
        </div>
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default About;
