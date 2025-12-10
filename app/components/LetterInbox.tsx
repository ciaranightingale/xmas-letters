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
      <div className="text-center py-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="inline-block text-5xl mb-6 text-christmas-sage"
        >
          ✦
        </motion.div>
        <p className="text-lg text-christmas-sage font-sans">Retrieving messages...</p>
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-24 bg-white/50 backdrop-blur-sm p-16 border border-christmas-sage/20"
      >
        <div className="text-6xl mb-6 text-christmas-sage/40">✉</div>
        <h3 className="text-2xl font-light text-christmas-forest mb-3">
          No Messages Yet
        </h3>
        <p className="text-christmas-sage font-sans text-sm leading-relaxed max-w-md mx-auto">
          Your inbox is empty. Share your address to receive<br />
          private holiday greetings from friends.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center mb-10">
        <p className="text-christmas-sage font-sans text-sm tracking-wide">
          {letters.length === 1
            ? 'You have 1 private message'
            : `You have ${letters.length} private messages`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
        {letters.map((letter, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, ease: 'easeOut' }}
          >
            <Envelope message={letter.message} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
