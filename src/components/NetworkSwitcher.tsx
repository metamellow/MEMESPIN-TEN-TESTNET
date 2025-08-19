import { useEffect, useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { tenChain } from '../utils/wagmiConfig';

export function NetworkSwitcher() {
  const { wallets } = useWallets();
  const [showSwitchMessage, setShowSwitchMessage] = useState(false);

  useEffect(() => {
    if (wallets.length > 0) {
      const wallet = wallets[0];
      
      // Try to get the current chain ID
      const checkAndSwitchNetwork = async () => {
        try {
          // Try to get the provider and switch network
          const provider = await wallet.getEthereumProvider();
          if (provider) {
            // Try to switch to TEN testnet
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${tenChain.id.toString(16)}` }]
            });
            setShowSwitchMessage(false);
          }
        } catch (error) {
          // If switch fails, show manual switch message
          console.log('Network switch failed, showing manual message');
          setShowSwitchMessage(true);
        }
      };
      
      checkAndSwitchNetwork();
    }
  }, [wallets]);

  if (!showSwitchMessage) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 px-4 z-50">
      Switch network to TEN Testnet
    </div>
  );
}
