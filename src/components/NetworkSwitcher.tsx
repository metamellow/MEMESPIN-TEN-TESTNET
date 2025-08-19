import { useEffect, useState } from 'react';
import { useAccount, useSwitchChain } from '@privy-io/wagmi';
import { tenChain } from '../utils/wagmiConfig';

export function NetworkSwitcher() {
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const [showSwitchMessage, setShowSwitchMessage] = useState(false);

  useEffect(() => {
    if (chainId && chainId !== tenChain.id) {
      // Try to auto-switch
      switchChain({ chainId: tenChain.id }).catch(() => {
        // If auto-switch fails, show manual switch message
        setShowSwitchMessage(true);
      });
    } else {
      setShowSwitchMessage(false);
    }
  }, [chainId, switchChain]);

  if (!showSwitchMessage || chainId === tenChain.id) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 px-4 z-50">
      Switch network to TEN Testnet
    </div>
  );
}
