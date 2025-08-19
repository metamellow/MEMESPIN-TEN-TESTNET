import { useEffect } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { tenChain } from '../utils/wagmiConfig';

interface NetworkSwitcherProps {
  onNetworkMessage: (message: string | null) => void;
}

export function NetworkSwitcher({ onNetworkMessage }: NetworkSwitcherProps) {
  const { wallets } = useWallets();

  useEffect(() => {
    if (wallets.length > 0) {
      const wallet = wallets[0];
      
      // Try to get the current chain ID and check network
      const checkAndSwitchNetwork = async () => {
        try {
          // Try to get the provider and switch network
          const provider = await wallet.getEthereumProvider();
          if (provider) {
            try {
              // First check what network we're currently on
              const currentChainId = await provider.request({ method: 'eth_chainId' });
              console.log('Current chain ID:', currentChainId);
              
              // If already on TEN testnet, no need to switch
              if (currentChainId === `0x${tenChain.id.toString(16)}`) {
                onNetworkMessage(null);
                return;
              }
              
              // Try to switch to TEN testnet
              await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${tenChain.id.toString(16)}` }]
              });
              onNetworkMessage(null);
            } catch (switchError: any) {
              console.log('Switch error:', switchError);
              
              // If switch fails with 4902, the network doesn't exist in the wallet
              if (switchError.code === 4902) {
                try {
                  // Try to add TEN testnet to the wallet
                  await provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                      chainId: `0x${tenChain.id.toString(16)}`,
                      chainName: tenChain.name,
                      nativeCurrency: tenChain.nativeCurrency,
                      rpcUrls: tenChain.rpcUrls.default.http,
                      blockExplorerUrls: [tenChain.blockExplorers.default.url]
                    }]
                  });
                  onNetworkMessage(null);
                } catch (addError: any) {
                  console.log('Add network failed:', addError);
                  // If adding fails, show manual switch message
                  onNetworkMessage('Switch network to TEN Testnet');
                }
              } else {
                // Other error, show manual switch message
                console.log('Network switch failed, showing manual message');
                onNetworkMessage('Switch network to TEN Testnet');
              }
            }
          }
        } catch (error) {
          // If provider request fails, show manual switch message
          console.log('Provider request failed, showing manual message');
          onNetworkMessage('Switch network to TEN Testnet');
        }
      };
      
      checkAndSwitchNetwork();
    }
  }, [wallets, onNetworkMessage]);

  return null;
}
