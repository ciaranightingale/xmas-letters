'use client';

import { motion } from 'framer-motion';
import Envelope from './Envelope';

interface Letter {
  message: string;
  blockNumber: number;
}

interface LetterInboxProps {
  letters: Letter[];
  isLoading: boolean;
}

export default function LetterInbox({ letters, isLoading }: LetterInboxProps) {
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block text-6xl mb-4"
        >
          🎄
        </motion.div>
        <p className="text-xl text-christmas-snow">Loading your letters...</p>
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-white/10 backdrop-blur-md rounded-2xl p-12 border-2 border-dashed border-christmas-gold/50"
      >
        <div className="text-8xl mb-6">📪</div>
        <h3 className="text-2xl font-bold text-christmas-gold mb-4">
          No Letters Yet
        </h3>
        <p className="text-christmas-snow/80">
          You haven&apos;t received any secret letters yet.
          <br />
          Share your address with friends to receive anonymous messages!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-christmas-gold mb-2">
          🎁 Your Secret Letters 🎁
        </h2>
        <p className="text-christmas-snow/80">
          {letters.length === 1
            ? 'You have 1 secret letter'
            : `You have ${letters.length} secret letters`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {letters.map((letter, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Envelope message={letter.message} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
