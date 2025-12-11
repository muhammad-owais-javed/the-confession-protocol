// src/utils/portraitHelper.js

/**
 * Determines which character portrait to display based on psychological stats
 * @param {string} character - 'auditor' or 'subject'
 * @param {object} stats - { denial, guilt, confusion, enlightenment }
 * @returns {string} - filename of the portrait image
 */
export const getPortrait = (character, stats) => {
  if (!stats) {
    return `${character}_neutral.png`;
  }

  const { denial, guilt, confusion, enlightenment } = stats;

  if (character === 'auditor') {
    // Auditor portraits based on psychological breakdown
    
    // Highest state: guilt + confusion (maximum psychological distress)
    if (guilt > 70 && confusion > 60) {
      return 'auditor_guilt_confused.png';
    }
    
    // High guilt (shame, regret)
    if (guilt > 70) {
      return 'auditor_guilt.png';
    }
    
    // High confusion (disorientation, reality breaking)
    if (confusion > 20) {
      return 'auditor_confused.png';
    }
    
    // High denial (defensive, refusing truth)
    if (denial > 70) {
      return 'auditor_denial.png';
    }
    
    // High enlightenment (awakened, understanding)
    if (enlightenment > 70) {
      return 'auditor_enlightened.png';
    }
    
    // Moderate states
    if (guilt > 50 && confusion > 40) {
      return 'auditor_guilt_confused.png';
    }
    
    if (guilt > 50) {
      return 'auditor_guilt.png';
    }
    
    if (confusion > 50) {
      return 'auditor_confused.png';
    }
    
    if (denial > 50) {
      return 'auditor_denial.png';
    }
    
    // Default neutral state
    return 'auditor_neutral.png';
  } 
  
  else if (character === 'subject') {
    // Subject portraits based on interrogation progress
    
    // High enlightenment (knowing the truth, in control)
    if (enlightenment > 70) {
      return 'subject_knowing.png';
    }
    
    // High confusion (disturbed, unstable)
    if (confusion > 60) {
      return 'subject_disturbed.png';
    }
    
    // High guilt (sympathetic, emotional)
    if (guilt > 70) {
      return 'subject_sympathetic.png';
    }
    
    // High denial (aggressive, defensive)
    if (denial > 60) {
      return 'subject_defensive.png';
    }
    
    // Moderate states
    if (confusion > 40) {
      return 'subject_disturbed.png';
    }
    
    if (guilt > 50) {
      return 'subject_sympathetic.png';
    }
    
    // Default calm state
    return 'subject_calm.png';
  }

  return `${character}_neutral.png`;
};

/**
 * Get portrait description for debugging/logging
 */
export const getPortraitDescription = (character, stats) => {
  const portrait = getPortrait(character, stats);
  const descriptions = {
    auditor_neutral: 'The Auditor - Focused and composed',
    auditor_guilt: 'The Auditor - Wracked with guilt',
    auditor_confused: 'The Auditor - Disoriented and confused',
    auditor_denial: 'The Auditor - Defensive and denying',
    auditor_enlightened: 'The Auditor - Awakened to the truth',
    auditor_guilt_confused: 'The Auditor - Torn between guilt and confusion',
    subject_calm: 'The Subject - Calm and measured',
    subject_disturbed: 'The Subject - Visibly disturbed',
    subject_sympathetic: 'The Subject - Showing sympathy',
    subject_defensive: 'The Subject - Defensive and hostile',
    subject_knowing: 'The Subject - Knowing and in control',
  };
  
  const key = portrait.replace('.png', '');
  return descriptions[key] || 'Unknown state';
};