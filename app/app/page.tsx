'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SendLetterForm from '@/components/SendLetterForm';
import LetterInbox from '@/components/LetterInbox';
import SnowEffect from '@/components/SnowEffect';
import { sendLetter as sendLetterToContract, fetchLetters as fetchLettersFromContract } from '@/lib/contract';
import { getPXE, getDefaultAccount } from '@/lib/wallet';

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
    // Check if wallet is connected
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      await getPXE();
      const accounts = await getDefaultAccount();
      if (accounts) {
        setIsConnected(true);
      }
    } catch (err) {
      console.error('PXE connection check failed:', err);
      setIsConnected(false);
    }
  };

  const connectWallet = async () => {
    setError('');
    try {
      await getPXE();
      const account = await getDefaultAccount();
      setWalletAddress(account.toString());
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to PXE:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect to PXE');
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
    <main className="min-h-screen relative overflow-hidden">
      <SnowEffect />

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              Secret Santa Letters
            </span>
          </h1>
          <p className="text-xl text-christmas-snow/80 mb-8">
            Send anonymous encrypted messages on Aztec 🎄
          </p>

          {/* Wallet Connection */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 max-w-2xl mx-auto"
            >
              {error}
            </motion.div>
          )}

          {!isConnected ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              className="bg-gradient-to-r from-christmas-green to-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg"
            >
              Connect Wallet 🔗
            </motion.button>
          ) : (
            <div className="text-sm text-christmas-snow/60">
              Connected: {walletAddress ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}` : 'Wallet'}
            </div>
          )}
        </motion.div>

        {isConnected && (
          <>
            {/* Tab Navigation */}
            <div className="flex justify-center gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('inbox')}
                className={`px-8 py-3 rounded-lg font-bold transition-all ${
                  activeTab === 'inbox'
                    ? 'bg-christmas-gold text-gray-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                📬 My Letters
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('send')}
                className={`px-8 py-3 rounded-lg font-bold transition-all ${
                  activeTab === 'send'
                    ? 'bg-christmas-gold text-gray-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                ✍️ Send Letter
              </motion.button>
            </div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'inbox' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
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
