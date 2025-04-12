
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Trash2, FileType, AlertCircle, Check } from 'lucide-react';
import { FileMetadata } from '@/types';
import { useFiles } from '@/contexts/FileContext';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FileCardProps {
  file: FileMetadata;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const { downloadFile, shareFile, deleteFile } = useFiles();
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [sharingAddress, setSharingAddress] = useState<string>('');
  const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleDownload = () => {
    downloadFile(file.id);
  };

  const handleDeleteFile = () => {
    deleteFile(file.id);
  };

  const toggleShareMode = () => {
    setIsSharing(!isSharing);
    setSharingAddress('');
    setIsValidAddress(null);
  };

  const handleShareAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setSharingAddress(address);
    
    // Simple validation - In a real app, use proper Aptos address validation
    setIsValidAddress(address.startsWith('0x') && address.length === 66);
  };

  const handleShareFile = async () => {
    if (!isValidAddress) return;

    await shareFile(file.id, sharingAddress);
    setIsSharing(false);
    setSharingAddress('');
    setIsValidAddress(null);
  };

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return <FileType className="h-10 w-10 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <FileType className="h-10 w-10 text-red-500" />;
    } else if (file.type.startsWith('audio/')) {
      return <FileType className="h-10 w-10 text-green-500" />;
    } else if (file.type.includes('pdf')) {
      return <FileType className="h-10 w-10 text-orange-500" />;
    } else if (file.type.includes('doc') || file.type.includes('word')) {
      return <FileType className="h-10 w-10 text-blue-400" />;
    } else {
      return <FileType className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <Card className="crypto-card hover:border-aptos/50 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getFileIcon()}
          <span className="truncate">{file.name}</span>
        </CardTitle>
        <CardDescription className="flex justify-between text-xs">
          <span>{formatBytes(file.size)}</span>
          <span>Uploaded: {formatDate(file.uploadDate)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSharing ? (
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <Input
                value={sharingAddress}
                onChange={handleShareAddressChange}
                placeholder="0x... (Aptos Wallet Address)"
                className={cn(
                  "bg-secondary/50 border-0",
                  isValidAddress === true && "border border-green-500/50",
                  isValidAddress === false && "border border-red-500/50"
                )}
              />
              {isValidAddress === false && (
                <div className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  <span>Please enter a valid Aptos address</span>
                </div>
              )}
              {isValidAddress === true && (
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <Check className="h-3 w-3" />
                  <span>Valid address</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                onClick={toggleShareMode}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleShareFile} 
                disabled={!isValidAddress}
                className="flex-1 bg-aptos hover:bg-aptos-hover"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={toggleShareMode}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button 
              variant="outline" 
              className="flex-none aspect-square p-0" 
              onClick={handleDeleteFile}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileCard;
