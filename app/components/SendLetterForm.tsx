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
      className="bg-white/50 backdrop-blur-sm p-10 shadow-lg border border-christmas-sage/20 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="mb-3 flex justify-center items-center gap-3">
          <div className="h-px w-12 bg-christmas-sage/30" />
          <span className="text-christmas-sage text-xs tracking-[0.3em] uppercase font-sans">Compose</span>
          <div className="h-px w-12 bg-christmas-sage/30" />
        </div>
        <h2 className="text-2xl font-light text-christmas-forest">
          Send a Private Message
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="recipient" className="block text-sm font-sans tracking-wide mb-2 text-christmas-charcoal">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-white border border-christmas-sage/30 focus:border-christmas-forest outline-none text-christmas-charcoal placeholder-christmas-sage/40 font-mono text-sm"
            disabled={isSending}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-sans tracking-wide mb-2 text-christmas-charcoal">
            Your Message <span className="text-christmas-sage text-xs">(max 31 characters)</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Warm wishes for the holidays..."
            rows={5}
            maxLength={31}
            className="w-full px-4 py-3 bg-white border border-christmas-sage/30 focus:border-christmas-forest outline-none text-christmas-charcoal placeholder-christmas-sage/40 resize-none font-serif leading-relaxed"
            disabled={isSending}
          />
          <div className="text-right text-xs text-christmas-sage font-sans mt-1">
            {message.length}/31
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-christmas-burgundy/10 border border-christmas-burgundy/30 text-christmas-burgundy px-4 py-3 text-sm font-sans"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={isSending}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-christmas-forest hover:bg-christmas-forest/90 text-christmas-cream font-sans text-sm tracking-wide py-4 px-8 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSending ? 'Sending...' : 'Send Message'}
        </motion.button>
      </form>
    </motion.div>
  );
}
