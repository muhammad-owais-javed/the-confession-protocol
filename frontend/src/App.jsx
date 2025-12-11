// src/App.jsx
import React, { useState } from 'react';
import HomePage from './components/HomePage/HomePage';
import GameScreen from './components/GameScreen/GameScreen';
import EndingScreen from './components/EndingScreen/EndingScreen';
import PhaseIntroScreen from './components/PhaseIntroScreen/PhaseIntroScreen';
import { handoffFromHomepage, stopPhaseMusic } from './utils/audioManager';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // home, game, phase-intro, ending
  const [gameState, setGameState] = useState(null);
  const [previousPhase, setPreviousPhase] = useState(null);

  // Handle game start
  const handleStartGame = async () => {
    try {
      handoffFromHomepage();
      const response = await fetch('http://localhost:8080/start');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGameState(data);
      setPreviousPhase(data.currentPhase);
      setCurrentScreen('game');
    } catch (error) {
      console.error('Failed to start game:', error);
      alert('Failed to connect to the game server. Make sure the backend is running on port 8080.');
    }
  };

  // Handle player choice during game
  const handleGameChoice = async (choiceText) => {
    try {
      const response = await fetch('http://localhost:8080/choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...gameState,
          chosenText: choiceText
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newGameState = await response.json();

      // Check if phase changed
      if (newGameState.currentPhase !== gameState.currentPhase) {
        setPreviousPhase(gameState.currentPhase);
        // Show phase intro if phase has intro images
        if (newGameState.introImages && newGameState.introImages.length > 0) {
          setCurrentScreen('phase-intro');
          // Set timeout to show intro then switch to game
          setTimeout(() => {
            setGameState(newGameState);
            setCurrentScreen('game');
          }, 7500); // Duration of intro screen
        } else {
          setGameState(newGameState);
        }
      } else if (newGameState.isEnding) {
        // Reached ending
        setGameState(newGameState);
        setCurrentScreen('ending');
      } else {
        // Normal scene change
        setGameState(newGameState);
      }
    } catch (error) {
      console.error('Failed to process choice:', error);
      alert('Error processing choice. Check console for details.');
    }
  };

  // Handle phase intro completion
  const handlePhaseIntroComplete = () => {
    if (gameState) {
      setCurrentScreen('game');
    }
  };

  // Handle restart
  const handleRestart = () => {
    stopPhaseMusic();
    setGameState(null);
    setPreviousPhase(null);
    setCurrentScreen('home');
  };

  return (
    <div className="app">
      {/* Home Screen */}
      {currentScreen === 'home' && (
        <HomePage onStartGame={handleStartGame} />
      )}

      {/* Phase Intro Screen */}
      {currentScreen === 'phase-intro' && gameState && (
        <PhaseIntroScreen
          phaseName={gameState.currentPhase}
          introImages={gameState.introImages || []}
          onComplete={handlePhaseIntroComplete}
          duration={2500}
        />
      )}

      {/* Game Screen */}
      {currentScreen === 'game' && gameState && (
        <GameScreen
          gameState={gameState}
          onChoice={handleGameChoice}
          onRestart={handleRestart}
        />
      )}

      {/* Ending Screen */}
      {currentScreen === 'ending' && gameState && (
        <EndingScreen gameState={gameState} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;