
import React from 'react';
import AppLayout from '@/components/AppLayout';
import Dashboard from '@/components/Dashboard';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Shield, Upload, Download, Share2, Wallet } from 'lucide-react';

const Index: React.FC = () => {
  const { user, connectWallet } = useWallet();

  if (user.isConnected) {
    return (
      <AppLayout>
        <Dashboard />
      </AppLayout>
    );
  }

  // Landing page for non-connected users
  return (
    <AppLayout>
      <div className="container px-4 py-12 md:py-24 max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-aptos to-blue-500 bg-clip-text text-transparent">
            Secure Aptos Vault
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Decentralized encrypted file sharing with access control powered by Aptos blockchain
          </p>
          
          <Button 
            onClick={connectWallet} 
            size="lg"
            className="bg-aptos hover:bg-aptos-hover text-lg px-8 py-6 h-auto"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet to Start
          </Button>
        </div>
        
        <div className="mt-24 grid md:grid-cols-3 gap-6">
          <div className="crypto-card p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-aptos/10 mb-4">
              <Shield className="h-6 w-6 text-aptos" />
            </div>
            <h3 className="text-xl font-medium mb-2">Client-Side Encryption</h3>
            <p className="text-muted-foreground">
              All your files are encrypted in your browser before storage, ensuring maximum security and privacy.
            </p>
          </div>
          
          <div className="crypto-card p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-aptos/10 mb-4">
              <Upload className="h-6 w-6 text-aptos" />
            </div>
            <h3 className="text-xl font-medium mb-2">Support All File Types</h3>
            <p className="text-muted-foreground">
              Upload and securely store any file type, from documents to media files, with end-to-end encryption.
            </p>
          </div>
          
          <div className="crypto-card p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-aptos/10 mb-4">
              <Share2 className="h-6 w-6 text-aptos" />
            </div>
            <h3 className="text-xl font-medium mb-2">Secure Sharing</h3>
            <p className="text-muted-foreground">
              Securely share files with specific wallet addresses, with permissions verified via Aptos blockchain.
            </p>
          </div>
        </div>
        
        <div className="mt-24 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-aptos mb-3">
                <span className="text-white font-medium">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Connect Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Connect your Martian Aptos wallet to authenticate
              </p>
              {/* Line connector */}
              <div className="hidden md:block absolute top-5 left-full w-full h-0.5 bg-aptos/30" style={{width: "calc(100% - 20px)", left: "60px"}}></div>
            </div>
            
            <div className="relative">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-aptos mb-3">
                <span className="text-white font-medium">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Upload Files</h3>
              <p className="text-sm text-muted-foreground">
                Upload and encrypt your files client-side
              </p>
              {/* Line connector */}
              <div className="hidden md:block absolute top-5 left-full w-full h-0.5 bg-aptos/30" style={{width: "calc(100% - 20px)", left: "60px"}}></div>
            </div>
            
            <div className="relative">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-aptos mb-3">
                <span className="text-white font-medium">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Share Access</h3>
              <p className="text-sm text-muted-foreground">
                Grant access to specific wallet addresses
              </p>
              {/* Line connector */}
              <div className="hidden md:block absolute top-5 left-full w-full h-0.5 bg-aptos/30" style={{width: "calc(100% - 20px)", left: "60px"}}></div>
            </div>
            
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-aptos mb-3">
                <span className="text-white font-medium">4</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Decrypt & Download</h3>
              <p className="text-sm text-muted-foreground">
                Authorized users can decrypt and download files
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
