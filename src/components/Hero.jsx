import { useState } from "react";
import supabase from "../supabase"; // Ensure correct import
import "../styles/hero.css";
import logo from "/images/logo.png";
import Login from "../components/Login"; // Import Login component
import VideoAdmin from "../components/VideoAdmin"; // Import VideoAdmin component
import VideoList from "../components/VideoList"; // Import VideoList component
import SearchContent from "../components/SearchContent"; // Import the new SearchContent component

const Hero = () => {
  const [isAdmin, setIsAdmin] = useState(false); // Track admin login state
  const [showLogin, setShowLogin] = useState(false); // Controls login form visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls the state of the menu
  const [searchResults, setSearchResults] = useState([]); // State for storing search results

  // Toggle menu visibility (hamburger menu for small screens)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  // Handle admin login/logout
  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdmin(false); // Logout admin
    } else {
      setShowLogin(true); // Show login form
    }
  };

  // If admin is logged in, show the admin panel
  if (isAdmin) {
    return <VideoAdmin onLogout={() => setIsAdmin(false)} />;
  }

  return (
    <section className="hero">
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="/videos/bg.mov" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <nav className="navbar">
        {/* Make the logo a clickable link */}
        <div className="logo">
          <a href="#">  {/* This is the clickable link */}
            <img src={logo} alt="Logo" />
          </a>
        </div>

        {/* Menu Icon (☰ or ✖) */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? "✖" : "☰"}
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li>
            <a href="#" onClick={handleAdminClick}>
              {isAdmin ? "Logout" : "Admin"}
            </a>
          </li>
        </ul>
      </nav>

      {showLogin && !isAdmin && (
        <div className="login-container">
          <button className="close-button" onClick={() => setShowLogin(false)}>
            ✖
          </button>
          <Login onLogin={() => { setIsAdmin(true); setShowLogin(false); }} />
        </div>
      )}

      <div className="hero-content">
        <h2>أهلاً بك في موقع الإنجيل</h2>
        <p>موقع محتواه يهدف إلى نشر كلمة الرب حتى تصل إلى أقاصي الأرض</p>
      </div>

    </section>
  );
};

export default Hero;
