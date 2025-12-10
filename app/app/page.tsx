'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SendLetterForm from '@/components/SendLetterForm';
import LetterInbox from '@/components/LetterInbox';
import SnowEffect from '@/components/SnowEffect';

interface Letter {
  message: string;
  blockNumber: number;
}

// Mock data for styling demo
const mockLetters: Letter[] = [
  { message: "Ho ho ho! Merry Christmas! 🎅", blockNumber: 123 },
  { message: "Wishing you joy and happiness this holiday season! 🎄", blockNumber: 124 },
  { message: "Secret Santa says: You've been very good this year! 🎁", blockNumber: 125 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'send'>('inbox');
  const [letters] = useState<Letter[]>(mockLetters);
  const [isLoading] = useState(false);

  const sendLetter = async (recipientAddress: string, message: string) => {
    console.log('Sending letter to:', recipientAddress, 'Message:', message);
    alert('Letter sent successfully! 🎄');
  };

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
        </motion.div>

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
      </div>
    </main>
  );
}
