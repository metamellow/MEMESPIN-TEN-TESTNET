import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface GameContainerProps {
  children: ReactNode;
  activeChoice?: any;
}

// Outer container that fills the viewport
const OuterContainer = styled.div<{ $outerPadding: string }>`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ $outerPadding }) => $outerPadding};
  min-width: 0;
  min-height: 0;
`;

// Container that gets scaled
const ScaledContainer = styled(motion.div)<{ $scale: number; $size: string }>`
  box-sizing: border-box;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  min-width: 0;
  min-height: 0;
  display: block;
  transform: scale(${({ $scale }) => $scale});
  transform-origin: center center;
  transition: transform 0.3s ease;
`;

// The actual game box with styling
const Container = styled.div<{ 
  $activeChoice: any;
  $animationState: string;
}>`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 40px;
  background:rgb(13, 13, 13);
  border-radius: var(--border-radius-lg);
  box-shadow: 
    0 0 30px rgba(0, 0, 0, 0.3),
    inset 0 0 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  transition: all var(--transition-normal);
  overflow: hidden;

  /* Optional: Animated border based on game state */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--border-radius-lg);
    border: 2px solid rgb(58, 38, 65);
    pointer-events: none;
    transition: border-color 0.3s ease;
  }
`;

export const GameContainer = ({ children, activeChoice = null }: GameContainerProps) => {
  const [scale, setScale] = useState(1);
  
  // Configuration values
  const containerSize = '1000px'; // Fixed size of the game area
  const outerPaddingMin = '2px';
  const outerPaddingMax = '20px';

  useEffect(() => {
    const calculateScale = () => {
      // Parse padding values
      const minPadding = parseInt(outerPaddingMin, 10) || 2;
      const maxPadding = parseInt(outerPaddingMax, 10) || 20;
      
      // Calculate responsive padding (0.5vw with min/max bounds)
      const vwPadding = window.innerWidth * 0.005;
      const padding = Math.max(minPadding, Math.min(vwPadding, maxPadding));
      
      // Calculate available viewport space
      const viewportWidth = window.innerWidth - 2 * padding;
      const viewportHeight = window.innerHeight - 2 * padding;
      
      // Calculate scale to fit the container
      const scaleX = viewportWidth / 1000; // 1000px is our fixed container size
      const scaleY = viewportHeight / 1000;
      const newScale = Math.min(scaleX, scaleY, 1); // Never scale up beyond 1
      
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <OuterContainer $outerPadding={`clamp(${outerPaddingMin}, 0.5vw, ${outerPaddingMax})`}>
      <ScaledContainer
        $scale={scale}
        $size={containerSize}
        style={{
          width: containerSize,
          height: containerSize,
          minWidth: containerSize,
          minHeight: containerSize,
          maxWidth: containerSize,
          maxHeight: containerSize
        }}
      >
        <Container $activeChoice={activeChoice} $animationState="idle">
          {children}
        </Container>
      </ScaledContainer>
    </OuterContainer>
  );
};
