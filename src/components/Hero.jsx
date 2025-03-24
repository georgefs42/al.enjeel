import React from 'react';
import '../styles/hero.css';

const Hero = () => {
  return (
    <section className="hero-section">

      <div className="hero-content">
        <h2>أهلاً بك في موقع الإنجيل</h2>
        <p> محتوى يهدف لنشر كلمة الرب حتى تصل إلى أقاصي الأرض</p>
      </div>

      <video className="hero-video" autoPlay loop muted>
        <source src="../../public/videos/bg.mov" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
};

export default Hero;
