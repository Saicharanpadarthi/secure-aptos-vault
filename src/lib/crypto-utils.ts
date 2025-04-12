
/**
 * Utility functions for encryption and decryption
 */

// Generate a random encryption key
export const generateEncryptionKey = async (): Promise<CryptoKey> => {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
};

// Export encryption key to base64 string for storage
export const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey("raw", key);
  return arrayBufferToBase64(exported);
};

// Import an encryption key from a base64 string
export const importKey = async (keyString: string): Promise<CryptoKey> => {
  const keyData = base64ToArrayBuffer(keyString);
  return await window.crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
};

// Encrypt a file
export const encryptFile = async (file: File, key: CryptoKey): Promise<{encryptedData: ArrayBuffer, iv: Uint8Array}> => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const arrayBuffer = await file.arrayBuffer();
  
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    arrayBuffer
  );
  
  return { encryptedData, iv };
};

// Decrypt a file
export const decryptFile = async (
  encryptedData: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array,
  fileName: string,
  mimeType: string
): Promise<File> => {
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encryptedData
  );
  
  return new File([decryptedData], fileName, { type: mimeType });
};

// Helper function to convert ArrayBuffer to Base64 string
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Helper function to convert Base64 string to ArrayBuffer
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};
