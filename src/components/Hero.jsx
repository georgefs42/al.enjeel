import { useState } from "react";
import supabase from "../supabase"; // Ensure correct import
import "../styles/hero.css";
import logo from "/images/logo.png";
import Login from "../components/Login"; // Import Login component
import VideoAdmin from "../components/VideoAdmin"; // Import VideoAdmin component

const Hero = ({ setVideos }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Track admin login state
  const [showLogin, setShowLogin] = useState(false); // Controls login form visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls the state of the menu

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .ilike("description", `%${searchQuery}%`); // Search by description

    if (error) {
      console.error("Error fetching videos:", error);
    } else {
      setVideos(data); // Update the VideoList component
    }
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdmin(false); // Logout admin
    } else {
      setShowLogin(true); // Show login form
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  if (isAdmin) {
    return <VideoAdmin onLogout={() => setIsAdmin(false)} />; // Redirect to VideoAdmin when logged in
  }

  return (
    <section className="hero">
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="/videos/bg.mov" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
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
          <button className="close-button" onClick={() => setShowLogin(false)}>✖</button>
          <Login onLogin={() => { setIsAdmin(true); setShowLogin(false); }} />
        </div>
      )}

      <div className="hero-content">
        <h2>أهلاً بك في موقع الإنجيل</h2>
        <p>موقع محتواه يهدف إلى نشر كلمة الرب حتى تصل إلى أقاصي الأرض</p>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="ابحث عن فيديو..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>بحث</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
