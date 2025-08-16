import { useState, useCallback } from 'react';
import type { GameState, GameResult } from '../types/game';
import { 
  GAME_CONFIG, 
  generateRandomSpin, 
  calculateFinalPosition, 
  checkWin 
} from '../utils/gameLogic';

const initialState: GameState = {
  isSpinning: false,
  points: 0,
  result: null,
  showResult: false,
  wheelRotation: 0,
  chosenColor: null
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const spinWheel = useCallback((chosenColor: string) => {
    if (gameState.isSpinning) return;
    
    setGameState(prev => ({
      ...prev,
      isSpinning: true,
      result: null,
      showResult: false,
      chosenColor
    }));
    
    const spinData = generateRandomSpin();
    const newRotation = gameState.wheelRotation + spinData.totalRotation;
    
    setGameState(prev => ({
      ...prev,
      wheelRotation: newRotation
    }));
  }, [gameState.isSpinning, gameState.wheelRotation]);

  const handleAnimationComplete = useCallback(() => {
    if (gameState.isSpinning && gameState.chosenColor) {
      const finalPosition = calculateFinalPosition(gameState.wheelRotation);
      const isWin = checkWin(gameState.chosenColor, finalPosition);
      
      const result: GameResult = {
        type: isWin ? 'WIN' : 'LOSE',
        message: isWin ? 'WIN!' : 'LOSE!',
        points: isWin ? GAME_CONFIG.points.win : GAME_CONFIG.points.lose
      };
      
      setGameState(prev => ({
        ...prev,
        isSpinning: false,
        result,
        showResult: true,
        points: isWin ? prev.points + result.points : prev.points
      }));
      
      // Auto-hide result after 2 seconds
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          showResult: false
        }));
      }, 2000);
    }
  }, [gameState.isSpinning, gameState.chosenColor, gameState.wheelRotation]);

  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  const addPoints = useCallback((points: number) => {
    setGameState(prev => ({
      ...prev,
      points: prev.points + points
    }));
  }, []);

  return {
    gameState,
    spinWheel,
    handleAnimationComplete,
    resetGame,
    addPoints,
    colors: GAME_CONFIG.colors
  };
};
