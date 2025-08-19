import type { PrivyClientConfig } from '@privy-io/react-auth';

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true,
    showWalletUIs: true
  },
  loginMethods: ['wallet', 'email', 'sms'],
  appearance: {
    showWalletLoginFirst: true,
    walletChainType: 'ethereum-only'
  },
  supportedChains: [
    {
      id: 443,
      name: 'TEN Testnet',
      network: 'ten-testnet',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: {
        default: { http: ['https://testnet.ten.xyz/v1/'] },
        public: { http: ['https://testnet.ten.xyz/v1/'] },
      },
      blockExplorers: {
        default: { name: 'TENScan', url: 'https://testnet.tenscan.io' },
      },
    }
  ]
};
