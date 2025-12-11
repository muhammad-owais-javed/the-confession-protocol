// src/components/EndingScreen/EndingScreen.jsx
import React, { useState, useEffect } from 'react';
import './EndingScreen.css';
import { playSound } from '../../utils/soundHelper';

const EndingScreen = ({ gameState, onRestart }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [endingTitle, setEndingTitle] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [soundEnabled] = useState(true);

  // Determine ending based on final stats
  const determineEnding = (stats) => {
    const { denial, guilt, confusion, enlightenment } = stats;

    // ENDING A: ACCEPTANCE
    if (guilt >= 65 && denial <= 35 && enlightenment <= 60) {
      return {
        title: 'ENDING A: ACCEPTANCE',
        subtitle: 'The Erasure',
        description: 'You sign the form with a steady hand. The relief washes over you like cold water. You don\'t fully understand what happened here—the cycle, the Subject, your own role—but perhaps that\'s mercy. They lead you back to your desk. Room 07 awaits your next interrogation. You don\'t remember the Subject\'s face anymore.\n\nYou are Auditor 07. This is your duty. And you will do it again.',
        meaning: 'You felt guilty but didn\'t fully understand → You accepted the relief of forgetting'
      };
    }

    // ENDING B: DENIAL
    if (denial >= 70 || (denial >= 50 && enlightenment <= 40)) {
      return {
        title: 'ENDING B: DENIAL',
        subtitle: 'The Resistance',
        description: 'You refuse to sign. Your hands shake with rage and conviction. This is wrong. You are NOT a Subject. You will NOT be replaced.\n\nBut as you stand, guards approach. Their faces are blank. They don\'t speak. They simply take your arm and lead you toward a steel door you\'ve never seen before.\n\nYou understand too late. Your refusal has made you dangerous. Now you will sit in the chair across the table. And someone new will ask you questions.',
        meaning: 'Your refusal to accept locked you into the cycle as the next Subject'
      };
    }

    // ENDING C: AWAKENING
    if (enlightenment >= 70 && confusion >= 65 && denial <= 50) {
      return {
        title: 'ENDING C: AWAKENING',
        subtitle: 'The Trapped Truth',
        description: 'You understand now. Everything. The cycle. The Bureau. The way each Subject becomes an Auditor becomes a Subject again. The infinite recursion of interrogation and replacement.\n\nYou try to run. You try to break free. But the confusion clings to you like fog. You don\'t know what\'s real anymore. The walls seem to shift. Is this room even real? Are you?\n\nWhen you wake, you\'re sitting in Room 07 again. The Subject is across from you. But this time, you recognize their face.\n\nIt\'s you.',
        meaning: 'You understood too much but couldn\'t escape the confusion'
      };
    }

    // ENDING D: WILLING RETURN (Default/best ending)
    return {
      title: 'ENDING D: WILLING RETURN',
      subtitle: 'The Cycle Embraced',
      description: 'You understand now. Not just what happened in this room, but what happens in every room, in every interrogation, across every cycle.\n\nYou sign the form. But this time, it\'s a choice made with full knowledge. You accept not because you\'ve forgotten, but because you understand the necessity. The cycle must continue. And someone needs to guide it.\n\nThey thank you with eyes that have seen what you\'ve seen. You stand, walk to the door, and turn back. The Subject—yourself from another iteration—looks at you with understanding.\n\nYou sit in the chair across the table. And begin to ask questions.',
      meaning: 'You accepted guilt AND understood the system → You chose to perpetuate it'
    };
  };

  const ending = determineEnding(gameState.psychologicalStats);

  // Typewriter effect for ending narrative
  useEffect(() => {
    let index = 0;
    const text = ending.description;
    setDisplayedText('');
    setEndingTitle(ending.title);

    soundEnabled && playSound('phase-transition');

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        // Show stats after text completes
        setTimeout(() => setShowStats(true), 500);
        soundEnabled && playSound('ending-reach');
      }
    }, 15); // Typewriter speed for ending (15ms per character - slower for drama)

    return () => clearInterval(timer);
  }, [ending.description, soundEnabled]);

  const getEndingColor = () => {
    switch (ending.title.split(':')[0]) {
      case 'ENDING A':
        return 'ending-a';
      case 'ENDING B':
        return 'ending-b';
      case 'ENDING C':
        return 'ending-c';
      case 'ENDING D':
        return 'ending-d';
      default:
        return 'ending-d';
    }
  };

  return (
    <div className={`ending-screen ${getEndingColor()}`}>
      {/* Background Elements */}
      <div className="ending-background">
        <div className="ending-particles">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="ending-particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="ending-content">
        {/* Ending Title */}
        <div className="ending-header">
          <h1 className="ending-title">{endingTitle}</h1>
          <div className="ending-subtitle">{ending.subtitle}</div>
          <div className="ending-divider" />
        </div>

        {/* Ending Narrative */}
        <div className="ending-narrative">
          <p className="ending-text">
            {displayedText}
            {displayedText !== ending.description && <span className="ending-cursor">█</span>}
          </p>
        </div>

        {/* Ending Meaning */}
        <div className="ending-meaning">
          <div className="meaning-label">INTERPRETATION</div>
          <p className="meaning-text">{ending.meaning}</p>
        </div>

        {/* Statistics */}
        {showStats && (
          <div className="ending-stats-container">
            <div className="stats-title">FINAL PSYCHOLOGICAL STATE</div>
            <div className="ending-stats-grid">
              <div className="ending-stat-card denial-stat">
                <div className="stat-card-label">DENIAL</div>
                <div className="stat-card-value">{gameState.psychologicalStats.denial}</div>
                <div className="stat-card-bar">
                  <div
                    className="stat-card-fill"
                    style={{ width: `${gameState.psychologicalStats.denial}%` }}
                  />
                </div>
              </div>

              <div className="ending-stat-card guilt-stat">
                <div className="stat-card-label">GUILT</div>
                <div className="stat-card-value">{gameState.psychologicalStats.guilt}</div>
                <div className="stat-card-bar">
                  <div
                    className="stat-card-fill"
                    style={{ width: `${gameState.psychologicalStats.guilt}%` }}
                  />
                </div>
              </div>

              <div className="ending-stat-card confusion-stat">
                <div className="stat-card-label">CONFUSION</div>
                <div className="stat-card-value">{gameState.psychologicalStats.confusion}</div>
                <div className="stat-card-bar">
                  <div
                    className="stat-card-fill"
                    style={{ width: `${gameState.psychologicalStats.confusion}%` }}
                  />
                </div>
              </div>

              <div className="ending-stat-card enlightenment-stat">
                <div className="stat-card-label">ENLIGHTENMENT</div>
                <div className="stat-card-value">{gameState.psychologicalStats.enlightenment}</div>
                <div className="stat-card-bar">
                  <div
                    className="stat-card-fill"
                    style={{ width: `${gameState.psychologicalStats.enlightenment}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showStats && (
          <div className="ending-actions">
            <button className="ending-button restart-btn" onClick={onRestart}>
              <span className="button-symbol">↺</span>
              <span className="button-label">Play Again</span>
            </button>
            <div className="ending-footer">
              <p>Every choice matters.</p>
              <p>Every cycle repeats.</p>
              <p>The truth always surfaces.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EndingScreen;