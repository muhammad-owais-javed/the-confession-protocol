// src/components/GameScreen/GameScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import './GameScreen.css';
import { getPortrait } from '../../utils/portraitHelper';
import { playSound } from '../../utils/soundHelper';

const GameScreen = ({ gameState, onChoice, onRestart }) => {
  const [displayedNarrative, setDisplayedNarrative] = useState('');
  const [displayedDialogue, setDisplayedDialogue] = useState('');
  const [choicesVisible, setChoicesVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [phaseTransition, setPhaseTransition] = useState(false);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);

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
        // Start dialogue typewriter after narrative completes
        startDialogueTypewriter();
      }
    }, 25); // Adjust speed here (25ms per character)

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

    // Brief delay for visual feedback
    setTimeout(() => {
      onChoice(choiceText);
      setIsTransitioning(false);
    }, 300);
  };

  // Skip typewriter (click to reveal all text)
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

  const auditorPortrait = getPortrait('auditor', gameState.psychologicalStats);
  const subjectPortrait = getPortrait('subject', gameState.psychologicalStats);

  return (
    <div className="game-screen">
      {/* Header */}
      <header className="game-header">
        <div className="header-left">
          <div className="room-label">ROOM 07</div>
          <div className="phase-name">{gameState.currentPhase}</div>
        </div>

        <div className="header-center">
          <div className="scene-name">{gameState.sceneName}</div>
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

      {/* Main Game Content */}
      <div className="game-main">
        {/* Left Panel - Character Portraits */}
        <div className="character-panel left-panel">
          <div className="portrait-container subject-portrait">
            <img
              src={`/portraits/${subjectPortrait}`}
              alt="The Subject"
              onError={(e) => {
                e.target.src =
                  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22250%22%3E%3Crect fill=%22%23374151%22 width=%22200%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239CA3AF%22 font-size=%2214%22%3ETHE SUBJECT%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
          <div className="character-label">THE SUBJECT</div>
        </div>

        {/* Center Panel - Dialogue & Choices */}
        <div className="interaction-panel">
          {/* Narrative Box */}
          <div className="narrative-box" onClick={skipTypewriter}>
            <div className="narrative-content" ref={narrativeRef}>
              {displayedNarrative}
              {displayedNarrative !== gameState.narrativeText && (
                <span className="typewriter-cursor">█</span>
              )}
            </div>
            <div className="click-hint">
              {displayedNarrative !== gameState.narrativeText && '(Click to skip)'}
            </div>
          </div>

          {/* Subject's Dialogue */}
          <div className="dialogue-box subject-dialogue">
            <div className="dialogue-label">SUBJECT'S STATEMENT</div>
            <div className="dialogue-content" ref={dialogueRef}>
              <span className="quote-mark">"</span>
              {displayedDialogue}
              {displayedDialogue !== gameState.subjectDialogue && (
                <span className="typewriter-cursor">█</span>
              )}
              <span className="quote-mark">"</span>
            </div>
          </div>

          {/* Stats Display */}
          <div className="stats-display">
            <div className="stat-bar">
              <div className="stat-label">DENIAL</div>
              <div className="stat-value">{gameState.psychologicalStats.denial}</div>
              <div className="progress-bar">
                <div
                  className="progress-fill denial"
                  style={{
                    width: `${gameState.psychologicalStats.denial}%`
                  }}
                />
              </div>
            </div>

            <div className="stat-bar">
              <div className="stat-label">GUILT</div>
              <div className="stat-value">{gameState.psychologicalStats.guilt}</div>
              <div className="progress-bar">
                <div
                  className="progress-fill guilt"
                  style={{
                    width: `${gameState.psychologicalStats.guilt}%`
                  }}
                />
              </div>
            </div>

            <div className="stat-bar">
              <div className="stat-label">CONFUSION</div>
              <div className="stat-value">{gameState.psychologicalStats.confusion}</div>
              <div className="progress-bar">
                <div
                  className="progress-fill confusion"
                  style={{
                    width: `${gameState.psychologicalStats.confusion}%`
                  }}
                />
              </div>
            </div>

            <div className="stat-bar">
              <div className="stat-label">ENLIGHTENMENT</div>
              <div className="stat-value">{gameState.psychologicalStats.enlightenment}</div>
              <div className="progress-bar">
                <div
                  className="progress-fill enlightenment"
                  style={{
                    width: `${gameState.psychologicalStats.enlightenment}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Choices */}
          <div className="choices-container">
            {choicesVisible && gameState.availableChoices && gameState.availableChoices.length > 0 ? (
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

        {/* Right Panel - Character Portrait */}
        <div className="character-panel right-panel">
          <div className="portrait-container auditor-portrait">
            <img
              src={`/portraits/${auditorPortrait}`}
              alt="Auditor 07"
              onError={(e) => {
                e.target.src =
                  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22250%22%3E%3Crect fill=%22%23374151%22 width=%22200%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239CA3AF%22 font-size=%2214%22%3EAUDITOR 07%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
          <div className="character-label">AUDITOR 07</div>
        </div>
      </div>

      {/* Loading/Transitioning Overlay */}
      {isTransitioning && <div className="transition-overlay" />}
    </div>
  );
};

export default GameScreen;