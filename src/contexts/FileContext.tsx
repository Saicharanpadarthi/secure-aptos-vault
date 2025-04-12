
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { FileMetadata, FileAccessKey } from '@/types';
import {
  generateEncryptionKey,
  encryptFile,
  decryptFile,
  exportKey,
  importKey,
  arrayBufferToBase64,
  base64ToArrayBuffer
} from '@/lib/crypto-utils';
import { useWallet } from './WalletContext';
import { v4 as uuidv4 } from 'uuid';

interface FileContextType {
  files: FileMetadata[];
  uploadingFiles: string[];
  uploadFile: (file: File) => Promise<void>;
  downloadFile: (fileId: string) => Promise<void>;
  shareFile: (fileId: string, recipientAddress: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
}

// Mock storage - in a real app, this would be a database or blockchain storage
const fileStore = new Map<string, Blob>();
const fileKeys = new Map<string, FileAccessKey>();

// Create context with default values
const FileContext = createContext<FileContextType>({
  files: [],
  uploadingFiles: [],
  uploadFile: async () => {},
  downloadFile: async () => {},
  shareFile: async () => {},
  deleteFile: async () => {},
});

export const useFiles = () => useContext(FileContext);

export const FileProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const { user } = useWallet();

  // Upload a file
  const uploadFile = async (file: File) => {
    if (!user.isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add file to uploading state
      setUploadingFiles(prev => [...prev, file.name]);
      
      // Generate a unique ID for the file
      const fileId = uuidv4();
      
      // Generate an encryption key
      const encryptionKey = await generateEncryptionKey();
      const exportedKey = await exportKey(encryptionKey);
      
      // Encrypt the file
      const { encryptedData, iv } = await encryptFile(file, encryptionKey);
      
      // Convert IV to base64 for storage
      const ivBase64 = arrayBufferToBase64(iv);
      
      // Create file metadata
      const metadata: FileMetadata = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        uploadDate: Date.now(),
        owner: user.address,
        sharedWith: [],
        iv: ivBase64
      };
      
      // Store encryption key
      const keyEntry: FileAccessKey = {
        fileId,
        encryptionKey: exportedKey,
        iv: ivBase64,
        accessGrantedTo: [user.address],
      };
      
      // In a real application, these would be stored in a database or on the blockchain
      fileStore.set(fileId, new Blob([encryptedData]));
      fileKeys.set(fileId, keyEntry);
      
      // Update files state
      setFiles(prev => [...prev, metadata]);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been encrypted and uploaded successfully`,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploadingFiles(prev => prev.filter(name => name !== file.name));
    }
  };

  // Download a file
  const downloadFile = async (fileId: string) => {
    if (!user.isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the file metadata
      const metadata = files.find(f => f.id === fileId);
      if (!metadata) {
        throw new Error("File not found");
      }

      // Check if user has access to the file
      const keyEntry = fileKeys.get(fileId);
      if (!keyEntry || !keyEntry.accessGrantedTo.includes(user.address)) {
        throw new Error("You don't have access to this file");
      }

      // Get the encrypted file data
      const encryptedBlob = fileStore.get(fileId);
      if (!encryptedBlob) {
        throw new Error("File data not found");
      }

      // Import the encryption key
      const encryptionKey = await importKey(keyEntry.encryptionKey);
      
      // Convert IV from base64
      const iv = new Uint8Array(base64ToArrayBuffer(metadata.iv));
      
      // Decrypt the file
      const encryptedData = await encryptedBlob.arrayBuffer();
      const decryptedFile = await decryptFile(
        encryptedData, 
        encryptionKey, 
        iv, 
        metadata.name, 
        metadata.type
      );
      
      // Create a download link
      const downloadUrl = URL.createObjectURL(decryptedFile);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = metadata.name;
      downloadLink.click();
      
      // Clean up
      URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "File Downloaded",
        description: `${metadata.name} has been decrypted and downloaded`,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download file",
        variant: "destructive",
      });
    }
  };

  // Share a file with another wallet address
  const shareFile = async (fileId: string, recipientAddress: string) => {
    if (!user.isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the file metadata
      const fileIndex = files.findIndex(f => f.id === fileId);
      if (fileIndex === -1) {
        throw new Error("File not found");
      }

      // Check if the user is the owner of the file
      if (files[fileIndex].owner !== user.address) {
        throw new Error("You can only share files you own");
      }

      // Check if the file is already shared with the recipient
      if (files[fileIndex].sharedWith.includes(recipientAddress)) {
        throw new Error("File already shared with this address");
      }

      // Update the key entry to grant access to the recipient
      const keyEntry = fileKeys.get(fileId);
      if (!keyEntry) {
        throw new Error("File key not found");
      }

      keyEntry.accessGrantedTo.push(recipientAddress);
      fileKeys.set(fileId, keyEntry);

      // Update the file metadata
      const updatedFiles = [...files];
      updatedFiles[fileIndex] = {
        ...updatedFiles[fileIndex],
        sharedWith: [...updatedFiles[fileIndex].sharedWith, recipientAddress],
      };
      setFiles(updatedFiles);
      
      toast({
        title: "File Shared",
        description: `${files[fileIndex].name} has been shared with ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(recipientAddress.length - 4)}`,
      });
    } catch (error) {
      console.error("Error sharing file:", error);
      toast({
        title: "Sharing Failed",
        description: error instanceof Error ? error.message : "Failed to share file",
        variant: "destructive",
      });
    }
  };

  // Delete a file
  const deleteFile = async (fileId: string) => {
    if (!user.isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the file metadata
      const fileIndex = files.findIndex(f => f.id === fileId);
      if (fileIndex === -1) {
        throw new Error("File not found");
      }

      // Check if the user is the owner of the file
      if (files[fileIndex].owner !== user.address) {
        throw new Error("You can only delete files you own");
      }

      // Remove the file and its key
      fileStore.delete(fileId);
      fileKeys.delete(fileId);

      // Update the file list
      const updatedFiles = files.filter(f => f.id !== fileId);
      setFiles(updatedFiles);
      
      toast({
        title: "File Deleted",
        description: `${files[fileIndex].name} has been deleted`,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  return (
    <FileContext.Provider value={{ 
      files, 
      uploadingFiles,
      uploadFile, 
      downloadFile, 
      shareFile,
      deleteFile
    }}>
      {children}
    </FileContext.Provider>
  );
};
