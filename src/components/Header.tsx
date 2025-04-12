
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import ConnectWalletButton from '@/components/ConnectWalletButton';

const Header: React.FC = () => {
  return (
    <header className="border-b border-secondary/50 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-aptos flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="font-medium tracking-tight hidden sm:inline-block">
            Secure Aptos Vault
          </span>
        </div>
        <ConnectWalletButton />
      </div>
    </header>
  );
};

export default Header;
