import React from 'react';
import styled from 'styled-components';
import { GameContainer } from './GameContainer';

const EmojiDisplay = styled.div`
  font-size: 200px;
  text-align: center;
  user-select: none;
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: var(--text);
  margin: 0;
  text-align: center;
  text-shadow: 0 0 20px var(--neon-default);
`;

const Subtitle = styled.p`
  font-size: 24px;
  color: var(--text);
  margin: 0;
  text-align: center;
  opacity: 0.8;
`;

export const Game = () => {
  return (
    <GameContainer>
      <Title>🎮 MEMESPIN 🎮</Title>
      <EmojiDisplay>🚀</EmojiDisplay>
      <Subtitle>Responsive Layout Test</Subtitle>
      <Subtitle>Resize your browser to see the magic!</Subtitle>
    </GameContainer>
  );
};
