'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SendLetterForm from '@/components/SendLetterForm';
import LetterInbox from '@/components/LetterInbox';
import SnowEffect from '@/components/SnowEffect';
import { sendLetter as sendLetterToContract, fetchLetters as fetchLettersFromContract } from '@/lib/contract';
import { getWallet, getDefaultAccount } from '@/lib/wallet';

interface Letter {
  message: string;
  blockNumber: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'send'>('inbox');
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      await getWallet();
      const account = await getDefaultAccount();
      if (account) {
        setWalletAddress(account.toString());
        setIsConnected(true);
      }
    } catch (err) {
      console.error('Wallet connection check failed:', err);
      setIsConnected(false);
    }
  };

  const connectWallet = async () => {
    setError('');
    try {
      await getWallet();
      const account = await getDefaultAccount();
      setWalletAddress(account.toString());
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };

  const fetchLetters = async () => {
    if (!isConnected) return;

    setIsLoading(true);
    setError('');
    try {
      const fetchedLetters = await fetchLettersFromContract();
      setLetters(fetchedLetters);
    } catch (error) {
      console.error('Failed to fetch letters:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch letters');
    } finally {
      setIsLoading(false);
    }
  };

  const sendLetter = async (recipientAddress: string, message: string) => {
    setError('');
    try {
      await sendLetterToContract(recipientAddress, message);
      alert('Letter sent successfully! 🎄');
    } catch (error) {
      console.error('Failed to send letter:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (activeTab === 'inbox' && isConnected) {
      fetchLetters();
    }
  }, [activeTab, isConnected]);

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-christmas-cream via-white to-christmas-silver/20">
      <SnowEffect />

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-5xl">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-christmas-forest to-transparent opacity-30" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="mb-4 flex justify-center items-center gap-4">
            <div className="h-px w-16 bg-christmas-sage" />
            <span className="text-christmas-sage text-sm tracking-[0.3em] uppercase font-sans">Private Messages</span>
            <div className="h-px w-16 bg-christmas-sage" />
          </div>

          <h1 className="text-6xl md:text-7xl font-light mb-3 text-christmas-forest tracking-tight">
            Secret Santa
          </h1>
          <p className="text-lg text-christmas-sage font-sans font-light tracking-wide">
            Encrypted holiday greetings on Aztec
          </p>

          {/* Wallet Connection */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-christmas-burgundy/10 border border-christmas-burgundy/30 text-christmas-burgundy px-4 py-3 text-sm font-sans mt-6 max-w-2xl mx-auto"
            >
              {error}
            </motion.div>
          )}

          {!isConnected ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={connectWallet}
              className="mt-8 bg-christmas-forest hover:bg-christmas-forest/90 text-christmas-cream font-sans text-sm tracking-wide py-3 px-10 shadow-md"
            >
              Connect to Devnet
            </motion.button>
          ) : (
            <div className="text-xs text-christmas-sage font-sans mt-6">
              Connected: {walletAddress ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(-8)}` : 'Wallet'}
            </div>
          )}
        </motion.div>

        {isConnected && (
          <>
            {/* Tab Navigation */}
            <div className="flex justify-center gap-2 mb-16">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('inbox')}
                className={`px-10 py-3 font-sans text-sm tracking-wide transition-all border ${
                  activeTab === 'inbox'
                    ? 'bg-christmas-forest text-christmas-cream border-christmas-forest'
                    : 'bg-transparent text-christmas-charcoal border-christmas-sage/30 hover:border-christmas-sage'
                }`}
              >
                Inbox
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('send')}
                className={`px-10 py-3 font-sans text-sm tracking-wide transition-all border ${
                  activeTab === 'send'
                    ? 'bg-christmas-forest text-christmas-cream border-christmas-forest'
                    : 'bg-transparent text-christmas-charcoal border-christmas-sage/30 hover:border-christmas-sage'
                }`}
              >
                Compose
              </motion.button>
            </div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {activeTab === 'inbox' ? (
                <LetterInbox letters={letters} isLoading={isLoading} />
              ) : (
                <SendLetterForm onSend={sendLetter} />
              )}
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
