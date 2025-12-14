import React, { useState, useEffect, useRef } from 'react';
import PhaseIntroScreen from '../PhaseIntroScreen/PhaseIntroScreen';
import './GameScreen.css';

const GameScreen = ({ gameState, onChoice, onRestart, onHome }) => {
  const [displayedNarrative, setDisplayedNarrative] = useState('');
  const [displayedAuditorDialogue, setDisplayedAuditorDialogue] = useState('');
  const [displayedSubjectDialogue, setDisplayedSubjectDialogue] = useState('');
  const [choicesVisible, setChoicesVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showPhaseIntro, setShowPhaseIntro] = useState(true);

  const narrativeRef = useRef(null);
  const typewriterTimerRef = useRef(null);
  const dialogueTimerRef = useRef(null);

  // Show phase intro only on FIRST intro scene of each phase
  useEffect(() => {
    if (gameState?.sceneId) {
      // Only show intro if: it's an intro scene AND it has intro images AND we haven't shown intro yet
      const isFirstSceneOfPhase = gameState?.sceneId?.includes('_scene_intro');
      const hasIntroImages = gameState?.introImages?.length > 0;
      
      if (isFirstSceneOfPhase && hasIntroImages) {
        setShowPhaseIntro(true);
      } else {
        setShowPhaseIntro(false);
        // Start narrative immediately for non-intro scenes
        startNarrativeTypewriter();
      }
    }
  }, [gameState?.sceneId]);

  const handlePhaseIntroComplete = () => {
    setShowPhaseIntro(false);
    setTimeout(() => {
      startNarrativeTypewriter();
    }, 300);
  };

  // Typewriter effect for narrative
  const startNarrativeTypewriter = () => {
    if (!gameState?.narrativeText) {
      startDialogueTypewriter();
      return;
    }

    setDisplayedNarrative('');
    setDisplayedAuditorDialogue('');
    setDisplayedSubjectDialogue('');
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
  };

  useEffect(() => {
    if (!gameState?.narrativeText) return;
    if (showPhaseIntro) return;

    // Clear any existing intervals
    clearInterval(typewriterTimerRef.current);
    clearInterval(dialogueTimerRef.current);

    startNarrativeTypewriter();

    return () => {
      clearInterval(typewriterTimerRef.current);
      clearInterval(dialogueTimerRef.current);
    };
  }, [gameState?.narrativeText, gameState?.sceneId]);

  const startDialogueTypewriter = () => {
    if (gameState?.auditorDialogue) {
      let index = 0;
      const text = gameState.auditorDialogue;
      setDisplayedAuditorDialogue('');

      dialogueTimerRef.current = setInterval(() => {
        if (index < text.length) {
          setDisplayedAuditorDialogue(text.substring(0, index + 1));
          index++;
        } else {
          clearInterval(dialogueTimerRef.current);
          startSubjectDialogue();
        }
      }, 25);
    } else {
      startSubjectDialogue();
    }
  };

  const startSubjectDialogue = () => {
    if (!gameState?.subjectDialogue) {
      setChoicesVisible(true);
      return;
    }

    let index = 0;
    const text = gameState.subjectDialogue;
    setDisplayedSubjectDialogue('');

    dialogueTimerRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedSubjectDialogue(text.substring(0, index + 1));
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
    setDisplayedNarrative('');
    setDisplayedAuditorDialogue('');
    setDisplayedSubjectDialogue('');
    setIsTransitioning(true);

    // Clear any running typewriter intervals
    clearInterval(typewriterTimerRef.current);
    clearInterval(dialogueTimerRef.current);

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
    } else if (displayedAuditorDialogue !== gameState?.auditorDialogue) {
      setDisplayedAuditorDialogue(gameState.auditorDialogue);
      clearInterval(dialogueTimerRef.current);
      startSubjectDialogue();
    } else if (displayedSubjectDialogue !== gameState?.subjectDialogue) {
      setDisplayedSubjectDialogue(gameState.subjectDialogue);
      clearInterval(dialogueTimerRef.current);
      setChoicesVisible(true);
    }
  };

  // Define all variables here BEFORE any conditional renders
  const backgroundImage = gameState?.backgroundImage || 'default-interrogation-room.jpg';
  const auditorImage = gameState?.characterImages?.auditor || 'auditor_neutral.png';
  const subjectImage = gameState?.characterImages?.subject || 'subject_calm.png';
  const introImages = gameState?.introImages || [];
  const phaseName = gameState?.currentPhase || 'PHASE';

  // Check if we should show phase intro
  if (showPhaseIntro && introImages && introImages.length > 0) {
    return (
      <PhaseIntroScreen
        phaseName={phaseName}
        introImages={introImages}
        onComplete={handlePhaseIntroComplete}
        duration={2500}
      />
    );
  }

  // Main game screen render
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
            className="icon-button"
            onClick={() => setShowStats(!showStats)}
            title="Toggle Stats"
          >
            📊
          </button>
          <button
            className="icon-button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            className="icon-button"
            onClick={onHome}
            title="Return to Home"
          >
            🏠
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

      {/* Narrative Text - Top Center */}
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

      {/* Auditor Dialogue - Bottom Left */}
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

      {/* Subject Dialogue - Bottom Right */}
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

      {/* Choices Interface - Center */}
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

      {/* Scene Name - Bottom Left */}
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