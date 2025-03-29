import React, { useState, useEffect } from 'react';
import supabase from '../supabase'; 
import '../styles/videos.css'; 

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('videos').select('*');
        if (error) throw error;
        setVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) => {
    return (
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const renderVideo = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${getYouTubeVideoId(url)}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    } else if (url.includes('tiktok.com')) {
      return (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.tiktok.com/embed/${getTikTokVideoId(url)}`}
          title="TikTok video player"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      );
    } else {
      return (
        <video width="100%" controls>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  const getYouTubeVideoId = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S+\/?\S*?\/))([^&?=\/\n]*)/;
    const match = url.match(regex);
    return match && match[1];
  };

  const getTikTokVideoId = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?tiktok\.com\/(?:@[^\/]+\/video\/))(\d+)/;
    const match = url.match(regex);
    return match && match[1];
  };

  return (
    <div className="videos-page">
      {/* Navbar removed */}

      <section className="videos">
        <div className="videos-content">
          <h2>معرض الفيديوهات</h2>
        </div>
      </section>

      <section className="search-section">
        <input
          type="text"
          className="search-bar"
          placeholder="...ابحث عن فيديو"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      <section className="videos-section">
        {loading && <p>Loading videos...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <div className="video-gallery">
          {filteredVideos.length === 0 ? (
            <p>No videos found</p>
          ) : (
            filteredVideos.map((video) => (
              <div className="video-item" key={video.id}>
                <h3>{video.title}</h3>
                <div className="video-player">
                  {renderVideo(video.url)}
                </div>
                {/* <p>{video.description}</p> */}
                
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Videos;
