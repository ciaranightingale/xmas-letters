'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { stringToField, isValidAztecAddress } from '@/lib/aztec';

interface SendLetterFormProps {
  onSend: (recipientAddress: string, message: string) => Promise<void>;
}

export default function SendLetterForm({ onSend }: SendLetterFormProps) {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!recipient.trim()) {
      setError('Please enter a recipient address');
      return;
    }

    if (!isValidAztecAddress(recipient)) {
      setError('Invalid Aztec address');
      return;
    }

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    if (message.length > 31) {
      setError('Message too long (max 31 characters)');
      return;
    }

    setIsSending(true);
    try {
      await onSend(recipient, message);
      setRecipient('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send letter');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-christmas-gold max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-christmas-gold flex items-center justify-center gap-2">
        <span>🎅</span>
        Send a Secret Letter
        <span>🎁</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium mb-2 text-christmas-snow">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-christmas-gold/50 focus:border-christmas-gold outline-none text-white placeholder-white/50"
            disabled={isSending}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-christmas-snow">
            Your Secret Message (max 31 characters)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Merry Christmas! 🎄"
            rows={4}
            maxLength={31}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-christmas-gold/50 focus:border-christmas-gold outline-none text-white placeholder-white/50 resize-none"
            disabled={isSending}
          />
          <div className="text-right text-sm text-christmas-snow/70 mt-1">
            {message.length}/31 characters
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={isSending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-christmas-red to-red-700 hover:from-red-700 hover:to-christmas-red text-white font-bold py-4 px-8 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isSending ? (
            <>
              <span className="animate-spin">⏳</span>
              Sending...
            </>
          ) : (
            <>
              <span>📮</span>
              Send Letter
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
