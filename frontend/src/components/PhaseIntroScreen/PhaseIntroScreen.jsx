import React, { useEffect, useState } from 'react';
import './PhaseIntroScreen.css';
import { playSound } from '../../utils/soundHelper';

const PhaseIntroScreen = ({ 
  phaseName, 
  introImages = [], 
  onComplete,
  duration = 1500
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    // If no images, skip intro entirely
    if (!introImages || introImages.length === 0) {
      onComplete();
      return;
    }

    // Phase heading appears immediately
    const headingDelay = setTimeout(() => {
      setImageVisible(true);
      playSound('phase-transition');
    }, 300);

    // Cycle through images
    let currentIndex = 0;
    const imageInterval = setInterval(() => {
      currentIndex++;
      
      if (currentIndex < introImages.length) {
        setCurrentImageIndex(currentIndex);
      } else {
        clearInterval(imageInterval);
        
        // Fade out after showing all images
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onComplete();
          }, 500);
        }, 800);
      }
    }, duration);

    // Cleanup
    return () => {
      clearInterval(imageInterval);
      clearTimeout(headingDelay);
    };
  }, [introImages.length, duration]); // Minimal dependencies

  const handleClick = (e) => {
    e.preventDefault();
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div 
      className={`phase-intro-screen ${isVisible ? 'visible' : 'hidden'}`}
      onClick={handleClick}
      style={{ cursor: 'pointer', userSelect: 'none' }}
    >
      <div className="intro-background" />

      <div className="intro-content">
        <div className={`intro-heading-container ${imageVisible ? 'has-images' : ''}`}>
          <div className="intro-line intro-line-top" />
          <h1 className="intro-phase-heading">{phaseName}</h1>
          <div className="intro-line intro-line-bottom" />
        </div>

        {introImages && introImages.length > 0 && imageVisible && (
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

        {imageVisible && introImages.length > 0 && (
          <div className="intro-skip-hint">Click to skip</div>
        )}
      </div>
    </div>
  );
};

export default PhaseIntroScreen;