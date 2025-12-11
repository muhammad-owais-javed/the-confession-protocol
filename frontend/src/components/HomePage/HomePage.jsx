// src/components/HomePage/HomePage.jsx
import React, { useEffect, useState } from 'react';
import './HomePage.css';

const HomePage = ({ onStartGame }) => {
  const [particlesReady, setParticlesReady] = useState(false);

  useEffect(() => {
    setParticlesReady(true);
  }, []);

  return (
    <div className="home-page">
      {/* Background Particles */}
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
          ))
        }
      </div>

      {/* Main Content */}
      <div className="home-content">
        <div className="logo-section">
          <h1 className="main-title">
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
              But as the interrogation deepens, reality begins to break down. 
              You realize something impossible: <span className="highlight">you've been interrogated before.</span>
            </p>
            <p>
              You're caught in a cycle. And the Subject... might be a previous version of yourself.
            </p>
          </div>

          <div className="warning-box">
            <span className="warning-label">⚠️ WARNING</span>
            <p>This game contains psychological themes, paranoia, and reality distortion.</p>
          </div>
        </div>

        <button className="start-button" onClick={onStartGame}>
          <span className="button-text">ENTER THE ROOM</span>
          <span className="button-arrow">→</span>
        </button>

        <div className="footer-text">
          <p>Your choices will define your fate.</p>
          <p className="sub-footer">The truth always surfaces.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;