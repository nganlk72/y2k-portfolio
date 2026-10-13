import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playStartupChime } from '../utils/soundEffects';

export default function StartScreen({ onStart }) {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const i = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(i);
  }, []);

  const handleStart = () => {
    playStartupChime();
    onStart();
  };

  return (
    <div 
      className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden cursor-pointer" 
      onClick={handleStart}
    >
      {/* Glitchy background grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#ff00ff 1px, transparent 1px), linear-gradient(90deg, #ff00ff 1px, transparent 1px)', 
          backgroundSize: '40px 40px', 
          transform: 'perspective(500px) rotateX(60deg) translateY(100px)', 
          animation: 'scroll 2s linear infinite' 
        }} 
      />
      
      <style>{`
        @keyframes scroll { from { background-position: 0 0; } to { background-position: 0 40px; } }
        .text-glow { text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff; }
      `}</style>

      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-pixel text-4xl sm:text-6xl md:text-7xl text-y2k-pink mb-3 text-glow text-center"
      >
        LE KIM NGAN
      </motion.h1>
      
      <h2 className="font-pixel text-sm sm:text-base md:text-xl text-cyan-300 mb-16 tracking-widest text-center px-4">
        WINDOWS 98 PORTFOLIO EDITION
      </h2>

      <button 
        className={`font-pixel text-xl sm:text-2xl text-y2k-green transition-opacity ${blink ? 'opacity-100' : 'opacity-0'} hover:text-white drop-shadow-[0_0_8px_rgba(0,255,0,0.8)] cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
          handleStart();
        }}
      >
        &gt; PRESS START &lt;
      </button>

      <div className="absolute bottom-4 font-pixel text-[11px] text-gray-400">
        © 1998–2026 FTU ECONOMICS &bull; T1 DIE-HARD
      </div>
    </div>
  );
}
