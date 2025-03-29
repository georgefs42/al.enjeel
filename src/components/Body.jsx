import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import '../styles/body.css';

const Body = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (!paused && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [paused, slides]);

  const fetchSlides = async () => {
    const { data, error } = await supabase.from('slides').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching slides:', error);
    else setSlides(data);
  };

  const plusDivs = (n) => {
    setCurrentIndex((prevIndex) => (prevIndex + n + slides.length) % slides.length);
  };

  const currentDiv = (n) => {
    setCurrentIndex(n);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-title">آخر التحديثات</div>
      {slides.length > 0 ? (
        <div
          className="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="carousel-slides">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`slide ${index === currentIndex ? 'active' : 'hidden'}`}
                onClick={() => window.open(slide.link_url, '_blank')}
              >
                <img src={slide.image_url} alt={slide.title} />
                <div className="slide-description">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="carousel-navigation">
            <button onClick={() => plusDivs(-1)} className="w3-button w3-light-grey">❮ Prev</button>
            <button onClick={() => plusDivs(1)} className="w3-button w3-light-grey">Next ❯</button>
          </div>

          <div className="carousel-indicators">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                className={`w3-button demo ${index === currentIndex ? 'w3-red' : ''}`}
                onClick={() => currentDiv(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="no-slides">No slides available</p>
      )}
    </div>
  );
};

export default Body;
