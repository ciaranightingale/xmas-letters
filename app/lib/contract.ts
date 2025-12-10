import { AztecAddress } from '@aztec/aztec.js';
import { Fr } from '@aztec/aztec.js';
import { XmasLetterboxContract, type XmasLetter } from '@/artifacts/XmasLetterbox';
import { getPXE, getDefaultAccount, type PrivateEvent } from './wallet';
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

  const pxe = await getPXE();
  const address = AztecAddress.fromString(CONTRACT_ADDRESS);
  contractInstance = await XmasLetterboxContract.at(address, pxe);

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
  const wallet = await getWallet();
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
  const pxe = await getPXE();
  const account = await getDefaultAccount();

  // Get all private events for this account
  const events = await pxe.getIncomingNotes({
    owner: account,
    contractAddress: contract.address,
  });

  // TODO: Parse events properly based on devnet.5 API
  // For now, return empty array until we understand the new API
  console.log('Fetched events:', events);
  return [];
}

/**
 * Deploy a new contract instance
 * Only needed for initial setup
 */
export async function deployContract(): Promise<string> {
  const pxe = await getPXE();
  const deployer = await getDefaultAccount();

  const contract = await XmasLetterboxContract.deploy(pxe)
    .send({ from: deployer })
    .deployed();

  return contract.address.toString();
}
