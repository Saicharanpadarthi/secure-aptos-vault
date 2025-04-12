
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import {
  connectMartianWallet,
  disconnectMartianWallet,
  isMartianWalletConnected,
  getMartianWalletAddress,
  isMartianWalletInstalled
} from '@/lib/aptos-connector';
import { User } from '@/types';

interface WalletContextType {
  user: User;
  isWalletInstalled: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  user: { address: '', isConnected: false },
  isWalletInstalled: false,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User>({ address: '', isConnected: false });
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Check if Martian wallet is installed
  useEffect(() => {
    const checkWalletInstallation = () => {
      setIsWalletInstalled(isMartianWalletInstalled());
    };

    checkWalletInstallation();
    window.addEventListener('load', checkWalletInstallation);

    return () => {
      window.removeEventListener('load', checkWalletInstallation);
    };
  }, []);

  // Check if wallet is connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await isMartianWalletConnected();
        
        if (isConnected) {
          const address = await getMartianWalletAddress();
          setUser({ address, isConnected: true });
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkConnection();
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      if (!isWalletInstalled) {
        toast({
          title: "Wallet Not Found",
          description: "Please install the Martian Wallet extension",
          variant: "destructive",
        });
        window.open("https://www.martianwallet.xyz/", "_blank");
        return;
      }
      
      const address = await connectMartianWallet();
      setUser({ address, isConnected: true });
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      await disconnectMartianWallet();
      setUser({ address: '', isConnected: false });
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Disconnection Failed",
        description: error instanceof Error ? error.message : "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <WalletContext.Provider value={{ 
      user, 
      isWalletInstalled, 
      isConnecting,
      connectWallet, 
      disconnectWallet 
    }}>
      {children}
    </WalletContext.Provider>
  );
};
