import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';

export const Game = () => {
  const {
    gameState,
    spinWheel,
    handleAnimationComplete,
    colors
  } = useGame();

  const { isSpinning, points, result, showResult, wheelRotation } = gameState;

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
          className={`game-result ${showResult ? 'show' : ''} ${result?.type === 'WIN' ? 'win' : 'lose'}`}
        >
          {result?.message}
        </div>
      </div>
    </div>
  );
};
