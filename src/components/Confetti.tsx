import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  rotation: number;
  rotationSpeed: number;
  color: string;
  image: string;
  delay: number;
  scale: number;
  alpha: number;
}

interface ConfettiProps {
  isActive: boolean;
  color: 'ORANGE' | 'PINK' | 'GREEN';
  onComplete?: () => void;
}

const colorToImage = {
  ORANGE: '/orange-0.png',
  PINK: '/pink-1.png',
  GREEN: '/green-2.png'
};

const colorToBackground = {
  ORANGE: 'rgba(255, 165, 0, 0.8)', // Much brighter orange
  PINK: 'rgba(255, 20, 147, 0.8)', // Much brighter pink
  GREEN: 'rgba(0, 255, 0, 0.8)' // Much brighter green
};

export const Confetti = ({ isActive, color, onComplete }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!isActive) {
      setPieces([]);
      return;
    }

    // Create confetti pieces that explode from center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const newPieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => {
      // Random angle for radial explosion
      const angle = (Math.PI * 2 * i) / 30 + Math.random() * 0.5; // Evenly distributed with some randomness
      const velocity = 3 + Math.random() * 4; // Random explosion velocity
      
      return {
        id: i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity, // Horizontal velocity
        vy: Math.sin(angle) * velocity, // Vertical velocity
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10, // Random rotation speed
        color,
        image: colorToImage[color],
        delay: Math.random() * 200, // Small stagger (0-200ms)
        scale: 1.2 + Math.random() * 0.8, // Random scale between 1.2-2.0 (much bigger!)
        alpha: 1
      };
    });

    setPieces(newPieces);

    // Animate pieces with physics-based movement
    const startTime = Date.now();
    const animationDuration = 3000; // 3 second animation
    const gravity = 0.15; // Gravity effect
    const friction = 0.98; // Air resistance

    const animate = () => {
      const elapsed = Date.now() - startTime;

      setPieces(prevPieces => 
        prevPieces.map(piece => {
          // Only start moving after delay
          if (elapsed < piece.delay) {
            return piece;
          }

          const pieceElapsed = elapsed - piece.delay;
          
          // Apply physics
          const newVy = piece.vy + gravity; // Apply gravity
          const newVx = piece.vx * friction; // Apply air resistance
          const newX = piece.x + newVx;
          const newY = piece.y + newVy;
          const newRotation = piece.rotation + piece.rotationSpeed;
          
          // Fade out over time
          const fadeStart = animationDuration * 0.6; // Start fading at 60% through animation
          let newAlpha = piece.alpha;
          if (pieceElapsed > fadeStart) {
            const fadeProgress = (pieceElapsed - fadeStart) / (animationDuration - fadeStart);
            newAlpha = Math.max(0, 1 - fadeProgress);
          }
          
          return {
            ...piece,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: newRotation,
            alpha: newAlpha
          };
        })
      );

      // Continue animation until time is up
      if (elapsed < animationDuration + 500) { // Extra time for fade out
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        setPieces([]);
        onComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [isActive, color, onComplete]);

  if (!isActive || pieces.length === 0) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {pieces.map(piece => (
                 <div
           key={piece.id}
           style={{
             position: 'absolute',
             left: piece.x - 35, // Move slightly more left to center properly
             top: piece.y - 35, // Move slightly more up to center properly
             transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
             pointerEvents: 'none',
             opacity: piece.alpha,
             transition: 'none' // Remove transition for smoother animation
           }}
         >
          <div
            style={{
              position: 'relative',
              width: '60px', // Much bigger background circle
              height: '60px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colorToBackground[piece.color as keyof typeof colorToBackground]}, rgba(255,255,255,0.3) 50%, transparent 80%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'blur(1px)', // Slightly more blur for better glow effect
              boxShadow: `0 0 20px ${colorToBackground[piece.color as keyof typeof colorToBackground]}` // Glowing effect!
            }}
          >
            <img 
              src={piece.image} 
              alt="confetti"
              style={{
                width: '45px', // Much bigger image
                height: '45px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))' // Stronger shadow
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
