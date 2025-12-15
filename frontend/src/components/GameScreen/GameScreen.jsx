import React, { useState, useEffect, useRef } from 'react';
import PhaseIntroScreen from '../PhaseIntroScreen/PhaseIntroScreen';
import './GameScreen.css';

const GameScreen = ({ gameState, onChoice, onRestart, onHome }) => {
  // UI State
  const [showPhaseIntro, setShowPhaseIntro] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);

  // Text Display State
  const [displayedNarrative, setDisplayedNarrative] = useState('');
  const [displayedAuditorDialogue, setDisplayedAuditorDialogue] = useState('');
  const [displayedSubjectDialogue, setDisplayedSubjectDialogue] = useState('');
  const [choicesVisible, setChoicesVisible] = useState(false);

  // Refs for cleanup
  const narrativeTimerRef = useRef(null);
  const auditorTimerRef = useRef(null);
  const subjectTimerRef = useRef(null);

  // ============================================
  // PHASE INTRO LOGIC
  // ============================================
   useEffect(() => {
    // Guard against undefined or missing data
    if (!gameState?.sceneId || !gameState?.narrativeText) {
      console.log("DEBUG: Waiting for gameState to be fully loaded");
      return;
    }

    // ALWAYS clear text display when scene changes
    setDisplayedNarrative('');
    setDisplayedAuditorDialogue('');
    setDisplayedSubjectDialogue('');
    setChoicesVisible(false);
    setSelectedChoiceIndex(null);

    // Clear all timers
    clearInterval(narrativeTimerRef.current);
    clearInterval(auditorTimerRef.current);
    clearInterval(subjectTimerRef.current);

    // Check if this is an intro scene with images
    const isIntroScene = gameState.sceneId.includes('_scene_intro');
    const hasIntroImages = gameState.introImages && gameState.introImages.length > 0;

    console.log("Scene changed:", gameState.sceneId, "IsIntro:", isIntroScene, "HasImages:", hasIntroImages);

    if (isIntroScene && hasIntroImages) {
      // Show intro screen
      console.log("✓ Showing intro");
      setShowPhaseIntro(true);
    } else {
      // Skip intro, go straight to narrative
      console.log("✗ Skipping intro, starting narrative");
      setShowPhaseIntro(false);
      startNarrative();
    }
  }, [gameState?.sceneId, gameState?.narrativeText]); // Changed back to specific properties
  // ============================================
  // TYPEWRITER FUNCTIONS
  // ============================================
  const startNarrative = () => {
    // Clear all existing timers
    clearTimeout(narrativeTimerRef.current);
    clearTimeout(auditorTimerRef.current);
    clearTimeout(subjectTimerRef.current);

    // Reset display
    setDisplayedNarrative('');
    setDisplayedAuditorDialogue('');
    setDisplayedSubjectDialogue('');
    setChoicesVisible(false);
    setSelectedChoiceIndex(null);

    // If no narrative, skip to dialogue
    if (!gameState?.narrativeText) {
      startAuditorDialogue();
      return;
    }

    // Typewriter for narrative
    let index = 0;
    const text = gameState.narrativeText;

    narrativeTimerRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedNarrative(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(narrativeTimerRef.current);
        startAuditorDialogue();
      }
    }, 12);
  };

  const startAuditorDialogue = () => {
    clearTimeout(auditorTimerRef.current);
    clearTimeout(subjectTimerRef.current);

    // If no auditor dialogue, skip to subject
    if (!gameState?.auditorDialogue) {
      startSubjectDialogue();
      return;
    }

    // Typewriter for auditor
    let index = 0;
    const text = gameState.auditorDialogue;

    auditorTimerRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedAuditorDialogue(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(auditorTimerRef.current);
        startSubjectDialogue();
      }
    }, 12);
  };

  const startSubjectDialogue = () => {
    clearTimeout(subjectTimerRef.current);

    // If no subject dialogue, show choices
    if (!gameState?.subjectDialogue) {
      setChoicesVisible(true);
      return;
    }

    // Typewriter for subject
    let index = 0;
    const text = gameState.subjectDialogue;

    subjectTimerRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedSubjectDialogue(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(subjectTimerRef.current);
        setChoicesVisible(true);
      }
    }, 12);
  };

  // ============================================
  // SKIP TYPEWRITER
  // ============================================
  const skipTypewriter = () => {
    if (displayedNarrative !== gameState?.narrativeText) {
      // Skip narrative
      setDisplayedNarrative(gameState.narrativeText);
      clearInterval(narrativeTimerRef.current);
      startAuditorDialogue();
    } else if (displayedAuditorDialogue !== gameState?.auditorDialogue && gameState?.auditorDialogue) {
      // Skip auditor dialogue
      setDisplayedAuditorDialogue(gameState.auditorDialogue);
      clearInterval(auditorTimerRef.current);
      startSubjectDialogue();
    } else if (displayedSubjectDialogue !== gameState?.subjectDialogue && gameState?.subjectDialogue) {
      // Skip subject dialogue
      setDisplayedSubjectDialogue(gameState.subjectDialogue);
      clearInterval(subjectTimerRef.current);
      setChoicesVisible(true);
    }
  };

  // ============================================
  // PHASE INTRO COMPLETE
  // ============================================
  const handleIntroComplete = () => {
    setShowPhaseIntro(false);
    // Small delay to ensure state updates
    setTimeout(() => {
      startNarrative();
    }, 50);
  };

  // ============================================
  // CHOICE CLICK
  // ============================================
  const handleChoiceClick = (choiceText, index) => {
    setSelectedChoiceIndex(index);
    setChoicesVisible(false);
    setDisplayedNarrative('');
    setDisplayedAuditorDialogue('');
    setDisplayedSubjectDialogue('');
    setIsTransitioning(true);

    // Clear all timers
    clearInterval(narrativeTimerRef.current);
    clearInterval(auditorTimerRef.current);
    clearInterval(subjectTimerRef.current);

    setTimeout(() => {
      onChoice(choiceText);
      setIsTransitioning(false);
    }, 150);
  };

  // ============================================
  // CLEANUP
  // ============================================
  useEffect(() => {
    return () => {
      clearInterval(narrativeTimerRef.current);
      clearInterval(auditorTimerRef.current);
      clearInterval(subjectTimerRef.current);
    };
  }, []);

  // ============================================
  // IF SHOWING INTRO, ONLY RENDER THAT
  // ============================================
  if (showPhaseIntro) {
    return (
      <PhaseIntroScreen
        phaseName={gameState?.currentPhase || 'PHASE'}
        introImages={gameState?.introImages || []}
        onComplete={handleIntroComplete}
        duration={1500}
      />
    );
  }

  // ============================================
  // MAIN GAME SCREEN
  // ============================================
  const backgroundImage = gameState?.backgroundImage || 'default-interrogation-room.jpg';
  const auditorImage = gameState?.characterImages?.auditor || 'auditor_neutral.png';
  const subjectImage = gameState?.characterImages?.subject || 'subject_calm.png';

  return (
    <div className="game-screen-wrapper">
      {/* Background */}
      <div className="cinematic-background">
        <div
          className="background-layer"
          style={{ backgroundImage: `url(/images/${backgroundImage})` }}
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
          <span className="phase-text">{gameState?.currentPhase || 'PHASE'}</span>
        </div>

        <div className="controls-group">
          <button
            className="icon-button"
            onClick={() => setShowStats(!showStats)}
            title="Toggle Stats"
          >
            📊
          </button>
          <button
            className="icon-button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button className="icon-button" onClick={onHome} title="Home">
            🏠
          </button>
        </div>
      </div>

      {/* Characters */}
      <div className="character-scene">
        <div className="character-container auditor-container">
          <div className="character-silhouette-wrapper">
            <div className="character-glow auditor-glow" />
            <img
              src={`/silhouettes/${auditorImage}`}
              alt="Auditor"
              className="character-silhouette"
            />
          </div>
          <div className="character-label">AUDITOR 07</div>
        </div>

        <div className="character-container subject-container">
          <div className="character-silhouette-wrapper">
            <div className="character-glow subject-glow" />
            <img
              src={`/silhouettes/${subjectImage}`}
              alt="Subject"
              className="character-silhouette"
            />
          </div>
          <div className="character-label">SUBJECT</div>
        </div>

        <div className="focus-line" />
      </div>

      {/* Narrative */}
      {displayedNarrative && (
        <div className="narrative-panel" onClick={skipTypewriter}>
          <div className="narrative-text">
            {displayedNarrative}
            {displayedNarrative !== gameState?.narrativeText && (
              <span className="cursor-blink">|</span>
            )}
          </div>
          {displayedNarrative !== gameState?.narrativeText && (
            <div className="skip-hint">Click to skip</div>
          )}
        </div>
      )}

      {/* Auditor Dialogue */}
      {displayedAuditorDialogue && (
        <div className="auditor-dialogue-panel">
          <div className="dialogue-header">
            <div className="speaker-indicator auditor-indicator" />
            <span className="speaker-name auditor-speaker">AUDITOR</span>
          </div>
          <div className="dialogue-text">
            "{displayedAuditorDialogue}
            {displayedAuditorDialogue !== gameState?.auditorDialogue && (
              <span className="cursor-blink">|</span>
            )}"
          </div>
        </div>
      )}

      {/* Subject Dialogue */}
      {displayedSubjectDialogue && (
        <div className="subject-dialogue-panel">
          <div className="dialogue-header">
            <div className="speaker-indicator subject-indicator" />
            <span className="speaker-name subject-speaker">SUBJECT</span>
          </div>
          <div className="dialogue-text">
            "{displayedSubjectDialogue}
            {displayedSubjectDialogue !== gameState?.subjectDialogue && (
              <span className="cursor-blink">|</span>
            )}"
          </div>
        </div>
      )}

      {/* Stats */}
      <div className={`stats-overlay ${showStats ? 'visible' : ''}`}>
        <div className="stats-panel">
          <div className="stats-header">
            <h3>PSYCHOLOGICAL PROFILE</h3>
            <button className="close-stats" onClick={() => setShowStats(false)}>
              ×
            </button>
          </div>
          <div className="stats-grid">
            {[
              { key: 'denial', label: 'DENIAL', color: '#ff4444' },
              { key: 'guilt', label: 'GUILT', color: '#ff9944' },
              { key: 'confusion', label: 'CONFUSION', color: '#ffdd44' },
              { key: 'enlightenment', label: 'ENLIGHTENMENT', color: '#44ff88' },
            ].map((stat) => (
              <div key={stat.key} className="stat-item">
                <div className="stat-header-row">
                  <span className="stat-name">{stat.label}</span>
                  <span className="stat-value">
                    {gameState?.psychologicalStats?.[stat.key] || 0}%
                  </span>
                </div>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${gameState?.psychologicalStats?.[stat.key] || 0}%`,
                      background: `linear-gradient(90deg, ${stat.color}22, ${stat.color})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Choices */}
      {choicesVisible && gameState?.availableChoices?.length > 0 && (
        <div className="choices-interface">
          <div className="choices-prompt">Choose your approach</div>
          <div className="choices-vertical">
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

      {/* End Game */}
      {!choicesVisible &&
        !isTransitioning &&
        (!gameState?.availableChoices || gameState.availableChoices.length === 0) && (
          <div className="choices-interface">
            <button className="choice-card restart-card" onClick={onRestart}>
              <div className="choice-number">↺</div>
              <div className="choice-content">Return to Menu</div>
              <div className="choice-arrow">→</div>
            </button>
          </div>
        )}

      {/* Scene Name */}
      {gameState?.sceneName && (
        <div className="scene-nameplate">
          <div className="nameplate-line" />
          <span className="nameplate-text">{gameState.sceneName}</span>
        </div>
      )}

      {/* Transition */}
      {isTransitioning && (
        <div className="transition-effect">
          <div className="transition-line" />
        </div>
      )}
    </div>
  );
};

export default GameScreen;