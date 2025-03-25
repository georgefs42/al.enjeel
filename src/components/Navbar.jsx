// src/components/Navbar.js
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import logo from "/images/logo.png"; // Ensure the logo image path is correct
import "../styles/navbar.css"; // Make sure the CSS file exists

const Navbar = ({ isAdmin, handleAdminClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls the state of the menu

  // Toggle menu visibility (hamburger menu for small screens)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  return (
    <nav className="navbar">
      {/* Make the logo a clickable link */}
      <div className="logo">
        <Link to="/"> {/* Link to homepage */}
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      {/* Menu Icon (☰ or ✖) */}
      <div className="menu-icon" onClick={toggleMenu}>
        {isMenuOpen ? "✖" : "☰"}
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <li><Link to="/">الرئيسية</Link></li> {/* Home */}
        <li><Link to="/videos">فيديوهات</Link></li> {/* Videos */}
        <li><Link to="/podcast">بودكاست</Link></li> {/* Podcast */}
        <li><Link to="/about">من نحن</Link></li> {/* Podcast */}
        <li><Link to="/partner">كن شريكًا</Link></li> {/* Become a Partner */}
        <li><Link to="/admin" onClick={handleAdminClick}>
            {isAdmin ? "Logout" : "الدخول"}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
