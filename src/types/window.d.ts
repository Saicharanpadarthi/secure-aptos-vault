
interface MartianWallet {
  connect: () => Promise<{address: string}>;
  disconnect: () => Promise<void>;
  isConnected: () => Promise<boolean>;
  signMessage: (options: {message: string; nonce?: string}) => Promise<{signature: string}>;
  account: () => Promise<{address: string}>;
}

interface Window {
  martian?: MartianWallet;
}
