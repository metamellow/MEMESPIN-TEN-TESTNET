import { useState } from 'react';
import { motion } from 'framer-motion';

export const Game = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [points, setPoints] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [chosenColor, setChosenColor] = useState<string | null>(null);

  const colors = [
    { name: 'ORANGE', color: '#ff9a2d' },
    { name: 'PINK', color: '#ee4d9f' },
    { name: 'GREEN', color: '#4ddc4d' }
  ];

  // Generate random spin parameters with enhanced variability
  const generateRandomSpin = () => {
    const baseDuration = 2.5 + Math.random() * 4; // 2.5-6.5 seconds
    const extraRandomness = (Math.random() - 0.5) * 3; // ±1.5 second variation
    const spinDuration = baseDuration + extraRandomness;
    
    const minSpins = 2;
    const maxSpins = 8;
    const spinMultiplier = 0.8 + Math.random() * 1.4; // 0.8-2.2x
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
  const getColorAtPosition = (degrees: number): string => {
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

  // Handle animation completion to show results exactly when wheel stops
  const handleAnimationComplete = () => {
    if (isSpinning && chosenColor) {
      setIsSpinning(false);
      
      // Calculate final visual position and invert for color detection
      const finalVisualPosition = wheelRotation % 360;
      const normalizedPosition = finalVisualPosition < 0 ? finalVisualPosition + 360 : finalVisualPosition;
      const invertedPosition = (360 - normalizedPosition) % 360;
      
      const winningColor = getColorAtPosition(invertedPosition);
      const isWin = winningColor === chosenColor;
      
      setResult(isWin ? 'WIN!' : 'LOSE!');
      setShowResult(true);
      
      if (isWin) {
        setPoints(prev => prev + 10);
      }
      
      setTimeout(() => setShowResult(false), 2000);
    }
  };

  const spinWheel = (chosenColor: string) => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    setShowResult(false);
    setChosenColor(chosenColor); // Store chosen color for win detection
    
    const spinData = generateRandomSpin();
    const newRotation = wheelRotation + spinData.totalRotation;
    
    setWheelRotation(newRotation);
  };

  return (
    <div className="game-container">
      <div className="game-wrapper">
        {/* Spinning wheel - underneath */}
        <motion.div
          className="game-wheel"
          animate={{ rotate: wheelRotation }}
          transition={{ 
            duration: isSpinning ? 4 : 0, 
            ease: [0.25, 0.1, 0.25, 1],
            times: [0, 0.8, 1]
          }}
          onAnimationComplete={handleAnimationComplete}
        />
        
        {/* Slot machine - on top */}
        <div className="game-machine" />
        
        {/* Top display panel */}
        <div className="game-display">
          <div>Memespin Points: <span className="game-points">{points.toFixed(2)}</span></div>
          <button className="game-connect-button">Connect Wallet</button>
        </div>
        
        {/* Color buttons */}
        <div className="game-buttons">
          {colors.map((color) => (
            <button
              key={color.name}
              className="game-color-button"
              style={{ background: color.color }}
              disabled={isSpinning}
              onClick={() => spinWheel(color.name)}
            >
              {color.name}
            </button>
          ))}
        </div>
        
        {/* Result popup */}
        <div 
          className={`game-result ${showResult ? 'show' : ''} ${result === 'WIN!' ? 'win' : 'lose'}`}
        >
          {result}
        </div>
      </div>
    </div>
  );
};
