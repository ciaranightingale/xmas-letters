import { AztecAddress } from '@aztec/aztec.js/addresses';
import { XmasLetterboxContract, type XmasLetter } from '../../contracts/artifacts/XmasLetterbox';
import { getWallet, getDefaultAccount } from './wallet';
import { fieldToString, stringToField } from './aztec';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

let contractInstance: XmasLetterboxContract | null = null;

/**
 * Get the contract instance
 */
async function getContract(): Promise<XmasLetterboxContract> {
  if (contractInstance) {
    return contractInstance;
  }

  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local');
  }

  const wallet = await getWallet();
  const address = AztecAddress.fromString(CONTRACT_ADDRESS);
  contractInstance = await XmasLetterboxContract.at(address, wallet);

  return contractInstance;
}

/**
 * Send a letter to a recipient
 */
export async function sendLetter(
  recipientAddress: string,
  message: string
): Promise<void> {
  const contract = await getContract();
  const sender = await getDefaultAccount();

  // Convert message to Field
  const messageField = stringToField(message);
  const recipient = AztecAddress.fromString(recipientAddress);

  // Send the transaction
  const tx = await contract.methods
    .send_letter(recipient, messageField)
    .send({ from: sender });

  // Wait for transaction to be mined
  const receipt = await tx.wait();

  if (receipt.status !== 'success') {
    throw new Error('Transaction failed');
  }
}

/**
 * Fetch all letters for the current account
 */
export async function fetchLetters(): Promise<Array<{ message: string; blockNumber: number }>> {
  const contract = await getContract();
  const wallet = await getWallet();
  const account = await getDefaultAccount();

  try {
    // Get the latest block to determine scan range
    // For now, scan the last 1000 blocks
    const fromBlock = 0;
    const numBlocks = 1000;

    // Query encrypted events using the XmasLetter event metadata
    const events = await wallet.getPrivateEvents<XmasLetter>(
      contract.address,
      XmasLetterboxContract.events.XmasLetter,
      fromBlock,
      numBlocks,
      [account]
    );

    // Convert events to letter objects
    const letters = events.map((event) => {
      const message = fieldToString(event.message);
      return {
        message,
        blockNumber: 0, // Block number not available in event object
      };
    });

    return letters;
  } catch (error) {
    console.error('Failed to fetch letters:', error);
    return [];
  }
}

/**
 * Deploy a new contract instance
 * Only needed for initial setup
 */
export async function deployContract(): Promise<string> {
  // Note: Contract deployment requires a wallet instance with account management
  // This function is for reference only and won't work with the current browser PXE setup
  // In production, contracts should be deployed using the CLI or a server-side wallet
  throw new Error('Contract deployment not supported in browser. Please deploy using the Aztec CLI.');
}
