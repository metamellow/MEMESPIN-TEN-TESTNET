import styled from 'styled-components';
import { motion } from 'framer-motion';

interface GatewayCheckPopupProps {
  onComplete: () => void;
}

const PopupOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(15px);
`;

const PopupContent = styled.div`
  background: rgb(13, 13, 13);
  border-radius: var(--radius-xl);
  padding: 80px;
  max-width: 800px;
  width: 90%;
  text-align: center;
  border: 2px solid rgb(58, 38, 65);
  box-shadow: 
    0 0 50px rgba(0, 0, 0, 0.7),
    inset 0 0 40px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(25px);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    background: linear-gradient(135deg, rgba(58, 38, 65, 0.3), rgba(13, 13, 13, 0.1));
    pointer-events: none;
  }
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 25px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 1;
`;

const Subtitle = styled.h2`
  color: #007bff;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 35px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 1;
`;

const Description = styled.p`
  color: #e0e0e0;
  font-size: 20px;
  line-height: 1.7;
  margin: 0 0 50px 0;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  position: relative;
  z-index: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const Button = styled.button`
  width: 320px;
  height: 70px;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 22px;
  color: #ffffff;
  cursor: pointer;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
  box-shadow: 
    inset 0 -10px 0 rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(0, 0, 0, 0.3);
  transition: all var(--transition-normal);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
    border-radius: var(--radius-lg);
    opacity: 0;
    transition: opacity var(--transition-normal);
  }
  
  &:hover {
    filter: brightness(1.15);
    transform: translateY(-3px);
    box-shadow: 
      inset 0 -10px 0 rgba(0, 0, 0, 0.3), 
      0 12px 24px rgba(0, 0, 0, 0.4);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(2px);
    filter: brightness(0.95);
    box-shadow: inset 0 -6px 0 rgba(0, 0, 0, 0.3);
  }
`;

const GatewayButton = styled(Button)`
  background: linear-gradient(135deg, #007bff, #0056b3);
  
  &:hover {
    background: linear-gradient(135deg, #0056b3, #004085);
  }
`;

const CompleteButton = styled(Button)`
  background: linear-gradient(135deg, #28a745, #1e7e34);
  
  &:hover {
    background: linear-gradient(135deg, #1e7e34, #155724);
  }
`;

export const GatewayCheckPopup = ({ onComplete }: GatewayCheckPopupProps) => {
  const handleGatewayClick = () => {
    window.open('https://gateway.ten.xyz/', '_blank');
  };

  return (
    <PopupOverlay
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <PopupContent>
        <Title>Heads up!</Title>
        <Subtitle>Before you can play</Subtitle>
        <Description>
          Before being able to connect to TEN Protocol for the first time, you'll need to visit the TEN Gateway beforehand to get onboarded onto the network (add chain to wallet, sign message, etc).
        </Description>
        
        <ButtonContainer>
          <GatewayButton onClick={handleGatewayClick}>
            Visit TEN Gateway
          </GatewayButton>
          
          <CompleteButton onClick={onComplete}>
            I've Completed This
          </CompleteButton>
        </ButtonContainer>
      </PopupContent>
    </PopupOverlay>
  );
};
