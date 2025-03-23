import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import Body from './components/Body';
import Footer from './components/Footer';
import supabase from './supabase';

function App() {
  const [videos, setVideos] = useState([]); // Stores all videos
  const [filteredVideos, setFilteredVideos] = useState([]); // Stores search results
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

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
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredVideos(videos); // If no search query, show all videos
      return;
    }

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .ilike('description', `%${searchQuery}%`); // Search by description

    if (error) {
      console.error('Error fetching videos:', error);
    } else {
      setFilteredVideos(data); // Update state with search results
    }
  };

  return (
    <div>
      <Sidebar />
      <Hero />
      <Body />
      <Footer />
    </div>
  );
}

export default App;
