// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Body from './components/Body';
import Footer from './components/Footer';
import VideoSection from './Admin/AminMain';  // Renamed to VideoSection
import Podcast from './components/Podcast';
import Partner from './components/Partner';
import Videos from './pages/Videos';
import Login from './components/Login';
import Comments from './components/Comments';
import About from './pages/About';  // Import the About page

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
        <Navbar isAdmin={isAdmin} handleAdminClick={() => setShowLogin(true)} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={(
            <>
              <Hero />
              <Body />
              <Comments isAdmin={isAdmin} />
              <Footer />
            </>
          )} />
          <Route path="/videos" element={<><Videos /><Footer /></>} />
          <Route path="/podcast" element={<><Podcast /><Footer /></>} />
          <Route path="/partner" element={<><Partner /><Footer /></>} />
          <Route path="/about" element={<><About /><Footer /></>} />
          {/* Only allows access if isAdmin is true */}
          <Route path="/admin" element={isAdmin ? <VideoSection onLogout={handleLogout} /> : <Hero />} />
        </Routes>
        {showLogin && <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      </div>
    </Router>
  );
}

export default App;
