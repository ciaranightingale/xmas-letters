import { type AztecNode, createAztecNodeClient } from '@aztec/aztec.js/node';
import { TestWallet } from '@aztec/test-wallet/client/lazy';
import type { Wallet } from '@aztec/aztec.js/wallet';
import { AztecAddress } from '@aztec/aztec.js/addresses';

const NODE_URL = process.env.NEXT_PUBLIC_AZTEC_NODE_URL || 'https://api.aztec.network/aztec-node/3.0.0-devnet.5';

let walletInstance: Wallet | null = null;
let aztecNodeInstance: AztecNode | null = null;

/**
 * Initialize the Aztec Node client
 */
async function getAztecNode(): Promise<AztecNode> {
  if (aztecNodeInstance) {
    return aztecNodeInstance;
  }

  aztecNodeInstance = createAztecNodeClient(NODE_URL);
  return aztecNodeInstance;
}

/**
 * Initialize and get the Wallet
 * TestWallet internally creates a PXE with IndexedDB storage
 */
export async function getWallet(): Promise<Wallet> {
  if (walletInstance) {
    return walletInstance;
  }

  const aztecNode = await getAztecNode();

  // TestWallet.create() internally creates a PXE with proper browser storage
  walletInstance = await TestWallet.create(aztecNode);

  return walletInstance;
}

/**
 * Get registered accounts from the wallet
 */
export async function getAccounts(): Promise<AztecAddress[]> {
  const wallet = await getWallet();
  const accounts = await wallet.getAccounts();
  return accounts.map(acc => acc.item);
}

/**
 * Get the first account (default account)
 */
export async function getDefaultAccount(): Promise<AztecAddress> {
  const accounts = await getAccounts();
  if (accounts.length === 0) {
    throw new Error('No accounts registered. Please register an account with the wallet first.');
  }
  return accounts[0];
}
