import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa"; // Import icons
import "../styles/sidebar.css"; // Import sidebar styles

const Sidebar = () => {
  return (
    <div className="social-sidebar">
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
      <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
      <a href="https://www.tiktok.com/@al.enjeel" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
      <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
    </div>
  );
};

export default Sidebar;
