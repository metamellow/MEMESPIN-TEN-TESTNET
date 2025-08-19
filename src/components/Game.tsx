import { motion } from 'framer-motion';
import { useBlockchain } from '../hooks/useBlockchain';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useCallback } from 'react';
import type { SpinningState } from '../utils/spinningLogic';
import { calculateSpin, updateStateAfterSpin } from '../utils/spinningLogic';
import { Confetti } from './Confetti';
import { soundManager } from '../utils/soundManager';

export const Game = () => {
  const { connectWallet: privyConnectWallet } = usePrivy();
  const {
    playGame, 
    isLoading, 
    isConnected, 
    betAmount, 
    updateBetAmount, 
    connectWallet,
    ethBalance,
    error,
    authenticated
  } = useBlockchain();

  // Game state
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiColor, setConfettiColor] = useState<'ORANGE' | 'PINK' | 'GREEN'>('ORANGE');

  // Spinning state - tracks wheel position across spins
  const [spinningState, setSpinningState] = useState<SpinningState>({
    totalRotation: 0,
    currentVisualPosition: 0,
    currentColor: 'ORANGE'
  });

  // Animation duration
  const [animationDuration, setAnimationDuration] = useState(4);

  // Color mapping to match smart contract (0: ORANGE, 1: PINK, 2: GREEN)
  const colors = [
    { name: 'ORANGE', displayName: 'DOGE', color: '#ff8c00', index: 0 },
    { name: 'PINK', displayName: 'ELON', color: '#ff69b4', index: 1 },
    { name: 'GREEN', displayName: 'PEPE', color: '#32cd32', index: 2 }
  ];

  const showUserMessage = useCallback((message: string) => {
    setUserMessage(message);
    setTimeout(() => setUserMessage(null), 4000);
  }, []);

  const spinWheel = useCallback(async (chosenColor: string) => {
    if (isSpinning || isLoading) return;
    
    console.log('🎮 SPIN REQUESTED:', chosenColor);
    
    // Play click sound
    soundManager.play('click');
    
    // If not connected, trigger wallet connection
    if (!isConnected) {
      if (authenticated) {
        privyConnectWallet();
      } else {
        connectWallet();
      }
      return;
    }

    // Convert color name to smart contract index
    const colorIndex = colors.find(c => c.name === chosenColor)?.index;
    if (colorIndex === undefined) return;

    setIsSpinning(true);
    setGameResult(null);
    setShowResult(false);
    setShowConfetti(false);
    showUserMessage('Processing...');

    // Note: Spin sound will play after transaction confirmation when wheel starts spinning

    try {
      // Call blockchain to play game
      const result = await playGame(colorIndex);
      
      if (result) {
        setGameResult(result);
        
        // Get the target result from blockchain
        const targetColorIndex = Number(result.resultColor);
        const targetColor = colors[targetColorIndex];
        
        console.log('🎯 BLOCKCHAIN RESULT:', {
          chosenColor,
          resultColor: targetColor.name,
          outcome: result.outcome === 0 ? 'WIN' : 'LOSE',
          payout: result.payout
        });

        // Calculate the spin using our clean logic
        const spinResult = calculateSpin(spinningState, targetColor.name as 'ORANGE' | 'PINK' | 'GREEN');
        
        // Update the spinning state to maintain position for next spin
        const newSpinningState = updateStateAfterSpin(spinResult);
        setSpinningState(newSpinningState);
        
        // Set animation duration based on number of rotations
        const duration = 2 + (spinResult.fullRotations * 0.4);
        setAnimationDuration(duration);
        
        // Play spin sound now that the wheel is actually spinning
        soundManager.play('spin');
        
        // Show result after animation completes
        setTimeout(() => {
          setShowResult(true);
          setIsSpinning(false);
          
          // Show win/lose message
          const isWin = Number(result.outcome) === 0;
          showUserMessage(isWin ? 'You Won!' : 'You Lost!');
          
          // Play win/lose sound
          if (isWin) {
            soundManager.play('win');
            // Show confetti for the chosen color
            setConfettiColor(chosenColor as 'ORANGE' | 'PINK' | 'GREEN');
            setShowConfetti(true);
          } else {
            soundManager.play('lose');
          }
          
          // Auto-hide result after 3 seconds
          setTimeout(() => {
            setShowResult(false);
            setGameResult(null);
          }, 3000);
        }, duration * 1000);
      }
    } catch (error) {
      console.error('Game failed:', error);
      setIsSpinning(false);
      showUserMessage('Transaction failed');
    }
  }, [isSpinning, isConnected, isLoading, playGame, colors, spinningState, connectWallet, authenticated, privyConnectWallet, showUserMessage]);

  const handleAnimationComplete = useCallback(() => {
    console.log('🎯 ANIMATION COMPLETE - Wheel stopped at:', {
      finalPosition: spinningState.currentVisualPosition.toFixed(1) + '°',
      finalColor: spinningState.currentColor,
      totalRotation: spinningState.totalRotation.toFixed(1) + '°',
      cssRotationMod360: (spinningState.totalRotation % 360).toFixed(1) + '°',
      expectedColorAtCSS: getColorAtCSSRotation(spinningState.totalRotation)
    });
  }, [spinningState]);

  // Helper function to get color at CSS rotation
  const getColorAtCSSRotation = useCallback((rotation: number) => {
    const angle = rotation % 360;
    if (angle >= 0 && angle <= 120) return 'GREEN';
    if (angle >= 121 && angle <= 240) return 'PINK';
    if (angle >= 241 && angle <= 360) return 'ORANGE';
    return 'UNKNOWN';
  }, []);

  const getResultMessage = () => {
    if (!gameResult) return '';
    const isWin = Number(gameResult.outcome) === 0;
    return isWin ? 'WIN!' : 'LOSE!';
  };

  return (
    <div className="game-container">
      <div className="game-wrapper">
        {/* Spinning wheel - underneath */}
        <motion.div
          className="game-wheel"
          animate={{ rotate: spinningState.totalRotation }}
          transition={{ 
            duration: isSpinning ? animationDuration : 0, 
            ease: [0.25, 0.1, 0.25, 1],
            times: [0, 0.8, 1]
          }}
          onAnimationComplete={handleAnimationComplete}
        />
        
        {/* Slot machine - on top */}
        <div className="game-machine" />
        
        {/* Game Display Panel */}
        <div className="game-display">
          {!isConnected ? (
            <div className="game-connect-message">
              CLICK BUTTONS TO CONNECT
            </div>
          ) : userMessage ? (
            <div className="game-user-message">
              {userMessage}
            </div>
          ) : (
            <div className="game-bet-info">
              <div className="game-bet-amount" 
                onClick={() => {
                  soundManager.play('click');
                  const newAmount = prompt('Enter bet amount (ETH):', betAmount);
                  if (newAmount && !isNaN(Number(newAmount))) {
                    updateBetAmount(newAmount);
                  }
                }}
              >
                Bet: {betAmount} ETH
              </div>
              <div className="game-wallet-balance">
                {parseFloat(ethBalance).toFixed(4)} ETH
              </div>
            </div>
          )}
          
          {error && (
            <div className="game-error">
              {error}
            </div>
          )}
        </div>
        
        {/* Color buttons */}
        <div className="game-buttons">
          {colors.map((color) => (
            <button
              key={color.name}
              className="game-color-button"
              style={{ background: color.color }}
              disabled={isSpinning || isLoading}
              onClick={() => spinWheel(color.name)}
            >
              {color.displayName}
            </button>
          ))}
        </div>
        
        {/* Result popup */}
        {showResult && gameResult && (
          <div className={`game-result show ${Number(gameResult.outcome) === 0 ? 'win' : 'lose'}`}>
            {getResultMessage()}
            {Number(gameResult.outcome) === 0 && (
              <div className="game-winnings">
                Won: {parseFloat(gameResult.payout.toString()) / 1e18} ETH
              </div>
            )}
          </div>
        )}
        
        {/* Confetti animation */}
        <Confetti 
          isActive={showConfetti} 
          color={confettiColor}
          onComplete={() => setShowConfetti(false)}
        />
        
        {/* Sound toggle button */}
        <button
          className="game-sound-toggle"
          onClick={() => soundManager.toggleMute()}
          title={soundManager.isSoundMuted() ? 'Unmute' : 'Mute'}
        >
          {soundManager.isSoundMuted() ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  );
};
