import { useState } from "react";
import "../styles/hero.css";
import logo from "/images/logo.png"; // Import logo

const Hero = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    window.open("https://www.tiktok.com/@al.enjeel", "_blank");
  };

  return (
    <section className="hero">
      {/* Video Background */}
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="/videos/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Navbar Inside Hero */}
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        {/* Menu Icon (☰ or ✖) */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖" : "☰"}
        </div>

        {/* Navigation Links */}
        <ul className={menuOpen ? "nav-links open" : "nav-links"}>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Content */}
      <div className="hero-content">
        <h2>أهلاً بك في موقع الإنجيل</h2>
        <p>موقع محتواه يهدف إلى نشر كلمة الرب حتى تصل إلى أقاصي الأرض</p>
        <button onClick={handleClick}>Get Started</button>
      </div>
    </section>
  );
};

export default Hero;
