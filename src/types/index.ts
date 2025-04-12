
export interface User {
  address: string;
  isConnected: boolean;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  uploadDate: number;
  encryptionKeyId?: string;
  owner: string;
  sharedWith: string[];
  iv: string; // Initialization vector for decryption
}

export interface EncryptedFile {
  metadata: FileMetadata;
  data: ArrayBuffer;
}

export interface FileAccessKey {
  fileId: string;
  encryptionKey: string;
  iv: string;
  accessGrantedTo: string[];
}
