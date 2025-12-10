'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeProps {
  message: string;
  onOpen?: () => void;
}

export default function Envelope({ message, onOpen }: EnvelopeProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && onOpen) {
      onOpen();
    }
  };

  return (
    <motion.div
      className="w-64 h-40 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of envelope */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-christmas-red to-red-700 rounded-lg shadow-2xl border-4 border-christmas-gold">
            {/* Envelope flap */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-800 to-christmas-red rounded-t-lg" />

            {/* Sealed with wax seal */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-christmas-gold rounded-full shadow-lg flex items-center justify-center z-10">
              <span className="text-2xl">🎄</span>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-4 right-4 text-christmas-gold opacity-60">
              <span className="text-3xl">❄️</span>
            </div>
            <div className="absolute top-4 left-4 text-christmas-gold opacity-60">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>

        {/* Back of envelope - letter content */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg shadow-2xl p-6 border-4 border-christmas-gold overflow-auto">
            <div className="h-full flex flex-col">
              <h3 className="text-christmas-green font-bold text-lg mb-3 text-center">
                🎅 Secret Message 🎅
              </h3>
              <div className="flex-1 overflow-auto">
                <p className="text-gray-800 text-sm whitespace-pre-wrap break-words font-serif">
                  {message}
                </p>
              </div>
              <div className="text-center text-xs text-gray-500 mt-3">
                From: Anonymous Santa 🎁
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
