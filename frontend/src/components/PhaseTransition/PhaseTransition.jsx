// src/components/PhaseTransition/PhaseTransition.jsx
import React, { useEffect, useState } from 'react';
import './PhaseTransition.css';
import { playSound } from '../../utils/soundHelper';

const PhaseTransition = ({ phaseName, onComplete, duration = 2500 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Play transition sound
    playSound('phase-transition');

    // Timer for transition completion
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Additional delay before calling onComplete to allow fade-out animation
      setTimeout(() => {
        onComplete();
      }, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div className={`phase-transition ${isVisible ? 'visible' : 'hidden'}`}>
      {/* Black fade-in/out background */}
      <div className="phase-background" />

      {/* Center content */}
      <div className="phase-content">
        <div className="phase-text-container">
          {/* Phase heading with line above */}
          <div className="phase-line phase-line-top" />
          
          <h2 className="phase-heading">{phaseName}</h2>
          
          {/* Line below */}
          <div className="phase-line phase-line-bottom" />
        </div>

        {/* Subtitle with loading dots */}
        <div className="phase-subtitle">
          <span className="dot dot-1" />
          <span className="dot dot-2" />
          <span className="dot dot-3" />
        </div>
      </div>
    </div>
  );
};

export default PhaseTransition;