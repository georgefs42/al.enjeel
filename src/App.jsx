import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Body from './components/Body';
import Footer from './components/Footer';
import VideoAdmin from './components/VideoAdmin';
import Podcast from './components/Podcast';
import Partner from './components/Partner';
import Videos from './pages/Videos';
import Login from './components/Login';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem('isAdmin');
    if (storedAdmin === 'true') setIsAdmin(true);
  }, []);

  const handleLogin = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true'); // Store login state
    setShowLogin(false);
    window.location.href = "/admin"; // Redirect to admin
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin'); // Remove login state
    window.location.href = "/"; // Redirect to home
  };

  return (
    <Router>
      <div>
        <Sidebar />

        {/* Always render Navbar on all pages */}
        <Navbar isAdmin={isAdmin} handleAdminClick={() => setShowLogin(true)} onLogout={handleLogout} />

        {/* Routes for different pages */}
        <Routes>
          {/* Home page */}
          <Route path="/" element={
            <>
              <Hero />
              <Body />
              <Footer /> {/* Add Footer here for the homepage */}
            </>
          } />

          {/* Other routes */}
          <Route path="/videos" element={
            <>
              <Videos />
              <Footer /> {/* Footer for the /videos page */}
            </>
          } />
          
          <Route path="/podcast" element={
            <>
              <Podcast />
              <Footer /> {/* Footer for the /podcast page */}
            </>
          } />
          
          <Route path="/partner" element={
            <>
              <Partner />
              <Footer /> {/* Footer for the /partner page */}
            </>
          } />
          
          <Route path="/admin" element={isAdmin ? <VideoAdmin onLogout={handleLogout} /> : <Hero />} />
        </Routes>

        {/* Login Popup */}
        {showLogin && <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      </div>
    </Router>
  );
}

export default App;
