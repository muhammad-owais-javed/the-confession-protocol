// src/App.jsx
import React, { useState, useCallback } from 'react';
import HomePage from './components/HomePage/HomePage';
import GameScreen from './components/GameScreen/GameScreen';
import EndingScreen from './components/EndingScreen/EndingScreen';
import PhaseIntroScreen from './components/PhaseIntroScreen/PhaseIntroScreen';
import { handoffFromHomepage, stopPhaseMusic } from './utils/audioManager';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // home, game, phase-intro, ending
  const [gameState, setGameState] = useState(null);
  const [previousPhase, setPreviousPhase] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
      // Block further interactions during transition
      setIsTransitioning(true);

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
      console.log("Phase comparison:", {
        old: gameState.currentPhase,
        new: newGameState.currentPhase,
        changed: newGameState.currentPhase !== gameState.currentPhase
      });

      // Check if phase changed
      if (newGameState.currentPhase !== gameState.currentPhase) {
        console.log("PHASE CHANGED - transitioning to intro");
        setPreviousPhase(gameState.currentPhase);
        
        // Update gameState with new phase data
        setGameState(newGameState);
        
        // Show phase intro if phase has intro images
        if (newGameState.introImages && newGameState.introImages.length > 0) {
          console.log("Showing phase intro screen");
          setCurrentScreen('phase-intro');
        } else {
          console.log("No intro images, going straight to game");
          setCurrentScreen('game');
          setIsTransitioning(false);
        }
      } else if (newGameState.isEnding) {
        console.log("Game ending reached");
        setGameState(newGameState);
        setCurrentScreen('ending');
        setIsTransitioning(false);
      } else {
        // Normal scene change (same phase, different scene)
        console.log("Normal scene change");
        setGameState(newGameState);
        setIsTransitioning(false);
      }
    } catch (error) {
      console.error('Failed to process choice:', error);
      alert('Error processing choice. Check console for details.');
      setIsTransitioning(false);
    }
  };
  
  // Handle phase intro completion
  const handlePhaseIntroComplete = useCallback(() => {
    // Small delay to ensure screen transition is smooth
    setTimeout(() => {
      setCurrentScreen('game');
      setIsTransitioning(false);
    }, 100);
  }, []);

  // Handle restart
  const handleRestart = () => {
    stopPhaseMusic();
    setGameState(null);
    setPreviousPhase(null);
    setIsTransitioning(false);
    setCurrentScreen('home');
  };

  console.log("Current screen:", currentScreen);
  console.log("Is ending?", gameState?.isEnding);

  return (
    <div className="app">
      {/* Home Screen */}
      {currentScreen === 'home' && (
        <HomePage onStartGame={handleStartGame} />
      )}

      {/* Phase Intro Screen */}
      {currentScreen === 'phase-intro' && gameState && (
        <PhaseIntroScreen
          key={gameState.currentPhase}
          phaseName={gameState.currentPhase}
          introImages={gameState.introImages || []}
          onComplete={handlePhaseIntroComplete}
          duration={2500}
        />
      )}

      {/* Game Screen */}
      {currentScreen === 'game' && gameState && !isTransitioning && (
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