import React from 'react';
import '../styles/HeroImage.css'; // Import the associated CSS for styling
import heroImage from '../../public/images/bibleBg.webp'; // Import the image from the src folder

const HeroImage = () => {
  return (
    <div className="hero-image" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="hero-content">
        <h2 className="hero-title">Welcome to Our Website</h2>
        <p className="hero-subtitle">Browse through a wide range of amazing content</p>
      </div>
    </div>
  );
};

export default HeroImage;
