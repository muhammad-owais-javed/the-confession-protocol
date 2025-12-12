// src/components/GameScreen/GameScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import './GameScreen.css';
import { playSound } from '../../utils/soundHelper';
import { playPhaseMusic, playSoundEffect, isAudioEnabledGlobal } from '../../utils/audioManager';

const GameScreen = ({ gameState, onChoice, onRestart }) => {
  const [displayedNarrative, setDisplayedNarrative] = useState('');
  const [displayedDialogue, setDisplayedDialogue] = useState('');
  const [choicesVisible, setChoicesVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);

  const narrativeRef = useRef(null);
  const dialogueRef = useRef(null);
  const typewriterTimerRef = useRef(null);
  const dialogueTimerRef = useRef(null);

  // Initialize phase music on mount and when phase changes
  useEffect(() => {


      
  if (gameState?.backgroundImage) {
    console.log("Background image:", gameState.backgroundImage);
    console.log("Character images:", gameState.characterImages);
    }
  }, [gameState?.backgroundImage]);


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

  // Typewriter effect for dialogue
  const startDialogueTypewriter = () => {
    if (!gameState?.subjectDialogue) {
      setChoicesVisible(true);
      return;
    }

    let index = 0;
    const text = gameState.subjectDialogue;
    setDisplayedDialogue('');

    // Play dialogue sound if specified
    if (gameState.dialogueSound && soundEnabled) {
      playSoundEffect(gameState.dialogueSound, 0.5);
    }

    // Play narrative sound if specified
    if (gameState.narrativeSounds?.soundEffect && soundEnabled) {
      playSoundEffect(
        gameState.narrativeSounds.soundEffect,
        gameState.narrativeSounds.volume || 0.6,
        gameState.narrativeSounds.delay || 0
      );
    }

    dialogueTimerRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedDialogue(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(dialogueTimerRef.current);
        setChoicesVisible(true);
        soundEnabled && playSound('dialogue-end');
      }
    }, 25);
  };

  // Handle choice selection
  const handleChoiceClick = async (choiceText, index) => {
    setSelectedChoiceIndex(index);
    setChoicesVisible(false);
    soundEnabled && playSound('choice-select');
    setIsTransitioning(true);

    setTimeout(() => {
      onChoice(choiceText);
      setIsTransitioning(false);
    }, 300);
  };

  // Skip typewriter
  const skipTypewriter = () => {
    if (displayedNarrative !== gameState.narrativeText) {
      setDisplayedNarrative(gameState.narrativeText);
      clearInterval(typewriterTimerRef.current);
      startDialogueTypewriter();
    } else if (displayedDialogue !== gameState.subjectDialogue) {
      setDisplayedDialogue(gameState.subjectDialogue);
      clearInterval(dialogueTimerRef.current);
      setChoicesVisible(true);
    }
  };

  // Get background image
  const backgroundImage = gameState?.backgroundImage || 'default-interrogation-room.jpg';
  const auditorImage = gameState?.characterImages?.auditor || 'auditor_neutral.png';
  const subjectImage = gameState?.characterImages?.subject || 'subject_calm.png';

  return (
    <div
      className="game-screen"
      style={{
        backgroundImage: backgroundImage ? `url(/images/${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Overlay */}
      <div className="game-background-overlay" />

      {/* Header */}
      <header className="game-header">
        <div className="header-left">
          <div className="room-label">ROOM 07</div>
          <div className="phase-name">{gameState?.currentPhase}</div>
        </div>

        <div className="header-center">
          <div className="scene-name">{gameState?.sceneName}</div>
        </div>

        <div className="header-right">
          <button
            className={`audio-toggle ${!soundEnabled ? 'muted' : ''}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* Character Silhouettes */}
      <div className="characters-layer">
        {/* Auditor - Left */}
        <div className="character-position auditor-position">
          <img
            src={`/silhouettes/${auditorImage}`}
            alt="Auditor"
            className="character-silhouette auditor"
            onError={(e) => {
              e.target.src =
                'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22300%22%3E%3Crect fill=%22%23333%22 width=%22150%22 height=%22300%22 opacity=%220.3%22/%3E%3C/svg%3E';
            }}
          />
        </div>

        {/* Subject - Right */}
        <div className="character-position subject-position">
          <img
            src={`/silhouettes/${subjectImage}`}
            alt="Subject"
            className="character-silhouette subject"
            onError={(e) => {
              e.target.src =
                'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22300%22%3E%3Crect fill=%22%23333%22 width=%22150%22 height=%22300%22 opacity=%220.3%22/%3E%3C/svg%3E';
            }}
          />
        </div>
      </div>

      {/* Main Game Content */}
      <div className="game-main">
        {/* Narrative Box */}
        <div className="narrative-box" onClick={skipTypewriter}>
          <div className="narrative-content" ref={narrativeRef}>
            {displayedNarrative}
            {displayedNarrative !== gameState?.narrativeText && (
              <span className="typewriter-cursor">█</span>
            )}
          </div>
          <div className="click-hint">
            {displayedNarrative !== gameState?.narrativeText && '(Click to skip)'}
          </div>
        </div>

        {/* Subject's Dialogue */}
        <div className="dialogue-box subject-dialogue">
          <div className="dialogue-label">SUBJECT</div>
          <div className="dialogue-content" ref={dialogueRef}>
            <span className="quote-mark">"</span>
            {displayedDialogue}
            {displayedDialogue !== gameState?.subjectDialogue && (
              <span className="typewriter-cursor">█</span>
            )}
            <span className="quote-mark">"</span>
          </div>
        </div>

        {/* Stats Display */}
        <div className="stats-display">
          <div className="stat-bar">
            <div className="stat-label">DENIAL</div>
            <div className="stat-value">{gameState?.psychologicalStats?.denial || 0}</div>
            <div className="progress-bar">
              <div
                className="progress-fill denial"
                style={{
                  width: `${gameState?.psychologicalStats?.denial || 0}%`
                }}
              />
            </div>
          </div>

          <div className="stat-bar">
            <div className="stat-label">GUILT</div>
            <div className="stat-value">{gameState?.psychologicalStats?.guilt || 0}</div>
            <div className="progress-bar">
              <div
                className="progress-fill guilt"
                style={{
                  width: `${gameState?.psychologicalStats?.guilt || 0}%`
                }}
              />
            </div>
          </div>

          <div className="stat-bar">
            <div className="stat-label">CONFUSION</div>
            <div className="stat-value">{gameState?.psychologicalStats?.confusion || 0}</div>
            <div className="progress-bar">
              <div
                className="progress-fill confusion"
                style={{
                  width: `${gameState?.psychologicalStats?.confusion || 0}%`
                }}
              />
            </div>
          </div>

          <div className="stat-bar">
            <div className="stat-label">ENLIGHTENMENT</div>
            <div className="stat-value">{gameState?.psychologicalStats?.enlightenment || 0}</div>
            <div className="progress-bar">
              <div
                className="progress-fill enlightenment"
                style={{
                  width: `${gameState?.psychologicalStats?.enlightenment || 0}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Choices */}
        <div className="choices-container">
          {choicesVisible && gameState?.availableChoices && gameState.availableChoices.length > 0 ? (
            <div className="choices-list">
              {gameState.availableChoices.map((choice, index) => (
                <button
                  key={index}
                  className={`choice-button ${selectedChoiceIndex === index ? 'selected' : ''}`}
                  onClick={() => handleChoiceClick(choice, index)}
                  disabled={isTransitioning}
                >
                  <span className="choice-arrow">→</span>
                  <span className="choice-text">{choice}</span>
                </button>
              ))}
            </div>
          ) : (
            !isTransitioning && (
              <button className="choice-button restart-button" onClick={onRestart}>
                <span className="choice-arrow">↺</span>
                <span className="choice-text">Return to Menu</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Transition Overlay */}
      {isTransitioning && <div className="transition-overlay" />}
    </div>
  );
};

export default GameScreen;