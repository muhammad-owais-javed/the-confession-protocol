// src/App.jsx
import React, { useState } from 'react';
import HomePage from './components/HomePage/HomePage';
import GameScreen from './components/GameScreen/GameScreen';
import EndingScreen from './components/EndingScreen/EndingScreen';
import PhaseTransition from './components/PhaseTransition/PhaseTransition';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // home, game, ending
  const [gameState, setGameState] = useState(null);
  const [previousPhase, setPreviousPhase] = useState(null);
  const [showPhaseTransition, setShowPhaseTransition] = useState(false);

  // Handle game start
  const handleStartGame = async () => {
    try {
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

      // Check if phase changed (trigger phase transition)
      if (newGameState.currentPhase !== gameState.currentPhase) {
        setPreviousPhase(gameState.currentPhase);
        setShowPhaseTransition(true);
        
        // After transition completes, update state
        setTimeout(() => {
          setGameState(newGameState);
          setShowPhaseTransition(false);
        }, 2500);
      } else if (newGameState.isEnding) {
        // Reached ending - go to ending screen
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

  // Handle phase transition completion
  const handlePhaseTransitionComplete = () => {
    setShowPhaseTransition(false);
  };

  // Handle restart - back to home
  const handleRestart = () => {
    setGameState(null);
    setPreviousPhase(null);
    setShowPhaseTransition(false);
    setCurrentScreen('home');
  };

  return (
    <div className="app">
      {/* Phase Transition Overlay */}
      {showPhaseTransition && gameState && (
        <PhaseTransition
          phaseName={gameState.currentPhase}
          onComplete={handlePhaseTransitionComplete}
          duration={2500}
        />
      )}

      {/* Home Screen */}
      {currentScreen === 'home' && (
        <HomePage onStartGame={handleStartGame} />
      )}

      {/* Game Screen */}
      {currentScreen === 'game' && gameState && !showPhaseTransition && (
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