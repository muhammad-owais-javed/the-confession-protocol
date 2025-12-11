// src/utils/soundHelper.js

let audioContext = null;

/**
 * Initialize Web Audio API context (must be called after user interaction)
 */
const initAudioContext = () => {
  if (audioContext) return audioContext;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    return audioContext;
  } catch (e) {
    console.warn('Web Audio API not supported:', e);
    return null;
  }
};

/**
 * Play a UI sound effect
 * @param {string} type - Type of sound: 'choice-select', 'dialogue-end', 'phase-transition'
 */
export const playSound = (type) => {
  const ctx = initAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    switch (type) {
      case 'choice-select':
        // Ascending beep for choice selection
        playChoiceSelectSound(ctx, now);
        break;

      case 'dialogue-end':
        // Subtle notification sound
        playDialogueEndSound(ctx, now);
        break;

      case 'phase-transition':
        // Longer, more dramatic sound
        playPhaseTransitionSound(ctx, now);
        break;

      case 'ending-reach':
        // Conclusion sound
        playEndingSound(ctx, now);
        break;

      default:
        break;
    }
  } catch (e) {
    console.warn('Sound playback error:', e);
  }
};

/**
 * Choice selection sound - ascending tone
 */
const playChoiceSelectSound = (ctx, now) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  osc.start(now);
  osc.stop(now + 0.1);
};

/**
 * Dialogue end sound - subtle ping
 */
const playDialogueEndSound = (ctx, now) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(400, now);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

  osc.start(now);
  osc.stop(now + 0.15);
};

/**
 * Phase transition sound - dramatic sweep
 */
const playPhaseTransitionSound = (ctx, now) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);

  gain.gain.setValueAtTime(0.1, now);
  gain.gain.setValueAtTime(0.1, now + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

  osc.start(now);
  osc.stop(now + 0.5);
};

/**
 * Ending reach sound - conclusive tone
 */
const playEndingSound = (ctx, now) => {
  // Create a more complex ending sound with harmonics
  const frequencies = [220, 330, 440]; // A3, E4, A4

  frequencies.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

    osc.start(now);
    osc.stop(now + 0.8);
  });
};

/**
 * Stop all sounds
 */
export const stopAllSounds = () => {
  if (audioContext && audioContext.state === 'running') {
    // Web Audio API doesn't have a "stop all" method,
    // so we'd need to track oscillators individually if we want to stop them
    // For now, this is a placeholder for future enhancement
  }
};

/**
 * Test audio playback
 */
export const testAudio = () => {
  console.log('Testing audio system...');
  playSound('choice-select');
  setTimeout(() => playSound('dialogue-end'), 200);
  setTimeout(() => playSound('phase-transition'), 400);
};