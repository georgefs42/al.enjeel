import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import Body from './components/Body';
import Footer from './components/Footer';
import VideoAdmin from './components/VideoAdmin';
import VideoList from './components/VideoList';
import supabase from './supabase';

function App() {
  const [videos, setVideos] = useState([]); // Stores all videos
  const [filteredVideos, setFilteredVideos] = useState([]); // Stores search results

  // Fetch videos from Supabase
  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase.from('videos').select('*');
      if (error) {
        console.error('Error fetching videos:', error);
      } else {
        setVideos(data);
        setFilteredVideos(data); // Initially, display all videos
      }
    };

    fetchVideos();
  }, []);

  // Handle search by description
  const handleSearch = async (query) => {
    if (!query) {
      setFilteredVideos(videos); // If no search query, show all videos
      return;
    }

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .ilike('description', `%${query}%`); // Search in the description

    if (error) {
      console.error('Error fetching videos:', error);
    } else {
      setFilteredVideos(data); // Update state with search results
    }
  };

  return (
    <div>
      <Sidebar />
      <Hero setVideos={setFilteredVideos} /> {/* Pass search handler */}
      <VideoList videos={filteredVideos} /> {/* Display search results */}
      <Body />
      <Footer />
    </div>
  );
}

export default App;
