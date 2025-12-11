import { describe, it, beforeAll, expect } from '@jest/globals';
import { Fr } from '@aztec/aztec.js/fields';
import { AztecAddress } from '@aztec/aztec.js/addresses';
import { createAztecNodeClient, waitForNode } from '@aztec/aztec.js/node';
import { createLogger } from '@aztec/aztec.js/log';
import { TestWallet, registerInitialSandboxAccountsInWallet } from '@aztec/test-wallet/server';
import { XmasLetterboxContract, type XmasLetter } from '../artifacts/XmasLetterbox.js';

const NODE_URL = process.env.NODE_URL || 'http://localhost:8080';
const TIMEOUT = 120_000;

describe('XmasLetterbox E2E Tests', () => {
  let wallet: TestWallet;
  let accounts: AztecAddress[];
  let alice: AztecAddress;
  let bob: AztecAddress;
  let contract: XmasLetterboxContract;
  let logger: ReturnType<typeof createLogger>;

  beforeAll(async () => {
    logger = createLogger('e2e:xmas-letter');

    // Connect to Aztec node
    const node = createAztecNodeClient(NODE_URL);
    await waitForNode(node, logger);
    logger.info('Connected to Aztec node');

    // Create wallet and register sandbox accounts
    wallet = await TestWallet.create(node);
    accounts = await registerInitialSandboxAccountsInWallet(wallet);

    alice = accounts[0];
    bob = accounts[1];

    logger.info(`Alice address: ${alice}`);
    logger.info(`Bob address: ${bob}`);

    // Deploy contract
    logger.info('Deploying XmasLetterbox contract...');
    contract = await XmasLetterboxContract.deploy(wallet)
      .send({ from: alice })
      .deployed();
    logger.info(`Contract deployed at: ${contract.address}`);
  }, TIMEOUT);

  it('should send an encrypted letter and recipient should be able to decrypt it', async () => {
    // Alice sends a secret message to Bob
    const secretMessage = Fr.random();
    logger.info(`Sending letter with message: ${secretMessage}`);

    const tx = await contract.methods
      .send_letter(bob, secretMessage)
      .send({ from: alice })
      .wait();

    logger.info(`Transaction mined in block ${tx.blockNumber}`);
    expect(tx.status).toBe('success');

    // Bob's PXE scans for encrypted events addressed to him
    const events = await wallet.getPrivateEvents<XmasLetter>(
      contract.address,
      XmasLetterboxContract.events.XmasLetter,
      tx.blockNumber as number,
      1,
      [bob]
    );

    // Verify Bob received the encrypted letter
    expect(events.length).toBeGreaterThan(0);
    const receivedEvent = events[0];
    expect(receivedEvent.message).toEqual(secretMessage.toBigInt());
    logger.info(`Bob successfully decrypted message: ${receivedEvent.message}`);
  }, TIMEOUT);

  it('should not allow Alice to decrypt messages sent to Bob', async () => {
    // Alice sends a secret message to Bob
    const secretMessage = Fr.random();

    const tx = await contract.methods
      .send_letter(bob, secretMessage)
      .send({ from: alice })
      .wait();

    // Alice tries to read events but should not be able to decrypt them
    const aliceEvents = await wallet.getPrivateEvents<XmasLetter>(
      contract.address,
      XmasLetterboxContract.events.XmasLetter,
      tx.blockNumber as number,
      1,
      [alice]
    );

    // Alice should not see the event since it was encrypted for Bob
    expect(aliceEvents.length).toBe(0);
    logger.info('Alice correctly cannot decrypt messages sent to Bob');
  }, TIMEOUT);

  it('should allow multiple letters to be sent and retrieved', async () => {
    const messages = [Fr.random(), Fr.random(), Fr.random()];

    // Send multiple letters
    const txs = await Promise.all(
      messages.map(msg =>
        contract.methods
          .send_letter(bob, msg)
          .send({ from: alice })
          .wait()
      )
    );

    const blockNumbers = txs.map((tx: any) => tx.blockNumber);
    const firstBlock = Math.min(...blockNumbers) as number;

    // Bob retrieves all his letters (limit of 10 to capture all 3)
    const events = await wallet.getPrivateEvents<XmasLetter>(
      contract.address,
      XmasLetterboxContract.events.XmasLetter,
      firstBlock,
      10,
      [bob]
    );

    expect(events.length).toBe(3);
    const receivedMessages = events.map((e: XmasLetter) => e.message);
    messages.forEach(msg => {
      expect(receivedMessages).toContainEqual(msg.toBigInt());
    });
    logger.info(`Bob successfully retrieved ${events.length} encrypted letters`);
  }, TIMEOUT);
});
