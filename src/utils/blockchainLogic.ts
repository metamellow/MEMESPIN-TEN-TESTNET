import { createPublicClient, createWalletClient, custom, parseEther } from 'viem';
import { tenChain } from './wagmiConfig';
import { MemespinGameAbi } from '../abi/MemespinGame';

export const CONTRACT_ADDRESS = '0xDfD8194f8a1F0AcB3e5C9C5Cf9e025f3D49a6D65';

export interface GameResult {
	player: string;
	chosenColor: number;
	resultColor: number;
	betAmount: bigint;
	payout: bigint;
	outcome: number; // 0 = LOSE, 1 = WIN
	timestamp: bigint;
	randomSeed: bigint;
}

// Blockchain contract configuration interface
export interface ContractGameConfig {
	minBet: bigint;
	maxBetPercentage: number;
	devFeePercentage: number;
	winMultiplier: number;
}

export class BlockchainGameLogic {
	private publicClient: any;
	private walletClient: any;
	private contract: any;
	private lastRequestTime: number = 0;
	private minRequestInterval: number = 1000; // 1 second between requests

	constructor(provider: any, account: string) {
		// Validate provider
		if (!provider) {
			throw new Error('Provider is required for BlockchainGameLogic');
		}
		
		if (!provider.request || typeof provider.request !== 'function') {
			throw new Error('Provider must have a request method');
		}
		
		// Validate account
		if (!account) {
			throw new Error('Account address is required for BlockchainGameLogic');
		}
		
		try {
			this.publicClient = createPublicClient({
				chain: tenChain,
				transport: custom(provider)
			});

			this.walletClient = createWalletClient({
				account: account as `0x${string}`,
				chain: tenChain,
				transport: custom(provider)
			});
		} catch (error) {
			console.error('Failed to create Viem clients:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			throw new Error(`Failed to initialize blockchain clients: ${errorMessage}`);
		}

		this.contract = {
			address: CONTRACT_ADDRESS,
			abi: MemespinGameAbi,
			read: async (functionName: string, args: any[] = []) => {
				return await this.readWithRateLimit(functionName, args);
			},
			write: async (functionName: string, args: any[] = [], value: bigint = 0n) => {
				return await this.walletClient.writeContract({
					address: CONTRACT_ADDRESS,
					abi: MemespinGameAbi,
					functionName,
					args,
					value
				});
			}
		};
	}

	private async readWithRateLimit(functionName: string, args: any[] = [], retries: number = 3): Promise<any> {
		// Rate limiting - ensure minimum time between requests
		const now = Date.now();
		const timeSinceLastRequest = now - this.lastRequestTime;
		
		if (timeSinceLastRequest < this.minRequestInterval) {
			const waitTime = this.minRequestInterval - timeSinceLastRequest;
			await new Promise(resolve => setTimeout(resolve, waitTime));
		}
		
		this.lastRequestTime = Date.now();
		
		// Retry logic for rate limit errors
		for (let attempt = 0; attempt < retries; attempt++) {
			try {
				return await this.publicClient.readContract({
					address: CONTRACT_ADDRESS,
					abi: MemespinGameAbi,
					functionName,
					args
				});
			} catch (error: any) {
				const isRateLimitError = error.message?.includes('Request limit exceeded') || 
										error.message?.includes('rate limit') ||
										error.message?.includes('too many requests');
				
				if (isRateLimitError && attempt < retries - 1) {
					const backoffTime = Math.pow(2, attempt) * 2000; // Exponential backoff: 2s, 4s, 8s
					console.warn(`Rate limit hit, retrying in ${backoffTime}ms... (attempt ${attempt + 1}/${retries})`);
					await new Promise(resolve => setTimeout(resolve, backoffTime));
					continue;
				}
				
				throw error;
			}
		}
	}

	async getGameConfig(): Promise<ContractGameConfig> {
		const [minBet, maxBetPercentage, devFeePercentage, winMultiplier] = 
			await this.contract.read('getGameConfig');
		
		return {
			minBet,
			maxBetPercentage: Number(maxBetPercentage),
			devFeePercentage: Number(devFeePercentage),
			winMultiplier: Number(winMultiplier)
		};
	}

	async getCurrentMaxBet(): Promise<bigint> {
		return await this.contract.read('getCurrentMaxBet');
	}

	async getGameState(account: string): Promise<{
		config: ContractGameConfig;
		maxBet: bigint;
		balance: bigint;
	}> {
		// Batch all contract reads together to minimize RPC calls
		const [config, maxBet, balance] = await Promise.all([
			this.getGameConfig(),
			this.getCurrentMaxBet(),
			this.getBalance(account)
		]);

		return { config, maxBet, balance };
	}

	async getBalance(account: string): Promise<bigint> {
		// Rate limiting for balance requests
		const now = Date.now();
		const timeSinceLastRequest = now - this.lastRequestTime;
		
		if (timeSinceLastRequest < this.minRequestInterval) {
			const waitTime = this.minRequestInterval - timeSinceLastRequest;
			await new Promise(resolve => setTimeout(resolve, waitTime));
		}
		
		this.lastRequestTime = Date.now();
		
		// Retry logic for rate limit errors
		for (let attempt = 0; attempt < 3; attempt++) {
			try {
				return await this.publicClient.getBalance({ address: account as `0x${string}` });
			} catch (error: any) {
				const isRateLimitError = error.message?.includes('Request limit exceeded') || 
										error.message?.includes('rate limit') ||
										error.message?.includes('too many requests');
				
				if (isRateLimitError && attempt < 2) {
					const backoffTime = Math.pow(2, attempt) * 2000; // Exponential backoff: 2s, 4s
					console.warn(`Rate limit hit on balance request, retrying in ${backoffTime}ms... (attempt ${attempt + 1}/3)`);
					await new Promise(resolve => setTimeout(resolve, backoffTime));
					continue;
				}
				
				throw error;
			}
		}
		
		// This should never be reached due to the throw in the loop, but TypeScript needs it
		throw new Error('Failed to get balance after retries');
	}

	async playGame(chosenColor: number, betAmount: string): Promise<GameResult> {
		const betAmountWei = parseEther(betAmount);
		const config = await this.getGameConfig();
		const devFee = (betAmountWei * BigInt(config.devFeePercentage)) / 100n;
		const totalRequired = betAmountWei + devFee;

		const hash = await this.contract.write('playGame', [chosenColor, betAmountWei], totalRequired);
		
		// Wait for transaction to be mined
		await this.publicClient.waitForTransactionReceipt({ hash });
		
		// Get the game result from the transaction receipt
		const result = await this.getLatestGameResult();
		console.log('🎲 Raw contract result:', result);
		console.log('🔍 Result fields:', Object.keys(result));
		console.log('🔍 Outcome value:', result.outcome);
		console.log('🔍 Outcome type:', typeof result.outcome);
		
		// Ensure all required fields are present
		if (result.outcome === undefined && result.chosenColor !== undefined && result.resultColor !== undefined) {
			// If outcome is missing, determine it from the colors
			const isWin = Number(result.chosenColor) === Number(result.resultColor);
			result.outcome = isWin ? 0 : 1; // 0 = WIN, 1 = LOSE
			console.log('🔧 Fixed missing outcome field:', { isWin, outcome: result.outcome });
		}
		
		return result;
	}

	private async getLatestGameResult(): Promise<GameResult> {
		const currentGameId = await this.contract.read('getCurrentGameId');
		return await this.contract.read('getGameResult', [currentGameId]);
	}
}
