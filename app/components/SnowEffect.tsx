'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    const flakes = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 15 + Math.random() * 15,
      size: 0.3 + Math.random() * 0.7,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute text-christmas-sage/20"
          style={{ fontSize: `${flake.size}rem` }}
          initial={{ top: '-20px', left: `${flake.left}%` }}
          animate={{
            top: '100vh',
            left: `${flake.left + (Math.random() - 0.5) * 5}%`,
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ❄
        </motion.div>
      ))}
    </div>
  );
}
