// src/components/HomePage/HomePage.jsx
import React, { useEffect, useState, useRef } from 'react';
import './HomePage.css';

const HomePage = ({ onStartGame }) => {
  const [particlesReady, setParticlesReady] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioRef = useRef(null);
  const glitchTimerRef = useRef(null);

  // Initialize particles
  useEffect(() => {
    setParticlesReady(true);
  }, []);

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(err => {
        console.log('Audio autoplay prevented by browser:', err);
        // User will need to interact to start audio
      });

      // Fade in audio
      const fadeInInterval = setInterval(() => {
        if (audioRef.current) {
          audioRef.current.volume = Math.min(audioRef.current.volume + 0.02, 0.5);
        }
      }, 100);

      return () => clearInterval(fadeInInterval);
    }
  }, []);

  // Random glitch effect
  useEffect(() => {
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
      // Random interval between 8-20 seconds
      glitchTimerRef.current = setTimeout(triggerGlitch, 8000 + Math.random() * 12000);
    };

    const initialDelay = setTimeout(triggerGlitch, 5000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(glitchTimerRef.current);
    };
  }, []);

  // Handle audio toggle
  const handleAudioToggle = () => {
    if (audioRef.current) {
      if (audioEnabled) {
        // Fade out
        const fadeOutInterval = setInterval(() => {
          if (audioRef.current) {
            audioRef.current.volume = Math.max(audioRef.current.volume - 0.1, 0);
            if (audioRef.current.volume === 0) {
              audioRef.current.pause();
              clearInterval(fadeOutInterval);
            }
          }
        }, 50);
      } else {
        // Fade in
        audioRef.current.volume = 0;
        audioRef.current.play().catch(err => {
          console.log('Audio playback failed:', err);
        });

        const fadeInInterval = setInterval(() => {
          if (audioRef.current) {
            audioRef.current.volume = Math.min(audioRef.current.volume + 0.05, 0.5);
            if (audioRef.current.volume === 0.5) {
              clearInterval(fadeInInterval);
            }
          }
        }, 50);
      }
      setAudioEnabled(!audioEnabled);
    }
  };

  // Handle start game with fade out
  const handleStartGameWithAudio = () => {
    if (audioRef.current) {
      // Fade out music
      const fadeOutInterval = setInterval(() => {
        if (audioRef.current) {
          audioRef.current.volume = Math.max(audioRef.current.volume - 0.05, 0);
        }
      }, 50);

      setTimeout(() => {
        clearInterval(fadeOutInterval);
        onStartGame();
      }, 500);
    } else {
      onStartGame();
    }
  };

  return (
    <div className={`home-page ${glitchActive ? 'glitch-active' : ''}`}>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        onEnded={(e) => {
          e.target.currentTime = 0;
          e.target.play();
        }}
      >
        <source src="/audio/homepage-bg-music.mp3" type="audio/mpeg" />
        <source src="/audio/homepage-bg-music.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      {/* Background Image with Overlay */}
      <div className="background-layer">
        <img
          src="/images/interrogation-room.jpeg"
          alt="Interrogation Room"
          className="background-image"
        />
        <div className="background-overlay" />
      </div>

      {/* VHS Distortion Effect */}
      <div className="vhs-effect" />

      {/* Scanlines Effect */}
      <div className="scanlines" />

      {/* Film Grain Texture */}
      <div className="film-grain" />

      {/* Vignette Effect */}
      <div className="vignette" />

      {/* Animated Background Particles */}
      <div className="particles-container">
        {particlesReady &&
          [...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
      </div>

      {/* Main Content */}
      <div className="home-content">
        {/* Audio Control Button */}
        <button className="audio-control" onClick={handleAudioToggle} title="Toggle Audio">
          {audioEnabled ? '🔊' : '🔇'}
        </button>

        <div className="logo-section">
          <h1 className="main-title typewriter-text">
            <span className="title-line">THE CONFESSION</span>
            <span className="title-line">PROTOCOL</span>
          </h1>
          <div className="title-divider" />
        </div>

        <div className="description-section">
          <p className="tagline">
            An interrogator. A subject. A cycle that never ends.
          </p>

          <div className="story-description">
            <p>
              You are <span className="highlight">Auditor 07</span>, an experienced interrogator.
              Your task seems routine—interrogate a mysterious Subject who claims to know you.
            </p>
            <p>
              But as the interrogation deepens,
               <span className="highlight"> reality begins to break down.</span>
            </p>
            
          </div>

          <div className="warning-box">
            <span className="warning-label">⚠️ WARNING</span>
            <p>This game contains psychological themes, paranoia, and reality distortion.</p>
          </div>
        </div>

        <button className="start-button" onClick={handleStartGameWithAudio}>
          <span className="button-text">ENTER THE ROOM</span>
          <span className="button-arrow">→</span>
        </button>

        <div className="footer-text">
          <p>Your choices will define your fate.</p>
          <p className="sub-footer">The truth always surfaces.</p>
        </div>

        {/* Developer Credits */}
        <div className="developer-credit">
          <div className="credit-text">
            <p className="credit-label">Developed by:</p>
            <p className="credit-name">Owais and Gökçe</p>
            <p className="credit-company">SUOMORΛ</p>
          </div>
        </div>
      </div>

      {/* Cursor Glow Effect */}
      <div className="cursor-glow" />
    </div>
  );
};

export default HomePage;