
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const ConnectWalletButton: React.FC = () => {
  const { user, isConnecting, connectWallet, disconnectWallet } = useWallet();

  if (user.isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:block bg-secondary px-3 py-1.5 rounded-md text-sm">
          {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
        </div>
        <Button 
          variant="outline" 
          onClick={disconnectWallet}
          className="border-red-500/20 text-red-500 hover:text-red-400 hover:bg-red-500/10"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connectWallet} disabled={isConnecting} className="bg-aptos hover:bg-aptos-hover">
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};

export default ConnectWalletButton;
