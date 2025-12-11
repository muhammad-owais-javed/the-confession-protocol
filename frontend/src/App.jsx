// src/App.jsx
import React, { useState } from 'react';
import HomePage from './components/HomePage/HomePage';
import GameScreen from './components/GameScreen/GameScreen';
// import EndingScreen from './components/EndingScreen/EndingScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // home, game, ending
  const [gameState, setGameState] = useState(null);

  const handleStartGame = async () => {
    try {
      const response = await fetch('http://localhost:8080/start');
      const data = await response.json();
      setGameState(data);
      setCurrentScreen('game');
    } catch (error) {
      console.error('Failed to start game:', error);
      alert('Failed to connect to the game server. Make sure the backend is running on port 8080.');
    }
  };

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
      const newGameState = await response.json();
      
      if (newGameState.isEnding) {
        setGameState(newGameState);
        setCurrentScreen('ending');
      } else {
        setGameState(newGameState);
      }
    } catch (error) {
      console.error('Failed to process choice:', error);
    }
  };

  const handleRestart = () => {
    setGameState(null);
    setCurrentScreen('home');
  };

  return (
    <div className="app">
      {currentScreen === 'home' && (
        <HomePage onStartGame={handleStartGame} />
      )}
      
      {currentScreen === 'game' && gameState && (
        <GameScreen gameState={gameState} onChoice={handleGameChoice} onRestart={handleRestart} />
      )}

      {currentScreen === 'ending' && gameState && (
        // <EndingScreen gameState={gameState} onRestart={handleRestart} />
        <div style={{ padding: '20px', color: '#fff' }}>
          <p>EndingScreen component coming next...</p>
          <p>Ending: {gameState.sceneName}</p>
          <button onClick={handleRestart} style={{ padding: '10px 20px', marginTop: '20px' }}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;