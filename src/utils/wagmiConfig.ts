import { createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';

// TEN testnet chain configuration
export const tenChain = {
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
};

export const config = createConfig({
  chains: [tenChain],
  transports: {
    [tenChain.id]: http(),
  },
});
