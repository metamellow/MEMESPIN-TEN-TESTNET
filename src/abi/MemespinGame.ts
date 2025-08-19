export const MemespinGameAbi = [
	{
		"inputs": [{"internalType": "address", "name": "_devWallet", "type": "address"}],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
		"name": "gameResults",
		"outputs": [
			{"internalType": "address", "name": "player", "type": "address"},
			{"internalType": "uint8", "name": "chosenColor", "type": "uint8"},
			{"internalType": "uint8", "name": "resultColor", "type": "uint8"},
			{"internalType": "uint256", "name": "betAmount", "type": "uint256"},
			{"internalType": "uint256", "name": "payout", "type": "uint256"},
			{"internalType": "uint8", "name": "outcome", "type": "uint8"},
			{"internalType": "uint256", "name": "timestamp", "type": "uint256"},
			{"internalType": "uint256", "name": "randomSeed", "type": "uint256"}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{"internalType": "address", "name": "", "type": "address"}],
		"name": "playerStats",
		"outputs": [
			{"internalType": "uint256", "name": "totalGames", "type": "uint256"},
			{"internalType": "uint256", "name": "totalWins", "type": "uint256"},
			{"internalType": "uint256", "name": "totalLosses", "type": "uint256"},
			{"internalType": "uint256", "name": "totalVolume", "type": "uint256"},
			{"internalType": "uint256", "name": "totalWinnings", "type": "uint256"}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalGamesPlayed",
		"outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalVolume",
		"outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalDevFees",
		"outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [{"internalType": "address", "name": "", "type": "address"}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "devWallet",
		"outputs": [{"internalType": "address", "name": "", "type": "address"}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{"internalType": "uint8", "name": "chosenColorIndex", "type": "uint8"},
			{"internalType": "uint256", "name": "betAmount", "type": "uint256"}
		],
		"name": "playGame",
		"outputs": [
			{
				"components": [
					{"internalType": "address", "name": "player", "type": "address"},
					{"internalType": "uint8", "name": "chosenColor", "type": "uint8"},
					{"internalType": "uint8", "name": "resultColor", "type": "uint8"},
					{"internalType": "uint256", "name": "betAmount", "type": "uint256"},
					{"internalType": "uint256", "name": "payout", "type": "uint256"},
					{"internalType": "uint8", "name": "outcome", "type": "uint8"},
					{"internalType": "uint256", "name": "timestamp", "type": "uint256"},
					{"internalType": "uint256", "name": "randomSeed", "type": "uint256"}
				],
				"internalType": "struct MemespinGame.GameResult",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGameStats",
		"outputs": [
			{"internalType": "uint256", "name": "_totalGamesPlayed", "type": "uint256"},
			{"internalType": "uint256", "name": "_totalVolume", "type": "uint256"},
			{"internalType": "uint256", "name": "_totalDevFees", "type": "uint256"}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{"internalType": "address", "name": "player", "type": "address"}],
		"name": "getPlayerStats",
		"outputs": [
			{
				"components": [
					{"internalType": "uint256", "name": "totalGames", "type": "uint256"},
					{"internalType": "uint256", "name": "totalWins", "type": "uint256"},
					{"internalType": "uint256", "name": "totalLosses", "type": "uint256"},
					{"internalType": "uint256", "name": "totalVolume", "type": "uint256"},
					{"internalType": "uint256", "name": "totalWinnings", "type": "uint256"}
				],
				"internalType": "struct MemespinGame.PlayerStats",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{"internalType": "uint256", "name": "_gameId", "type": "uint256"}],
		"name": "getGameResult",
		"outputs": [
			{
				"components": [
					{"internalType": "address", "name": "player", "type": "address"},
					{"internalType": "uint8", "name": "chosenColor", "type": "uint8"},
					{"internalType": "uint8", "name": "resultColor", "type": "uint8"},
					{"internalType": "uint256", "name": "betAmount", "type": "uint256"},
					{"internalType": "uint256", "name": "payout", "type": "uint256"},
					{"internalType": "uint8", "name": "outcome", "type": "uint8"},
					{"internalType": "uint256", "name": "timestamp", "type": "uint256"},
					{"internalType": "uint256", "name": "randomSeed", "type": "uint256"}
				],
				"internalType": "struct MemespinGame.GameResult",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentGameId",
		"outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentMaxBet",
		"outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGameConfig",
		"outputs": [
			{"internalType": "uint256", "name": "_minBet", "type": "uint256"},
			{"internalType": "uint256", "name": "_maxBetPercentage", "type": "uint256"},
			{"internalType": "uint256", "name": "_devFeePercentage", "type": "uint256"},
			{"internalType": "uint256", "name": "_winMultiplier", "type": "uint256"}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{"internalType": "address", "name": "newDevWallet", "type": "address"}],
		"name": "updateDevWallet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "emergencyWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
] as const;


