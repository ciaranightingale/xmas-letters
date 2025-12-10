import { createPXEClient, waitForPXE } from '@aztec/aztec.js';
import type { PXE } from '@aztec/aztec.js';
import { AztecAddress } from '@aztec/aztec.js';
import type { PrivateEvent } from '@aztec/aztec.js';

const PXE_URL = process.env.NEXT_PUBLIC_AZTEC_NODE_URL || 'https://api.aztec.network/aztec-pxe/3.0.0-devnet.5';

let pxeInstance: PXE | null = null;

/**
 * Initialize and get the PXE client
 */
export async function getPXE(): Promise<PXE> {
  if (pxeInstance) {
    return pxeInstance;
  }

  pxeInstance = createPXEClient(PXE_URL);
  await waitForPXE(pxeInstance);

  return pxeInstance;
}

/**
 * Get registered accounts from PXE
 */
export async function getAccounts(): Promise<AztecAddress[]> {
  const pxe = await getPXE();
  const accounts = await pxe.getRegisteredAccounts();
  return accounts.map(acc => acc.address);
}

/**
 * Get the first account (default account)
 */
export async function getDefaultAccount(): Promise<AztecAddress> {
  const accounts = await getAccounts();
  if (accounts.length === 0) {
    throw new Error('No accounts registered. Please register an account with the PXE first.');
  }
  return accounts[0];
}

/**
 * Register a new account with the PXE
 * This would be called when user connects their wallet
 */
export async function registerAccount(secretKey: string, accountContract: any): Promise<AztecAddress> {
  const pxe = await getPXE();
  // TODO: Implement account registration
  // This depends on how users connect (browser wallet, etc.)
  throw new Error('Account registration not yet implemented');
}

export { type PrivateEvent };
