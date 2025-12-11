// src/components/PhaseIntroScreen/PhaseIntroScreen.jsx
import React, { useEffect, useState } from 'react';
import './PhaseIntroScreen.css';
import { playSound } from '../../utils/soundHelper';

const PhaseIntroScreen = ({ 
  phaseName, 
  introImages = [], 
  onComplete,
  duration = 2500 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    // Phase heading appears immediately
    const headingDelay = setTimeout(() => {
      setImageVisible(true);
      playSound('phase-transition');
    }, 500);

    // Calculate total time needed
    const imageTotalTime = introImages.length * duration;
    const finalFadeOutTime = 1000;
    const totalTime = imageTotalTime + finalFadeOutTime + 1000;

    // Cycle through images
    if (introImages.length > 0) {
      let currentIndex = 0;
      const imageInterval = setInterval(() => {
        currentIndex++;
        if (currentIndex < introImages.length) {
          setCurrentImageIndex(currentIndex);
        } else {
          clearInterval(imageInterval);
          // Fade out
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
              onComplete();
            }, 500);
          }, 1000);
        }
      }, duration);

      return () => {
        clearInterval(imageInterval);
        clearTimeout(headingDelay);
      };
    } else {
      // No images, just heading
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [introImages, duration, onComplete]);

  return (
    <div className={`phase-intro-screen ${isVisible ? 'visible' : 'hidden'}`}>
      {/* Black Background */}
      <div className="intro-background" />

      {/* Phase Heading */}
      <div className="intro-content">
        <div className={`intro-heading-container ${imageVisible ? 'has-images' : ''}`}>
          <div className="intro-line intro-line-top" />
          <h1 className="intro-phase-heading">{phaseName}</h1>
          <div className="intro-line intro-line-bottom" />
        </div>

        {/* Intro Images */}
        {introImages.length > 0 && imageVisible && (
          <div className="intro-images-container">
            {introImages.map((image, index) => (
              <img
                key={index}
                src={`/images/${image}`}
                alt={`Phase intro ${index + 1}`}
                className={`intro-image ${index === currentImageIndex ? 'active' : ''}`}
                onError={(e) => {
                  console.warn(`Image not found: ${image}`);
                  e.target.style.display = 'none';
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseIntroScreen;