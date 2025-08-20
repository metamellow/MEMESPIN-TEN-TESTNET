import { useState, useEffect, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { BlockchainGameLogic } from '../utils/blockchainLogic';
import type { GameResult, ContractGameConfig } from '../utils/blockchainLogic';
import { formatEther } from 'viem';
import { tenChain } from '../utils/wagmiConfig';

export function useBlockchain() {
  const { login, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [gameLogic, setGameLogic] = useState<BlockchainGameLogic | null>(null);
  const [gameConfig, setGameConfig] = useState<ContractGameConfig | null>(null);
  const [currentMaxBet, setCurrentMaxBet] = useState<string>('0');
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('0.0001'); // Default min bet
  const [isOnCorrectNetwork, setIsOnCorrectNetwork] = useState(false);

  // Check if wallet is on the correct network
  const checkNetwork = useCallback(async (wallet: any) => {
    try {
      const provider = await wallet.getEthereumProvider();
      if (provider) {
        const currentChainId = await provider.request({ method: 'eth_chainId' });
        const isCorrect = currentChainId === `0x${tenChain.id.toString(16)}`;
        setIsOnCorrectNetwork(isCorrect);
        return isCorrect;
      }
    } catch (error) {
      console.error('Failed to check network:', error);
      setIsOnCorrectNetwork(false);
    }
    return false;
  }, []);

  // Initialize blockchain logic when wallet is connected
  useEffect(() => {
    if (wallets.length > 0 && authenticated) {
      const wallet = wallets[0];
      
      const initializeWallet = async () => {
        try {
          // First check if we're on the correct network
          const onCorrectNetwork = await checkNetwork(wallet);
          if (!onCorrectNetwork) {
            // Don't initialize game logic if on wrong network
            setError('');
            return;
          }

          // Debug: Log the wallet object to see its structure
          console.log('Wallet object:', wallet);
          console.log('Wallet type:', wallet.walletClientType);
          console.log('Wallet methods:', Object.getOwnPropertyNames(wallet));
          
          // Try to get the ethereum provider - this returns a Promise!
          let provider = await wallet.getEthereumProvider();
          console.log('getEthereumProvider result:', provider);
          
          // If getEthereumProvider() returns undefined, try alternative methods
          if (!provider) {
            console.log('getEthereumProvider returned undefined, trying alternatives...');
            
            // For external wallets, try to get the provider directly
            if ((wallet as any).provider) {
              console.log('Found wallet.provider');
              provider = (wallet as any).provider;
            } else if ((wallet as any).ethereum) {
              console.log('Found wallet.ethereum');
              provider = (wallet as any).ethereum;
            } else if ((wallet as any).request) {
              console.log('Found wallet.request, creating wrapper');
              // Create a minimal provider wrapper
              provider = {
                request: (wallet as any).request.bind(wallet),
                on: (wallet as any).on?.bind(wallet),
                removeListener: (wallet as any).removeListener?.bind(wallet)
              };
            }
          }
          
          if (!provider) {
            console.error('Could not get provider from wallet:', wallet);
            setError('Wallet provider not supported');
            return;
          }
          
          console.log('Final provider:', provider);
          console.log('Provider methods:', Object.getOwnPropertyNames(provider));
          
          const logic = new BlockchainGameLogic(provider, wallet.address);
          setGameLogic(logic);
          
          // Load initial game state (config, max bet, and balance) in one batch
          await loadGameState(logic);

          // Add network change listener
          if (provider.on) {
            provider.on('chainChanged', (chainId: any) => {
              console.log('Chain changed to:', chainId);
              const chainIdStr = typeof chainId === 'string' ? chainId : chainId.chainId || chainId;
              const isCorrect = chainIdStr === `0x${tenChain.id.toString(16)}`;
              setIsOnCorrectNetwork(isCorrect);
              
              if (isCorrect) {
                // Re-initialize when switching to correct network
                setError('');
                const logic = new BlockchainGameLogic(provider, wallet.address);
                setGameLogic(logic);
                loadGameState(logic);
              } else {
                // Clear game state when switching to wrong network
                setGameLogic(null);
                setGameConfig(null);
                setCurrentMaxBet('0');
                setEthBalance('0');
                setError('');
              }
            });
          }
        } catch (error) {
          console.error('Failed to initialize blockchain logic:', error);
          setError('Failed to initialize wallet connection');
        }
      };
      
      // Call the async function
      initializeWallet();
    }
  }, [wallets, authenticated, checkNetwork]); // Added checkNetwork dependency

  const loadGameState = async (logic: BlockchainGameLogic) => {
    try {
      // Check network again before loading game state
      if (wallets.length > 0) {
        const onCorrectNetwork = await checkNetwork(wallets[0]);
        if (!onCorrectNetwork) {
          // Don't load game state if on wrong network
          return;
        }
      }

      // Load all game state in one batch call
      const { config, maxBet, balance } = await logic.getGameState(wallets[0].address);
      
      setGameConfig(config);
      setCurrentMaxBet(formatEther(maxBet));
      setEthBalance(formatEther(balance));
      
      // Set default bet amount to minimum bet
      setBetAmount(formatEther(config.minBet));
    } catch (err) {
      console.error('Failed to load game state:', err);
      // Only set error if we're on the correct network
      if (isOnCorrectNetwork) {
        setError('Failed to load game state');
      }
    }
  };

  const playGame = useCallback(async (chosenColor: number): Promise<GameResult | null> => {
    if (!gameLogic || !gameConfig) {
      setError('Game not initialized');
      return null;
    }

    try {
      setIsLoading(true);
      setError('');
      
      console.log(`🎮 Playing game with color index: ${chosenColor}, bet: ${betAmount} ETH`);
      
      const result = await gameLogic.playGame(chosenColor, betAmount);
      console.log('🎯 Game result received:', result);
      
      // Validate result has required fields
      if (!result || typeof result.betAmount === 'undefined') {
        throw new Error('Invalid game result received from contract');
      }
      
      console.log('💰 Bet amount:', formatEther(result.betAmount));
      console.log('🎲 Chosen color index:', result.chosenColor);
      console.log('🎰 Result color index:', result.resultColor);
      console.log('🏆 Outcome:', result.outcome === 0 ? 'WIN!' : 'LOSE'); // 0 = WIN, 1 = LOSE
      if (result.outcome === 0) {
        console.log('💎 Payout:', formatEther(result.payout));
      }
      
      // Refresh game state after game (config, max bet, and balance) in one batch
      await loadGameState(gameLogic);
      
      return result;
    } catch (err: any) {
      console.error('❌ Game failed:', err);
      setError(err.message || 'Game failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [gameLogic, gameConfig, betAmount, wallets]);

  const connectWallet = useCallback(() => {
    console.log('connectWallet called');
    console.log('authenticated:', authenticated);
    if (!authenticated) {
      console.log('Calling login()...');
      login();
    } else {
      console.log('Already authenticated');
    }
  }, [authenticated, login]);

  const updateBetAmount = useCallback((newAmount: string) => {
    const amount = parseFloat(newAmount);
    if (amount >= 0.0001 && amount <= parseFloat(currentMaxBet)) {
      setBetAmount(newAmount);
      setError('');
    } else {
      setError(`Bet must be between 0.0001 and ${currentMaxBet} ETH`);
    }
  }, [currentMaxBet]);

  const getBetBreakdown = useCallback(() => {
    if (!gameConfig) return null;
    
    const betAmountWei = parseFloat(betAmount);
    const devFee = (betAmountWei * gameConfig.devFeePercentage) / 100;
    const totalRequired = betAmountWei + devFee;
    const potentialWin = betAmountWei * gameConfig.winMultiplier;
    
    return {
      betAmount: betAmountWei.toFixed(6),
      devFee: devFee.toFixed(6),
      totalRequired: totalRequired.toFixed(6),
      potentialWin: potentialWin.toFixed(6)
    };
  }, [betAmount, gameConfig]);

  return {
    gameLogic,
    gameConfig,
    currentMaxBet,
    betAmount,
    ethBalance,
    isLoading,
    error,
    playGame,
    connectWallet,
    updateBetAmount,
    getBetBreakdown,
    isConnected: authenticated && wallets.length > 0,
    walletAddress: wallets[0]?.address,
    authenticated,
    isOnCorrectNetwork,
    checkNetwork: () => wallets.length > 0 ? checkNetwork(wallets[0]) : Promise.resolve(false)
  };
}
