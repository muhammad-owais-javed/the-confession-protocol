// src/utils/audioManager.js

let phaseAudioRef = null;
let soundEffectAudioRef = null;
let currentPhase = null;
let isAudioEnabled = true;

/**
 * Initialize phase audio system
 */
export const initPhaseAudio = () => {
  if (!phaseAudioRef) {
    phaseAudioRef = new Audio();
    phaseAudioRef.volume = 0;
    phaseAudioRef.loop = true;
  }
  if (!soundEffectAudioRef) {
    soundEffectAudioRef = new Audio();
  }
};

/**
 * Play phase background music with fade in
 * @param {string} musicFile - Path to music file (e.g., "phase_1_theme.mp3")
 * @param {number} targetVolume - Target volume (0-1)
 * @param {number} duration - Fade duration in ms
 */
export const playPhaseMusic = (musicFile, targetVolume = 0.4, duration = 2000) => {
  initPhaseAudio();

  if (!isAudioEnabled) return;

  try {
    // Only change if different music
    if (phaseAudioRef.src !== `/audio/${musicFile}`) {
      phaseAudioRef.src = `/audio/${musicFile}`;
      phaseAudioRef.volume = 0;
      phaseAudioRef.play().catch(err => {
        console.log('Phase music autoplay prevented:', err);
      });
    }

    // Fade in to target volume
    fadeAudioTo(phaseAudioRef, targetVolume, duration);
  } catch (error) {
    console.error('Error playing phase music:', error);
  }
};

/**
 * Stop phase music with fade out
 * @param {number} duration - Fade duration in ms
 */
export const stopPhaseMusic = (duration = 1000) => {
  if (!phaseAudioRef) return;

  fadeAudioTo(phaseAudioRef, 0, duration).then(() => {
    phaseAudioRef.pause();
    phaseAudioRef.currentTime = 0;
  });
};

/**
 * Play sound effect (one-time play)
 * @param {string} soundFile - Path to sound file
 * @param {number} volume - Volume (0-1)
 * @param {number} delay - Delay before playing in ms
 */
export const playSoundEffect = (soundFile, volume = 0.6, delay = 0) => {
  if (!isAudioEnabled) return;

  setTimeout(() => {
    try {
      initPhaseAudio();
      soundEffectAudioRef.src = `/audio/${soundFile}`;
      soundEffectAudioRef.volume = volume;
      soundEffectAudioRef.play().catch(err => {
        console.log('Sound effect play prevented:', err);
      });
    } catch (error) {
      console.error('Error playing sound effect:', error);
    }
  }, delay);
};

/**
 * Fade audio to target volume
 * @param {HTMLAudioElement} audioElement - Audio element to fade
 * @param {number} targetVolume - Target volume (0-1)
 * @param {number} duration - Fade duration in ms
 * @returns {Promise}
 */
const fadeAudioTo = (audioElement, targetVolume, duration) => {
  return new Promise((resolve) => {
    if (!audioElement) {
      resolve();
      return;
    }

    const startVolume = audioElement.volume;
    const volumeDifference = targetVolume - startVolume;
    const stepDuration = 50; // ms per step
    const steps = Math.ceil(duration / stepDuration);
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      audioElement.volume = startVolume + volumeDifference * progress;

      if (progress === 1) {
        clearInterval(fadeInterval);
        resolve();
      }
    }, stepDuration);
  });
};

/**
 * Get current phase music volume
 */
export const getPhaseVolume = () => {
  return phaseAudioRef?.volume || 0;
};

/**
 * Set phase music volume directly
 */
export const setPhaseVolume = (volume) => {
  if (phaseAudioRef) {
    phaseAudioRef.volume = Math.max(0, Math.min(1, volume));
  }
};

/**
 * Toggle audio on/off
 */
export const toggleAudio = () => {
  isAudioEnabled = !isAudioEnabled;

  if (isAudioEnabled) {
    // Resume phase music
    if (phaseAudioRef) {
      fadeAudioTo(phaseAudioRef, 0.4, 500);
    }
  } else {
    // Pause all audio
    if (phaseAudioRef) {
      fadeAudioTo(phaseAudioRef, 0, 500).then(() => {
        phaseAudioRef.pause();
      });
    }
    if (soundEffectAudioRef) {
      soundEffectAudioRef.pause();
    }
  }

  return isAudioEnabled;
};

/**
 * Check if audio is enabled
 */
export const isAudioEnabledGlobal = () => {
  return isAudioEnabled;
};

/**
 * Stop all audio immediately
 */
export const stopAllAudio = () => {
  if (phaseAudioRef) {
    phaseAudioRef.pause();
    phaseAudioRef.currentTime = 0;
  }
  if (soundEffectAudioRef) {
    soundEffectAudioRef.pause();
    soundEffectAudioRef.currentTime = 0;
  }
};

/**
 * Transition between phase music
 * @param {string} newMusicFile - New phase music file
 * @param {number} newVolume - Volume for new music
 */
export const transitionPhaseMusic = async (newMusicFile, newVolume = 0.4) => {
  if (currentPhase === newMusicFile) return; // Same phase, no change

  // Fade out current
  await stopPhaseMusic(1000);

  // Fade in new
  currentPhase = newMusicFile;
  playPhaseMusic(newMusicFile, newVolume, 1500);
};

/**
 * Initialize with homepage music (optional)
 * Can be used to handoff from homepage to game
 */
export const handoffFromHomepage = () => {
  // Stop/pause any homepage audio reference
  // This helps with clean transition to game audio
};