import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar component
import Footer from '../components/Footer'; // Import Footer component
import HeroImage from '../components/HeroImage';
import supabase from '../supabase'; // Import Supabase client
import '../styles/videos.css'; // Custom styles for the Videos page

const VideoList = () => {
  const [videos, setVideos] = useState([]); // State to store the videos
  const [loading, setLoading] = useState(true); // Loading state for async data fetching
  const [error, setError] = useState(null); // Error handling state

  // Fetch videos data from Supabase when the component mounts
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);  // Start loading
      try {
        const { data, error } = await supabase.from('videos').select('*'); // Query the 'videos' table
        if (error) throw error;
        setVideos(data);  // Set the data if no error
      } catch (err) {
        setError(err.message);  // Set the error message if an error occurs
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchVideos();
  }, []);

  // Function to render the video (either YouTube, TikTok, or MP4)
  const renderVideo = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Embed YouTube video
      return (
        <iframe
          width="300"
          height="200"
          src={`https://www.youtube.com/embed/${getYouTubeVideoId(url)}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    } else if (url.includes('tiktok.com')) {
      // Embed TikTok video
      return (
        <iframe
          width="300"
          height="200"
          src={`https://www.tiktok.com/embed/${getTikTokVideoId(url)}`}
          title="TikTok video player"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      );
    } else {
      // Default case for other video types (direct MP4, for example)
      return (
        <video width="300" controls>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  // Extract the YouTube video ID from the URL
  const getYouTubeVideoId = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S+\/?\S*?\/))([^&?=\/\n]*)/;
    const match = url.match(regex);
    return match && match[1];
  };

  // Extract the TikTok video ID from the URL
  const getTikTokVideoId = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?tiktok\.com\/(?:@[^\/]+\/video\/))(\d+)/;
    const match = url.match(regex);
    return match && match[1];
  };

  return (
    <div className="videos-page">
      {/* Render Navbar for this page */}
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h2>Video Gallery</h2>
          <p>Browse through a collection of amazing videos!</p>
        </div>
      </section>

      <section className="videos-section">
        {loading && <p>Loading videos...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <div className="video-gallery">
          {videos.length === 0 ? (
            <p>No videos available</p>
          ) : (
            videos.map((video) => (
              <div className="video-item" key={video.id}>
                <h3>{video.title}</h3>
                {renderVideo(video.url)} {/* Render video dynamically */}
                <p>{video.description}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Render Footer for this page */}
      <Footer />
    </div>
  );
};

export default VideoList;
