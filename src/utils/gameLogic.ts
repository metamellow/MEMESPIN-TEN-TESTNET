import type { GameConfig, SpinData } from '../types/game';

// Game configuration constants
export const GAME_CONFIG: GameConfig = {
  colors: [
    { name: 'ORANGE', color: '#ff9a2d' },
    { name: 'PINK', color: '#ee4d9f' },
    { name: 'GREEN', color: '#4ddc4d' }
  ],
  spinDuration: {
    min: 2.5,
    max: 6.5,
    variation: 1.5
  },
  spinCount: {
    min: 2,
    max: 8,
    multiplier: {
      min: 0.8,
      max: 2.2
    }
  },
  points: {
    win: 10,
    lose: 0
  }
};

// Generate random spin parameters with enhanced variability
export const generateRandomSpin = (): SpinData => {
  const { min, max, variation } = GAME_CONFIG.spinDuration;
  const baseDuration = min + Math.random() * (max - min);
  const extraRandomness = (Math.random() - 0.5) * variation;
  const spinDuration = baseDuration + extraRandomness;
  
  const { min: minSpins, max: maxSpins, multiplier } = GAME_CONFIG.spinCount;
  const spinMultiplier = multiplier.min + Math.random() * (multiplier.max - multiplier.min);
  const fullSpins = Math.min(Math.floor(spinDuration * spinMultiplier), maxSpins);
  const actualSpins = Math.max(fullSpins, minSpins);
  
  const randomTarget = Math.random() * 360; // Completely random target
  
  return {
    duration: spinDuration,
    spins: actualSpins,
    target: randomTarget,
    totalRotation: (actualSpins * 360) + randomTarget
  };
};

// Determine winning color based on wheel position
export const getColorAtPosition = (degrees: number): string => {
  const normalizedDegrees = ((degrees % 360) + 360) % 360;
  
  // Color mapping: 0°-120°: PINK, 120°-240°: GREEN, 240°-360°: ORANGE
  if (normalizedDegrees >= 0 && normalizedDegrees < 120) {
    return 'PINK';
  } else if (normalizedDegrees >= 120 && normalizedDegrees < 240) {
    return 'GREEN';
  } else {
    return 'ORANGE';
  }
};

// Calculate final wheel position for result determination
export const calculateFinalPosition = (wheelRotation: number): number => {
  const finalVisualPosition = wheelRotation % 360;
  const normalizedPosition = finalVisualPosition < 0 ? finalVisualPosition + 360 : finalVisualPosition;
  return (360 - normalizedPosition) % 360;
};

// Check if player won based on chosen color and final position
export const checkWin = (chosenColor: string, finalPosition: number): boolean => {
  const winningColor = getColorAtPosition(finalPosition);
  return winningColor === chosenColor;
};
