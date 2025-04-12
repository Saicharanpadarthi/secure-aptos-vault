
// Types
export type WalletProvider = {
  connect: () => Promise<{address: string}>;
  disconnect: () => Promise<void>;
  isConnected: () => Promise<boolean>;
  signMessage: (message: string) => Promise<{signature: string}>;
  isInstalled: () => boolean;
};

// Error class for wallet operations
export class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WalletError";
  }
}

// Check if the Martian wallet is installed
export const isMartianWalletInstalled = (): boolean => {
  return window.martian !== undefined;
};

// Connect to Martian wallet
export const connectMartianWallet = async (): Promise<string> => {
  try {
    if (!isMartianWalletInstalled()) {
      throw new WalletError("Martian wallet is not installed");
    }
    
    const response = await window.martian.connect();
    return response.address;
  } catch (error) {
    console.error("Failed to connect to Martian wallet:", error);
    throw new WalletError(
      error instanceof Error ? error.message : "Failed to connect to wallet"
    );
  }
};

// Disconnect from Martian wallet
export const disconnectMartianWallet = async (): Promise<void> => {
  try {
    if (!isMartianWalletInstalled()) {
      throw new WalletError("Martian wallet is not installed");
    }
    
    await window.martian.disconnect();
  } catch (error) {
    console.error("Failed to disconnect from Martian wallet:", error);
    throw new WalletError(
      error instanceof Error ? error.message : "Failed to disconnect from wallet"
    );
  }
};

// Check if Martian wallet is connected
export const isMartianWalletConnected = async (): Promise<boolean> => {
  try {
    if (!isMartianWalletInstalled()) {
      return false;
    }
    
    return await window.martian.isConnected();
  } catch (error) {
    console.error("Failed to check Martian wallet connection:", error);
    return false;
  }
};

// Sign a message with Martian wallet
export const signMessageWithMartianWallet = async (message: string): Promise<string> => {
  try {
    if (!isMartianWalletInstalled()) {
      throw new WalletError("Martian wallet is not installed");
    }
    
    const response = await window.martian.signMessage({
      message,
      nonce: "Secure Aptos Vault Authentication"
    });
    
    return response.signature;
  } catch (error) {
    console.error("Failed to sign message with Martian wallet:", error);
    throw new WalletError(
      error instanceof Error ? error.message : "Failed to sign message"
    );
  }
};

// Get Martian wallet address
export const getMartianWalletAddress = async (): Promise<string> => {
  try {
    if (!isMartianWalletInstalled()) {
      throw new WalletError("Martian wallet is not installed");
    }
    
    const account = await window.martian.account();
    return account.address;
  } catch (error) {
    console.error("Failed to get Martian wallet address:", error);
    throw new WalletError(
      error instanceof Error ? error.message : "Failed to get wallet address"
    );
  }
};
