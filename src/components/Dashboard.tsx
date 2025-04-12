
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Lock, Database } from 'lucide-react';
import FileUploadCard from '@/components/FileUploadCard';
import FileList from '@/components/FileList';

const Dashboard: React.FC = () => {
  return (
    <div className="container py-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-indigo-500 via-aptos to-blue-500 bg-clip-text text-transparent text-4xl sm:text-5xl font-bold mb-4">
          Secure Aptos Vault
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Encrypted file sharing with Aptos blockchain access control.
          Upload, encrypt, and share files securely with wallet-based authentication.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6 mb-8">
          <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Shield className="h-4 w-4 text-aptos" />
            <span className="text-sm">Client-side encryption</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Lock className="h-4 w-4 text-aptos" />
            <span className="text-sm">Aptos-based access control</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Database className="h-4 w-4 text-aptos" />
            <span className="text-sm">Decentralized sharing</span>
          </div>
        </div>
      </div>

      <FileUploadCard />

      <Tabs defaultValue="my-files" className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mx-auto mb-8">
          <TabsTrigger value="my-files">My Files</TabsTrigger>
          <TabsTrigger value="shared-files">Shared With Me</TabsTrigger>
        </TabsList>
        <FileList type="my-files" value="my-files" />
        <FileList type="shared-files" value="shared-files" />
      </Tabs>
    </div>
  );
};

export default Dashboard;
