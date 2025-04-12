
import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useFiles } from '@/contexts/FileContext';
import { useWallet } from '@/contexts/WalletContext';
import { cn } from '@/lib/utils';

const FileUploadCard: React.FC = () => {
  const { uploadFile, uploadingFiles } = useFiles();
  const { user } = useWallet();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (!user.isConnected || !e.dataTransfer.files.length) return;

    const file = e.dataTransfer.files[0];
    uploadFile(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!user.isConnected || !e.target.files?.length) return;

    const file = e.target.files[0];
    uploadFile(file);

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className={cn(
      "crypto-card transition-all duration-300 mb-8",
      isDragging ? "border-aptos border-2" : "",
      !user.isConnected ? "opacity-70" : ""
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-aptos" />
          Upload Files
        </CardTitle>
        <CardDescription>
          Upload files to encrypt and store securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200",
            isDragging ? "bg-secondary/70 border-aptos" : "border-muted hover:border-aptos/50",
            !user.isConnected ? "pointer-events-none" : ""
          )}
          onClick={handleButtonClick}
        >
          {uploadingFiles.length > 0 ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-aptos animate-spin" />
              <p className="text-muted-foreground">Encrypting and uploading...</p>
            </div>
          ) : (
            <>
              <FileText className="h-10 w-10 mb-4 text-aptos" />
              <h3 className="font-medium mb-1">Drop your file here or click to browse</h3>
              <p className="text-muted-foreground">Support for any file type</p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
                disabled={!user.isConnected}
              />
              
              <Button 
                className="mt-4 bg-aptos hover:bg-aptos-hover"
                disabled={!user.isConnected || uploadingFiles.length > 0}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
