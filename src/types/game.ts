// Game state and result types
export interface GameState {
  isSpinning: boolean;
  points: number;
  result: GameResult | null;
  showResult: boolean;
  wheelRotation: number;
  chosenColor: string | null;
}

export interface GameResult {
  type: 'WIN' | 'LOSE';
  message: string;
  points: number;
}

export interface SpinData {
  duration: number;
  spins: number;
  target: number;
  totalRotation: number;
}

export interface GameColor {
  name: string;
  color: string;
}

// Game configuration constants
export interface GameConfig {
  colors: GameColor[];
  spinDuration: {
    min: number;
    max: number;
    variation: number;
  };
  spinCount: {
    min: number;
    max: number;
    multiplier: {
      min: number;
      max: number;
    };
  };
  points: {
    win: number;
    lose: number;
  };
}

// Future smart contract types
export interface WalletConnection {
  address: string;
  isConnected: boolean;
  chainId: number;
  balance?: string;
}

export interface GameTransaction {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
  gasUsed?: string;
  gasPrice?: string;
}

export interface GameContract {
  address: string;
  abi: any[];
  network: string;
}

// Loading and error states
export interface LoadingState {
  isConnecting: boolean;
  isSpinning: boolean;
  isProcessingTransaction: boolean;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
}
