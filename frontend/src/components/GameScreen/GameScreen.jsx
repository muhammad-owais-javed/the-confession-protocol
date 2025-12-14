import React, { useState, useEffect, useRef } from 'react';
import './GameScreen.css';

const GameScreen = ({ gameState, onChoice, onRestart }) => {
  const [displayedNarrative, setDisplayedNarrative] = useState('');
  const [displayedDialogue, setDisplayedDialogue] = useState('');
  const [choicesVisible, setChoicesVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);
  const [showStats, setShowStats] = useState(false);

  const narrativeRef = useRef(null);
  const dialogueRef = useRef(null);
  const typewriterTimerRef = useRef(null);
  const dialogueTimerRef = useRef(null);

  // Typewriter effect for narrative
  useEffect(() => {
    if (!gameState?.narrativeText) return;

    setDisplayedNarrative('');
    setChoicesVisible(false);
    setSelectedChoiceIndex(null);

    let index = 0;
    const text = gameState.narrativeText;

    typewriterTimerRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedNarrative(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typewriterTimerRef.current);
        startDialogueTypewriter();
      }
    }, 25);

    return () => clearInterval(typewriterTimerRef.current);
  }, [gameState?.narrativeText, gameState?.sceneId]);

  const startDialogueTypewriter = () => {
    if (!gameState?.subjectDialogue) {
      setChoicesVisible(true);
      return;
    }

    let index = 0;
    const text = gameState.subjectDialogue;
    setDisplayedDialogue('');

    dialogueTimerRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedDialogue(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(dialogueTimerRef.current);
        setChoicesVisible(true);
      }
    }, 25);
  };

  const handleChoiceClick = async (choiceText, index) => {
    setSelectedChoiceIndex(index);
    setChoicesVisible(false);
    setIsTransitioning(true);

    setTimeout(() => {
      onChoice(choiceText);
      setIsTransitioning(false);
    }, 300);
  };

  const skipTypewriter = () => {
    if (displayedNarrative !== gameState?.narrativeText) {
      setDisplayedNarrative(gameState.narrativeText);
      clearInterval(typewriterTimerRef.current);
      startDialogueTypewriter();
    } else if (displayedDialogue !== gameState?.subjectDialogue) {
      setDisplayedDialogue(gameState.subjectDialogue);
      clearInterval(dialogueTimerRef.current);
      setChoicesVisible(true);
    }
  };

  const backgroundImage = gameState?.backgroundImage || 'default-interrogation-room.jpg';
  const auditorImage = gameState?.characterImages?.auditor || 'auditor_neutral.png';
  const subjectImage = gameState?.characterImages?.subject || 'subject_calm.png';

  return (
    <div className="game-screen-wrapper">
      {/* Cinematic Background */}
      <div className="cinematic-background">
        <div 
          className="background-layer"
          style={{
            backgroundImage: backgroundImage ? `url(/images/${backgroundImage})` : 'none'
          }}
        />
        <div className="vignette-overlay" />
        <div className="grain-overlay" />
      </div>

      {/* Top UI Bar */}
      <div className="top-ui-bar">
        <div className="location-badge">
          <div className="badge-icon">📍</div>
          <div className="badge-content">
            <div className="badge-label">LOCATION</div>
            <div className="badge-value">ROOM 07</div>
          </div>
        </div>

        <div className="phase-indicator">
          <div className="phase-dot pulse" />
          <span className="phase-text">{gameState?.currentPhase || 'INTERROGATION'}</span>
        </div>

        <div className="controls-group">
          <button 
            className="icon-button stats-toggle"
            onClick={() => setShowStats(!showStats)}
            title="Toggle Stats"
          >
            📊
          </button>
          <button
            className="icon-button audio-toggle"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Character Scene */}
      <div className="character-scene">
        {/* Auditor - Left Side */}
        <div className="character-container auditor-container">
          <div className="character-silhouette-wrapper">
            <div className="character-glow auditor-glow" />
<img
  src={`/silhouettes/${auditorImage}`}
  alt="Auditor"
  className="character-silhouette auditor-silhouette"
  onError={(e) => {
    console.error('Failed to load image:', e.target.src);
    e.target.style.display = 'none';
  }}
/>
          </div>
          <div className="character-label">AUDITOR 07</div>
        </div>

        {/* Subject - Right Side */}
        <div className="character-container subject-container">
          <div className="character-silhouette-wrapper">
            <div className="character-glow subject-glow" />
            <img
              src={`/silhouettes/${subjectImage}`}
              alt="Subject"
              className="character-silhouette subject-silhouette"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="character-label">SUBJECT</div>
        </div>

        {/* Central Focus Line */}
        <div className="focus-line" />
      </div>

      {/* Narrative Text - Floating Top */}
      {displayedNarrative && (
        <div className="narrative-panel" onClick={skipTypewriter}>
          <div className="narrative-text">
            {displayedNarrative}
            {displayedNarrative !== gameState?.narrativeText && (
              <span className="cursor-blink">|</span>
            )}
          </div>
          {displayedNarrative !== gameState?.narrativeText && (
            <div className="skip-hint">Click anywhere to skip</div>
          )}
        </div>
      )}

      {/* Dialogue Panel - Bottom Right */}
      {displayedDialogue && (
        <div className="dialogue-panel">
          <div className="dialogue-header">
            <div className="speaker-indicator" />
            <span className="speaker-name">SUBJECT</span>
          </div>
          <div className="dialogue-text">
            "{displayedDialogue}
            {displayedDialogue !== gameState?.subjectDialogue && (
              <span className="cursor-blink">|</span>
            )}"
          </div>
        </div>
      )}

      {/* Stats Overlay */}
      <div className={`stats-overlay ${showStats ? 'visible' : ''}`}>
        <div className="stats-panel">
          <div className="stats-header">
            <h3>PSYCHOLOGICAL PROFILE</h3>
            <button className="close-stats" onClick={() => setShowStats(false)}>×</button>
          </div>
          <div className="stats-grid">
            {[
              { key: 'denial', label: 'DENIAL', color: '#ff4444' },
              { key: 'guilt', label: 'GUILT', color: '#ff9944' },
              { key: 'confusion', label: 'CONFUSION', color: '#ffdd44' },
              { key: 'enlightenment', label: 'ENLIGHTENMENT', color: '#44ff88' }
            ].map(stat => (
              <div key={stat.key} className="stat-item">
                <div className="stat-header-row">
                  <span className="stat-name">{stat.label}</span>
                  <span className="stat-value">{gameState?.psychologicalStats?.[stat.key] || 0}%</span>
                </div>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar-fill"
                    style={{
                      width: `${gameState?.psychologicalStats?.[stat.key] || 0}%`,
                      background: `linear-gradient(90deg, ${stat.color}22, ${stat.color})`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Choices Interface - Bottom Center */}
      {choicesVisible && gameState?.availableChoices?.length > 0 && (
        <div className="choices-interface">
          <div className="choices-prompt">Choose your approach...</div>
          <div className="choices-grid">
            {gameState.availableChoices.map((choice, index) => (
              <button
                key={index}
                className={`choice-card ${selectedChoiceIndex === index ? 'selected' : ''}`}
                onClick={() => handleChoiceClick(choice, index)}
                disabled={isTransitioning}
              >
                <div className="choice-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="choice-content">{choice}</div>
                <div className="choice-arrow">→</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Choices - Return to Menu */}
      {!choicesVisible && !isTransitioning && (!gameState?.availableChoices || gameState.availableChoices.length === 0) && (
        <div className="choices-interface">
          <button className="choice-card restart-card" onClick={onRestart}>
            <div className="choice-number">↺</div>
            <div className="choice-content">Return to Menu</div>
            <div className="choice-arrow">→</div>
          </button>
        </div>
      )}

      {/* Scene Name - Subtle Bottom Left */}
      {gameState?.sceneName && (
        <div className="scene-nameplate">
          <div className="nameplate-line" />
          <span className="nameplate-text">{gameState.sceneName}</span>
        </div>
      )}

      {/* Transition Effect */}
      {isTransitioning && (
        <div className="transition-effect">
          <div className="transition-line" />
        </div>
      )}
    </div>
  );
};

export default GameScreen;