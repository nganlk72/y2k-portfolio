import React from 'react';
import { X, Minus, Square } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Window({ title, children, onClose, defaultPosition = { x: 0, y: 0 }, width = "w-[400px]" }) {
  return (
    <motion.div 
      drag 
      dragMomentum={false}
      initial={defaultPosition}
      className={`absolute ${width} bg-win-gray border-2 border-white shadow-win-out text-black flex flex-col z-10`}
      style={{ outline: '1px solid black' }}
    >
      {/* Title Bar */}
      <div className="bg-win-blue text-white flex justify-between items-center px-1 py-1 cursor-move select-none">
        <span className="font-bold text-sm ml-1 tracking-wider">{title}</span>
        <div className="flex gap-1">
          <button className="bg-win-gray text-black w-4 h-4 flex items-center justify-center shadow-win-out active:shadow-win-in">
            <Minus size={12} />
          </button>
          <button className="bg-win-gray text-black w-4 h-4 flex items-center justify-center shadow-win-out active:shadow-win-in">
            <Square size={10} />
          </button>
          <button onClick={onClose} className="bg-win-gray text-black w-4 h-4 flex items-center justify-center shadow-win-out active:shadow-win-in">
            <X size={12} strokeWidth={3} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-2 grow overflow-auto bg-white m-[2px] shadow-win-in h-full">
        {children}
      </div>
    </motion.div>
  );
}
