'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

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
      className="w-80 h-52 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        {/* Front of envelope */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-christmas-cream to-[#EAE7DD] shadow-xl overflow-hidden">
            {/* Envelope flap - triangular shape */}
            <div className="absolute top-0 left-0 w-0 h-0 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent border-t-[80px] border-t-christmas-sage/20" />

            {/* Flap shadow/depth */}
            <div className="absolute top-0 left-1/2 w-0 h-0 -translate-x-1/2 border-l-[155px] border-l-transparent border-r-[155px] border-r-transparent border-t-[78px] border-t-[#D8D4C8]" />

            {/* Envelope body lines */}
            <div className="absolute left-0 right-0 top-20 h-px bg-christmas-sage/10" />

            {/* Address lines decoration */}
            <div className="absolute left-8 top-32 space-y-2">
              <div className="w-32 h-px bg-christmas-sage/15" />
              <div className="w-28 h-px bg-christmas-sage/15" />
              <div className="w-36 h-px bg-christmas-sage/15" />
            </div>

            {/* Wax seal - overlapping the flap */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 z-20">
              {/* Wax seal body with realistic texture */}
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#8B3A3A] via-[#6B2A2A] to-[#5B1A1A] shadow-2xl">
                {/* Wax drip irregularities */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-b from-[#6B2A2A] to-transparent opacity-40 blur-sm" />

                {/* Seal impression - pressed into wax */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#4A1515] shadow-inner flex items-center justify-center">
                    {/* Simple monogram "S" for Santa/Secret */}
                    <span className="text-[#6B2A2A] text-3xl font-serif italic" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>S</span>
                  </div>
                </div>

                {/* Wax shine highlights */}
                <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-white/20 blur-md" />
                <div className="absolute top-5 right-6 w-3 h-3 rounded-full bg-white/10 blur-sm" />

                {/* Edge irregularities */}
                <div className="absolute inset-0 rounded-full ring-1 ring-black/30" />
              </div>
            </div>

            {/* Envelope edges/shadows */}
            <div className="absolute inset-0 shadow-inner pointer-events-none" />
          </div>
        </div>

        {/* Back of envelope - letter content */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="w-full h-full bg-white shadow-xl p-8 border border-christmas-sage/20 overflow-auto">
            <div className="h-full flex flex-col">
              <div className="mb-5 pb-4 border-b border-christmas-sage/20">
                <p className="text-christmas-sage text-xs font-sans tracking-wider uppercase text-center">
                  Private Message
                </p>
              </div>
              <div className="flex-1 overflow-auto">
                <p className="text-christmas-charcoal text-lg leading-relaxed" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  {message}
                </p>
              </div>
              <div className="text-center text-xs text-christmas-sage font-sans mt-5 pt-4 border-t border-christmas-sage/10">
                — Anonymous
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
