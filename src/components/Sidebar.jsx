import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa"; // Import icons
import "../styles/sidebar.css"; // Import sidebar styles

const Sidebar = () => {
  // State to manage the visibility of the scroll-to-top button
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Function to handle scroll event and toggle the visibility of the button
  const handleScroll = () => {
    if (window.scrollY > 300) { // Show button if user scrolls down more than 300px
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  // Function to scroll to the top of the page when the button is clicked
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Set up scroll event listener on component mount and remove on unmount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="social-sidebar">
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
      <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
      <a href="https://www.tiktok.com/@al.enjeel" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
      <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default Sidebar;
